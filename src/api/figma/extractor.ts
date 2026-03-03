import { FigmaAPIClient } from './client';
import { FIGMA_CONFIG } from './config';
import { findMappingByFigmaName, findMappingByType, findMappingKeyByFigmaName, COMPONENT_MAPPINGS } from './component-mappings';
import { VariableMappingManager, getSpacingTokenFromPx } from './variable-mapping';
import {
    FigmaNode,
    FigmaComponent,
    PageDesignConfig,
    ComponentDesignConfig,
    ComponentVariant,
    LayoutConfig,
    ThemeConfig,
    TypographyConfig,
} from './types';

export class FigmaDesignExtractor {
    private client: FigmaAPIClient;
    private token: string; // 토큰 저장
    private fileKey?: string; // 현재 작업 중인 파일 키
    private componentInfo: Map<string, FigmaComponent> = new Map(); // 컴포넌트 정보 캐시
    private styleInfo: Map<string, unknown> = new Map(); // 스타일 정보 캐시
    private variableInfo: Map<string, unknown> = new Map(); // 변수 정보 캐시
    private variableMappingManager: VariableMappingManager; // 변수 매핑 매니저
    /** 페이지 한 번 파싱 시 아이콘 노드 ID → 아이콘 이름 캐시 (getFileNodes 호출 수 감소) */
    private iconNodeNameCache: Map<string, string> = new Map();

    constructor(token: string) {
        this.client = new FigmaAPIClient(token);
        this.token = token; // 토큰 저장
        this.variableMappingManager = new VariableMappingManager(token);
        this.initializeAsync();
    }

    /**
     * 특정 노드 가져오기 (swap된 컴포넌트용)
     * @param nodeId 노드 ID
     * @returns Figma 노드
     */
    private async getFileNodes(nodeId: string): Promise<FigmaNode | null> {
        if (!this.fileKey) return null;

        try {
            const response = await this.client.getFileNodes(this.fileKey, [nodeId]);
            if (response.nodes && response.nodes[nodeId]) {
                return response.nodes[nodeId].document;
            }
        } catch (error) {
            console.log(`⚠️ Failed to get node ${nodeId}: ${error}`);
        }
        return null;
    }

    /**
     * 비동기 초기화 (변수 매핑 로드)
     */
    private async initializeAsync(): Promise<void> {
        await this.loadVariableMappings(); // 변수 매핑 로드
    }

    /**
     * 변수 매핑 로드 ($themes.json에서 자동 로드)
     */
    private async loadVariableMappings(): Promise<void> {
        try {
            // 라이브러리 파일 변수 로드 ($themes.json에서)
            await this.variableMappingManager.loadFileMappings(
                FIGMA_CONFIG.files.library,
                'library'
            );

            // 플랫폼 파일 변수 로드
            await this.variableMappingManager.loadFileMappings(
                FIGMA_CONFIG.files.platform,
                'platform'
            );

            console.log('✅ 변수 매핑 로드 완료');
        } catch (error) {
            console.warn('⚠️ 변수 매핑 로드 실패:', error);
        }
    }

    /**
     * 변수 정보 로드 (진실 소스만 사용)
     * @param fileKey 피그마 파일 키
     */
    private async loadVariableInfo(fileKey: string): Promise<void> {
        try {
            // 1차: Variables API로 실제 변수 정보 가져오기
            const variablesData = await this.client.getFileVariables(fileKey);

            if (variablesData.meta && variablesData.meta.variables && Object.keys(variablesData.meta.variables).length > 0) {
                for (const [variableId, variable] of Object.entries(variablesData.meta.variables)) {
                    this.variableInfo.set(variableId, variable);
                }
                console.log(`✅ 변수 로드 완료: ${this.variableInfo.size}개`);
                return;
            }
        } catch (error) {
            console.warn('⚠️  Variables API 실패');
        }

        // 2차: 파일 메타데이터에서 실제 변수 정보 추출
        try {
            const fileData = await this.client.getFile(fileKey);
            if (fileData.document) {
                this.extractRealVariablesFromDocument(fileData.document);
            }
        } catch (error) {
            console.warn('⚠️ 파일에서 변수 추출 실패');
        }

        // 3차: 스타일 정보에서 변수 정보 추출
        try {
            await this.extractVariablesFromStyles();
        } catch (error) {
            console.warn('⚠️ 스타일에서 변수 추출 실패');
        }
    }

    /**
     * 문서에서 실제 변수 정보 추출 (진실 소스)
     * @param document 피그마 문서
     */
    private extractRealVariablesFromDocument(document: unknown): void {
        const foundVariables = new Set<string>();

        // 문서를 재귀적으로 탐색하여 실제 변수 정보 추출
        const extractFromNode = (node: unknown) => {
            if (node && typeof node === 'object' && 'boundVariables' in node) {
                const nodeObj = node as { boundVariables: Record<string, unknown> };
                for (const [, variableRef] of Object.entries(nodeObj.boundVariables)) {
                    if (variableRef && typeof variableRef === 'object' && 'id' in variableRef) {
                        const variableId = (variableRef as { id: string }).id;
                        foundVariables.add(variableId);

                        // 실제 변수명을 피그마에서 추출 (추측하지 않음)
                        const realVariableName = this.extractRealVariableNameFromNode(node);
                        if (realVariableName) {
                            this.variableInfo.set(variableId, { name: realVariableName });
                        }
                    }
                }
            }

            if (node && typeof node === 'object' && 'children' in node) {
                const nodeObj = node as { children: unknown[] };
                nodeObj.children.forEach(extractFromNode);
            }
        };

        extractFromNode(document);

        // 변수 추출 완료 (무음)
    }

    /**
     * 스타일 정보에서 변수 정보 추출 (개선된 버전)
     */
    private async extractVariablesFromStyles(): Promise<void> {
        try {
            for (const [styleId, style] of this.styleInfo.entries()) {
                const styleObj = style as { name?: string };

                if (styleObj.name) {
                    const variableName = this.parseStyleNameToVariable(styleObj.name);
                    if (variableName) {
                        this.variableInfo.set(`style_${styleId}`, { name: variableName });
                    }
                }
            }
        } catch (error) {
            console.warn('⚠️ 스타일에서 변수 추출 실패');
        }
    }

    /**
     * 노드에서 실제 변수명 추출 (추측하지 않음)
     * @param node 피그마 노드
     * @param variableId Variable ID
     * @returns 실제 변수명
     */
    private extractRealVariableNameFromNode(node: unknown): string | null {
        // 1. 노드의 스타일 정보에서 실제 변수명 추출
        if (node && typeof node === 'object' && 'style' in node) {
            const nodeObj = node as { style?: { name?: string } };
            if (nodeObj.style?.name) {
                const parsedName = this.parseStyleNameToVariable(nodeObj.style.name);
                if (parsedName) {
                    return parsedName;
                }
            }
        }

        // 2. 노드 이름에서 실제 변수명 추출
        if (node && typeof node === 'object' && 'name' in node) {
            const nodeObj = node as { name?: string };
            if (nodeObj.name) {
                const parsedName = this.parseStyleNameToVariable(nodeObj.name);
                if (parsedName) {
                    return parsedName;
                }
            }
        }

        // 3. 텍스트 내용이 아닌 실제 피그마 속성에서 추출
        if (node && typeof node === 'object' && 'characters' in node) {
            // 텍스트 내용을 기반으로 추측하지 않고, 실제 피그마 속성만 사용
            return null; // 추측 금지
        }

        return null;
    }

    /**
     * 스타일/노드 이름을 변수명으로 파싱 (개선된 버전)
     * @param name 스타일 또는 노드 이름
     * @returns 변수명
     */
    private parseStyleNameToVariable(name: string): string | null {

        // 피그마 스타일 이름 패턴 분석 (진실 소스만)
        const patterns = [
            /^([a-zA-Z]+)\/([a-zA-Z]+)$/,  // primary/light
            /^([a-zA-Z]+)\.([a-zA-Z]+)$/,  // primary.light
            /^([a-zA-Z]+)\s+([a-zA-Z]+)$/, // primary light
            /^([a-zA-Z]+)_([a-zA-Z]+)$/,   // primary_light
            /^([a-zA-Z]+)-([a-zA-Z]+)$/,   // primary-light
        ];

        for (const pattern of patterns) {
            const match = name.match(pattern);
            if (match) {
                const [, group, tone] = match;
                return `${group.toLowerCase()}/${tone.toLowerCase()}`;
            }
        }

        // 특별한 케이스: warning/light 같은 직접적인 변수명
        if (name.includes('/') && name.split('/').length === 2) {
            return name.toLowerCase();
        }

        return null;
    }

    /**
     * 노드 이름을 변수명으로 변환
     * @param nodeName 노드 이름
     * @returns 변수명
     */
    private convertNodeNameToVariableName(nodeName: string): string {
        // 노드 이름을 분석하여 변수명 생성
        const name = nodeName.toLowerCase();

        if (name.includes('subtitle1') && name.includes('primary')) return 'Primary/Light';
        if (name.includes('caption') && name.includes('info')) return 'Info/Light';
        if (name.includes('h2') && name.includes('primary')) return 'Primary/Dark';
        if (name.includes('h2') && name.includes('success')) return 'Success/Dark';
        if (name.includes('subtitle1') && name.includes('text')) return 'Text/Primary';

        return nodeName;
    }


    /**
     * 스타일 정보 로드
     * @param fileKey 피그마 파일 키
     */
    private async loadStyleInfo(fileKey: string): Promise<void> {
        try {
            // 메인 파일의 스타일 정보 로드
            const stylesData = await this.client.getFileStyles(fileKey);

            if (stylesData.meta && stylesData.meta.styles) {
                for (const [styleId, style] of Object.entries(stylesData.meta.styles)) {
                    this.styleInfo.set(styleId, style);
                }
            }

            // 라이브러리 파일의 스타일 정보도 로드
            const libraryFileKey = FIGMA_CONFIG.files.library;
            if (libraryFileKey && libraryFileKey !== fileKey) {
                const libraryStylesData = await this.client.getFileStyles(libraryFileKey);

                if (libraryStylesData.meta && libraryStylesData.meta.styles) {
                    for (const [styleId, style] of Object.entries(libraryStylesData.meta.styles)) {
                        this.styleInfo.set(styleId, style);
                    }
                }
            }

            console.log(`✅ 총 ${this.styleInfo.size}개 스타일 로드 완료`);
            console.log(`🔍 로드된 스타일 목록:`, Array.from(this.styleInfo.keys()));

            // 스타일 구조 디버깅
            console.log(`🔍 첫 번째 스타일 구조 예시:`, Array.from(this.styleInfo.entries())[0]);
        } catch (error) {
            console.warn('❌ 스타일 정보 로드 실패:', error);
        }
    }

    /**
     * 컴포넌트 정보 로드
     * @param fileKey 피그마 파일 키
     */
    private async loadComponentInfo(fileKey: string): Promise<void> {
        try {

            // 메인 파일의 컴포넌트 정보 로드
            const componentsData = await this.client.getFileComponents(fileKey);

            if (componentsData.meta && componentsData.meta.components) {
                for (const [componentId, component] of Object.entries(componentsData.meta.components)) {
                    this.componentInfo.set(componentId, component);
                }
            }

            // 라이브러리 파일의 컴포넌트 정보도 로드
            const libraryFileKey = FIGMA_CONFIG.files.library;
            if (libraryFileKey && libraryFileKey !== fileKey) {
                const libraryComponentsData = await this.client.getFileComponents(libraryFileKey);

                if (libraryComponentsData.meta && libraryComponentsData.meta.components) {
                    for (const [componentId, component] of Object.entries(libraryComponentsData.meta.components)) {
                        this.componentInfo.set(componentId, component);
                    }
                }
            }

            console.log(`✅ 총 ${this.componentInfo.size}개 컴포넌트 로드 완료`);
        } catch (error) {
            console.warn('❌ 컴포넌트 정보 로드 실패:', error);
        }
    }

    /**
     * 컴포넌트 variant 정보 추출 (피그마 속성만 사용)
     * @param node 피그마 노드
     * @returns 컴포넌트 variant 정보
     */
    private getComponentVariant(): string | null {
        // 피그마의 실제 속성 값만 사용 - 추정/대안 로직 제거
        return null;
    }

    /**
     * 노드 트리에서 INSTANCE_SWAP(아이콘) 컴포넌트 ID 수집
     * 한 번에 getFileNodes 호출해 요청 수를 줄이기 위함
     */
    private collectIconNodeIdsFromTree(node: FigmaNode): string[] {
        const ids: string[] = [];
        const props = (node as any).componentProperties || {};
        for (const prop of Object.values(props) as any[]) {
            if (prop?.type === 'INSTANCE_SWAP' && prop.value) ids.push(prop.value);
        }
        if (node.children) {
            for (const child of node.children) {
                ids.push(...this.collectIconNodeIdsFromTree(child));
            }
        }
        return ids;
    }

    async extractPageDesigns(fileKey: string, pageNodeIds: string[]): Promise<PageDesignConfig[]> {
        try {
            // 파일 키 저장
            this.fileKey = fileKey;

            // 먼저 컴포넌트 정보와 스타일 정보 가져오기
            await Promise.all([
                this.loadComponentInfo(fileKey),
                this.loadStyleInfo(fileKey)
            ]);

            // 변수 정보는 선택적으로 로드 (실패해도 계속 진행)
            try {
                console.log('🔍 변수 정보 로드 시작');
                await this.loadVariableInfo(fileKey);
                console.log('✅ 변수 정보 로드 완료');
            } catch (error) {
                console.warn('⚠️ 변수 정보 로드 실패, 텍스트 기반 추출 사용:', error);
            }

            const fileData = await this.client.getFileNodes(fileKey, pageNodeIds);
            const pageDesigns: PageDesignConfig[] = [];

            for (const nodeId of pageNodeIds) {
                const node = fileData.nodes[nodeId]?.document;
                if (node) {
                    this.iconNodeNameCache.clear();
                    const iconIds = [...new Set(this.collectIconNodeIdsFromTree(node))];
                    if (iconIds.length > 0 && this.fileKey) {
                        try {
                            const iconRes = await this.client.getFileNodes(this.fileKey, iconIds);
                            if (iconRes.nodes) {
                                for (const [nid, data] of Object.entries(iconRes.nodes)) {
                                    const name = data.document?.name;
                                    if (name) this.iconNodeNameCache.set(nid, name);
                                }
                            }
                        } catch (e) {
                            console.warn('⚠️ 아이콘 노드 일괄 조회 실패:', e);
                        }
                    }
                    const pageDesign = await this.parsePageNode(node);
                    pageDesigns.push(pageDesign);
                }
            }

            return pageDesigns;
        } catch (error) {
            console.error('Failed to extract page designs:', error);
            throw error;
        }
    }

    /**
     * 페이지 노드 파싱
     * @param node 피그마 노드
     * @returns 페이지 디자인 설정
     */
    private async parsePageNode(node: FigmaNode): Promise<PageDesignConfig> {
        // "Main Content" 프레임 찾기
        const mainContentFrame = this.findMainContentFrame(node);

        const components = mainContentFrame ? await this.extractComponentsFromFrame(mainContentFrame) : [];

        const pageDesign: PageDesignConfig = {
            pageId: node.id,
            pageName: node.name,
            components,
            layout: await this.extractLayoutConfig(node),
            theme: this.extractThemeConfig(node),
        };

        return pageDesign;
    }

    /**
     * "Main Content" 프레임 찾기
     * @param node 페이지 노드
     * @returns Main Content 프레임 또는 null
     */
    private findMainContentFrame(node: FigmaNode): FigmaNode | null {
        // 직접적인 이름 매칭
        if (this.isMainContentFrame(node)) {
            return node;
        }

        // 자식 노드에서 재귀적으로 찾기
        if (node.children) {
            for (const child of node.children) {
                const found = this.findMainContentFrame(child);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * Main Content 프레임인지 확인
     * @param node 노드
     * @returns Main Content 프레임 여부
     */
    private isMainContentFrame(node: FigmaNode): boolean {
        // 새로운 설정 구조 사용
        const mainContentNames = FIGMA_CONFIG.figmaMapping.layout.mainContent as readonly string[];
        return mainContentNames.includes(node.name);
    }

    /**
     * 프레임에서 컴포넌트들 추출
     * @param frame 프레임 노드
     * @returns 컴포넌트 배열
     */
    private async extractComponentsFromFrame(frame: FigmaNode): Promise<ComponentDesignConfig[]> {
        const components: ComponentDesignConfig[] = [];

        if (frame.children) {
            for (const child of frame.children) {
                const component = await this.extractComponentDesign(child);
                if (component) {
                    components.push(component);
                }
            }
        }

        return components;
    }

    /**
     * MainContent 프레임에서 실제 UI 컴포넌트들 추출 (병합용)
     * @param mainContentFrame MainContent 프레임
     * @returns 추출된 컴포넌트 정보
     */
    public async extractMainContentComponents(mainContentFrame: FigmaNode): Promise<{
        table?: ComponentDesignConfig;
        buttons?: ComponentDesignConfig[];
        inputs?: ComponentDesignConfig[];
        filters?: ComponentDesignConfig[];
        layout?: {
            spacing: number;
            padding: number;
            direction: 'row' | 'column';
        };
    }> {
        const result: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        } = {
            buttons: [],
            inputs: [],
            filters: [],
        };

        if (!mainContentFrame.children) {
            return result;
        }

        // 레이아웃 정보 추출
        if (mainContentFrame.layoutMode) {
            result.layout = {
                spacing: mainContentFrame.itemSpacing || 24,
                padding: mainContentFrame.paddingTop || 24,
                direction: mainContentFrame.layoutMode === 'HORIZONTAL' ? 'row' : 'column',
            };
        }

        // 각 자식 컴포넌트 분석
        for (const child of mainContentFrame.children) {
            const componentType = this.determineComponentType(child);

            if (componentType === 'table') {
                const tableComponent = await this.extractComponentDesign(child);
                if (tableComponent) {
                    result.table = tableComponent;
                }
            } else if (componentType === 'button') {
                const buttonComponent = await this.extractComponentDesign(child);
                if (buttonComponent) {
                    result.buttons?.push(buttonComponent);
                }
            } else if (componentType === 'input') {
                const inputComponent = await this.extractComponentDesign(child);
                if (inputComponent) {
                    result.inputs?.push(inputComponent);
                }
            } else if (child.name.toLowerCase().includes('filter') || child.name.toLowerCase().includes('toggle')) {
                const filterComponent = await this.extractComponentDesign(child);
                if (filterComponent) {
                    result.filters?.push(filterComponent);
                }
            }
        }

        return result;
    }

    /**
     * 레이아웃 컴포넌트 추출 (기존 컴포넌트와 연동용)
     * @param node 페이지 노드
     * @returns 레이아웃 컴포넌트 설정
     */
    public async extractLayoutComponents(node: FigmaNode): Promise<Record<string, ComponentDesignConfig | null>> {
        const layoutComponents: Record<string, ComponentDesignConfig | null> = {
            header: null,
            sidebar: null,
            pageHeader: null,
            footer: null,
        };

        // 각 레이아웃 프레임 찾기
        const layoutTypes = ['header', 'sidebar', 'pageHeader', 'footer'] as const;

        for (const frameType of layoutTypes) {
            const frameNames =
                FIGMA_CONFIG.figmaMapping.layout[frameType as keyof typeof FIGMA_CONFIG.figmaMapping.layout];
            if (frameNames && frameNames.length > 0) {
                const frame = this.findFrameByName(node, frameNames[0]);
                if (frame) {
                    layoutComponents[frameType] = await this.extractComponentDesign(frame);
                }
            }
        }

        return layoutComponents;
    }

    /**
     * 특정 이름의 프레임 찾기
     * @param node 부모 노드
     * @param frameName 찾을 프레임 이름
     * @returns 찾은 프레임 또는 null
     */
    private findFrameByName(node: FigmaNode, frameName: string): FigmaNode | null {
        // 직접적인 이름 매칭
        if (node.name.toLowerCase() === frameName.toLowerCase()) {
            return node;
        }

        // 자식 노드에서 재귀적으로 찾기
        if (node.children) {
            for (const child of node.children) {
                const found = this.findFrameByName(child, frameName);
                if (found) {
                    return found;
                }
            }
        }

        return null;
    }

    /**
     * 컴포넌트 노드 파싱
     * @param node 피그마 노드
     * @param context 컨텍스트 (Table의 small 값 등)
     * @returns 컴포넌트 디자인 설정
     */
    private async extractComponentDesign(node: FigmaNode, context?: { tableSmall?: boolean }): Promise<ComponentDesignConfig | null> {
        // 숨김 노드는 완전히 제외 (추출 및 하위 조회 모두 스킵)
        if ((node as any)?.visible === false) {
            return null;
        }
        // 컴포넌트 타입 결정
        const componentType = this.determineComponentType(node);
        if (!componentType) return null;

        // ✅ Table인 경우 small 값을 먼저 추출하여 컨텍스트로 사용
        const isTable = componentType === 'table' && (node.name === '<Table>' || node.name === 'Table');
        let tableSmallContext: { tableSmall?: boolean } | undefined = undefined;
        
        if (isTable) {
            // Table의 small 값을 먼저 추출
            const tempProps = await this.extractComponentProperties(node);
            const tableSmall = tempProps['small'] === true;
            tableSmallContext = { tableSmall };
            console.log(`🔍 [Table] small 값 추출: ${tableSmall}, 컨텍스트 설정`);
        }

        const component: ComponentDesignConfig = {
            componentId: node.id,
            componentName: node.name,
            componentType,
            properties: await this.extractComponentProperties(node, tableSmallContext),
            variants: await this.extractComponentVariants(node),
        };

        // layout, card, table 타입인 경우 자식 노드 추출
        // Card는 커스텀 추출 로직 사용
        const isCardFamily = componentType === 'card';
        const isLayout = componentType === 'layout';
        const isTableType = componentType === 'table'; // TableContainer도 포함

        if ((isLayout || isCardFamily || isTableType) && node.children) {

            // ✅ 매핑에서 extractChildren이 있는지 확인
            const mapping = findMappingByType(componentType);
            const figmaNameMapping = findMappingByFigmaName(node.name);
            const useCustomExtractChildren = (mapping?.extractChildren || figmaNameMapping?.extractChildren) &&
                (node.name === '<Card>' || node.name === '<CardHeader>' ||
                    node.name === 'CardHeader' || node.name === 'CardContent' ||
                    node.name === 'CardActions' || node.name === 'CardMedia');

            if (useCustomExtractChildren && (mapping?.extractChildren || figmaNameMapping?.extractChildren)) {
                // Card, CardHeader 등은 커스텀 추출 로직 사용
                const customExtractFunction = figmaNameMapping?.extractChildren || mapping?.extractChildren;
                if (customExtractFunction) {
                    const customChildren = await customExtractFunction(node);

                    // customChildren을 직접 추출하여 children으로 처리
                    const extractedChildren: ComponentDesignConfig[] = [];
                    for (const customChild of customChildren) {
                        // 숨김 레이어는 제외
                        if ((customChild as any)?.visible === false) {
                            continue;
                        }
                        const childComponent = await this.extractComponentDesign(customChild);
                        if (childComponent) {
                            extractedChildren.push(childComponent);
                        }
                    }

                    if (extractedChildren.length > 0) {
                        component.children = extractedChildren;
                        return component;
                    }
                }
            }

            // 피그마 인스턴스명 기반으로 자식 처리
            const children: ComponentDesignConfig[] = [];
            for (const child of node.children) {
                // 숨김 레이어는 제외
                if ((child as any)?.visible === false) {
                    continue;
                }
                // Instance Slot은 제외
                if (child.name.includes('Instance Slot') || child.name.includes('_Library / Instance Slot')) {
                    continue;
                }

                // Table 중첩 방지: Table 안에 또 다른 Table이 있으면 스킵하고 그 children을 직접 추가
                if (isTable && (component.componentName === '<Table>' || component.componentName === 'Table')) {
                    const childType = this.determineComponentType(child);
                    if (childType === 'table' && (child.name === '<Table>' || child.name === 'Table')) {
                        console.log(`⚠️ [Table] 중첩된 Table 발견, children을 직접 추가: ${child.name}`);
                        // 중첩된 Table의 children을 직접 추가
                        if (child.children) {
                            for (const nestedChild of child.children) {
                                if ((nestedChild as any)?.visible === false) continue;
                                const nestedComponent = await this.extractComponentDesign(nestedChild);
                                if (nestedComponent) {
                                    children.push(nestedComponent);
                                }
                            }
                        }
                        continue;
                    }
                }

                // ✅ 참고: Table과 TableCell은 각각 피그마 인스턴스에서 직접 Small 속성을 추출함
                // propagateTableSize는 제거하고, extractComponentProperties에서 직접 추출된 값을 사용

                // ✅ 변환 규칙 1: <TableHeadRow> → <TableHead> + <TableRow>
                if (child.name === '<TableHeadRow>' || child.name === 'TableHeadRow') {
                    console.log(`🔄 [Table] TableHeadRow를 TableHead + TableRow로 변환: ${child.name}`);
                    
                    // TableHeadRow의 children을 추출하고 <TableHead>를 <TableCell>로 변환
                    const tableCellChildren: ComponentDesignConfig[] = [];
                    if (child.children) {
                        for (const headRowChild of child.children) {
                            if ((headRowChild as any)?.visible === false) continue;
                            
                            // <TableHead> 인스턴스를 <TableCell>로 변환
                            if (headRowChild.name === '<TableHead>' || headRowChild.name === 'TableHead') {
                                // <TableHead>의 텍스트 내용만 추출하여 TableCell로 변환
                                let textContent = '';
                                if (headRowChild.children) {
                                    // TEXT 노드에서 텍스트 추출
                                    for (const textNode of headRowChild.children) {
                                        if (textNode.type === 'TEXT' && textNode.characters) {
                                            textContent = textNode.characters;
                                            break;
                                        }
                                    }
                                }
                                
                                // <TableHead>의 속성 추출 (피그마 인스턴스에서 직접 Small 속성 추출)
                                // 디버깅: <TableHead> 인스턴스의 componentProperties 확인
                                console.log(`🔍 [<TableHead>] extractComponentProperties 호출 전: name=${headRowChild.name}, componentProperties=`, JSON.stringify((headRowChild as any).componentProperties || {}));
                                const headCellProperties = await this.extractComponentProperties(headRowChild, tableSmallContext);
                                console.log(`🔍 [<TableHead>] extractComponentProperties 호출 후: properties=`, JSON.stringify(headCellProperties));
                                if (textContent) {
                                    headCellProperties.text = textContent;
                                }
                                
                                // TableCell로 변환 (children 없이 텍스트만)
                                const tableCell: ComponentDesignConfig = {
                                    componentId: headRowChild.id,
                                    componentName: '<TableCell>',
                                    componentType: 'table',
                                    properties: headCellProperties,
                                    children: [] // 텍스트는 properties.text로 처리
                                };
                                tableCellChildren.push(tableCell);
                            } else {
                                // 다른 타입의 children도 처리
                                const headRowChildComponent = await this.extractComponentDesign(headRowChild, tableSmallContext);
                                if (headRowChildComponent) {
                                    tableCellChildren.push(headRowChildComponent);
                                }
                            }
                        }
                    }
                    
                    // TableRow 생성 (TableCell들을 children으로)
                    const tableRow: ComponentDesignConfig = {
                        componentId: `${child.id}_row`,
                        componentName: '<TableRow>',
                        componentType: 'table',
                        properties: {},
                        children: tableCellChildren
                    };
                    
                    // TableHead 생성 (TableRow를 children으로)
                    const tableHead: ComponentDesignConfig = {
                        componentId: child.id,
                        componentName: '<TableHead>',
                        componentType: 'table',
                        properties: await this.extractComponentProperties(child, tableSmallContext),
                        children: [tableRow]
                    };
                    
                    children.push(tableHead);
                    continue;
                }

                // ✅ 변환 규칙 2: <TableCellRow> (Row #1, Row #2, ...) → <TableRow>
                // Row #1, Row #2 등의 패턴을 감지하여 TableRow로 변환
                const isTableCellRow = child.name.startsWith('Row #') || 
                                      child.name === '<TableCellRow>' || 
                                      child.name === 'TableCellRow';
                
                if (isTableCellRow) {
                    console.log(`🔄 [Table] TableCellRow를 TableRow로 변환: ${child.name}`);
                    
                    // TableCellRow의 children을 추출하고 <TableCell>로 변환
                    const tableCellChildren: ComponentDesignConfig[] = [];
                    if (child.children) {
                        for (const cellRowChild of child.children) {
                            if ((cellRowChild as any)?.visible === false) continue;
                            
                            // <TableCell> 인스턴스 감지
                            // 피그마에서 Cell #1, Cell #2 등이 실제로 <TableCell> 인스턴스인 경우도 처리
                            const isTableCell = cellRowChild.name === '<TableCell>' ||
                                                cellRowChild.name === 'TableCell' ||
                                                (cellRowChild.name.startsWith('Cell #') && 
                                                 (cellRowChild.type === 'INSTANCE' || 
                                                  (cellRowChild as any).componentProperties));
                            
                            if (isTableCell) {
                                // <TableCell> 인스턴스 처리: properties 추출 및 텍스트 추출
                                // 피그마 인스턴스에서 직접 Small 속성 추출
                                // 디버깅: <TableCell> 인스턴스의 componentProperties 확인
                                console.log(`🔍 [<TableCell>] extractComponentProperties 호출 전: name=${cellRowChild.name}, componentProperties=`, JSON.stringify((cellRowChild as any).componentProperties || {}));
                                const cellProperties = await this.extractComponentProperties(cellRowChild, tableSmallContext);
                                console.log(`🔍 [<TableCell>] extractComponentProperties 호출 후: properties=`, JSON.stringify(cellProperties));
                                
                                // 재귀적으로 텍스트 내용 추출 (TableCell 안에 Box > Typography > TEXT 구조)
                                const extractTextRecursively = (node: any): string => {
                                    if (node.type === 'TEXT' && node.characters) {
                                        return node.characters;
                                    }
                                    if (node.children) {
                                        for (const childNode of node.children) {
                                            const text = extractTextRecursively(childNode);
                                            if (text) return text;
                                        }
                                    }
                                    return '';
                                };
                                
                                let textContent = extractTextRecursively(cellRowChild);
                                
                                // children 추출 (텍스트가 있어도 children 추출)
                                const cellChildren: ComponentDesignConfig[] = [];
                                if (cellRowChild.children) {
                                    for (const cellChild of cellRowChild.children) {
                                        if ((cellChild as any)?.visible === false) continue;
                                        // TEXT 타입은 텍스트로 처리되므로 children에서 제외
                                        if (cellChild.type === 'TEXT') continue;
                                        const cellChildComponent = await this.extractComponentDesign(cellChild);
                                        if (cellChildComponent) {
                                            cellChildren.push(cellChildComponent);
                                        }
                                    }
                                }
                                
                                // 텍스트가 있으면 properties.text에 저장
                                if (textContent) {
                                    cellProperties.text = textContent;
                                }
                                const tableCell: ComponentDesignConfig = {
                                    componentId: cellRowChild.id,
                                    componentName: '<TableCell>',
                                    componentType: 'table',
                                    properties: cellProperties,
                                    children: this.flattenLayoutWrappersInTableCell(cellChildren),
                                };
                                tableCellChildren.push(tableCell);
                            } else {
                                // 다른 타입의 경우 TableCell로 변환
                                const cellProperties = await this.extractComponentProperties(cellRowChild, tableSmallContext);
                                
                                // 재귀적으로 텍스트 내용 추출 (TableCell 안에 Box > Typography > TEXT 구조)
                                const extractTextRecursively = (node: any): string => {
                                    if (node.type === 'TEXT' && node.characters) {
                                        return node.characters;
                                    }
                                    if (node.children) {
                                        for (const childNode of node.children) {
                                            const text = extractTextRecursively(childNode);
                                            if (text) return text;
                                        }
                                    }
                                    return '';
                                };
                                
                                let textContent = extractTextRecursively(cellRowChild);
                                
                                // children 추출 (텍스트가 있어도 children 추출)
                                const cellChildren: ComponentDesignConfig[] = [];
                                if (cellRowChild.children) {
                                    for (const cellChild of cellRowChild.children) {
                                        if ((cellChild as any)?.visible === false) continue;
                                        // TEXT 타입은 텍스트로 처리되므로 children에서 제외
                                        if (cellChild.type === 'TEXT') continue;
                                        const cellChildComponent = await this.extractComponentDesign(cellChild, tableSmallContext);
                                        if (cellChildComponent) {
                                            cellChildren.push(cellChildComponent);
                                        }
                                    }
                                }
                                
                                // 텍스트가 있으면 properties.text에 저장
                                if (textContent) {
                                    cellProperties.text = textContent;
                                }
                                const tableCell: ComponentDesignConfig = {
                                    componentId: cellRowChild.id,
                                    componentName: '<TableCell>',
                                    componentType: 'table',
                                    properties: cellProperties,
                                    children: this.flattenLayoutWrappersInTableCell(cellChildren),
                                };
                                tableCellChildren.push(tableCell);
                            }
                        }
                    }
                    
                    // TableRow 생성 (TableCell들을 children으로)
                    const tableRow: ComponentDesignConfig = {
                        componentId: child.id,
                        componentName: '<TableRow>',
                        componentType: 'table',
                        properties: await this.extractComponentProperties(child, tableSmallContext),
                        children: tableCellChildren
                    };
                    
                    children.push(tableRow);
                    continue;
                }

                // TableFooter 인스턴스는 페이징 정보가 포함되어 있어 이번 작업에서는 제외
                if (child.name === '<TableFooter>' || child.name === 'TableFooter') {
                    continue;
                }
                
                // 모든 자식 노드 처리
                const childComponent = await this.extractComponentDesign(child, tableSmallContext);
                if (childComponent) {
                    children.push(childComponent);
                }
            }
            
            // ✅ Table 구조 정규화: MUI 구조에 맞게 변환
            // MUI 구조: Table > TableHead + TableBody + TableFooter
            if (isTable && (component.componentName === '<Table>' || component.componentName === 'Table') && children.length > 0) {
                const tableHeadChildren: ComponentDesignConfig[] = [];
                const tableBodyChildren: ComponentDesignConfig[] = [];
                const tableFooterChildren: ComponentDesignConfig[] = [];
                
                for (const child of children) {
                    // TableHead 관련 컴포넌트 처리 (이미 TableHeadRow는 위에서 변환됨)
                    if (child.componentName === '<TableHead>' || child.componentName === 'TableHead') {
                        // TableHead는 그대로 추가
                        tableHeadChildren.push(child);
                    } else if (child.componentName === '<TableHeadRow>' || child.componentName === 'TableHeadRow') {
                        // TableHeadRow는 이미 위에서 처리되었지만, 혹시 남아있다면 처리
                        // 이 경우는 이미 위에서 처리되어야 하므로 발생하지 않아야 함
                        tableHeadChildren.push(child);
                    } else if (child.componentName === '<TableFooter>' || child.componentName === 'TableFooter') {
                        // TableFooter 처리: TableBody와 동일하게 TableRow, TableCell만 포함
                        // 페이징 정보(Stack, IconButton 등)는 제외하고 TableRow만 추출
                        if (child.children) {
                            for (const footerChild of child.children) {
                                // TableRow만 추출 (페이징 정보 제외)
                                if (footerChild.componentName === '<TableRow>' || footerChild.componentName === 'TableRow') {
                                    tableFooterChildren.push(footerChild);
                                }
                            }
                        }
                    } else if (child.componentName === '<TableRow>' || child.componentName === 'TableRow') {
                        // TableRow는 TableBody에 들어감
                        tableBodyChildren.push(child);
                    } else if (child.componentName === '<TableBody>' || child.componentName === 'TableBody') {
                        // 이미 TableBody가 있으면 그대로 추가
                        tableBodyChildren.push(child);
                    } else {
                        // 기타 children도 TableBody에 들어감 (Row #1, Row #2 등은 이미 위에서 TableRow로 변환됨)
                        tableBodyChildren.push(child);
                    }
                }
                
                // TableHead가 있으면 추가
                const normalizedChildren: ComponentDesignConfig[] = [];
                if (tableHeadChildren.length > 0) {
                    normalizedChildren.push(...tableHeadChildren);
                }
                
                // ✅ TableBody 그룹화: TableRow들을 TableBody로 감싸기
                if (tableBodyChildren.length > 0) {
                    // tableBodyChildren에는 TableRow들이 들어있어야 함
                    const tableBody: ComponentDesignConfig = {
                        componentId: `${component.componentId}_body`,
                        componentName: '<TableBody>',
                        componentType: 'table',
                        properties: {},
                        children: tableBodyChildren
                    };
                    normalizedChildren.push(tableBody);
                }
                
                // ✅ TableFooter 그룹화: TableRow들을 TableFooter로 감싸기
                if (tableFooterChildren.length > 0) {
                    const tableFooter: ComponentDesignConfig = {
                        componentId: `${component.componentId}_footer`,
                        componentName: '<TableFooter>',
                        componentType: 'table',
                        properties: {},
                        children: tableFooterChildren
                    };
                    normalizedChildren.push(tableFooter);
                }
                
                component.children = normalizedChildren.length > 0 ? normalizedChildren : children;
            } else if (isTable && children.length > 0) {
                // Table이 아닌 다른 table 타입 컴포넌트 (TableHead, TableRow 등)
                const normalizedChildren: ComponentDesignConfig[] = [];
                for (const child of children) {
                    // TableHead 안에 있는 <TableHead>를 <TableCell>로 변환
                    if ((component.componentName === '<TableHead>' || component.componentName === 'TableHead') &&
                        (child.componentName === '<TableHead>' || child.componentName === 'TableHead')) {
                        normalizedChildren.push({
                            ...child,
                            componentName: '<TableCell>',
                            componentType: 'table',
                        });
                    } else {
                        normalizedChildren.push(child);
                    }
                }
                component.children = normalizedChildren;
            } else if (children.length > 0) {
                component.children = children;
            }
        }

        return component;
    }

    /**
     * TableCell 자식에서 단일 레이아웃 래퍼(Box, ActionButton 등)를 제거하여
     * Stack/Button 등 실제 MUI 자식을 TableCell 직계로 노출
     */
    private flattenLayoutWrappersInTableCell(children: ComponentDesignConfig[]): ComponentDesignConfig[] {
        return children.flatMap((c) => {
            if (c.componentType === 'layout' && c.children?.length === 1) {
                return this.flattenLayoutWrappersInTableCell(c.children);
            }
            return [c];
        });
    }

    /**
     * 컴포넌트 타입 결정 (새로운 매핑 시스템 사용)
     * @param node 피그마 노드
     * @returns 컴포넌트 타입
     */
    private determineComponentType(node: FigmaNode): ComponentDesignConfig['componentType'] | null {
        const name = node.name;

        // 1. 새 매핑 시스템에서 MUI 컴포넌트 검색 (우선) - INSTANCE 타입도 처리
        const mappingKey = findMappingKeyByFigmaName(name);
        if (mappingKey) {
            // 68개 매핑을 14개 카테고리로 분류
            return this.categorizeComponentType(mappingKey);
        }

        // 2. INSTANCE 타입인 경우, componentId를 사용하여 실제 컴포넌트 이름 찾기
        if (node.type === 'INSTANCE' && (node as any).componentId) {
            const componentId = (node as any).componentId;

            // componentInfo에서 실제 컴포넌트 이름 가져오기
            if (this.componentInfo.has(componentId)) {
                const componentInfo = this.componentInfo.get(componentId)!;
                const componentName = componentInfo.name || (componentInfo as any).description || (componentInfo as any).key;

                // 실제 컴포넌트 이름으로 매핑 찾기
                const actualMappingKey = findMappingKeyByFigmaName(componentName);
                if (actualMappingKey) {
                    return this.categorizeComponentType(actualMappingKey);
                }
            }

            // children을 확인하여 내부 구조로 타입 판단
            if (node.children && node.children.length > 0) {
                // 자식들의 구조 분석
                const textChildren = node.children.filter(c => c.type === 'TEXT');
                const vectorChildren = node.children.filter(c => c.type === 'VECTOR');
                const compChildren = node.children.filter(c => c.type === 'COMPONENT');
                const frameChildren = node.children.filter(c => c.type === 'FRAME');

                // 각 child의 매핑을 먼저 확인
                const layoutLikeKeys = ['stack', 'box', 'layout', 'content', 'submenu', 'controlArea', 'grid', 'container'];
                for (const child of node.children) {
                    const childMappingKey = findMappingKeyByFigmaName(child.name);
                    if (childMappingKey) {
                        const childType = this.categorizeComponentType(childMappingKey);
                        if (childType && childType !== 'layout') {
                            return childType;
                        }
                        if (layoutLikeKeys.includes(childMappingKey)) {
                            return 'layout';
                        }
                    }
                    if (child.type === 'INSTANCE' && (child as any).componentId && this.componentInfo.has((child as any).componentId)) {
                        const info = this.componentInfo.get((child as any).componentId)!;
                        const actualName = info.name || (info as any).description || (info as any).key || '';
                        const actualKey = findMappingKeyByFigmaName(actualName);
                        if (actualKey && layoutLikeKeys.includes(actualKey)) {
                            return 'layout';
                        }
                    }
                    if (child.type === 'TEXT' && child.name.toLowerCase().includes('button')) {
                        return 'button';
                    }
                }

                // 노드 이름으로 판단
                const nameLower = node.name.toLowerCase();
                if (nameLower.includes('button') || nameLower.includes('버튼')) {
                    return 'button';
                }
                if (nameLower.includes('typography') || nameLower.includes('text') || nameLower.includes('텍스트')) {
                    return 'typography';
                }
                if (nameLower.includes('icon')) {
                    return 'button';
                }
                if (nameLower.includes('card')) {
                    return 'card';
                }

                // 구조 기반 판단
                if (textChildren.length > 0 && frameChildren.length === 0 && vectorChildren.length === 0 && compChildren.length === 0) {
                    return 'typography';
                }

                if (frameChildren.length > 0) {
                    return 'layout';
                }
            } else {
                // children이 없는 경우
                if (this.componentInfo.has(componentId)) {
                    const componentInfo = this.componentInfo.get(componentId)!;
                    const actualComponentName = componentInfo.name || componentInfo.description || (componentInfo as any).key;

                    const actualMappingKey = findMappingKeyByFigmaName(actualComponentName);
                    if (actualMappingKey) {
                        return this.categorizeComponentType(actualMappingKey);
                    }

                    const componentNameLower = actualComponentName.toLowerCase();
                    if (componentNameLower.includes('button')) return 'button';
                    if (componentNameLower.includes('typography') || componentNameLower.includes('text')) return 'typography';
                    if (componentNameLower.includes('icon')) return 'button';
                    if (componentNameLower.includes('card')) return 'card';
                    if (componentNameLower.includes('chip')) return 'chip';
                    if (componentNameLower.includes('avatar')) return 'dataDisplay';

                    return 'layout';
                }
            }
        }

        // 3. FRAME 노드는 오토레이아웃 여부에 따라 Stack/Box로 처리
        // (매핑되지 않은 경우에만)
        if (node.type === 'FRAME' && node.layoutMode) {
            // 오토레이아웃이 있는 경우 Stack 컴포넌트로 처리
            return 'layout';
        } else if (node.type === 'FRAME' && !node.layoutMode) {
            // 오토레이아웃이 없는 경우 Box 컴포넌트로 처리
            return 'layout';
        }

        // 3. 기존 설정 구조 (백업 - 레이아웃 컴포넌트용)
        const components = FIGMA_CONFIG.figmaMapping.components as Record<string, readonly string[]>;
        for (const [componentType, typeNames] of Object.entries(components)) {
            if (typeNames.includes(name)) {
                // 레이아웃 컴포넌트는 navigation 타입으로 처리
                if (['header', 'sidebar', 'pageHeader', 'drawer', 'submenu'].includes(componentType)) {
                    return 'navigation';
                }
                return componentType as ComponentDesignConfig['componentType'];
            }
        }

        // 4. 기존 MUI 컴포넌트 매칭 (백업 - 사용자 정의 타입)
        const muiComponents = FIGMA_CONFIG.figmaMapping.muiComponents as Record<string, readonly string[]>;
        for (const [componentType, typeNames] of Object.entries(muiComponents)) {
            if (typeNames.includes(name)) {
                return this.categorizeComponentType(componentType);
            }
        }

        return null;
    }

    /**
     * 매핑 키를 componentType 카테고리로 변환
     * @param mappingKey COMPONENT_MAPPINGS의 키
     * @returns componentType
     */
    private categorizeComponentType(mappingKey: string): ComponentDesignConfig['componentType'] {
        // 68개를 14개 카테고리로 분류
        const categoryMap: Record<string, ComponentDesignConfig['componentType']> = {
            // Button 카테고리
            'button': 'button',
            'iconButton': 'button',
            'toggleButton': 'button',
            'fab': 'button',
            'speedDial': 'button',

            // Input 카테고리
            'input': 'input',
            'textField': 'input',
            'select': 'input',
            'checkbox': 'input',
            'switch': 'input',
            'radio': 'input',
            'slider': 'input',
            'autocomplete': 'input',
            'rating': 'input',

            // Table 카테고리
            'table': 'table',
            'tableContainer': 'table',
            'tableHead': 'table',
            'tableBody': 'table',
            'tableRow': 'table',
            'tableCell': 'table',

            // Card 카테고리
            'card': 'card',
            'paper': 'card',
            'cardContent': 'card',
            'cardActions': 'card',
            'cardHeader': 'card',  // CardHeader는 별도 처리 (props 기반)
            'cardMedia': 'card',

            // Navigation 카테고리
            'appBar': 'navigation',
            'toolbar': 'navigation',
            'menu': 'navigation',
            'menuItem': 'navigation',
            'drawer': 'navigation',
            'breadcrumbs': 'navigation',
            'bottomNavigation': 'navigation',
            'tabs': 'navigation',
            'tab': 'navigation',

            // Layout 카테고리
            'stack': 'layout',
            'grid': 'layout',
            'container': 'layout',
            'layout': 'layout',
            'content': 'layout',
            'submenu': 'layout',
            'controlArea': 'layout',

            // Chip 카테고리
            'chip': 'chip',
            'badge': 'chip',

            // Dialog 카테고리
            'dialog': 'dialog',
            'dialogTitle': 'dialog',
            'dialogContent': 'dialog',
            'dialogActions': 'dialog',
            'alert': 'dialog',
            'alertTitle': 'dialog',
            'snackbar': 'dialog',
            'backdrop': 'dialog',

            // Form 카테고리
            'formControl': 'form',
            'formLabel': 'form',
            'formControlLabel': 'form',
            'inputLabel': 'form',
            'radioGroup': 'form',

            // List 카테고리
            'list': 'list',
            'listItem': 'list',
            'listItemText': 'list',
            'listItemIcon': 'list',
            'accordion': 'list',

            // Tabs 카테고리
            'toggleButtonGroup': 'tabs',

            // Typography 카테고리
            'typography': 'typography',

            // Feedback 카테고리
            'circularProgress': 'feedback',
            'linearProgress': 'feedback',
            'skeleton': 'feedback',
            'pagination': 'feedback',

            // DataDisplay 카테고리
            'avatar': 'dataDisplay',
            'divider': 'dataDisplay',
            'stepper': 'dataDisplay',

            // Link 카테고리
            'link': 'link',
        };

        return categoryMap[mappingKey] || 'layout';
    }

    /**
     * 컴포넌트 속성 추출
     * @param node 피그마 노드
     * @returns 컴포넌트 속성
     */
    private async extractComponentProperties(
        node: FigmaNode,
        context?: { tableSmall?: boolean },
    ): Promise<Record<
        string,
        | string
        | number
        | boolean
        | TypographyConfig
        | { left: number; right: number; top: number; bottom: number }
        | Array<{ key: string; label: string; type: string }>
    >> {
        const properties: Record<
            string,
            | string
            | number
            | boolean
            | TypographyConfig
            | { left: number; right: number; top: number; bottom: number }
            | Array<{ key: string; label: string; type: string }>
        > = {};

        // 1. 먼저 컴포넌트 타입 결정 및 MUI Props 추출 (우선순위)
        const componentType = this.determineComponentType(node);

        // ✅ 매핑 기반으로 props 추출 (name 우선, 없으면 type으로)
        // "Cell #" 패턴은 TableCell로 처리 (피그마에서 TableCell 인스턴스가 "Cell #1", "Cell #2" 등으로 명명됨)
        let mapping = findMappingByFigmaName(node.name);
        if (!mapping && (node.name.startsWith('Cell #') || node.name.startsWith('cell #'))) {
            // Cell # 패턴이고 componentProperties에 Small prop이 있으면 TableCell 매핑 사용
            const props = (node as any).componentProperties || {};
            const hasSmallProp = Object.keys(props).some(key => key.toLowerCase() === 'small');
            if (hasSmallProp) {
                mapping = findMappingByFigmaName('<TableCell>');
            }
        }
        if (!mapping && componentType) {
            mapping = findMappingByType(componentType);
        }
        const isAvatarComponent = (mapping && (mapping as any).muiName === 'Avatar') || (((node as any).name || '').toLowerCase().includes('avatar'));

        // ✅ 커스텀 속성 추출 로직이 있으면 사용 (Card의 Paper 속성 추출 등)
        if (mapping?.extractProperties) {
            const customProperties = await mapping.extractProperties(node, this);
            Object.assign(properties, customProperties);
        }

        if (mapping && mapping.muiProps) {
            // 컴포넌트 속성 추출

            // 모든 MUI Props 추출
            for (const [propName, propDef] of Object.entries(mapping.muiProps)) {
                let value: any = undefined;
                let matchingKey: string | undefined = undefined;

                // extractFromFigma 함수가 있으면 사용
                if (propDef.extractFromFigma) {
                    value = propDef.extractFromFigma(node);
                } else {
                    // componentProperties에서 직접 추출
                    // Figma 디자인 키트는 PascalCase, 개발은 camelCase를 사용하므로 대소문자 무시 매칭
                    const props = (node as any).componentProperties || {};
                    matchingKey = Object.keys(props).find(
                        key => key.toLowerCase() === propName.toLowerCase()
                    );

                    if (matchingKey) {
                        const propData = props[matchingKey];
                        if (propData && typeof propData === 'object' && 'value' in propData) {
                            value = propData.value;
                        } else if (propData !== undefined) {
                            value = propData;
                        }
                    }
                    
                    // 디버깅: TableCell의 Small prop 추출 확인
                    if (propName === 'small' && (node.name === '<TableCell>' || node.name === 'TableCell' || node.name.startsWith('Cell #'))) {
                        console.log(`🔍 [${node.name}] Small prop 추출 시도: matchingKey=${matchingKey}, value=${value}, props keys:`, Object.keys(props));
                        if (matchingKey) {
                            console.log(`✅ [${node.name}] Small prop 발견: ${matchingKey} = ${JSON.stringify(props[matchingKey])}`);
                        } else {
                            console.log(`❌ [${node.name}] Small prop을 찾지 못함. componentProperties:`, JSON.stringify(props));
                        }
                    }
                }

                // 값이 있으면 properties에 추가
                // 단, extractProperties에서 이미 설정한 값이 있으면 유지 (커스텀 추출 로직 우선)
                if (value !== undefined && value !== null && properties[propName] === undefined) {
                    // 변환 함수가 있으면 적용
                    if (propDef.transform) {
                        value = propDef.transform(value);
                    }

                    // ✅ Table의 small 값에 따른 하위 노드 small 추출 제어
                    // Table small=true인 경우: 하위 노드(TableRow, TableCell 등)의 small 추출 건너뛰기
                    if (propName === 'small' && context?.tableSmall === true) {
                        // Table이 small=true인 경우 하위 노드의 small은 추출하지 않음
                        const isTableComponent = node.name === '<Table>' || node.name === 'Table';
                        if (!isTableComponent) {
                            continue; // Table이 아닌 하위 노드의 small은 건너뛰기
                        }
                    }
                    
                    // ✅ Table small=false인 경우: TableCell의 small만 추출
                    if (propName === 'small' && context?.tableSmall === false) {
                        const isTableCell = node.name === '<TableCell>' || 
                                           node.name === 'TableCell' || 
                                           node.name.startsWith('Cell #');
                        if (!isTableCell) {
                            continue; // TableCell이 아닌 경우 small 추출 건너뛰기
                        }
                    }
                    
                    // 기본값인 경우 스킵 (단, transformProps가 있는 경우는 제외)
                    // transformProps가 있는 경우 (예: Table, TableCell의 small) 기본값이어도 저장해야 변환 가능
                    const hasTransformProps = mapping?.transformProps !== undefined;
                    const shouldSkipDefault = propDef.default !== undefined && !hasTransformProps;
                    
                    if (shouldSkipDefault) {
                        const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;
                        const normalizedDefault = typeof propDef.default === 'string' ? propDef.default.toLowerCase() : propDef.default;
                        if (normalizedValue === normalizedDefault) {
                            continue;
                        }
                    }

                    // properties에 값 저장 (string은 toLowerCase(), boolean 타입은 문자열을 boolean으로 변환)
                    // transformProps가 있는 경우 small prop도 저장 (기본값이어도)
                    if (propDef.type === 'boolean') {
                        // boolean 타입인 경우: 문자열 "true"/"false"를 boolean으로 변환
                        if (typeof value === 'string') {
                            const lowerValue = value.toLowerCase();
                            properties[propName] = lowerValue === 'true';
                        } else {
                            properties[propName] = Boolean(value);
                        }
                    } else {
                        properties[propName] = typeof value === 'string' ? value.toLowerCase() : value;
                    }
                    
                    // 디버깅: small prop 추출 확인
                    if ((propName === 'small') && (node.name === '<Table>' || node.name === 'Table' || node.name === '<TableCell>' || node.name === 'TableCell' || node.name === '<TableHead>' || node.name === 'TableHead')) {
                        console.log(`🔍 [${node.name}] extractComponentProperties: ${propName}=${value} (hasTransformProps=${hasTransformProps})`);
                        console.log(`🔍 [${node.name}] componentProperties 전체:`, JSON.stringify((node as any).componentProperties || {}));
                        console.log(`🔍 [${node.name}] 추출된 properties:`, JSON.stringify(properties));
                    }
                    
                    // 디버깅: TableCell의 모든 prop 추출 확인
                    if ((node.name === '<TableCell>' || node.name === 'TableCell') && propName === 'small') {
                        console.log(`🔍 [TableCell] small prop 추출 시도: propName=${propName}, value=${value}, matchingKey=${matchingKey || '없음'}`);
                        console.log(`🔍 [TableCell] 전체 componentProperties:`, JSON.stringify((node as any).componentProperties || {}));
                    }
                    
                    // 디버깅: TableCell 인스턴스의 componentProperties 확인
                    if ((node.name === '<TableCell>' || node.name === 'TableCell')) {
                        const props = (node as any).componentProperties || {};
                        console.log(`🔍 [${node.name}] TableCell 인스턴스 componentProperties 전체:`, JSON.stringify(props));
                        const hasSmall = Object.keys(props).some(key => key.toLowerCase() === 'small');
                        console.log(`🔍 [${node.name}] Small prop 존재 여부: ${hasSmall}, 추출된 properties:`, JSON.stringify(properties));
                    }
                }
            }

            // ✅ 매핑에 커스텀 아이콘 추출 로직이 있으면 사용
            if (mapping.extractIcons) {
                // extractor를 두 번째 인자로 전달
                const iconData = await mapping.extractIcons.call(mapping.extractIcons, node, this);

                if (iconData.startIconComponentId) {
                    properties['startIconComponentId'] = iconData.startIconComponentId;
                    if (iconData.startIcon) {
                        properties['startIconName'] = iconData.startIcon;
                    }
                }
                if (iconData.endIconComponentId) {
                    properties['endIconComponentId'] = iconData.endIconComponentId;
                    if (iconData.endIcon) {
                        properties['endIconName'] = iconData.endIcon;
                    }
                }
            } else {
                // ✅ 기본 아이콘 추출 로직 (하드코딩 유지)
                const iconProps = (node as any).componentProperties || {};
                const iconNodeIds: string[] = [];

                for (const [key, propData] of Object.entries(iconProps)) {
                    const prop = propData as any;
                    if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
                        const iconComponentId = prop.value;
                        iconNodeIds.push(iconComponentId);

                        if (key.toLowerCase().includes('start')) {
                            properties['startIconComponentId'] = iconComponentId;
                        } else if (key.toLowerCase().includes('end')) {
                            properties['endIconComponentId'] = iconComponentId;
                        }
                    }
                }

                if (iconNodeIds.length > 0) {
                    for (const nid of iconNodeIds) {
                        const iconName = this.iconNodeNameCache.get(nid);
                        if (iconName) {
                            if (nid === properties.startIconComponentId) properties['startIconName'] = iconName;
                            if (nid === properties.endIconComponentId) properties['endIconName'] = iconName;
                        }
                    }
                }
            }

            // MUI Props 추출 완료 (무음)
        }

        // 크기 정보 (채우기 및 hug 설정 감지)
        if (node.absoluteBoundingBox) {
            // layoutSizing 속성 확인 (hug/fill 감지)
            const isHugWidth = node.layoutSizingHorizontal === 'HUG';
            const isFillWidth = node.layoutSizingHorizontal === 'FILL';
            const isHugHeight = node.layoutSizingVertical === 'HUG';
            const isFillHeight = node.layoutSizingVertical === 'FILL';

            // constraints 확인 (fill 설정 감지 - fallback)
            const hasFillWidthFromConstraints =
                node.constraints?.horizontal === 'LEFT_RIGHT' || node.constraints?.horizontal === 'CENTER';
            const hasFillHeightFromConstraints =
                node.constraints?.vertical === 'TOP_BOTTOM' || node.constraints?.vertical === 'CENTER';

            // 항상 절대 크기도 함께 저장 (특정 컴포넌트에서 hug여도 고정 크기 사용 필요)
            (properties as any).absoluteWidth = node.absoluteBoundingBox.width;
            (properties as any).absoluteHeight = node.absoluteBoundingBox.height;

            // width 설정
            if (isHugWidth) {
                properties.width = 'hug';
            } else if (isFillWidth || hasFillWidthFromConstraints) {
                properties.width = 'fill';
                // layoutSizingHorizontal === 'FILL'이면 flex container의 자식이므로 플래그 설정
                if (isFillWidth) {
                    (properties as any).isFlexChild = true;
                }
            } else {
                properties.width = node.absoluteBoundingBox.width;
            }

            // height 설정
            if (isHugHeight) {
                properties.height = 'hug';
            } else if (isFillHeight || hasFillHeightFromConstraints) {
                properties.height = 'fill';
            } else {
                properties.height = node.absoluteBoundingBox.height;
            }
        }

        // 색상 정보 (스타일 이름 우선)
        if (node.fills && node.fills.length > 0) {
            const colorInfo = await this.extractColorWithStyle(node.fills[0]);
            if (colorInfo.styleName) {
                // Avatar는 부모 colorStyle을 설정하지 않음 (배경 토큰은 별도 __avatarColorStyle로 처리)
                if (!isAvatarComponent) {
                    properties.colorStyle = colorInfo.styleName;
                }
            } else {
                // GPT-5 권장: boundVariables에서 Variable ID 추출
                const fillObj = node.fills[0] as { boundVariables?: { color?: { id: string } } };
                if (fillObj.boundVariables?.color?.id) {
                    const variableId = fillObj.boundVariables.color.id;
                    // GPT-5 권장: Variable ID → 변수명 → MUI 경로 변환
                    const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                    if (muiColorPath) {
                        if (!isAvatarComponent) {
                            properties.colorStyle = muiColorPath;
                        }
                        console.log(`🎨 GPT-5 방식: Variable ID ${variableId} → ${muiColorPath}`);
                    } else {
                        // 진실 소스가 없으면 HEX 색상 사용 (추측 금지)
                        if (!isAvatarComponent) {
                            properties.backgroundColor = colorInfo.color;
                            console.warn(`⚠️ 변수 ID 매핑 없음(배경): ${fillObj.boundVariables?.color?.id} → HEX fallback`);
                        }
                    }
                } else {
                    if (!isAvatarComponent) {
                        properties.backgroundColor = colorInfo.color;
                        console.warn(`⚠️ boundVariables 없음 → HEX fallback`);
                    }
                }
            }
        }

        // 테두리 정보
        if (node.strokes && node.strokes.length > 0) {
            properties.borderColor = this.extractColor(node.strokes[0]);
            properties.borderWidth = 1; // 기본값
        }

        // 모서리 둥글기
        if (node.cornerRadius !== undefined) {
            properties.borderRadius = node.cornerRadius;
        }

        // 투명도
        if (node.opacity !== undefined) {
            properties.opacity = node.opacity;
        }

        // 텍스트 속성 (피그마 variant만 사용)
        if (node.characters) {
            properties.text = node.characters;
            if (node.style) {
                properties.typography = this.extractTypographyConfig(node.style, null, node);
                // 텍스트 스타일에서 컬러 정보 추출
                const textColorInfo = this.extractTextColorFromStyle(node.style);
                if (textColorInfo.styleName && !properties.colorStyle) {
                    properties.colorStyle = textColorInfo.styleName;
                }
            }

            // 노드의 fills에서 컬러 정보 추출 (텍스트 노드의 경우)
            if (node.fills && node.fills.length > 0) {
                console.log(`🔍 텍스트 노드 "${node.characters}" fills 정보:`, node.fills);
                const colorInfo = await this.extractColorWithStyle(node.fills[0]);
                if (colorInfo.styleName) {
                    if (!isAvatarComponent) {
                        properties.colorStyle = colorInfo.styleName;
                    }
                    console.log(`🎨 텍스트 노드 "${node.characters}" fills에서 스타일 컬러 발견: ${colorInfo.styleName}`);
                } else {
                    if (!isAvatarComponent) {
                        properties.backgroundColor = colorInfo.color;
                        console.warn(`⚠️ 텍스트 색 변수 매핑 없음: "${node.characters}" → HEX fallback`);
                    }
                }
            }
        } else if (node.children) {
            // ✅ 매핑 기반 텍스트 추출 (하드코딩 제거)
            const componentType = this.determineComponentType(node);
            console.log(`🔍 ${componentType} 인스턴스 "${node.name}" 구조:`, {
                type: node.type,
                name: node.name,
                componentType,
                children: node.children?.map(child => ({
                    type: child.type,
                    name: child.name,
                    characters: child.characters,
                    fills: child.fills,
                    style: child.style
                }))
            });

            // ✅ 매핑의 extractContent 사용
            let mappingUsed = false;
            if (componentType) {
                const mapping = findMappingByType(componentType);
                if (mapping?.extractContent) {
                    const extractedText = mapping.extractContent(node);
                    if (extractedText) {
                        mappingUsed = true;
                        // Button은 label, Typography는 text
                        if (componentType === 'button') {
                            properties.label = extractedText;
                        } else {
                            properties.text = extractedText;
                        }
                        console.log(`✅ ${componentType} label/text 매핑으로 추출됨: "${extractedText}"`);
                    }
                }
            }

            for (const child of node.children) {
                if (child.characters) {
                    // ✅ 매핑을 사용하지 않은 경우에만 기본 처리
                    if (!mappingUsed) {
                        // Button이 아닌 경우에만 처리 (Button은 이미 매핑에서 처리됨)
                        if (componentType !== 'button') {
                            properties.text = child.characters;
                            if (child.style) {
                                properties.typography = this.extractTypographyConfig(child.style, null, node);
                            }
                        }
                    }

                    // 실제 텍스트 노드의 컬러 정보 추출
                    if (child.fills && child.fills.length > 0) {
                        console.log(`🔍 하위 텍스트 노드 "${child.characters}" fills 상세:`, child.fills[0]);

                        // Variable ID 기반으로 색상 정보 추출
                        const colorInfo = await this.extractColorWithStyle(child.fills[0]);
                        if (colorInfo.styleName) {
                            if (!isAvatarComponent) {
                                properties.colorStyle = colorInfo.styleName;
                            }
                            console.log(`🎨 텍스트 "${child.characters}" 스타일 컬러 발견: ${colorInfo.styleName}`);
                        } else {
                            // GPT-5 권장: boundVariables에서 Variable ID 추출
                            const fillObj = child.fills[0] as { boundVariables?: { color?: { id: string } } };
                            if (fillObj.boundVariables?.color?.id) {
                                const variableId = fillObj.boundVariables.color.id;
                                // GPT-5 권장: Variable ID → 변수명 → MUI 경로 변환
                                const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                                if (muiColorPath) {
                                    if (!isAvatarComponent) {
                                        properties.colorStyle = muiColorPath;
                                    }
                                    console.log(`🎨 GPT-5 방식: Variable ID ${variableId} → ${muiColorPath}`);
                                } else {
                                    if (!isAvatarComponent) {
                                        properties.backgroundColor = colorInfo.color;
                                        console.warn(`⚠️ 변수 ID 매핑 없음(텍스트): "${child.characters}" → HEX fallback`);
                                    }
                                }
                            } else {
                                if (!isAvatarComponent) {
                                    properties.backgroundColor = colorInfo.color;
                                    console.warn(`⚠️ boundVariables 없음(텍스트): "${child.characters}" → HEX fallback`);
                                }
                            }
                        }
                    }
                    break; // 첫 번째 텍스트 노드만 사용
                }
            }
        }

        // layout 타입인 경우 Auto Layout 속성 추출
        // componentType은 위에서 이미 선언됨
        if (componentType === 'layout') {
            // display: flex 기본 설정
            properties.display = 'flex';

            // Auto Layout 흐름 (direction)
            if (node.layoutMode) {
                properties.flexDirection = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
            }

            // Auto Layout 정렬 (justifyContent)
            if (node.primaryAxisAlignItems) {
                properties.justifyContent = this.mapAlignment(node.primaryAxisAlignItems);
            }

            // componentProperties에서 INSTANCE_SWAP 추출 (Stack의 children을 위한 것)
            const componentProps = (node as any).componentProperties || {};
            for (const [key, propData] of Object.entries(componentProps)) {
                const prop = propData as any;
                if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
                    properties[key] = prop;
                }
            }

            // Auto Layout 정렬 (alignItems)
            if (node.counterAxisAlignItems) {
                properties.alignItems = this.mapAlignment(node.counterAxisAlignItems);
            }

            // 패딩: boundVariables 있으면 변수 ID → 테마 토큰, 없으면 숫자(나중에 generator에서 theme.spacing으로 변환)
            const layoutBound = (node as { boundVariables?: Record<string, { id: string }> }).boundVariables;
            if (
                node.paddingLeft !== undefined ||
                node.paddingRight !== undefined ||
                node.paddingTop !== undefined ||
                node.paddingBottom !== undefined
            ) {
                if (layoutBound?.paddingLeft?.id || layoutBound?.paddingRight?.id || layoutBound?.paddingTop?.id || layoutBound?.paddingBottom?.id) {
                    const paddingStyle: { left?: string; right?: string; top?: string; bottom?: string } = {};
                    for (const key of ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'] as const) {
                        const id = layoutBound?.[key]?.id;
                        if (id) {
                            const token = await this.extractThemeTokenFromVariableId(id);
                            if (token) {
                                const k = key.replace('padding', '').toLowerCase() as 'left' | 'right' | 'top' | 'bottom';
                                paddingStyle[k] = token;
                            }
                        }
                    }
                    if (Object.keys(paddingStyle).length) (properties as any).paddingStyle = paddingStyle;
                }
                if (!(properties as any).paddingStyle) {
                    properties.padding = {
                        left: node.paddingLeft || 0,
                        right: node.paddingRight || 0,
                        top: node.paddingTop || 0,
                        bottom: node.paddingBottom || 0,
                    };
                }
            }

            // 간격: boundVariables(변수) → 테마 토큰, 없으면 디자인 토큰 파일(px→토큰)로 gapStyle 설정
            if (layoutBound?.itemSpacing?.id) {
                const gapToken = await this.extractThemeTokenFromVariableId(layoutBound.itemSpacing.id);
                if (gapToken) (properties as any).gapStyle = gapToken;
            }
            if (node.itemSpacing !== undefined && !(properties as any).gapStyle) {
                const token = getSpacingTokenFromPx(node.itemSpacing);
                if (token) (properties as any).gapStyle = token;
                else properties.gap = node.itemSpacing;
            }
            // Grid auto-layout: 행/열 간격 (gridRowGap, gridColumnGap 있으면 사용)
            const gridRowGap = (node as { gridRowGap?: number }).gridRowGap;
            const gridColumnGap = (node as { gridColumnGap?: number }).gridColumnGap;
            if (gridRowGap !== undefined) (properties as { rowSpacing?: number }).rowSpacing = gridRowGap;
            if (gridColumnGap !== undefined) (properties as { columnSpacing?: number }).columnSpacing = gridColumnGap;
        }

        // Avatar의 배경 컬러는 인스턴스 자신(node.fills[0])의 변수명만 사용 (자식 탐색 금지)
        try {
            const mappingForAvatar = findMappingByFigmaName(node.name) || (componentType ? findMappingByType(componentType) : null);
            const isAvatar = (mappingForAvatar && (mappingForAvatar as any).muiName === 'Avatar') || (((node as any).name || '').toLowerCase().includes('avatar'));
            if (isAvatar) {
                const isHex = (val: any) => typeof val === 'string' && /^#([0-9a-f]{8}|[0-9a-f]{6})$/i.test(val);

                let token: string | null = null;
                // 1) 이미 colorStyle이 변수명인 경우 그대로 사용
                if ((properties as any).colorStyle && !isHex((properties as any).colorStyle)) {
                    token = (properties as any).colorStyle as string;
                } else if ((node as any).fills && Array.isArray((node as any).fills) && (node as any).fills.length > 0) {
                    // 2) 인스턴스 자신의 fills[0]에서만 변수명 추출
                    const info = await this.extractColorWithStyle((node as any).fills[0]);
                    if (info.styleName) {
                        token = info.styleName;
                        (properties as any).colorStyle = token;
                    }
                }

                if (token) {
                    (properties as any).__avatarColorStyle = token;
                }
            }
        } catch {}

        return properties;
    }

    /**
     * 컴포넌트 변형 추출
     * @param node 피그마 노드
     * @returns 컴포넌트 변형 배열
     */
    private async extractComponentVariants(node: FigmaNode): Promise<ComponentVariant[]> {
        const variants: ComponentVariant[] = [];

        // 자식 노드들을 변형으로 처리
        if (node.children) {
            for (const child of node.children) {
                if (child.name.includes('variant') || child.name.includes('state')) {
                    variants.push({
                        variantName: child.name,
                        properties: await this.extractComponentProperties(child),
                    });
                }
            }
        }

        return variants;
    }

    /**
     * 레이아웃 설정 추출
     * @param node 피그마 노드
     * @returns 레이아웃 설정
     */
    private async extractLayoutConfig(node: FigmaNode): Promise<LayoutConfig> {
        const layout: LayoutConfig = {
            containerType: 'flex',
            direction: 'column',
            spacing: 0,
        };

        if (node.layoutMode) {
            layout.containerType = node.layoutMode === 'NONE' ? 'absolute' : 'flex';
            layout.direction = node.layoutMode === 'HORIZONTAL' ? 'row' : 'column';
        }

        if (node.itemSpacing !== undefined) {
            layout.spacing = node.itemSpacing;
        }

        if (
            node.paddingLeft !== undefined ||
            node.paddingRight !== undefined ||
            node.paddingTop !== undefined ||
            node.paddingBottom !== undefined
        ) {
            layout.padding = {
                left: node.paddingLeft || 0,
                right: node.paddingRight || 0,
                top: node.paddingTop || 0,
                bottom: node.paddingBottom || 0,
            };
        }

        return layout;
    }

    /**
     * 테마 설정 추출
     * @param node 피그마 노드
     * @returns 테마 설정
     */
    private extractThemeConfig(node: FigmaNode): ThemeConfig {
        const theme: ThemeConfig = {
            colors: {},
            typography: {},
            spacing: {},
            borderRadius: {},
            shadows: {},
        };

        // 색상 추출
        this.extractColorsFromNode(node, theme.colors);

        // 타이포그래피 추출
        this.extractTypographyFromNode(node, theme.typography);

        // 간격 추출
        if (node.itemSpacing !== undefined) {
            theme.spacing['component-gap'] = node.itemSpacing;
        }

        // 모서리 둥글기 추출
        if (node.cornerRadius !== undefined) {
            theme.borderRadius['component'] = node.cornerRadius;
        }

        return theme;
    }

    /**
     * 노드에서 색상 추출
     * @param node 피그마 노드
     * @param colors 색상 객체
     */
    private extractColorsFromNode(node: FigmaNode, colors: Record<string, string>): void {
        if (node.fills && node.fills.length > 0) {
            const fill = node.fills[0];
            if (fill.type === 'SOLID' && fill.color) {
                colors[node.name.toLowerCase().replace(/\s+/g, '-')] = this.rgbaToHex(fill.color);
            }
        }

        if (node.children) {
            node.children.forEach((child) => this.extractColorsFromNode(child, colors));
        }
    }

    /**
     * 노드에서 타이포그래피 추출
     * @param node 피그마 노드
     * @param typography 타이포그래피 객체
     */
    private extractTypographyFromNode(node: FigmaNode, typography: Record<string, TypographyConfig>): void {
        if (node.characters && node.style) {
            const config = this.extractTypographyConfig(node.style, null, node);
            typography[node.name.toLowerCase().replace(/\s+/g, '-')] = config;
        }

        if (node.children) {
            node.children.forEach((child) => this.extractTypographyFromNode(child, typography));
        }
    }

    /**
     * 타이포그래피 설정 추출 (피그마 속성만 사용)
     * @param style 피그마 텍스트 스타일
     * @param componentVariant 컴포넌트 variant (사용하지 않음)
     * @param node 피그마 노드 (variant 정보 추출용)
     * @returns 타이포그래피 설정
     */
    private extractTypographyConfig(
        style: {
            fontFamily?: string;
            fontSize?: number;
            fontWeight?: number;
            lineHeight?: number;
            letterSpacing?: number;
        },
        componentVariant?: string | null,
        node?: FigmaNode,
    ): TypographyConfig {
        // 피그마에서 가져온 값만 사용
        const fontSize = style.fontSize;
        const fontWeight = style.fontWeight;

        // 피그마 variant 정보만 추출 (피그마 변수에서 직접 추출)
        const figmaVariant = this.extractFigmaVariant(node);

        // 하드코딩 제거: figmaVariant가 있으면 사용, 없으면 undefined
        const variant: string | undefined = figmaVariant || undefined;

        return {
            fontFamily: style.fontFamily,
            fontSize: fontSize,
            fontWeight: fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            variant: variant,
        };
    }

    /**
     * 디자인 시스템 토큰 기반 variant 추정 (피그마 변수 기반)
     * @param fontSize 폰트 크기
     * @param fontWeight 폰트 두께
     * @param fontFamily 폰트 패밀리
     * @returns 추정된 variant
     */
    private estimateVariantFromDesignTokens(fontSize: number, fontWeight: number, fontFamily?: string): string | undefined {
        // 하드코딩 제거: 피그마 변수에서 직접 추출
        // fontSize와 fontWeight는 이미 피그마에서 추출한 실제 값
        // 하지만 하드코딩된 매핑은 사용하지 않음

        // 피그마 variantProperties 또는 componentProperties에서 직접 추출
        // 이 함수는 더 이상 사용하지 않음
        return undefined;
    }

    /**
     * 스타일 정보로부터 variant 추정 (하드코딩 제거)
     * @param fontSize 폰트 크기
     * @param fontWeight 폰트 두께
     * @returns 추정된 variant
     */
    private estimateVariantFromStyle(fontSize: number, fontWeight: number): string | undefined {
        // 하드코딩 제거: 피그마에서 직접 추출한 값만 사용
        return undefined;
    }

    /**
     * 피그마 노드에서 variant 정보 직접 추출
     */
    private extractFigmaVariant(node?: FigmaNode): string | null {
        if (!node) return null;


        // 피그마 API에서 variant 정보 추출 시도
        if (node.variantProperties) {
            // variantProperties에서 variant 정보 추출
            for (const [key, value] of Object.entries(node.variantProperties)) {
                if (key.toLowerCase().includes('variant')) {
                    return value as string;
                }
            }
        }

        // componentProperties에서 variant 정보 추출 시도
        if (node.componentProperties) {
            for (const [key, value] of Object.entries(node.componentProperties)) {
                if (key.toLowerCase().includes('variant')) {
                    // value가 객체인 경우 value 속성 추출
                    const variantValue =
                        typeof value === 'object' && value !== null && 'value' in value
                            ? (value as { value: string }).value
                            : value;
                    return variantValue as string;
                }
            }
        }

        // 노드 이름에서 variant 추출 시도
        if (node.name && node.name.includes('Variant=')) {
            const variantMatch = node.name.match(/Variant=([^,]+)/);
            if (variantMatch) {
                const variant = variantMatch[1];
                return variant;
            }
        }

        return null;
    }

    /**
     * 자식 노드들에서 텍스트를 재귀적으로 찾기
     * @param children 자식 노드 배열
     * @returns 찾은 텍스트 또는 null
     */
    private findTextInChildren(children: FigmaNode[]): string | null {
        for (const child of children) {
            // 직접 텍스트가 있는 경우
            if (child.characters) {
                return child.characters;
            }

            // 자식 노드가 있는 경우 재귀적으로 찾기
            if (child.children && child.children.length > 0) {
                const text = this.findTextInChildren(child.children);
                if (text) {
                    return text;
                }
            }
        }
        return null;
    }

    /**
     * 텍스트 스타일에서 컬러 정보 추출
     * @param style 피그마 텍스트 스타일
     * @returns 컬러와 스타일 정보
     */
    private extractTextColorFromStyle(style: unknown): { color: string; styleName?: string } {
        const styleObj = style as { fills?: Array<{ styleId?: string; color?: { r: number; g: number; b: number; a?: number }; type: string }> };

        console.log(`🔍 텍스트 스타일 상세 정보:`, {
            fills: styleObj.fills,
            styleId: styleObj.fills?.[0]?.styleId,
            color: styleObj.fills?.[0]?.color,
            fullStyle: styleObj
        });

        if (styleObj.fills && styleObj.fills.length > 0) {
            const fill = styleObj.fills[0];
            if (fill.styleId) {
                const styleInfo = this.styleInfo.get(fill.styleId) as { name: string } | undefined;
                console.log(`🔍 스타일 ID ${fill.styleId}에 대한 정보:`, styleInfo);
                if (styleInfo) {
                    return {
                        color: this.extractColor(fill),
                        styleName: styleInfo.name
                    };
                }
            }
            return {
                color: this.extractColor(fill)
            };
        }

        return {
            color: '#000000'
        };
    }

    /**
     * 색상과 스타일 정보 추출
     * @param fill 피그마 Fill 객체
     * @returns 색상과 스타일 정보
     */
    private async extractColorWithStyle(fill: unknown): Promise<{ color: string; styleName?: string }> {
        const fillObj = fill as {
            styleId?: string;
            color?: { r: number; g: number; b: number; a?: number };
            type: string;
            boundVariables?: {
                color?: {
                    type: string;
                    id: string;
                }
            }
        };

        // boundVariables에서 테마 토큰 정보 추출 (우선순위 1)
        if (fillObj.boundVariables?.color?.id) {
            const variableId = fillObj.boundVariables.color.id;
            const themeToken = await this.extractThemeTokenFromVariableId(variableId);
            if (themeToken) {
                // variable-mapping에서 MUI 테마 경로 반환 (예: "primary.main")
                console.log(`🎨 MUI 테마 경로: ${themeToken}`);
                return {
                    color: this.extractColor(fillObj),
                    styleName: themeToken
                };
            }
        }

        // 스타일 ID가 있는 경우 스타일 이름 추출 (우선순위 2)
        if (fillObj.styleId) {
            const style = this.styleInfo.get(fillObj.styleId) as { name: string } | undefined;
            if (style) {
                return {
                    color: this.extractColor(fillObj),
                    styleName: style.name
                };
            }
        }

        // 스타일 ID가 없는 경우 기본 색상 추출
        return {
            color: this.extractColor(fillObj)
        };
    }

    /**
     * Variable ID에서 테마 토큰 이름 추출 (진실 소스만 사용)
     * @param variableId 피그마 Variable ID
     * @returns MUI 테마 토큰 이름
     */
    /**
     * Variable ID에서 MUI 테마 토큰 추출 (GPT-5 방식)
     * @param variableId Variable ID
     * @returns MUI 색상 경로
     */
    private async extractThemeTokenFromVariableId(variableId: string): Promise<string | null> {
        console.log(`🔍 Variable ID 분석: ${variableId}`);

        // 1. VariableMappingManager에서 매핑 가져오기
        const mapping = await this.variableMappingManager.getMapping(variableId);

        if (mapping) {
            console.log(`✅ 변수 매핑 발견: ${variableId} → ${mapping.muiThemePath}`);
            return mapping.muiThemePath;
        }

        // 2. VariableMappingManager가 없으면 직접 API 호출 (fallback)
        const varId = variableId.split('/').pop()!;
        const encoded = encodeURIComponent(varId);

        try {
            const response = await fetch(`https://api.figma.com/v1/variables/${encoded}`, {
                headers: { 'X-Figma-Token': this.token }
            });

            if (response.ok) {
                const data = await response.json();
                const variableName = data.name;
                console.log(`✅ Variables API 성공: ${variableId} → ${variableName}`);

                const muiColorPath = this.toMuiColorPath(variableName);
                console.log(`🎨 MUI 변환: ${variableName} → ${muiColorPath}`);
                return muiColorPath;
            }
        } catch (error) {
            console.warn(`⚠️  Variables API 실패: ${variableId}`, error);
        }

        console.warn(`⚠️ 변수 매핑 없음: ${variableId}`);
        return null;
    }

    /**
     * Variable ID에 해당하는 토큰 스튜디오 색상 반환
     * @param variableId Variable ID
     * @returns 토큰 스튜디오 색상 경로
     */
    private getTokenStudioColorForVariableId(variableId: string): string | null {
        // Variable ID 패턴에 따른 토큰 스튜디오 색상 매핑
        const variableMappings: Record<string, string> = {
            'VariableID:81dfae1aeb998f06652d2b26402d52eaf067f713/918:47': 'text.disabled', // 텍스트 비활성화 색상
            'VariableID:db2de3ffa703ac3ba0e2f5d573828c1de0870d1d/918:41': 'text.secondary', // 텍스트 보조 색상
            // 추가 Variable ID 매핑들...
        };

        const tokenPath = variableMappings[variableId];
        if (tokenPath) {
            console.log(`🎨 MUI 테마 경로 매핑: ${variableId} → ${tokenPath}`);
            return tokenPath;
        }

        console.log(`❌ 토큰 스튜디오 매핑 없음: ${variableId}`);
        return null;
    }

    /**
     * GPT-5 권장: 변수명을 MUI 색상 경로로 변환
     * @param variableName 피그마 변수명 (예: "primary/light", "primary.light")
     * @returns MUI 색상 경로 (예: "primary.light")
     */
    private toMuiColorPath(variableName: string): string | null {
        console.log(`🔍 변수명 분석: ${variableName}`);

        // 다양한 패턴 처리
        let normalized = variableName;

        // 1. 이미 점(.)으로 구분된 경우: "primary.light"
        if (normalized.includes('.')) {
            const [group, tone] = normalized.split('.');
            if (group && tone) {
                const result = this.mapToMuiColor(group, tone);
                if (result) {
                    console.log(`✅ 점 구분 패턴: ${variableName} → ${result}`);
                    return result;
                }
            }
        }

        // 2. 슬래시(/)로 구분된 경우: "primary/light"
        if (normalized.includes('/')) {
            normalized = normalized.replace('/', '.');
            const [group, tone] = normalized.split('.');
            if (group && tone) {
                const result = this.mapToMuiColor(group, tone);
                if (result) {
                    console.log(`✅ 슬래시 구분 패턴: ${variableName} → ${result}`);
                    return result;
                }
            }
        }

        // 3. 공백으로 구분된 경우: "primary light"
        if (normalized.includes(' ')) {
            normalized = normalized.replace(/\s+/g, '.');
            const [group, tone] = normalized.split('.');
            if (group && tone) {
                const result = this.mapToMuiColor(group, tone);
                if (result) {
                    console.log(`✅ 공백 구분 패턴: ${variableName} → ${result}`);
                    return result;
                }
            }
        }

        // 4. 직접 매핑 시도
        const directMapping: Record<string, string> = {
            'text': 'text.primary',
            'primary': 'primary.main',
            'secondary': 'secondary.main',
            'success': 'success.main',
            'error': 'error.main',
            'warning': 'warning.main',
            'info': 'info.main',
        };

        if (directMapping[variableName.toLowerCase()]) {
            const result = directMapping[variableName.toLowerCase()];
            console.log(`✅ 직접 매핑: ${variableName} → ${result}`);
            return result;
        }

        console.log(`❌ 매핑 실패: ${variableName}`);
        return null;
    }

    private mapToMuiColor(group: string, tone: string): string | null {
        const lowerGroup = group.toLowerCase();
        const lowerTone = tone.toLowerCase();

        // MUI 표준 색상 그룹
        const muiGroups = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'text', 'grey'];

        if (muiGroups.includes(lowerGroup)) {
            // text의 경우 text.primary / text.secondary 등 처리
            if (lowerGroup === 'text') return `text.${lowerTone}`;
            return `${lowerGroup}.${lowerTone}`; // sx에서는 'primary.light' 형태로 사용
        }

        // 프로젝트 맞춤 접두어 매핑
        const customMap: Record<string, string> = {
            'brand': 'primary', // 예시: brand → primary로 귀속
            'hecto': 'primary', // hecto 브랜드 색상
        };

        if (customMap[lowerGroup]) {
            return `${customMap[lowerGroup]}.${lowerTone}`;
        }

        return null;
    }

    /**
     * 피그마 변수명을 MUI 테마 토큰으로 변환
     * @param figmaVariableName 피그마 변수명 (예: "Primary/Light", "Text/Primary")
     * @returns MUI 테마 토큰 (예: "primary.light", "text.primary")
     */
    private convertFigmaVariableNameToThemeToken(figmaVariableName: string): string {
        // 피그마 변수명을 소문자로 변환하고 슬래시를 점으로 변경
        // 예: "Primary/Light" -> "primary.light", "Text/Primary" -> "text.primary"
        return figmaVariableName
            .toLowerCase()
            .replace(/\//g, '.')
            .replace(/\s+/g, '');
    }

    /**
     * 색상 추출
     * @param fill 피그마 Fill 객체
     * @returns 색상 문자열
     */
    private extractColor(fill: { type: string; color?: { r: number; g: number; b: number; a?: number } }): string {
        if (fill.type === 'SOLID' && fill.color) {
            return this.rgbaToHex(fill.color);
        }
        return '#000000';
    }

    /**
     * RGBA를 HEX로 변환
     * @param color RGBA 색상 객체
     * @returns HEX 색상 문자열
     */
    private rgbaToHex(color: { r: number; g: number; b: number; a?: number }): string {
        const r = Math.round(color.r * 255);
        const g = Math.round(color.g * 255);
        const b = Math.round(color.b * 255);
        const a = Math.round((color.a ?? 1) * 255);

        // 8자리 HEX 코드로 반환 (RRGGBBAA)
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        const aHex = a.toString(16).padStart(2, '0');

        return `#${rHex}${gHex}${bHex}${aHex}`;
    }

    /**
     * 피그마 정렬을 CSS 정렬로 매핑
     * @param alignment 피그마 정렬
     * @returns CSS 정렬
     */
    private mapAlignment(alignment: string): string {
        switch (alignment) {
            case 'MIN':
                return 'flex-start';
            case 'CENTER':
                return 'center';
            case 'MAX':
                return 'flex-end';
            case 'SPACE_BETWEEN':
                return 'space-between';
            default:
                return 'flex-start';
        }
    }
}
