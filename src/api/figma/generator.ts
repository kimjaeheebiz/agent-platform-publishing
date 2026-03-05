import {
    PageDesignConfig,
    ComponentDesignConfig,
    LayoutConfig,
    ComponentProperties,
    PageComponentConfig,
    PageStyleTokens,
} from './types';
import { PageContentConfig } from './pageTemplateManager';
import { FIGMA_CONFIG } from './config';
import { findMappingByType, findMappingByFigmaName } from './component-mappings';
import { getSpacingTokenFromPx } from './variable-mapping';

/** MUI Table 구조 컴포넌트 (sx 미주입, 테마/기본 구조 사용). TableContainer는 제외(스크롤 등 sx 사용) */
const TABLE_STRUCTURE_MUI_NAMES = new Set([
    'Table', 'TableHead', 'TableBody', 'TableRow', 'TableCell', 'TableFooter',
]);

/** 피그마 인스턴스 이름이 @/components 와 동일한 커스텀 컴포넌트일 때 해당 컴포넌트를 주입 (MUI 매핑보다 우선) */
const CUSTOM_COMPONENT_FIGMA_NAMES = new Set<string>([
    '<FavoriteButton>',
    'FavoriteButton',
    '<StatusChip>',
    'StatusChip',
    '<FilterToggleGroup>',
    'FilterToggleGroup',
]);

function isCustomComponent(figmaName: string): boolean {
    const trimmed = (figmaName || '').trim();
    return CUSTOM_COMPONENT_FIGMA_NAMES.has(trimmed);
}

function getCustomComponentName(figmaName: string): string {
    const trimmed = (figmaName || '').trim();
    return trimmed.replace(/^<|>$/g, '') || trimmed;
}

import { getMuiIconName, hasIcon as hasIconProperty, getRequiredIconNames } from './icon-mapper';
import { toPascalCase } from './utils/string-utils';
import * as prettier from 'prettier';

export class FigmaCodeGenerator {
    /**
     * 전체 페이지 컴포넌트 코드 생성 (기존 구조에 맞게)
     * @param contentConfig 페이지 콘텐츠 설정
     * @returns React 컴포넌트 코드
     */
    async generatePageContent(contentConfig: PageContentConfig): Promise<string> {
        const { pageId, components } = contentConfig;

        // pageId에서 컴포넌트 이름 추출 (route-generator.ts와 동일한 로직)
        const componentName = this.getComponentNameFromPageId(pageId);
        const imports = this.generateImports(components);
        const pageCode = this.generatePageCode(componentName, components, pageId);

        const rawCode = `${imports}

${pageCode}`;

        // Prettier로 포맷팅
        return await this.formatCode(rawCode);
    }

    /**
     * 전체 페이지 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param components 컴포넌트 배열
     * @param pageId pages.ts의 id
     * @returns 전체 페이지 컴포넌트 코드
     */
    private generatePageCode(componentName: string, components: ComponentDesignConfig[], pageId: string): string {
        const componentJSX = this.generateComponentsJSX(components);

        // 페이지별 특수 import 추가
        const pageSpecificImports = this.generatePageSpecificImports(pageId);

        // 기본 padding 사용 (MUI spacing 변수)
        const paddingValue = 3; // spacing(3) = 24px

        return `${pageSpecificImports}

export const ${componentName}: React.FC = () => {
    return (
        <Box
            sx={{
                p: ${paddingValue},
                minHeight: '100%',
            }}
        >
            ${componentJSX}
        </Box>
    );
};`;
    }

    /**
     * 페이지 컴포넌트 코드 생성 (레거시 지원)
     * @param pageConfig 페이지 컴포넌트 설정
     * @returns React 컴포넌트 코드
     */
    generatePageComponent(pageConfig: PageComponentConfig): string {
        const { pageName, components, layout, styles } = pageConfig;

        const componentName = toPascalCase(pageName);
        const imports = this.generateImports(components);
        const componentCode = this.generateComponentCode(componentName, components, layout);
        const pageStyles = this.generatePageStyles(styles);

        return `${imports}

${componentCode}

${pageStyles}`;
    }

    /**
     * 페이지별 스타일 생성 (기존 테마와 충돌 방지) - 레거시 지원
     * @param styles 페이지 스타일 토큰
     * @returns 페이지 스타일 코드
     */
    generatePageStyles(styles: PageStyleTokens): string {
        const { colors, spacing, typography, layout } = styles;

        const colorStyles = Object.entries(colors)
            .map(([key, value]) => `    ${key}: '${value}',`)
            .join('\n');

        const spacingStyles = Object.entries(spacing)
            .map(([key, value]) => `    ${key}: '${value}',`)
            .join('\n');

        const typographyStyles = Object.entries(typography)
            .map(([key, config]) => {
                return `    ${key}: {
        fontFamily: '${config.fontFamily || 'inherit'}',
        fontSize: '${config.fontSize || '16px'}',
        fontWeight: ${config.fontWeight || 400},
        lineHeight: ${config.lineHeight || 1.5},
        letterSpacing: '${config.letterSpacing || '0px'}'
        },`;
            })
            .join('\n');

        return `// 페이지별 스타일 정의 (기존 테마와 충돌 방지)
export const pageStyles = {
    colors: {
${colorStyles}
    },
    spacing: {
${spacingStyles}
    },
    typography: {
${typographyStyles}
    },
    layout: {
        container: {
            maxWidth: '${layout.container?.maxWidth || '1200px'}',
            padding: ${this.parsePaddingToTheme(layout.container?.padding)}
        },
        grid: {
            columns: ${layout.grid?.columns || 12},
            gap: ${this.parsePaddingToTheme(layout.grid?.gap)}
        }
    }
};`;
    }

    /**
     * 컴포넌트 코드 생성
     * @param componentName 컴포넌트 이름
     * @param components 컴포넌트 배열
     * @param layout 레이아웃 설정
     * @returns 컴포넌트 코드
     */
    private generateComponentCode(
        componentName: string,
        components: ComponentDesignConfig[],
        layout: LayoutConfig,
    ): string {
        const jsxElements = components.map((component) => this.generateComponentJSX(component)).join('\n        ');

        const gapVal = layout.spacing != null ? this.mapSpacingToVariable(layout.spacing) : '0';
        const padVal = layout.padding
            ? (() => {
                const t = this.mapSpacingToVariable(layout.padding!.top);
                const r = this.mapSpacingToVariable(layout.padding!.right);
                const b = this.mapSpacingToVariable(layout.padding!.bottom);
                const l = this.mapSpacingToVariable(layout.padding!.left);
                return t === r && r === b && b === l ? `p: ${t}` : `p: [${t}, ${r}, ${b}, ${l}]`;
            })()
            : 'p: 0';
        return `export const ${componentName} = () => {
    return (
        <Box sx={{
            display: '${layout.containerType}',
            flexDirection: '${layout.direction}',
            gap: ${gapVal},
            ${padVal}
        }}>
            ${jsxElements}
        </Box>
    );
};`;
    }

    /**
     * 여러 컴포넌트 JSX 생성
     * @param components 컴포넌트 배열
     * @returns JSX 코드
     */
    private generateComponentsJSX(components: ComponentDesignConfig[]): string {
        if (components.length === 0) {
            return '            {/* No components defined */}';
        }

        return components.map((component) => this.generateComponentJSX(component)).join('\n\n');
    }

    /**
     * 컴포넌트 JSX 생성
     * @param component 컴포넌트 설정
     * @returns JSX 문자열
     */
    private generateComponentJSX(component: ComponentDesignConfig): string {
        const { componentType, componentName, properties, children } = component;

        // @/components 에 동일명 컴포넌트가 있으면 해당 컴포넌트 사용 (피그마 <FavoriteButton> 등)
        if (isCustomComponent(componentName)) {
            const customName = getCustomComponentName(componentName);
            const props = this.generateCustomComponentProps(customName, properties);
            return `<${customName}${props} />`;
        }

        // 먼저 componentName으로 매핑을 찾고, 없으면 componentType으로 찾음
        const mapping = findMappingByFigmaName(componentName) || findMappingByType(componentType);

        // layout, card, table 타입 및 하위 컴포넌트는 children 렌더링
        const isCardSubComponent = componentName === 'CardHeader' ||
            componentName === 'CardContent' ||
            componentName === 'CardActions' ||
            componentName === 'CardMedia';
        const isTableSubComponent = mapping ? TABLE_STRUCTURE_MUI_NAMES.has(mapping.muiName) : false;
        const isTableCellComponent = mapping?.muiName === 'TableCell';
        const shouldRenderChildren = (componentType === 'layout' || componentType === 'card' || componentType === 'table' || isCardSubComponent || isTableSubComponent) && children && children.length > 0;

        const isGridContainer =
            mapping?.muiName === 'Grid' &&
            (componentName === 'Grid' || componentName === '<Grid>') &&
            shouldRenderChildren;

        let content = '';
        if (shouldRenderChildren) {
            if (isGridContainer) {
                const layoutColumns = (properties as { layoutColumns?: number }).layoutColumns ?? 2;
                const itemSize = Math.floor(12 / layoutColumns);
                content = children
                    .map(
                        (child) =>
                            `<Grid size={${itemSize}}>\n            ${this.generateComponentJSX(child)}\n        </Grid>`,
                    )
                    .join('\n        ');
            } else {
                content = children.map((child) => this.generateComponentJSX(child)).join('\n        ');
            }
        } else {
            content = this.generateComponentContent(componentType, componentName, properties);
        }
        
        // TableCell의 경우: children이 없고 text가 있으면 text 사용
        if (isTableCellComponent && (!children || children.length === 0) && properties.text) {
            content = this.generateComponentContent(componentType, componentName, properties);
        }

        // ✅ 매핑에 generateJSX가 있으면 사용 (우선)
        if (mapping?.generateJSX) {
            const isStack = mapping.muiName === 'Stack';
            const sxProps = this.generateSXProps(properties, componentType, componentName, isStack);
            const componentProps = this.generateComponentProps(componentType, componentName, properties);
            return mapping.generateJSX(componentName, componentProps, content, sxProps, properties);
        }

        // ✅ 기본 생성 로직 (매핑 템플릿 없을 때)
        const muiComponent = mapping?.muiName || 'Box';
        const isStack = mapping?.muiName === 'Stack';

        const sxProps = isStack
            ? this.generateSXProps(properties, componentType, componentName, true)
            : this.generateSXProps(properties, componentType, componentName);
        const componentProps = this.generateComponentProps(componentType, componentName, properties);

        const sxAttribute = sxProps ? `sx={${sxProps}}` : '';

        return `<${muiComponent}
            ${componentProps}
            ${sxAttribute}
        >
        ${content}
        </${muiComponent}>`;
    }

    /**
     * @/components 커스텀 컴포넌트용 최소 props (피그마에서 추출 가능한 값만, 없으면 빈 문자열)
     */
    private generateCustomComponentProps(componentName: string, properties: ComponentProperties): string {
        const props: string[] = [];
        const p = properties as Record<string, unknown>;

        // FavoriteButton: true일 때만 shorthand prop으로 출력, false면 생략
        if (componentName === 'FavoriteButton' && typeof p.selected === 'boolean') {
            if (p.selected === true) {
                props.push('selected');
            }
        }
        if (componentName === 'StatusChip' && typeof p.status === 'string') {
            const status = String(p.status);
            if (status) {
                props.push(`status="${status}"`);
            }
        }
        if (props.length === 0) return '';
        return ' ' + props.join(' ');
    }

    /**
     * SX 속성 생성 (최적화된 버전)
     * @param properties 컴포넌트 속성
     * @param componentName 컴포넌트 이름
     * @param isStack Stack 컴포넌트인 경우 true
     * @returns SX 속성 문자열 또는 null (빈 객체인 경우)
     */
    private generateSXProps(properties: ComponentProperties, componentType: string, componentName?: string, isStack: boolean = false): string | null {
        // componentName이 있으면 figmaName으로 먼저 매핑을 찾음 (Box 등)
        const mapping = componentName
            ? (findMappingByFigmaName(componentName) || findMappingByType(componentType))
            : findMappingByType(componentType);

        const isGrid = mapping?.muiName === 'Grid';
        const isTableStructure = mapping ? TABLE_STRUCTURE_MUI_NAMES.has(mapping.muiName) : false;
        if (isTableStructure) {
            return null;
        }

        const sxProps: string[] = [];

        // layout 타입인 경우 Auto Layout 속성 추가 (Grid는 prop으로 처리하므로 sx 제외)
        if (componentType === 'layout' && !isGrid) {
            // display: flex - Stack인 경우 제외 (기본값이므로 불필요)
            if (properties.display && !isStack) {
                sxProps.push(`display: '${properties.display}'`);
            }

            // flexDirection - Stack인 경우 제외 (direction prop으로 처리)
            if (properties.flexDirection && !isStack) {
                sxProps.push(`flexDirection: '${properties.flexDirection}'`);
            }

            // justifyContent - Stack인 경우 제외 (justifyContent prop으로 처리)
            if (properties.justifyContent && !isStack) {
                sxProps.push(`justifyContent: '${properties.justifyContent}'`);
            }

            // alignItems - Stack인 경우 제외 (alignItems prop으로 처리)
            if (properties.alignItems && !isStack) {
                sxProps.push(`alignItems: '${properties.alignItems}'`);
            }

            // gap - 테마 토큰(gapStyle) 우선, 없으면 숫자를 theme.spacing으로 변환. px 하드코딩 없음.
            const gapStyle = (properties as { gapStyle?: string }).gapStyle;
            if (gapStyle !== undefined && !isStack) {
                const n = this.spacingTokenToNumber(gapStyle);
                sxProps.push(`gap: ${n}`);
            } else if (properties.gap && !isStack) {
                sxProps.push(`gap: ${this.mapSpacingToVariable(properties.gap)}`);
            }

            // padding - 테마 토큰(paddingStyle) 우선, 없으면 숫자를 theme.spacing으로 변환. px 하드코딩 없음.
            const paddingStyle = (properties as { paddingStyle?: { left?: string; right?: string; top?: string; bottom?: string } }).paddingStyle;
            if (paddingStyle && (paddingStyle.top !== undefined || paddingStyle.right !== undefined || paddingStyle.bottom !== undefined || paddingStyle.left !== undefined)) {
                const t = this.spacingTokenToNumber(paddingStyle.top ?? '0');
                const r = this.spacingTokenToNumber(paddingStyle.right ?? '0');
                const b = this.spacingTokenToNumber(paddingStyle.bottom ?? '0');
                const l = this.spacingTokenToNumber(paddingStyle.left ?? '0');
                if (t === r && r === b && b === l) {
                    sxProps.push(`p: ${t}`);
                } else {
                    sxProps.push(`p: [${t}, ${r}, ${b}, ${l}]`);
                }
            } else if (properties.padding) {
                if (typeof properties.padding === 'object') {
                    const { left, right, top, bottom } = properties.padding;
                    const t = this.mapSpacingToVariable(top);
                    const r = this.mapSpacingToVariable(right);
                    const b = this.mapSpacingToVariable(bottom);
                    const l = this.mapSpacingToVariable(left);
                    if (t === r && r === b && b === l) {
                        sxProps.push(`p: ${t}`);
                    } else {
                        sxProps.push(`p: [${t}, ${r}, ${b}, ${l}]`);
                    }
                } else {
                    const v = this.mapSpacingToVariable(properties.padding);
                    sxProps.push(`p: ${v}`);
                }
            }
        }

        // 매핑에서 excludeFromSx 확인
        const excludeList = mapping?.excludeFromSx || [];

        // width/height 처리
        // - 고정 사이즈(px): width 추가
        // - 허그(hug): width 없음
        // - 채우기(fill): width 없음, 하지만 layout 계열 flex 자식이면 flex: 1 추가
        const absW = (properties as any).absoluteWidth;
        const absH = (properties as any).absoluteHeight;
        const isFlexChild = (properties as any).isFlexChild;

        if (!excludeList.includes('width')) {
            if (properties.width && properties.width !== 'fill' && properties.width !== 'hug') {
                // 고정 사이즈
                sxProps.push(`width: '${properties.width}px'`);
            } else if (
                properties.width === 'fill' &&
                isFlexChild &&
                componentType === 'layout' &&
                !excludeList.includes('flex')
            ) {
                // 채우기이고 flex 자식인 경우 flex: 1 추가 (excludeFromSx에 flex가 없을 때만)
                // 단, layout 계열(Box/Stack/Grid 등)에만 적용하고 Typography 등에는 적용하지 않음
                sxProps.push(`flex: 1`);
            }
        }
        if (!excludeList.includes('height')) {
            if (properties.height && properties.height !== 'fill' && properties.height !== 'hug') {
                sxProps.push(`height: '${properties.height}px'`);
            }
        }
        if (componentType !== 'button' && !excludeList.includes('backgroundColor')) {
            // 색상 속성: 테마 변수명(colorStyle)만 사용, HEX는 backgroundColor로만 fallback
            if (properties.colorStyle && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(properties.colorStyle)) {
                const themeColor = properties.colorStyle.startsWith('palette.')
                    ? properties.colorStyle.replace(/^palette\./, '')
                    : properties.colorStyle;
                if (componentType === 'typography') {
                    if (themeColor !== 'text.primary') sxProps.push(`color: '${themeColor}'`);
                } else {
                    sxProps.push(`backgroundColor: '${themeColor}'`);
                }
            } else if (properties.backgroundColor && properties.backgroundColor !== 'transparent' && !properties.colorStyle) {
                if (componentType === 'typography') {
                    const bg = properties.backgroundColor;
                    if (bg !== 'text.primary' && !String(bg).includes('text.primary')) sxProps.push(`color: '${bg}'`);
                } else {
                    sxProps.push(`backgroundColor: '${properties.backgroundColor}'`);
                }
            }
        }

        // excludeFromSx에 있는 속성들은 sx에서 제외
        // TableContainer + Paper + variant="outlined"이면 테두리는 Paper가 처리
        const shouldExcludeBorders =
            (mapping?.muiName === 'TableContainer' && properties.component === 'Paper' && properties.variant === 'outlined') ||
            excludeList.includes('borderColor') || excludeList.includes('borderWidth');

        if (!shouldExcludeBorders && !excludeList.includes('borderRadius')) {
            if (properties.borderColor) sxProps.push(`borderColor: '${properties.borderColor}'`);
            if (properties.borderWidth) sxProps.push(`borderWidth: '${properties.borderWidth}px'`);
        }
        if (!excludeList.includes('borderRadius')) {
            if (properties.borderRadius) sxProps.push(`borderRadius: '${properties.borderRadius}px'`);
        }
        if (properties.opacity) sxProps.push(`opacity: ${properties.opacity}`);

        // gap은 테마 토큰만 사용 (layout 타입이 아닌 경우만). px 하드코딩 없음.
        const gapStyle = (properties as { gapStyle?: string }).gapStyle;
        if (gapStyle !== undefined && componentType !== 'layout') {
            sxProps.push(`gap: ${this.spacingTokenToNumber(gapStyle)}`);
        } else if (properties.gap && componentType !== 'layout') {
            sxProps.push(`gap: ${this.mapSpacingToVariable(properties.gap)}`);
        }

        // excludeFromSx에 있는 속성들은 sx에서 제외 (layout 타입이 아닌 경우만)
        if (componentType !== 'layout' && !excludeList.includes('justifyContent') && !excludeList.includes('alignItems')) {
            if (properties.justifyContent) sxProps.push(`justifyContent: '${properties.justifyContent}'`);
            if (properties.alignItems) sxProps.push(`alignItems: '${properties.alignItems}'`);
        }

        // 속성이 없으면 null 반환 (sx 속성 자체를 제거)
        if (sxProps.length === 0) {
            return null;
        }

        return `{
            ${sxProps.join(',\n            ')}
        }`;
    }

    /**
     * 컴포넌트별 속성 생성
     * @param componentType 컴포넌트 타입
     * @param properties 컴포넌트 속성
     * @returns 컴포넌트 속성 문자열
     */
    private generateComponentProps(componentType: string, componentName: string, properties: ComponentProperties): string {
        const props: string[] = [];

        // ✅ 매핑 기반으로 props 생성 (componentName 우선, 없으면 componentType 사용)
        const mapping = findMappingByFigmaName(componentName) || findMappingByType(componentType);
        const muiProps = mapping?.muiProps;

        // 새 매핑 시스템 사용 (동적 처리)
        if (mapping && muiProps) {
            let transformedProperties = properties;
            if (mapping.transformProps) {
                transformedProperties = mapping.transformProps(properties);
            }
            
            for (const [propName, propDef] of Object.entries(muiProps)) {
                // Grid: layoutColumns는 자식 size 계산용, JSX에는 미출력
                if (propName === 'layoutColumns') continue;

                const value = transformedProperties[propName];

                // union 타입인 경우 values에 포함된 값만 추가
                if (propDef.type === 'union' && value !== undefined) {
                    const normalizedValue = typeof value === 'string' ? value.toLowerCase() : value;
                    const normalizedValues = propDef.values?.map(v => typeof v === 'string' ? v.toLowerCase() : v);
                    const isIncluded = normalizedValues?.includes(normalizedValue as any);
                    if (isIncluded) {
                        // TableCell align: 기본값 left는 미출력, center/right만 출력
                        if (mapping?.muiName === 'TableCell' && propName === 'align' && normalizedValue === 'left') continue;
                        if (propDef.default !== undefined) {
                            const normalizedDefault = typeof propDef.default === 'string' ? propDef.default.toLowerCase() : propDef.default;
                            if (normalizedValue === normalizedDefault) continue;
                        }
                        if (typeof value === 'string') {
                            props.push(`${propName}="${value}"`);
                        } else {
                            props.push(`${propName}={${value}}`);
                        }
                    }
                }
                // union-number 타입인 경우 (Stack spacing은 gapStyle만 있어도 출력)
                else if (propDef.type === 'union-number') {
                    const isStackSpacingFromGapStyle =
                        mapping?.muiName === 'Stack' && propName === 'spacing' && (transformedProperties as { gapStyle?: string }).gapStyle;
                    if (value !== undefined && value !== null || isStackSpacingFromGapStyle) {
                        const numValue =
                            value !== undefined && value !== null
                                ? (typeof value === 'number' ? value : parseInt(value as string, 10))
                                : undefined;
                        if (numValue !== undefined && propDef.default !== undefined && numValue === propDef.default && !isStackSpacingFromGapStyle) continue;
                        if (numValue !== undefined && isNaN(numValue) && !isStackSpacingFromGapStyle) continue;

                        // Grid: rowSpacing·columnSpacing 동일하면 spacing 하나만 출력
                        if (numValue !== undefined && mapping?.muiName === 'Grid' && (propName === 'rowSpacing' || propName === 'columnSpacing')) {
                            const row = (transformedProperties as { rowSpacing?: number }).rowSpacing;
                            const col = (transformedProperties as { columnSpacing?: number }).columnSpacing;
                            const rowNum = row != null ? (typeof row === 'number' ? row : parseInt(String(row), 10)) : undefined;
                            const colNum = col != null ? (typeof col === 'number' ? col : parseInt(String(col), 10)) : undefined;
                            if (rowNum != null && colNum != null && rowNum === colNum) {
                                if (propName === 'columnSpacing') continue;
                                props.push(`spacing={${this.mapSpacingToVariable(numValue)}}`);
                                continue;
                            }
                        }

                        // Stack: gapStyle(변수/토큰 파일) 우선 → 테마 반영. "0,5" → 0.5 정규화
                        if (mapping?.muiName === 'Stack' && propName === 'spacing') {
                            if (transformedProperties.justifyContent === 'space-between') continue;
                            const gapStyle = (transformedProperties as { gapStyle?: string }).gapStyle;
                            let spacingVal: number | undefined;
                            if (gapStyle !== undefined) {
                                const normalized = typeof gapStyle === 'string' ? gapStyle.replace(',', '.').trim() : String(gapStyle);
                                const asNum = Number(normalized);
                                spacingVal = Number.isNaN(asNum) ? this.spacingTokenToNumber(gapStyle) : asNum;
                            } else {
                                spacingVal = numValue;
                            }
                            if (spacingVal !== undefined) props.push(`${propName}={${spacingVal}}`);
                            continue;
                        }
                        if (numValue === undefined) continue;
                        if (componentType === 'layout' && propName === 'spacing') {
                            const spacingStyle = (transformedProperties as { gapStyle?: string }).gapStyle;
                            const spacingVal = spacingStyle !== undefined ? this.spacingTokenToNumber(spacingStyle) : this.mapSpacingToVariable(numValue);
                            props.push(`${propName}={${spacingVal}}`);
                        } else {
                            const mapped = (propName === 'spacing' || propName === 'rowSpacing' || propName === 'columnSpacing') ? this.mapSpacingToVariable(numValue) : numValue;
                            props.push(`${propName}={${mapped}}`);
                        }
                    }
                }
                // boolean 타입인 경우
                else if (typeof value === 'boolean' && propDef.type === 'boolean') {
                    // Chip deletable → onDelete는 아래 Chip 전용 블록에서 처리
                    if (propName === 'deletable' && mapping?.muiName === 'Chip') continue;
                    // 기본값인 경우 스킵 (MUI 기본값은 false)
                    const defaultValue = propDef.default !== undefined ? propDef.default : false;
                    if (value === defaultValue) {
                        continue;
                    }
                    // true는 prop만 출력 (container={true} → container)
                    props.push(value === true ? propName : `${propName}={${value}}`);
                }
                // string 타입인 경우
                else if (typeof value === 'string' && propDef.type === 'string') {
                    // 기본값인 경우 스킵
                    if (propDef.default !== undefined && value === propDef.default) {
                        continue;
                    }

                    // component prop은 컴포넌트로 처리 (예: 'Paper' -> {Paper})
                    if (propName === 'component') {
                        props.push(`${propName}={${value}}`);
                    } else {
                    props.push(`${propName}="${value}"`);
                    }
                }
                // object 타입 (예: Grid v7 size={{ xs: 12, sm: 6 }})
                else if (propDef.type === 'object' && value !== undefined && value !== null && typeof value === 'object' && !Array.isArray(value)) {
                    const entries = Object.entries(value).filter(([, v]) => v !== undefined && v !== null);
                    if (entries.length === 0) continue;
                    const objStr = entries.map(([k, v]) => `${k}: ${typeof v === 'string' ? `"${v}"` : v}`).join(', ');
                    props.push(`${propName}={{{objStr}}}`);
                }
                // react-node 타입은 아이콘 컴포넌트로 처리
                else if (propDef.type === 'react-node') {
                    // value가 false인 경우 아이콘 추가하지 않음
                    if (value === false) {
                        continue; // 아무것도 추가하지 않음
                    }

                    // value가 true이거나 undefined인 경우에만 아이콘 생성
                    if (value === true || value === undefined) {
                        const iconComponentId = propName === 'startIcon'
                            ? properties.startIconComponentId
                            : properties.endIconComponentId;

                        if (iconComponentId) {
                            // 아이콘 이름도 함께 전달 (우선순위 1)
                            const iconName = propName === 'startIcon'
                                ? properties.startIconName
                                : properties.endIconName;

                            const muiIconName = getMuiIconName(iconComponentId, iconName as string);

                            // 매핑된 아이콘 사용 (null이면 아이콘 생성하지 않음)
                            if (muiIconName) {
                                props.push(`${propName}={<${muiIconName} />}`);
                            }
                            // 매핑 실패 시 아이콘 생성하지 않음
                        } else if (value === true) {
                            // 아이콘 ID가 없으면 아이콘 생성하지 않음
                            // value가 true지만 아이콘 ID가 없으면 아무것도 추가하지 않음
                        }
                    }
                }
            }
        }

        // ✅ TextField: slotProps.input / Select: InputBase 상속으로 startAdornment·endAdornment 직접 prop
        const hasAdorn = properties.startIconName || properties.endIconName;
        if (hasAdorn) {
            if (mapping?.muiName === 'TextField') {
                const adornParts: string[] = [];
                if (properties.startIconName) {
                    const muiIcon = getMuiIconName(properties.startIconComponentId || '', properties.startIconName);
                    if (muiIcon) {
                        adornParts.push(`startAdornment: <InputAdornment position="start"><${muiIcon} /></InputAdornment>`);
                    }
                }
                if (properties.endIconName) {
                    const muiIcon = getMuiIconName(properties.endIconComponentId || '', properties.endIconName);
                    if (muiIcon) {
                        adornParts.push(`endAdornment: <InputAdornment position="end"><${muiIcon} /></InputAdornment>`);
                    }
                }
                if (adornParts.length > 0) {
                    props.push(`slotProps={{ input: { ${adornParts.join(', ')} } }}`);
                }
            } else if (mapping?.muiName === 'Select') {
                if (properties.startIconName) {
                    const muiIcon = getMuiIconName(properties.startIconComponentId || '', properties.startIconName);
                    if (muiIcon) {
                        props.push(`startAdornment={<InputAdornment position="start"><${muiIcon} /></InputAdornment>}`);
                    }
                }
                if (properties.endIconName) {
                    const muiIcon = getMuiIconName(properties.endIconComponentId || '', properties.endIconName);
                    if (muiIcon) {
                        props.push(`endAdornment={<InputAdornment position="end"><${muiIcon} /></InputAdornment>}`);
                    }
                }
            }
        }

        // ✅ Chip: Deletable(onDelete), Adornments(avatar/icon) — https://mui.com/material-ui/react-chip/#deletable #chip-adornments
        if (mapping?.muiName === 'Chip') {
            if ((properties as any).deletable === true) {
                props.push('onDelete={() => {}}');
            }
            const chipAvatarInitials = (properties as any).__chipAvatarInitials;
            const chipIconName = (properties as any).__chipIconName;
            if (typeof chipAvatarInitials === 'string' && chipAvatarInitials) {
                const escaped = chipAvatarInitials.replace(/"/g, '\\"');
                props.push(`avatar={<Avatar>${escaped}</Avatar>}`);
            } else if (typeof chipIconName === 'string' && chipIconName) {
                const muiIconName = getMuiIconName('', chipIconName);
                if (muiIconName) {
                    props.push(`icon={<${muiIconName} />}`);
                }
            }
        }

        return props.length > 0 ? ` ${props.join(' ')}` : '';
    }

    /**
     * 테마 토큰 경로(예: "1", "2", "0.5")를 theme.spacing(n) 인자 숫자로 변환
     * "0,5" 같은 형식도 허용
     */
    private spacingTokenToNumber(token: string): number {
        const normalized = token.replace(',', '.').trim();
        const n = parseFloat(normalized);
        return Number.isNaN(n) ? 0 : n;
    }

    /**
     * 페이지 스타일용: padding/gap 값(문자열 '16px' 또는 숫자)을 theme.spacing 인자로 변환
     */
    private parsePaddingToTheme(val: string | number | undefined): string {
        if (val === undefined) return '2';
        const num = typeof val === 'string' ? parseInt(val.replace(/[^\d]/g, ''), 10) : val;
        return this.mapSpacingToVariable(Number.isNaN(num) ? 16 : num);
    }

    /**
     * spacing 값을 테마 배수로 매핑 (px → spacing 토큰 번호).
     * - px 값인 경우: 디자인 토큰(Mode 1.json)에서 역매핑 → 토큰 이름("1", "0.5" 등)
     * - 이미 토큰 문자열인 경우: 그대로 사용
     * 하드코딩된 px↔토큰 매핑은 사용하지 않고, 토큰 파일/변수만을 신뢰한다.
     */
    private mapSpacingToVariable(spacingValue: number | string): string {
        // 이미 토큰 같은 값 ("1", "0.5")이면 그대로 사용
        if (typeof spacingValue === 'string') {
            const trimmed = spacingValue.trim().replace(',', '.');
            // 순수 숫자 토큰이면 그대로 반환
            if (/^\d+(\.\d+)?$/.test(trimmed)) {
                return trimmed;
            }
            // "16px" 같은 px 문자열인 경우: 숫자 추출 후 토큰 역매핑
            const numeric = parseFloat(trimmed.replace(/[^\d.]/g, ''));
            if (!Number.isNaN(numeric)) {
                const token = getSpacingTokenFromPx(numeric);
                return token ?? `${numeric}`;
            }
            // 그 외 형식은 그대로 반환 (사용자가 직접 관리하는 토큰 경로 등)
            return trimmed;
        }

        // number인 경우: 먼저 px → 토큰 역매핑 시도 (spacing 1=8px 같이 정의된 값)
        const token = getSpacingTokenFromPx(spacingValue);
        if (token) {
            return token;
        }
        // 토큰 매핑이 없으면 숫자 그대로 반환
        return `${spacingValue}`;
    }

    /**
     * 컴포넌트 내용 생성 (매핑 기반)
     * @param componentType 컴포넌트 타입
     * @param componentName 컴포넌트 이름
     * @param properties 컴포넌트 속성
     * @returns 컴포넌트 내용 문자열
     */
    private generateComponentContent(componentType: string, componentName: string, properties: ComponentProperties): string {
        const mapping = findMappingByFigmaName(componentName) || findMappingByType(componentType);

        // ✅ 매핑에 extractContent가 있으면 사용
        if (mapping?.extractContent) {
            // extractContent는 FigmaNode를 받아야 하므로 properties에서 필요한 값만 사용
            const mockNode = { characters: properties.text, children: [] } as any;
            const content = mapping.extractContent(mockNode);
            if (content) return this.escapeHtml(content);
        }

        // ✅ 기본 추론 로직 (하드코딩 제거)
        if (properties.text) return this.escapeHtml(properties.text);
        if (properties.label) return this.escapeHtml(properties.label);

        return '';
    }

    /**
     * HTML 태그를 이스케이프하여 JSX에서 안전하게 사용할 수 있도록 함
     * @param text 원본 텍스트
     * @returns 이스케이프된 텍스트
     */
    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Import 문 생성
     * @param components 컴포넌트 배열
     * @returns Import 문 문자열
     */
    private generateImports(components: ComponentDesignConfig[]): string {
        const imports = new Set<string>();
        const iconImports = new Set<string>();
        const customComponentImports = new Set<string>();

        // 기본 MUI 컴포넌트들
        imports.add('Box');

        // 컴포넌트별 필요한 임포트 추가 (children 포함)
        this.collectImportsRecursively(components, imports, iconImports, customComponentImports);

        const importsList = Array.from(imports).join(', ');
        let iconImportsList = '';
        if (iconImports.size > 0) {
            iconImportsList = `\nimport { ${Array.from(iconImports).join(', ')} } from '@mui/icons-material';`;
        }
        let customImportsList = '';
        if (customComponentImports.size > 0) {
            customImportsList = `\nimport { ${Array.from(customComponentImports).sort().join(', ')} } from '@/components';`;
        }

        return `import React from 'react';
import { ${importsList} } from '@mui/material';${iconImportsList}${customImportsList}`;
    }

    /**
     * 컴포넌트와 그 children을 재귀적으로 순회하며 필요한 import 수집
     * @param customComponentImports @/components 에서 가져올 커스텀 컴포넌트명 (FavoriteButton, StatusChip 등)
     */
    private collectImportsRecursively(
        components: ComponentDesignConfig[],
        imports: Set<string>,
        iconImports: Set<string>,
        customComponentImports: Set<string>
    ): void {
        components.forEach((component) => {
            // ✅ 피그마 인스턴스가 @/components 와 동일명이면 커스텀 컴포넌트 import만 추가 (MUI 매핑 사용 안 함)
            if (isCustomComponent(component.componentName)) {
                customComponentImports.add(getCustomComponentName(component.componentName));
                if (component.children?.length) {
                    this.collectImportsRecursively(component.children, imports, iconImports, customComponentImports);
                }
                return;
            }

            // ✅ 컴포넌트 이름으로 직접 매핑 찾기
            const mapping = findMappingByFigmaName(component.componentName) || findMappingByType(component.componentType);
            const muiComponent = mapping?.muiName;

            if (muiComponent) {
                imports.add(muiComponent);

                // Select 등 JSX 내부에서 사용하는 subComponents(MenuItem 등) import
                if (mapping?.subComponents) {
                    mapping.subComponents.forEach((name: string) => imports.add(name));
                }

                // TableContainer가 component={Paper} 같은 프롭으로 다른 MUI 컴포넌트를 참조하는 경우 해당 컴포넌트도 import
                const referencedComponent = (component.properties as any)?.component;
                if (typeof referencedComponent === 'string') {
                    // 현재는 Paper만 필요하지만, 일반화하여 사용자가 지정한 컴포넌트를 그대로 import 셋에 추가
                    // 유효한 MUI 컴포넌트명이라고 가정 (예: 'Paper')
                    imports.add(referencedComponent);
                }

                // ✅ 매핑 기반 아이콘 import 추가 (하드코딩 제거)
                if (component.properties && hasIconProperty(component.properties)) {
                    const iconNames = getRequiredIconNames(component.properties);
                    iconNames.forEach(iconName => iconImports.add(iconName));
                }
                // ✅ TextField / Select 어돈먼트 사용 시 InputAdornment import
                const hasAdorn = component.properties && (component.properties.startIconName || component.properties.endIconName);
                if ((muiComponent === 'TextField' || muiComponent === 'Select') && hasAdorn) {
                    imports.add('InputAdornment');
                }
                // ✅ Select에 라벨이 있으면 FormControl + InputLabel 래핑 시 사용
                if (muiComponent === 'Select' && component.properties && (component.properties as any).label) {
                    imports.add('FormControl');
                    imports.add('InputLabel');
                }

                // ✅ Chip adornments (avatar/icon) — https://mui.com/material-ui/react-chip/#chip-adornments
                if (muiComponent === 'Chip' && component.properties) {
                    if ((component.properties as any).__chipAvatarInitials) {
                        imports.add('Avatar');
                    }
                    const chipIcon = (component.properties as any).__chipIconName;
                    if (typeof chipIcon === 'string' && chipIcon) {
                        const muiIcon = getMuiIconName('', chipIcon);
                        if (muiIcon) iconImports.add(muiIcon);
                    }
                }

                // ✅ layout, card, table 타입이거나 children이 있는 경우 children도 처리
                // 실제로 사용되는 컴포넌트만 재귀적으로 import하므로 subComponents는 자동으로 처리됨
                if ((component.componentType === 'layout' || component.componentType === 'card' || component.componentType === 'table' || component.children) && component.children) {
                    this.collectImportsRecursively(component.children, imports, iconImports, customComponentImports);
                }
            }
        });
    }

    /**
     * 컴포넌트 이름을 유효한 JavaScript 식별자로 정리
     * @param name 원본 컴포넌트 이름
     * @param componentType 컴포넌트 타입
     * @param index 인덱스 (중복 시 사용)
     * @returns 유효한 컴포넌트 이름
     */
    private sanitizeComponentName(name: string, componentType: string, index: number): string {
        const sanitized = toPascalCase(name);

        // 빈 문자열이거나 유효하지 않은 경우 컴포넌트 타입 기반으로 생성
        if (!sanitized || sanitized.length === 0) {
            return `${toPascalCase(componentType)}${index + 1}`;
        }

        return sanitized;
    }


    /**
     * 피그마 스타일 이름을 디자인 토큰으로 매핑
     * @param figmaStyleName 피그마 스타일 이름
     * @returns 디자인 토큰 이름
     */
    private mapFigmaStyleToDesignToken(figmaStyleName: string): string {
        // 피그마 스타일 이름을 MUI 테마 토큰으로 변환
        // 이미 올바른 형태인 경우 그대로 반환 (primary.light)
        // 슬래시가 있는 경우 점으로 변환 (text/secondary -> text.secondary)
        return figmaStyleName.includes('/') ? figmaStyleName.replace(/\//g, '.') : figmaStyleName;
    }

    /**
     * 피그마 이름을 유효한 JavaScript 식별자로 변환
     * @param name 피그마에서 추출된 이름
     * @returns 유효한 JavaScript 식별자
     */
    private sanitizePropertyName(name: string): string {
        return (name
            // < > 제거
            .replace(/[<>]/g, '')
            // 하이픈을 camelCase로 변환
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
            // 숫자로 시작하는 경우 앞에 문자 추가
            .replace(/^(\d)/, 'item$1')
            // 특수문자 제거
            .replace(/[^a-zA-Z0-9_]/g, '') || // 빈 문자열인 경우 기본값
        'item');
    }

    /**
     * TypeScript 타입 정의 생성 (기존 데이터 타입 고려)
     * @param pageDesign 페이지 디자인 설정
     * @returns TypeScript 타입 정의
     */
    async generateTypeDefinitions(pageDesign: PageDesignConfig, pageId: string): Promise<string> {
        const { components } = pageDesign;
        const componentName = this.getComponentNameFromPageId(pageId);

        // 페이지별 특수 타입 정의
        const pageSpecificTypes = this.generatePageSpecificTypes(pageId);

        const usedNames = new Set<string>();
        const componentTypes = components
            .map((component, index) => {
                const componentName = this.sanitizeComponentName(component.componentName, component.componentType, index);

                // 중복된 이름 방지
                let finalName = componentName;
                let counter = 1;
                while (usedNames.has(finalName)) {
                    finalName = `${componentName}${counter}`;
                    counter++;
                }
                usedNames.add(finalName);

                return `export type ${finalName}Props = object;`;
            })
            .join('\n\n');

        const rawTypeCode = `// Generated types for ${componentName}
// Note: Basic data types (User, etc.) are defined in @/data

${pageSpecificTypes}

${componentTypes}

export type ${componentName}Props = object;`;

        // Prettier로 포맷팅
        return await this.formatCode(rawTypeCode);
    }

    /**
     * pageId에서 컴포넌트 이름 추출 (route-generator.ts와 동일한 로직)
     * @param pageId pages.ts의 id
     * @returns PascalCase 컴포넌트 이름
     */
    private getComponentNameFromPageId(pageId: string): string {
        const pathParts = pageId.split('.');
        const last = pathParts[pathParts.length - 1];

        return last
            .split(/[-_]/)
            .map((p) => (p.length > 0 ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p))
            .join('');
    }

    /**
     * 페이지별 특수 import 생성 (실제 프로젝트 구조 고려)
     * @param pageId pages.ts의 id
     * @returns 페이지별 import 문
     */
    private generatePageSpecificImports(pageId: string): string {
        const componentName = this.getComponentNameFromPageId(pageId);
        return `// Import page-specific types
import { ${componentName}PageState } from './${componentName}.types';`;
    }

    /**
     * 페이지별 특수 타입 생성 (실제 프로젝트 구조 고려)
     * @param pageId pages.ts의 id
     * @returns 페이지별 타입 정의
     */
    private generatePageSpecificTypes(pageId: string): string {
        const lowerPageId = pageId.toLowerCase();

        switch (lowerPageId) {
            case 'users':
                return `// Import global User type
import { User } from '@/types';

// Page-specific types for Users
export interface UsersPageState {
    selectedFilter: 'all' | 'user' | 'admin';
    searchKeyword: string;
    isLoading: boolean;
    error: string | null;
}

export interface UsersTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: number) => void;
    isLoading: boolean;
}

export interface UsersFilterProps {
    selectedFilter: 'all' | 'user' | 'admin';
    onFilterChange: (filter: 'all' | 'user' | 'admin') => void;
}

export interface UsersSearchProps {
    searchKeyword: string;
    onSearchChange: (keyword: string) => void;
}

// API 관련 타입
export interface UsersApiResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateUserRequest {
    name: string;
    id: string;
    department: string;
    permission: 'user' | 'admin';
}`;

            case 'project':
                return `// Import global Project type
import { Project } from '@/types';

// Page-specific types for Project
export interface ProjectPageState {
    selectedProject: string | null;
    viewMode: 'list' | 'grid';
    isLoading: boolean;
    error: string | null;
}

export interface ProjectCardProps {
    project: Project;
    onSelect: (projectId: string) => void;
    onEdit: (project: Project) => void;
}

// API 관련 타입
export interface ProjectApiResponse {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
}`;

            default:
                const componentName = this.getComponentNameFromPageId(pageId);
                return `// Page-specific types for ${componentName}
export interface ${componentName}PageState {
    isLoading: boolean;
    error: string | null;
    // Add page-specific state types here
}`;
        }
    }
    /**
     * 컴포넌트 Props 타입 생성 (매핑 기반)
     * @param component 컴포넌트 설정
     * @returns Props 타입 문자열
     */
    private generateComponentPropsType(component: ComponentDesignConfig): string {
        const { componentType } = component;
        const props: string[] = [];

        // ✅ 매핑에서 props 가져오기
        const mapping = findMappingByType(componentType);
        if (mapping?.muiProps) {
            for (const [propName, propDef] of Object.entries(mapping.muiProps)) {
                let typeStr = '';

                if (propDef.type === 'union' && propDef.values) {
                    // union 타입
                    typeStr = `"${propDef.values.join('" | "')}"`;
                } else if (propDef.type === 'boolean') {
                    typeStr = 'boolean';
                } else if (propDef.type === 'string') {
                    typeStr = 'string';
                } else if (propDef.type === 'number' || propDef.type === 'union-number') {
                    typeStr = 'number';
                } else if (propDef.type === 'react-node') {
                    typeStr = 'React.ReactNode';
                } else {
                    typeStr = 'any';
                }

                // optional로 설정
                props.push(`${propName}?: ${typeStr}`);
            }
        }

        // ✅ 추가 이벤트 핸들러 (특수 케이스)
        if (componentType === 'button') {
            props.push('onClick?: () => void');
        } else if (componentType === 'input') {
            props.push('onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void');
            props.push('placeholder?: string');
        }

        return props.join(';\n    ');
    }

    /**
     * 기존 코드와 피그마 디자인 병합 (하이브리드 접근법)
     * @param existingCode 기존 컴포넌트 코드
     * @param figmaComponents 피그마에서 추출된 컴포넌트 정보
     * @returns 병합된 컴포넌트 코드
     */
    public mergeWithExistingCode(
        existingCode: string,
        figmaComponents: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        },
    ): string {
        // 기존 코드에서 주요 부분 추출
        const existingImports = this.extractImports(existingCode);
        const existingLogic = this.extractLogic(existingCode);
        const existingJSX = this.extractJSX(existingCode);

        // 피그마 스타일 적용
        const mergedJSX = this.applyFigmaStyles(existingJSX, figmaComponents);

        // 병합된 코드 생성
        return `${existingImports}

${existingLogic}

export const Users = () => {
    ${this.extractStateAndLogic(existingCode)}
    
    return (
        ${mergedJSX}
    );
};
`;
    }

    /**
     * 기존 코드에서 임포트 추출
     */
    private extractImports(code: string): string {
        const importRegex = /import.*?from.*?;[\s\n]*/g;
        const imports = code.match(importRegex) || [];
        return imports.join('\n');
    }

    /**
     * 기존 코드에서 로직 추출
     */
    private extractLogic(code: string): string {
        // useState, useMemo 등의 로직 추출
        const logicRegex = /(const \[.*?\] = React\.useState.*?;[\s\n]*|const .*? = React\.useMemo.*?;[\s\n]*)/g;
        const logic = code.match(logicRegex) || [];
        return logic.join('\n');
    }

    /**
     * 기존 코드에서 JSX 추출
     */
    private extractJSX(code: string): string {
        const jsxMatch = code.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*}\s*;?\s*$/);
        return jsxMatch ? jsxMatch[1].trim() : '';
    }

    /**
     * 기존 코드에서 상태와 로직 추출
     */
    private extractStateAndLogic(code: string): string {
        const functionMatch = code.match(/export const Users = \(\) => \{([\s\S]*?)return/);
        if (functionMatch) {
            return functionMatch[1].trim();
        }
        return '';
    }

    /**
     * 피그마 스타일을 기존 JSX에 적용
     */
    private applyFigmaStyles(
        existingJSX: string,
        figmaComponents: {
            table?: ComponentDesignConfig;
            buttons?: ComponentDesignConfig[];
            inputs?: ComponentDesignConfig[];
            filters?: ComponentDesignConfig[];
            layout?: {
                spacing: number;
                padding: number;
                direction: 'row' | 'column';
            };
        },
    ): string {
        let mergedJSX = existingJSX;

        // 레이아웃 스타일 적용
        if (figmaComponents.layout) {
            const layoutStyle = `sx={{ 
                p: ${figmaComponents.layout.padding}, 
                display: 'flex', 
                flexDirection: '${figmaComponents.layout.direction}', 
                gap: ${figmaComponents.layout.spacing} 
            }}`;

            // 기존 Box에 스타일 적용
            mergedJSX = mergedJSX.replace(/<Box[^>]*>/, `<Box ${layoutStyle}>`);
        }

        return mergedJSX;
    }

    /**
     * Prettier를 사용하여 코드 포맷팅
     * @param code 원본 코드
     * @returns 포맷팅된 코드
     */
    private async formatCode(code: string): Promise<string> {
        try {
            // Prettier의 format 메서드가 비동기적으로 작동
            const formatted = await prettier.format(code, {
                parser: 'typescript',
                semi: true,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'es5',
                printWidth: 100,
                arrowParens: 'avoid',
                endOfLine: 'lf',
            });

            console.log('✅ Prettier 포맷팅 성공');
            return formatted;
        } catch (error) {
            console.warn('⚠️ Prettier 포맷팅 실패, 원본 코드 반환:', error);
            return code;
        }
    }
}
