import { ComponentMapping } from './types/PropertyMapper';
import { ComponentProperties } from '../types';

/**
 * MUI Table 컴포넌트 매핑
 * 
 * 공식 문서: https://mui.com/material-ui/react-table/
 */
export const TableMapping: ComponentMapping = {
    figmaNames: ['<Table>', '<DataGrid>'] as const,
    muiName: 'Table',
    
    muiProps: {
        // size (피그마에서는 small boolean prop으로 설정됨)
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-size
        size: {
            type: 'union',
            values: ['small', 'medium'] as const,
            default: 'medium',
        },
        
        // small (피그마 boolean prop, size="small"로 변환됨)
        small: {
            type: 'boolean',
            default: false,
        },
        
        // stickyHeader
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-stickyHeader
        stickyHeader: {
            type: 'boolean',
            default: false,
        },
        
        // padding
        // MUI API: https://mui.com/material-ui/api/table/#table-prop-padding
        padding: {
            type: 'union',
            values: ['checkbox', 'none', 'normal'] as const,
            default: 'normal',
        },
        // component (기본 table)
        component: {
            type: 'string',
        },
    },
    /** MUI 기본 구조로 렌더되므로 레이아웃/테두리 등은 테마로 처리, sx 중복 제외 */
    excludeFromSx: ['width', 'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius'],
    subComponents: ['TableHead', 'TableBody', 'TableFooter'],
    transformProps: (properties: ComponentProperties) => {
        const transformed = { ...properties };
        if (transformed['small'] === true) {
            transformed['size'] = 'small';
            delete transformed['small'];
        }
        return transformed;
    },
    generateJSX: (componentName, props, content, sx) => {
        return `<Table${props}>
            ${content}
        </Table>`;
    },
};

