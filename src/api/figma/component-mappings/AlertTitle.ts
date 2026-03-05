import { ComponentMapping } from './types/PropertyMapper';
import { findTextRecursively } from '../utils/figma-node-utils';

/**
 * MUI AlertTitle 컴포넌트 매핑
 */
export const AlertTitleMapping: ComponentMapping = {
    figmaNames: ['<AlertTitle>'] as const,
    muiName: 'AlertTitle',
    
    muiProps: {},
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<AlertTitle${props}${sxAttribute}>
            ${content}
        </AlertTitle>`;
    },
};

