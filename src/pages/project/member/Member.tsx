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
                <Stack
                    direction="row"
                    spacing={393}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <Tabs
                            sx={{
                                borderRadius: '4px',
                            }}
                        ></Tabs>
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            variant="outlined"
                            size="small"
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
                <TableContainer
                    sx={{
                        backgroundColor: '#ffffffff',
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
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">소유자</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">관리자</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">일반</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">일반</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">일반</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
