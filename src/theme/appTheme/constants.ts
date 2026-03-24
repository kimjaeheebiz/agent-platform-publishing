/**
 * 폼·버튼 컨트롤 **세로 높이** 기준 (피그마 xsmall 포함, MUI 기본 size와 대응).
 *
 * - `npm run build:theme` → `MuiButton` large/medium/small variants (`mui-components-from-tokens.ts`)
 * - 런타임 → `muiComponents.ts` 등: **xsmall**은 `MuiButton`/`MuiIconButton`만 (TextField·Select는 small/medium/large)
 *
 * @see https://mui.com/material-ui/customization/theme-components/#variants
 */
export const CONTROL_HEIGHT_BY_SIZE = {
    xsmall: '24px',
    small: '30px',
    medium: '36px',
    large: '42px',
} as const;

/** 버튼 공통 기본 스타일 — 기본/hover/active/focus 그림자 제거 */
export const BUTTON_BASE_STYLE = {
    boxShadow: 'none',
    '&:hover': { boxShadow: 'none' },
    '&:active': { boxShadow: 'none' },
    '&.Mui-focusVisible': { boxShadow: 'none' },
} as const;

/**
 * 입력 계열 `paddingBlock`만 (좌우는 MUI 기본). `medium`·`large`는 공통.
 * `outlinedSmall` → OutlinedInput · Select · MuiInput · MuiFilledInput 등 small 입력 공통.
 */
export const INPUT_PADDING_BLOCK = {
    outlinedSmall: '5px',
    medium: '7px',
    large: '10px',
} as const;

/**
 * `MuiInputLabel` `transform` — outlined/filled/standard × medium·small·large·shrink 조합.
 * `muiComponents.ts` `MuiInputLabel` 전용.
 *
 * MUI 기본: 레스트 `font-size: 1rem`(16px), shrink 시 `translate(14px, -9px) scale(0.75)` → 시각적 12px.
 * 이 프로젝트: shrink 스케일 보정은 사용하지 않고, shrink도 `scale(1)`로 고정합니다.
 * @see https://mui.com/material-ui/api/input-label/
 */
export const INPUT_LABEL_TRANSFORM = {
    /** outlined / filled, size medium(기본)·미지정 */
    outlinedFilledRest: 'translate(14px, 7px) scale(1)',
    /** outlined / filled, shrink·focused */
    outlinedFilledShrink: 'translate(14px, -6px) scale(1)',
    /** standard, medium·기본 */
    standardRest: 'translate(0, 10px) scale(1)',
    /** standard, shrink (small shrink 동일) */
    standardShrink: 'translate(0, 0px) scale(1)',
    /** outlined / filled, size small */
    outlinedFilledSmall: 'translate(14px, 5px) scale(1)',
    /** standard, size small */
    standardSmall: 'translate(0, 9px) scale(1)',
    /** outlined / filled, size large */
    outlinedFilledLarge: 'translate(14px, 10px) scale(1)',
    /** standard, size large */
    standardLarge: 'translate(0, 14px) scale(1)',
} as const;

export type ControlHeightSize = keyof typeof CONTROL_HEIGHT_BY_SIZE;

/** @deprecated `CONTROL_HEIGHT_BY_SIZE` 사용 권장 (동일 값) */
export const buttonMinHeightBySize = CONTROL_HEIGHT_BY_SIZE;

export type ButtonLayoutSize = keyof typeof CONTROL_HEIGHT_BY_SIZE;
