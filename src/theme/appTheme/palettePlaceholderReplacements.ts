import type { PaletteOptions, ThemeOptions } from '@mui/material/styles';

/**
 * `muiComponents.ts` 등에 쓰는 `__PALETTE_*` / `__CHIP_*` 문자열을 빌드 시 실제 색으로 바꿀 때 사용합니다.
 *
 * - 정적 `ThemeOptions` 안에서는 런타임 `theme` 객체를 쓸 수 없어 placeholder 문자열을 두고,
 * - `merge-theme-with-app-components.ts`가 `palette`를 넣어 이 함수로 한 번에 치환합니다.
 * - **새 placeholder를 쓰면 여기에만** 키→값 규칙을 추가하면 됩니다.
 */
export function getPalettePlaceholderReplacements(
    palette: PaletteOptions | undefined,
): Record<string, string | undefined> {
    if (!palette) return {};
    // 확장 팔레트(토큰 `_states` 등)는 타입에 없음
    const p = palette as Record<string, unknown> & {
        divider?: string;
        action?: { hover?: string; selected?: string };
        primary?: { main?: string; _states?: { selected?: string } };
        secondary?: { main?: string; _states?: { selected?: string } };
        error?: { main?: string; _states?: { selected?: string } };
        warning?: { main?: string; _states?: { selected?: string } };
        info?: { main?: string; _states?: { selected?: string } };
        success?: { main?: string; _states?: { selected?: string } };
    };

    return {
        __PALETTE_DIVIDER__: p.divider,
        __PALETTE_ACTION_HOVER__: p.action?.hover,
        __CHIP_PRIMARY_BG__: p.primary?._states?.selected ?? p.action?.selected,
        __CHIP_PRIMARY_FG__: p.primary?.main,
        __CHIP_SECONDARY_BG__: p.secondary?._states?.selected ?? p.action?.selected,
        __CHIP_SECONDARY_FG__: p.secondary?.main,
        __CHIP_ERROR_BG__: p.error?._states?.selected ?? p.action?.selected,
        __CHIP_ERROR_FG__: p.error?.main,
        __CHIP_WARNING_BG__: p.warning?._states?.selected ?? p.action?.selected,
        __CHIP_WARNING_FG__: p.warning?.main,
        __CHIP_INFO_BG__: p.info?._states?.selected ?? p.action?.selected,
        __CHIP_INFO_FG__: p.info?.main,
        __CHIP_SUCCESS_BG__: p.success?._states?.selected ?? p.action?.selected,
        __CHIP_SUCCESS_FG__: p.success?.main,
    };
}

function replacePlaceholdersDeep(input: unknown, replacements: Record<string, string | undefined>): unknown {
    if (typeof input === 'string') {
        const direct = replacements[input];
        if (direct !== undefined) return direct;
        let out = input;
        for (const [token, val] of Object.entries(replacements)) {
            if (val === undefined) continue;
            if (out.includes(token)) out = out.split(token).join(val);
        }
        return out;
    }
    if (Array.isArray(input)) {
        return input.map((item) => replacePlaceholdersDeep(item, replacements));
    }
    if (input && typeof input === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
            out[k] = replacePlaceholdersDeep(v, replacements);
        }
        return out;
    }
    return input;
}

/** 병합된 `ThemeOptions` 트리 안의 placeholder 문자열을 `palette` 기준으로 치환합니다. */
export function applyPalettePlaceholdersToTheme(themeOptions: ThemeOptions): ThemeOptions {
    const replacements = getPalettePlaceholderReplacements(themeOptions.palette);
    return replacePlaceholdersDeep(themeOptions, replacements) as ThemeOptions;
}
