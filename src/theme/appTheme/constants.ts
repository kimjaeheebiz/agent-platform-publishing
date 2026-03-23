/**
 * 폼·버튼 컨트롤 **세로 높이** 기준 (피그마 xsmall 포함, MUI 기본 size와 대응).
 *
 * - `npm run build:theme` → `MuiButton` large/medium/small variants (`mui-components-from-tokens.ts`)
 * - 런타임 → `muiComponents.ts` + `theme/index.ts`에서 xsmall variant 병합, 기타 컴포넌트 오버라이드
 *
 * @see https://mui.com/material-ui/customization/theme-components/#variants
 */
export const CONTROL_HEIGHT_BY_SIZE = {
    xsmall: '24px',
    small: '30px',
    medium: '36px',
    large: '42px',
} as const;

export type ControlHeightSize = keyof typeof CONTROL_HEIGHT_BY_SIZE;

/** @deprecated `CONTROL_HEIGHT_BY_SIZE` 사용 권장 (동일 값) */
export const buttonMinHeightBySize = CONTROL_HEIGHT_BY_SIZE;

export type ButtonLayoutSize = keyof typeof CONTROL_HEIGHT_BY_SIZE;
