import { ComponentMapping } from './types/PropertyMapper';
import { getPropValue, getFigmaBooleanProp } from '../utils/figma-node-utils';

/**
 * MUI ButtonGroup 컴포넌트 매핑
 *
 * 공식 문서:
 * - https://mui.com/material-ui/react-button-group/
 * - https://mui.com/material-ui/api/button-group/
 *
 * ButtonGroup은 관련된 Button들을 그룹으로 묶을 때 사용합니다.
 * 직계 자식으로 Button만 허용됩니다.
 */
export const ButtonGroupMapping: ComponentMapping = {
    figmaNames: ['<ButtonGroup>', 'ButtonGroup'] as const,
    muiName: 'ButtonGroup',

    muiProps: {
        // color (MUI 기본값: 'primary')
        color: {
            type: 'union',
            values: ['inherit', 'primary', 'secondary', 'error', 'info', 'success', 'warning'] as const,
            default: 'primary',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const raw = getPropValue(props, 'color');
                if (typeof raw === 'string') return raw.toLowerCase();
                return undefined;
            },
        },
        // orientation (MUI 기본값: 'horizontal')
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
        // size (MUI 기본값: 'medium')
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
        // variant (MUI 기본값: 'outlined')
        variant: {
            type: 'union',
            values: ['contained', 'outlined', 'text'] as const,
            default: 'outlined',
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const raw = getPropValue(props, 'variant');
                if (typeof raw === 'string') return raw.toLowerCase();
                return undefined;
            },
        },
        disabled: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) =>
                getFigmaBooleanProp(node, 'Disabled?', 'Disabled', 'disabled') ?? false,
        },
        disableElevation: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) =>
                getFigmaBooleanProp(node, 'DisableElevation', 'disableElevation') ?? false,
        },
        disableFocusRipple: {
            type: 'boolean',
            default: false,
        },
        disableRipple: {
            type: 'boolean',
            default: false,
        },
        fullWidth: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => (node as any).layoutSizingHorizontal === 'FILL',
        },
    },

    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'justifyContent',
        'alignItems',
        'padding',
        'color',
        'borderColor',
    ],

    generateJSX: (_componentName, props, content, sx) => {
        const sxAttribute = sx ? ` sx={${sx}}` : '';
        return `<ButtonGroup${props}${sxAttribute}>
            ${content}
        </ButtonGroup>`;
    },
};
