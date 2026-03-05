import { ComponentMapping } from './types/PropertyMapper';
import { findTextRecursively } from '../utils/figma-node-utils';

/**
 * MUI DialogTitle 컴포넌트 매핑
 */
export const DialogTitleMapping: ComponentMapping = {
    figmaNames: ['<DialogTitle>'] as const,
    muiName: 'DialogTitle',
    
    muiProps: {    },
    
    excludeFromSx: ['width'],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<DialogTitle${props}${sxAttribute}>
            ${content}
        </DialogTitle>`;
    },
};

