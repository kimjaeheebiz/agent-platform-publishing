import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { findTextInChildByName, findTextRecursively, getFigmaBooleanProp, getPropValue } from '../utils/figma-node-utils';
import { buildListItemIconJSXFromProps } from './ListItemIcon';
import { buildListItemTextPropsAndSx } from './ListItemText';

function escapeText(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/**
 * 아이콘이 없으면 plain text만, 아이콘이 있으면 ListItemText 구조 유지 (inset·sx color 포함, ListItem과 동일 패턴).
 */
function buildMenuItemLabelJSX(
    properties: Record<string, unknown>,
    fallbackContent: string,
    hasIcon: boolean,
): string {
    const label = typeof properties.__menuItemLabel === 'string' && properties.__menuItemLabel.trim()
        ? properties.__menuItemLabel.trim()
        : fallbackContent.trim();
    if (!label) return '';

    if (!hasIcon) {
        return escapeText(label);
    }
    const useInset = Boolean(properties.__menuItemInset);
    const { propsStr, sx } = buildListItemTextPropsAndSx({
        primary: label,
        inset: useInset || undefined,
        textColor:
            typeof properties.__menuItemTextColor === 'string' && properties.__menuItemTextColor.trim()
                ? properties.__menuItemTextColor.trim()
                : undefined,
    });
    const sxAttr = sx ? `\n            sx={${sx}}` : '';
    return `<ListItemText${propsStr}${sxAttr} />`;
}

/**
 * MUI MenuItem 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/api/menu-item/
 */
export const MenuItemMapping: ComponentMapping = {
    figmaNames: ['<MenuItem>'] as const,
    muiName: 'MenuItem',
    subComponents: ['ListItemIcon', 'ListItemText'],

    muiProps: {
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // selected
        selected: {
            type: 'boolean',
            default: false,
        },
        
        // dense
        dense: {
            type: 'boolean',
            default: false,
        },

        divider: {
            type: 'boolean',
            default: false,
        },

        disableGutters: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: ['width'],

    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const result: ComponentProperties = {};
        const resultRecord = result as Record<string, unknown>;
        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;

        const valueProp = getPropValue(props, 'value');
        if (typeof valueProp === 'string' || typeof valueProp === 'number') {
            resultRecord.value = valueProp;
        }

        const valueText = findTextInChildByName(node, 'Value');
        if (typeof valueText === 'string' && valueText.trim()) {
            (result as any).__menuItemLabel = valueText.trim();
            if (resultRecord.value == null) {
                resultRecord.value = valueText.trim();
            }
        }

        const selected = getFigmaBooleanProp(node, 'Selected', 'selected');
        if (typeof selected === 'boolean') {
            resultRecord.selected = selected;
        }

        const dense = getFigmaBooleanProp(node, 'Dense', 'dense');
        if (typeof dense === 'boolean') {
            resultRecord.dense = dense;
        }

        const divider = getFigmaBooleanProp(node, 'Divider', 'divider');
        if (typeof divider === 'boolean') {
            resultRecord.divider = divider;
        }

        const disableGutters = getFigmaBooleanProp(node, 'Disable Gutter', 'Disable Gutters', 'disableGutters');
        if (typeof disableGutters === 'boolean') {
            resultRecord.disableGutters = disableGutters;
        }

        const state = getPropValue(props, 'state');
        if (typeof state === 'string') {
            resultRecord.disabled = state.toLowerCase() === 'disabled';
        }

        // ListItemText inset: Figma Inset / inset 속성 있으면 dense 메뉴용 ListItemText 사용
        const inset = getFigmaBooleanProp(node, 'Inset', 'inset');
        if (typeof inset === 'boolean' && inset) {
            (result as any).__menuItemInset = true;
        }

        return result;
    },

    extractIcons: async (node: FigmaNode, extractor?: any) => {
        const { extractIconsForMenuItem } = await import('../utils/icon-extractor');
        return await extractIconsForMenuItem(node, extractor);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (_componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const menuItemProps = (properties || {}) as Record<string, unknown>;
        const parts: string[] = [];

        const hasStartIcon = Boolean(
            (typeof menuItemProps.startIconName === 'string' && menuItemProps.startIconName) ||
            (typeof menuItemProps.startIconComponentId === 'string' && menuItemProps.startIconComponentId),
        );
        const iconColor = typeof menuItemProps.__menuItemIconColor === 'string' ? menuItemProps.__menuItemIconColor : undefined;
        const startIcon = buildListItemIconJSXFromProps({
            iconName: typeof menuItemProps.startIconName === 'string' ? menuItemProps.startIconName : undefined,
            iconComponentId: typeof menuItemProps.startIconComponentId === 'string' ? menuItemProps.startIconComponentId : undefined,
            iconSize: typeof menuItemProps.startIconSize === 'string' ? menuItemProps.startIconSize : undefined,
            iconColor,
        });
        if (startIcon) parts.push(startIcon);

        const label = buildMenuItemLabelJSX(menuItemProps, content || '', hasStartIcon);
        if (label) parts.push(label);

        const endIcon = buildListItemIconJSXFromProps({
            iconName: typeof menuItemProps.endIconName === 'string' ? menuItemProps.endIconName : undefined,
            iconComponentId: typeof menuItemProps.endIconComponentId === 'string' ? menuItemProps.endIconComponentId : undefined,
            iconSize: typeof menuItemProps.endIconSize === 'string' ? menuItemProps.endIconSize : undefined,
            iconColor,
        });
        if (endIcon) parts.push(endIcon);

        const inner = parts.join('\n            ');
        return `<MenuItem${props}${sxAttribute}>
            ${inner}
        </MenuItem>`;
    },
};

