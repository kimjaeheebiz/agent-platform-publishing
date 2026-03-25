/**
 * 1뎁스 폴더 아래 2·3뎁스 항목을 MUI List로 렌더링.
 * 펼침(`NavigationFolder`)과 접힘 플라이아웃(`CollapsedFolderFlyout`)에서 공통 사용.
 * `variant="flyout"`일 때는 3뎁스 UI를 그리지 않음.
 */

import {
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { getIconComponent, type NavigationMenuChild } from '@/config/navigation';
import { isPathActive } from './hooks/useNavigationState';
import { NAV_LIST_SLOT } from './navigationListTypography';

function isProjectThirdDepthSidebar(child: NavigationMenuChild): boolean {
    if (!child.children?.length) return false;
    return child.children.every((gc) => /^\/project\/[^/]+\//.test(gc.path));
}

export type NavigationDepth2Variant = 'expanded' | 'flyout';

export interface NavigationDepth2ListProps {
    items: NavigationMenuChild[];
    variant: NavigationDepth2Variant;
    /** 펼침 사이드바에서 라벨·트레일 아이콘 표시 여부; 플라이아웃은 항상 라벨 표시 */
    open: boolean;
    currentPath: string;
    expandedFolders: Set<string>;
    onFolderToggle: (label: string) => void;
    onNavigate: (path: string) => void;
    /** 플라이아웃에서 항목 클릭 후 닫기 */
    onFlyoutDismiss?: () => void;
}

export function NavigationDepth2List({
    items,
    variant,
    open,
    currentPath,
    expandedFolders,
    onFolderToggle,
    onNavigate,
    onFlyoutDismiss,
}: NavigationDepth2ListProps) {
    const showText = variant === 'flyout' || open;
    const showTrail = variant === 'flyout' || open;

    const finishFlyout = () => {
        if (variant === 'flyout') onFlyoutDismiss?.();
    };

    const goPath = (path: string) => {
        onNavigate(path);
        finishFlyout();
    };

    return (
        <>
            {items.map((child) => {
                const hasGrandChildren = Boolean(child.children && child.children.length > 0);
                const projectTabsOnly = hasGrandChildren && isProjectThirdDepthSidebar(child);
                const isChildExpanded = expandedFolders.has(child.label);
                const isChildActive = child.path
                    ? isPathActive(currentPath, child.path)
                    : hasGrandChildren &&
                      child.children?.some((grandChild) => isPathActive(currentPath, grandChild.path));

                const firstProjectTabPath =
                    projectTabsOnly && child.children?.[0]?.path ? child.children[0].path : undefined;

                const firstGrandPath =
                    !projectTabsOnly && hasGrandChildren && child.children?.[0]?.path
                        ? child.children[0].path
                        : undefined;

                const trail = child.iconButton;
                const TrailIcon = trail ? getIconComponent(trail.icon) : null;
                const secondaryAction =
                    showTrail && trail && TrailIcon ? (
                        <IconButton
                            edge="end"
                            size="small"
                            aria-label={child.label}
                            onClick={(e) => {
                                e.stopPropagation();
                                trail.onClick?.();
                                if (variant === 'flyout') onFlyoutDismiss?.();
                            }}
                            sx={{ color: 'action.active' }}
                        >
                            <TrailIcon />
                        </IconButton>
                    ) : undefined;

                const handleRowClick = () => {
                    if (projectTabsOnly && firstProjectTabPath) {
                        goPath(firstProjectTabPath);
                        return;
                    }
                    if (hasGrandChildren && !projectTabsOnly) {
                        if (variant === 'expanded' && open) {
                            onFolderToggle(child.label);
                        } else if (firstGrandPath) {
                            goPath(firstGrandPath);
                        }
                        return;
                    }
                    if (child.path) {
                        goPath(child.path);
                        return;
                    }
                    child.onRowClick?.();
                    finishFlyout();
                };

                const showNestedThird =
                    variant === 'expanded' && hasGrandChildren && !projectTabsOnly && open;

                return (
                    <ListItem
                        key={child.path || child.label}
                        disablePadding
                        secondaryAction={secondaryAction}
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            onClick={handleRowClick}
                            selected={isChildActive}
                            sx={{
                                pl: variant === 'flyout' ? 2 : 9,
                                pr: secondaryAction ? 6 : 2,
                            }}
                        >
                            {showText && <ListItemText primary={child.label} slotProps={NAV_LIST_SLOT.depth2} />}
                            {variant === 'expanded' &&
                                hasGrandChildren &&
                                !projectTabsOnly &&
                                open &&
                                (isChildExpanded ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>

                        {showNestedThird && (
                            <Collapse in={isChildExpanded && open} timeout="auto" unmountOnExit>
                                <List component="ul" disablePadding dense>
                                    {child.children?.map((grandChild) => {
                                        const isGrandChildActive = isPathActive(currentPath, grandChild.path);
                                        return (
                                            <ListItem
                                                key={grandChild.path}
                                                disablePadding
                                                sx={{ display: 'block' }}
                                            >
                                                <ListItemButton
                                                    onClick={() => onNavigate(grandChild.path)}
                                                    selected={isGrandChildActive}
                                                    sx={{
                                                        pl: 12,
                                                        pr: 2,
                                                    }}
                                                >
                                                    {open && (
                                                        <ListItemText
                                                            primary={grandChild.label}
                                                            slotProps={NAV_LIST_SLOT.depth2}
                                                        />
                                                    )}
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        )}
                    </ListItem>
                );
            })}
        </>
    );
}
