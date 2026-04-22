import React, { useEffect, useMemo, useState } from 'react';
import { ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';

export interface FilterOption {
    value: string;
    label: string;
    count: number;
    selected?: boolean;
}

export interface FilterToggleGroupProps {
    /** 미전달 시 빈 그룹으로 렌더 (페이지 자동 생성 시 props 없이 주입되는 경우 방어) */
    options?: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
    size?: 'small' | 'medium' | 'large';
    ariaLabel?: string;
}

export const FilterToggleGroup: React.FC<FilterToggleGroupProps> = ({
    options = [],
    value = '',
    onChange = () => {},
    size = 'medium',
    ariaLabel = '테이블 필터',
}) => {
    const defaultValue = useMemo(
        () => value || options.find((option) => option.selected)?.value || '',
        [options, value],
    );
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== '';
    const selectedValue = isControlled ? value : internalValue;

    useEffect(() => {
        if (!isControlled) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, isControlled]);

    const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        if (newValue !== null) {
            if (!isControlled) {
                setInternalValue(newValue);
            }
            onChange(newValue);
        }
    };

    return (
        <ToggleButtonGroup exclusive value={selectedValue} onChange={handleChange} aria-label={ariaLabel} size={size} color="primary">
            {(options || []).map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={{ gap: 0.5 }}>
                    {option.label}
                    <Chip
                        label={option.count}
                        size="small"
                        color={option.value === selectedValue ? 'primary' : 'default'}
                        sx={{
                            minWidth: '20px',
                            height: '20px',
                            '& .MuiChip-label': {
                                px: '6px',
                            },
                        }}
                    />
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};
