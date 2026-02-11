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
    Button,
    Typography,
    Chip,
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
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        height: '30px',
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Tabs
                            sx={{
                                borderRadius: '4px',
                            }}
                        ></Tabs>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Select
                            size="small"
                            sx={{
                                width: '160px',
                                backgroundColor: '#ffffffff',
                            }}
                        ></Select>
                        <TextField
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '360px',
                                backgroundColor: '#ffffffff',
                            }}
                        ></TextField>
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
                                <TableCell size="small">
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
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
                                            프로젝트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
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
                                            에이전트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
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
                                            에이전트 설명입니다.
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
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
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
                                            프로젝트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
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
                                            에이전트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
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
                                            에이전트 설명입니다.
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
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
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
                                            프로젝트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
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
                                            에이전트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
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
                                            에이전트 설명입니다.
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
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
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
                                            프로젝트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
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
                                            에이전트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
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
                                            에이전트 설명입니다.
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
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
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
                                            프로젝트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
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
                                            에이전트 이름
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                flex: 1,
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
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
                                            에이전트 설명입니다.
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
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Button>다운로드</Button>
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
