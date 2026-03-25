/**
 * 사이드바 접힘(mini) 시 1뎁스 폴더(group) 호버로 하위 메뉴를 Paper(Popover)에 표시.
 */

import type { ReactNode } from 'react';
import { Divider, List, Typography } from '@mui/material';
import type { NavigationMenuChild } from '@/config/navigation';
import { NavigationDepth2List } from './NavigationDepth2List';
import { SidebarMiniHoverPopover } from './SidebarMiniHoverPopover';

export interface CollapsedFolderFlyoutProps {
    /** 1뎁스 폴더명 — 플라이아웃 헤더 */
    title: string;
    /** `NavigationDepth2List`에 그대로 전달 */
    items: NavigationMenuChild[];
    currentPath: string;
    expandedFolders: Set<string>;
    onFolderToggle: (label: string) => void;
    onNavigate: (path: string) => void;
    trigger: ReactNode;
}

export function CollapsedFolderFlyout({
    title,
    items,
    currentPath,
    expandedFolders,
    onFolderToggle,
    onNavigate,
    trigger,
}: CollapsedFolderFlyoutProps) {
    return (
        <SidebarMiniHoverPopover trigger={trigger}>
            {(dismiss) => (
                <>
                    <Typography variant="subtitle2" sx={{ px: 2, pb: 1, color: 'text.primary' }}>
                        {title}
                    </Typography>
                    <Divider sx={{ borderColor: 'divider' }} />
                    <List component="ul" disablePadding dense sx={{ pt: 0.5 }}>
                        <NavigationDepth2List
                            variant="flyout"
                            items={items}
                            open
                            currentPath={currentPath}
                            expandedFolders={expandedFolders}
                            onFolderToggle={onFolderToggle}
                            onNavigate={onNavigate}
                            onFlyoutDismiss={dismiss}
                        />
                    </List>
                </>
            )}
        </SidebarMiniHoverPopover>
    );
}
