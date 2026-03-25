/**
 * 메뉴 설정
 * 
 * 메뉴 구조:
 * - 1뎁스, 2뎁스: Sidebar에 메뉴 표시
 * - 3뎁스: 상단 서브 메뉴 표시
 * - 4뎁스: 메뉴에 표시하지 않음. item의 children으로 등록하면 라우트만 등록되고 메뉴에는 노출되지 않음.
 * 
 * 페이지 정보:
 * - 모든 페이지 정보는 `pages.ts`에서 관리 (단일 소스)
 * - `type: 'item'`은 `pages.ts`의 `id`를 `pageId`로 참조
 * - `type: 'action'`은 페이지·라우트 없이 사이드바 한 줄만 (라벨 `onClick` / `iconButton`은 운영에서 연결)
 * - 피그마에서 페이지를 생성할 때 `pages.ts`에 페이지 정보를 추가하고,
 *   이 파일에 메뉴 구조를 추가하세요.
 */

// =========================================================================
// 타입 정의
// =========================================================================

export type MenuType = 'group' | 'item' | 'action';

interface BaseMenuItem {
    id: string;
    title: string; // 제목 (필수)
    type: MenuType;
    icon?: string;
    pageId?: string; // 페이지 ID (type: 'item'인 경우 필수, pages.ts 참조)
    path?: string; // 메뉴 표시용 경로 (기본값: pages.ts의 path 사용, 변경 필요 시에만 명시)
}

/**
 * 라우트·pages.ts 없음. 사이드바 2뎁스 한 줄(라벨 + 선택적 오른쪽 IconButton).
 */
export interface MenuAction {
    id: string;
    title: string;
    type: 'action';
    /** 라벨(행 본문) 클릭 */
    onClick?: () => void;
    /** 행 오른쪽 아이콘 버튼. 생략 시 아이콘 없음 */
    iconButton?: {
        /** MUI Icons 이름 (기본 Add) */
        icon?: string;
        onClick?: () => void;
    };
}

export interface MenuGroup extends BaseMenuItem {
    type: 'group';
    children: MenuItem[];
}

export interface MenuItemLeaf extends BaseMenuItem {
    type: 'item';
    pageId: string;
    path?: string; // 기본값: pages.ts의 path 사용, 변경 필요 시에만 명시
    /**
     * 4뎁스 등 메뉴에는 노출하지 않지만 라우트는 등록할 하위 페이지.
     * 메뉴 트리에는 표시되지 않고, URL로 직접 접근해 화면 확인 가능.
     */
    children?: MenuItemLeaf[];
}

export type MenuItem = MenuGroup | MenuItemLeaf | MenuAction;

// =========================================================================
// 메뉴 데이터
// =========================================================================

/**
 * 메인 메뉴 구조
 * 
 * pages.ts의 페이지 정보를 참조하여 메뉴를 구성합니다 (`item`).
 * `action` 항목은 pages.ts·라우트와 무관합니다.
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
                id: 'project.add',
                title: '프로젝트 추가',
                type: 'action',
                iconButton: { icon: 'AddCircleOutline' },
            },
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
                        children: [
                            {
                                id: 'project1.agent.agentbuilder',
                                title: '에이전트 이름',
                                type: 'item',
                                pageId: 'project.agent.agentbuilder',
                                path: '/project/project1/agent/agentbuilder',
                            },
                        ],
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
                        children: [
                            {
                                id: 'project1.knowledgebase.document',
                                title: '문서',
                                type: 'item',
                                pageId: 'project.knowledgebase.document',
                                path: '/project/project1/knowledgebase/document',
                            },
                        ],
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
                        children: [
                            {
                                id: 'project2.agent.agentbuilder',
                                title: '에이전트 이름',
                                type: 'item',
                                pageId: 'project.agent.agentbuilder',
                                path: '/project/project2/agent/agentbuilder',
                            },
                        ],
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
                        children: [
                            {
                                id: 'project2.knowledgebase.document',
                                title: '문서',
                                type: 'item',
                                pageId: 'project.knowledgebase.document',
                                path: '/project/project2/knowledgebase/document',
                            },
                        ],
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
