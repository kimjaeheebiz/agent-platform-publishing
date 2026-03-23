import React from 'react';
import { Chip, ChipProps } from '@mui/material';

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
    local: 'LOCAL',
    dev: 'DEV',
    stage: 'STAGE',
};

const SERVER_COLOR: Record<ServerState, ChipProps['color']> = {
    local: 'success',
    dev: 'info',
    stage: 'warning',
};

function isServerState(value: unknown): value is ServerState {
    return value === 'local' || value === 'dev' || value === 'stage';
}

const getServerLabel = (state?: string): string => {
    const s = state?.toLowerCase() as ServerState | undefined;
    if (isServerState(s)) return SERVER_LABEL[s];
    return state ?? SERVER_LABEL.local;
};

const getServerColor = (state?: string): ChipProps['color'] => {
    const s = state?.toLowerCase() as ServerState | undefined;
    if (isServerState(s)) return SERVER_COLOR[s];
    return 'default';
};

export const ServerChip: React.FC<Props> = ({ state, size = 'small', ...rest }) => {
    return <Chip label={getServerLabel(state)} color={getServerColor(state)} size={size} {...rest} />;
};

