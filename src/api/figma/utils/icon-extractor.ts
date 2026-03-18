/**
 * Icon 추출 전역 유틸리티
 * 
 * 컴포넌트 간 공통으로 사용하는 Icon 추출 로직을 중앙화
 */

import { FigmaNode } from '../types';
import {
    findDescendantByName,
    findFirstIconLikeChild,
    findFirstIconLikeDescendant,
    getFigmaBooleanProp,
    getPropValue,
    isLikelyMuiIconName,
    normalizeFigmaNodeName,
} from './figma-node-utils';

export interface IconExtractionResult {
    startIconComponentId?: string;
    endIconComponentId?: string;
    startIconName?: string;
    endIconName?: string;
    actionIconComponentId?: string;
    actionIconName?: string;
}

/**
 * 컴포넌트 매핑에서 사용하는 형식 (기존 호환성 유지)
 */
export interface IconData {
    startIcon?: string;
    endIcon?: string;
    startIconComponentId?: string;
    endIconComponentId?: string;
    /** Figma Icon Size 프로퍼티: Small | Medium | Large | Inherit → MUI fontSize */
    startIconSize?: string;
    endIconSize?: string;
}

/**
 * 컴포넌트 properties에서 Icon 정보 추출
 * @param node Figma 노드
 * @param position 'start' | 'end' | 'action'
 * @returns Icon 추출 결과
 */
export function extractIconFromProperties(
    node: FigmaNode,
    position: 'start' | 'end' | 'action' = 'start'
): { componentId?: string; iconName?: string } {
    const iconProps = (node as any).componentProperties || {};
    const result: { componentId?: string; iconName?: string } = {};

    for (const [key, propData] of Object.entries(iconProps)) {
        const prop = propData as any;
        if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
            const iconComponentId = prop.value;
            
            // position에 따라 매칭
            if (position === 'start' && key.toLowerCase().includes('start')) {
                result.componentId = iconComponentId;
            } else if (position === 'end' && key.toLowerCase().includes('end')) {
                result.componentId = iconComponentId;
            } else if (position === 'action' && (key.toLowerCase().includes('icon') || key.includes('#'))) {
                result.componentId = iconComponentId;
            }
        }
    }

    return result;
}

/**
 * 노드의 자식에서 Icon 인스턴스 찾기
 * @param node Figma 노드
 * @returns Icon 인스턴스 정보
 */
export function extractIconFromChildren(node: FigmaNode): { componentId?: string; iconName?: string } {
    const result: { componentId?: string; iconName?: string } = {};

    if (node.children) {
        const iconChild = node.children.find((child: any) => 
            child.type === 'INSTANCE' && 
            (child.name.includes('Icon') || child.name.toLowerCase().includes('icon'))
        );

        if (iconChild && (iconChild as any).componentId) {
            result.componentId = (iconChild as any).componentId;
            const iconName = (iconChild as any).name?.replace(/<|>/g, '');
            if (iconName && iconName !== 'Icon') {
                result.iconName = iconName;
            }
        }
    }

    return result;
}

/**
 * Figma API를 통해 아이콘 이름 조회
 * @param iconComponentId 아이콘 컴포넌트 ID
 * @param extractor FigmaDesignExtractor 인스턴스
 * @returns 아이콘 이름
 */
export async function fetchIconName(
    iconComponentId: string,
    extractor: any
): Promise<string | undefined> {
    if (!extractor) {
        console.warn(`⚠️ extractor를 찾을 수 없음: ${iconComponentId}`);
        return undefined;
    }

    try {
        const isUsableIconName = (name: string | undefined) =>
            Boolean(name) && !String(name).includes('=') && normalizeFigmaNodeName(name) !== 'Icon';

        // 1. 페이지 파싱 시 채워둔 아이콘 캐시 사용 (API 호출 감소)
        const cached = (extractor as any).iconNodeNameCache?.get(iconComponentId);
        if (isUsableIconName(cached)) return cached;

        // 2. extractor의 componentInfo에서 먼저 조회
        if ((extractor as any).componentInfo && (extractor as any).componentInfo.has(iconComponentId)) {
            const componentInfo = (extractor as any).componentInfo.get(iconComponentId);
            const iconName = componentInfo?.name || componentInfo?.description || componentInfo?.key;
            if (isUsableIconName(iconName)) {
                return iconName;
            }
        }

        // 3. Figma API로 조회
        const fileKey = (extractor as any).fileKey || (extractor as any)._fileKey;
        if (!fileKey || !(extractor as any).client) {
            return undefined;
        }

        const iconNodesResponse = await (extractor as any).client.getFileNodes(
            fileKey,
            [iconComponentId]
        );

        if (iconNodesResponse.nodes && iconNodesResponse.nodes[iconComponentId]) {
            const iconNode = iconNodesResponse.nodes[iconComponentId].document;
            let iconName = iconNode.name;

            // 이름이 properties 형태이면 실제 아이콘 이름 추출
            if (iconName.includes('Size=') || iconName.includes('Type=') || iconName.includes('=')) {
                // children에서 실제 아이콘 찾기
                if (iconNode.children && iconNode.children.length > 0) {
                    // 먼저 VECTOR 또는 GROUP 타입의 아이콘 찾기
                    let childIcon = iconNode.children.find((child: any) => 
                        child.type === 'VECTOR' || child.type === 'GROUP'
                    );
                    
                    // 없으면 'Icon'이 포함된 이름 찾기
                    if (!childIcon) {
                        childIcon = iconNode.children.find((child: any) => 
                            child.name.includes('Icon')
                        );
                    }
                    
                    // 없으면 '='가 포함되지 않은 이름 찾기
                    if (!childIcon) {
                        childIcon = iconNode.children.find((child: any) => 
                            !child.name.includes('=')
                        );
                    }
                    
                    // 없으면 첫 번째 자식 사용
                    if (!childIcon && iconNode.children.length > 0) {
                        childIcon = iconNode.children[0];
                    }
                    
                    if (childIcon) {
                        iconName = childIcon.name;
                    }
                }
            }

            return iconName;
        }
    } catch (error) {
        // 아이콘 정보 조회 실패 (무음)
    }

    return undefined;
}

/**
 * Figma API를 통해 여러 아이콘 이름 일괄 조회
 * @param iconComponentIds 아이콘 컴포넌트 ID 배열
 * @param extractor FigmaDesignExtractor 인스턴스
 * @returns 아이콘 ID → 이름 매핑
 */
export async function fetchIconNames(
    iconComponentIds: string[],
    extractor: any
): Promise<Map<string, string>> {
    const iconNamesMap = new Map<string, string>();
    
    if (!extractor || iconComponentIds.length === 0) {
        return iconNamesMap;
    }

    try {
        const cache = (extractor as any).iconNodeNameCache as Map<string, string> | undefined;
        const missingIds = cache
            ? iconComponentIds.filter((id) => {
                  const name = cache.get(id);
                  if (name) {
                      iconNamesMap.set(id, name);
                      return false;
                  }
                  return true;
              })
            : [...iconComponentIds];
        if (missingIds.length === 0) return iconNamesMap;

        const fileKey = (extractor as any).fileKey || (extractor as any)._fileKey;
        if (!fileKey || !(extractor as any).client) {
            console.warn(`⚠️ fileKey 또는 client 정보가 없습니다.`);
            return iconNamesMap;
        }

        const iconNodesResponse = await (extractor as any).client.getFileNodes(
            fileKey,
            missingIds
        );

        if (iconNodesResponse.nodes) {
            for (const [nodeId, nodeData] of Object.entries(iconNodesResponse.nodes)) {
                const iconNode = (nodeData as any).document;
                let iconName = iconNode.name;

                // 이름이 properties 형태이면 실제 아이콘 이름 추출
                if (iconName.includes('Size=') || iconName.includes('Type=') || iconName.includes('=')) {
                    // children에서 실제 아이콘 찾기
                    if (iconNode.children && iconNode.children.length > 0) {
                        // 먼저 VECTOR 또는 GROUP 타입의 아이콘 찾기
                        let childIcon = iconNode.children.find((child: any) => 
                            child.type === 'VECTOR' || child.type === 'GROUP'
                        );
                        
                        // 없으면 'Icon'이 포함된 이름 찾기
                        if (!childIcon) {
                            childIcon = iconNode.children.find((child: any) => 
                                child.name.includes('Icon')
                            );
                        }
                        
                        // 없으면 '='가 포함되지 않은 이름 찾기
                        if (!childIcon) {
                            childIcon = iconNode.children.find((child: any) => 
                                !child.name.includes('=')
                            );
                        }
                        
                        // 없으면 첫 번째 자식 사용
                        if (!childIcon && iconNode.children.length > 0) {
                            childIcon = iconNode.children[0];
                        }
                        
                        if (childIcon) {
                            iconName = childIcon.name;
                        }
                    }
                }

                iconNamesMap.set(nodeId, iconName);
            }
        }
    } catch (error) {
        // 아이콘 노드 조회 실패 (무음)
    }

    return iconNamesMap;
}

/**
 * Adorn Start/End 컨테이너에서 아이콘 추출 (TextField, Select 등 input 계열 공통)
 * Figma 구조: 컴포넌트 → … → Adorn. Start Container / Adorn. End Container → Icon INSTANCE
 */
export async function extractAdornIconsFromNode(
    node: FigmaNode,
    extractor?: any
): Promise<IconData> {
    const result: IconData = {};

    // Figma 컴포넌트 프로퍼티에서 Adorn/Action Start/End 토글(BOOLEAN) 확인
    // - 예: "Adorn Start?", "Action_Start?", "Adorn Start? 123#id" 등
    // - 해당 토글이 false인 경우에는 해당 위치의 아이콘을 추출하지 않음
    const componentProps = (node as any).componentProperties || {};
    const isAdornEnabled = (position: 'start' | 'end'): boolean => {
        // Select/TextField에서 startAdornment/endAdornment는 "Adorn Start/End" 토글이 켜진 경우에만 생성.
        // "Action" 계열 토글(예: clear 버튼 등)은 start/end adornment로 취급하지 않는다.
        const enabled = getFigmaBooleanProp(
            node as any,
            `Adorn ${position}`,
            `Adorn ${position}?`,
            `Adorn. ${position}`,
            `Adorn. ${position}?`,
            `Adorn_${position}`,
            `Adorn_${position}?`,
        );
        return enabled === true;
    };

    const findAdornContainer = (root: any, namePart: string): any | undefined => {
        const children = root?.children || [];
        const target = namePart.toLowerCase();
        for (const c of children) {
            const name = String((c as any).name ?? '');
            if (
                name.includes('Adorn') &&
                name.toLowerCase().includes(target) &&
                // Figma에서 레이어를 숨긴 경우(visible === false)는 무시
                (c as any).visible !== false
            ) {
                return c;
            }
            const found = findAdornContainer(c, namePart);
            if (found) return found;
        }
        return undefined;
    };

    const findIconInNode = (n: any): string | undefined => {
        if (!n) return undefined;
        // Figma에서 숨김(visible=false) 처리된 슬롯은 아이콘으로 간주하지 않음
        if ((n as any).visible === false) return undefined;
        if (n.type === 'INSTANCE' && (n.componentId || (n.name && (n.name.includes('Icon') || n.name.includes('Filled'))))) {
            return n.componentId;
        }
        const children = n?.children || [];
        for (const ch of children) {
            if ((ch as any)?.visible === false) continue;
            const id = findIconInNode(ch);
            if (id) return id;
        }
        return undefined;
    };

    const startContainer = isAdornEnabled('start') ? findAdornContainer(node as any, 'Start') : undefined;
    const endContainer = isAdornEnabled('end') ? findAdornContainer(node as any, 'End') : undefined;
    if (startContainer) result.startIconComponentId = findIconInNode(startContainer);
    if (endContainer) result.endIconComponentId = findIconInNode(endContainer);

    if ((result.startIconComponentId || result.endIconComponentId) && extractor) {
        const ids = [result.startIconComponentId, result.endIconComponentId].filter(Boolean) as string[];
        const namesMap = await fetchIconNames(ids, extractor);
        if (result.startIconComponentId) result.startIcon = namesMap.get(result.startIconComponentId);
        if (result.endIconComponentId) result.endIcon = namesMap.get(result.endIconComponentId);
    }
    return result;
}

/**
 * Button용 Icon 추출 (기존 API와 호환)
 */
export async function extractIconsForButton(
    node: FigmaNode,
    extractor?: any
): Promise<IconData> {
    const result: IconData = {};
    
    // Component properties에서 아이콘 ID 추출
    const iconProps = (node as any).componentProperties || {};
    
    for (const [key, propData] of Object.entries(iconProps)) {
        const prop = propData as any;
        if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
            const iconComponentId = prop.value;
            if (key.toLowerCase().includes('start')) {
                result.startIconComponentId = iconComponentId;
            } else if (key.toLowerCase().includes('end')) {
                result.endIconComponentId = iconComponentId;
            }
        }
    }
    
    // 아이콘 이름 가져오기
    const iconIds = [result.startIconComponentId, result.endIconComponentId].filter(Boolean) as string[];
    if (iconIds.length > 0 && extractor) {
        const iconNamesMap = await fetchIconNames(iconIds, extractor);
        
        if (result.startIconComponentId) {
            result.startIcon = iconNamesMap.get(result.startIconComponentId) || result.startIcon;
        }
        if (result.endIconComponentId) {
            result.endIcon = iconNamesMap.get(result.endIconComponentId) || result.endIcon;
        }
    }
    
    return result;
}

/**
 * CardHeader용 Icon 추출
 */
export async function extractIconsForCardHeader(
    node: FigmaNode,
    extractor?: any
): Promise<IconExtractionResult> {
    const result: IconExtractionResult = {};

    // IconButton의 자식에서 Icon 찾기
    if (node.children) {
        const iconButton = node.children.find(child => 
            child.name === '<IconButton>' || child.name.toLowerCase().includes('iconbutton')
        );
        
        if (iconButton && iconButton.children) {
            
            const iconChild = iconButton.children.find((child: any) => 
                child.type === 'INSTANCE' && child.name.includes('Icon')
            );
            
            
            if (iconChild && (iconChild as any).componentId) {
                const iconComponentId = (iconChild as any).componentId;
                result.actionIconComponentId = iconComponentId;
                
                // 1. 먼저 인스턴스 자체의 이름 확인
                let iconName = (iconChild as any).name?.replace(/<|>/g, '');
                
                // 2. 이름이 빈 값이거나 'Icon'만 있으면 extractor의 componentInfo에서 조회
                if (!iconName || iconName === 'Icon') {
                    // componentInfo에서 조회 (가장 정확)
                    if ((extractor as any).componentInfo && (extractor as any).componentInfo.has(iconComponentId)) {
                        const componentInfo = (extractor as any).componentInfo.get(iconComponentId);
                        iconName = componentInfo?.name || componentInfo?.description || componentInfo?.key;
                    }
                    
                    // 여전히 없으면 fetchIconName으로 조회 (fallback)
                    if (!iconName || iconName === 'Icon') {
                        const fetchedName = await fetchIconName(iconComponentId, extractor);
                        if (fetchedName) {
                            iconName = fetchedName;
                        }
                    }
                }
                
                if (iconName && iconName !== 'Icon') {
                    result.actionIconName = iconName;
                }
            }
        }
    }

    return result;
}

/**
 * ToggleButton용 단일 아이콘 추출 (Figma: Icon/StarSharp 등 단일 슬롯 또는 자식 INSTANCE)
 */
export async function extractIconsForToggleButton(
    node: FigmaNode,
    extractor?: any
): Promise<IconData> {
    const result: IconData = {};
    const props = (node as any).componentProperties || {};
    let discoveredIconName: string | undefined;

    // 1) componentProperties에서 INSTANCE_SWAP인 속성 (키에 'icon' 포함 또는 아이콘형 이름)
    for (const [key, propData] of Object.entries(props)) {
        const prop = propData as any;
        if (prop && typeof prop === 'object' && prop.type === 'INSTANCE_SWAP') {
            const iconComponentId = prop.value;
            const keyLower = key.toLowerCase();
            if (keyLower.includes('icon') || keyLower.includes('sharp') || keyLower.includes('star')) {
                result.startIconComponentId = iconComponentId;
                break;
            }
        }
    }

    const firstIconChild = findFirstIconLikeChild(node.children || []) as any;
    if (firstIconChild) {
        const firstName = normalizeFigmaNodeName(firstIconChild.name);
        const firstComponentId = firstIconChild.componentId as string | undefined;
        if (firstName && firstName !== 'Icon') {
            discoveredIconName = firstName;
        }
        if (firstComponentId) {
            result.startIconComponentId = firstComponentId;
        }
    }

    const findNestedIconNode = (current: any): any | undefined => {
        if (!current || current.visible === false) return undefined;

        const name = normalizeFigmaNodeName(current.name);
        if ((current.componentId && name === 'Icon') || (name && name !== 'Icon' && isLikelyMuiIconName(name))) {
            return current;
        }

        const children = current.children || [];
        for (const child of children) {
            const found = findNestedIconNode(child);
            if (found) return found;
        }

        return undefined;
    };

    // 2) 없으면 하위 트리를 재귀 탐색해 아이콘 노드 이름/ID 찾기
    if (node.children && !result.startIconComponentId && !discoveredIconName) {
        const iconChild = findNestedIconNode(node);
        if (iconChild) {
            const rawName = normalizeFigmaNodeName((iconChild as any).name);
            if (rawName && rawName !== 'Icon') {
                discoveredIconName = rawName;
            }
            if (!result.startIconComponentId && (iconChild as any).componentId) {
                result.startIconComponentId = (iconChild as any).componentId;
            }
        }
    }

    const iconIds = result.startIconComponentId ? [result.startIconComponentId] : [];
    if (iconIds.length > 0 && extractor) {
        const iconNamesMap = await fetchIconNames(iconIds, extractor);
        if (result.startIconComponentId) {
            const cachedName = iconNamesMap.get(result.startIconComponentId);
            const usableCachedName = cachedName && cachedName !== 'Icon' ? cachedName : undefined;
            result.startIcon = usableCachedName || discoveredIconName || result.startIcon;
            if (!result.startIcon || result.startIcon === 'Icon') {
                const fetchedName = await fetchIconName(result.startIconComponentId, extractor);
                if (fetchedName) {
                    result.startIcon = fetchedName;
                }
            }
        }
    } else if (discoveredIconName) {
        result.startIcon = discoveredIconName;
    }

    return result;
}

export async function extractIconsForMenuItem(
    node: FigmaNode,
    extractor?: any
): Promise<IconData> {
    const result: IconData = {};
    const props = ((node as any).componentProperties || {}) as Record<string, any>;
    const isValidMenuIconName = (name?: string) => {
        const normalized = normalizeFigmaNodeName(name);
        if (!normalized) return false;
        if (['Icon', 'Container', 'Value', 'Label', 'Typography', 'Divider', 'Paper', 'Menu', 'MenuList', 'MenuItem', 'List', 'ListItem', 'Left Content', 'Right Content'].includes(normalized)) {
            return false;
        }
        return isLikelyMuiIconName(normalized);
    };

    const resolveIcon = async (slotNode: FigmaNode | null) => {
        if (!slotNode) return undefined;
        const iconNode = findFirstIconLikeDescendant(slotNode as any);
        if (!iconNode) return undefined;

        const iconComponentId = (iconNode as any).componentId as string | undefined;
        const discoveredName = normalizeFigmaNodeName((iconNode as any).name);

        // Figma <Icon> 래퍼: "Icon Instance" (INSTANCE_SWAP)에 실제 아이콘(StarSharp 등) ID가 있음. ListItem > Left Content > <Icon> 구조.
        const iconProps = (iconNode as any).componentProperties || {};
        let swappedId: string | undefined;
        for (const [key, raw] of Object.entries(iconProps)) {
            const prop = raw as any;
            if (prop?.type === 'INSTANCE_SWAP' && (key.toLowerCase().includes('instance') || key.toLowerCase().includes('icon'))) {
                swappedId = prop.value as string | undefined;
                if (swappedId) break;
            }
        }
        const effectiveId = swappedId || iconComponentId;
        const fetchedName =
            effectiveId ? await fetchIconName(effectiveId, extractor) : undefined;
        const resolvedName = normalizeFigmaNodeName(fetchedName || discoveredName);
        if (!isValidMenuIconName(resolvedName)) {
            return undefined;
        }
        const sizeRaw = getPropValue(iconProps as Record<string, unknown>, 'Size');
        const iconSize = typeof sizeRaw === 'string' && sizeRaw.trim() ? sizeRaw.trim() : undefined;

        return {
            componentId: effectiveId || iconComponentId,
            iconName: resolvedName,
            iconSize: iconSize && /^(Small|Medium|Large|Inherit)$/i.test(iconSize) ? iconSize : undefined,
        };
    };

    const resolveIconFromProps = async (position: 'left' | 'right') => {
        const wantLeft = position === 'left';
        for (const [key, raw] of Object.entries(props)) {
            const keyNorm = key.toLowerCase().replace(/\s+/g, '');
            const hasLeft = keyNorm.includes('left');
            const hasRight = keyNorm.includes('right');
            const hasInstanceOrIcon = keyNorm.includes('instance') || keyNorm.includes('icon');
            if (!hasInstanceOrIcon) continue;
            if (wantLeft && !hasLeft) continue;
            if (!wantLeft && !hasRight) continue;

            const prop = raw as any;
            if (prop?.type !== 'INSTANCE_SWAP') continue;
            const componentId = prop.value as string | undefined;
            if (!componentId) continue;
            const iconName = await fetchIconName(componentId, extractor);
            if (!isValidMenuIconName(iconName)) continue;
            return {
                componentId,
                iconName: iconName ? normalizeFigmaNodeName(iconName) : undefined,
                iconSize: undefined,
            };
        }
        return undefined;
    };

    // Left/Right Slot 토글: Figma componentProperties의 "Left Slot", "Right Slot" boolean이 false면 해당 위치 아이콘 완전히 비활성화
    const leftSlotEnabled = getFigmaBooleanProp(node as any, 'Left Slot', 'LeftSlot');
    const rightSlotEnabled = getFigmaBooleanProp(node as any, 'Right Slot', 'RightSlot');

    // Left/Right: MenuItem은 "Left Slot", ListItem은 "Left Content" 사용 (Figma 레이어 이름)
    const leftSlot =
        leftSlotEnabled === false
            ? null
            : findDescendantByName(node, /left\s*slot/i) ||
              findDescendantByName(node, /leftslot/i) ||
              findDescendantByName(node, /left\s*content/i) ||
              findDescendantByName(node, /leftcontent/i);
    const rightSlot =
        rightSlotEnabled === false
            ? null
            : findDescendantByName(node, /right\s*slot/i) ||
              findDescendantByName(node, /rightslot/i) ||
              findDescendantByName(node, /right\s*content/i) ||
              findDescendantByName(node, /rightcontent/i);

    const leftIcon =
        leftSlotEnabled === false ? undefined : (await resolveIcon(leftSlot)) || (await resolveIconFromProps('left'));
    const rightIcon =
        rightSlotEnabled === false ? undefined : (await resolveIcon(rightSlot)) || (await resolveIconFromProps('right'));

    // Slot 없을 때: 직계·하위에서 첫 번째 유효한 아이콘형 노드 (findFirstIconLikeDescendant가 직계 자식 우선)
    // 단, Left Slot이 명시적으로 false인 경우에는 fallback 검색도 수행하지 않는다. → 아이콘 없는 plain MenuItem 유지.
    const fallbackIconNode =
        leftSlotEnabled === false ? undefined : findFirstIconLikeDescendant(node as any);
    const fallbackIconName = fallbackIconNode ? normalizeFigmaNodeName((fallbackIconNode as any).name) : undefined;
    const fallbackIconComponentId = fallbackIconNode ? (fallbackIconNode as any).componentId as string | undefined : undefined;

    if (leftIcon?.componentId || (fallbackIconComponentId && !rightIcon?.componentId)) {
        result.startIconComponentId = leftIcon?.componentId || fallbackIconComponentId;
    }
    if ((leftIcon?.iconName && leftIcon.iconName !== 'Icon') || (fallbackIconName && isValidMenuIconName(fallbackIconName) && !rightIcon?.iconName)) {
        result.startIcon = leftIcon?.iconName && leftIcon.iconName !== 'Icon' ? leftIcon.iconName : fallbackIconName;
    }
    if (leftIcon?.iconSize) result.startIconSize = leftIcon.iconSize;
    if (rightIcon?.componentId) result.endIconComponentId = rightIcon.componentId;
    if (rightIcon?.iconName && rightIcon.iconName !== 'Icon') result.endIcon = rightIcon.iconName;
    if (rightIcon?.iconSize) result.endIconSize = rightIcon.iconSize;

    return result;
}

/**
 * 범용 Icon 추출 (모든 위치 지원)
 */
export async function extractIconsUniversal(
    node: FigmaNode,
    extractor?: any
): Promise<IconExtractionResult> {
    const result: IconExtractionResult = {};

    // 1. Start Icon 추출
    const startIcon = extractIconFromProperties(node, 'start');
    if (startIcon.componentId) {
        result.startIconComponentId = startIcon.componentId;
        
        // 이름도 가져오기
        const iconName = await fetchIconName(startIcon.componentId, extractor);
        if (iconName) {
            result.startIconName = iconName;
        }
    }

    // 2. End Icon 추출
    const endIcon = extractIconFromProperties(node, 'end');
    if (endIcon.componentId) {
        result.endIconComponentId = endIcon.componentId;
        
        const iconName = await fetchIconName(endIcon.componentId, extractor);
        if (iconName) {
            result.endIconName = iconName;
        }
    }

    // 3. Action Icon 추출 (자식에서 찾기)
    const actionIcon = extractIconFromChildren(node);
    if (actionIcon.componentId) {
        result.actionIconComponentId = actionIcon.componentId;
        
        const iconName = await fetchIconName(actionIcon.componentId, extractor);
        if (iconName) {
            result.actionIconName = iconName;
        }
    }

    return result;
}

