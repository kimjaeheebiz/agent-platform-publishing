import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { getMuiIconName } from '../icon-mapper';
import { buildListItemIconJSXFromProps } from './ListItemIcon';
import { buildListItemTextFromListItemProps } from './ListItemText';
import { findTextInChildByName, findTextRecursively, getFigmaBooleanProp, getPropValue } from '../utils/figma-node-utils';

/**
 * MUI ListItem 컴포넌트 매핑 (컨테이너 역할)
 * - Figma 노드: <ListItem>, ListItem, Item #1 등
 * - 이 파일에서 아이콘/텍스트/엔드 아이콘 조립 로직을 모두 담당.
 *   ListItemIcon.ts, ListItemText.ts는 Figma에서 해당 이름으로 단독 노드가 매핑될 때만 사용됨.
 * 공식 문서: https://mui.com/material-ui/react-list/
 * API: https://mui.com/material-ui/api/list-item/
 * Figma: Item #1 구조 — Container > Left Content > Icon, ListItem Text (T List item, T Secondary), IconButton, Divider
 */
export const ListItemMapping: ComponentMapping = {
    figmaNames: ['<ListItem>', 'ListItem'] as const,
    muiName: 'ListItem',
    subComponents: ['ListItemIcon', 'ListItemText', 'IconButton'],

    muiProps: {
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center'] as const,
            default: 'center',
        },
        dense: {
            type: 'boolean',
            default: false,
        },
        disableGutters: {
            type: 'boolean',
            default: false,
        },
        disablePadding: {
            type: 'boolean',
            default: false,
        },
        divider: {
            type: 'boolean',
            default: false,
        },
    },

    excludeFromSx: ['width'],

    extractContent: (node) => {
        const props = (node as any).componentProperties || {};
        const label = getPropValue(props, 'label');
        if (typeof label === 'string' && label.trim()) return label.trim();
        return findTextInChildByName(node, /ListItem Text|T List item|Item/i) || findTextRecursively(node.children || []);
    },

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const result: ComponentProperties = {};
        const r = result as Record<string, unknown>;
        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;

        const label = getPropValue(props, 'label');
        if (typeof label === 'string' && label.trim()) {
            r.__listItemPrimary = label.trim();
        }
        const primaryFromChild = findTextInChildByName(node, /ListItem Text|T List item|Item/i);
        if (typeof primaryFromChild === 'string' && primaryFromChild.trim() && !r.__listItemPrimary) {
            r.__listItemPrimary = primaryFromChild.trim();
        }

        const secondTextOn = getFigmaBooleanProp(node, 'Second. Text', 'Second', 'secondary');
        if (secondTextOn) {
            const secondaryText = findTextInChildByName(node, /T Secondary|Secondary/i);
            if (typeof secondaryText === 'string' && secondaryText.trim()) {
                r.__listItemSecondary = secondaryText.trim();
            } else {
                r.__listItemSecondary = 'Secondary';
            }
        }

        const dense = getFigmaBooleanProp(node, 'Dense', 'dense');
        if (typeof dense === 'boolean') r.dense = dense;
        const disableGutters = getFigmaBooleanProp(node, 'Dis. Gutters', 'Disable Gutters', 'disableGutters');
        if (typeof disableGutters === 'boolean') r.disableGutters = disableGutters;
        const divider = getFigmaBooleanProp(node, 'Divider', 'divider');
        if (typeof divider === 'boolean') r.divider = divider;
        const inset = getFigmaBooleanProp(node, 'Inset', 'inset');
        if (typeof inset === 'boolean' && inset) r.__listItemInset = true;

        return result;
    },

    extractIcons: async (node: FigmaNode, extractor?: any) => {
        const { extractIconsForMenuItem } = await import('../utils/icon-extractor');
        return await extractIconsForMenuItem(node, extractor);
    },

    generateJSX: (_componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const p = (properties || {}) as Record<string, unknown>;
        const parts: string[] = [];

        const startIcon = buildListItemIconJSXFromProps({
            iconName: typeof p.startIconName === 'string' ? p.startIconName : undefined,
            iconComponentId: typeof p.startIconComponentId === 'string' ? p.startIconComponentId : undefined,
            iconSize: typeof p.startIconSize === 'string' ? p.startIconSize : undefined,
            iconColor: typeof p.__listItemIconColor === 'string' ? p.__listItemIconColor : undefined,
        });
        if (startIcon) parts.push(startIcon);

        const labelJSX = buildListItemTextFromListItemProps(p, (content as string) || '');
        if (labelJSX) parts.push(labelJSX);

        const endIconId = p.endIconComponentId;
        const endIconName = p.endIconName;
        if (endIconId || endIconName) {
            const muiIcon = getMuiIconName(String(endIconId || ''), typeof endIconName === 'string' ? endIconName : undefined);
            if (muiIcon && /^[A-Z][A-Za-z0-9]+$/.test(muiIcon)) {
                const endSize = typeof p.endIconSize === 'string' ? p.endIconSize : undefined;
                const endLower = endSize ? String(endSize).trim().toLowerCase() : '';
                const endFontSizeAttr = endLower && endLower !== 'inherit' ? ` fontSize="${endLower}"` : '';
                parts.push(`<IconButton size="small"><${muiIcon}${endFontSizeAttr} /></IconButton>`);
            }
        }

        const inner = parts.join('\n            ');
        return `<ListItem${props}${sxAttribute}>
            ${inner}
        </ListItem>`;
    },
};
