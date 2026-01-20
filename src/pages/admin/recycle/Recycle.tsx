import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';

// Import page-specific types
import { RecyclePageState } from './Recycle.types';

export const Recycle: React.FC = () => {
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
                        <TextField
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '360px',
                            }}
                        ></TextField>
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
                                <TableCell>소속 프로젝트</TableCell>
                                <TableCell>리소스 유형</TableCell>
                                <TableCell>리소스 이름</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>삭제일</TableCell>
                                <TableCell>삭제 실행자</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">프로젝트</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">복원</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">복원</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">지식베이스</TableCell>
                                <TableCell size="small">지식베이스 이름</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">복원</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">지식베이스 문서</TableCell>
                                <TableCell size="small">문서 이름</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">복원</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">프로젝트</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">복원</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
