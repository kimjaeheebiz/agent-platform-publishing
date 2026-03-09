import type { FigmaNode, ComponentProperties } from '../types';
import { ComponentMapping } from './types/PropertyMapper';
import { getMuiIconName } from '../icon-mapper';
import {
    findFirstIconLikeChild,
    findTextRecursively,
    findTextInChildByName,
    getPropValue,
    getFigmaBooleanProp,
    normalizeFigmaNodeName,
} from '../utils/figma-node-utils';
import { extractChipPropsFromNode } from './Chip';

function buildToggleButtonChipJSX(chip: Record<string, unknown>): string {
    const labelVal = String(chip.label ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const parts: string[] = [`label="${labelVal}"`];
    if (chip.variant && chip.variant !== 'filled') parts.push(`variant="${chip.variant}"`);
    if (chip.size && chip.size !== 'medium') parts.push(`size="${chip.size}"`);
    if (chip.disabled === true) parts.push('disabled');
    if (chip.deletable === true) parts.push('onDelete={() => {}}');
    if (typeof chip.__chipAvatarInitials === 'string' && chip.__chipAvatarInitials) {
        const escaped = (chip.__chipAvatarInitials as string).replace(/"/g, '\\"');
        parts.push(`avatar={<Avatar>${escaped}</Avatar>}`);
    } else if (typeof chip.__chipIconName === 'string' && chip.__chipIconName) {
        const muiIcon = getMuiIconName('', chip.__chipIconName as string);
        if (muiIcon) parts.push(`icon={<${muiIcon} />}`);
    }
    return `<Chip ${parts.join(' ')} />`;
}

function buildToggleButtonIconJSX(properties: Record<string, unknown>): string | null {
    const toggleButtonIconName = properties.__toggleButtonIconName || properties.startIconName;
    const toggleButtonIconComponentId = properties.__toggleButtonIconComponentId || properties.startIconComponentId;
    if (properties.__toggleButtonShowIcon === false || (!toggleButtonIconName && !toggleButtonIconComponentId)) {
        return null;
    }

    const rawIconName = typeof toggleButtonIconName === 'string' ? toggleButtonIconName.replace(/[<>]/g, '').trim() : '';
    const muiIcon = getMuiIconName(String(toggleButtonIconComponentId || ''), typeof toggleButtonIconName === 'string' ? toggleButtonIconName : undefined);
    if (muiIcon) return `<${muiIcon} />`;
    if (rawIconName && /^[A-Z][A-Za-z0-9]+$/.test(rawIconName) && rawIconName !== 'Icon') {
        return `<${rawIconName} />`;
    }
    return null;
}

/**
 * MUI ToggleButton 컴포넌트 매핑
 *
 * Figma 속성 (boolean에 따라 icon/text/chip 생성 여부 결정):
 * - Size, State → size, disabled
 * - Selected → selected (단, ToggleButtonGroup 자식이면 그룹 value가 제어)
 *
 * 공식 문서: https://mui.com/material-ui/api/toggle-button/
 */
export const ToggleButtonMapping: ComponentMapping = {
    figmaNames: ['<ToggleButton>'] as const,
    muiName: 'ToggleButton',

    muiProps: {
        value: {
            type: 'union',
            values: ['string', 'number'] as const,
            extractFromFigma: (node) => {
                const props = (node as any).componentProperties || {};
                const v = getPropValue(props, 'value');
                if (typeof v === 'string' || typeof v === 'number') return v;
                const valueText = findTextInChildByName(node, /value/i);
                return typeof valueText === 'string' && valueText.trim() ? valueText.trim() : undefined;
            },
        },
        selected: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node, 'Selected', 'Selected?', 'selected'),
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
                return getFigmaBooleanProp(node, 'Disabled?', 'Disabled', 'State') ?? false;
            },
        },
        fullWidth: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => (node as any).layoutSizingHorizontal === 'FILL',
        },
        disableFocusRipple: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node, 'Disable focus ripple?', 'DisableFocusRipple'),
        },
        disableRipple: {
            type: 'boolean',
            default: false,
            extractFromFigma: (node) => getFigmaBooleanProp(node, 'Disable ripple?', 'DisableRipple'),
        },
        onChange: { type: 'function' },
    },

    excludeFromSx: ['backgroundColor', 'borderRadius'],

    extractContent: (node) => {
        const props = (node as any).componentProperties || {};
        const labelProp = getPropValue(props, 'label');
        if (typeof labelProp === 'string') return labelProp;
        return findTextInChildByName(node, 'Label') ?? findTextRecursively(node.children || []);
    },

    /**
     * Figma boolean 반영: Text? OFF → __toggleButtonShowText false, Chip? ON일 때만 Chip 추출
     */
    extractProperties: async (node: FigmaNode, extractor?: any): Promise<ComponentProperties> => {
        const result: ComponentProperties = {};
        (result as any).__toggleButtonShowIcon = getFigmaBooleanProp(node, 'Icon?', 'Icon', 'icon') !== false;
        (result as any).__toggleButtonShowText = getFigmaBooleanProp(node, 'Text?', 'Text', 'text') !== false;

        // ToggleButton는 첫 번째 자식이 아이콘이라는 규칙을 우선 사용
        const firstIconChild = findFirstIconLikeChild(node.children || []) as any;
        if (firstIconChild) {
            const firstName = normalizeFigmaNodeName(firstIconChild.name);
            if (firstName && firstName !== 'Value' && firstName !== 'Label' && firstName !== 'Chip') {
                (result as any).__toggleButtonIconName = firstName;
            }
            if (firstIconChild.componentId) {
                (result as any).__toggleButtonIconComponentId = firstIconChild.componentId;
            }
        }

        const chipOn = getFigmaBooleanProp(node, 'Chip?', 'Chip', 'chip');
        if (!chipOn) return result;

        const children = node.children || [];
        const chipChild = children.find((c: any) => (c.name || '').replace(/<|>/g, '') === 'Chip' || (c.name || '').toLowerCase().includes('chip'));
        if (!chipChild) return result;

        const chipProps = await extractChipPropsFromNode(chipChild as FigmaNode, extractor);
        if (chipProps.label) (result as any).__toggleButtonChipProps = chipProps;
        return result;
    },

    extractIcons: async (node: FigmaNode, extractor?: any) => {
        // 기본적으로 아이콘 생성, 명시적으로 false일 때만 미출력
        if (getFigmaBooleanProp(node, 'Icon?', 'Icon', 'icon') === false) {
            return {};
        }
        const { extractIconsForToggleButton } = await import('../utils/icon-extractor');
        return await extractIconsForToggleButton(node, extractor);
    },

    generateJSX: (_componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        const toggleButtonProps = (properties || {}) as Record<string, unknown>;
        const parts: string[] = [];

        const iconJSX = buildToggleButtonIconJSX(toggleButtonProps);
        if (iconJSX) parts.push(iconJSX);

        const textContent = content ? String(content).trim() : '';
        if (toggleButtonProps.__toggleButtonShowText !== false && textContent) {
            parts.push(textContent);
        }

        const chipProps = toggleButtonProps.__toggleButtonChipProps;
        if (chipProps && typeof chipProps === 'object' && typeof (chipProps as Record<string, unknown>).label === 'string' && (chipProps as Record<string, unknown>).label) {
            parts.push(buildToggleButtonChipJSX(chipProps as Record<string, unknown>));
        }

        const inner = parts.join('\n            ');
        return `<ToggleButton${props}${sxAttribute}>${inner ? `\n            ${inner}\n        ` : ''}</ToggleButton>`;
    },
};

