import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI IconButton 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-icon-button/
 */
export const IconButtonMapping: ComponentMapping = {
    figmaNames: ['<IconButton>'] as const,
    muiName: 'IconButton',
    
    muiProps: {
        // size — xsmall은 theme.d.ts IconButtonPropsSizeOverrides + MuiIconButton variants (MUI 문서 기본값 없음)
        size: {
            type: 'union',
            values: ['xsmall', 'small', 'medium', 'large'] as const,
            default: 'medium',
            extractFromFigma: (node) => {
                const sizeProps =
                    (node as any).componentProperties?.Size || (node as any).componentProperties?.size;
                if (sizeProps) {
                    const raw =
                        typeof sizeProps === 'object' && 'value' in sizeProps
                            ? (sizeProps as { value: unknown }).value
                            : sizeProps;
                    if (typeof raw === 'string') {
                        return raw.toLowerCase();
                    }
                    return raw;
                }
                return null;
            },
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'] as const,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
        
        // edge
        edge: {
            type: 'union',
            values: ['start', 'end', 'false'] as const,
        },
        
        // disableFocusRipple
        disableFocusRipple: {
            type: 'boolean',
            default: false,
        },
        
        // disableRipple
        disableRipple: {
            type: 'boolean',
            default: false,
        },
        
        // ariaLabel
        'aria-label': {
            type: 'string',
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'borderRadius',
        'color',
    ],
    
    // 속성 추출: 아이콘 콘텐츠 지원
    extractProperties: async (node, extractor) => {
        const properties: Record<string, any> = {};
        
        // 아이콘 콘텐츠 추출: <IconButton> > <Icon> > 인스턴스명 구조에서 무조건 인스턴스 가져오기
        try {
            const toMuiFontSize = (raw: unknown): 'small' | 'medium' | 'large' | 'inherit' | undefined => {
                if (typeof raw === 'string') {
                    const s = raw.toLowerCase().trim();
                    if (s.includes('large')) return 'large';
                    if (s.includes('small')) return 'small';
                    if (s.includes('medium')) return 'medium';
                    if (s.includes('inherit')) return 'inherit';
                    const px = parseInt(s.replace(/px/gi, '').trim(), 10);
                    if (!Number.isNaN(px)) {
                        if (px <= 20) return 'small';
                        if (px <= 24) return 'medium';
                        return 'large';
                    }
                } else if (typeof raw === 'number') {
                    if (raw <= 20) return 'small';
                    if (raw <= 24) return 'medium';
                    return 'large';
                }
                return undefined;
            };

            const findNamedNode = (nodes: any[], targetName: string): any | null => {
                if (!Array.isArray(nodes)) return null;
                for (const n of nodes) {
                    if (n?.visible === false) continue;
                    const nm = String(n?.name || '').trim();
                    if (nm === targetName || nm === `<${targetName}>`) return n;
                    const found = findNamedNode(n?.children || [], targetName);
                    if (found) return found;
                }
                return null;
            };

            const findFirstInstance = (nodes: any[]): any | null => {
                if (!Array.isArray(nodes)) return null;
                for (const n of nodes) {
                    if (n?.visible === false) continue;
                    if (n?.type === 'INSTANCE' && n?.componentId) return n;
                    const found = findFirstInstance(n?.children || []);
                    if (found) return found;
                }
                return null;
            };

            const readSizeFromNodeProps = (n: any): 'small' | 'medium' | 'large' | 'inherit' | undefined => {
                const p = (n as any)?.componentProperties || {};
                for (const [k, v] of Object.entries(p)) {
                    if (!String(k).toLowerCase().includes('size')) continue;
                    const parsed = toMuiFontSize((v as any)?.value ?? v);
                    if (parsed) return parsed;
                }
                return undefined;
            };

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
                // Avatar와 동일하게 중첩 <Icon> 구조를 우선 처리
                const nestedIconContainer = findNamedNode(iconContainer.children || [], 'Icon');
                const iconInstance =
                    findFirstInstance((nestedIconContainer?.children || iconContainer.children || []) as any[]) ||
                    findFirstInstance(iconContainer.children || []);
                
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
                        properties.__iconButtonIconName = muiIconName;
                    }

                    // 아이콘 fontSize 추출: INSTANCE → 중첩 Icon 컨테이너 → Icon 컨테이너 순으로 fallback
                    const parsedSize =
                        readSizeFromNodeProps(iconInstance) ||
                        readSizeFromNodeProps(nestedIconContainer) ||
                        readSizeFromNodeProps(iconContainer);
                    if (parsedSize) properties.__iconButtonIconFontSize = parsedSize;
                }
            } else {
                // fallback: Icon 컨테이너 명이 다를 때 전체 트리에서 탐색
                const iconInstance = findFirstInstance((node as any).children || []);
                if (iconInstance && iconInstance.componentId) {
                    const { fetchIconName } = await import('../utils/icon-extractor');
                    const { getMuiIconName } = await import('../icon-mapper');
                    const rawName = iconInstance.name || '';
                    let muiIconName = getMuiIconName(iconInstance.componentId, rawName);
                    if (!muiIconName) {
                        const fetchedName = await fetchIconName(iconInstance.componentId, extractor);
                        if (fetchedName) muiIconName = getMuiIconName(iconInstance.componentId, fetchedName);
                    }
                    if (muiIconName) properties.__iconButtonIconName = muiIconName;
                    const parsedSize = readSizeFromNodeProps(iconInstance);
                    if (parsedSize) properties.__iconButtonIconFontSize = parsedSize;
                }
            }
        } catch {
            // 무음 처리
        }
        
        return properties as any;
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx, properties) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';

        // Icon 콘텐츠가 감지된 경우 아이콘 컴포넌트로 렌더링
        if (properties && (properties as any).__iconButtonIconName) {
            const icon = (properties as any).__iconButtonIconName as string;
            const iconFontSize = (properties as any).__iconButtonIconFontSize as string | undefined;
            const iconSizeAttr =
                iconFontSize && ['small', 'medium', 'large', 'inherit'].includes(iconFontSize)
                    ? ` fontSize="${iconFontSize}"`
                    : '';
            return `<IconButton${props}${sxAttribute}>
            <${icon}${iconSizeAttr} />
        </IconButton>`;
        }
        
        return `<IconButton${props}${sxAttribute}>
            ${content}
        </IconButton>`;
    },
};

