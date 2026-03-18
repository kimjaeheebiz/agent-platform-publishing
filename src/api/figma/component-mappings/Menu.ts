import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { findDescendantByName, getFigmaBooleanProp, getPropValue } from '../utils/figma-node-utils';

function buildMenuSlotProps(properties: Record<string, unknown>): string {
    const slotParts: string[] = [];

    const paper = (properties.__menuPaperProps || {}) as Record<string, unknown>;
    const list = (properties.__menuListProps || {}) as Record<string, unknown>;

    const paperProps: string[] = [];
    if (paper.variant && typeof paper.variant === 'string') {
        paperProps.push(`variant: "${paper.variant}"`);
    }
    if (typeof paper.elevation === 'number') {
        paperProps.push(`elevation: ${paper.elevation}`);
    }
    if (paper.square === true) {
        paperProps.push('square: true');
    }
    if (paper.width && paper.width !== 'fill' && paper.width !== 'hug') {
        paperProps.push(`sx: { width: '${paper.width}px' }`);
    }
    if (paperProps.length > 0) {
        slotParts.push(`paper: { ${paperProps.join(', ')} }`);
    }

    const listProps: string[] = [];
    if (list.variant && typeof list.variant === 'string' && list.variant !== 'selectedMenu') {
        listProps.push(`variant: "${list.variant}"`);
    }
    if (list.dense === true) {
        listProps.push('dense: true');
    }
    if (list.disablePadding === true) {
        listProps.push('disablePadding: true');
    }
    if (list.autoFocus === true) {
        listProps.push('autoFocus: true');
    }
    if (list.autoFocusItem === true) {
        listProps.push('autoFocusItem: true');
    }
    if (list.disableListWrap === true) {
        listProps.push('disableListWrap: true');
    }
    if (list.disabledItemsFocusable === true) {
        listProps.push('disabledItemsFocusable: true');
    }
    if (listProps.length > 0) {
        slotParts.push(`list: { ${listProps.join(', ')} }`);
    }

    return slotParts.length > 0 ? ` slotProps={{ ${slotParts.join(', ')} }}` : '';
}

/**
 * MUI Menu 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-menu/
 */
export const MenuMapping: ComponentMapping = {
    figmaNames: ['<Menu>'] as const,
    muiName: 'Menu',
    
    muiProps: {
        // open
        open: {
            type: 'boolean',
            default: false,
        },
        
        // anchorEl
        anchorEl: {
            type: 'react-node',
        },
        
        // onClose
        onClose: {
            type: 'function',
        },
        
        // anchorOrigin
        anchorOrigin: {
            type: 'object',
        },
        
        // transformOrigin
        transformOrigin: {
            type: 'object',
        },
        
        // TransitionComponent
        TransitionComponent: {
            type: 'function',
        },
        
        // disableAutoFocusItem
        disableAutoFocusItem: {
            type: 'boolean',
            default: false,
        },
        variant: {
            type: 'union',
            values: ['menu', 'selectedMenu'] as const,
            default: 'selectedMenu',
        },
    },
    
    excludeFromSx: [],

    subComponents: ['MenuItem'] as const,

    extractProperties: async (node: FigmaNode, extractor?: any): Promise<ComponentProperties> => {
        const result: ComponentProperties = {
            open: true,
        };

        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
        const variant = getPropValue(props, 'variant');
        if (typeof variant === 'string') {
            result.variant = variant;
        }

        const disableAutoFocusItem = getFigmaBooleanProp(node, 'Disable Auto Focus Item', 'disableAutoFocusItem');
        if (typeof disableAutoFocusItem === 'boolean') {
            (result as any).disableAutoFocusItem = disableAutoFocusItem;
        }

        const paperNode = findDescendantByName(node, '<Paper>');
        const menuListNode = findDescendantByName(node, '<MenuList>');
        if (paperNode && extractor?.extractComponentProperties) {
            (result as any).__menuPaperProps = await extractor.extractComponentProperties(paperNode);
        }
        if (menuListNode && extractor?.extractComponentProperties) {
            (result as any).__menuListProps = await extractor.extractComponentProperties(menuListNode);
        }

        return result;
    },

    extractChildren: async (node: FigmaNode): Promise<FigmaNode[]> => {
        const menuListNode = findDescendantByName(node, '<MenuList>');
        const container = menuListNode || findDescendantByName(node, '<Paper>') || node;
        return (container.children || []).filter((child) => child.visible !== false && child.name === '<MenuItem>');
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (_componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const menuProps = props.includes(' open') || props.includes('open ')
            ? props
            : `${props} open anchorReference="anchorPosition" anchorPosition={{ top: 0, left: 0 }}`;
        const slotProps = buildMenuSlotProps((properties || {}) as Record<string, unknown>);
        return `<Menu${menuProps}${slotProps}${sxAttribute}>
            ${content}
        </Menu>`;
    },
};

