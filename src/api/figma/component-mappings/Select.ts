import { ComponentMapping } from './types/PropertyMapper';
import type { FigmaNode } from '../types';
import {
    findDescendantByName,
    findTextInChildByName,
    findTextRecursively,
    getFigmaBooleanProp,
    getPropValue,
} from '../utils/figma-node-utils';

/** Input > Container 직계 자식 중 이름이 Label/T Label 인 노드 텍스트 (인스턴스에서도 마스터와 동일하게 라벨로 취급) */
function getSelectContainerLabelLayerText(node: FigmaNode): string | undefined {
    const input = findDescendantByName(node, 'Input');
    const container = input
        ? findDescendantByName(input as FigmaNode, 'Container')
        : findDescendantByName(node, 'Container');
    if (!container) return undefined;
    for (const c of (container as any).children || []) {
        if (!c || c.visible === false) continue;
        const nm = String(c.name || '').trim();
        if (/^label$/i.test(nm) || /^t\s*label$/i.test(nm) || nm.toLowerCase() === 'label') {
            const t = findTextRecursively([c]);
            if (t?.trim()) return t.trim();
        }
    }
    return undefined;
}

/** Label 레이어 없을 때만 Container 안 첫 표시 텍스트 (Has Value 등과 조합해 보조) */
function firstDisplayTextInSelectContainer(node: FigmaNode): string | undefined {
    const fromNamed = getSelectContainerLabelLayerText(node);
    if (fromNamed) return fromNamed;
    const input = findDescendantByName(node, 'Input');
    const container = input
        ? findDescendantByName(input as FigmaNode, 'Container')
        : findDescendantByName(node, 'Container');
    if (!container) return undefined;
    const cont = container as any;
    const skipName = (name: string) =>
        /arrow|dropdown|icon|close|autocomplete|min-height|min-width|helper/i.test(name);
    const walk = (x: any): string | undefined => {
        if (!x || x.visible === false) return undefined;
        if (x.type === 'TEXT' && typeof x.characters === 'string') {
            const t = x.characters.trim();
            if (!t) return undefined;
            if (skipName(String(x.name || ''))) return undefined;
            return t;
        }
        for (const c of x.children || []) {
            const w = walk(c);
            if (w) return w;
        }
        return undefined;
    };
    return walk(cont);
}

/**
 * MUI Select 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-select/
 */
export const SelectMapping: ComponentMapping = {
    // 피그마 컴포넌트 이름
    figmaNames: ['<Select>'] as const,

    // MUI 컴포넌트 이름
    muiName: 'Select',

    /**
     * Has Value=false: componentProperties.Label 이 비어 있어도 Container 안 Label/T Label 레이어에
     * 실제 문구가 있으면 여기서 먼저 주입 (muiProps label 이 "" 로 덮어쓰는 것 방지)
     */
    extractProperties: async (node: FigmaNode) => {
        const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
        const raw = getPropValue(props, 'label') ?? getPropValue(props, 'Label');
        const fromProp = typeof raw === 'string' ? raw.trim() : raw != null ? String(raw).trim() : '';
        if (fromProp) return {};
        const valueRaw = getPropValue(props, 'value') ?? getPropValue(props, 'Value');
        const hasValueText =
            typeof valueRaw === 'string'
                ? valueRaw.trim().length > 0
                : valueRaw != null && String(valueRaw).trim().length > 0;
        /** Figma는 Has Value=false여도 Value TEXT prop에 문구가 남는 경우가 많음 → 그때만 보면 라벨 주입이 막힘 */
        const hasValueOff = getFigmaBooleanProp(node as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?') === false;
        const labelLayer = getSelectContainerLabelLayerText(node);
        const t = firstDisplayTextInSelectContainer(node);
        if (process.env.FIGMA_DEBUG_SELECT === '1') {
            // eslint-disable-next-line no-console
            console.warn(
                '[figma Select extractProperties]',
                (node as any)?.name,
                (node as any)?.id,
                'fromPropLabel=',
                fromProp || '(empty)',
                'HasValue=',
                getFigmaBooleanProp(node as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?'),
                'valuePropNonEmpty=',
                hasValueText,
                'labelLayer=',
                labelLayer || '(none)',
                'containerFallback=',
                t || '(none)',
            );
        }
        /** Label 레이어 문구는 Value/Has Value prop과 무관하게 항상 MUI label (인스턴스에서 Has Value 미노출·Value만 채워진 경우 대응) */
        if (labelLayer?.trim()) {
            return { label: labelLayer.trim() };
        }
        if (!t?.trim()) return {};
        if (hasValueOff) {
            return { label: t.trim() };
        }
        if (!hasValueText) {
            return { label: t.trim() };
        }
        return {};
    },

    // MUI 공식 속성 (API 문서 기반)
    muiProps: {
        // value
        value: {
            type: 'string',
            extractFromFigma: (node) => {
                const fromValue = findTextInChildByName(node, 'Value');
                if (fromValue) return fromValue;
                const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
                const v = getPropValue(props, 'value') ?? getPropValue(props, 'Value');
                return typeof v === 'string' ? v : v != null ? String(v) : undefined;
            },
        },

        // onChange
        onChange: { type: 'function' },

        // native
        native: { type: 'boolean', default: false },

        // variant (MUI 기본값: 'outlined')
        variant: {
            type: 'union',
            values: ['standard', 'outlined', 'filled'] as const,
            default: 'outlined',
            extractFromFigma: (node) => {
                const v = (node as any).componentProperties?.Variant?.value ?? (node as any).componentProperties?.variant?.value;
                return typeof v === 'string' ? v.toLowerCase() : v;
            },
        },

        // size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            extractFromFigma: (node) => {
                const s = (node as any).componentProperties?.Size?.value ?? (node as any).componentProperties?.size?.value;
                return typeof s === 'string' ? s.toLowerCase() : s;
            },
        },

        // fullWidth
        fullWidth: { type: 'boolean', default: false },

        // disabled
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const state = (node as any).componentProperties?.State?.value ?? (node as any).componentProperties?.state?.value;
                return state === 'Disabled' || state === 'disabled';
            },
        },

        // displayEmpty
        displayEmpty: { type: 'boolean', default: false },

        // multiple
        multiple: { type: 'boolean', default: false },

        // label
        label: {
            type: 'string',
            extractFromFigma: (node) => {
                const props = ((node as any).componentProperties || {}) as Record<string, unknown>;
                const rawProp = getPropValue(props, 'label') ?? getPropValue(props, 'Label');
                const fromProp =
                    typeof rawProp === 'string'
                        ? rawProp.trim()
                        : rawProp != null
                          ? String(rawProp).trim()
                          : '';

                const fromNamedLabel = findTextInChildByName(node, 'Label')?.trim();
                if (fromNamedLabel) return fromNamedLabel;
                if (fromProp) return fromProp;

                const hasValue = getFigmaBooleanProp(node as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?');
                const fromContainer = firstDisplayTextInSelectContainer(node);
                if (fromContainer && (hasValue === false || !fromProp)) return fromContainer;

                if (hasValue === false) {
                    for (const [k, raw] of Object.entries(props)) {
                        const key = String(k).toLowerCase();
                        const p = raw as any;
                        if (!p || typeof p !== 'object') continue;
                        const text = p.type === 'TEXT' ? (p.value ?? '') : '';
                        if (typeof text !== 'string') continue;
                        const t = text.trim();
                        if (!t) continue;
                        if (key.includes('label') || key.includes('placeholder') || key.includes('name')) {
                            return t;
                        }
                    }
                }

                return fromContainer;
            },
        },
    },

    excludeFromSx: ['backgroundColor'],

    subComponents: ['MenuItem'] as const,

    /** Adorn Start/End 컨테이너에서 아이콘 추출 (TextField와 동일한 공통 로직) */
    extractIcons: async (node: FigmaNode, extractor?: any) => {
        const { extractAdornIconsFromNode } = await import('../utils/icon-extractor');
        return extractAdornIconsFromNode(node, extractor);
    },

    // 표시값(Value) 또는 라벨 텍스트 추출 — 자식이 MenuItem이 없을 때 content로 사용
    extractContent: (node) => {
        const hasValue = getFigmaBooleanProp(node as any, 'Has Value', 'Has Value?', 'HasValue', 'HasValue?');
        const valueText = findTextInChildByName(node, 'Value');
        if (hasValue !== false && valueText) return valueText;
        const labelText = findTextInChildByName(node, 'Label');
        if (labelText) return labelText;
        return findTextRecursively((node as any).children || []);
    },

    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const figmaValue =
            (properties as any)?.value != null ? String((properties as any).value) : (content ? String(content).trim() : '');
        const escaped = figmaValue.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/"/g, '\\"');
        const valueAttr = figmaValue ? `value={\`${escaped}\`}` : '';
        const safeContent =
            content && !String(content).trim().includes('<MenuItem')
                ? `<MenuItem ${valueAttr}>${figmaValue || ' '}</MenuItem>`
                : (content || '');

        const labelText = (properties as any)?.label != null ? String((properties as any).label) : '';
        if (labelText.trim()) {
            const safeId = labelText.trim().replace(/\s+/g, '-').replace(/[^\w\uac00-\ud7af-]/gi, '') || 'label';
            const labelId = `select-${safeId}-label`;
            const labEsc = labelText.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"');
            const propsTrim = props.replace(/^\s+/, '').trim();
            const hasSize = /\bsize=/.test(propsTrim);
            const hasLabelProp = /\blabel=/.test(propsTrim);
            const sizeAttr = hasSize ? '' : 'size="small" ';
            const labelAttr = hasLabelProp ? '' : `label="${labEsc}" `;
            return `<FormControl size="small"${sx ? ` sx={${sx}}` : ''}>
            <InputLabel id="${labelId}">${labelText.trim()}</InputLabel>
            <Select
            labelId="${labelId}"
            ${labelAttr}${sizeAttr}${propsTrim}
            >
            ${safeContent}
            </Select>
        </FormControl>`;
        }

        // 라벨 없을 때도 피그마 Small = MUI size="small" 반영 (props에 size 없으면 기본 출력)
        const propsTrim = props.replace(/^\s+/, '').trim();
        const hasSize = /\bsize=/.test(propsTrim);
        const sizeAttr = hasSize ? '' : ' size="small"';
        return `<Select${sizeAttr}${props ? ` ${propsTrim}` : ''}${sxAttribute}>
            ${safeContent}
        </Select>`;
    },
};

