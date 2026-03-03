import { ComponentMapping } from './types/PropertyMapper';
import { FigmaNode, ComponentProperties } from '../types';
import { findMappingByFigmaName } from './index';

/** componentProperties에서 값 추출 (value 필드 또는 원시값) */
function getPropValue(props: Record<string, unknown>, keyLower: string): unknown {
    const entry = Object.entries(props).find(([k]) => k.toLowerCase() === keyLower);
    if (!entry) return undefined;
    const v = entry[1];
    return v != null && typeof v === 'object' && 'value' in v ? (v as { value: unknown }).value : v;
}

/**
 * MUI TableContainer 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-table/
 * 구조: TableContainer > Table > TableHead | TableBody | TableFooter
 * 피그마 인스턴스: componentProperties(variant, elevation)로 Paper 래핑 여부 및 스타일 자동 파악
 */
export const TableContainerMapping: ComponentMapping = {
    figmaNames: ['<TableContainer>'] as const,
    muiName: 'TableContainer',
    muiProps: {
        component: { type: 'string' },
        elevation: { type: 'union-number' },
        variant: {
            type: 'union',
            values: ['elevation', 'outlined'] as const,
        },
    },
    excludeFromSx: [
        'width',
        'backgroundColor',
        'borderColor',
        'borderWidth',
        'borderRadius',
    ],
    subComponents: ['Table', 'Paper'],
    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const properties: ComponentProperties = {};
        const nodeProps = (node as any).componentProperties || {};
        const hasPaperLikeProps = Object.keys(nodeProps).some(
            (k) => k.toLowerCase() === 'variant' || k.toLowerCase() === 'elevation'
        );

        if (hasPaperLikeProps) {
            properties.component = 'Paper';
            const paperMapping = findMappingByFigmaName('<Paper>');
            const variantDef = paperMapping?.muiProps?.variant;
            const elevationDef = paperMapping?.muiProps?.elevation;

            const variantValue = getPropValue(nodeProps, 'variant');
            if (variantValue && variantDef?.values) {
                const normalized =
                    typeof variantValue === 'string' ? variantValue.toLowerCase() : variantValue;
                if (variantDef.values.includes(normalized as 'elevation' | 'outlined')) {
                    properties.variant = normalized as 'elevation' | 'outlined';
                }
            }

            const elevationRaw = getPropValue(nodeProps, 'elevation');
            if (elevationRaw !== undefined && elevationRaw !== null && elevationDef) {
                const num =
                    typeof elevationRaw === 'number'
                        ? elevationRaw
                        : parseInt(String(elevationRaw), 10);
                if (!isNaN(num)) properties.elevation = num;
            }
        } else if (node.children?.length) {
            const paperNode = node.children.find(
                (c) =>
                    c.name === '<Paper>' || String(c.name).toLowerCase().includes('paper')
            );
            if (paperNode) {
                properties.component = 'Paper';
                const paperProps = (paperNode as any).componentProperties || {};
                const paperMapping = findMappingByFigmaName('<Paper>');
                const variantDef = paperMapping?.muiProps?.variant;
                const elevationDef = paperMapping?.muiProps?.elevation;

                const variantValue = getPropValue(paperProps, 'variant');
                if (variantValue && variantDef?.values) {
                    const normalized =
                        typeof variantValue === 'string'
                            ? variantValue.toLowerCase()
                            : variantValue;
                    if (variantDef.values.includes(normalized as 'elevation' | 'outlined')) {
                        properties.variant = normalized as 'elevation' | 'outlined';
                    }
                }

                const elevationRaw = getPropValue(paperProps, 'elevation');
                if (elevationRaw !== undefined && elevationRaw !== null && elevationDef) {
                    const num =
                        typeof elevationRaw === 'number'
                            ? elevationRaw
                            : parseInt(String(elevationRaw), 10);
                    if (!isNaN(num)) properties.elevation = num;
                }
            }
        }

        return properties;
    },
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<TableContainer${props}${sxAttribute}>
            ${content}
        </TableContainer>`;
    },
};
