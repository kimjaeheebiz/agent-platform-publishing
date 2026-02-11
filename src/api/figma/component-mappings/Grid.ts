import { ComponentMapping } from './types/PropertyMapper';
import { ComponentProperties } from '../types';
import type { FigmaNode } from '../types';

/** Grid 전용 속성 (추출/변환용, ComponentProperties에 선택적 포함) */
type GridProps = ComponentProperties & {
    item?: boolean;
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    size?: Record<string, number>;
    layoutColumns?: number;
    rowSpacing?: number;
    columnSpacing?: number;
};

/**
 * MUI Grid v7 컴포넌트 매핑
 * 공식 문서: https://mui.com/material-ui/react-grid/
 * - container + spacing / rowSpacing, columnSpacing / columns / direction
 * - item: size, offset (justifyContent, alignItems는 prop 또는 sx)
 */
export const GridMapping: ComponentMapping = {
    figmaNames: ['Grid', '<Grid>'] as const,
    muiName: 'Grid',

    muiProps: {
        container: { type: 'boolean', default: false },
        xs: { type: 'union-number' },
        sm: { type: 'union-number' },
        md: { type: 'union-number' },
        lg: { type: 'union-number' },
        xl: { type: 'union-number' },
        size: { type: 'object' },
        spacing: { type: 'union-number' },
        rowSpacing: { type: 'union-number' },
        columnSpacing: { type: 'union-number' },
        columns: { type: 'union-number', default: 12 },
        direction: {
            type: 'union',
            values: ['row', 'row-reverse'] as const,
            default: 'row',
        },
        offset: { type: 'object' },
        /** 레이아웃 열 수 (자식 item size = 12/ layoutColumns, JSX 미출력) */
        layoutColumns: { type: 'union-number', default: 2 },
        justifyContent: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const,
        },
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const,
        },
    },

    /** 자식이 있으면 container=true (Figma에서 container 미설정 시) */
    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const children = (node as { children?: unknown[] }).children;
        const hasChildren = Array.isArray(children) && children.length > 0;
        return hasChildren ? ({ container: true } as ComponentProperties) : {};
    },

    transformProps: (properties: ComponentProperties): ComponentProperties => {
        const p = properties as GridProps;
        const { item: _item, xs, sm, md, lg, xl, layoutColumns: _lc, gap, spacing, rowSpacing, columnSpacing, ...rest } = p;
        const out: Record<string, unknown> = { ...rest };

        // size: xs/sm/md/lg/xl → size 객체
        const sizeParts: Record<string, number> = {};
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
        for (const bp of breakpoints) {
            const v = p[bp];
            if (v !== undefined && v !== null) {
                const n = typeof v === 'number' ? v : parseInt(String(v), 10);
                if (!isNaN(n)) sizeParts[bp] = n;
            }
        }
        if (Object.keys(sizeParts).length > 0) out.size = sizeParts;

        // spacing: gap 또는 row/column 없을 때 gap → spacing
        if (spacing != null) out.spacing = spacing;
        else if (rowSpacing != null && columnSpacing != null) {
            out.rowSpacing = rowSpacing;
            out.columnSpacing = columnSpacing;
        } else if (rowSpacing != null) out.rowSpacing = rowSpacing;
        else if (columnSpacing != null) out.columnSpacing = columnSpacing;
        else if (gap != null) out.spacing = typeof gap === 'number' ? gap : parseInt(String(gap), 10) || 2;

        return out as ComponentProperties;
    },

    excludeFromSx: [
        'display',
        'flexDirection',
        'gap',
        'width',
        'justifyContent',
        'alignItems',
    ],

    generateJSX: (componentName, props, content, sx) => {
        let workingSx = sx || '';
        let spacingSnippet = '';

        if (workingSx) {
            const genericMatch = workingSx.match(/(?:,|\{|\s)gap:\s*([^,}]+)\s*(?:,|\})/);
            if (genericMatch && genericMatch[1]) {
                const rawValue = genericMatch[1].trim();
                spacingSnippet = ` spacing={${rawValue}}`;
                workingSx = workingSx
                    .replace(/\s*gap:\s*[^,}]+\s*,?/g, '')
                    .replace(/,\s*}/g, ' }')
                    .replace(/\{\s*,/g, '{ ');
            }
        }

        const sxAttribute = workingSx && /\{\s*\}/.test(workingSx) === false ? `\n            sx={${workingSx}}` : '';
        return `<Grid${props}${spacingSnippet}${sxAttribute}>
            ${content}
        </Grid>`;
    },
};

