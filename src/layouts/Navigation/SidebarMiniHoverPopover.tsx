/**
 * 접힌 사이드바에서 마우스 오버 시 오른쪽에 플라이아웃 노출 — 1뎁스 폴더·아이템 공통
 *
 * Popover(Modal 기반) 대신 Popper 사용: 호버 메뉴는 모달이 아니므로 aria-hidden/포커스 잠금 경고를 피함.
 */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Paper, Popper, useTheme } from '@mui/material';

const LEAVE_DELAY_MS = 120;

export type SidebarMiniHoverPopoverChildren = ReactNode | ((dismiss: () => void) => ReactNode);

export interface SidebarMiniHoverPopoverProps {
    trigger: ReactNode;
    children: SidebarMiniHoverPopoverChildren;
}

export function SidebarMiniHoverPopover({ trigger, children }: SidebarMiniHoverPopoverProps) {
    const theme = useTheme();
    const anchorRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearLeaveTimer = useCallback(() => {
        if (leaveTimerRef.current !== null) {
            clearTimeout(leaveTimerRef.current);
            leaveTimerRef.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        clearLeaveTimer();
        leaveTimerRef.current = setTimeout(() => setOpen(false), LEAVE_DELAY_MS);
    }, [clearLeaveTimer]);

    const handleEnter = useCallback(() => {
        clearLeaveTimer();
        setOpen(true);
    }, [clearLeaveTimer]);

    const dismiss = useCallback(() => setOpen(false), []);

    useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

    const content = typeof children === 'function' ? children(dismiss) : children;

    return (
        <Box ref={anchorRef} sx={{ width: '100%' }}>
            <Box onMouseEnter={handleEnter} onMouseLeave={scheduleClose}>
                {trigger}
            </Box>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement="right-start"
                sx={{ zIndex: theme.zIndex.modal }}
                modifiers={[{ name: 'offset', options: { offset: [4, 0] } }]}
            >
                <Paper
                    elevation={8}
                    onMouseEnter={handleEnter}
                    onMouseLeave={scheduleClose}
                    sx={{
                        ml: 0.5,
                        minWidth: 268,
                        maxHeight: 'min(70vh, 520px)',
                        overflow: 'auto',
                        py: 1,
                        borderRadius: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    {content}
                </Paper>
            </Popper>
        </Box>
    );
}
