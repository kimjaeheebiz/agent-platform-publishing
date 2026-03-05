import { ComponentMapping } from './types/PropertyMapper';
import { findTextRecursively } from '../utils/figma-node-utils';

/**
 * MUI InputLabel 컴포넌트 매핑
 */
export const InputLabelMapping: ComponentMapping = {
    figmaNames: ['<InputLabel>'] as const,
    muiName: 'InputLabel',
    
    muiProps: {
        // htmlFor
        htmlFor: {
            type: 'string',
        },
        
        // id
        id: {
            type: 'string',
        },
        
        // required
        required: {
            type: 'boolean',
            default: false,
        },
        
        // shrink
        shrink: {
            type: 'boolean',
        },
        
        // focused
        focused: {
            type: 'boolean',
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<InputLabel${props}${sxAttribute}>
            ${content}
        </InputLabel>`;
    },
};

