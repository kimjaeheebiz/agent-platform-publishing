import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    Select,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';

// Import page-specific types
import { AgentPageState } from './Agent.types';

export const Agent: React.FC = () => {
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
                                <TableCell>즐겨찾기</TableCell>
                                <TableCell>소속 프로젝트</TableCell>
                                <TableCell>에이전트</TableCell>
                                <TableCell>설명</TableCell>
                                <TableCell>수정일</TableCell>
                                <TableCell>소유자</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">Typography</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">에이전트 설명입니다.</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">다운로드</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">Typography</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">에이전트 설명입니다.</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">다운로드</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">Typography</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">에이전트 설명입니다.</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">다운로드</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">Typography</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">에이전트 설명입니다.</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">다운로드</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">Typography</TableCell>
                                <TableCell size="small">프로젝트 이름</TableCell>
                                <TableCell size="small">에이전트 이름</TableCell>
                                <TableCell size="small">에이전트 설명입니다.</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">OP</TableCell>
                                <TableCell size="small">다운로드</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};
