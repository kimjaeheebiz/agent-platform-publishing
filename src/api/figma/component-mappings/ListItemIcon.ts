import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { getMuiIconName } from '../icon-mapper';

/** Figma Icon Size (Small|Medium|Large|Inherit) → MUI fontSize 값 */
function toMuiFontSize(figmaSize?: string): string | undefined {
    if (!figmaSize || !/^(Small|Medium|Large|Inherit)$/i.test(String(figmaSize).trim())) return undefined;
    const lower = String(figmaSize).trim().toLowerCase();
    if (lower === 'inherit') return undefined;
    return lower;
}

export function buildListItemIconJSXFromProps(p: Record<string, unknown>): string | null {
    const iconName = typeof p.iconName === 'string' ? p.iconName : undefined;
    const iconComponentId = typeof p.iconComponentId === 'string' ? p.iconComponentId : undefined;
    const iconSize = typeof p.iconSize === 'string' ? p.iconSize : undefined;
    const iconColor = typeof p.iconColor === 'string' ? p.iconColor : undefined;
    const muiIcon = getMuiIconName(String(iconComponentId || ''), iconName);
    if (!muiIcon || !/^[A-Z][A-Za-z0-9]+$/.test(muiIcon)) return null;
    const resolvedSize = toMuiFontSize(iconSize);
    // MUI 기본값은 medium이므로, medium 또는 미지정일 때는 fontSize 속성을 추가하지 않는다.
    const fontSizeAttr = resolvedSize && resolvedSize !== 'medium' ? ` fontSize="${resolvedSize}"` : '';
    const inner = `<${muiIcon}${fontSizeAttr} />`;
    const sx = typeof iconColor === 'string' && iconColor.trim() ? `{ color: '${iconColor.trim()}' }` : undefined;
    const sxAttribute = sx ? `\n            sx={${sx}}` : '';
    return `<ListItemIcon${sxAttribute}>
            ${inner}
        </ListItemIcon>`;
}

/**
 * MUI ListItemIcon 컴포넌트 매핑
 * - Figma에서 이름이 <ListItemIcon>인 노드가 직접 매핑될 때 사용.
 * - 아이콘 이름/사이즈/색 등 "아이콘 자체"에 대한 표현식은 이 파일에서만 관리하고,
 *   ListItem, MenuItem 등 부모 매핑은 단순히 "아이콘 존재 여부"와 위치만 결정한다.
 */
export const ListItemIconMapping: ComponentMapping = {
    figmaNames: ['<ListItemIcon>'] as const,
    muiName: 'ListItemIcon',
    
    muiProps: {
        // align
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center'] as const,
        },
    },
    
    excludeFromSx: [],

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
        const r: Record<string, unknown> = {};
        // synthetic 노드/단독 노드 모두 지원
        if (typeof props.iconName === 'string') r.iconName = props.iconName;
        if (typeof props.iconComponentId === 'string') r.iconComponentId = props.iconComponentId;
        if (typeof props.iconSize === 'string') r.iconSize = props.iconSize;
        if (typeof props.iconColor === 'string') r.iconColor = props.iconColor;
        return r as ComponentProperties;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (_componentName, props, content, sx, properties) => {
        // 자식이 없고 properties에 icon 정보가 있으면 여기서 아이콘까지 렌더링
        const p = (properties || {}) as Record<string, unknown>;
        if (!String(content || '').trim()) {
            const built = buildListItemIconJSXFromProps(p);
            if (built) return built;
        }
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<ListItemIcon${props}${sxAttribute}>
            ${content}
        </ListItemIcon>`;
    },
};

