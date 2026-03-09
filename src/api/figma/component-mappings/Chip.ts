import type { FigmaNode } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { getFigmaBooleanProp, findTextRecursively } from '../utils/figma-node-utils';

/**
 * Chip Figma 노드에서 Chip용 props 객체 추출 (단일 소스: ToggleButton 내부 Chip 등에서 재사용)
 * Chip.ts 수정 시 여기만 맞추면 됨.
 */
export async function extractChipPropsFromNode(
    node: FigmaNode,
    extractor?: any
): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};
    const defs = ChipMapping.muiProps as Record<string, { extractFromFigma?: (n: FigmaNode) => unknown }>;

    for (const [key, def] of Object.entries(defs)) {
        if (def?.extractFromFigma) {
            const v = def.extractFromFigma(node);
            if (v !== undefined && v !== null) result[key] = v;
        }
    }

    if (!result.label && (node as any).children?.length) {
        const text = findTextRecursively((node as any).children);
        if (text) result.label = text;
    }

    if (ChipMapping.extractProperties) {
        const extra = await ChipMapping.extractProperties(node, extractor);
        if (extra && typeof extra === 'object') {
            if ((extra as any).__chipAvatarInitials != null) result.__chipAvatarInitials = (extra as any).__chipAvatarInitials;
            if ((extra as any).__chipIconName != null) result.__chipIconName = (extra as any).__chipIconName;
        }
    }

    return result;
}

/**
 * MUI Chip 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-chip/
 * - Deletable: https://mui.com/material-ui/react-chip/#deletable
 * - Adornments (avatar/icon): https://mui.com/material-ui/react-chip/#chip-adornments
 */
export const ChipMapping: ComponentMapping = {
    figmaNames: ['<Chip>', 'Chip'] as const,
    muiName: 'Chip',

    muiProps: {
        // label (필수)
        label: {
            type: 'string',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const labelProp = props.Label || props.label || props['Label Text'];
                const value = typeof labelProp === 'object' && labelProp?.value != null ? labelProp.value : labelProp;
                if (typeof value === 'string') return value;
                const key = Object.keys(props).find((k) => k.split('#')[0].trim() === 'Label' || k.split('#')[0].trim() === 'label');
                if (key) {
                    const raw = props[key];
                    const v = raw && typeof raw === 'object' && 'value' in raw ? (raw as { value: unknown }).value : raw;
                    return typeof v === 'string' ? v : undefined;
                }
                return undefined;
            },
        },

        // variant (MUI 기본값: 'filled')
        variant: {
            type: 'union',
            values: ['filled', 'outlined'] as const,
            default: 'filled',
            extractFromFigma: (node) => {
                const v = (node as any).componentProperties?.Variant || (node as any).componentProperties?.variant;
                const value = typeof v === 'object' && v?.value != null ? v.value : v;
                if (typeof value !== 'string') return undefined;
                return value.toLowerCase().includes('outline') ? 'outlined' : 'filled';
            },
        },

        // color (MUI 기본값: 'default')
        color: {
            type: 'union',
            values: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'default',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const c = props.Color || props.color || props.Status || props.status;
                const value = typeof c === 'object' && c?.value != null ? c.value : c;
                if (typeof value !== 'string') return undefined;
                const lower = value.toLowerCase();
                return ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'].includes(lower) ? lower : undefined;
            },
        },

        // size (MUI 기본값: 'medium')
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
            extractFromFigma: (node) => {
                const s = (node as any).componentProperties?.Size || (node as any).componentProperties?.size;
                const value = typeof s === 'object' && s?.value != null ? s.value : s;
                if (typeof value !== 'string') return undefined;
                const lower = value.toLowerCase();
                return lower === 'small' || lower === 'medium' ? lower : undefined;
            },
        },

        // disabled
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const state = (node as any).componentProperties?.State || (node as any).componentProperties?.state;
                const value = typeof state === 'object' && state?.value != null ? state.value : state;
                if (value === 'Disabled' || value === 'disabled') return true;
                const disabledProp = (node as any).componentProperties?.['Disabled?'];
                return disabledProp?.type === 'BOOLEAN' && Boolean(disabledProp?.value);
            },
        },

        // clickable
        clickable: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const p = (node as any).componentProperties?.['Clickable?'] || (node as any).componentProperties?.['Action?'];
                return p?.type === 'BOOLEAN' && Boolean(p?.value);
            },
        },

        // deletable (Delete? → onDelete는 generator에서 처리)
        deletable: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node, 'Delete?', 'Delete'),
        },
    },

    excludeFromSx: ['backgroundColor', 'borderColor', 'color', 'borderRadius'],
    extractContent: () => null,

    /** Chip 자식: Thumbnail? ON 시 <Avatar>(Initials) 또는 <Icon> → avatar / icon prop */
    extractProperties: async (node, extractor) => {
        const props = (node as any).componentProperties || {};
        const result: Record<string, unknown> = {};

        const thumbnailOn = getFigmaBooleanProp(node, 'Thumbnail?', 'Thumbnail');
        if (!thumbnailOn) return result;

        const children = (node as any).children || [];
        for (const child of children) {
            if (child?.visible === false) continue;
            const name = String((child as any).name ?? '').trim();

            if (name === '<Avatar>' || name === 'Avatar') {
                const ap = (child as any).componentProperties || {};
                const content = ap.Content?.value ?? ap.content?.value ?? ap.Content ?? ap.content;
                const initials = ap.Initials?.value ?? ap.initials?.value ?? ap.Initials ?? ap.initials;
                const key = Object.keys(ap).find((k) => k.split('#')[0].trim().toLowerCase() === 'initials');
                const initialsVal = key ? (ap[key]?.value ?? ap[key]) : initials;
                if (typeof initialsVal === 'string' && initialsVal) {
                    result['__chipAvatarInitials'] = initialsVal;
                    return result;
                }
                if (content === 'Icon' || (typeof content === 'string' && content.toLowerCase() === 'icon')) {
                    const iconChild = (child as any).children?.find((c: any) =>
                        c?.type === 'INSTANCE' && (String(c.name || '').includes('Icon') || (c as any).componentId)
                    );
                    if (iconChild && (iconChild as any).componentId && extractor?.iconNodeNameCache) {
                        const iconName = (extractor as any).iconNodeNameCache.get((iconChild as any).componentId)
                            ?? (iconChild as any).name?.replace?.(/<|>/g, '')?.trim();
                        if (iconName && iconName !== 'Icon') {
                            result['__chipIconName'] = iconName;
                            return result;
                        }
                    }
                }
                continue;
            }

            if (name === '<Icon>' || name === 'Icon' || ((child as any).type === 'INSTANCE' && name.includes('Icon'))) {
                const compId = (child as any).componentId;
                let iconName: string | undefined;
                if (extractor?.iconNodeNameCache && compId) {
                    iconName = (extractor as any).iconNodeNameCache.get(compId);
                }
                if (!iconName && (child as any).name) {
                    iconName = (child as any).name.replace(/<|>/g, '').trim();
                }
                if (iconName && iconName !== 'Icon') {
                    result['__chipIconName'] = iconName;
                    return result;
                }
            }
        }
        return result;
    },

    generateJSX: (componentName, props, content, sx, properties) => {
        const labelVal = String((properties as any).label ?? '').replace(/"/g, '\\"');
        const rest = (props || '').replace(/\s*label="[^"]*"/g, '').trim();
        const sxAttribute = sx ? ` sx={${sx}}` : '';
        return `<Chip label="${labelVal}"${rest ? ` ${rest}` : ''}${sxAttribute} />`;
    },
};
