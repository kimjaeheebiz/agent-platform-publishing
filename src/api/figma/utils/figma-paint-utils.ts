/**
 * 피그마 Paint(Fill/Stroke) 공통 유틸
 * extractor, index 등에서 단일 구현 공유
 */

export interface FigmaColorLike {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/** SOLID fill/stroke의 color → hex 또는 rgba 문자열 */
export function extractColorFromFill(fill: { type: string; color?: FigmaColorLike }): string {
    if (fill.type !== 'SOLID' || !fill.color) {
        return '#000000';
    }
    const { r, g, b, a = 1 } = fill.color;
    const red = Math.round(r * 255);
    const green = Math.round(g * 255);
    const blue = Math.round(b * 255);
    if (a < 1) {
        return `rgba(${red}, ${green}, ${blue}, ${a})`;
    }
    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
}

/** SOLID color → 8자리 HEX (RRGGBBAA), 테마/스타일 해석 없음 */
export function rgbaToHex(color: FigmaColorLike): string {
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = Math.round((color.a ?? 1) * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`;
}
