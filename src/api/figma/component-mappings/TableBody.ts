import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableBody 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * MUI 구조: TableBody → tbody, TableRow → TableCell (기본 variant="body")
 */
export const TableBodyMapping: ComponentMapping = {
    figmaNames: ['<TableBody>'] as const,
    muiName: 'TableBody',
    muiProps: {
        component: { type: 'string' },
    },
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    subComponents: ['TableRow', 'TableCell'],
    generateJSX: (componentName, props, content) => {
        return `<TableBody${props}>
            ${content}
        </TableBody>`;
    },
};

