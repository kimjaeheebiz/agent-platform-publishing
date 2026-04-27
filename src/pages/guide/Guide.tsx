/**
 * MUI Material UI 공식 문서
 *
 * Palette:        https://mui.com/material-ui/customization/palette/
 * Typography:     https://mui.com/material-ui/react-typography/
 * Button:         https://mui.com/material-ui/react-button/
 * Toggle Button:  https://mui.com/material-ui/react-toggle-button/
 * Chip:           https://mui.com/material-ui/react-chip/
 * Avatar:         https://mui.com/material-ui/react-avatar/
 * Form:
 *   Text Field:   https://mui.com/material-ui/react-text-field/
 *   Select:       https://mui.com/material-ui/react-select/
 *   Form control: https://mui.com/material-ui/react-form-control/
 *   Checkbox:     https://mui.com/material-ui/react-checkbox/
 *   Switch:       https://mui.com/material-ui/react-switch/
 *   Radio Group:  https://mui.com/material-ui/react-radio-button/
 * Card:           https://mui.com/material-ui/react-card/
 * Table:          https://mui.com/material-ui/react-table/
 * List:           https://mui.com/material-ui/react-list/
 * Alert:          https://mui.com/material-ui/react-alert/
 * Dialog:         https://mui.com/material-ui/react-dialog/
 * Menu:           https://mui.com/material-ui/react-menu/
 * Snackbar:       https://mui.com/material-ui/react-snackbar/
 */
import React from 'react';
import { deepPurple, grey, blue, indigo, green, red } from '@mui/material/colors';
import {
    Box,
    Stack,
    Grid,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Switch,
    Radio,
    RadioGroup,
    FormControl,
    InputLabel,
    FormLabel,
    Select,
    MenuItem,
    Chip,
    Avatar,
    Card,
    CardContent,
    CardActions,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Alert,
    AlertTitle,
    Snackbar,
    ToggleButton,
    ToggleButtonGroup,
    Tabs,
    Tab,
    GlobalStyles,
    InputAdornment,
    Menu,
    MenuItem as MenuItemComponent,
    ListItemIcon as ListItemIconComponent,
    ListItemText as ListItemTextComponent,
    useTheme,
} from '@mui/material';
import { Add, Search, Star, Settings, Person, Delete, Edit, Share, Home, Work, School } from '@mui/icons-material';
import { StatusChip, ServerChip, FavoriteButton, FilterToggleGroup, Brand } from '@/components';

export const Guide = () => {
    const theme = useTheme();

    // brand 하위에서 색상 그룹명 추출 (새로운 colors 구조)
    const brandColorGroupNames = theme.brand?.colors ? Object.keys(theme.brand.colors) : [];

    // 동적 색상 그룹명 처리 - 완전 동적 처리
    const colorGroups = brandColorGroupNames; // 모든 색상 그룹
    const firstColorGroup = colorGroups[0] || ''; // 첫 번째 그룹 (패턴 테스트용)
    const secondColorGroup = colorGroups[1] || ''; // 두 번째 그룹 (패턴 테스트용)

    // 각 그룹의 색상 이름들을 동적으로 추출
    const getColorNamesForGroup = (groupName: string) => {
        return theme.brand?.colors?.[groupName] ? Object.keys(theme.brand.colors[groupName]) : [];
    };

    // 각 색상의 shade 값들을 동적으로 추출
    const getShadesForColor = (groupName: string, colorName: string) => {
        return theme.brand?.colors?.[groupName]?.[colorName]
            ? Object.keys(theme.brand.colors[groupName][colorName])
            : [];
    };

    const getSafeContrastTextColor = (backgroundColor?: string) => {
        if (!backgroundColor) {
            return theme.palette.text.primary;
        }

        try {
            return theme.palette.getContrastText(backgroundColor);
        } catch {
            return theme.palette.text.primary;
        }
    };

    const themeColorNames = ['primary', 'secondary', 'info', 'success', 'error', 'warning'] as const;
    const themeColorTones = ['light', 'main', 'dark'] as const;
    const themeColorStateKeys = ['hover', 'selected', 'focusVisible', 'outlinedBorder', 'focus'] as const;

    const [checked, setChecked] = React.useState(false);
    const [switchChecked, setSwitchChecked] = React.useState(false);
    const [radioValue, setRadioValue] = React.useState('option1');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);
    const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [toggleValueSmall, setToggleValueSmall] = React.useState('left');
    const [toggleValueMedium, setToggleValueMedium] = React.useState('left');
    const [toggleValueLarge, setToggleValueLarge] = React.useState('left');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const [customFavorite, setCustomFavorite] = React.useState(false);
    const [filterToggleValue, setFilterToggleValue] = React.useState('all');

    // 코드 힌트 공통 스타일
    const codeHintSx = {
        px: 0.6,
        bgcolor: 'action.selected',
        border: '1px solid',
        borderColor: 'action.focus',
        borderRadius: 1,
        color: 'info.dark',
    };

    // 섹션 이동 효과
    const scrollTo = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // 섹션 링크
    const sectionLinks = [
        { id: 'sectionPalette', label: 'Palette' },
        { id: 'sectionTypography', label: 'Typography' },
        { id: 'sectionButton', label: 'Button' },
        { id: 'sectionToggleButton', label: 'Toggle Button' },
        { id: 'sectionChipAvatar', label: 'Chip & Avatar' },
        { id: 'sectionForm', label: 'Form' },
        { id: 'sectionCard', label: 'Card' },
        { id: 'sectionTable', label: 'Table' },
        { id: 'sectionList', label: 'List' },
        { id: 'sectionAlert', label: 'Alert' },
        { id: 'sectionDialogMenu', label: 'Dialog & Menu' },
        { id: 'sectionSnackbar', label: 'Snackbar' },
        { id: 'sectionCustom', label: 'Custom' },
    ];

    const [activeSection, setActiveSection] = React.useState<string>('sectionPalette');

    const toggleSizeState: Record<
        'small' | 'medium' | 'large',
        [string, React.Dispatch<React.SetStateAction<string>>]
    > = {
        small: [toggleValueSmall, setToggleValueSmall],
        medium: [toggleValueMedium, setToggleValueMedium],
        large: [toggleValueLarge, setToggleValueLarge],
    };

    const sizeToLabel: Record<'small' | 'medium' | 'large', string> = {
        small: 'Small',
        medium: 'Default(Medium)',
        large: 'Large',
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
            <GlobalStyles styles={{ '.section': { scrollMarginTop: 70 } }} />
            {/* 섹션 이동 메뉴 */}
            <Tabs
                value={activeSection}
                onChange={(e, v) => {
                    setActiveSection(v);
                    scrollTo(v);
                }}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="섹션 이동 메뉴"
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {sectionLinks.map((section) => (
                    <Tab key={section.id} value={section.id} label={section.label} />
                ))}
            </Tabs>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Palette */}
                <Box component="section" className="section" id="sectionPalette">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Palette
                    </Typography>

                    <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h5">
                            Theme Color (Mode/Theme 자동 반영)
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`{colorName}.{tone} / {colorName}._states.{state}`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={2} sx={{ mb: 5 }}>
                        {themeColorNames.map((colorName) => (
                            <Grid key={colorName} size={{ xs: 12, xl: 6 }}>
                                <Typography variant="caption" sx={{ mb: 0.5 }}>
                                    {colorName}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap">
                                    {themeColorTones.map((tone) => {
                                        const toneColor = theme.palette[colorName][tone];

                                        return (
                                            <Box
                                                key={`${colorName}-${tone}`}
                                                sx={{
                                                    width: 40,
                                                    height: 30,
                                                    bgcolor: toneColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: getSafeContrastTextColor(toneColor),
                                                    typography: 'caption',
                                                }}
                                            >
                                                {tone}
                                            </Box>
                                        );
                                    })}
                                    {themeColorStateKeys
                                        .map((stateKey) => {
                                            const stateColor = (
                                                theme.palette[colorName] as typeof theme.palette.primary & {
                                                    _states?: Partial<Record<(typeof themeColorStateKeys)[number], string>>;
                                                }
                                            )._states?.[stateKey];

                                            if (!stateColor) {
                                                return null;
                                            }

                                            return (
                                                <Box
                                                    key={`${colorName}-${stateKey}`}
                                                    sx={{
                                                        width: 90,
                                                        height: 30,
                                                        bgcolor: stateColor,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'text.primary',
                                                        typography: 'caption',
                                                    }}
                                                >
                                                    {stateKey}
                                                </Box>
                                            );
                                        })
                                        .filter(Boolean)}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    {/* 모든 색상 그룹들을 동적으로 렌더링 */}
                    {colorGroups.map((groupName) => (
                        <React.Fragment key={groupName}>
                            <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                                <Typography component="h3" variant="h5">
                                    Brand Colors ({groupName})
                                </Typography>
                                <Typography component="code" variant="caption" sx={codeHintSx}>
                                    {`${groupName}.{colorName}.{shade}`}
                                </Typography>
                            </Stack>
                            <Grid container spacing={1} sx={{ mb: 5 }}>
                                {getColorNamesForGroup(groupName).map((colorName) => (
                                    <Grid
                                        key={colorName}
                                        size={{ xs: 12, xl: 6 }}>
                                        <Typography variant="caption">{colorName}</Typography>
                                        <Stack direction="row" flexWrap="wrap">
                                            {getShadesForColor(groupName, colorName).map((shade) => {
                                                const bgColorValue = theme.brand?.colors?.[groupName]?.[colorName]?.[shade];

                                                return (
                                                    <Box
                                                        key={`${colorName}-${shade}`}
                                                        sx={{
                                                            width: 40,
                                                            height: 30,
                                                            bgcolor: `${groupName}.${colorName}.${shade}`,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: getSafeContrastTextColor(bgColorValue),
                                                            typography: 'caption',
                                                        }}
                                                    >
                                                        {shade}
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </React.Fragment>
                    ))}

                    <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mb: 1 }}>
                        <Typography component="h3" variant="h5">
                            Material Color
                        </Typography>
                        <Typography component="code" variant="caption" sx={codeHintSx}>
                            {`{colorName}[{shade}]`}
                        </Typography>
                    </Stack>
                    <Grid container spacing={1} sx={{ mb: 3 }}>
                        {(
                            [
                                ['deeppurple', deepPurple],
                                ['blue', blue],
                                ['indigo', indigo],
                                ['green', green],
                                ['red', red],
                                ['grey', grey],
                            ] as const
                        ).map(([colorName, colorPalette]) => (
                            <Grid
                                key={colorName}
                                size={{
                                    xs: 12,
                                    xl: 6
                                }}>
                                <Typography variant="caption" sx={{ mb: 0.5 }}>
                                    {colorName}
                                </Typography>
                                <Stack direction="row" flexWrap="wrap">
                                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 'A100', 'A200', 'A400', 'A700'].map((shade) => {
                                        const bgColor = (colorPalette as Record<string, string>)[String(shade)];
                                        const textColor = getSafeContrastTextColor(bgColor);

                                        return (
                                            <Box
                                                key={`${colorName}-${shade}`}
                                                sx={{
                                                    width: 40,
                                                    height: 30,
                                                    bgcolor: bgColor,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: textColor,
                                                    typography: 'caption',
                                                }}
                                            >
                                                {shade}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Grid>
                        ))}
                    </Grid>

                    {/* 색상 패턴 테스트 */}
                    <Typography component="h3" variant="h5" sx={{ mb: 1 }}>
                        *Color Pattern Test
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
                        {/* Brand Color 풀네임 패턴 테스트 */}
                        {firstColorGroup && theme.brand.colors[firstColorGroup]?.green?.[500] && (
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: theme.brand.colors[firstColorGroup].green[500],
                                    color: 'white',
                                }}
                            >
                                <Typography variant="subtitle2">
                                    theme.brand.colors.{firstColorGroup}.green[500]
                                </Typography>
                            </Box>
                        )}
                        {secondColorGroup && theme.brand.colors[secondColorGroup]?.blue?.[500] && (
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: theme.brand.colors[secondColorGroup].blue[500],
                                    color: 'white',
                                }}
                            >
                                <Typography variant="subtitle2">
                                    theme.brand.colors.{secondColorGroup}.blue[500]
                                </Typography>
                            </Box>
                        )}

                        {/* Brand Color 패턴 테스트 */}
                        {firstColorGroup && (
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: `${firstColorGroup}.green.500`,
                                    color: 'white',
                                }}
                            >
                                <Typography variant="subtitle2">{firstColorGroup}.green.500</Typography>
                            </Box>
                        )}
                        {secondColorGroup && (
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: `${secondColorGroup}.blue.500`,
                                    color: 'white',
                                }}
                            >
                                <Typography variant="subtitle2">{secondColorGroup}.blue.500</Typography>
                            </Box>
                        )}

                        {/* Material Color 패턴 테스트 */}
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: green[500],
                                color: 'white',
                            }}
                        >
                            <Typography variant="subtitle2">green[500]</Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: deepPurple['A100'],
                                color: 'white',
                            }}
                        >
                            <Typography variant="subtitle2">deepPurple['A100']</Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: deepPurple['A200'],
                                color: 'white',
                            }}
                        >
                            <Typography variant="subtitle2">deepPurple['A200']</Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: deepPurple['A400'],
                                color: 'white',
                            }}
                        >
                            <Typography variant="subtitle2">deepPurple['A400']</Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 1,
                                bgcolor: deepPurple['A700'],
                                color: 'white',
                            }}
                        >
                            <Typography variant="subtitle2">deepPurple['A700']</Typography>
                        </Box>
                    </Stack>
                </Box>

                {/* Typography */}
                <Box component="section" className="section" id="sectionTypography">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Typography
                    </Typography>
                    <Stack direction="column">
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h1" minWidth={100}>h1</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">3.75rem(60px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h2" minWidth={100}>h2</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">2.125rem(34px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h3" minWidth={100}>h3</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">1.5rem(24px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h4" minWidth={100}>h4</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">1.25rem(20px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h5" minWidth={100}>h5</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">1rem(16px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="h6" minWidth={100}>h6</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.875rem(14px) / 600</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="subtitle1" minWidth={100}>subtitle1</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">1rem(16px) / 500</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>subtitle2</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.875rem(14px) / 500</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="body1" minWidth={100}>body1</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.875rem(14px) / 400</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="body2" minWidth={100}>body2</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.8125rem(13px) / 400</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="caption" minWidth={100}>caption</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.75rem(12px) / 400</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="overline" minWidth={100}>overline</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">0.75rem(12px) / 400 / uppercase</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <Typography variant="inherit" minWidth={100}>inherit</Typography>
                            <Typography variant="body2" component="span" color="text.secondary">부모 스타일 상속</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} paddingTop={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={92}>Color</Typography>
                            <Typography color="primary">primary</Typography>
                            <Typography color="secondary">secondary</Typography>
                            <Typography color="success">success</Typography>
                            <Typography color="error">error</Typography>
                            <Typography color="warning">warning</Typography>
                            <Typography color="info">info</Typography>
                            <Typography>default</Typography>
                            <Typography color="text.main">text.main(default)</Typography>
                            <Typography color="text.secondary">text.secondary</Typography>
                            <Typography color="text.disabled">text.disabled</Typography>
                        </Stack>
                    </Stack>
                </Box>

                {/* Button */}
                <Box component="section" className="section" id="sectionButton">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Button
                    </Typography>
                    <Stack direction="column" spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>variant</Typography>
                            <Button variant="text">Text(Default)</Button>
                            <Button variant="contained">Contained</Button>
                            <Button variant="outlined">Outlined</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>disabled</Typography>
                            <Button variant="text" disabled>Text(Default)</Button>
                            <Button variant="contained" disabled>Contained</Button>
                            <Button variant="outlined" disabled>Outlined</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>color</Typography>
                            <Button variant="contained" color="primary">
                                Primary
                            </Button>
                            <Button variant="contained" color="secondary">
                                Secondary
                            </Button>
                            <Button variant="contained" color="success">
                                Success
                            </Button>
                            <Button variant="contained" color="error">
                                Error
                            </Button>
                            <Button variant="contained" color="warning">
                                Warning
                            </Button>
                            <Button variant="contained" color="info">
                                Info
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>icon</Typography>
                            <Button variant="contained" startIcon={<Add />}>
                                Add
                            </Button>
                            <Button variant="outlined" endIcon={<Settings />}>
                                Settings
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>size(text)</Typography>
                            <Button size="xsmall">Extra Small</Button>
                            <Button size="small">Small</Button>
                            <Button>Medium(Default)</Button>
                            <Button size="large">Large</Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>size(contained)</Typography>
                            <Button variant="contained" size="xsmall">
                                Extra Small
                            </Button>
                            <Button variant="contained" size="small">
                                Small
                            </Button>
                            <Button variant="contained">Medium(Default)</Button>
                            <Button variant="contained" size="large">
                                Large
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" minWidth={100}>size(outlined)</Typography>
                            <Button variant="outlined" size="xsmall">
                                Extra Small
                            </Button>
                            <Button variant="outlined" size="small">
                                Small
                            </Button>
                            <Button variant="outlined">Medium(Default)</Button>
                            <Button variant="outlined" size="large">
                                Large
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton color="primary" size="xsmall">
                                <Add fontSize="inherit" />
                            </IconButton>
                            <IconButton color="primary" size="small">
                                <Add fontSize="small" />
                            </IconButton>
                            <IconButton color="primary">
                                <Add />
                            </IconButton>
                            <IconButton color="primary" size="large">
                                <Add fontSize="large" />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Box>

                {/* Toggle Button */}
                <Box component="section" className="section" id="sectionToggleButton">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Toggle Button
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        {(['small', 'medium', 'large'] as const).map((size) => {
                            const [value, setValue] = toggleSizeState[size];
                            return (
                                <ToggleButtonGroup
                                    key={size}
                                    size={size}
                                    value={value}
                                    exclusive
                                    onChange={(e, v) => v && setValue(v)}
                                >
                                    <ToggleButton value="left">{sizeToLabel[size]}</ToggleButton>
                                    <ToggleButton value="center">{sizeToLabel[size]}</ToggleButton>
                                    <ToggleButton value="right">{sizeToLabel[size]}</ToggleButton>
                                </ToggleButtonGroup>
                            );
                        })}
                    </Box>
                </Box>

                {/* Chip & Avatar */}
                <Box component="section" className="section" id="sectionChipAvatar">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Chip & Avatar
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Default" />
                        <Chip label="Primary" color="primary" />
                        <Chip label="Secondary" color="secondary" />
                        <Chip label="Success" color="success" />
                        <Chip label="Error" color="error" />
                        <Chip label="Warning" color="warning" />
                        <Chip label="Info" color="info" />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Filled" variant="filled" />
                        <Chip label="Outlined" variant="outlined" />
                        <Chip label="Deletable" onDelete={() => { }} />
                        <Chip label="With Icon" icon={<Star />} />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Chip label="Small" size="small" />
                        <Chip label="Default(Medium)" />
                    </Stack>
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>
                        Avatar - variant
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>A</Avatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }} variant="rounded">B</Avatar>
                        <Avatar sx={{ bgcolor: 'success.main' }} variant="square">C</Avatar>
                    </Stack>
                    <Typography variant="subtitle2">
                        Avatar - size
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 2 }}>
                        <Avatar sx={{ width: 18, height: 18, bgcolor: 'primary.main', fontSize: '10px' }}>XS</Avatar>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '13px' }}>S</Avatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '16px' }}>M</Avatar>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '20px' }}>L</Avatar>
                    </Stack>
                    <Typography variant="subtitle2">
                        Avatar - color (letter)
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>P</Avatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>S</Avatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>S</Avatar>
                        <Avatar sx={{ bgcolor: 'error.main' }}>E</Avatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>W</Avatar>
                        <Avatar sx={{ bgcolor: 'info.main' }}>I</Avatar>
                    </Stack>
                    <Typography variant="subtitle2">
                        Avatar - icon
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                            <Person fontSize="inherit" sx={{ fontSize: '16px' }} />
                        </Avatar>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                            <Person fontSize="inherit" />
                        </Avatar>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: 'success.main' }}>
                            <Person fontSize="medium" />
                        </Avatar>
                    </Stack>
                </Box>

                {/* Form */}
                <Box component="section" className="section" id="sectionForm">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Form
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <TextField label="Standard" variant="standard" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField label="Filled" variant="filled" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField label="Outlined" variant="outlined" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField label="With Helper Text" helperText="Some important text" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                label="With Icon"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                                fullWidth
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControl fullWidth>
                                <InputLabel id="basicSelectLabel">Select</InputLabel>
                                <Select
                                    labelId="basicSelectLabel"
                                    defaultValue="option1"
                                    label="Select"
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={3}>
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                                label="Checkbox"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControl fullWidth>
                                <FormLabel>Radio Group</FormLabel>
                                <RadioGroup value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                                    <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
                                    <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Typography component="h3" variant="h5" gutterBottom sx={{ mt: 3 }}>
                        Outlined (disabled · readOnly)
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <TextField
                                label="Outlined disabled"
                                variant="outlined"
                                defaultValue="Cannot edit"
                                disabled
                                fullWidth
                            />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                label="Outlined readOnly"
                                variant="outlined"
                                defaultValue="Selectable, not editable"
                                fullWidth
                                slotProps={{ htmlInput: { readOnly: true } }}
                            />
                        </Grid>
                    </Grid>

                    {/* Form sizes */}
                    <Typography component="h3" variant="h5" gutterBottom sx={{ mt: 3 }}>
                        Sizes
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <TextField label="TextField Small" size="small" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField label="TextField Medium" size="medium" fullWidth />
                        </Grid>
                        <Grid size={3}>
                            <TextField label="TextField Large" size="large" fullWidth />
                        </Grid>
                        <Grid size={3} />
                        <Grid size={3}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="sizeSmallLabel">Select Small</InputLabel>
                                <Select
                                    labelId="sizeSmallLabel"
                                    defaultValue="option1"
                                    label="Select Small"
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={3}>
                            <FormControl fullWidth size="medium">
                                <InputLabel id="sizeMediumLabel">Select Medium</InputLabel>
                                <Select
                                    labelId="sizeMediumLabel"
                                    defaultValue="option1"
                                    label="Select Medium"
                                >
                                    <MenuItem value="option1">Option 1</MenuItem>
                                    <MenuItem value="option2">Option 2</MenuItem>
                                    <MenuItem value="option3">Option 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={6} />
                        <Grid size={3}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={checked}
                                        onChange={(e) => setChecked(e.target.checked)}
                                    />
                                }
                                label="Checkbox (Small)"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControlLabel
                                control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
                                label="Checkbox (Medium)"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch (Small)"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={switchChecked}
                                        onChange={(e) => setSwitchChecked(e.target.checked)}
                                    />
                                }
                                label="Switch (Medium)"
                            />
                        </Grid>
                        <Grid size={3}>
                            <FormControl>
                                <FormLabel>Radio Group (Small vs Medium)</FormLabel>
                                <RadioGroup row value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
                                    <FormControlLabel value="option1" control={<Radio size="small" />} label="Small" />
                                    <FormControlLabel value="option2" control={<Radio />} label="Medium" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* Card */}
                <Box component="section" className="section" id="sectionCard">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Card
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Card Title
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    This is a simple card with some content.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Action</Button>
                                <Button size="small">Another Action</Button>
                            </CardActions>
                        </Card>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h6" component="div">
                                    Card with Icon
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <Work />
                                    </Avatar>
                                    <Typography variant="body2">Work Item</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>

                {/* Table */}
                <Box component="section" className="section" id="sectionTable">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Table
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                        <Box>
                            <Typography component="h3" variant="h5" gutterBottom>
                                Default (Medium)
                            </Typography>
                            <TableContainer component={Paper} elevation={0} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Item 1</TableCell>
                                            <TableCell>
                                                <Chip label="Active" color="success" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Item 2</TableCell>
                                            <TableCell>
                                                <Chip label="Inactive" color="default" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box>
                            <Typography component="h3" variant="h5" gutterBottom>
                                Small
                            </Typography>
                            <TableContainer component={Paper} elevation={0} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Item 1</TableCell>
                                            <TableCell>
                                                <Chip label="Active" color="success" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Item 2</TableCell>
                                            <TableCell>
                                                <Chip label="Inactive" color="default" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>

                {/* List */}
                <Box component="section" className="section" id="sectionList">
                    <Typography component="h2" variant="h4" gutterBottom>
                        List
                    </Typography>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        <Box>
                            <Typography component="h3" variant="h5" gutterBottom>
                                Default
                            </Typography>
                            <Paper sx={{ maxWidth: 400 }}>
                                <List>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Home />
                                        </ListItemIcon>
                                        <ListItemText primary="Home" secondary="Main page" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Work />
                                        </ListItemIcon>
                                        <ListItemText primary="Work" secondary="Work items" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemIcon>
                                            <School />
                                        </ListItemIcon>
                                        <ListItemText primary="Education" secondary="Learning materials" />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                        <Box>
                            <Typography component="h3" variant="h5" gutterBottom>
                                Dense
                            </Typography>
                            <Paper sx={{ maxWidth: 400 }}>
                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Home />
                                        </ListItemIcon>
                                        <ListItemText primary="Home" secondary="Main page" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Work />
                                        </ListItemIcon>
                                        <ListItemText primary="Work" secondary="Work items" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemIcon>
                                            <School />
                                        </ListItemIcon>
                                        <ListItemText primary="Education" secondary="Learning materials" />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Box>
                    </Stack>
                </Box>

                {/* Alert */}
                <Box component="section" className="section" id="sectionAlert">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Alert
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={3}>
                            <Alert severity="error">This is an error alert!</Alert>
                        </Grid>
                        <Grid size={3}>
                            <Alert severity="warning">This is a warning alert!</Alert>
                        </Grid>
                        <Grid size={3}>
                            <Alert severity="info">This is an info alert!</Alert>
                        </Grid>
                        <Grid size={3}>
                            <Alert severity="success">This is a success alert!</Alert>
                        </Grid>
                        <Grid size={3}>
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                This is an error alert with title!
                            </Alert>
                        </Grid>
                    </Grid>
                </Box>

                {/* Dialog & Menu */}
                <Box component="section" className="section" id="sectionDialogMenu">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Dialog & Menu
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={() => setDialogOpen(true)}>
                            Open Confirm Dialog
                        </Button>
                        <Button variant="contained" color="warning" onClick={() => setAlertDialogOpen(true)}>
                            Open Alert Dialog
                        </Button>
                        <Button variant="outlined" onClick={() => setDetailDialogOpen(true)}>
                            Open Detail Dialog
                        </Button>
                        <Button variant="outlined" onClick={handleMenuOpen}>
                            Open Menu
                        </Button>
                    </Stack>

                    <Dialog fullWidth maxWidth="xs" open={dialogOpen} onClose={() => setDialogOpen(false)}>
                        <DialogTitle>Confirm Dialog</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">This is a confirm dialog.</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="inherit" onClick={() => setDialogOpen(false)}>
                                취소
                            </Button>
                            <Button variant="contained" onClick={() => setDialogOpen(false)} autoFocus>
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog fullWidth maxWidth="xs" open={alertDialogOpen} onClose={() => setAlertDialogOpen(false)}>
                        <DialogTitle>Alert Dialog</DialogTitle>
                        <DialogContent>
                            <Typography variant="body2">This is an alert dialog.</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" onClick={() => setAlertDialogOpen(false)} autoFocus>
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog fullWidth maxWidth="md" open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)}>
                        <DialogTitle>Dialog Title</DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body2">This is a detail dialog with dividers.</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="inherit" onClick={() => setDetailDialogOpen(false)}>
                                취소
                            </Button>
                            <Button variant="contained" onClick={() => setDetailDialogOpen(false)}>
                                확인
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent>
                                <Edit />
                            </ListItemIconComponent>
                            <ListItemTextComponent>Edit</ListItemTextComponent>
                        </MenuItemComponent>
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent>
                                <Share />
                            </ListItemIconComponent>
                            <ListItemTextComponent>Share</ListItemTextComponent>
                        </MenuItemComponent>
                        <MenuItemComponent onClick={handleMenuClose}>
                            <ListItemIconComponent>
                                <Delete />
                            </ListItemIconComponent>
                            <ListItemTextComponent>Delete</ListItemTextComponent>
                        </MenuItemComponent>
                    </Menu>
                </Box>

                {/* Snackbar */}
                <Box component="section" className="section" id="sectionSnackbar">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Snackbar
                    </Typography>
                    <Button variant="contained" onClick={() => setSnackbarOpen(true)}>
                        Show Snackbar
                    </Button>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                        message="This is a snackbar message"
                    />
                </Box>

                {/* Custom */}
                <Box component="section" className="section" id="sectionCustom">
                    <Typography component="h2" variant="h4" gutterBottom>
                        Custom (공통 컴포넌트 추가, MUI X)
                    </Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 140 }}>
                                Brand - logo(default)
                            </Typography>
                            <Brand size="small" />
                            <Brand size="medium" />
                            <Brand size="large" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 140 }}>
                                Brand - mark
                            </Typography>
                            <Brand variant="mark" size="small" />
                            <Brand variant="mark" size="medium" />
                            <Brand variant="mark" size="large" />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 140 }}>
                                FilterToggleGroup
                            </Typography>
                            <FilterToggleGroup
                                options={[
                                    { value: 'all', label: '전체', count: 100 },
                                    { value: 'filter1', label: '필터명 1', count: 99 },
                                    { value: 'filter2', label: '필터명 2', count: 1 },
                                ]}
                                value={filterToggleValue}
                                onChange={setFilterToggleValue}
                                size="small"
                            />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 148 }}>
                                StatusChip
                            </Typography>
                            <StatusChip status="active" />
                            <StatusChip status="inactive" />
                            <StatusChip status="stop" />
                            <StatusChip status="undeployed" />
                            <StatusChip status="expired" />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 148 }}>
                                ServerChip
                            </Typography>
                            <ServerChip state="local" />
                            <ServerChip state="dev" />
                            <ServerChip state="stage" />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" sx={{ width: 148 }}>
                                FavoriteButton
                            </Typography>
                            <FavoriteButton />
                            <FavoriteButton selected />
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};
