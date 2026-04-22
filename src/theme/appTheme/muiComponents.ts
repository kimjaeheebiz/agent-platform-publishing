import type { ThemeOptions } from '@mui/material/styles';
import {
    BUTTON_BASE_STYLE as BBS,
    CONTROL_HEIGHT_BY_SIZE as H,
    INPUT_LABEL_TRANSFORM as ILT,
    INPUT_PADDING_BLOCK as PB,
} from './constants';

/**
 * 앱 전역 MUI `components` — 한 파일에서 문서와 동일한 형태로 관리합니다.
 *
 * - **토큰 테마** (`theme.light.json` 등): 피그마/Token Studio → `npm run build:theme` → `generated/mergedMuiThemeOptions.ts` 에 병합
 * - **팔레트 의존 색**: 정적 객체 한계로 `__CHIP_*` / `__PALETTE_*` 문자열 사용 → 치환 규칙은 `palettePlaceholderReplacements.ts`
 * - **컨트롤 높이·입력 세로 패딩·라벨 transform·body2**: `constants.ts` 의 `CONTROL_HEIGHT_BY_SIZE`, `INPUT_PADDING_BLOCK`, `INPUT_LABEL_TRANSFORM`, `TYPOGRAPHY_BODY2`
 *
 * **`MuiButton`**: large/medium/small은 토큰 JSON variants, **xsmall**은 `appMuiButtonVariantAppend` → `merge-theme-with-app-components.ts`가 빌드 시 병합.
 * **`MuiIconButton`**: **xsmall** 박스는 `Button`과 동일하게 `CONTROL_HEIGHT_BY_SIZE`(24px). 아이콘 크기는 자식 `SvgIcon`의 `fontSize`로 둡니다. 입력 계열은 small/medium/large만.
 *
 * - **IconButton**: MUI는 `size` + `root` 슬롯 스타일로 크기를 잡음
 *   ([API](https://mui.com/material-ui/api/icon-button/) · [theme-components](https://mui.com/material-ui/customization/theme-components/)).
 *   아이콘 전용 정사각형은 `width`/`height` + `boxSizing: 'border-box'`로 고정하는 편이 행 정렬에 유리함.
 * - **OutlinedInput / Input / FilledInput / Select**: `minHeight`는 `CONTROL_HEIGHT_BY_SIZE`와 맞춤.
 *   입력 루트 수직 정렬은 MUI `InputBase`(inline-flex + alignItems) 기본에 맡김.
 *
 * @see https://mui.com/material-ui/customization/theme-components/
 */
export const appComponents: NonNullable<ThemeOptions['components']> = {
    /**
     * Chip — outlined는 유지, filled(=contained)만 컬러 테마 규칙 적용.
     * - background: {color}._states.selected
     * - text/icon: {color}.main
     */
    MuiChip: {
        styleOverrides: {
            root: {
                '&.MuiChip-filled.MuiChip-colorPrimary': {
                    backgroundColor: '__CHIP_PRIMARY_BG__',
                    color: '__CHIP_PRIMARY_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_PRIMARY_FG__' },
                },
                '&.MuiChip-filled.MuiChip-colorSecondary': {
                    backgroundColor: '__CHIP_SECONDARY_BG__',
                    color: '__CHIP_SECONDARY_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_SECONDARY_FG__' },
                },
                '&.MuiChip-filled.MuiChip-colorError': {
                    backgroundColor: '__CHIP_ERROR_BG__',
                    color: '__CHIP_ERROR_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_ERROR_FG__' },
                },
                '&.MuiChip-filled.MuiChip-colorWarning': {
                    backgroundColor: '__CHIP_WARNING_BG__',
                    color: '__CHIP_WARNING_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_WARNING_FG__' },
                },
                '&.MuiChip-filled.MuiChip-colorInfo': {
                    backgroundColor: '__CHIP_INFO_BG__',
                    color: '__CHIP_INFO_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_INFO_FG__' },
                },
                '&.MuiChip-filled.MuiChip-colorSuccess': {
                    backgroundColor: '__CHIP_SUCCESS_BG__',
                    color: '__CHIP_SUCCESS_FG__',
                    '& .MuiChip-icon, & .MuiChip-deleteIcon': { color: '__CHIP_SUCCESS_FG__' },
                },
            },
        },
    },

    /**
     * 아이콘만 있는 버튼 — 사이즈별 정사각형 (`Button`과 동일 높이 스케일).
     * `width`/`height`는 패딩 포함 박스 크기로 통일 (border-box). 아이콘은 자식 `fontSize`로 조절.
     */
    MuiIconButton: {
        styleOverrides: {
            root: {
                variants: [
                    {
                        props: { size: 'xsmall' },
                        style: {
                            width: H.xsmall,
                            height: H.xsmall,
                            fontSize: '1rem',
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            width: H.small,
                            height: H.small,
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            width: H.medium,
                            height: H.medium,
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            width: H.large,
                            height: H.large,
                        },
                    },
                ],
            },
        },
    },

    /**
     * TextField(FormControl) 자체 레이아웃 보정.
     * helperText 유무로 인해 행 정렬이 흔들리지 않도록 spacing을 고정합니다.
     */
    MuiTextField: {
        styleOverrides: {
            root: {
                verticalAlign: 'top',
                '& .MuiFormHelperText-root': {
                    marginTop: '2px',
                    marginLeft: 0,
                    marginRight: 0,
                    lineHeight: 1.2,
                },
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            '& .MuiInputBase-root': { minHeight: H.small },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            '& .MuiInputBase-root': { minHeight: H.medium },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            '& .MuiInputBase-root': { minHeight: H.large },
                        },
                    },
                ],
            },
        },
    },

    /**
     * InputLabel — `FormControl` size·`CONTROL_HEIGHT_BY_SIZE`에 맞춰 수직 위치 조정.
     * 타이포: 레스트/shrink 모두 12px(`input.label`) 기준, transform만 위치 보정.
     */
    MuiInputLabel: {
        styleOverrides: {
            root: {
                // medium·size 미지정 시 기준 (기존과 동일)
                '&.MuiInputLabel-outlined, &.MuiInputLabel-filled': {
                    transform: ILT.outlinedFilledRest,
                },
                '&.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-filled.MuiInputLabel-shrink, &.MuiInputLabel-filled.Mui-focused':
                    {
                        transform: ILT.outlinedFilledShrink,
                    },
                '&.MuiInputLabel-standard': {
                    transform: ILT.standardRest,
                },
                '&.MuiInputLabel-standard.MuiInputLabel-shrink': {
                    transform: ILT.standardShrink,
                },
                // Select(FormControl)처럼 label에 size prop이 직접 전달되지 않는 케이스를 위해
                // sizeSmall 클래스 기준 보정도 함께 적용합니다.
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled': {
                    transform: ILT.outlinedFilledSmall,
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-standard': {
                    transform: ILT.standardSmall,
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink, &.MuiInputLabel-sizeSmall.MuiInputLabel-filled.MuiInputLabel-shrink':
                    {
                        transform: ILT.outlinedFilledShrink,
                    },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-standard.MuiInputLabel-shrink': {
                    transform: ILT.standardShrink,
                },
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            '&.MuiInputLabel-outlined, &.MuiInputLabel-filled': {
                                transform: ILT.outlinedFilledSmall,
                            },
                            '&.MuiInputLabel-standard': {
                                transform: ILT.standardSmall,
                            },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            '&.MuiInputLabel-outlined, &.MuiInputLabel-filled': {
                                transform: ILT.outlinedFilledLarge,
                            },
                            '&.MuiInputLabel-standard': {
                                transform: ILT.standardLarge,
                            },
                        },
                    },
                ],
            },
        },
    },

    /** TextField outlined — `variant="outlined"` (루트는 minHeight: 멀티라인 대응) */
    MuiOutlinedInput: {
        styleOverrides: {
            // notched outline legend도 label과 동일하게 12px 고정
            notchedOutline: {
                '& legend': {
                    fontSize: '12px',
                },
            },
            root: {
                // 세로만 지정 — 좌우는 MUI 기본(아이콘·adornment 유무에 따라 비대칭 패딩 유지)
                '&.MuiInputBase-sizeSmall': {
                    minHeight: H.small,
                    '& .MuiOutlinedInput-input': {
                        paddingBlock: PB.outlinedSmall,
                        height: 'auto',
                    },
                },
                '&.MuiInputBase-sizeMedium': {
                    minHeight: H.medium,
                    '& .MuiOutlinedInput-input': {
                        paddingBlock: PB.medium,
                        height: 'auto',
                    },
                },
                '&.MuiInputBase-sizeLarge': {
                    minHeight: H.large,
                    '& .MuiOutlinedInput-input': {
                        paddingBlock: PB.large,
                        height: 'auto',
                    },
                },
                '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                    borderColor: '__PALETTE_DIVIDER__',
                    backgroundColor: '__PALETTE_BACKGROUND_DISABLED__',
                    
                },
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiOutlinedInput-input': {
                                paddingBlock: PB.outlinedSmall,
                                height: 'auto',
                            },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiOutlinedInput-input': {
                                paddingBlock: PB.medium,
                                height: 'auto',
                            },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiOutlinedInput-input': {
                                paddingBlock: PB.large,
                                height: 'auto',
                            },
                        },
                    },
                ],
            },
        },
    },

    /** TextField standard — `variant="standard"` */
    MuiInput: {
        styleOverrides: {
            root: {
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiInput-input': {
                                paddingBlock: PB.outlinedSmall,
                                height: 'auto',
                            },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiInput-input': {
                                paddingBlock: PB.medium,
                                height: 'auto',
                            },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiInput-input': {
                                paddingBlock: PB.large,
                                height: 'auto',
                            },
                        },
                    },
                ],
            },
        },
    },

    /** TextField filled — `variant="filled"` */
    MuiFilledInput: {
        styleOverrides: {
            root: {
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiFilledInput-input': {
                                paddingBlock: PB.outlinedSmall,
                                height: 'auto',
                            },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiFilledInput-input': { paddingBlock: PB.medium, height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiFilledInput-input': { paddingBlock: PB.large, height: 'auto' },
                        },
                    },
                ],
            },
        },
    },

    /**
     * Select — outlined/standard/filled 입력 루트 높이는 위 Input 계열과 동일 스케일.
     * `select` 슬롯은 `paddingBlock`만 지정해 좌우는 MUI 기본을 유지합니다.
     */
    MuiSelect: {
        styleOverrides: {
            select: {
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            paddingBlock: PB.outlinedSmall,
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            paddingBlock: PB.medium,
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            paddingBlock: PB.large,
                        },
                    },
                ],
            },
            icon: {
                variants: [
                    {
                        props: { size: 'small' },
                        style: {
                            fontSize: '1.25rem',
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            fontSize: '1.5rem',
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            fontSize: '1.75rem',
                        },
                    },
                ],
            },
        },
    },

    MuiButton: {
        styleOverrides: {
            root: {
                ...BBS,
            },
        },
    },

    /** 그룹 내 버튼은 각각 `MuiButton` variants 높이를 쓰므로, 줄 맞춤만 보조 */
    MuiButtonGroup: {
        styleOverrides: {
            root: {
                alignItems: 'stretch',
            },
        },
    },

    /**
     * ToggleButton / ToggleButtonGroup — 버튼 공통 높이 스케일과 정렬.
     * `small`은 `MuiButton size="small"`과 동일한 30px 기준을 사용합니다.
     */
    MuiToggleButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                whiteSpace: 'nowrap',
                // lineHeight·fontSize는 `core.button.*` → `mui-components-from-tokens` 가 sizeSmall/Medium/Large에 주입
            },
            sizeSmall: {
                minHeight: H.small,
                height: H.small,
                padding: '4px 12px',
            },
            sizeMedium: {
                minHeight: H.medium,
                height: H.medium,
                padding: '6px 12px',
            },
            sizeLarge: {
                minHeight: H.large,
                height: H.large,
                padding: '8px 14px',
            },
        },
    },

    MuiToggleButtonGroup: {
        styleOverrides: {
            root: {
                alignItems: 'stretch',
                '& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeSmall': {
                    minHeight: H.small,
                    height: H.small,
                },
                '& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeMedium': {
                    minHeight: H.medium,
                    height: H.medium,
                },
                '& .MuiToggleButtonGroup-grouped.MuiToggleButton-sizeLarge': {
                    minHeight: H.large,
                    height: H.large,
                },
            },
            grouped: {
                minHeight: 'inherit',
            },
        },
    },

    /**
     * TableCell — `action.hover` 는 빌드 시 `palettePlaceholderReplacements.ts`가 치환.
     */
    MuiTableCell: {
        styleOverrides: {
            head: {
                backgroundColor: '__PALETTE_ACTION_HOVER__',
            },
        },
    },

    
    /**
     * Dialog
     */
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontSize: '18px',
            },
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: '24px',
            },
      },
    },
    MuiDialogActions: {
        styleOverrides: {
            root: {
                padding: '12px 24px',
            },
        },
    },
};

/**
 * `MuiButton` xsmall — 토큰 `core.button`에 없는 사이즈. 빌드 시 `merge-theme-with-app-components.ts`가 JSON variants 뒤에 이어붙입니다.
 * `createTheme` deepmerge는 배열을 통째로 바꿔서, JSON과 분리해 두었습니다.
 */
export const appMuiButtonVariantAppend: Pick<NonNullable<ThemeOptions['components']>, 'MuiButton'> = {
    MuiButton: {
        variants: [
            {
                props: { size: 'xsmall' },
                style: {
                    fontSize: '0.75rem',
                    lineHeight: '20px',
                    padding: '1px 6px',
                    minWidth: 0,
                    minHeight: H.xsmall,
                },
            },
        ],
    },
};
