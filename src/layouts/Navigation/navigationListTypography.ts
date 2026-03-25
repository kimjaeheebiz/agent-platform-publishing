/**
 * 사이드바 네비게이션 ListItemText Typography 슬롯 — 한곳에서 variant 통일
 */
export const NAV_LIST_SLOT = {
    depth1: { primary: { variant: 'subtitle2' as const } },
    depth2: { primary: { variant: 'body2' as const } },
} as const;
