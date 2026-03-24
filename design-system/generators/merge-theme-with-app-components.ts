/**
 * `to-mui-theme.ts` 직후 실행: 토큰 `theme.(light|dark).json` + `appTheme/muiComponents.ts` 를 병합해
 * `src/theme/generated/mergedMuiThemeOptions.ts` 를 생성합니다.
 *
 * 순서 (기존 `src/theme/index.ts` 런타임 병합과 동일):
 * 1. extendColorSystem — brand.colors → palette
 * 2. appendMuiButtonVariants — JSON MuiButton variants + xsmall
 * 3. deepmerge — appComponents
 *
 * `npm run build:theme` 에 포함됩니다. 운영 레포에는 생성된 TS 파일만 복사 가능합니다.
 */

import fs from 'fs';
import path from 'path';
import deepmerge from '@mui/utils/deepmerge';
import type { ThemeOptions } from '@mui/material/styles';
import { applyPalettePlaceholdersToTheme } from '../../src/theme/appTheme/palettePlaceholderReplacements.ts';
import { appComponents, appMuiButtonVariantAppend } from '../../src/theme/appTheme/muiComponents.ts';

const REPO_ROOT = process.cwd();
const OUT_FILE = path.join(REPO_ROOT, 'src', 'theme', 'generated', 'mergedMuiThemeOptions.ts');

type ExtendedThemeOptions = ThemeOptions & {
    brand?: { colors?: Record<string, unknown> };
};

function hasBrandColors(brand: unknown): brand is { colors: Record<string, unknown> } {
    return (
        brand !== null &&
        typeof brand === 'object' &&
        'colors' in brand &&
        typeof (brand as { colors?: unknown }).colors === 'object' &&
        (brand as { colors?: unknown }).colors !== null
    );
}

function extendColorSystem(themeOptions: ExtendedThemeOptions): ExtendedThemeOptions {
    const { palette = {}, brand, ...rest } = themeOptions;
    if (!hasBrandColors(brand)) {
        return themeOptions;
    }
    return {
        ...rest,
        brand,
        palette: {
            ...palette,
            ...brand.colors,
        },
    };
}

function appendMuiButtonVariants(themeOptions: ThemeOptions): ThemeOptions {
    const baseBtn = themeOptions.components?.MuiButton;
    const extraVariants = appMuiButtonVariantAppend.MuiButton?.variants;
    if (!extraVariants?.length) return themeOptions;

    return {
        ...themeOptions,
        components: {
            ...themeOptions.components,
            MuiButton: {
                ...baseBtn,
                variants: [...(baseBtn?.variants ?? []), ...extraVariants],
            },
        },
    };
}

export function buildMergedThemeOptions(rawJson: ThemeOptions): ThemeOptions {
    const extended = extendColorSystem(rawJson as ExtendedThemeOptions) as ThemeOptions;
    const withButton = appendMuiButtonVariants(extended);
    const merged = deepmerge(withButton, { components: appComponents }) as ThemeOptions;
    return applyPalettePlaceholdersToTheme(merged);
}

function main() {
    const lightPath = path.join(REPO_ROOT, 'src', 'theme', 'generated', 'theme.light.json');
    const darkPath = path.join(REPO_ROOT, 'src', 'theme', 'generated', 'theme.dark.json');

    if (!fs.existsSync(lightPath) || !fs.existsSync(darkPath)) {
        console.error('merge-theme-with-app-components: theme.light.json / theme.dark.json 이 없습니다. 먼저 to-mui-theme.ts 를 실행하세요.');
        process.exit(1);
    }

    const lightRaw = JSON.parse(fs.readFileSync(lightPath, 'utf8')) as ThemeOptions;
    const darkRaw = JSON.parse(fs.readFileSync(darkPath, 'utf8')) as ThemeOptions;

    const lightMerged = buildMergedThemeOptions(lightRaw);
    const darkMerged = buildMergedThemeOptions(darkRaw);

    const banner = `/**
 * 병합 MUI 테마 옵션 — 자동 생성 (수정 금지)
 *
 * 생성: npm run build:theme
 *  - 1) design-system 토큰 → theme.light.json / theme.dark.json
 *  - 2) 본 파일 ← 토큰 산출 테마 + 컴포넌트 오버라이드(muiComponents.ts) 병합
 *
 * 편집 위치:
 *  - 색·타이포·토큰: design-system/tokens → build:theme
 *  - 컴포넌트 커스텀: src/theme/appTheme/muiComponents.ts → build:theme
 *
 * 운영/타 프로젝트: 이 파일만 복사 후 createLightTheme / createDarkTheme 사용.
 * @see https://mui.com/material-ui/customization/theming/
 */
`;

    const body = `${banner}
import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';

export const lightThemeOptions: ThemeOptions = ${JSON.stringify(lightMerged, null, 2)} as ThemeOptions;

export const darkThemeOptions: ThemeOptions = ${JSON.stringify(darkMerged, null, 2)} as ThemeOptions;

export function createLightTheme(): Theme {
  return createTheme(lightThemeOptions);
}

export function createDarkTheme(): Theme {
  return createTheme(darkThemeOptions);
}
`;

    fs.writeFileSync(OUT_FILE, body, 'utf8');
    console.log(`Written: ${path.relative(REPO_ROOT, OUT_FILE)}`);
}

main();
