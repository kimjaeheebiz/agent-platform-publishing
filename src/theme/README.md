# 테마 구조

## 빌드 (`npm run build:theme`)

1. **`to-mui-theme.ts`** — 피그마/Token Studio 산출물 → `generated/theme.light.json`, `theme.dark.json`
2. **`merge-theme-with-app-components.ts`** — 위 JSON + `appTheme/muiComponents.ts` 병합 → **`generated/mergedMuiThemeOptions.ts`**

**`mergedMuiThemeOptions.ts`** 이름 의미: **디자인 토큰으로 생성된 테마**와 **컴포넌트용 테마 옵션**을 합친 **최종 MUI `ThemeOptions`** (프로젝트명과 무관).

피그마 토큰만 바꿔도 1번 산출물이 갱신되고, 컴포넌트 커스텀은 `muiComponents.ts`만 수정한 뒤 같은 빌드로 통합 파일에 반영됩니다.

## 런타임

- `index.ts` → `createTheme` **단일 인자**로 `mergedMuiThemeOptions.ts` 사용 (`createLightTheme` / `createDarkTheme`).

## 소스 분리

| 구분 | 위치 |
|------|------|
| 디자인 토큰 | `design-system/tokens/` → 빌드 후 JSON |
| MUI 컴포넌트 오버라이드 | `appTheme/muiComponents.ts` |
| 높이 등 공통 상수 | `appTheme/constants.ts` |

## 운영 / 타 레포

`generated/mergedMuiThemeOptions.ts` 만 복사해 `@mui/material` 과 함께 사용하면 됩니다.
