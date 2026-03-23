import { FigmaAPIClient } from './client';
import { FIGMA_CONFIG } from './config';
import { findMappingByFigmaName, findMappingByType, findMappingKeyByFigmaName, COMPONENT_MAPPINGS } from './component-mappings';
import type { IconData } from './utils/icon-extractor';
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
import { rgbaToHex, extractColorFromFill } from './utils/figma-paint-utils';
import { findDescendantByName, findTextRecursively, getFigmaBooleanProp } from './utils/figma-node-utils';

/** @/components 커스텀 컴포넌트 (매핑 폴더에 두지 않음). generator.ts CUSTOM_COMPONENT_FIGMA_NAMES와 동일 유지 */
const CUSTOM_COMPONENT_FIGMA_NAMES = new Set<string>([
    '<FavoriteButton>', 'FavoriteButton',
    '<StatusChip>', 'StatusChip',
    '<ServerChip>', 'ServerChip',
    '<FilterToggleGroup>', 'FilterToggleGroup',
]);

function isCustomComponentFigmaName(name: string): boolean {
    return CUSTOM_COMPONENT_FIGMA_NAMES.has((name || '').trim());
}

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
                await this.variableMappingManager.loadFileMappings(fileKey, 'platform');
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

        // 페이지 최상위 Box padding은 Main Content 프레임 기준으로 추출 (피그마에 적용한 padding 반영)
        const layoutSource = mainContentFrame ?? node;
        const pageDesign: PageDesignConfig = {
            pageId: node.id,
            pageName: node.name,
            components,
            layout: await this.extractLayoutConfig(layoutSource),
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
     * 인스턴스 라이브러리 이름을 우선 사용해 매핑을 해석한다.
     * - componentName 정규화는 "이름 기반 매핑"이 있을 때만 수행
     * - mapping 자체는 마지막에 componentType fallback 허용
     */
    private resolveNodeMapping(
        node: FigmaNode,
        componentType?: ComponentDesignConfig['componentType'] | null,
    ): {
        mapping: ReturnType<typeof findMappingByFigmaName> | ReturnType<typeof findMappingByType>;
        normalizedComponentName: string;
        libraryName?: string;
    } {
        let libraryName: string | undefined;

        // node가 INSTANCE이고 라이브러리 컴포넌트를 알 수 있으면, 그 이름으로 매핑을 우선 시도한다.
        if (node.type === 'INSTANCE' && (node as any).componentId && this.componentInfo.has((node as any).componentId)) {
            const info = this.componentInfo.get((node as any).componentId)!;
            libraryName = (info.name || (info as any).description || (info as any).key || '') as string;
        }

        const nodeName = String(node.name || '').trim();

        // List/Table 계열 예외는 "인스턴스여도" 동일하게 노드 이름 패턴으로 override 한다.
        const isListItemSlot = /^Item #\d+$/i.test(nodeName);
        const isTableCellSlot = nodeName.startsWith('Cell #') || nodeName.startsWith('cell #');
        const props = (node as any).componentProperties || {};
        const hasSmallProp = isTableCellSlot && Object.keys(props).some((key) => key.toLowerCase() === 'small');

        // 1) (가능하면) componentId -> libraryName 기반 매핑
        let mappingByResolvedInstanceName: ReturnType<typeof findMappingByFigmaName> | null =
            libraryName ? findMappingByFigmaName(libraryName) : null;

        // 2) 예외 override (Item #N / Cell #N)
        if (isTableCellSlot && hasSmallProp) {
            mappingByResolvedInstanceName = findMappingByFigmaName('<TableCell>');
        } else if (isListItemSlot) {
            mappingByResolvedInstanceName = findMappingByFigmaName('<ListItem>');
        }

        // 3) INSTANCE는 libraryName 매핑이 있으면 확정. 실패했을 때만 node.name 기반 매핑으로 fallback
        if (!mappingByResolvedInstanceName) {
            mappingByResolvedInstanceName = findMappingByFigmaName(node.name);
        }

        // 4) 그래도 없으면 구조 추론 (마지막 fallback)
        if (!mappingByResolvedInstanceName) {
            mappingByResolvedInstanceName = this.inferMappingFromStructure(node);
        }

        const mapping = mappingByResolvedInstanceName || (componentType ? findMappingByType(componentType) : null);

        return {
            mapping,
            normalizedComponentName: mappingByResolvedInstanceName?.figmaNames?.[0] || node.name,
            libraryName,
        };
    }

    /**
     * 구조 추론은 MUI·피그마 매핑이 다른 최소 예외만. 레이아웃은 피그마 그대로(Stack 인스턴스·오토레이아웃 등).
     * 자식이 버튼 N개인지로 Stack으로 바꾸는 식의 추론은 하지 않음.
     */

    /** Instance #N 래퍼 안의 첫 Button 계열 INSTANCE (워크플로우 관리 버튼 등) */
    private findFirstButtonLikeInstanceDescendant(node: FigmaNode): FigmaNode | null {
        const isButtonLike = (n: FigmaNode): boolean => {
            if ((n as any).type !== 'INSTANCE' || !(n as any).componentId) return false;
            if (!this.componentInfo.has((n as any).componentId)) return false;
            const nm = String(this.componentInfo.get((n as any).componentId)!.name || '');
            const nl = nm.toLowerCase();
            if (nm.startsWith('<Button>')) return true;
            return (
                nl.startsWith('button') &&
                !nl.includes('iconbutton') &&
                !nl.includes('icon button') &&
                !nl.includes('toggle') &&
                !nl.includes('group') &&
                !nl.includes('fab')
            );
        };
        const walk = (n: FigmaNode): FigmaNode | null => {
            if ((n as any).type === 'INSTANCE') {
                if (isButtonLike(n)) return n;
                if (this.looksLikeGenericButton(n)) return n;
            }
            for (const c of (n as any).children || []) {
                if ((c as any)?.visible === false) continue;
                const r = walk(c as FigmaNode);
                if (r) return r;
            }
            return null;
        };
        for (const c of (node as any).children || []) {
            if ((c as any)?.visible === false) continue;
            const r = walk(c as FigmaNode);
            if (r) return r;
        }
        return null;
    }

    /** 가로 Stack + 직계 자식이 전부 Instance #N (워크플로우 툴바 등) */
    private isHorizontalStackOfInstanceSlots(parent: FigmaNode): boolean {
        if ((parent as any).layoutMode !== 'HORIZONTAL') return false;
        const vis = ((parent as any).children || []).filter((c: any) => c?.visible !== false);
        if (vis.length < 2) return false;
        return vis.every((c: any) => /^Instance #\d+$/i.test(String(c.name || '').trim()));
    }

    /** Input/폼 분기 제외 후 첫 TEXT (Instance # 래퍼 → 버튼 라벨 fallback) */
    private extractToolbarLabelFromFigmaNode(node: FigmaNode): string | null {
        const skipBranch = (n: FigmaNode): boolean => {
            const nm = String((n as any).name || '');
            return (
                nm.includes('Input') ||
                nm.includes('FormHelperText') ||
                nm.includes('Autocomplete') ||
                nm.includes('_Native Browser Scroll')
            );
        };
        const walk = (n: FigmaNode): string | null => {
            if (skipBranch(n)) return null;
            if ((n as any).type === 'TEXT' && String((n as any).characters || '').trim()) {
                return String((n as any).characters).trim();
            }
            for (const c of (n as any).children || []) {
                if ((c as any)?.visible === false) continue;
                const t = walk(c as FigmaNode);
                if (t) return t;
            }
            return null;
        };
        return walk(node);
    }

    private async promoteLayoutWrapperToInnerButton(
        child: FigmaNode,
        extracted: ComponentDesignConfig | null,
        ctx?: { tableSmall?: boolean },
        parent?: FigmaNode,
    ): Promise<ComponentDesignConfig | null> {
        // 레이아웃(Instance #N 래퍼 등)을 버튼으로 승격하는 모든 추론은 비활성화.
        // 피그마 구조 상 layout 으로 잡힌 것은 그대로 유지한다.
        return extracted;
    }

    private inferMappingFromStructure(node: FigmaNode) {
        const visibleChildren = (node.children || []).filter((child: any) => child?.visible !== false);
        if (visibleChildren.length === 0) {
            return null;
        }

        const hasDescendantName = (current: FigmaNode | undefined, matcher: (name: string) => boolean): boolean => {
            if (!current) return false;
            const currentName = String(current.name || '');
            if (matcher(currentName)) return true;
            for (const child of current.children || []) {
                if (hasDescendantName(child, matcher)) return true;
            }
            return false;
        };

        const resolveChildMapping = (child: FigmaNode) => {
            if (child.type === 'INSTANCE' && (child as any).componentId && this.componentInfo.has((child as any).componentId)) {
                const info = this.componentInfo.get((child as any).componentId)!;
                const libraryName = (info.name || (info as any).description || (info as any).key || '') as string;
                return findMappingByFigmaName(libraryName) || findMappingByFigmaName(child.name);
            }
            return findMappingByFigmaName(child.name);
        };

        const hasInputFrame = visibleChildren.some((child) => String(child.name || '').includes('Input'));
        const hasFormHelperText = visibleChildren.some((child) => String(child.name || '').includes('FormHelperText'));
        const hasSelectIndicators = hasDescendantName(node, (name) =>
            name.includes('ArrowDropDown') ||
            name.includes('AutocompleteTag') ||
            name.includes('AutocompleteClose')
        );
        const hasBaseFrame = visibleChildren.some((child) => String(child.name || '') === 'Base');
        const hasButtonLabel = hasDescendantName(node, (name) => name === 'Button');

        if (hasInputFrame && hasFormHelperText && hasSelectIndicators) {
            return findMappingByFigmaName('<Select>');
        }

        if (hasInputFrame && hasFormHelperText) {
            return findMappingByFigmaName('<TextField>');
        }

        if (hasBaseFrame && hasButtonLabel) {
            return findMappingByFigmaName('<Button>');
        }

        // List 자식: "Item #1", "Item #2" 등 + ListItem Text / Left Content / Container 구조 → ListItem
        const hasListItemStructure = hasDescendantName(node, (name) =>
            String(name || '').includes('ListItem Text') ||
            String(name || '').includes('Left Content') ||
            String(name || '').trim() === 'ListItem Text' ||
            String(name || '').trim() === 'Left Content'
        );
        const nameLikeListItem = /^Item #\d+$/i.test(String(node.name || '').trim());
        if (nameLikeListItem && hasListItemStructure) {
            return findMappingByFigmaName('<ListItem>');
        }
        if (visibleChildren.length >= 1 && hasListItemStructure) {
            return findMappingByFigmaName('<ListItem>');
        }

        return null;
    }

    private hasDescendantName(node: FigmaNode | undefined, matcher: (name: string) => boolean): boolean {
        if (!node) return false;
        const currentName = String(node.name || '');
        if (matcher(currentName)) return true;
        for (const child of node.children || []) {
            if (this.hasDescendantName(child, matcher)) return true;
        }
        return false;
    }

    private looksLikeGenericSelect(node: FigmaNode): boolean {
        const childNames = (node.children || []).map((child) => String(child.name || ''));
        return childNames.some((name) => name.includes('Input')) &&
            childNames.some((name) => name.includes('FormHelperText')) &&
            this.hasDescendantName(
                node,
                (name) =>
                    name.includes('ArrowDropDown') ||
                    name.includes('AutocompleteTag') ||
                    name.includes('AutocompleteClose') ||
                    name === '<Menu>',
            );
    }

    private looksLikeGenericTextField(node: FigmaNode): boolean {
        const childNames = (node.children || []).map((child) => String(child.name || ''));
        return childNames.some((name) => name.includes('Input')) &&
            childNames.some((name) => name.includes('FormHelperText'));
    }

    private looksLikeGenericButton(node: FigmaNode): boolean {
        if (
            this.hasDescendantName(node, (name) => name.includes('Input')) ||
            this.hasDescendantName(node, (name) => name.includes('FormHelperText')) ||
            this.hasDescendantName(node, (name) => name.includes('Autocomplete'))
        ) {
            return false;
        }
        const labelLayer = (name: string) =>
            name === 'Button' || name === 'T Button' || /T\s*Button/i.test(name) || name.includes('T Button');
        return (
            this.hasDescendantName(node, (name) => name === 'Base') &&
            this.hasDescendantName(node, labelLayer)
        );
    }

    /**
     * 컴포넌트 노드 파싱
     * @param node 피그마 노드
     * @param context 컨텍스트 (Table의 small 값 등)
     * @returns 컴포넌트 디자인 설정
     */
    private async extractComponentDesign(
        node: FigmaNode,
        context?: { tableSmall?: boolean; lastTypographyText?: string | null },
    ): Promise<ComponentDesignConfig | null> {
        // 숨김 노드는 완전히 제외 (추출 및 하위 조회 모두 스킵)
        if ((node as any)?.visible === false) {
            return null;
        }
        // 컴포넌트 타입 결정
        let componentType = this.determineComponentType(node);
        if (!componentType) return null;

        let { normalizedComponentName: componentName } = this.resolveNodeMapping(node, componentType);
        if (node.name.startsWith('Instance #')) {
            if (this.looksLikeGenericSelect(node)) {
                componentName = '<Select>';
            } else if (this.looksLikeGenericTextField(node)) {
                componentName = '<TextField>';
            } else if (this.looksLikeGenericButton(node)) {
                componentName = '<Button>';
            }
        }
        const normalizedMappingKey = findMappingKeyByFigmaName(componentName);
        if (normalizedMappingKey) {
            componentType = this.categorizeComponentType(normalizedMappingKey);
        }

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
            componentName,
            componentType,
            properties: await this.extractComponentProperties(node, tableSmallContext),
            variants: await this.extractComponentVariants(node),
        };

        // FilterToggleGroup: 피그마 구조 FilterToggleGroup > ToggleButtonGroup > ToggleButton 반영
        if (isCustomComponentFigmaName(node.name) && (node.name.includes('FilterToggleGroup') || node.name.includes('Filter Toggle'))) {
            if (node.children && node.children.length > 0) {
                const options: Array<{ value: string; label: string; count: number; selected?: boolean }> = [];
                let toggleButtonDesigns: ComponentDesignConfig[] = [];

                for (const child of node.children) {
                    if ((child as any)?.visible === false) continue;
                    const childDesign = await this.extractComponentDesign(child, tableSmallContext);
                    if (!childDesign) continue;
                    const name = childDesign.componentName || '';
                    const isToggleButtonGroup = name === '<ToggleButtonGroup>' || name === 'ToggleButtonGroup';
                    if (isToggleButtonGroup && childDesign.children && childDesign.children.length > 0) {
                        toggleButtonDesigns = childDesign.children;
                        break;
                    }
                    toggleButtonDesigns.push(childDesign);
                }

                for (const item of toggleButtonDesigns) {
                    const p = (item.properties || {}) as Record<string, unknown>;
                    const label = typeof p.label === 'string' ? p.label : typeof p.text === 'string' ? p.text : '';
                    const value = typeof p.value === 'string' ? p.value : typeof p.value === 'number' ? String(p.value) : '';
                    const chipProps = p.__toggleButtonChipProps as { label?: string | number } | undefined;
                    const count = chipProps?.label != null ? Number(chipProps.label) : 0;
                    const selected = p.selected === true;
                    options.push({
                        value: String(value).trim(),
                        label: String(label).trim(),
                        count: Number.isNaN(count) ? 0 : count,
                        selected: selected || undefined,
                    });
                }
                if (options.length > 0) {
                    (component.properties as Record<string, unknown>).options = options;
                }
            }
        }

        // layout, card, table, Drawer/navigation 타입인 경우 자식 노드 추출
        // Card는 커스텀 추출 로직 사용
        const isCardFamily = componentType === 'card';
        const isLayout = componentType === 'layout';
        const isTableType = componentType === 'table'; // TableContainer도 포함
        const figmaNameMapping = findMappingByFigmaName(componentName);
        const isToggleButtonGroup = figmaNameMapping?.muiName === 'ToggleButtonGroup';
        const isButtonGroup = figmaNameMapping?.muiName === 'ButtonGroup';
        const isMenu = figmaNameMapping?.muiName === 'Menu';
        const isMenuList = figmaNameMapping?.muiName === 'MenuList';
        const isList = figmaNameMapping?.muiName === 'List';
        const isDrawer = figmaNameMapping?.muiName === 'Drawer';
        const isAccordion = figmaNameMapping?.muiName === 'Accordion';

        if ((isLayout || isCardFamily || isTableType || isToggleButtonGroup || isButtonGroup || isMenu || isMenuList || isList || isDrawer || isAccordion) && node.children) {

            // ✅ 매핑에서 extractChildren이 있는지 확인
            const mapping = findMappingByType(componentType);
            const useCustomExtractChildren = Boolean(mapping?.extractChildren || figmaNameMapping?.extractChildren);

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
            // Has Value=false Select의 라벨 텍스트가 Select 내부에서 안 잡히는 경우가 있어,
            // 같은 컨테이너(한 줄 툴바)에서 직전 Typography 텍스트를 label로 주입한다.
            // 중첩 layout(Left Area > Stack > Instance #1)에서 부모의 Typography를 전달하기 위해 context로 넘긴다.
            const layoutContext: { tableSmall?: boolean; lastTypographyText?: string | null } = {
                ...context,
                tableSmall: tableSmallContext?.tableSmall ?? context?.tableSmall,
                lastTypographyText: context?.lastTypographyText ?? null,
            };
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
                                const nestedComponent = await this.extractComponentDesign(nestedChild, layoutContext);
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
                                const headCellProperties = await this.extractComponentProperties(headRowChild, layoutContext);
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
                                const headRowChildComponent = await this.extractComponentDesign(headRowChild, layoutContext);
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
                        properties: await this.extractComponentProperties(child, layoutContext),
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
                                const cellProperties = await this.extractComponentProperties(cellRowChild, layoutContext);
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
                                        const cellChildComponent = await this.extractComponentDesign(cellChild, layoutContext);
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
                                const cellProperties = await this.extractComponentProperties(cellRowChild, layoutContext);
                                
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
                                        const cellChildComponent = await this.extractComponentDesign(cellChild, layoutContext);
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
                        properties: await this.extractComponentProperties(child, layoutContext),
                        children: tableCellChildren
                    };
                    
                    children.push(tableRow);
                    continue;
                }

                // TableFooter 인스턴스는 페이징 정보가 포함되어 있어 이번 작업에서는 제외
                if (child.name === '<TableFooter>' || child.name === 'TableFooter') {
                    continue;
                }
                
                // Stack 등 하위 layout 진입 전: 같은 레이아웃의 이전 형제 중 Typography/라벨성 노드에서만 텍스트 수집 (FilterToggleGroup 등 제외)
                const isChildLayout = this.determineComponentType(child) === 'layout';
                if (isChildLayout && (node.children || []).length > 1) {
                    const labelLikeName = (n: any) => {
                        const name = String(n?.name ?? '').toLowerCase();
                        return name.includes('typography') || name === 'label' || name.includes('t label');
                    };
                    for (const prev of node.children || []) {
                        if (prev === child) break;
                        if ((prev as any)?.visible === false) continue;
                        if (!labelLikeName(prev)) continue;
                        let txt = findTextRecursively([prev as any]);
                        if (!txt?.trim() && (prev as any).id && this.fileKey) {
                            const fetched = await this.getFileNodes((prev as any).id);
                            if (fetched) txt = findTextRecursively([fetched]);
                        }
                        if (txt && typeof txt === 'string' && txt.trim()) {
                            layoutContext.lastTypographyText = txt.trim();
                            break;
                        }
                    }
                }

                // 모든 자식 노드 처리
                let childComponent = await this.extractComponentDesign(child, layoutContext);
                childComponent = await this.promoteLayoutWrapperToInnerButton(child, childComponent, layoutContext, node);

                // 직전 Typography 텍스트 기억 (중첩 layout으로 전달되도록 context에 반영)
                // 인스턴스는 componentProperties에 텍스트가 없을 수 있으므로 노드 전체(자신+자식)에서 추출 (피그마 있는 그대로)
                if (childComponent?.componentType === 'typography') {
                    const fromProps = (childComponent.properties as any)?.text;
                    const fromNode = findTextRecursively([child as any]);
                    const t = (typeof fromProps === 'string' && fromProps.trim() ? fromProps : (fromNode || '')).trim();
                    if (t) layoutContext.lastTypographyText = t;
                }

                // Has Value=false Select인데 label이 비면, 직전 Typography 텍스트를 label로 승격 (Stack 안 Select도 부모 Left Area의 Typography 사용)
                if (childComponent) {
                    const mappingForChild = findMappingByFigmaName(childComponent.componentName) || findMappingByType(childComponent.componentType);
                    if (mappingForChild?.muiName === 'Select') {
                        const props = ((child as any).componentProperties || {}) as Record<string, unknown>;
                        const hasValue = getFigmaBooleanProp(child as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?');
                        const hasLabel = typeof (childComponent.properties as any)?.label === 'string' && String((childComponent.properties as any)?.label).trim();
                        const fallbackLabel = layoutContext.lastTypographyText ?? null;
                        // Figma 응답에서 Has Value=false boolean이 누락되는 경우가 있어 undefined도 허용
                        if ((hasValue === false || hasValue === undefined) && !hasLabel && fallbackLabel) {
                            (childComponent.properties as any).label = fallbackLabel;
                        }
                    }
                }
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
                // ✅ ToggleButtonGroup > ToggleButton: value 필수 (MUI). Figma에 없으면 텍스트 또는 option{N} 보강
                if (isToggleButtonGroup) {
                    component.children.forEach((child, index) => {
                        const name = child.componentName || '';
                        const props = child.properties as Record<string, unknown>;
                        if ((name === '<ToggleButton>' || name === 'ToggleButton') && (props.value === undefined || props.value === null)) {
                            const label = props.label;
                            props.value = typeof label === 'string' && label.trim() ? label.trim() : `option${index}`;
                        }
                    });
                }
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

        // 1. @/components 커스텀 컴포넌트 (매핑 없이 이름만 인식)
        if (isCustomComponentFigmaName(name)) {
            return 'tabs';
        }

        // 2. INSTANCE면 componentId → 라이브러리 이름 기반 매핑을 1순위로 판정한다.
        // - 라이브러리에서 <Stack>, <Button> 등 실제 컴포넌트 이름을 가져와 매핑
        // - generic button/select 추론보다 먼저 실행해, Stack 인스턴스가 Button으로 오인되지 않도록 함
        if (node.type === 'INSTANCE' && (node as any).componentId) {
            // 슬롯 예외: Item #N / Cell #N 은 레이어명 패턴이 의미를 가지므로 우선 처리
            const nodeName = String(name || '').trim();
            if (/^Item #\d+$/i.test(nodeName)) {
                return 'list';
            }
            if (nodeName.startsWith('Cell #') || nodeName.startsWith('cell #')) {
                const props = (node as any).componentProperties || {};
                const hasSmallProp = Object.keys(props).some((key) => key.toLowerCase() === 'small');
                if (hasSmallProp) {
                    return 'table';
                }
            }
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
                // 라이브러리 표기가 "Stack / …", "Horizontal Stack" 등으로 달라도 컨테이너는 layout 유지
                const libLc = String(componentName || '')
                    .trim()
                    .toLowerCase();
                if (
                    (/\bstack\b/.test(libLc) || libLc.includes('stack/')) &&
                    !libLc.includes('button') &&
                    !libLc.includes('iconbutton')
                ) {
                    // 라이브러리명이 Stack처럼 보여도, 내부 구조가 Select/TextField 등으로 명확하면 그쪽을 우선
                    const inferred = this.inferMappingFromStructure(node);
                    const inferredKey = inferred?.figmaNames?.[0] ? findMappingKeyByFigmaName(inferred.figmaNames[0]) : null;
                    if (inferredKey) return this.categorizeComponentType(inferredKey);
                    return 'layout';
                }
                if (
                    (/\bbox\b/.test(libLc) || libLc.includes('box/')) &&
                    !libLc.includes('button') &&
                    !libLc.includes('textfield') &&
                    !libLc.includes('text field')
                ) {
                    // 라이브러리명이 Box처럼 보여도, 내부 구조가 Select/TextField 등으로 명확하면 그쪽을 우선
                    const inferred = this.inferMappingFromStructure(node);
                    const inferredKey = inferred?.figmaNames?.[0] ? findMappingKeyByFigmaName(inferred.figmaNames[0]) : null;
                    if (inferredKey) return this.categorizeComponentType(inferredKey);
                    return 'layout';
                }
                // @/components 커스텀 컴포넌트 (매핑 없이 이름만 인식)
                if (isCustomComponentFigmaName(componentName)) {
                    return 'tabs';
                }
                // 라이브러리명이 "Button / …" 처럼 FIGMA_NAME_TO_TYPE에 없어도 Button 계열이면 button
                // (직계 자식 Frame 때문에 아래에서 layout으로 오인되는 것 방지)
                const libNm = String(componentName || '').trim();
                const libL = libNm.toLowerCase();
                if (
                    libNm.startsWith('<Button>') ||
                    (libL.startsWith('button') &&
                        !libL.includes('iconbutton') &&
                        !libL.includes('icon button') &&
                        !libL.includes('toggle') &&
                        !libL.includes('group') &&
                        !libL.includes('fab') &&
                        !libL.includes('speed dial'))
                ) {
                    return 'button';
                }
            }

            const inferredMappingFromInstance = this.inferMappingFromStructure(node);
            if (inferredMappingFromInstance?.figmaNames?.[0]) {
                const inferredKey = findMappingKeyByFigmaName(inferredMappingFromInstance.figmaNames[0]);
                if (inferredKey) {
                    return this.categorizeComponentType(inferredKey);
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
                const visibleDirect = (node.children || []).filter((c: any) => c?.visible !== false);
                for (const child of node.children) {
                    const childMappingKey = findMappingKeyByFigmaName(child.name);
                    if (childMappingKey) {
                        const childType = this.categorizeComponentType(childMappingKey);
                        if (childType && childType !== 'layout') {
                            // 직계 자식이 여럿인데 첫 Button만 보고 부모 전체를 button으로 잡으면 Stack 인스턴스가 소실됨
                            if (!(childType === 'button' && visibleDirect.length > 1)) {
                                return childType;
                            }
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

                // 자식 이름이 Instance # 등이라 매핑이 없어도, 오토레이아웃+다중 직계 자식이면 컨테이너(Stack)로 유지
                if (
                    visibleDirect.length > 1 &&
                    (node as any).layoutMode &&
                    (node as any).layoutMode !== 'NONE'
                ) {
                    return 'layout';
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
                    if (isCustomComponentFigmaName(actualComponentName)) {
                        return 'tabs';
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

        // 3. 새 매핑 시스템에서 MUI 컴포넌트 검색 (레이어명 기반) - INSTANCE 매핑 실패 시 fallback
        const mappingKey = findMappingKeyByFigmaName(name);
        if (mappingKey) {
            // 68개 매핑을 14개 카테고리로 분류
            return this.categorizeComponentType(mappingKey);
        }

        // 1-2. FRAME은 항상 layout(Stack/Box)으로 처리하여 중첩 Stack 구조 보존
        // (looksLikeGenericButton 등보다 먼저 처리해, 버튼을 담은 좌/우 그룹 Frame이 Button으로 흡수되지 않도록 함)
        if (node.type === 'FRAME') {
            return 'layout';
        }

        // 1-3. 그 외 노드: generic Select/TextField/Button 패턴 감지
        if (this.looksLikeGenericSelect(node) || this.looksLikeGenericTextField(node)) {
            return 'input';
        }

        if (this.looksLikeGenericButton(node)) {
            return 'button';
        }

        // 1-4. 이름이 일반적인 노드일 때, 내부 구조로 대표 컴포넌트를 추론
        const inferredMapping = this.inferMappingFromStructure(node);
        if (inferredMapping?.figmaNames?.[0]) {
            const inferredKey = findMappingKeyByFigmaName(inferredMapping.figmaNames[0]);
            if (inferredKey) {
                return this.categorizeComponentType(inferredKey);
            }
        }

        // 2. FRAME 노드는 오토레이아웃 여부에 따라 Stack/Box로 처리 (백업)
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

        // 5. @/components 커스텀 컴포넌트 (매핑 없이 이름만 인식)
        if (isCustomComponentFigmaName(name)) {
            return 'tabs';
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
            'menuList': 'navigation',
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
            'accordionSummary': 'list',
            'accordionDetails': 'list',

            // Tabs 카테고리
            'toggleButtonGroup': 'tabs',

            // Button 그룹 (ButtonGroup: MUI Button 자식 그룹)
            'buttonGroup': 'button',

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

        // ✅ 매핑 기반으로 props 추출 (인스턴스 라이브러리명 우선, 없으면 type fallback)
        const { mapping } = this.resolveNodeMapping(node, componentType);
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
                    } else if (typeof value === 'string' && ['label', 'placeholder', 'text', 'helperText', 'defaultValue'].includes(propName)) {
                        properties[propName] = value;
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
                const iconData: IconData = await mapping.extractIcons!.call(mapping.extractIcons, node, this);

                if (iconData.startIcon) {
                    properties['startIconName'] = iconData.startIcon;
                }
                if (iconData.startIconComponentId) {
                    properties['startIconComponentId'] = iconData.startIconComponentId;
                }
                if (iconData.endIcon) {
                    properties['endIconName'] = iconData.endIcon;
                }
                if (iconData.endIconComponentId) {
                    properties['endIconComponentId'] = iconData.endIconComponentId;
                }
                if (iconData.startIconSize) {
                    properties['startIconSize'] = iconData.startIconSize;
                }
                if (iconData.endIconSize) {
                    properties['endIconSize'] = iconData.endIconSize;
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
                // boundVariables에서 Variable ID 추출
                const fillObj = node.fills[0] as { boundVariables?: { color?: { id: string } } };
                if (fillObj.boundVariables?.color?.id) {
                    const variableId = fillObj.boundVariables.color.id;
                    // Variable ID → 변수명 → MUI 경로 변환
                    const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                    if (muiColorPath) {
                        if (!isAvatarComponent) {
                            properties.colorStyle = muiColorPath;
                        }
                        console.log(`🎨 Variable ID ${variableId} → ${muiColorPath}`);
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

        // 테두리 정보: "현재 노드 자신의 stroke"만 사용 (자식(Container 등) 스타일을 부모에 적용하지 않음)
        const strokeNode = node.strokes && node.strokes.length > 0 ? node : null;
        if (strokeNode && strokeNode.strokes && strokeNode.strokes.length > 0) {
            // stroke가 실제로 존재하는 노드에서 추출한 border임을 표시 (1px도 유효하게 출력)
            (properties as Record<string, unknown>).__borderFromStrokes = true;
            const stroke0 = strokeNode.strokes[0] as { boundVariables?: { color?: { id: string } }; type: string; color?: { r: number; g: number; b: number; a?: number } };
            if (stroke0.boundVariables?.color?.id) {
                const variableId = stroke0.boundVariables.color.id;
                const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                if (muiColorPath) {
                    properties.borderColor = muiColorPath;
                } else {
                    properties.borderColor = extractColorFromFill(stroke0);
                    console.warn(`⚠️ 변수 ID 매핑 없음(테두리): ${variableId} → HEX fallback`);
                }
            } else {
                properties.borderColor = extractColorFromFill(stroke0);
            }
            const raw = strokeNode as unknown as Record<string, unknown>;
            const r = raw as any;
            // 공식 문서: rectangle/frame-like node는 strokeTopWeight, strokeRightWeight 등 개별 변 두께 지원. 면이 다르면 strokeWeight는 figma.mixed.
            const strokeWeightNum = typeof raw.strokeWeight === 'number' ? raw.strokeWeight : (typeof r.stroke_weight === 'number' ? r.stroke_weight : undefined);
            const strokeWeight = strokeWeightNum; // figma.mixed(비숫자)일 때는 fallback으로 쓰지 않음
            const individual = (r && typeof r.individualStrokeWeights === 'object' && r.individualStrokeWeights)
                ? r.individualStrokeWeights
                : undefined;
            const readSide = (camel: string, snake: string) => {
                // REST API: individualStrokeWeights.{top,right,bottom,left} 우선
                if (individual && typeof individual === 'object') {
                    const key = camel.replace(/^stroke/i, '').replace(/Weight$/, '').toLowerCase(); // top/right/bottom/left
                    const vv = (individual as any)[key];
                    if (typeof vv === 'number') return vv;
                }
                const v = r[camel];
                const s = r[snake];
                if (typeof v === 'number') return v;
                if (typeof s === 'number') return s;
                return undefined;
            };
            // 개별 면 우선. strokeWeight는 면이 모두 같을 때만 숫자이고, 다르면 mixed이므로 숫자일 때만 fallback 사용
            const top = readSide('strokeTopWeight', 'stroke_top_weight') ?? (typeof strokeWeight === 'number' ? strokeWeight : 0);
            const right = readSide('strokeRightWeight', 'stroke_right_weight') ?? (typeof strokeWeight === 'number' ? strokeWeight : 0);
            const bottom = readSide('strokeBottomWeight', 'stroke_bottom_weight') ?? (typeof strokeWeight === 'number' ? strokeWeight : 0);
            const left = readSide('strokeLeftWeight', 'stroke_left_weight') ?? (typeof strokeWeight === 'number' ? strokeWeight : 0);
            const hasTop = typeof top === 'number' && top > 0;
            const hasRight = typeof right === 'number' && right > 0;
            const hasBottom = typeof bottom === 'number' && bottom > 0;
            const hasLeft = typeof left === 'number' && left > 0;
            const sides: Array<'top' | 'right' | 'bottom' | 'left'> = [];
            if (hasTop) sides.push('top');
            if (hasRight) sides.push('right');
            if (hasBottom) sides.push('bottom');
            if (hasLeft) sides.push('left');
            const count = sides.length;
            if (count >= 1) {
                // Figma에서 적용된 stroke 면만 정확히 반영 (단일: top/bottom 등, 복수: top+bottom 등)
                (properties as Record<string, unknown>).borderSides = sides;
                const w = (hasTop ? top : hasRight ? right : hasBottom ? bottom : left) as number;
                if (typeof w === 'number' && w > 0) properties.borderWidth = w;
            } else {
                // 개별 면 정보 없음: 노드에 명시된 strokeWeight 사용 (REST API가 개별 면을 주지 않으면 strokeWeight만 옴)
                let w = typeof strokeWeight === 'number' ? strokeWeight : (right || left || top || bottom);
                if (typeof w !== 'number' || w <= 0) {
                    const rootWeight = (node as unknown as Record<string, unknown>).strokeWeight ?? (node as any).stroke_weight;
                    w = typeof rootWeight === 'number' && rootWeight > 0 ? rootWeight : 0;
                }
                if (typeof w === 'number' && w > 0) properties.borderWidth = w;
            }
            const strokeDashes = (strokeNode as { strokeDashes?: number[] }).strokeDashes;
            properties.borderStyle = Array.isArray(strokeDashes) && strokeDashes.length > 0 ? 'dashed' : 'solid';
        }

        // ListItem: 자식 아이콘/텍스트의 fill → 테마 토큰 (ListItemIcon/ListItemText sx color, MenuItem 등 공통 사용 가능)
        if (mapping?.muiName === 'ListItem') {
            const children = (node as any).children as any[] | undefined;
            if (Array.isArray(children)) {
                const findFirstWithFills = (nodes: any[]): any => {
                    for (const n of nodes) {
                        if (n?.fills?.length > 0) return n;
                        if (n?.children?.length) {
                            const found = findFirstWithFills(n.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const iconLike = children.find((c: any) => /icon/i.test(String(c?.name ?? '')));
                const iconNode = iconLike ? (iconLike.children && findFirstWithFills(iconLike.children)) || (iconLike.fills?.length > 0 ? iconLike : null) : null;
                const textNode = findDescendantByName(node as FigmaNode, /ListItem Text|T List item|ListItemText/i);
                const resolveFillToToken = async (target: any): Promise<string | undefined> => {
                    if (!target?.fills?.length) return undefined;
                    const fill0 = target.fills[0] as { boundVariables?: { color?: { id: string } } };
                    if (fill0.boundVariables?.color?.id) {
                        const token = await this.extractThemeTokenFromVariableId(fill0.boundVariables.color.id);
                        return token ?? undefined;
                    }
                    const colorInfo = await this.extractColorWithStyle(target.fills[0]);
                    return colorInfo.styleName ?? colorInfo.color;
                };
                const iconColor = iconNode ? await resolveFillToToken(iconNode) : undefined;
                const textColor = textNode ? await resolveFillToToken(textNode as any) : undefined;
                if (iconColor) (properties as Record<string, unknown>).__listItemIconColor = iconColor;
                if (textColor) (properties as Record<string, unknown>).__listItemTextColor = textColor;
            }
        }

        // MenuItem: 자식 아이콘/텍스트 fill → 테마 토큰 (ListItemIcon/ListItemText sx로 공통 사용, ListItem과 동일 패턴)
        if (mapping?.muiName === 'MenuItem') {
            const children = (node as any).children as any[] | undefined;
            if (Array.isArray(children)) {
                const findFirstWithFills = (nodes: any[]): any => {
                    for (const n of nodes) {
                        if (n?.fills?.length > 0) return n;
                        if (n?.children?.length) {
                            const found = findFirstWithFills(n.children);
                            if (found) return found;
                        }
                    }
                    return null;
                };
                const iconLike = children.find((c: any) => /icon/i.test(String(c?.name ?? '')));
                const iconNode = iconLike ? (iconLike.children && findFirstWithFills(iconLike.children)) || (iconLike.fills?.length > 0 ? iconLike : null) : null;
                const textNode = findDescendantByName(node as FigmaNode, /ListItem Text|T List item|Value|MenuItem/i);
                const resolveFillToToken = async (target: any): Promise<string | undefined> => {
                    if (!target?.fills?.length) return undefined;
                    const fill0 = target.fills[0] as { boundVariables?: { color?: { id: string } } };
                    if (fill0.boundVariables?.color?.id) {
                        const token = await this.extractThemeTokenFromVariableId(fill0.boundVariables.color.id);
                        return token ?? undefined;
                    }
                    const colorInfo = await this.extractColorWithStyle(target.fills[0]);
                    return colorInfo.styleName ?? colorInfo.color;
                };
                const iconColor = iconNode ? await resolveFillToToken(iconNode) : undefined;
                const textColor = textNode ? await resolveFillToToken(textNode as any) : undefined;
                if (iconColor) (properties as Record<string, unknown>).__menuItemIconColor = iconColor;
                if (textColor) (properties as Record<string, unknown>).__menuItemTextColor = textColor;
            }
        }

        // 모서리 둥글기: boundVariables(변수) 있으면 테마 토큰으로, 없으면 숫자(px)
        const bv = (node as { boundVariables?: Record<string, { id?: string }> }).boundVariables;
        let cornerVarId: string | undefined = bv?.cornerRadius?.id ?? bv?.topLeftRadius?.id ?? bv?.topRightRadius?.id
            ?? bv?.bottomLeftRadius?.id ?? bv?.bottomRightRadius?.id;
        if (!cornerVarId && bv) {
            for (const [key, ref] of Object.entries(bv)) {
                if (ref && typeof ref === 'object' && ref.id && /corner|radius|topleft|topright|bottomleft|bottomright|rectangle/i.test(String(key))) {
                    cornerVarId = ref.id;
                    break;
                }
            }
        }
        if (cornerVarId) {
            const shapePath = await this.extractShapeTokenFromVariableId(cornerVarId);
            if (shapePath) {
                properties.borderRadiusStyle = shapePath;
            } else {
                if (node.cornerRadius !== undefined) properties.borderRadius = node.cornerRadius;
                console.warn(`⚠️ 변수 ID 매핑 없음(모서리): ${cornerVarId} → px fallback`);
            }
        } else if (node.cornerRadius !== undefined) {
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

            // ✅ Select(Has Value=false) 변형: 내부 VALUE가 없으면 Label 텍스트를 label prop으로 승격
            // - Figma에서 Has Value=false인 Select는 valueText가 비어 props.value가 추출되지 않을 수 있음
            // - 이 경우에도 MUI 권장 패턴(FormControl+InputLabel, Select label/labelId)을 생성하려면 label이 필요
            if (componentType === 'input') {
                const mappingForNode = this.resolveNodeMapping(node, componentType).mapping;
                if (mappingForNode?.muiName === 'Select') {
                    const hasValue = getFigmaBooleanProp(node as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?');
                    if (hasValue === false && properties.label === undefined) {
                        const t = typeof properties.text === 'string' ? properties.text.trim() : '';
                        if (t) {
                            properties.label = t;
                        }
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
                            // boundVariables에서 Variable ID 추출
                            const fillObj = child.fills[0] as { boundVariables?: { color?: { id: string } } };
                            if (fillObj.boundVariables?.color?.id) {
                                const variableId = fillObj.boundVariables.color.id;
                                // Variable ID → 변수명 → MUI 경로 변환
                                const muiColorPath = await this.extractThemeTokenFromVariableId(variableId);
                                if (muiColorPath) {
                                    if (!isAvatarComponent) {
                                        properties.colorStyle = muiColorPath;
                                    }
                                    console.log(`🎨 Variable ID ${variableId} → ${muiColorPath}`);
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

            // 패딩: 공통 getPaddingFromNode 사용. boundVariables 있으면 테마 토큰(paddingStyle), 없으면 숫자(properties.padding).
            const layoutBound = (node as { boundVariables?: Record<string, { id: string }> }).boundVariables;
            const paddingObj = this.getPaddingFromNode(node);
            if (paddingObj) {
                // Figma 실제 px는 항상 보관 → generator에서 MUI spacing 오해 없이 'Npx'로 출력
                properties.padding = paddingObj;
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

        // FRAME 이름에 '버튼'이 있으면 componentType이 button으로 잡혀 layout 패딩 블록이 스킵됨 → 오토레이아웃 패딩만이라도 반영
        if (componentType !== 'layout' && node.type === 'FRAME') {
            const paddingObj = this.getPaddingFromNode(node);
            if (paddingObj) {
                const layoutBound = (node as { boundVariables?: Record<string, { id: string }> }).boundVariables;
                properties.padding = paddingObj;
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
            }
        }

        // FavoriteButton: Figma Selected → selected(boolean)
        try {
            const nodeName = (node as any).name || '';
            const isFavoriteButton = nodeName === '<FavoriteButton>' || nodeName === 'FavoriteButton';
            if (isFavoriteButton) {
                const rawProps = (node as any).componentProperties || {};
                const favoriteKey = Object.keys(rawProps).find(
                    (key) => key.toLowerCase() === 'selected',
                );
                if (favoriteKey) {
                    const raw = (rawProps as any)[favoriteKey];
                    let value: any;
                    if (raw && typeof raw === 'object' && 'value' in raw) {
                        value = (raw as any).value;
                    } else {
                        value = raw;
                    }
                    const boolVal =
                        typeof value === 'string' ? value.toLowerCase() === 'true' : Boolean(value);
                    (properties as any).selected = boolVal;
                }
            }
        } catch {}

        // StatusChip: Figma State → status (active/inactive/stop/undeployed/expired)
        try {
            const nodeName = (node as any).name || '';
            const isStatusChip = nodeName === '<StatusChip>' || nodeName === 'StatusChip';
            if (isStatusChip) {
                const rawProps = (node as any).componentProperties || {};
                const stateKey = Object.keys(rawProps).find(
                    (key) => key.toLowerCase() === 'state',
                );
                if (stateKey) {
                    const raw = (rawProps as any)[stateKey];
                    let value: any;
                    if (raw && typeof raw === 'object' && 'value' in raw) {
                        value = (raw as any).value;
                    } else {
                        value = raw;
                    }
                    if (typeof value === 'string') {
                        (properties as any).status = value.toLowerCase();
                    }
                }
            }
        } catch {}

        // ServerChip: Figma State → state (local/dev/stage)
        try {
            const nodeName = (node as any).name || '';
            const isServerChip = nodeName === '<ServerChip>' || nodeName === 'ServerChip';
            if (isServerChip) {
                const rawProps = (node as any).componentProperties || {};
                const stateKey = Object.keys(rawProps).find((key) => key.toLowerCase() === 'state');
                if (stateKey) {
                    const raw = (rawProps as any)[stateKey];
                    let value: any;
                    if (raw && typeof raw === 'object' && 'value' in raw) {
                        value = (raw as any).value;
                    } else {
                        value = raw;
                    }
                    if (typeof value === 'string') {
                        (properties as any).state = value.toLowerCase();
                    }
                }
            }
        } catch {}

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
     * 노드에서 padding 수치 객체 추출 (공통). 오토레이아웃 또는 padding* 필드가 있을 때만 반환.
     */
    private getPaddingFromNode(node: FigmaNode): { left: number; right: number; top: number; bottom: number } | undefined {
        const hasExplicit =
            node.paddingLeft !== undefined ||
            node.paddingRight !== undefined ||
            node.paddingTop !== undefined ||
            node.paddingBottom !== undefined;
        if ((node.layoutMode && node.layoutMode !== 'NONE') || hasExplicit) {
            return {
                left: node.paddingLeft ?? 0,
                right: node.paddingRight ?? 0,
                top: node.paddingTop ?? 0,
                bottom: node.paddingBottom ?? 0,
            };
        }
        return undefined;
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

        const paddingObj = this.getPaddingFromNode(node);
        if (paddingObj) layout.padding = paddingObj;

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
                colors[node.name.toLowerCase().replace(/\s+/g, '-')] = rgbaToHex(fill.color);
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
                        color: extractColorFromFill(fill),
                        styleName: styleInfo.name
                    };
                }
            }
            return {
                color: extractColorFromFill(fill)
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
                    color: extractColorFromFill(fillObj),
                    styleName: themeToken
                };
            }
        }

        // 스타일 ID가 있는 경우 스타일 이름 추출 (우선순위 2)
        if (fillObj.styleId) {
            const style = this.styleInfo.get(fillObj.styleId) as { name: string } | undefined;
            if (style) {
                return {
                    color: extractColorFromFill(fillObj),
                    styleName: style.name
                };
            }
        }

        // 스타일 ID가 없는 경우 기본 색상 추출
        return {
            color: extractColorFromFill(fillObj)
        };
    }

    /**
     * Variable ID에서 테마 토큰 이름 추출 (진실 소스만 사용)
     * @param variableId 피그마 Variable ID
     * @returns MUI 테마 토큰 이름
     */
    /**
     * Variable ID에서 MUI 테마 토큰 추출
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
     * Variable ID에서 shape 테마 토큰 추출 (borderRadius 등)
     * @param variableId Figma Variable ID
     * @returns MUI theme.shape 경로 (예: 'shape.borderRadius') 또는 null
     */
    private async extractShapeTokenFromVariableId(variableId: string): Promise<string | null> {
        const mapping = await this.variableMappingManager.getMapping(variableId);
        if (mapping) {
            const fromName = this.toMuiShapePath(mapping.variableName);
            if (fromName) return fromName;
            const p = mapping.muiThemePath;
            if (p && (p.startsWith('shape.') || /borderradius|radius/i.test(p))) return p.startsWith('shape.') ? p : `shape.${p}`;
        }
        const fromCache = this.variableInfo.get(variableId) as { name?: string } | undefined;
        if (fromCache?.name) {
            const path = this.toMuiShapePath(fromCache.name);
            if (path) return path;
        }
        const normalizedId = variableId.replace(/^VariableID:/i, '').split('/')[0]?.trim() || variableId;
        const fromCacheNorm = this.variableInfo.get(normalizedId) as { name?: string } | undefined;
        if (fromCacheNorm?.name) {
            const path = this.toMuiShapePath(fromCacheNorm.name);
            if (path) return path;
        }
        const varId = variableId.split('/').pop()!;
        try {
            const response = await fetch(`https://api.figma.com/v1/variables/${encodeURIComponent(varId)}`, {
                headers: { 'X-Figma-Token': this.token }
            });
            if (response.ok) {
                const data = await response.json();
                const name = data.name as string;
                const path = this.toMuiShapePath(name);
                if (path) return path;
            }
        } catch (e) {
            console.warn(`⚠️ Variables API 실패(shape): ${variableId}`, e);
        }
        return null;
    }

    /**
     * Figma 변수명 → theme.shape 경로 (borderRadius, borderRadiusMd 등)
     */
    private toMuiShapePath(variableName: string): string | null {
        const n = String(variableName || '').trim().replace(/\//g, '.').replace(/\s+/g, '');
        if (!n) return null;
        const lower = n.toLowerCase();
        if (lower === 'borderradius' || n === '4') return 'shape.borderRadius';
        if (lower === 'borderradiusmd' || n === '8') return 'shape.borderRadiusMd';
        if (lower === 'borderradiuslg' || lower === 'borderradiuslg' || n === '16') return 'shape.borderRadiusLg';
        if (n.includes('.')) return n.startsWith('shape.') ? n : `shape.${n}`;
        return `shape.${n}`;
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
     * 변수명을 MUI 색상 경로로 변환
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
