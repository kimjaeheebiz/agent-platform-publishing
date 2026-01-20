import React from 'react';
import {
    Box,
    Stack,
    Typography,
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
import { ProjectPageState } from './Project.types';

export const Project: React.FC = () => {
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
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#121212ff',
                            }}
                        >
                            총 5건
                        </Typography>
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
                            프로젝트 추가
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
                                <TableCell>프로젝트</TableCell>
                                <TableCell>에이전트</TableCell>
                                <TableCell>구성원</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>소속</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">2025.02.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">소유자 변경</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">2025.02.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">소유자 변경</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">2025.02.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">소유자 변경</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">2025.02.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토이노베이션</TableCell>
                                <TableCell size="small">소유자 변경</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">1</TableCell>
                                <TableCell size="small">2025.02.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">(주)헥토</TableCell>
                                <TableCell size="small">소유자 변경</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
