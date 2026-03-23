import {
    createLightTheme,
    createDarkTheme,
    lightThemeOptions,
    darkThemeOptions,
} from './generated/mergedMuiThemeOptions';

/**
 * 피그마/토큰 → `build:theme` → `generated/mergedMuiThemeOptions.ts` (토큰 테마 + 컴포넌트 테마 병합)
 * @see https://mui.com/material-ui/customization/theming/
 */
export const lightTheme = createLightTheme();
export const darkTheme = createDarkTheme();

export { createLightTheme, createDarkTheme, lightThemeOptions, darkThemeOptions };

/**
 * 테마 모드에 따라 테마 반환
 */
export const getThemeByMode = (mode: 'light' | 'dark') => (mode === 'light' ? lightTheme : darkTheme);
