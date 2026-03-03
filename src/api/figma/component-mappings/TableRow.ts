import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableRow 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * MUI API: hover, selected, component (tr)
 */
export const TableRowMapping: ComponentMapping = {
    figmaNames: ['<TableRow>'] as const,
    muiName: 'TableRow',
    muiProps: {
        hover: { type: 'boolean', default: false },
        selected: { type: 'boolean', default: false },
        component: { type: 'string' },
    },
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    subComponents: ['TableCell'],
    generateJSX: (componentName, props, content) => {
        return `<TableRow${props}>
            ${content}
        </TableRow>`;
    },
};

