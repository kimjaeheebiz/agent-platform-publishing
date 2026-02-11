import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';

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
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '360px',
                                backgroundColor: '#ffffffff',
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
                <TableContainer
                    sx={{
                        backgroundColor: '_components.paper.elevation-1',
                    }}
                >
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
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            홍길동
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'info.main',
                                            }}
                                        >
                                            소유자
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            (주)헥토
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            홍길동
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            관리자
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            (주)헥토이노베이션
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            홍길동
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            일반
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            (주)헥토이노베이션
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            홍길동
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            일반
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            (주)헥토이노베이션
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            홍길동
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            일반
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            (주)헥토이노베이션
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                flex: 1,
                                                color: 'text.primary',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>수정</Button>
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
