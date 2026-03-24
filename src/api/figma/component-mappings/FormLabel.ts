import { ComponentMapping } from './types/PropertyMapper';
import { findTextRecursively } from '../utils/figma-node-utils';

/**
 * MUI FormLabel 컴포넌트 매핑
 */
export const FormLabelMapping: ComponentMapping = {
    figmaNames: ['<FormLabel>'] as const,
    muiName: 'FormLabel',
    
    muiProps: {
        // color
        color: {
            type: 'union',
            values: ['error', 'info', 'primary', 'secondary', 'success', 'warning'] as const,
        },

        // component
        component: {
            type: 'string',
        },
        
        // focused
        focused: {
            type: 'boolean',
        },
        
        // required
        required: {
            type: 'boolean',
            default: false,
        },
        
        // filled
        filled: {
            type: 'boolean',
        },
        
        // error
        error: {
            type: 'boolean',
            default: false,
        },
        
        // disabled
        disabled: {
            type: 'boolean',
            default: false,
        },
    },
    
    excludeFromSx: [],
    
    extractContent: (node) => {
        return findTextRecursively(node.children || []);
    },
    
    // ✅ JSX 생성 템플릿 정의
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<FormLabel${props}${sxAttribute}>
            ${content}
        </FormLabel>`;
    },
};

