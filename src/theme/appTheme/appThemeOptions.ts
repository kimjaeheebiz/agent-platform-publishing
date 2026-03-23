/**
 * 런타임 테마는 `createTheme` 단일 인자로 `generated/mergedMuiThemeOptions.ts` 를 사용합니다.
 * (`npm run build:theme` 시 토큰 JSON + 본 디렉터리의 `muiComponents.ts` 가 병합됩니다.)
 *
 * 레거시/문서용: 앱 컴포넌트 오버라이드 객체만 필요할 때 `appComponents` 를 import 하세요.
 */
import type { ThemeOptions } from '@mui/material/styles';
import { appComponents } from './muiComponents';

export const appThemeOptions: ThemeOptions = {
    components: appComponents,
};

export { appComponents } from './muiComponents';
