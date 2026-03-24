import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI Paper 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-paper/
 */
export const PaperMapping: ComponentMapping = {
    figmaNames: ['<Paper>'] as const,
    muiName: 'Paper',
    
    muiProps: {
        // elevation (MUI 기본값 1 → 기본값일 때 출력 생략)
        elevation: {
            type: 'union-number',
            default: 1,
        },
        
        // raised
        raised: {
            type: 'boolean',
            default: false,
        },
        
        // variant (MUI 기본값 'elevation' → 기본값일 때 출력 생략)
        variant: {
            type: 'union',
            values: ['elevation', 'outlined'] as const,
            default: 'elevation',
        },
        
        // square
        square: {
            type: 'boolean',
            default: false,
        },
    },
    
    // Paper 기본 스타일과 충돌하는 테두리 계열만 sx에서 제외
    excludeFromSx: [
        'borderColor',
        'borderWidth',
        'borderStyle',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Paper${props}${sxAttribute}>
            ${content}
        </Paper>`;
    },
};

