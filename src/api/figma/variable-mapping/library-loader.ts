/**
 * 라이브러리 파일에서 Variable ID 매핑 로드
 * design-system/tokens/generated/$themes.json에서 Variable ID 추출
 */

import { VariableMappingInfo } from './types';
import { formatMuiPath, determineVariableType } from './theme-mapper';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 라이브러리 Variable ID 매핑 로드
 * design-system/tokens/generated/$themes.json 경로 사용 (process.cwd() 기준)
 */
export function loadLibraryVariableMappings(): Map<string, VariableMappingInfo> {
    const mappings = new Map<string, VariableMappingInfo>();
    const themesPath = path.resolve(process.cwd(), 'design-system/tokens/generated/$themes.json');

    try {
        if (!fs.existsSync(themesPath)) {
            console.warn(`⚠️ $themes.json 없음: ${themesPath}\n   → 테마 컬러/스페이싱이 HEX·px로 나옵니다. design-system 빌드 후 재시도하세요.`);
            return mappings;
        }

        const themesData = JSON.parse(fs.readFileSync(themesPath, 'utf8'));
        if (!Array.isArray(themesData)) {
            console.warn('⚠️ $themes.json 형식 오류: 배열이 아닙니다.');
            return mappings;
        }

        let paletteCount = 0;
        for (const theme of themesData) {
            if (theme.$figmaVariableReferences) {
                for (const [tokenPath, variableId] of Object.entries(theme.$figmaVariableReferences)) {
                    const mappingInfo: VariableMappingInfo = {
                        variableId: variableId as string,
                        variableName: tokenPath,
                        muiThemePath: tokenPath,
                        type: determineVariableType(tokenPath),
                    };
                    mappings.set(variableId as string, mappingInfo);
                    if (theme.group === 'palette') paletteCount += 1;
                }
            }
        }

        console.log(`✅ 변수 매핑 로드: ${themesPath}`);
        console.log(`   → 총 ${mappings.size}개 (palette ${paletteCount}개). 플랫폼 파일이 동일 변수 컬렉션을 사용해야 테마 컬러가 반영됩니다.`);
    } catch (error) {
        console.warn('⚠️ 라이브러리 변수 매핑 로드 실패:', error);
    }

    return mappings;
}

