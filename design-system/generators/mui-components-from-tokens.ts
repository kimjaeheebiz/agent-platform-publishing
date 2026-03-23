/**
 * Figma / core.json 토큰 → MUI theme.components 자동 생성
 *
 * **자동화 원칙**
 * - `to-mui-theme.ts`에 컴포넌트마다 if 블록을 늘리지 않습니다.
 * - 타이포 슬롯 매핑: 아래 `MUI_TYPO_SLOT_MAPPINGS`에 **한 줄**만 추가하면 됩니다.
 * - 버튼 사이즈 variants: `BUTTON_SIZE_TYPO_SEQUENCE` (large/medium/small). xsmall은 `appTheme/muiComponents.ts`의 `appMuiButtonVariantAppend`.
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
    { muiComponent: 'MuiTextField', styleOverrideSlot: 'label', tokenPath: ['input', 'label'] },
    { muiComponent: 'MuiTextField', styleOverrideSlot: 'input', tokenPath: ['input', 'value'] },
    { muiComponent: 'MuiTextField', styleOverrideSlot: 'helperText', tokenPath: ['input', 'helper'] },
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

    const buttonPart = buildMuiButtonVariants(tokensCore, parseTypoToken);
    if (buttonPart) {
        components.MuiButton = buttonPart;
    }

    return components;
}
