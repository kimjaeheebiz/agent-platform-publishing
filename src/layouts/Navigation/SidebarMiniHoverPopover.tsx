/**
 * 접힌 사이드바에서 마우스 오버 시 오른쪽 Paper(Popover) 노출 — 1뎁스 폴더·아이템 공통
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Popover } from '@mui/material';

const LEAVE_DELAY_MS = 120;

export type SidebarMiniHoverPopoverChildren = ReactNode | ((dismiss: () => void) => ReactNode);

export interface SidebarMiniHoverPopoverProps {
    trigger: ReactNode;
    children: SidebarMiniHoverPopoverChildren;
}

export function SidebarMiniHoverPopover({ trigger, children }: SidebarMiniHoverPopoverProps) {
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLeaveTimer = useCallback(() => {
        if (leaveTimerRef.current !== null) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        clearLeaveTimer();
        leaveTimerRef.current = setTimeout(() => setPopoverOpen(false), LEAVE_DELAY_MS);
    }, [clearLeaveTimer]);

    const handleEnter = useCallback(() => {
        clearLeaveTimer();
        setPopoverOpen(true);
    }, [clearLeaveTimer]);

    const dismiss = useCallback(() => setPopoverOpen(false), []);

    useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

    const content = typeof children === 'function' ? children(dismiss) : children;

    return (
        <Box ref={anchorRef} sx={{ width: '100%' }}>
            <Box onMouseEnter={handleEnter} onMouseLeave={scheduleClose}>
                {trigger}
            </Box>
            <Popover
                open={popoverOpen}
                anchorEl={anchorRef.current}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                disableRestoreFocus
                slotProps={{
                    root: {
                        sx: { pointerEvents: 'none' },
                    },
                    paper: {
                        elevation: 8,
                        onMouseEnter: handleEnter,
                        onMouseLeave: scheduleClose,
                        sx: {
                            pointerEvents: 'auto',
                            ml: 0.5,
                            minWidth: 268,
                            maxHeight: 'min(70vh, 520px)',
                            overflow: 'auto',
                            py: 1,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                        },
                    },
                }}
            >
                {content}
            </Popover>
        </Box>
    );
}
