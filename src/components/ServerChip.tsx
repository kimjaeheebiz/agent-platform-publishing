import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export type ServerState = 'local' | 'dev' | 'stage';

type Props = {
    /**
     * Figma의 ServerChip state/variant에 대응합니다.
     * 예: "local" | "dev" | "stage"
     */
    state?: string;
    size?: ChipProps['size'];
} & Omit<ChipProps, 'label' | 'color'>;

const SERVER_LABEL: Record<ServerState, string> = {
    local: '로컬',
    dev: '개발',
    stage: '스테이지',
};

const SERVER_SX_BY_STATE: Record<ServerState, (theme: Theme) => Record<string, unknown>> = {
    local: (theme) => ({
        backgroundColor: theme.brand.colors.hecto.green[50],
        color: theme.palette.success.main,
        '& .MuiChip-label': { color: theme.palette.success.main },
    }),
    dev: (theme) => ({
        backgroundColor: theme.brand.colors.hecto.blue[50],
        color: theme.palette.info.main,
        '& .MuiChip-label': { color: theme.palette.info.main },
    }),
    stage: (theme) => ({
        backgroundColor: theme.brand.colors.hecto.orange[50],
        color: theme.palette.warning.main,
        '& .MuiChip-label': { color: theme.palette.warning.main },
    }),
};

function isServerState(value: unknown): value is ServerState {
    return value === 'local' || value === 'dev' || value === 'stage';
}

const getServerLabel = (state?: string): string => {
    const s = state?.toLowerCase() as ServerState | undefined;
    if (isServerState(s)) return SERVER_LABEL[s];
    return state ?? SERVER_LABEL.local;
};

const getServerSx = (state?: string): ChipProps['sx'] => {
    const s = state?.toLowerCase() as ServerState | undefined;
    if (!isServerState(s)) return undefined;
    return (theme) => SERVER_SX_BY_STATE[s](theme);
};

export const ServerChip: React.FC<Props> = ({ state, size = 'small', ...rest }) => {
    const { sx, ...other } = rest;
    return (
        <Chip
            label={getServerLabel(state)}
            size={size}
            sx={[getServerSx(state), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
            {...other}
        />
    );
};

