import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    Select,
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
import { UsersPageState } from './Users.types';

export const Users: React.FC = () => {
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
                        height: '30px',
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
                        <Select
                            size="small"
                            sx={{
                                width: '160px',
                            }}
                        ></Select>
                        <TextField
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '360px',
                            }}
                        ></TextField>
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            사용자 추가
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
                                <TableCell>사용자</TableCell>
                                <TableCell>소속</TableCell>
                                <TableCell>권한</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>최근 로그인</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">관리자</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">일반사용자</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">일반사용자</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">일반사용자</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">일반사용자</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
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
