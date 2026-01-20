import { ComponentDesignConfig } from './types';

/**
 * 레이아웃 타입 정의
 */
export type LayoutType = 'default' | 'auth' | 'error';

/**
 * 페이지 콘텐츠 설정 (레이아웃과 분리된 페이지 콘텐츠만)
 */
export interface PageContentConfig {
    pageId: string; // pages.ts의 id
    components: ComponentDesignConfig[];
}

/**
 * 레이아웃별 페이지 템플릿 시스템
 * 기존 레이아웃 시스템과 통합하여 페이지 콘텐츠만 생성
 */
export class PageTemplateManager {
    /**
     * 레이아웃별 페이지 콘텐츠 템플릿 생성
     * @param layoutType 레이아웃 타입
     * @param pageId pages.ts의 id
     * @returns 페이지 콘텐츠 설정
     */
    static getLayoutAwareTemplate(layoutType: LayoutType, pageId: string): PageContentConfig {
        switch (layoutType) {
            case 'default':
                return this.getDefaultLayoutContentTemplate(pageId);
            case 'auth':
                return this.getAuthLayoutContentTemplate(pageId);
            case 'error':
                return this.getErrorLayoutContentTemplate(pageId);
            default:
                return this.getDefaultLayoutContentTemplate(pageId);
        }
    }

    /**
     * DefaultLayout용 페이지 콘텐츠 템플릿
     * Header + Sidebar + Main Content 구조에 맞춤
     */
    static getDefaultLayoutContentTemplate(pageId: string): PageContentConfig {
        return {
            pageId,
            components: [],
        };
    }

    /**
     * AuthLayout용 페이지 콘텐츠 템플릿
     * 중앙 정렬된 폼 구조에 맞춤
     */
    static getAuthLayoutContentTemplate(pageId: string): PageContentConfig {
        return {
            pageId,
            components: [],
        };
    }

    /**
     * ErrorLayout용 페이지 콘텐츠 템플릿
     * 에러 페이지 구조에 맞춤
     */
    static getErrorLayoutContentTemplate(pageId: string): PageContentConfig {
        return {
            pageId,
            components: [],
        };
    }

    /**
     * 기존 페이지 설정과 통합
     * @param pageConfig 기존 페이지 설정 (pages.ts에서)
     * @param figmaContent Figma에서 추출된 콘텐츠
     * @returns 통합된 페이지 콘텐츠 설정
     */
    static integrateWithExistingPage(
        pageConfig: { id: string; title: string; layout?: LayoutType },
        figmaContent: PageContentConfig,
    ): PageContentConfig {
        return {
            ...figmaContent,
            pageId: pageConfig.id,
        };
    }

    /**
     * 레이아웃별 특수 템플릿 생성
     * @param layoutType 레이아웃 타입
     * @param templateType 특수 템플릿 타입
     * @param pageId pages.ts의 id
     * @returns 특수 템플릿 설정
     */
    static getSpecializedTemplate(
        layoutType: LayoutType,
        templateType: 'dashboard' | 'form' | 'list' | 'detail',
        pageId: string,
    ): PageContentConfig {
        return this.getLayoutAwareTemplate(layoutType, pageId);
    }
}
