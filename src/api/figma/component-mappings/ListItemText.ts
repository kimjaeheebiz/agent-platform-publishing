import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';

export function buildListItemTextPropsAndSx(p: Record<string, unknown>): { propsStr: string; sx?: string } {
    const primary = typeof p.primary === 'string' ? p.primary : typeof p.__primary === 'string' ? p.__primary : undefined;
    const secondary = typeof p.secondary === 'string' ? p.secondary : typeof p.__secondary === 'string' ? p.__secondary : undefined;
    const inset = Boolean(p.inset);
    const parts: string[] = [];
    if (inset) parts.push('inset');
    if (primary) parts.push(`primary="${String(primary).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
    if (secondary) parts.push(`secondary="${String(secondary).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
    const textColor = typeof p.textColor === 'string' && p.textColor.trim() ? p.textColor.trim() : undefined;
    // MUI 기본값 text.primary는 sx에 넣지 않는다. 다른 컬러일 때만 sx color 추가.
    const sx = textColor && textColor !== 'text.primary' ? `{ color: '${textColor}' }` : undefined;
    return { propsStr: parts.length ? ` ${parts.join(' ')}` : '', sx };
}

/** ListItem 컴포넌트에서 내려준 properties( __listItemPrimary 등 )를 기반으로 ListItemText JSX를 생성 */
export function buildListItemTextFromListItemProps(
    properties: Record<string, unknown>,
    fallbackPrimary: string,
): string {
    const primary =
        (typeof properties.__listItemPrimary === 'string' && properties.__listItemPrimary.trim()) ||
        fallbackPrimary.trim();
    const secondary =
        typeof properties.__listItemSecondary === 'string' && properties.__listItemSecondary.trim()
            ? properties.__listItemSecondary.trim()
            : '';
    const useInset = Boolean(properties.__listItemInset);

    if (!primary && !secondary) return '';

    const childProps: Record<string, unknown> = {
        primary,
        secondary: secondary || undefined,
        inset: useInset || undefined,
        textColor:
            typeof properties.__listItemTextColor === 'string' && properties.__listItemTextColor.trim()
                ? properties.__listItemTextColor.trim()
                : undefined,
    };
    const { propsStr, sx } = buildListItemTextPropsAndSx(childProps);
    const sxAttr = sx ? `\n            sx={${sx}}` : '';
    return `<ListItemText${propsStr}${sxAttr} />`;
}

/**
 * MUI ListItemText 컴포넌트 매핑
 * - Figma에서 이름이 <ListItemText>인 노드가 직접 매핑될 때 사용.
 * - primary/secondary/inset, 텍스트 color 등 "텍스트 자체"에 대한 표현식은 이 파일에서만 관리하고,
 *   ListItem, MenuItem 등 부모 매핑은 어떤 텍스트를 쓸지(라벨)와 구조만 결정한다.
 */
export const ListItemTextMapping: ComponentMapping = {
    figmaNames: ['<ListItemText>'] as const,
    muiName: 'ListItemText',
    
    muiProps: {
        // inset
        inset: {
            type: 'boolean',
            default: false,
        },
        
        // primary
        primary: {
            type: 'react-node',
        },
        
        // secondary
        secondary: {
            type: 'react-node',
        },
    },
    
    excludeFromSx: [],

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
        const r: Record<string, unknown> = {};
        if (typeof props.primary === 'string') r.primary = props.primary;
        if (typeof props.secondary === 'string') r.secondary = props.secondary;
        if (typeof props.inset === 'boolean') r.inset = props.inset;
        if (typeof props.textColor === 'string') r.textColor = props.textColor;
        return r as ComponentProperties;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (_componentName, props, content, sx, properties) => {
        const p = (properties || {}) as Record<string, unknown>;
        const { propsStr, sx: sxFromProps } = buildListItemTextPropsAndSx(p);
        const sxAttribute = (sxFromProps || sx) ? `\n            sx={${sxFromProps || sx}}` : '';
        const mergedProps = props || propsStr;
        return `<ListItemText${mergedProps}${sxAttribute}>
            ${content}
        </ListItemText>`;
    },
};

