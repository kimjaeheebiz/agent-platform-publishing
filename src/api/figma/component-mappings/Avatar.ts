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

    excludeFromSx: ['borderRadius', 'backgroundColor', 'width', 'height', 'justifyContent', 'alignItems'],

    extractProperties: async (node, extractor) => {
        const properties: Record<string, any> = {};
        const props = (node as any).componentProperties || {};
        const children = (node as any).children || [];

        const inferIconNameFromString = (raw: unknown): string | null => {
            if (typeof raw !== 'string') return null;
            const s = raw.replace(/<|>/g, '').trim();
            if (!s) return null;
            // Figma 아이콘명 관례: PersonFilled / PersonOutlined 등
            const noSuffix = s.replace(/Filled$|Outlined$|Rounded$|Sharp$|TwoTone$/i, '');
            return noSuffix || s;
        };
        const looksLikeNodeId = (v: string): boolean => /^[0-9]+:[0-9]+$/.test(v.trim());

        const resolveIconNameFromRaw = async (rawVal: unknown): Promise<string | null> => {
            const { fetchIconName } = await import('../utils/icon-extractor');
            const { getMuiIconName } = await import('../icon-mapper');
            const rawStr = typeof rawVal === 'string' ? rawVal.trim() : '';
            let iconName: string | null = null;
            if (rawStr && looksLikeNodeId(rawStr)) {
                const fetchedName = await fetchIconName(rawStr, extractor);
                if (fetchedName) {
                    iconName = getMuiIconName(rawStr, fetchedName) ?? inferIconNameFromString(fetchedName);
                }
            }
            if (!iconName) {
                iconName = inferIconNameFromString(rawVal);
            }
            return iconName;
        };

        const normalizeThemeTokenFromPropValue = (raw: unknown): string | null => {
            if (typeof raw !== 'string') return null;
            const s = raw.trim();
            if (!s) return null;
            const cleaned = s
                .replace(/^palette\./i, '')
                .replace(/\s+/g, '')
                .replace(/\//g, '.')
                .replace(/_states\.main$/i, '')
                .replace(/\.main$/i, '.main')
                .replace(/^([A-Z])/, (m) => m.toLowerCase());
            if (!cleaned.includes('.')) return null;
            const lower = cleaned.toLowerCase();
            return lower;
        };

        const findIconNameInNodeProps = async (n: any): Promise<string | null> => {
            const componentProps = (n as any)?.componentProperties || {};
            for (const [k, v] of Object.entries(componentProps)) {
                if (!/icon/i.test(k)) continue;
                const rawVal = (v as any)?.value ?? v;
                const name = await resolveIconNameFromRaw(rawVal);
                if (name) return name;
            }
            if (!Array.isArray(n?.children)) return null;
            for (const c of n.children) {
                if (c?.visible === false) continue;
                const found = await findIconNameInNodeProps(c);
                if (found) return found;
            }
            return null;
        };

        // Size: Figma "Size" (18px 등) → __avatarSizePx
        const sizeProp = props.Size ?? props.size;
        const sizeVal = typeof sizeProp === 'object' && sizeProp?.value != null ? sizeProp.value : sizeProp;
        if (sizeVal != null) {
            const num = typeof sizeVal === 'number' ? sizeVal : parseInt(String(sizeVal).replace(/px/gi, ''), 10);
            if (!Number.isNaN(num)) properties.__avatarSizePx = num;
        }

        try {
            // 아이콘명 1차 추출: componentProperties 내 Icon 관련 키 (예: "Icon instance")
            for (const [k, v] of Object.entries(props)) {
                if (!/icon/i.test(k)) continue;
                const rawVal = (v as any)?.value ?? v;
                const iconName = await resolveIconNameFromRaw(rawVal);
                if (iconName) {
                    properties.__avatarIconName = iconName;
                    break;
                }
            }

            // 아이콘명 1.5차 추출: INSTANCE_SWAP prop 자체에서 componentId(id) 해석
            if (!properties.__avatarIconName) {
                for (const [, v] of Object.entries(props)) {
                    const p = v as any;
                    if (!p || typeof p !== 'object') continue;
                    if (p.type !== 'INSTANCE_SWAP') continue;
                    const swapId = typeof p.value === 'string' ? p.value.trim() : '';
                    if (!swapId) continue;

                    const iconName = await resolveIconNameFromRaw(swapId);
                    if (iconName) {
                        properties.__avatarIconName = iconName;
                        break;
                    }
                }
            }

            // 2차 추출: Avatar 하위 노드(<Icon>)의 componentProperties까지 재귀 탐색
            if (!properties.__avatarIconName) {
                const fromChildrenProps = await findIconNameInNodeProps(node);
                if (fromChildrenProps) {
                    properties.__avatarIconName = fromChildrenProps;
                }
            }

            // 아이콘 콘텐츠 추출: Avatar 하위에서 첫 아이콘 인스턴스 탐색
            const findFirstIconInstance = (nodes: any[]): any | null => {
                if (!nodes || nodes.length === 0) return null;
                for (const n of nodes) {
                    if (n?.visible === false) continue;
                    const nm = String(n?.name || '').toLowerCase();
                    if (n?.type === 'INSTANCE' && (n?.componentId || nm.includes('icon') || nm.includes('person'))) {
                        return n;
                    }
                    if (Array.isArray(n?.children) && n.children.length > 0) {
                        const found = findFirstIconInstance(n.children);
                        if (found) return found;
                    }
                }
                return null;
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

            const findFirstNodeWithFills = (n: any): any | null => {
                if (!n) return null;
                if (Array.isArray(n.fills) && n.fills.length > 0) return n;
                if (!Array.isArray(n.children)) return null;
                for (const c of n.children) {
                    if (c?.visible === false) continue;
                    const found = findFirstNodeWithFills(c);
                    if (found) return found;
                }
                return null;
            };

            const collectNodesWithFills = (n: any, acc: any[] = []): any[] => {
                if (!n) return acc;
                if (Array.isArray(n.fills) && n.fills.length > 0) acc.push(n);
                if (Array.isArray(n.children)) {
                    for (const c of n.children) {
                        if (c?.visible === false) continue;
                        collectNodesWithFills(c, acc);
                    }
                }
                return acc;
            };

            const collectVectorNodesWithFills = (n: any, acc: any[] = []): any[] => {
                if (!n) return acc;
                const type = String(n?.type || '').toUpperCase();
                const isVectorLike =
                    type === 'VECTOR' ||
                    type === 'BOOLEAN_OPERATION' ||
                    type === 'ELLIPSE' ||
                    type === 'RECTANGLE' ||
                    type === 'POLYGON' ||
                    type === 'STAR' ||
                    type === 'LINE' ||
                    type === 'PATH';
                if (isVectorLike && Array.isArray(n.fills) && n.fills.length > 0) acc.push(n);
                if (Array.isArray(n.children)) {
                    for (const c of n.children) {
                        if (c?.visible === false) continue;
                        collectVectorNodesWithFills(c, acc);
                    }
                }
                return acc;
            };

            const isNeutralToken = (token: string): boolean => {
                const t = token.trim().toLowerCase();
                return t === 'common.white' || t === 'common.black' || t === 'common.white_states.main' || t === 'common.black_states.main';
            };

            const extractThemeTokenFromFillNode = async (fillNode: any): Promise<string | null> => {
                if (!fillNode?.fills?.[0]) return null;
                const fill0 = fillNode.fills[0] as { boundVariables?: { color?: { id: string } } };
                const variableId = fill0?.boundVariables?.color?.id;
                if (variableId && extractor && typeof (extractor as any).extractThemeTokenFromVariableId === 'function') {
                    const token = await (extractor as any).extractThemeTokenFromVariableId(variableId);
                    if (typeof token === 'string' && token.trim() !== '') return token;
                }
                if (extractor && typeof (extractor as any).extractColorWithStyle === 'function') {
                    const info = await (extractor as any).extractColorWithStyle(fillNode.fills[0]);
                    const styleName =
                        info && typeof info === 'object' && 'styleName' in info
                            ? (info as { styleName?: string }).styleName
                            : undefined;
                    if (typeof styleName === 'string' && styleName.trim() !== '') return styleName;
                }
                return null;
            };

            const findIconSizeFromNodeProps = (n: any): string | undefined => {
                if (!n) return undefined;
                const p = (n as any).componentProperties || {};
                for (const [k, v] of Object.entries(p)) {
                    const key = String(k).toLowerCase();
                    if (!key.includes('size')) continue;
                    const raw = (v as any)?.value ?? v;
                    if (typeof raw !== 'string') continue;
                    const s = raw.toLowerCase();
                    if (s.includes('large')) return 'large';
                    if (s.includes('small')) return 'small';
                    if (s.includes('medium')) return 'medium';
                    if (s.includes('inherit')) return 'inherit';
                }
                if (!Array.isArray(n.children)) return undefined;
                for (const c of n.children) {
                    if (c?.visible === false) continue;
                    const found = findIconSizeFromNodeProps(c);
                    if (found) return found;
                }
                return undefined;
            };

            const findIconColorFromNodeProps = (n: any): string | undefined => {
                if (!n) return undefined;
                const p = (n as any).componentProperties || {};
                for (const [k, v] of Object.entries(p)) {
                    if (!String(k).toLowerCase().includes('color')) continue;
                    const raw = (v as any)?.value ?? v;
                    const token = normalizeThemeTokenFromPropValue(raw);
                    if (token) return token;
                }
                if (!Array.isArray(n.children)) return undefined;
                for (const c of n.children) {
                    if (c?.visible === false) continue;
                    const found = findIconColorFromNodeProps(c);
                    if (found) return found;
                }
                return undefined;
            };

            // 아이콘 인스턴스는 Avatar > Icon > Icon > (Vector...) 경로를 최우선으로 탐색
            const directIconContainer = findNamedNode((node as any).children || [], 'Icon');
            const nestedIconContainer = directIconContainer ? findNamedNode(directIconContainer.children || [], 'Icon') : null;
            const iconInstanceFromPath = findFirstInstance((nestedIconContainer?.children || directIconContainer?.children || []) as any[]);
            const iconInstance = iconInstanceFromPath || findFirstIconInstance((node as any).children || []);
            if (iconInstance) {
                const { fetchIconName } = await import('../utils/icon-extractor');
                const { getMuiIconName } = await import('../icon-mapper');
                const rawName = String(iconInstance.name || '');
                const compId = String(iconInstance.componentId || '');
                let muiIconName = getMuiIconName(compId, rawName);

                // name 기반 매핑 실패 시 Figma API 보강 조회
                if (!muiIconName && compId) {
                    const fetchedName = await fetchIconName(compId, extractor);
                    if (fetchedName) {
                        muiIconName = getMuiIconName(compId, fetchedName);
                    }
                }
                // 마지막 fallback: 인스턴스 이름에서 아이콘명 추론
                if (!muiIconName && rawName) {
                    const stripped = rawName.replace(/<|>/g, '').trim();
                    if (stripped && stripped !== 'Icon') muiIconName = stripped;
                }

                if (muiIconName) {
                    properties.__avatarIconName = muiIconName;

                        // 아이콘 fontSize 추출 (small/medium/large/inherit)
                        const iconProps = (iconInstance as any).componentProperties || {};
                        const iconSizeRaw = iconProps.Size?.value ?? iconProps.size?.value ?? iconProps.Size ?? iconProps.size;
                        if (typeof iconSizeRaw === 'string') {
                            const s = iconSizeRaw.toLowerCase();
                            if (s.includes('large')) properties.__avatarIconFontSize = 'large';
                            else if (s.includes('small')) properties.__avatarIconFontSize = 'small';
                            else if (s.includes('medium')) properties.__avatarIconFontSize = 'medium';
                            else if (s.includes('inherit')) properties.__avatarIconFontSize = 'inherit';
                        }

                        // 아이콘 color 추출:
                        // 1) 아이콘 내부 Vector fill 우선
                        // 2) 없으면 전체 fill fallback
                        // 3) 중립색(white/black)보다 실제 아이콘 색상 토큰 우선
                        try {
                            const colorRoot = (nestedIconContainer || directIconContainer || iconInstance) as any;
                            const vectorFillNodes = collectVectorNodesWithFills(colorRoot);
                            const fillNodes = vectorFillNodes.length > 0 ? vectorFillNodes : collectNodesWithFills(colorRoot);
                            let fallbackNeutral: string | null = null;
                            const candidates: string[] = [];
                            for (const n of fillNodes) {
                                const token = await extractThemeTokenFromFillNode(n);
                                if (!token) continue;
                                if (!candidates.includes(token)) candidates.push(token);
                                if (!isNeutralToken(token)) {
                                    properties.__avatarIconColorStyle = token;
                                    break;
                                }
                                if (!fallbackNeutral) fallbackNeutral = token;
                            }
                            if (candidates.length > 0) {
                                properties.__avatarIconColorCandidates = candidates;
                            }
                            if (!properties.__avatarIconColorStyle && fallbackNeutral) {
                                properties.__avatarIconColorStyle = fallbackNeutral;
                            }
                        } catch {
                            // 무음 처리
                        }
                }
            }

            // 아이콘명을 찾았지만 size/color가 비어 있으면 트리에서 한번 더 보강
            if (properties.__avatarIconName) {
                if (!properties.__avatarIconFontSize) {
                    const fallbackSize = findIconSizeFromNodeProps(node);
                    if (fallbackSize) properties.__avatarIconFontSize = fallbackSize;
                }
                if (!properties.__avatarIconColorStyle) {
                    const colorFromProps =
                        findIconColorFromNodeProps(nestedIconContainer || directIconContainer || iconInstance || node);
                    if (colorFromProps) properties.__avatarIconColorStyle = colorFromProps;
                }
                // 배경색 혼입 방지를 위해 아이콘 색은 아이콘 트리에서만 추출한다.
            }
        } catch {
            // 무음 처리
        }

        // 배경 컬러 변수명은 extractor가 colorStyle로 채운 값을 우선 사용
        // (없으면 Avatar 배경색은 지정하지 않음; 전역 로직이 처리)
        
        return properties as any;
    },
    
    generateJSX: (componentName, props, content, sx, properties) => {
        const normalizeThemeColorPath = (raw: unknown): string | null => {
            if (typeof raw !== 'string' || raw.trim() === '') return null;
            let v = raw.trim().replace(/^palette\./, '');
            // palette.common에는 white_states/black_states 그룹이 없고 white/black만 존재
            if (v === 'common.white_states.main') v = 'common.white';
            if (v === 'common.black_states.main') v = 'common.black';
            return v;
        };

        const extraEntries: string[] = [];
        const sizePx = (properties as any)?.__avatarSizePx;
        const absW = (properties as any)?.absoluteWidth;
        const absH = (properties as any)?.absoluteHeight;
        const avatarBG = normalizeThemeColorPath((properties as any)?.__avatarColorStyle);
        // 실제 노드 크기(width/height)가 있으면 우선, 없으면 Figma Size prop/absolute 크기로 보완
        const nodeW = typeof properties?.width === 'number' ? properties.width : null;
        const nodeH = typeof properties?.height === 'number' ? properties.height : null;
        const w =
            nodeW ??
            (properties?.width !== 'hug' && properties?.width !== 'fill' && typeof absW === 'number' ? absW : null) ??
            (typeof sizePx === 'number' ? sizePx : null);
        const h =
            nodeH ??
            (properties?.height !== 'hug' && properties?.height !== 'fill' && typeof absH === 'number' ? absH : null) ??
            (typeof sizePx === 'number' ? sizePx : null);
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
            const iconFontSize = (properties as any).__avatarIconFontSize as string | undefined;
            const iconSizeAttr =
                iconFontSize && ['small', 'medium', 'large', 'inherit'].includes(iconFontSize)
                    ? ` fontSize="${iconFontSize}"`
                    : '';
            const rawIconColor = normalizeThemeColorPath((properties as any).__avatarIconColorStyle);
            const iconCandidatesRaw = Array.isArray((properties as any).__avatarIconColorCandidates)
                ? ((properties as any).__avatarIconColorCandidates as unknown[])
                : [];
            const iconCandidates = iconCandidatesRaw
                .map((v) => normalizeThemeColorPath(v))
                .filter((v): v is string => typeof v === 'string' && v.length > 0);
            const iconColor =
                rawIconColor && rawIconColor === avatarBG
                    ? (iconCandidates.find((c) => c !== avatarBG) ?? rawIconColor)
                    : rawIconColor;
            const iconColorAttr = iconColor ? ` sx={{ color: '${iconColor}' }}` : '';
            avatarJsx = `<Avatar${props}${mergedSx}>
            <${icon}${iconSizeAttr}${iconColorAttr} />
        </Avatar>`;
        } else {
            avatarJsx = `<Avatar${props}${mergedSx}>
            ${content}
        </Avatar>`;
        }

        return avatarJsx;
    },
};

