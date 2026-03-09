import React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Add, Close, Search } from '@mui/icons-material';
import { FilterToggleGroup } from '@/components';

// Import page-specific types
import { CredentialPageState } from './Credential.types';

export const Credential: React.FC = () => {
    return (
        <Box
            sx={{
                p: 3,
                minHeight: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        height: '30px',
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">총 5건</Typography>
                        <FilterToggleGroup
                            options={[
                                { value: 'all', label: '전체', count: 5, selected: true },
                                { value: 'option1', label: '나의 에이전트', count: 2 },
                                { value: 'option2', label: '즐겨찾기', count: 1 },
                            ]}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FormControl
                                size="small"
                                sx={{
                                    width: '160px',
                                }}
                            >
                                <InputLabel id="select-Credential-유형-label">
                                    Credential 유형
                                </InputLabel>
                                <Select
                                    labelId="select-Credential-유형-label"
                                    value="anthropic"
                                    size="small"
                                    label="Credential 유형"
                                >
                                    <MenuItem value={`anthropic`}>anthropic</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                size="small"
                                sx={{
                                    width: '160px',
                                }}
                            >
                                <InputLabel id="select-Credential-유형-label">
                                    Credential 유형
                                </InputLabel>
                                <Select
                                    labelId="select-Credential-유형-label"
                                    value="anthropic, openai, upstage"
                                    size="small"
                                    label="Credential 유형"
                                >
                                    <MenuItem value={`anthropic, openai, upstage`}>
                                        anthropic, openai, upstage
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <Button size="small" color="error" startIcon={<Close />}>
                                필터 초기화
                            </Button>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl
                            size="small"
                            sx={{
                                width: '160px',
                            }}
                        >
                            <InputLabel id="select-항목명-label">항목명</InputLabel>
                            <Select
                                labelId="select-항목명-label"
                                value="전체"
                                size="small"
                                label="항목명"
                            >
                                <MenuItem value={`전체`}>전체</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            placeholder="Credential 이름, 등록자 이름, 등록자 이메일"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                width: '360px',
                            }}
                        ></TextField>
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            Credential 추가
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};
