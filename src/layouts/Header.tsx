import { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Stack,
    IconButton,
    Link,
    useTheme,
    Button,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Brand, ServerChip } from '@/components';
import {
    MenuOutlined,
    MenuOpenOutlined,
    DarkModeOutlined,
    LightModeOutlined,
    PersonOutline,
    AccountCircleOutlined,
    Logout,
} from '@mui/icons-material';
import { HEADER_HEIGHT, Z_INDEX } from '@/config';

export interface HeaderProps {
    onMenuToggle?: () => void;
    /** 펼침: MenuOpenOutlined, 접힘: MenuOutlined */
    sidebarOpen?: boolean;
    onToggleTheme?: () => void;
}

export const Header = ({ onMenuToggle, sidebarOpen = true, onToggleTheme }: HeaderProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
    const userMenuOpen = Boolean(userMenuAnchor);

    // 다크모드와 관계없이 헤더 배경은 항상 피그마 darkFill 토큰을 사용합니다.
    const appBarBg = '_components.appBar.darkFill';

    return (
        <AppBar
            component="header"
            color="primary"
            position="fixed"
            elevation={0}
            sx={{
                minHeight: `${HEADER_HEIGHT}px`,
                backgroundColor: appBarBg,
                zIndex: Z_INDEX.HEADER,
            }}
        >
            <Toolbar variant="dense" sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {onMenuToggle && (
                        <IconButton
                            color="inherit"
                            aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
                            onClick={onMenuToggle}
                            edge="start"
                        >
                            {sidebarOpen ? <MenuOpenOutlined /> : <MenuOutlined />}
                        </IconButton>
                    )}
                    <Link
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Brand variant="mark" />
                    </Link>
                    <ServerChip state="local" />
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton color="inherit" size="small" aria-label="테마 토글" onClick={onToggleTheme}>
                        {isDark ? <LightModeOutlined fontSize="small" /> : <DarkModeOutlined fontSize="small" />}
                    </IconButton>
                    <Button
                        color="inherit"
                        size="small"
                        aria-label="계정 메뉴"
                        aria-controls={userMenuOpen ? 'header-account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={userMenuOpen ? 'true' : undefined}
                        onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                        sx={{ gap: 1 }}
                    >
                        <Avatar sx={{ width: 26, height: 26, fontSize: '13px', bgcolor: 'primary.main', color: 'inherit' }}>
                            <PersonOutline fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">홍길동</Typography>
                    </Button>
                    <Menu
                        id="header-account-menu"
                        anchorEl={userMenuAnchor}
                        open={userMenuOpen}
                        onClose={() => setUserMenuAnchor(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        slotProps={{
                            paper: {
                                sx: {
                                    p: 0,
                                    minWidth: 260,
                                },
                            },
                        }}
                    >
                        <ListItem sx={{ py: 0 }}>
                            <ListItemText primary="홍길동" secondary="honggildong@hecto.co.kr" />
                        </ListItem>
                        <Divider sx={{ my: 1 }} />
                        <MenuItem
                            onClick={() => {
                                setUserMenuAnchor(null);
                                navigate('/account');
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircleOutlined fontSize="small" />
                            </ListItemIcon>
                            계정 정보
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setUserMenuAnchor(null);
                                navigate('/login');
                            }}
                        >
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            로그아웃
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};
