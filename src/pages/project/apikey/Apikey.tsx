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
import { ApikeyPageState } from './Apikey.types';

export const Apikey: React.FC = () => {
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
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            API 키 추가
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
                                <TableCell>API 키 이름</TableCell>
                                <TableCell>API 키 정보</TableCell>
                                <TableCell>대상 에이전트</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>최근 사용일</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">API 키 이름</TableCell>
                                <TableCell size="small">sk-...33c7</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">API 키 이름</TableCell>
                                <TableCell size="small">sk-...33c7</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">API 키 이름</TableCell>
                                <TableCell size="small">sk-...33c7</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">API 키 이름</TableCell>
                                <TableCell size="small">sk-...33c7</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">API 키 이름</TableCell>
                                <TableCell size="small">sk-...33c7</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
