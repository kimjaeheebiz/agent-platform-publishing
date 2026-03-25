/**
 * Navigation 메뉴 아이템 컴포넌트 (1-depth)
 */

import type { ReactNode } from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { NavigationMenuItem } from '@/config/navigation';
import { CollapsedFolderFlyout } from './CollapsedFolderFlyout';
import { CollapsedLeafFlyout } from './CollapsedLeafFlyout';
import { NAV_LIST_SLOT } from './navigationListTypography';

interface NavigationItemProps {
    item: NavigationMenuItem;
    open: boolean;
    isActive: boolean;
    isExpanded: boolean;
    hasChildren: boolean;
    currentPath: string;
    expandedFolders: Set<string>;
    onFolderToggle: (label: string) => void;
    onToggle: () => void;
    onNavigate: (path: string) => void;
}

export function NavigationItem({
    item,
    open,
    isActive,
    isExpanded,
    hasChildren,
    currentPath,
    expandedFolders,
    onFolderToggle,
    onToggle,
    onNavigate,
}: NavigationItemProps) {
    const handleClick = () => {
        if (hasChildren) {
            onToggle();
        } else if (item.path) {
            onNavigate(item.path);
        }
    };

    const listItemButton = (
        <ListItemButton
            onClick={handleClick}
            selected={isActive}
            sx={{
                justifyContent: open ? 'flex-start' : 'center',
                minHeight: 48,
                px: open ? 2 : 'auto',
                width: '100%',
                display: 'flex',
            }}
        >
            <ListItemIcon
                sx={{
                    minWidth: open ? 40 : 'auto',
                    justifyContent: 'center',
                }}
            >
                {item.icon}
            </ListItemIcon>
            {open && (
                <ListItemText
                    primary={item.label}
                    slotProps={NAV_LIST_SLOT.depth1}
                    sx={{
                        ml: 1,
                    }}
                />
            )}
            {hasChildren && open && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
    );

    const collapsedFolder =
        !open && hasChildren && item.children && item.children.length > 0;
    const collapsedLeaf = !open && !hasChildren && Boolean(item.path);

    let inner: ReactNode;
    if (open) {
        inner = listItemButton;
    } else if (collapsedFolder) {
        inner = (
            <CollapsedFolderFlyout
                title={item.label}
                items={item.children!}
                currentPath={currentPath}
                expandedFolders={expandedFolders}
                onFolderToggle={onFolderToggle}
                onNavigate={onNavigate}
                trigger={listItemButton}
            />
        );
    } else if (collapsedLeaf && item.path) {
        inner = (
            <CollapsedLeafFlyout
                title={item.label}
                path={item.path}
                isActive={isActive}
                onNavigate={onNavigate}
                trigger={listItemButton}
            />
        );
    } else {
        inner = listItemButton;
    }

    return (
        <ListItem
            disablePadding
            sx={{
                display: 'block',
                width: '100%',
            }}
        >
            {inner}
        </ListItem>
    );
}
