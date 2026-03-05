import { ComponentMapping } from './types/PropertyMapper';
import type { FigmaNode } from '../types';
import { findTextInChildByName, findTextRecursively } from '../utils/figma-node-utils';

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

    // MUI 공식 속성 (API 문서 기반)
    muiProps: {
        // value
        value: {
            type: 'string',
            extractFromFigma: (node) => {
                const fromValue = findTextInChildByName(node, 'Value');
                if (fromValue) return fromValue;
                return (node as any).componentProperties?.value?.value ?? (node as any).componentProperties?.Value?.value;
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
                const fromLabel = findTextInChildByName(node, 'Label');
                if (fromLabel) return fromLabel;
                return (node as any).componentProperties?.Label?.value ?? (node as any).componentProperties?.label?.value;
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
        const valueText = findTextInChildByName(node, 'Value');
        if (valueText) return valueText;
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
            return `<FormControl size="small"${sx ? ` sx={${sx}}` : ''}>
            <InputLabel id="${labelId}">${labelText.trim()}</InputLabel>
            <Select
            labelId="${labelId}"
            ${props.replace(/^\s+/, '').trim()}
            >
            ${safeContent}
            </Select>
        </FormControl>`;
        }

        return `<Select${props}${sxAttribute}>
            ${safeContent}
        </Select>`;
    },
};

