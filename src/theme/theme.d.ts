// MUI Theme 확장 타입 정의
// https://mui.com/material-ui/customization/theming/#custom-variables

import '@mui/material/styles';
import { BrandTokens, BrandColorGroup } from '../../design-system/generators/types';

// 커스텀 size `xsmall` — 피그마/디자인 시스템 (MUI 기본 문서에는 없음)
declare module '@mui/material/Button' {
    interface ButtonPropsSizeOverrides {
        xsmall: true;
    }
}

declare module '@mui/material/IconButton' {
    interface IconButtonPropsSizeOverrides {
        xsmall: true;
    }
}

/** TextField / Select / OutlinedInput 등 입력 계열 size 는 InputBase 로 통합됨 (xsmall 미사용) */
declare module '@mui/material/InputBase' {
    interface InputBasePropsSizeOverrides {
        large: true;
    }
}

declare module '@mui/material/TextField' {
    interface TextFieldPropsSizeOverrides {
        large: true;
    }
}

declare module '@mui/material/Select' {
    interface SelectPropsSizeOverrides {
        large: true;
    }
}

declare module '@mui/material/InputLabel' {
    interface InputLabelPropsSizeOverrides {
        large: true;
    }
}

declare module '@mui/material/styles' {
    // Theme에 brand 속성 추가
    interface Theme {
        brand: Required<BrandTokens>;
    }

    // ThemeOptions에 brand 속성 추가
    interface ThemeOptions {
        brand?: BrandTokens;
    }

    // Palette에 동적 브랜드 색상 그룹 추가 (sx prop에서 사용 가능)
    interface Palette {
        [colorGroupName: string]: BrandColorGroup | unknown;
    }

    interface PaletteOptions {
        [colorGroupName: string]: Partial<BrandColorGroup> | unknown;
    }
}
