import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

export type FavoriteButtonProps = {
    /** 선택 상태 (MUI 패턴과 맞추기 위해 selected 사용) */
    selected?: boolean;
    /** 선택 상태 변경 콜백 (controlled 모드에서 사용) */
    onChange?: (selected: boolean) => void;
} & IconButtonProps;

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
    selected,
    onChange,
    onClick,
    ...rest
}) => {
    // onChange가 넘어오면 controlled, 아니면 내부 상태로 토글 (uncontrolled)
    const isControlled = typeof onChange === 'function';
    const [internalFavorite, setInternalFavorite] = React.useState<boolean>(selected ?? false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const current = isControlled && typeof selected === 'boolean' ? selected : internalFavorite;
        const next = !current;

        // 언컨트롤드 모드일 때는 내부 상태만 토글해도 동작
        if (!isControlled) {
            setInternalFavorite(next);
        }

        // 외부에 변경 알림 (선택)
        onChange?.(next);
        onClick?.(e);
    };

    const active = isControlled && typeof selected === 'boolean' ? selected : internalFavorite;

    return (
        <IconButton aria-label={active ? '즐겨찾기 해제' : '즐겨찾기'} onClick={handleClick} size="small" {...rest}>
            {active ? <Star color="primary" /> : <StarBorder />}
        </IconButton>
    );
};
