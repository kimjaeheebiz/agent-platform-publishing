/**
 * Figma API 내 공통 문자열 변환 (이름·식별자)
 */

/** kebab-case (컴포넌트/파일명용) */
export function toKebabCase(str: string): string {
    return str
        .split(/[\s\-_]+/)
        .map((word) => word.toLowerCase())
        .join('-');
}

/** PascalCase (컴포넌트명용), 꺾쇠·한글 등 제거 후 변환 */
export function toPascalCase(str: string): string {
    return str
        .replace(/[<>]/g, '')
        .replace(/[^a-zA-Z0-9\s\-_]/g, '')
        .split(/[\s\-_]+/)
        .filter((word) => word.length > 0)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
