import { ComponentMapping } from './types/PropertyMapper';
import { getPropValue, getFigmaBooleanProp } from '../utils/figma-node-utils';

/**
 * MUI ToggleButtonGroup 컴포넌트 매핑
 * 공식 문서: https://mui.com/material-ui/api/toggle-button-group/
 */
export const ToggleButtonGroupMapping: ComponentMapping = {
    figmaNames: ['<ToggleButtonGroup>'] as const,
    muiName: 'ToggleButtonGroup',

    muiProps: {
        value: {
            type: 'union',
            values: ['string', 'number', 'array'] as const,
        },
        onChange: { type: 'function' },
        exclusive: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node, 'Exclusive?', 'Exclusive', 'exclusive') ?? true,
        },
        size: {
            type: 'union',
            values: ['small', 'medium', 'large'] as const,
            default: 'medium',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const raw = getPropValue(props, 'size');
                if (typeof raw === 'string') return raw.toLowerCase();
                return undefined;
            },
        },
        color: {
            type: 'union',
            values: ['standard', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'standard',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const raw = getPropValue(props, 'color');
                if (typeof raw === 'string') return raw.toLowerCase();
                return undefined;
            },
        },
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const state = getPropValue(props, 'state');
                if (state === 'Disabled' || state === 'disabled') return true;
                return getFigmaBooleanProp(node, 'Disabled?', 'Disabled') ?? false;
            },
        },
        fullWidth: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => (node as any).layoutSizingHorizontal === 'FILL',
        },
        orientation: {
            type: 'union',
            values: ['horizontal', 'vertical'] as const,
            default: 'horizontal',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const raw = getPropValue(props, 'orientation');
                if (typeof raw === 'string') return raw.toLowerCase();
                return undefined;
            },
        },
    },

    // MUI 기본 스타일 사용, sx 제외
    excludeFromSx: [],

    generateJSX: (_componentName, props, content) => {
        return `<ToggleButtonGroup${props}>
            ${content}
        </ToggleButtonGroup>`;
    },
};

