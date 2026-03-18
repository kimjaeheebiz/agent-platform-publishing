/**
 * spacing 토큰 역매핑 유틸리티
 * px 값 → spacing 토큰 이름 변환 담당
 */

import * as fs from 'fs';
import * as path from 'path';

// spacing 토큰 JSON 파일 경로
const SPACING_TOKEN_PATH = 'design-system/tokens/generated/spacing/Mode 1.json';

// px → 토큰 이름 맵 캐시
let pxToTokenCache: Record<number, string> | null = null;

/**
 * spacing 토큰 JSON 로드 및 px → 토큰 맵 생성 함수
 */
function loadSpacingTokenMap(): Record<number, string> {
    if (pxToTokenCache) return pxToTokenCache;

    const filePath = path.resolve(process.cwd(), SPACING_TOKEN_PATH);
    try {
        if (!fs.existsSync(filePath)) {
            return (pxToTokenCache = {});
        }
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<
            string,
            { $value?: number }
        >;
        const map: Record<number, string> = {};
        for (const [tokenName, entry] of Object.entries(data)) {
            if (entry?.$value != null && typeof entry.$value === 'number') {
                // "0,5" → "0.5" 정규화 처리
                map[entry.$value] = tokenName.replace(',', '.');
            }
        }
        pxToTokenCache = map;
        return map;
    } catch {
        return (pxToTokenCache = {});
    }
}

/**
 * px 값 → spacing 토큰 이름 조회 함수
 * 매핑이 없으면 null 반환
 */
export function getSpacingTokenFromPx(px: number): string | null {
    const map = loadSpacingTokenMap();
    const token = map[px];
    return token ?? null;
}

let tokenNameToPxCache: Record<string, number> | null = null;

/** spacing 토큰 이름("2", "0,5" 등) → px. 없으면 null */
export function getSpacingPxFromTokenName(tokenName: string): number | null {
    if (tokenNameToPxCache) {
        const hit = tokenNameToPxCache[tokenName.trim()] ?? tokenNameToPxCache[tokenName.trim().replace('.', ',')];
        return hit ?? null;
    }
    const filePath = path.resolve(process.cwd(), SPACING_TOKEN_PATH);
    tokenNameToPxCache = {};
    try {
        if (!fs.existsSync(filePath)) return null;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, { $value?: number }>;
        for (const [key, entry] of Object.entries(data)) {
            if (entry?.$value != null && typeof entry.$value === 'number') {
                tokenNameToPxCache[key] = entry.$value;
                tokenNameToPxCache[key.replace(',', '.')] = entry.$value;
            }
        }
    } catch {
        tokenNameToPxCache = {};
    }
    return tokenNameToPxCache[tokenName.trim()] ?? tokenNameToPxCache[tokenName.trim().replace('.', ',')] ?? null;
}
