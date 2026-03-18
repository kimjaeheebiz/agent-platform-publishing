/**
 * 변수 매핑 관리 (캐시 + API)
 * + spacing 토큰 유틸 엔트리 포인트
 */

import { VariableMappingInfo } from './types';
import { FigmaVariableFetcher } from './variable-fetcher';
import { formatMuiPath, determineVariableType } from './theme-mapper';
import { loadLibraryVariableMappings } from './library-loader';
export { getSpacingTokenFromPx, getSpacingPxFromTokenName } from './spacing-resolver';

/**
 * 변수 매핑 매니저
 * 변수 ID → 토큰 경로 매핑은 design-system/tokens/generated/$themes.json 의
 * $figmaVariableReferences 만 사용. 별도 플랫폼 매핑 파일 없음.
 */
export class VariableMappingManager {
    private cache = new Map<string, VariableMappingInfo>();
    private fetcher: FigmaVariableFetcher;
    
    constructor(token: string) {
        this.fetcher = new FigmaVariableFetcher(token);
        this.loadLibraryMappings();
    }

    /**
     * $themes.json ($figmaVariableReferences) 에서 Variable ID 매핑 로드
     */
    private loadLibraryMappings(): void {
        const mappings = loadLibraryVariableMappings();
        for (const [id, info] of mappings.entries()) {
            const hash = this.normalizeVariableId(id);
            this.cache.set(hash, info);
        }
    }

    /**
     * Variable ID로 매핑 정보 가져오기 (캐시 우선)
     */
    async getMapping(variableId: string): Promise<VariableMappingInfo | null> {
        const hash = this.normalizeVariableId(variableId);
        if (this.cache.has(hash)) {
            const mapping = this.cache.get(hash)!;
            console.log(`✅ 변수 ID 매핑: ${hash} → ${mapping.muiThemePath}`);
            return mapping;
        }
        const mapping = await this.fetcher.fetchVariableById(variableId);
        if (mapping) {
            this.cache.set(hash, mapping);
            return mapping;
        }
        console.warn(
            `⚠️ 변수 ID 매핑 없음 (테마 대신 HEX 적용): rawId="${variableId}" → normalizedHash="${hash}"\n` +
            `   → $themes.json에 위 hash가 있는지 확인하세요. 플랫폼 Figma 파일이 라이브러리와 동일한 변수 컬렉션을 사용해야 합니다.`
        );
        return null;
    }

    /**
     * API/export 공통: Variable ID 정규화
     * VariableID:hash/nodeId → hash  /  hash/nodeId → hash  /  hash → hash
     */
    private normalizeVariableId(variableId: string): string {
        const withoutPrefix = variableId.replace(/^VariableID:/i, '').trim();
        const hash = withoutPrefix.includes('/') ? withoutPrefix.split('/')[0].trim() : withoutPrefix;
        return hash || variableId;
    }

    /**
     * 파일의 모든 변수 매핑 로드 (borderRadius 등 dimension 토큰 조회용)
     * GET /v1/files/:file_key/variables 로 파일 변수 로드 후 캐시에 병합
     */
    async loadFileMappings(fileKey: string, fileType: 'library' | 'platform'): Promise<void> {
        console.log(`📥 ${fileType} 파일 변수 매핑 로드: ${fileKey}`);
        try {
            const fileVars = await this.fetcher.fetchFileVariables(fileKey);
            for (const [id, info] of fileVars.entries()) {
                const hash = this.normalizeVariableId(id);
                this.cache.set(hash, info);
                this.cache.set(id, info);
            }
            if (fileVars.size > 0) {
                console.log(`✅ 파일 변수 ${fileVars.size}개 캐시 병합`);
            }
        } catch (e) {
            console.warn(`⚠️ 파일 변수 로드 실패: ${fileKey}`, e);
        }
    }

    /**
     * MUI 테마 경로 직접 추출 (간단한 변수명 기반)
     */
    extractMuiPathFromVariableId(variableId: string, variableName?: string): string | null {
        if (!variableName) {
            return null;
        }
        
        const type = determineVariableType(variableName);
        return formatMuiPath(variableName, type);
    }
}

