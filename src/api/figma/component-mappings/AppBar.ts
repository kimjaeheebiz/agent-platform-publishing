import { ComponentMapping } from './types/PropertyMapper';

/**
 * MUI AppBar 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-app-bar/
 */
export const AppBarMapping: ComponentMapping = {
    figmaNames: ['<AppBar>', '<Header>'] as const,
    muiName: 'AppBar',
    
    muiProps: {
        // position
        position: {
            type: 'union',
            values: ['fixed', 'absolute', 'sticky', 'static', 'relative'] as const,
            default: 'fixed',
        },
        
        // color
        color: {
            type: 'union',
            values: ['default', 'inherit', 'primary', 'secondary', 'transparent'] as const,
            default: 'primary',
        },
        
        // elevation
        elevation: {
            type: 'union-number',
        },
        
        // enableColorOnDark
        enableColorOnDark: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [
        'backgroundColor',
        'color',
        'elevation',
    ],
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx, rawProperties) => {
        const figmaColor = (rawProperties as any)?.color as string | undefined;

        // 피그마에 AppBar color="dark" 변형이 추가된 경우,
        // MUI AppBar color prop에는 dark가 없으므로 sx로 배경/텍스트 컬러를 고정합니다.
        const bgValue =
            figmaColor === 'dark'
                ? `'_components.appBar.darkFill'`
                : figmaColor === 'transparent'
                  ? `'transparent'`
                  : `'_components.appBar.defaultFill'`;

        const textValue = '(theme) => theme.palette.primary.contrastText';

        const sxAttribute = sx
            ? `\n            sx={{ ...( ${sx} ), backgroundColor: ${bgValue}, color: ${textValue} }}`
            : `\n            sx={{ backgroundColor: ${bgValue}, color: ${textValue} }}`;

        return `<AppBar${props}${sxAttribute}>
            ${content}
        </AppBar>`;
    },
};

