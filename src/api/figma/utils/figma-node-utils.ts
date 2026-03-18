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

/** Figma 자식/하위 노드 이름(또는 패턴)으로 첫 번째 노드 반환 */
export function findDescendantByName(
    node: FigmaNode | undefined,
    childNamePattern: string | RegExp
): FigmaNode | null {
    const nameMatch = (name: string) =>
        typeof childNamePattern === 'string'
            ? name === childNamePattern || name.includes(childNamePattern)
            : childNamePattern.test(name);

    function search(current: any): FigmaNode | null {
        const children = current?.children || [];
        for (const child of children) {
            if (nameMatch(String((child as any).name ?? ''))) {
                return child as FigmaNode;
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
    const normalize = (s: string) => s.split('#')[0].trim().toLowerCase();
    const entry = Object.entries(props).find(([k]) => normalize(k) === normalize(keyLower));
    if (!entry) return undefined;
    const v = entry[1];
    return v != null && typeof v === 'object' && 'value' in v ? (v as { value: unknown }).value : v;
}

/** Figma 노드 이름에서 꺾쇠/공백 제거 */
export function normalizeFigmaNodeName(name: unknown): string {
    return String(name ?? '').replace(/<|>/g, '').trim();
}

/** MUI 아이콘처럼 보이는 Figma 인스턴스 이름인지 판단 */
export function isLikelyMuiIconName(name: string): boolean {
    return (
        name.includes('Icon') ||
        name.includes('Sharp') ||
        name.includes('Filled') ||
        name.includes('Outlined') ||
        name.includes('Rounded') ||
        name.includes('TwoTone') ||
        /^[A-Z][A-Za-z0-9]+$/.test(name)
    );
}

/** visible !== false 인 첫 번째 아이콘형 자식 노드 반환 */
export function findFirstIconLikeChild(children: any[]): any | undefined {
    return (children || []).find((child: any) => {
        if (!child || child.visible === false) return false;
        const childName = normalizeFigmaNodeName(child.name);
        return Boolean(child.componentId) || (childName && childName !== 'Value' && childName !== 'Label' && childName !== 'Chip' && isLikelyMuiIconName(childName));
    });
}

/** 현재 노드 이하에서 첫 번째 아이콘형 노드를 재귀적으로 탐색 */
export function findFirstIconLikeDescendant(node: any): any | undefined {
    if (!node) return undefined;
    const direct = findFirstIconLikeChild(node.children || []);
    if (direct) return direct;
    for (const child of node.children || []) {
        if (!child || child.visible === false) continue;
        const found = findFirstIconLikeDescendant(child);
        if (found) return found;
    }
    return undefined;
}

/** Figma componentProperties에서 boolean 프로퍼티 값 추출 (키는 "Value?#123" 형태 지원) */
export function getFigmaBooleanProp(node: any, ...keys: string[]): boolean | undefined {
    const props = node?.componentProperties || {};
    const normalize = (s: string) => s.split('#')[0].trim().toLowerCase().replace(/\?/g, '');
    for (const key of keys) {
        const keyNorm = normalize(key);
        for (const [k, v] of Object.entries(props)) {
            if (normalize(k) === keyNorm) {
                const raw = v as any;
                const val = raw?.value ?? raw;
                const isBooleanLike =
                    raw?.type === 'BOOLEAN' ||
                    typeof val === 'boolean' ||
                    val === 'true' ||
                    val === 'True' ||
                    val === 'false' ||
                    val === 'False';
                if (!isBooleanLike) continue;
                return val === true || val === 'true' || val === 'True';
            }
        }
    }
    return undefined;
}
