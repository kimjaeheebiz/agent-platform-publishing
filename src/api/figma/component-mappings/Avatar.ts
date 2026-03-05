import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Avatar 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-avatar/
 * API: https://mui.com/material-ui/api/avatar/
 * (Badge 래핑은 Figma에서 적용하지 않음 — 공식 컴포넌트만 사용)
 */
export const AvatarMapping: ComponentMapping = {
    figmaNames: ['<Avatar>'] as const,
    muiName: 'Avatar',

    muiProps: {
        src: { type: 'string' },
        alt: { type: 'string' },
        srcSet: { type: 'string' },
        variant: {
            type: 'union',
            values: ['circular', 'rounded', 'square'] as const,
            default: 'circular',
            extractFromFigma: (node) => {
                const v = (node as any).componentProperties?.Variant ?? (node as any).componentProperties?.variant;
                const val = typeof v === 'object' && v?.value != null ? v.value : v;
                if (typeof val !== 'string') return undefined;
                const lower = val.toLowerCase();
                if (lower.includes('rounded')) return 'rounded';
                if (lower.includes('square')) return 'square';
                return 'circular';
            },
        },
    },

    excludeFromSx: ['borderRadius', 'backgroundColor', 'width', 'height'],

    extractProperties: async (node, extractor) => {
        const properties: Record<string, any> = {};
        const props = (node as any).componentProperties || {};
        const children = (node as any).children || [];

        // Size: Figma "Size" (18px 등) → __avatarSizePx
        const sizeProp = props.Size ?? props.size;
        const sizeVal = typeof sizeProp === 'object' && sizeProp?.value != null ? sizeProp.value : sizeProp;
        if (sizeVal != null) {
            const num = typeof sizeVal === 'number' ? sizeVal : parseInt(String(sizeVal).replace(/px/gi, ''), 10);
            if (!Number.isNaN(num)) properties.__avatarSizePx = num;
        }

        // 아이콘 콘텐츠 추출: <Avatar> > <Icon> > 인스턴스명
        try {
            // <Icon> 컨테이너 찾기
            const findIconContainer = (children: any[]): any => {
                if (!children || children.length === 0) return null;
                
                for (const child of children) {
                    // 숨김 노드는 제외
                    if (child?.visible === false) continue;
                    
                    // <Icon> 컨테이너 찾기 (이름으로 판단)
                    const name = (child.name || '').trim();
                    if (name === 'Icon' || name === '<Icon>') {
                        return child;
                    }
                    
                    // 재귀적으로 탐색
                    if (child.children && child.children.length > 0) {
                        const found = findIconContainer(child.children);
                        if (found) return found;
                    }
                }
                return null;
            };
            
            // <Icon> 컨테이너 찾기
            const iconContainer = findIconContainer((node as any).children || []);
            
            if (iconContainer && iconContainer.children && iconContainer.children.length > 0) {
                // <Icon> 하위에서 첫 번째 INSTANCE 타입 찾기 (이름 조건 없이)
                const iconInstance = iconContainer.children.find((child: any) => 
                    child?.visible !== false && 
                    child.type === 'INSTANCE' && 
                    child.componentId
                );
                
                if (iconInstance && iconInstance.componentId) {
                    const { fetchIconName } = await import('../utils/icon-extractor');
                    const { getMuiIconName } = await import('../icon-mapper');
                    
                    // 1) 인스턴스 자체의 name 우선 사용 (getMuiIconName 함수가 Filled 제거 처리)
                    const rawName = iconInstance.name || '';
                    let muiIconName = getMuiIconName(iconInstance.componentId, rawName);
                    
                    // 2) name 기반 매핑이 실패(null)면 Figma API로 보강 조회
                    if (!muiIconName) {
                        const fetchedName = await fetchIconName(iconInstance.componentId, extractor);
                        if (fetchedName) {
                            muiIconName = getMuiIconName(iconInstance.componentId, fetchedName);
                        }
                    }
                    
                    if (muiIconName) {
                        properties.__avatarIconName = muiIconName;
                    }
                }
            }
        } catch {
            // 무음 처리
        }

        // 배경 컬러 변수명은 extractor가 colorStyle로 채운 값을 우선 사용
        // (없으면 Avatar 배경색은 지정하지 않음; 전역 로직이 처리)
        
        return properties as any;
    },
    
    generateJSX: (componentName, props, content, sx, properties) => {
        const extraEntries: string[] = [];
        const sizePx = (properties as any)?.__avatarSizePx;
        const absW = (properties as any)?.absoluteWidth;
        const absH = (properties as any)?.absoluteHeight;
        const avatarBG = (properties as any)?.__avatarColorStyle;
        // Figma Size(18px 등) 우선, 없으면 absoluteWidth/height
        const w = typeof sizePx === 'number' ? sizePx : (properties?.width !== 'hug' && typeof absW === 'number' ? absW : null);
        const h = typeof sizePx === 'number' ? sizePx : (properties?.height !== 'hug' && typeof absH === 'number' ? absH : null);
        if (typeof w === 'number') extraEntries.push(`width: ${w}`);
        if (typeof h === 'number') extraEntries.push(`height: ${h}`);
        if (avatarBG) extraEntries.push(`backgroundColor: '${avatarBG}'`);

        let mergedSx = '';
        if (sx && extraEntries.length > 0) {
            const trimmed = sx.trim();
            const inner = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1).trim() : trimmed;
            const comma = inner.length > 0 ? ', ' : '';
            mergedSx = `\n            sx={{ ${inner}${comma}${extraEntries.join(', ')} }}`;
        } else if (sx) {
            mergedSx = `\n            sx=${sx}`;
        } else if (extraEntries.length > 0) {
            mergedSx = `\n            sx={{ ${extraEntries.join(', ')} }}`;
        }

        let avatarJsx: string;
        if (properties && (properties as any).__avatarIconName) {
            const icon = (properties as any).__avatarIconName as string;
            avatarJsx = `<Avatar${props}${mergedSx}>
            <${icon} />
        </Avatar>`;
        } else {
            avatarJsx = `<Avatar${props}${mergedSx}>
            ${content}
        </Avatar>`;
        }

        return avatarJsx;
    },
};

