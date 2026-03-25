/**
 * Navigation 메인 컴포넌트
 *
 * 좌측 사이드바의 네비게이션 메뉴를 렌더링합니다.
 * 설정은 config/navigation.ts에서 관리됩니다.
 */

import { Box, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION_MENU, getIconComponent } from '@/config';
import { useNavigationState, isPathActive } from './hooks/useNavigationState';
import { NavigationItem } from './NavigationItem';
import { NavigationFolder } from './NavigationFolder';
import { NavigationProps } from './types';

export const Navigation = ({ open }: NavigationProps) => {
    const navigate = useNavigate();
    const { expandedFolders, handleFolderToggle, currentPath } = useNavigationState();

    const handleNavigation = (path: string) => path && navigate(path);

    const menuItems = NAVIGATION_MENU.filter((item) => item.showInSidebar).map((item) => {
        const IconComponent = getIconComponent(item.icon as string);
        return {
            ...item,
            icon: <IconComponent />,
            isActive: isPathActive(currentPath, item.path),
        };
    });

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <List dense sx={{ p: 0 }}>
                {menuItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedFolders.has(item.label);
                    const isActive =
                        item.isActive ||
                        (hasChildren && item.children?.some((child) => isPathActive(currentPath, child.path)));

                    return (
                        <Box key={item.path || item.label}>
                            <NavigationItem
                                item={item}
                                open={open}
                                isActive={isActive || false}
                                isExpanded={isExpanded}
                                hasChildren={hasChildren || false}
                                currentPath={currentPath}
                                expandedFolders={expandedFolders}
                                onFolderToggle={handleFolderToggle}
                                onToggle={() => handleFolderToggle(item.label)}
                                onNavigate={handleNavigation}
                            />

                            {hasChildren && (
                                <NavigationFolder
                                    items={item.children || []}
                                    open={open}
                                    isExpanded={isExpanded}
                                    currentPath={currentPath}
                                    expandedFolders={expandedFolders}
                                    onFolderToggle={handleFolderToggle}
                                    onNavigate={handleNavigation}
                                />
                            )}
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
};
