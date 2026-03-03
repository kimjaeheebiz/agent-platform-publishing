import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI TableHead 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * MUI 구조: TableHead → thead, 내부 TableRow → TableCell( variant="head" | 자동 )
 * 피그마: <TableHead>, <TableHeadRow> → TableHead + TableRow로 변환 (extractor에서 처리)
 */
export const TableHeadMapping: ComponentMapping = {
    figmaNames: ['<TableHead>', '<TableHeadRow>'] as const,
    muiName: 'TableHead',
    muiProps: {
        component: { type: 'string' },
    },
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    subComponents: ['TableRow', 'TableCell'],
    generateJSX: (componentName, props, content) => {
        return `<TableHead${props}>
            ${content}
        </TableHead>`;
    },
};

