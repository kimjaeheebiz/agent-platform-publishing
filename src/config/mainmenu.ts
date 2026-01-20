/**
 * 메뉴 설정
 * 
 * 메뉴 구조:
 * - 1뎁스, 2뎁스: Sidebar에 메뉴 표시
 * - 3뎁스: 상단 서브 메뉴 표시
 * - 4뎁스: 메뉴에 표시하지 않음 (페이지 제목에 뒤로가기 버튼만 추가)
 * 
 * 페이지 정보:
 * - 모든 페이지 정보는 `pages.ts`에서 관리 (단일 소스)
 * - 메뉴 아이템은 `pages.ts`의 `id` 값을 참조하여 `pageId` 설정
 * - 피그마에서 페이지를 생성할 때 `pages.ts`에 페이지 정보를 추가하고,
 *   이 파일에 메뉴 구조를 추가하세요.
 */

// =========================================================================
// 타입 정의
// =========================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface SortOption {
    key: string;
    label: string;
}

export type ActionButtonType = 'button' | 'sort-group';

export interface ActionButton {
    key: string;
    label?: string;
    type: ActionButtonType;
    onClick?: () => void;
    textColor?: string;
    sortOptions?: SortOption[];
    onSort?: (key: string, direction: SortDirection) => void;
}

export type MenuType = 'group' | 'item';

interface BaseMenuItem {
    id: string;
    title: string; // 제목 (필수)
    type: MenuType;
    icon?: string;
    pageId?: string; // 페이지 ID (type: 'item'인 경우 필수, pages.ts 참조)
    path?: string; // 메뉴 표시용 경로 (기본값: pages.ts의 path 사용, 변경 필요 시에만 명시)
}

export interface MenuGroup extends BaseMenuItem {
    type: 'group';
    children: MenuItem[];
    actions?: ActionButton[];
}

export interface MenuItemLeaf extends BaseMenuItem {
    type: 'item';
    pageId: string;
    path?: string; // 기본값: pages.ts의 path 사용, 변경 필요 시에만 명시
}

export type MenuItem = MenuGroup | MenuItemLeaf;

// =========================================================================
// 메뉴 데이터
// =========================================================================

/**
 * 메인 메뉴 구조
 * 
 * pages.ts의 페이지 정보를 참조하여 메뉴를 구성합니다.
 * 각 메뉴 아이템은 `pageId`로 pages.ts의 페이지를 참조합니다.
 */
export const MAIN_MENUS: MenuItem[] = [
    {
        id: 'home',
        title: '홈',
        type: 'item',
        icon: 'HomeOutlined',
        pageId: 'home',
    },
    {
        id: 'project',
        title: '프로젝트',
        type: 'group',
        icon: 'FolderOutlined',
        children: [
            {
                id: 'project1',
                title: '프로젝트 1',
                type: 'group',
                children: [
                    {
                        id: 'project1.agent',
                        title: '에이전트',
                        type: 'item',
                        pageId: 'project.agent',
                        path: '/project/project1/agent',
                    },
                    {
                        id: 'project1.credential',
                        title: 'CREDENTIAL',
                        type: 'item',
                        pageId: 'project.credential',
                        path: '/project/project1/credential',
                    },
                    {
                        id: 'project1.knowledgebase',
                        title: '지식베이스',
                        type: 'item',
                        pageId: 'project.knowledgebase',
                        path: '/project/project1/knowledgebase',
                    },
                    {
                        id: 'project1.apikey',
                        title: 'API 키',
                        type: 'item',
                        pageId: 'project.apikey',
                        path: '/project/project1/apikey',
                    },
                    {
                        id: 'project1.member',
                        title: '구성원',
                        type: 'item',
                        pageId: 'project.member',
                        path: '/project/project1/member',
                    },
                ],
            },
            {
                id: 'project2',
                title: '프로젝트 2',
                type: 'group',
                children: [
                    {
                        id: 'project2.agent',
                        title: '에이전트',
                        type: 'item',
                        pageId: 'project.agent',
                        path: '/project/project2/agent',
                    },
                    {
                        id: 'project2.credential',
                        title: 'CREDENTIAL',
                        type: 'item',
                        pageId: 'project.credential',
                        path: '/project/project2/credential',
                    },
                    {
                        id: 'project2.knowledgebase',
                        title: '지식베이스',
                        type: 'item',
                        pageId: 'project.knowledgebase',
                        path: '/project/project2/knowledgebase',
                    },
                    {
                        id: 'project2.apikey',
                        title: 'API 키',
                        type: 'item',
                        pageId: 'project.apikey',
                        path: '/project/project2/apikey',
                    },
                    {
                        id: 'project2.member',
                        title: '구성원',
                        type: 'item',
                        pageId: 'project.member',
                        path: '/project/project2/member',
                    },
                ],
            },
        ],
    },
    {
        id: 'admin',
        title: '어드민',
        type: 'group',
        icon: 'AdminPanelSettingsOutlined',
        children: [
            {
                id: 'admin.project',
                title: '프로젝트',
                type: 'item',
                pageId: 'admin.project',
            },
            {
                id: 'admin.agent',
                title: '에이전트',
                type: 'item',
                pageId: 'admin.agent',
            },
            {
                id: 'admin.users',
                title: '사용자',
                type: 'item',
                pageId: 'admin.users',
            },
            {
                id: 'admin.recycle',
                title: '휴지통',
                type: 'item',
                pageId: 'admin.recycle',
            },
        ],
    },
    {
        id: 'guide',
        title: '컴포넌트 안내',
        type: 'item',
        icon: 'WidgetsOutlined',
        pageId: 'guide',
    },
    {
        id: 'test',
        title: 'Test',
        type: 'item',
        icon: 'StarBorder',
        pageId: 'test',
    },
];

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * 메뉴 제목 가져오기
 */
export const getMainMenuTitle = (menu: MenuItem): string => {
    return menu.title || menu.id;
};
