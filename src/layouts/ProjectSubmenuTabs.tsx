/**
 * 프로젝트 영역 3뎁스 메뉴 — 피그마 Submenu / MUI Tabs 스타일
 */
import { Box, Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProjectSubmenuTabs } from '@/config/navigation';

export const ProjectSubmenuTabs = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const tabs = getProjectSubmenuTabs(location.pathname);

    if (!tabs?.length) return null;

    const activeIndex = tabs.findIndex(
        (t) => location.pathname === t.path || location.pathname.startsWith(`${t.path}/`),
    );
    const value = activeIndex >= 0 ? activeIndex : 0;

    return (
        <Box
            sx={{
                bgcolor: 'background.paper',
                borderBottom: 1,
                borderColor: 'divider',
                px: 3,
            }}
        >
            <Tabs
                value={value}
                onChange={(_e, next) => {
                    const nextPath = tabs[next]?.path;
                    if (nextPath) navigate(nextPath);
                }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    minHeight: 42,
                    '& .MuiTabs-flexContainer': { gap: 0 },
                    '& .MuiTab-root': {
                        minHeight: 42,
                        color: 'text.primary',
                        '&.Mui-selected': {
                            color: 'primary.main',
                        },
                    },
                    '& .MuiTabs-indicator': {
                        height: 2,
                        bgcolor: 'primary.main',
                    },
                }}
            >
                {tabs.map((t, i) => (
                    <Tab key={t.path} label={t.label} value={i} disableRipple />
                ))}
            </Tabs>
        </Box>
    );
};
