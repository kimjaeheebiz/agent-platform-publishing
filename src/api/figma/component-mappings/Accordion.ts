import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import {
    findDescendantByName,
    getFigmaBooleanProp,
    getPropValue,
} from '../utils/figma-node-utils';
import { getMuiIconName } from '../icon-mapper';
import { extractListChildren } from './List';

/**
 * 피그마 AccordionDetails 내부: MUI List 변형 프레임명 "Dis. Padding=…, Dense=…" 또는 직접 Item #N
 * (Agent Builder 등 실제 파일 구조 기준)
 */
function findAccordionDetailsListRoot(node: FigmaNode): FigmaNode | null {
    const direct = (node.children || []).filter((c: any) => c?.visible !== false);
    if (direct.some((c) => /^Item #\d+$/i.test(String((c as any).name ?? '')))) {
        return node;
    }
    for (const c of direct) {
        const n = String((c as any).name ?? '');
        if (/Dis\.\s*Padding/i.test(n) && /Dense/i.test(n)) {
            return c as FigmaNode;
        }
    }
    return direct[0] ?? null;
}

/** 변형 프레임명에서 List dense / disablePadding (componentProperties 없을 때 보조) */
function parseListVariantFromLayerName(name: string, target: Record<string, unknown>): void {
    const denseM = name.match(/Dense\s*=\s*(True|False)/i);
    if (denseM) target.dense = denseM[1].toLowerCase() === 'true';
    const padM = name.match(/Dis\.\s*Padding\s*=\s*(True|False)/i);
    if (padM) target.disablePadding = padM[1].toLowerCase() === 'true';
}

async function extractAccordionRootChildren(node: FigmaNode): Promise<FigmaNode[]> {
    const direct = (node.children || []).filter((c: any) => c?.visible !== false);
    const out: FigmaNode[] = [];
    const summary = direct.find((c) => String((c as any).name ?? '').trim() === 'AccordionSummary');
    const details = direct.find((c) => String((c as any).name ?? '').trim() === 'AccordionDetails');
    if (summary) out.push(summary as FigmaNode);
    if (details) out.push(details as FigmaNode);
    return out;
}

async function extractAccordionSummaryChildren(node: FigmaNode): Promise<FigmaNode[]> {
    const typo =
        findDescendantByName(node, /^<Typography>$/i) ||
        findDescendantByName(node, /^Typography$/i);
    if (typo) return [typo];
    return [];
}

async function extractAccordionDetailsChildren(node: FigmaNode): Promise<FigmaNode[]> {
    const root = findAccordionDetailsListRoot(node);
    if (!root) return [];
    return extractListChildren(root);
}

/**
 * MUI AccordionSummary
 * 피그마: AccordionSummary > Container > <Typography> + Accordion Expand Icon > <IconButton> > …
 */
export const AccordionSummaryMapping: ComponentMapping = {
    figmaNames: ['AccordionSummary'] as const,
    muiName: 'AccordionSummary',
    subComponents: [],

    extractChildren: extractAccordionSummaryChildren,

    muiProps: {},

    extractIcons: async (node: FigmaNode, extractor?: any) => {
        const { extractIconsForAccordionSummary } = await import('../utils/icon-extractor');
        return extractIconsForAccordionSummary(node, extractor);
    },

    generateJSX: (_componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? ` sx={${sx}}` : '';
        const p = (properties || {}) as Record<string, unknown>;
        const muiIcon = getMuiIconName(
            String(p.endIconComponentId ?? ''),
            typeof p.endIconName === 'string' ? p.endIconName : undefined,
        );
        const expandIconAttr = muiIcon ? ` expandIcon={<${muiIcon} />}` : ` expandIcon={<ExpandMore />}`;
        return `<AccordionSummary${expandIconAttr}${props}${sxAttribute}
            aria-controls="panel-content"
            id="panel-header"
        >
            ${content || ''}
        </AccordionSummary>`;
    },
};

/**
 * MUI AccordionDetails (+ 내부 List: 피그마 List 변형 프레임과 동일 규칙)
 */
export const AccordionDetailsMapping: ComponentMapping = {
    figmaNames: ['AccordionDetails'] as const,
    muiName: 'AccordionDetails',
    subComponents: ['List'],

    extractChildren: extractAccordionDetailsChildren,

    muiProps: {},

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const result: ComponentProperties = {};
        const r = result as Record<string, unknown>;
        const root = findAccordionDetailsListRoot(node);
        if (!root) return result;

        const dense = getFigmaBooleanProp(root as any, 'Dense', 'dense');
        if (typeof dense === 'boolean') r.dense = dense;
        const disablePadding = getFigmaBooleanProp(
            root as any,
            'Dis. Padding',
            'Disable Padding',
            'disablePadding',
        );
        if (typeof disablePadding === 'boolean') r.disablePadding = disablePadding;

        const layerName = String((root as any).name ?? '');
        if (typeof r.dense !== 'boolean' || typeof r.disablePadding !== 'boolean') {
            const fromName: Record<string, unknown> = {};
            parseListVariantFromLayerName(layerName, fromName);
            if (typeof r.dense !== 'boolean' && typeof fromName.dense === 'boolean') r.dense = fromName.dense;
            if (typeof r.disablePadding !== 'boolean' && typeof fromName.disablePadding === 'boolean') {
                r.disablePadding = fromName.disablePadding;
            }
        }

        return result;
    },

    generateJSX: (_componentName, accordionDetailsProps, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const p = (properties || {}) as Record<string, unknown>;
        const listBits: string[] = [];
        if (p.dense === true) listBits.push('dense');
        if (p.disablePadding === true) listBits.push('disablePadding');
        const listExtra = listBits.length > 0 ? ` ${listBits.join(' ')}` : '';
        return `<AccordionDetails${accordionDetailsProps}${sxAttribute}>
            <List${listExtra}>
            ${content || ''}
            </List>
        </AccordionDetails>`;
    },
};

/**
 * MUI Accordion
 * https://mui.com/material-ui/react-accordion/
 */
export const AccordionMapping: ComponentMapping = {
    figmaNames: ['<Accordion>'] as const,
    muiName: 'Accordion',

    subComponents: ['AccordionSummary', 'AccordionDetails'],

    extractChildren: extractAccordionRootChildren,

    muiProps: {
        expanded: { type: 'boolean' },
        onChange: { type: 'function' },
        defaultExpanded: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node as any, 'Default Expanded', 'defaultExpanded'),
        },
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const dis = getFigmaBooleanProp(node as any, 'Disabled', 'disabled');
                if (typeof dis === 'boolean') return dis;
                const st = getPropValue((node as any).componentProperties || {}, 'state');
                if (typeof st === 'string') return st.toLowerCase() === 'disabled';
                return null;
            },
        },
        disableGutters: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) =>
                getFigmaBooleanProp(node as any, 'Dis. Gutters', 'Disable Gutters', 'disableGutters'),
        },
        square: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node as any, 'Square', 'square'),
        },
    },

    excludeFromSx: [],

    generateJSX: (_componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Accordion${props}${sxAttribute}>
            ${content || ''}
        </Accordion>`;
    },
};
