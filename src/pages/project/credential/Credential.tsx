import React from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
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
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FilterToggleGroup
                            options={[
                                { value: 'all', label: '전체', count: 5, selected: true },
                                { value: 'option1', label: '나의 에이전트', count: 2 },
                                { value: 'option2', label: '즐겨찾기', count: 1 },
                            ]}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Select
                                sx={{
                                    width: '160px',
                                }}
                            ></Select>
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
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Credential 이름</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">Anthropic account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">OpenAI account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">Upstage account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">MySQL account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">MySQL account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
