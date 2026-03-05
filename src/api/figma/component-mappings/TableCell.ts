import { ComponentMapping } from './types/PropertyMapper';
import type { FigmaNode, ComponentProperties } from '../types';

/**
 * 피그마 오토레이아웃 정렬 → MUI TableCell align
 * - primaryAxisAlignItems만 사용 (가로 정렬 기준)
 * - counterAxisAlignItems(세로 정렬)는 TableCell align에 영향을 주지 않도록 무시
 * Figma: MIN = 시작(좌), CENTER = 가운데, MAX = 끝(우). LTR에서 MIN=left, MAX=right
 */
function figmaAlignmentToTableCellAlign(node: FigmaNode): 'left' | 'center' | 'right' | undefined {
    const n = node as { primaryAxisAlignItems?: string };
    const v = n.primaryAxisAlignItems;
    if (v === 'MIN') return 'left';
    if (v === 'CENTER') return 'center';
    if (v === 'MAX') return 'right';
    return undefined;
}

/**
 * MUI TableCell 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * MUI API: align, padding, size, variant(head|body|footer), sortDirection, scope, component
 * 피그마: Small → size="small", 위치(Position) 정렬 → align (primaryAxisAlignItems/counterAxisAlignItems)
 */
export const TableCellMapping: ComponentMapping = {
    figmaNames: ['<TableCell>'] as const,
    muiName: 'TableCell',
    muiProps: {
        align: {
            type: 'union',
            values: ['left', 'right', 'center', 'inherit', 'justify'] as const,
            default: 'inherit',
            extractFromFigma: (node: FigmaNode) => figmaAlignmentToTableCellAlign(node),
        },
        padding: {
            type: 'union',
            values: ['normal', 'checkbox', 'none'] as const,
            default: 'normal',
        },
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
        },
        small: { type: 'boolean', default: false },
        sortDirection: {
            type: 'union',
            values: ['asc', 'desc', 'false'] as const,
        },
        scope: { type: 'string' },
        variant: {
            type: 'union',
            values: ['head', 'body', 'footer'] as const,
        },
        component: { type: 'string' },
    },
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    transformProps: (properties: ComponentProperties) => {
        const transformed = { ...properties };
        if (transformed['small'] === true) {
            transformed['size'] = 'small';
            delete transformed['small'];
        }
        return transformed;
    },
    generateJSX: (componentName, props, content) => {
        return `<TableCell${props}>
            ${content}
        </TableCell>`;
    },
};

