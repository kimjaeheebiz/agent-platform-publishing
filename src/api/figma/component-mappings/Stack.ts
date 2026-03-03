import { ComponentMapping } from './types/PropertyMapper';
import type { FigmaNode } from '../types';

// Figma Spacing 토큰(예: "0,5", "1,5")을 JS 숫자(0.5, 1.5)로 정규화
function parseSpacingValue(value: unknown): number | undefined {
    if (value == null) return undefined;
    if (typeof value === 'number') return Number.isNaN(value) ? undefined : value;
    const s = String(value).trim();
    if (s.toLowerCase() === 'auto' || s === '자동') return undefined;
    const normalized = s.replace(',', '.');
    if (!/^\d+(\.\d+)?$/.test(normalized)) return undefined;
    const num = parseFloat(normalized);
    return Number.isNaN(num) ? undefined : num;
}

/**
 * MUI Stack 컴포넌트 매핑
 *
 * 공식 문서: https://mui.com/material-ui/react-stack/
 * - Spacing(VARIANT): 컴포넌트 속성(디자인 변수) 값 그대로 사용 → 테마 반영
 * - itemSpacing: 변수(boundVariables) 또는 스타일(px) → extractor에서 토큰 파일 기반으로 gapStyle 설정
 */
export const StackMapping: ComponentMapping = {
    figmaNames: ['Stack', '<Stack>'] as const,
    muiName: 'Stack',
    muiProps: {
        direction: {
            type: 'union',
            values: ['row', 'row-reverse', 'column', 'column-reverse'] as const,
            default: 'column',
            extractFromFigma: (node: FigmaNode) => {
                const componentProps = (node as any).componentProperties || {};
                const directionProp = componentProps['Direction'];
                if (directionProp && typeof directionProp === 'object' && 'value' in directionProp) {
                    return (directionProp.value as string).toLowerCase();
                }
                return (node as any).layoutMode === 'HORIZONTAL' ? 'row' : 'column';
            },
        },
        spacing: {
            type: 'union-number',
            default: 0,
            extractFromFigma: (node: FigmaNode) => {
                const componentProps = (node as any).componentProperties || {};
                const raw = componentProps['Spacing'] ?? componentProps['spacing'] ?? componentProps['SPACING'];
                if (raw != null && typeof raw === 'object' && 'value' in raw) {
                    return parseSpacingValue((raw as { value: unknown }).value);
                }
                if (raw != null && (typeof raw === 'number' || typeof raw === 'string')) {
                    return parseSpacingValue(raw);
                }
                // itemSpacing(px)은 extractor layout 블록에서 토큰 파일로 gapStyle 설정 → 하드코딩 없음
                return undefined;
            },
        },
        divider: { type: 'react-node' },
        alignItems: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'] as const,
        },
        justifyContent: {
            type: 'union',
            values: ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const,
        },
        useFlexGap: { type: 'boolean', default: false },
    },
    excludeFromSx: ['width'],
    generateJSX: (componentName, props, content, sx) => {
        const sxAttribute = sx ? `\n            sx={${sx}}` : '';
        return `<Stack${props}${sxAttribute}>
            ${content}
        </Stack>`;
    },
};
