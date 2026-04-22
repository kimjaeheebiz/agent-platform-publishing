/**
 * Navigation 폴더형 메뉴 컴포넌트 (2 depth, 3 depth)
 */

import { Collapse, List } from '@mui/material';
import type { NavigationMenuChild } from '@/config/navigation';
import { NavigationDepth2List } from './NavigationDepth2List';

export interface NavigationFolderProps {
    /** 1뎁스 그룹의 2뎁스 항목 (`NavigationMenuChild[]`) */
    items: NavigationMenuChild[];
    open: boolean;
    isExpanded: boolean;
    currentPath: string;
    expandedFolders: Set<string>;
    onFolderToggle: (label: string) => void;
    onNavigate: (path: string) => void;
}

/** 펼침 사이드바: 1뎁스 폴더 아래 2·3뎁스 (Collapse + List + NavigationDepth2List) */
export function NavigationFolder({
    items,
    open,
    isExpanded,
    currentPath,
    expandedFolders,
    onFolderToggle,
    onNavigate,
}: NavigationFolderProps) {
    return (
        <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="ul" disablePadding dense>
                <NavigationDepth2List
                    variant="expanded"
                    items={items}
                    open={open}
                    currentPath={currentPath}
                    expandedFolders={expandedFolders}
                    onFolderToggle={onFolderToggle}
                    onNavigate={onNavigate}
                />
            </List>
        </Collapse>
    );
}
