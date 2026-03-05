import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    TextField,
    InputAdornment,
    Button,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
    Typography,
} from '@mui/material';
import { Search, ChevronLeft, ChevronRight, Add } from '@mui/icons-material';

// Import page-specific types
import { MemberPageState } from './Member.types';

export const Member: React.FC = () => {
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
                        <Tabs
                            sx={{
                                borderRadius: '4px',
                            }}
                        ></Tabs>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="사용자 이름, 사용자 이메일"
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
                        <Button variant="outlined" size="small" color="info">
                            소유자 변경
                        </Button>
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            구성원 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>구성원 이름</TableCell>
                                <TableCell>구성원 권한</TableCell>
                                <TableCell>소속</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'info.main',
                                        }}
                                    >
                                        소유자
                                    </Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">(주)헥토</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Typography variant="body2">관리자</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Typography variant="body2">일반</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Typography variant="body2">일반</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Typography variant="body2">일반</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
