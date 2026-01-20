import {
    FigmaFileResponse,
    FigmaNodesResponse,
    FigmaImagesResponse,
    FigmaFileVersionsResponse,
    FigmaFileComponentsResponse,
    FigmaFileStylesResponse,
    FigmaFileVariablesResponse,
    FigmaPagesResponse,
    FigmaPageInfo,
    FigmaVariable,
} from './types';
import {
    FigmaAPIError,
    FigmaTokenError,
    FigmaFileNotFoundError,
    FigmaNodeNotFoundError,
    FigmaRateLimitError,
    FigmaNetworkError,
    handleFigmaError,
    retryWithBackoff,
} from './errors';

export class FigmaAPIClient {
    private token: string;
    private baseURL = 'https://api.figma.com/v1';

    constructor(token: string) {
        if (!token || token.trim() === '') {
            throw new FigmaTokenError('Figma token is required');
        }
        this.token = token;
    }

    /**
     * 피그마 파일 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 피그마 파일 데이터
     */
    async getFile(fileKey: string): Promise<FigmaFileResponse> {
        return retryWithBackoff(async () => {
            try {
                const response = await fetch(`${this.baseURL}/files/${fileKey}`, {
                    headers: {
                        'X-Figma-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new FigmaFileNotFoundError(fileKey);
                    }
                    if (response.status === 429) {
                        throw new FigmaRateLimitError(fileKey);
                    }
                    if (response.status >= 500) {
                        throw new FigmaNetworkError(`Server error: ${response.status} ${response.statusText}`);
                    }
                    throw new FigmaAPIError(
                        `API Error: ${response.status} ${response.statusText}`,
                        fileKey,
                        response.status,
                    );
                }

                return await response.json();
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new FigmaNetworkError('Network request failed', error);
                }
                handleFigmaError(error, `getFile(${fileKey})`);
            }
        });
    }

    /**
     * 특정 노드들만 가져오기
     * @param fileKey 피그마 파일 키
     * @param nodeIds 노드 ID 배열
     * @returns 피그마 노드 데이터
     */
    async getFileNodes(fileKey: string, nodeIds: string[]): Promise<FigmaNodesResponse> {
        return retryWithBackoff(async () => {
            try {
                if (!nodeIds || nodeIds.length === 0) {
                    throw new FigmaAPIError('Node IDs array cannot be empty', fileKey);
                }

                const response = await fetch(`${this.baseURL}/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`, {
                    headers: {
                        'X-Figma-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new FigmaFileNotFoundError(fileKey);
                    }
                    if (response.status === 429) {
                        throw new FigmaRateLimitError(fileKey);
                    }
                    throw new FigmaAPIError(
                        `API Error: ${response.status} ${response.statusText}`,
                        fileKey,
                        response.status,
                    );
                }

                const data = await response.json();

                // 노드가 존재하지 않는 경우 확인
                const missingNodes = nodeIds.filter((id) => !data.nodes[id]);
                if (missingNodes.length > 0) {
                    throw new FigmaNodeNotFoundError(missingNodes[0], fileKey);
                }

                return data;
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new FigmaNetworkError('Network request failed', error);
                }
                handleFigmaError(error, `getFileNodes(${fileKey}, [${nodeIds.join(',')}])`);
            }
        });
    }

    /**
     * 노드 이미지 가져오기
     * @param fileKey 피그마 파일 키
     * @param nodeIds 노드 ID 배열
     * @param format 이미지 포맷 (PNG, JPG, SVG, PDF)
     * @param scale 이미지 스케일 (1, 2, 4)
     * @returns 이미지 URL 맵
     */
    async getNodeImages(
        fileKey: string,
        nodeIds: string[],
        format: 'PNG' | 'JPG' | 'SVG' | 'PDF' = 'PNG',
        scale: 1 | 2 | 4 = 1,
    ): Promise<FigmaImagesResponse> {
        try {
            const params = new URLSearchParams({
                ids: nodeIds.join(','),
                format,
                scale: scale.toString(),
            });

            const response = await fetch(`${this.baseURL}/images/${fileKey}?${params}`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('피그마 이미지 가져오기에 실패했습니다:', error);
            throw error;
        }
    }

    /**
     * 파일 버전 히스토리 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 버전 히스토리
     */
    async getFileVersions(fileKey: string): Promise<FigmaFileVersionsResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/versions`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('피그마 파일 버전 가져오기에 실패했습니다:', error);
            throw error;
        }
    }

    /**
     * 파일의 컴포넌트 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 컴포넌트 정보
     */
    async getFileComponents(fileKey: string): Promise<FigmaFileComponentsResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/components`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('피그마 컴포넌트 정보 가져오기에 실패했습니다:', error);
            throw error;
        }
    }

    /**
     * Dev Mode URL의 var-set-id를 API 형식으로 변환
     * @param uiId UI 표현 (예: "88-16598")
     * @returns API 형식 (예: "VariableCollectionId:88:16598")
     */
    private convertCollectionIdToApiFormat(uiId: string): string {
        // 이미 API 형식인 경우 그대로 반환
        if (uiId.startsWith('VariableCollectionId:')) {
            return uiId;
        }
        
        // UI 형식 (88-16598)을 API 형식 (VariableCollectionId:88:16598)으로 변환
        const apiId = uiId.replace(/-/g, ':');
        return `VariableCollectionId:${apiId}`;
    }

    /**
     * 변수 컬렉션 정보 가져오기
     * @param collectionId 변수 컬렉션 ID (UI 형식: "88-16598" 또는 API 형식: "VariableCollectionId:88:16598")
     * @returns 변수 컬렉션 정보
     */
    async getVariableCollection(collectionId: string): Promise<{
        id: string;
        name: string;
        modes: Array<{ modeId: string; name: string }>;
        defaultModeId: string;
        variableIds: string[];
    } | null> {
        try {
            // UI 형식을 API 형식으로 변환
            const apiCollectionId = this.convertCollectionIdToApiFormat(collectionId);
            const url = `https://api.figma.com/v1/variable_collections/${apiCollectionId}`;
            
            console.log(`🔍 변수 컬렉션 조회:`);
            console.log(`   UI ID: ${collectionId}`);
            console.log(`   API ID: ${apiCollectionId}`);
            console.log(`   URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`⚠️  변수 컬렉션 조회 실패 (${response.status}):`);
                console.warn(`   UI ID: ${collectionId}`);
                console.warn(`   API ID: ${apiCollectionId}`);
                console.warn(`   응답: ${errorText}`);
                
                if (response.status === 404) {
                    console.warn('💡 가능한 원인:');
                    console.warn('   1. Professional 요금제 제한 (Variables REST API는 Enterprise 필요)');
                    console.warn('   2. 컬렉션 ID 형식이 잘못됨 (URL의 var-set-id와 API ID가 다를 수 있음)');
                    console.warn('   3. 토큰 권한 부족 (file_variables:read 스코프 필요)');
                    console.warn('   4. 컬렉션이 다른 팀에 속해 있음');
                }
                return null;
            }

            const collection = await response.json();
            console.log(`✅ 변수 컬렉션 발견: ${collection.name || collectionId}`);
            return collection;
        } catch (error) {
            console.error('변수 컬렉션 정보 가져오기에 실패했습니다:', error);
            return null;
        }
    }

    /**
     * 변수 ID로 변수 정보 가져오기
     * @param variableId 변수 ID
     * @returns 변수 정보
     */
    async getVariable(variableId: string): Promise<FigmaVariable | null> {
        try {
            // Variable ID를 인코딩 없이 직접 사용
            const response = await fetch(`https://api.figma.com/v1/variables/${variableId}`, {
                method: 'GET',
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn(`⚠️  변수를 찾을 수 없습니다: ${variableId}`);
                    return null;
                }
                const errorText = await response.text();
                throw new Error(`Figma API Error: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`변수 정보 가져오기에 실패했습니다 (${variableId}):`, error);
            return null;
        }
    }

    /**
     * 변수 컬렉션 ID로 모든 변수 가져오기
     * @param collectionId 변수 컬렉션 ID (예: "88-16598")
     * @returns 변수 정보
     */
    async getVariablesByCollection(collectionId: string): Promise<FigmaFileVariablesResponse> {
        try {
            // 1. 컬렉션 정보 가져오기
            const collection = await this.getVariableCollection(collectionId);
            if (!collection) {
                return { meta: { variables: {} } };
            }

            console.log(`✅ 변수 컬렉션 발견: ${collection.name} (${collection.variableIds.length}개 변수)`);

            // 2. 각 변수 ID로 변수 정보 가져오기
            const variables: Record<string, FigmaVariable> = {};
            
            for (const variableId of collection.variableIds) {
                const variable = await this.getVariable(variableId);
                if (variable) {
                    variables[variableId] = variable;
                }
            }

            console.log(`✅ ${Object.keys(variables).length}개 변수 로드 완료`);
            return { meta: { variables } };
        } catch (error) {
            console.error('변수 컬렉션에서 변수 가져오기에 실패했습니다:', error);
            return { meta: { variables: {} } };
        }
    }

    /**
     * 파일의 변수 정보 가져오기
     * 
     * ⚠️ 중요: Figma Variables API는 파일 ID로 직접 조회할 수 없습니다.
     * - /v1/files/{fileKey}/variables 엔드포인트는 존재하지 않습니다 (404)
     * - 올바른 방법: Collection ID 기반 접근 또는 /v1/variables/local
     * - Professional 요금제에서는 Variables REST API가 제한될 수 있습니다.
     * 
     * @param fileKey 피그마 파일 키 (참고용, 실제로는 사용되지 않음)
     * @param collectionId 변수 컬렉션 ID (선택사항, 있으면 우선 사용)
     * @returns 변수 정보
     */
    async getFileVariables(fileKey: string, collectionId?: string): Promise<FigmaFileVariablesResponse> {
        // 방법 1: Collection ID가 제공되면 우선 사용
        if (collectionId) {
            console.log(`📡 변수 컬렉션 ID로 변수 가져오기: ${collectionId}`);
            return await this.getVariablesByCollection(collectionId);
        }

        // 방법 2: /v1/variables/local 엔드포인트 시도 (팀의 로컬 변수)
        try {
            const response = await fetch(`https://api.figma.com/v1/variables/local`, {
                method: 'GET',
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                // 응답 구조 변환 (필요시)
                if (data.meta && data.meta.variables) {
                    return { meta: { variables: data.meta.variables } };
                }
                return { meta: { variables: {} } };
            }

            // 404는 정상 (Professional 요금제 제한 또는 변수 없음)
            if (response.status === 404) {
                console.warn('⚠️  Variables API 404: /v1/variables/local 엔드포인트를 사용할 수 없습니다.');
                console.warn('💡 원인 가능성:');
                console.warn('   1. Professional 요금제 제한 (Enterprise 필요)');
                console.warn('   2. 팀에 변수 컬렉션이 없음');
                console.warn('   3. 토큰 권한 부족 (file_variables:read 스코프 필요)');
                console.warn('💡 해결책: 변수 컬렉션 ID를 사용하세요 (Dev Mode URL의 var-set-id 파라미터)');
                return { meta: { variables: {} } };
            }

            // 다른 오류
            const errorText = await response.text();
            console.warn(`⚠️  Variables API 오류 (${response.status}): ${errorText}`);
            return { meta: { variables: {} } };
        } catch (error) {
            console.error('⚠️  Variables API 호출 실패:', error instanceof Error ? error.message : String(error));
            return { meta: { variables: {} } };
        }
    }

    /**
     * 파일의 스타일 정보 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 스타일 정보
     */
    async getFileStyles(fileKey: string): Promise<FigmaFileStylesResponse> {
        try {
            const response = await fetch(`${this.baseURL}/files/${fileKey}/styles`, {
                headers: {
                    'X-Figma-Token': this.token,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Figma API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('피그마 스타일 정보 가져오기에 실패했습니다:', error);
            throw error;
        }
    }

    /**
     * 파일의 페이지 목록 가져오기
     * @param fileKey 피그마 파일 키
     * @returns 페이지 목록
     */
    async getFilePages(fileKey: string): Promise<FigmaPagesResponse> {
        return retryWithBackoff(async () => {
            try {
                const fileData = await this.getFile(fileKey);
                const pages: FigmaPageInfo[] = [];

                // document.children에서 페이지(CANVAS 타입) 추출
                if (fileData.document && fileData.document.children) {
                    for (const child of fileData.document.children) {
                        // Figma에서 페이지는 type이 "CANVAS"인 노드입니다.
                        if (child.type === 'CANVAS') {
                            pages.push({
                                id: child.id,
                                name: child.name,
                            });
                        }
                    }
                }

                return { pages };
            } catch (error) {
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new FigmaNetworkError('Network request failed', error);
                }
                handleFigmaError(error, `getFilePages(${fileKey})`);
                throw error; // TypeScript 타입 체크를 위한 명시적 throw
            }
        });
    }

}
