import type { ThemeOptions } from '@mui/material/styles';
import { CONTROL_HEIGHT_BY_SIZE as H } from './constants';

/**
 * 앱 전역 MUI `components` — 한 파일에서 문서와 동일한 형태로 관리합니다.
 *
 * - **토큰 테마** (`theme.light.json` 등): 피그마/Token Studio → `npm run build:theme` → `generated/mergedMuiThemeOptions.ts` 에 병합
 * - **컨트롤 높이 상수**: `constants.ts` 의 `CONTROL_HEIGHT_BY_SIZE` (Button variants JSON + 여기서 공통)
 *
 * **`MuiButton`**: large/medium/small은 토큰 JSON variants, **xsmall**은 `appMuiButtonVariantAppend` → `merge-theme-with-app-components.ts`가 빌드 시 병합.
 * `IconButton`·`TextField`/`Select` 입력 계열은 같은 높이 스케일을 `variants`로 맞춤.
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
     * 아이콘만 있는 버튼 — 사이즈별 정사각형 (피그마 xsmall 포함).
     * `width`/`height`는 패딩 포함 박스 크기로 통일 (border-box).
     */
    MuiIconButton: {
        styleOverrides: {
            root: {
                variants: [
                    {
                        props: { size: 'xsmall' },
                        style: {
                            boxSizing: 'border-box',
                            padding: '2px',
                            width: H.xsmall,
                            height: H.xsmall,
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            boxSizing: 'border-box',
                            padding: '5px',
                            width: H.small,
                            height: H.small,
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            boxSizing: 'border-box',
                            padding: '8px',
                            width: H.medium,
                            height: H.medium,
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            boxSizing: 'border-box',
                            padding: '11px',
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
                        props: { size: 'xsmall' },
                        style: {
                            '& .MuiInputBase-root': { minHeight: H.xsmall },
                        },
                    },
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
     * (medium = 기존 기준 유지, small/large/xsmall 만 보정)
     */
    MuiInputLabel: {
        styleOverrides: {
            root: {
                // medium·size 미지정 시 기준 (기존과 동일)
                '&.MuiInputLabel-outlined': {
                    transform: 'translate(14px, 9px) scale(1)',
                },
                '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -7px) scale(0.75)',
                },
                '&.MuiInputLabel-filled': {
                    transform: 'translate(14px, 9px) scale(1)',
                },
                '&.MuiInputLabel-filled.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -7px) scale(0.75)',
                },
                '&.MuiInputLabel-filled.Mui-focused': {
                    transform: 'translate(14px, -7px) scale(0.75)',
                },
                '&.MuiInputLabel-standard': {
                    transform: 'translate(0, 12px) scale(1)',
                },
                '&.MuiInputLabel-standard.MuiInputLabel-shrink': {
                    transform: 'translate(0, 0px) scale(0.75)',
                },
                // Select(FormControl)처럼 label에 size prop이 직접 전달되지 않는 케이스를 위해
                // sizeSmall 클래스 기준 보정도 함께 적용합니다.
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined': {
                    transform: 'translate(14px, 6px) scale(1)',
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-filled': {
                    transform: 'translate(14px, 6px) scale(1)',
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-standard': {
                    transform: 'translate(0, 9px) scale(1)',
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -7px) scale(0.75)',
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-filled.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -7px) scale(0.75)',
                },
                '&.MuiInputLabel-sizeSmall.MuiInputLabel-standard.MuiInputLabel-shrink': {
                    transform: 'translate(0, 0px) scale(0.75)',
                },
                variants: [
                    {
                        props: { size: 'xsmall' },
                        style: {
                            '&.MuiInputLabel-outlined': {
                                transform: 'translate(14px, 5px) scale(1)',
                            },
                            '&.MuiInputLabel-filled': {
                                transform: 'translate(14px, 5px) scale(1)',
                            },
                            '&.MuiInputLabel-standard': {
                                transform: 'translate(0, 10px) scale(1)',
                            },
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            '&.MuiInputLabel-outlined': {
                                transform: 'translate(14px, 6px) scale(1)',
                            },
                            '&.MuiInputLabel-filled': {
                                transform: 'translate(14px, 6px) scale(1)',
                            },
                            '&.MuiInputLabel-standard': {
                                transform: 'translate(0, 9px) scale(1)',
                            },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            '&.MuiInputLabel-outlined': {
                                transform: 'translate(14px, 12px) scale(1)',
                            },
                            '&.MuiInputLabel-filled': {
                                transform: 'translate(14px, 12px) scale(1)',
                            },
                            '&.MuiInputLabel-standard': {
                                transform: 'translate(0, 14px) scale(1)',
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
            root: {
                // variants 매칭 + 실제 런타임 size 클래스(.MuiInputBase-size*) 둘 다 동일 패딩
                '&.MuiInputBase-sizeXsmall': {
                    minHeight: H.xsmall,
                    '& .MuiOutlinedInput-input': {
                        padding: '2px 8px',
                        height: 'auto',
                        minHeight: 0,
                    },
                },
                '&.MuiInputBase-sizeSmall': {
                    minHeight: H.small,
                    '& .MuiOutlinedInput-input': { padding: '5px 12px', height: 'auto' },
                },
                '&.MuiInputBase-sizeMedium': {
                    minHeight: H.medium,
                    '& .MuiOutlinedInput-input': { padding: '8px 12px', height: 'auto' },
                },
                '&.MuiInputBase-sizeLarge': {
                    minHeight: H.large,
                    '& .MuiOutlinedInput-input': { padding: '10px 14px', height: 'auto' },
                },
                variants: [
                    {
                        props: { size: 'xsmall' },
                        style: {
                            minHeight: H.xsmall,
                            '& .MuiOutlinedInput-input': {
                                padding: '2px 8px',
                                height: 'auto',
                                minHeight: 0,
                            },
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiOutlinedInput-input': { padding: '5px 12px', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiOutlinedInput-input': { padding: '8px 12px', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiOutlinedInput-input': { padding: '10px 14px', height: 'auto' },
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
                        props: { size: 'xsmall' },
                        style: {
                            minHeight: H.xsmall,
                            '& .MuiInput-input': { padding: '4px 0', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiInput-input': { padding: '6px 0', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiInput-input': { padding: '8px 0', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiInput-input': { padding: '10px 0', height: 'auto' },
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
                        props: { size: 'xsmall' },
                        style: {
                            minHeight: H.xsmall,
                            '& .MuiFilledInput-input': { padding: '4px 10px', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            '& .MuiFilledInput-input': { padding: '6px 12px', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            '& .MuiFilledInput-input': { padding: '8px 12px', height: 'auto' },
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            '& .MuiFilledInput-input': { padding: '10px 14px', height: 'auto' },
                        },
                    },
                ],
            },
        },
    },

    /**
     * Select — outlined/standard/filled 입력 루트 높이는 위 Input 계열과 동일 스케일.
     * 드롭다운 아이콘 크기만 사이즈에 맞춤.
     */
    MuiSelect: {
        styleOverrides: {
            select: {
                variants: [
                    {
                        props: { size: 'xsmall' },
                        style: {
                            minHeight: H.xsmall,
                            padding: '2px 8px',
                        },
                    },
                    {
                        props: { size: 'small' },
                        style: {
                            minHeight: H.small,
                            padding: '5px 12px',
                        },
                    },
                    {
                        props: { size: 'medium' },
                        style: {
                            minHeight: H.medium,
                            padding: '8px 12px',
                        },
                    },
                    {
                        props: { size: 'large' },
                        style: {
                            minHeight: H.large,
                            padding: '10px 14px',
                        },
                    },
                ],
            },
            icon: {
                variants: [
                    { props: { size: 'xsmall' }, style: { fontSize: '1.125rem', right: 6, top: 'calc(50% - 0.5625rem)' } },
                    { props: { size: 'small' }, style: { fontSize: '1.25rem' } },
                    { props: { size: 'medium' }, style: { fontSize: '1.5rem' } },
                    { props: { size: 'large' }, style: { fontSize: '1.75rem' } },
                ],
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
                lineHeight: '20px',
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
     * TableCell 기본 border 보정색 대신 `palette.divider`를 직접 사용.
     */
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderBottom: '1px solid __PALETTE_DIVIDER__',
            },
            head: {
                backgroundColor: '__PALETTE_ACTION_HOVER__',
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
                    padding: '2px 6px',
                    minWidth: 0,
                    minHeight: H.xsmall,
                },
            },
        ],
    },
};
