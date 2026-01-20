/**
 * 페이지 설정
 * 
 * 모든 페이지 정보를 단일 소스로 관리합니다.
 * - 메뉴에 표시되는 페이지
 * - 숨김 페이지 (로그인, 회원가입, 4뎁스 페이지 등)
 * 
 * 메뉴 구조는 `mainmenu.ts`에서 관리하며, `pageId`로 이 파일의 페이지 정보를 참조합니다.
 * 
 * 피그마 연동:
 * - 모든 페이지는 피그마와 연동하여 자동으로 페이지 소스를 생성합니다.
 * - 페이지 추가/수정 시 이 파일에 페이지 정보를 추가하세요.
 */

// =========================================================================
// 타입 정의
// =========================================================================

/**
 * 페이지 메타데이터
 */
export interface PageMetadata {
    showPageHeader?: boolean; // 페이지 헤더 표시 여부 (기본: true)
    layout?: 'default' | 'auth' | 'error'; // 레이아웃 타입 (기본: default)
    showBackButton?: boolean; // 뒤로가기 버튼 표시 여부 (4뎁스 페이지용)
    breadcrumbs?: boolean; // Breadcrumb 표시 여부 (기본: true)
}

/**
 * 페이지 설정 (모든 페이지 통합)
 * 
 * - path: 페이지 경로 (정적 또는 동적 라우트 모두 지원)
 * - 메뉴 노출 여부는 mainmenu.ts에서 pageId 존재 여부로 결정
 */
export interface PageConfig extends PageMetadata {
    id: string;
    title: string;
    path: string; // 페이지 경로 (정적: /admin/users, 동적: /project/:projectId/agent)
}

// =========================================================================
// 페이지 데이터
// =========================================================================

/**
 * 모든 페이지 설정 (단일 소스)
 * 
 * 피그마에서 페이지를 생성할 때 이 파일에 페이지 정보를 추가합니다.
 * 메뉴는 mainmenu.ts에서 이 페이지 정보를 참조하여 구성됩니다.
 */
export const PAGES: Record<string, PageConfig> = {
    // =====================================================================
    // 기본 페이지
    // =====================================================================
    'home': {
        id: 'home',
        title: '홈',
        path: '/',
        showPageHeader: false,
    },
    'project.agent': {
        id: 'project.agent',
        title: '에이전트',
        path: '/project/agent',
    },
    'project.credential': {
        id: 'project.credential',
        title: 'CREDENTIAL',
        path: '/project/credential',
    },
    'project.knowledgebase': {
        id: 'project.knowledgebase',
        title: '지식베이스',
        path: '/project/knowledgebase',
    },
    'project.apikey': {
        id: 'project.apikey',
        title: 'API 키',
        path: '/project/apikey',
    },
    'project.member': {
        id: 'project.member',
        title: '구성원',
        path: '/project/member',
    },
    
    // 4뎁스 페이지: 지식베이스 문서 (메뉴에 표시하지 않음, 페이지 제목에 뒤로가기 버튼만 노출)
    'project.knowledgebase.document': {
        id: 'project.knowledgebase.document',
        title: '문서',
        path: '/project/knowledgebase/:documentId',
        showBackButton: true,
    },

    'admin.project': {
        id: 'admin.project',
        title: '프로젝트',
        path: '/admin/project',
    },
    'admin.agent': {
        id: 'admin.agent',
        title: '에이전트',
        path: '/admin/agent',
    },
    'admin.users': {
        id: 'admin.users',
        title: '사용자',
        path: '/admin/users',
    },
    'admin.recycle': {
        id: 'admin.recycle',
        title: '휴지통',
        path: '/admin/recycle',
    },
    'users': {
        id: 'users',
        title: 'Users',
        path: '/users',
    },
    'guide': {
        id: 'guide',
        title: '컴포넌트 안내',
        path: '/guide',
    },
    'test': {
        id: 'test',
        title: 'Test',
        path: '/test',
    },
    'account': {
        id: 'account',
        title: '계정 정보',
        path: '/account',
    },

    // =====================================================================
    // 인증, 오류 페이지 (메뉴에 표시하지 않음)
    // =====================================================================
    'login': {
        id: 'login',
        title: '로그인',
        path: '/login',
        showPageHeader: false, // 기본값이 true이므로 false인 경우만 명시
        breadcrumbs: false, // 기본값이 true이므로 false인 경우만 명시
        layout: 'auth',
    },
    'signup': {
        id: 'signup',
        title: '계정 등록',
        path: '/signup',
        showPageHeader: false, // 기본값이 true이므로 false인 경우만 명시
        breadcrumbs: false, // 기본값이 true이므로 false인 경우만 명시
        layout: 'auth',
    },
    // Error 페이지 (명시적 경로)
    'error.404': {
        id: 'error.404',
        title: '404 Not Found',
        path: '/404',
        layout: 'error',
    },
    'error.500': {
        id: 'error.500',
        title: '500 Server Error',
        path: '/500',
        layout: 'error',
    },
};

// =========================================================================
// 헬퍼 함수
// =========================================================================

/**
 * ID로 페이지 설정 찾기
 */
export const findPageById = (id: string): PageConfig | null => {
    const page = PAGES[id];
    if (!page) return null;

    return page;
};
