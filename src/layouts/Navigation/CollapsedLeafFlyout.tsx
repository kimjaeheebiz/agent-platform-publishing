/**
 * 접힌 사이드바 — 1뎁스 단일 링크(item) 호버 시 Paper Popover.
 * 펼침과 동일하게 라벨은 한 번만 표시(중복 헤더 없음).
 */

import type { ReactNode } from 'react';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { SidebarMiniHoverPopover } from './SidebarMiniHoverPopover';
import { NAV_LIST_SLOT } from './navigationListTypography';

export interface CollapsedLeafFlyoutProps {
    title: string;
    path: string;
    isActive: boolean;
    onNavigate: (path: string) => void;
    trigger: ReactNode;
}

export function CollapsedLeafFlyout({ title, path, isActive, onNavigate, trigger }: CollapsedLeafFlyoutProps) {
    return (
        <SidebarMiniHoverPopover trigger={trigger}>
            {(dismiss) => (
                <List component="ul" disablePadding dense>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={isActive}
                            onClick={() => {
                                onNavigate(path);
                                dismiss();
                            }}
                            sx={{ px: 2, py: 1 }}
                        >
                            <ListItemText primary={title} slotProps={NAV_LIST_SLOT.depth1} />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}
        </SidebarMiniHoverPopover>
    );
}
