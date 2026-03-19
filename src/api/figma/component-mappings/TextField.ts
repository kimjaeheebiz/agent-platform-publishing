import { ComponentMapping } from './types/PropertyMapper';
import type { FigmaNode, ComponentProperties } from '../types';
import { findTextInChildByName, getFigmaBooleanProp } from '../utils/figma-node-utils';

/**
 * MUI TextField 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-text-field/
 */
export const TextFieldMapping: ComponentMapping = {
    // 피그마 컴포넌트 이름
    figmaNames: ['<TextField>', '<Input>'] as const,

    // MUI 컴포넌트 이름
    muiName: 'TextField',

    // MUI 공식 속성 (API 문서 기반)
    muiProps: {
        // variant (MUI 기본값: 'outlined')
        variant: {
            type: 'union',
            values: ['outlined', 'filled', 'standard'] as const,
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

        // placeholder
        placeholder: {
            type: 'string',
            extractFromFigma: (node) => {
                const placeholdersOn = getFigmaBooleanProp(node, 'Placeholder?', 'Placeholder');
                if (placeholdersOn === false) return undefined;
                const fromPlaceholder = findTextInChildByName(node, 'Placeholder');
                if (fromPlaceholder) return fromPlaceholder;
                return (node as any).componentProperties?.Placeholder?.value ?? (node as any).componentProperties?.placeholder?.value;
            },
        },

        // label
        label: {
            type: 'string',
            extractFromFigma: (node) => {
                const fromLabel = findTextInChildByName(node, 'Label');
                if (fromLabel) return fromLabel;
                return (node as any).componentProperties?.Label?.value ?? (node as any).componentProperties?.label?.value;
            },
        },

        // helperText
        helperText: {
            type: 'string',
            extractFromFigma: (node) => {
                const helperOn = getFigmaBooleanProp(node, 'Helper?', 'Helper');
                if (helperOn !== true) return undefined;
                const fromHelper = findTextInChildByName(node, 'Helper');
                if (fromHelper) return fromHelper;
                return (node as any).componentProperties?.HelperText?.value ?? (node as any).componentProperties?.helperText?.value;
            },
        },

        // required
        required: { type: 'boolean', default: false },

        // disabled
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const state = (node as any).componentProperties?.State?.value ?? (node as any).componentProperties?.state?.value;
                return state === 'Disabled' || state === 'disabled';
            },
        },

        // fullWidth
        fullWidth: { type: 'boolean', default: false },

        // multiline
        multiline: { type: 'boolean', default: false },

        // rows
        rows: { type: 'union-number' },

        // autoFocus
        autoFocus: { type: 'boolean', default: false },

        // type
        type: {
            type: 'union',
            values: ['text', 'password', 'number', 'email', 'tel', 'url', 'search'] as const,
        },

        // value
        value: {
            type: 'string',
            extractFromFigma: (node) => {
                const hasValue = getFigmaBooleanProp(node, 'Value?', 'Has Value');
                if (hasValue !== true) return undefined;
                const fromValue = findTextInChildByName(node, 'Value');
                if (fromValue) return fromValue;
                return (node as any).componentProperties?.Value?.value ?? (node as any).componentProperties?.value?.value;
            },
        },

        // defaultValue
        defaultValue: {
            type: 'string',
            extractFromFigma: (node) => {
                const hasValue = getFigmaBooleanProp(node, 'Value?', 'Has Value');
                if (hasValue !== true) return undefined;
                const fromValue = findTextInChildByName(node, 'Value');
                if (fromValue) return fromValue;
                return (node as any).componentProperties?.Value?.value ?? (node as any).componentProperties?.defaultValue?.value;
            },
        },
    },

    excludeFromSx: ['backgroundColor'],
    transformProps: (properties: ComponentProperties): ComponentProperties => {
        const p = properties as Record<string, unknown>;
        const value = p.value;
        const defaultValue = p.defaultValue;
        if (value != null && value !== '' && defaultValue != null && defaultValue !== '') {
            const { value: _v, defaultValue: _d, ...rest } = p;
            return { ...rest, defaultValue: value } as ComponentProperties;
        }
        return properties;
    },
    extractContent: () => null,

    extractIcons: async (node: FigmaNode, extractor?: any) => {
        const { extractAdornIconsFromNode } = await import('../utils/icon-extractor');
        return extractAdornIconsFromNode(node, extractor);
    },

    // ✅ JSX 생성 템플릿 정의 (MUI TextField: 피그마 Small = size="small" 반영, 없으면 기본 출력)
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const propsTrim = (props || '').replace(/^\s+/, '').trim();
        const hasSize = /\bsize=/.test(propsTrim);
        const sizeAttr = hasSize ? '' : ' size="small"';
        return `<TextField${sizeAttr}${propsTrim ? ` ${propsTrim}` : ''}${sxAttribute}>
            ${content}
        </TextField>`;
    },
};

