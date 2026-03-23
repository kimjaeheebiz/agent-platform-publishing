import { Drawer } from '@mui/material';
import { SIDEBAR_WIDTH, HEADER_HEIGHT, Z_INDEX } from '@/config';
import { Navigation } from './Navigation/Navigation';

export const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            open={true}
            onClose={undefined}
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                zIndex: Z_INDEX.SIDEBAR,
                '& .MuiDrawer-paper': {
                    width: SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    transition: 'none',
                    overflow: 'auto',
                    top: `${HEADER_HEIGHT}px`,
                    height: `calc(100% - ${HEADER_HEIGHT}px)`,
                },
            }}
        >
            <Navigation open={true} />
        </Drawer>
    );
};
