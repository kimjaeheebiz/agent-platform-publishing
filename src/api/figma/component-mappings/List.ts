import type { ComponentProperties, FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { getFigmaBooleanProp, findDescendantByName } from '../utils/figma-node-utils';

/** ListItem으로 볼 노드인지: 이름이 "Item #N" 이거나 하위에 "ListItem Text" / "Left Content" 가 있는지 */
function isListItemLikeNode(node: FigmaNode | undefined): boolean {
    if (!node) return false;
    const name = String((node as any).name ?? '').trim();
    if (/^Item #\d+$/i.test(name)) return true;
    const hasStructure =
        findDescendantByName(node, /ListItem Text|Left Content/i) != null;
    return hasStructure;
}

/**
 * List의 직계 자식 중 ListItem으로 쓸 노드만 반환.
 * Figma에서 List > Stack > [Stack, Stack, ...] 처럼 래퍼가 있으면 한 단계 풀어서 Item 또는 ListItem 구조 노드를 직접 자식으로 넣음.
 */
/** List / AccordionDetails 등에서 ListItem 후보만 골라낼 때 공용 */
export async function extractListChildren(node: FigmaNode): Promise<FigmaNode[]> {
    const direct = (node.children || []).filter((c: any) => c?.visible !== false);
    const out: FigmaNode[] = [];
    for (const child of direct) {
        if (isListItemLikeNode(child as FigmaNode)) {
            out.push(child as FigmaNode);
            continue;
        }
        const inner = (child as any).children;
        if (Array.isArray(inner)) {
            const visibleInner = inner.filter((c: any) => c?.visible !== false);
            if (visibleInner.length === 1 && isListItemLikeNode(visibleInner[0] as FigmaNode)) {
                out.push(visibleInner[0] as FigmaNode);
            } else {
                for (const sub of visibleInner) {
                    if (isListItemLikeNode(sub as FigmaNode)) out.push(sub as FigmaNode);
                }
            }
        }
    }
    return out;
}

/**
 * MUI List 컴포넌트 매핑
 * 공식 문서: https://mui.com/material-ui/react-list/
 * API: https://mui.com/material-ui/api/list/
 * - children: ListItem 등
 * - dense, disablePadding, subheader
 */
export const ListMapping: ComponentMapping = {
    figmaNames: ['<List>'] as const,
    muiName: 'List',
    subComponents: ['ListItem'],

    extractChildren: extractListChildren,

    muiProps: {
        dense: {
            type: 'boolean',
            default: false,
        },
        disablePadding: {
            type: 'boolean',
            default: false,
        },
        subheader: {
            type: 'react-node',
        },
    },

    // width: fill이 아닌 고정 px는 sx에 적용 (generator에서 fill/hug 제외 처리)

    extractProperties: async (node: FigmaNode): Promise<ComponentProperties> => {
        const result: ComponentProperties = {};
        const r = result as Record<string, unknown>;
        const dense = getFigmaBooleanProp(node, 'Dense', 'dense');
        if (typeof dense === 'boolean') r.dense = dense;
        const disablePadding = getFigmaBooleanProp(node, 'Dis. Padding', 'Disable Padding', 'disablePadding');
        if (typeof disablePadding === 'boolean') r.disablePadding = disablePadding;
        return result;
    },

    generateJSX: (_componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<List${props}${sxAttribute}>
            ${content || ''}
        </List>`;
    },
};
