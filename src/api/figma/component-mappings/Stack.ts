import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Stack 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-stack/
 */
export const StackMapping: ComponentMapping = {
    figmaNames: ['Stack', '<Stack>'] as const,
    muiName: 'Stack',
    
    muiProps: {
        // direction - componentProperties의 VARIANT에서 추출
        direction: {
            type: 'union',
            values: ['row', 'row-reverse', 'column', 'column-reverse'] as const,
            default: 'column',
            extractFromFigma: (node) => {
                // 먼저 componentProperties에서 Direction 확인
                const componentProps = (node as any).componentProperties || {};
                const directionProp = componentProps['Direction'];
                if (directionProp && typeof directionProp === 'object' && 'value' in directionProp) {
                    return (directionProp.value as string).toLowerCase();
                }
                // 기본값: layoutMode에서 추출
                return (node as any).layoutMode === 'HORIZONTAL' ? 'row' : 'column';
            }
        },
        
        // spacing - componentProperties의 VARIANT에서 추출
        spacing: {
            type: 'union-number',
            default: 0,
            extractFromFigma: (node) => {
                // 먼저 componentProperties에서 Spacing 확인
                const componentProps = (node as any).componentProperties || {};
                const spacingProp = componentProps['Spacing'];
                if (spacingProp && typeof spacingProp === 'object' && 'value' in spacingProp) {
                    const value = spacingProp.value;
                    // '자동' 또는 'auto'인 경우 undefined 반환 (spacing prop 생성 안 함)
                    if (typeof value === 'string' && (value.toLowerCase() === 'auto' || value === '자동')) {
                        return undefined;
                    }
                    return typeof value === 'number' ? value : parseInt(value as string, 10);
                }
                // itemSpacing이 없거나 0인 경우 undefined 반환 (spacing prop 생성 안 함)
                const itemSpacing = (node as any).itemSpacing;
                if (itemSpacing === undefined || itemSpacing === 0) {
                    return undefined;
                }
                return itemSpacing;
            }
        },
        
        // divider
        divider: {
            type: 'react-node',
        },
        
        // alignItems
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const,
        },
        
        // justifyContent
        justifyContent: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const,
        },
        
        // useFlexGap
        useFlexGap: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'width',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Stack${props}${sxAttribute}>
            ${content}
        </Stack>`;
    },
};

