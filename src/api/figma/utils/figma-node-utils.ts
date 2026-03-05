import type { FigmaNode } from '../types';

/** 컴포넌트 매핑 공통 유틸: 노드 텍스트 추출, boolean/값 프로퍼티 추출 */
/** 자식 노드 배열에서 재귀적으로 텍스트(characters) 추출 */
export function findTextRecursively(nodes: any[]): string | null {
    for (const node of nodes) {
        if (node?.characters) return node.characters;
        if (node?.children?.length) {
            const t = findTextRecursively(node.children);
            if (t) return t;
        }
    }
    return null;
}

/** Figma 자식 노드 이름(또는 패턴)으로 텍스트 추출 */
export function findTextInChildByName(
    node: FigmaNode,
    childNamePattern: string | RegExp
): string | null {
    const nameMatch = (name: string) =>
        typeof childNamePattern === 'string'
            ? name === childNamePattern || name.includes(childNamePattern)
            : childNamePattern.test(name);

    function search(n: any): string | null {
        const children = n?.children || [];
        for (const child of children) {
            if (nameMatch(String((child as any).name ?? ''))) {
                const text = findTextRecursively([child]);
                if (text) return text;
            }
            const found = search(child);
            if (found) return found;
        }
        return null;
    }
    return search(node as any);
}

/** componentProperties에서 값 추출 (value 필드 또는 원시값, 키는 대소문자 무시) */
export function getPropValue(props: Record<string, unknown>, keyLower: string): unknown {
    const entry = Object.entries(props).find(([k]) => k.toLowerCase() === keyLower);
    if (!entry) return undefined;
    const v = entry[1];
    return v != null && typeof v === 'object' && 'value' in v ? (v as { value: unknown }).value : v;
}

/** Figma componentProperties에서 boolean 프로퍼티 값 추출 (키는 "Value?#123" 형태 지원) */
export function getFigmaBooleanProp(node: any, ...keys: string[]): boolean | undefined {
    const props = node?.componentProperties || {};
    const normalize = (s: string) => s.split('#')[0].trim().toLowerCase().replace(/\?/g, '');
    for (const key of keys) {
        const keyNorm = normalize(key);
        for (const [k, v] of Object.entries(props)) {
            if (normalize(k) === keyNorm) {
                const val = (v as any)?.value ?? v;
                return val === true || val === 'true' || val === 'True';
            }
        }
    }
    return undefined;
}
