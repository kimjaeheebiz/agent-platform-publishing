/**
 * MUI Palette 타입 정의
 * 토큰 소스(palette/Light.json 등)의 구조 타입
 * 
 * 역할: Figma/Tokens Studio에서 내보낸 palette JSON이 어떤 키 구조로 오는지 정의
 *
 * 흐름:
 * 1. MUI: createTheme()에 넘긴 palette 키만 덮어쓰고, 나머지는 기본값 유지
 * 2. 토큰: design-system/tokens/generated/palette/Light.json 에서 primary, info, text 등 정의
 * 3. to-mui-theme: 이 타입으로 토큰을 읽어 → MUI가 기대하는 형태로 변환 → theme.*.json 생성
 * 4. 앱: createTheme(theme.light.json) → 토큰으로 덮어쓴 palette만 반영, 나머지는 MUI 기본
 *
 * @see https://mui.com/material-ui/customization/palette/
 */

import { ColorToken } from './tokens';

/**
 * MUI 색상 그룹 (primary, secondary, error 등)
 */
export interface PaletteColorGroup {
    light?: ColorToken;
    main?: ColorToken;
    dark?: ColorToken;
    contrastText?: ColorToken;
    _states?: PaletteStatesGroup;
}

/**
 * 시맨틱 상태 색상 (hover, selected 등)
 */
export interface PaletteStatesGroup {
    hover?: ColorToken;
    selected?: ColorToken;
    focus?: ColorToken;
    focusVisible?: ColorToken;
    outlinedBorder?: ColorToken;
}

/**
 * 텍스트 색상 그룹
 */
export interface TextColorGroup {
    primary?: ColorToken;
    secondary?: ColorToken;
    disabled?: ColorToken;
}

/**
 * 배경 색상 그룹
 */
export interface BackgroundColorGroup {
    default?: ColorToken;
    'paper-elevation-0'?: ColorToken;
}

/**
 * 액션 색상 그룹 (hover, active, selected 등)
 */
export interface ActionColorGroup {
    active?: ColorToken;
    hover?: ColorToken;
    selected?: ColorToken;
    disabled?: ColorToken;
    disabledBackground?: ColorToken;
    focus?: ColorToken;
}

/**
 * 공통 색상 그룹 (white, black)
 */
export interface CommonColorGroup {
    white_states?: { main?: ColorToken };
    black_states?: { main?: ColorToken };
}
