import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI MenuList 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/api/menu-list/
 */
export const MenuListMapping: ComponentMapping = {
    figmaNames: ['<MenuList>'] as const,
    muiName: 'MenuList',

    muiProps: {
        autoFocus: {
            type: 'boolean',
            default: false,
        },
        autoFocusItem: {
            type: 'boolean',
            default: false,
        },
        disabledItemsFocusable: {
            type: 'boolean',
            default: false,
        },
        disableListWrap: {
            type: 'boolean',
            default: false,
        },
        disablePadding: {
            type: 'boolean',
            default: false,
        },
        dense: {
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

    generateJSX: (_componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<MenuList${props}${sxAttribute}>
            ${content}
        </MenuList>`;
    },
};
