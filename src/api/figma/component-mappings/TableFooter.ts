import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableFooter 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * MUI 구조: TableFooter → tfoot, TableRow → TableCell (variant="footer" | 자동)
 */
export const TableFooterMapping: ComponentMapping = {
    figmaNames: ['<TableFooter>'] as const,
    muiName: 'TableFooter',
    muiProps: {
        component: { type: 'string' },
    },
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    subComponents: ['TableRow', 'TableCell'],
    generateJSX: (componentName, props, content) => {
        return `<TableFooter${props}>
            ${content}
        </TableFooter>`;
    },
};

