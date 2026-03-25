import { Drawer, useTheme } from '@mui/material';
import { SIDEBAR_WIDTH, SIDEBAR_MINI_WIDTH, HEADER_HEIGHT, Z_INDEX } from '@/config';
import { Navigation } from './Navigation/Navigation';

export interface SidebarProps {
    /** false이면 미니 너비 + 네비 라벨 숨김 */
    open?: boolean;
}

export const Sidebar = ({ open = true }: SidebarProps) => {
    const theme = useTheme();
    const width = open ? SIDEBAR_WIDTH : SIDEBAR_MINI_WIDTH;
    const widthTransition = theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
    });

    return (
        <Drawer
            variant="permanent"
            sx={{
                width,
                flexShrink: 0,
                zIndex: Z_INDEX.SIDEBAR,
                transition: widthTransition,
                '& .MuiDrawer-paper': {
                    width,
                    boxSizing: 'border-box',
                    transition: widthTransition,
                    overflow: 'auto',
                    overflowX: 'hidden',
                    top: `${HEADER_HEIGHT}px`,
                    height: `calc(100% - ${HEADER_HEIGHT}px)`,
                },
            }}
        >
            <Navigation open={open} />
        </Drawer>
    );
};
