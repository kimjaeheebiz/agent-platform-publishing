/**
 * Figma / core.json 토큰 → MUI theme.components 자동 생성
 *
 * **자동화 원칙**
 * - `to-mui-theme.ts`에 컴포넌트마다 if 블록을 늘리지 않습니다.
 * - 타이포 슬롯 매핑: 아래 `MUI_TYPO_SLOT_MAPPINGS`에 **한 줄**만 추가하면 됩니다.
 * - TextField·Select 입력값: `input.value`(small/medium) + `input.valueLarge`(large) — `applyInputValueTypography`
 * - InputLabel: 레스트는 `input.value`(large는 `input.valueLarge`), shrink만 `input.label`(12px) 고정
 * - 버튼 사이즈 variants: `BUTTON_SIZE_TYPO_SEQUENCE` (large/medium/small) → `MuiButton` + 동일 `core.button.*` 타이포를 `MuiToggleButton` size 슬롯에 반영 (Toggle은 `textTransform: 'none'`). xsmall은 `appMuiButtonVariantAppend`.
 * - 레이아웃 상수(minHeight 등): `src/theme/appTheme/constants.ts`
 *
 * 앱 전역 수동 스타일: `src/theme/appTheme/muiComponents.ts` → `merge-theme-with-app-components.ts`가 빌드 시 통합
 *
 * @see https://mui.com/material-ui/customization/theme-components/
 */

import type { Json, JsonRecord } from './types';
import { isTokenValue, asJsonRecord } from './types';
import { CONTROL_HEIGHT_BY_SIZE } from '../../src/theme/appTheme/constants';

// ---------------------------------------------------------------------------
// 선언적 매핑 — 새 컴포넌트는 여기만 수정
// ---------------------------------------------------------------------------

/** core.json 기준 경로 → MUI styleOverrides 슬롯 (타이포 토큰 → CSS 객체는 parseTypoToken이 처리) */
export type TypoSlotMapping = {
    readonly muiComponent: string;
    readonly styleOverrideSlot: string;
    readonly tokenPath: readonly string[];
};

export const MUI_TYPO_SLOT_MAPPINGS: readonly TypoSlotMapping[] = [
    { muiComponent: 'MuiChip', styleOverrideSlot: 'label', tokenPath: ['chip', 'label'] },
    { muiComponent: 'MuiTooltip', styleOverrideSlot: 'tooltip', tokenPath: ['tooltip', 'label'] },
    { muiComponent: 'MuiBadge', styleOverrideSlot: 'badge', tokenPath: ['badge', 'label'] },
    { muiComponent: 'MuiAlert', styleOverrideSlot: 'message', tokenPath: ['alert', 'title'] },
    // TextField는 MUI에서 `MuiTextField` 슬롯이 root뿐이라 label/input/helperText styleOverrides는 DOM에 안 붙음.
    // 실제 입력은 OutlinedInput / FilledInput / Input, 라벨은 InputLabel, 도움말은 FormHelperText.
    // InputLabel 타이포는 `applyInputLabelTypography`(value / valueLarge / shrink용 label)에서 처리.
    { muiComponent: 'MuiFormHelperText', styleOverrideSlot: 'root', tokenPath: ['input', 'helper'] },
    /** Checkbox·Radio 등 `FormControlLabel` 라벨 — MUI `typography.body2`와 동일 토큰 (`core.typography.body2`) */
    { muiComponent: 'MuiFormControlLabel', styleOverrideSlot: 'label', tokenPath: ['typography', 'body2'] },
    /** `FormLabel` 기본 라벨 텍스트 — MUI `typography.body2`와 동일 토큰 (`core.typography.body2`) */
    { muiComponent: 'MuiFormLabel', styleOverrideSlot: 'root', tokenPath: ['typography', 'body2'] },
];

/** MUI Button size prop → core.button 하위 토큰 키 (순서대로 variants 생성) */
export const BUTTON_SIZE_TYPO_SEQUENCE: readonly { readonly size: string; readonly coreKey: string }[] = [
    { size: 'large', coreKey: 'large' },
    { size: 'medium', coreKey: 'medium' },
    { size: 'small', coreKey: 'small' },
];

// ---------------------------------------------------------------------------
// 구현
// ---------------------------------------------------------------------------

function getTokenNodeAtPath(core: Json, pathKeys: readonly string[]): unknown {
    let cur: unknown = core;
    for (const k of pathKeys) {
        if (!cur || typeof cur !== 'object' || cur === null || !(k in cur)) return undefined;
        cur = (cur as Record<string, unknown>)[k];
    }
    return cur;
}

function applyTypoSlotMappings(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
    components: JsonRecord,
): void {
    for (const m of MUI_TYPO_SLOT_MAPPINGS) {
        const node = getTokenNodeAtPath(tokensCore, m.tokenPath);
        if (!isTokenValue(node)) continue;

        const style = parseTypoToken(node.$value);
        if (Object.keys(style).length === 0) continue;

        if (!components[m.muiComponent]) {
            components[m.muiComponent] = { styleOverrides: {} };
        }
        const comp = asJsonRecord(components[m.muiComponent]);
        if (!comp.styleOverrides) comp.styleOverrides = {};
        const so = asJsonRecord(comp.styleOverrides);
        so[m.styleOverrideSlot] = style;
    }
}

/** TextField·Select 입력값 타이포: small/medium → `input.value`, large → `input.valueLarge` (루트 `sizeLarge`와 병합) */
const INPUT_VALUE_TYPO_CONFIG = [
    { muiComponent: 'MuiOutlinedInput', slot: 'input', largeChildSelector: '& .MuiOutlinedInput-input' },
    { muiComponent: 'MuiFilledInput', slot: 'input', largeChildSelector: '& .MuiFilledInput-input' },
    { muiComponent: 'MuiInput', slot: 'input', largeChildSelector: '& .MuiInput-input' },
    { muiComponent: 'MuiSelect', slot: 'select', largeChildSelector: '& .MuiSelect-select' },
] as const;

function applyInputValueTypography(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
    components: JsonRecord,
): void {
    const valueNode = getTokenNodeAtPath(tokensCore, ['input', 'value']);
    if (!isTokenValue(valueNode)) return;

    const baseStyle = parseTypoToken(valueNode.$value);
    if (Object.keys(baseStyle).length === 0) return;

    const valueLargeNode = getTokenNodeAtPath(tokensCore, ['input', 'valueLarge']);
    let largeStyle: JsonRecord | null = null;
    if (isTokenValue(valueLargeNode)) {
        const s = parseTypoToken(valueLargeNode.$value);
        if (Object.keys(s).length > 0) largeStyle = s;
    }

    const sizeLargeKey = '&.MuiInputBase-sizeLarge';

    for (const c of INPUT_VALUE_TYPO_CONFIG) {
        if (!components[c.muiComponent]) {
            components[c.muiComponent] = { styleOverrides: {} };
        }
        const comp = asJsonRecord(components[c.muiComponent]);
        if (!comp.styleOverrides) comp.styleOverrides = {};
        const so = asJsonRecord(comp.styleOverrides);
        so[c.slot] = baseStyle;

        if (!largeStyle) continue;

        if (!so.root) so.root = {};
        const root = asJsonRecord(so.root);
        if (!root[sizeLargeKey]) root[sizeLargeKey] = {};
        const sizeLarge = asJsonRecord(root[sizeLargeKey] as JsonRecord);
        sizeLarge[c.largeChildSelector] = largeStyle;
    }
}

/**
 * `MuiInputLabel`
 * - 레스트(가운데): `input.value`, large는 `input.valueLarge`
 * - shrink/focus(위로 올라간 라벨): `input.label`(12px)만 덮어쓰기
 */
function applyInputLabelTypography(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
    components: JsonRecord,
): void {
    const valueNode = getTokenNodeAtPath(tokensCore, ['input', 'value']);
    const valueLargeNode = getTokenNodeAtPath(tokensCore, ['input', 'valueLarge']);
    const labelNode = getTokenNodeAtPath(tokensCore, ['input', 'label']);
    if (!isTokenValue(valueNode) && !isTokenValue(valueLargeNode) && !isTokenValue(labelNode)) return;

    if (!components.MuiInputLabel) {
        components.MuiInputLabel = { styleOverrides: {} };
    }
    const comp = asJsonRecord(components.MuiInputLabel);
    if (!comp.styleOverrides) comp.styleOverrides = {};
    const so = asJsonRecord(comp.styleOverrides);
    if (!so.root) so.root = {};
    const root = asJsonRecord(so.root);

    if (isTokenValue(valueNode)) {
        const restStyle = parseTypoToken(valueNode.$value);
        if (Object.keys(restStyle).length > 0) {
            Object.assign(root, restStyle);
        }
    }

    if (isTokenValue(valueLargeNode)) {
        const largeStyle = parseTypoToken(valueLargeNode.$value);
        if (Object.keys(largeStyle).length > 0) {
            const sel = '&.MuiInputLabel-sizeLarge';
            const prev =
                root[sel] && typeof root[sel] === 'object' ? asJsonRecord(root[sel] as JsonRecord) : {};
            root[sel] = { ...prev, ...largeStyle };
        }
    }

    if (isTokenValue(labelNode)) {
        const shrinkStyle = parseTypoToken(labelNode.$value);
        if (Object.keys(shrinkStyle).length > 0) {
            const shrinkSelectors = [
                '&.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-filled.MuiInputLabel-shrink, &.MuiInputLabel-filled.Mui-focused',
                '&.MuiInputLabel-standard.MuiInputLabel-shrink',
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled.MuiInputLabel-shrink',
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-standard.MuiInputLabel-shrink',
            ] as const;
            for (const sel of shrinkSelectors) {
                const prev =
                    root[sel] && typeof root[sel] === 'object' ? asJsonRecord(root[sel] as JsonRecord) : {};
                root[sel] = { ...prev, ...shrinkStyle };
            }
        }
    }
}

function buildMuiButtonVariants(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
): { variants: Array<{ props: JsonRecord; style: JsonRecord }> } | null {
    const rawBtn =
        tokensCore && typeof tokensCore === 'object' ? (tokensCore as Record<string, unknown>).button : undefined;
    if (rawBtn === undefined || rawBtn === null || typeof rawBtn !== 'object') return null;

    const btn = asJsonRecord(rawBtn as Json);
    const variants: Array<{ props: JsonRecord; style: JsonRecord }> = [];

    for (const { size, coreKey } of BUTTON_SIZE_TYPO_SEQUENCE) {
        const node = btn[coreKey];
        if (!node || typeof node !== 'object' || node === null || !('$value' in node)) continue;

        const base = parseTypoToken(asJsonRecord(node).$value);
        let style: JsonRecord = base;

        if (coreKey === 'large') {
            style = { ...base, minHeight: CONTROL_HEIGHT_BY_SIZE.large };
        } else if (coreKey === 'medium') {
            style = { ...base, minHeight: CONTROL_HEIGHT_BY_SIZE.medium };
        } else if (coreKey === 'small') {
            style = { ...base, minHeight: CONTROL_HEIGHT_BY_SIZE.small };
        }

        variants.push({ props: { size }, style });
    }

    return { variants };
}

/** MUI ToggleButton `styleOverrides` 슬롯명 (size prop과 대응) */
const TOGGLE_SIZE_STYLE_SLOT: Record<string, string> = {
    large: 'sizeLarge',
    medium: 'sizeMedium',
    small: 'sizeSmall',
};

/**
 * `core.button` 타이포를 `MuiToggleButton`에 적용. `MuiButton` variants와 별개 컴포넌트라 기본 14px가 나오지 않도록 함.
 * 피그마 버튼 타이포(대문자 등)는 토큰에 있어도 Toggle은 `textTransform: 'none'`으로 덮어씀.
 */
function buildMuiToggleButtonStyleOverrides(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
): { styleOverrides: JsonRecord } | null {
    const rawBtn =
        tokensCore && typeof tokensCore === 'object' ? (tokensCore as Record<string, unknown>).button : undefined;
    if (rawBtn === undefined || rawBtn === null || typeof rawBtn !== 'object') return null;

    const btn = asJsonRecord(rawBtn as Json);
    const styleOverrides: JsonRecord = {};

    for (const { size, coreKey } of BUTTON_SIZE_TYPO_SEQUENCE) {
        const node = btn[coreKey];
        if (!node || typeof node !== 'object' || node === null || !('$value' in node)) continue;

        const base = parseTypoToken(asJsonRecord(node).$value);
        if (Object.keys(base).length === 0) continue;

        const slot = TOGGLE_SIZE_STYLE_SLOT[size];
        if (!slot) continue;

        styleOverrides[slot] = {
            ...base,
            textTransform: 'none',
        };
    }

    if (Object.keys(styleOverrides).length === 0) return null;
    return { styleOverrides };
}

/**
 * core.json + 타이포 파서로부터 `theme.components` 일부를 생성합니다.
 * `to-mui-theme.ts`는 parseTypoToken 클로저만 넘기면 됩니다.
 */
export function buildMuiComponentsFromDesignTokens(
    tokensCore: Json,
    parseTypoToken: (tokenValue: unknown) => JsonRecord,
): JsonRecord {
    const components: JsonRecord = {};

    applyTypoSlotMappings(tokensCore, parseTypoToken, components);
    applyInputLabelTypography(tokensCore, parseTypoToken, components);
    applyInputValueTypography(tokensCore, parseTypoToken, components);

    const buttonPart = buildMuiButtonVariants(tokensCore, parseTypoToken);
    if (buttonPart) {
        components.MuiButton = buttonPart;
    }

    const togglePart = buildMuiToggleButtonStyleOverrides(tokensCore, parseTypoToken);
    if (togglePart) {
        components.MuiToggleButton = togglePart;
    }

    return components;
}
