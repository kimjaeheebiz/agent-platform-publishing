import React from 'react';
import {
    Box,
    Stack,
    Tabs,
    TextField,
    Button,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';

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
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            에이전트 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer
                    component={Paper}
                    elevation={0}
                    variant="outlined"
                    sx={{
                        backgroundColor: '_components.paper.elevation-1',
                    }}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>즐겨찾기</TableCell>
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
                                <TableCell>
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Button>다운로드</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack alignItems="center" justifyContent="center">
                                        <Button></Button>
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
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
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            sx={{
                                                backgroundColor: '#ffffffff',
                                            }}
                                            label="OP"
                                        />
                                    </Stack>
                                </TableCell>
                                <TableCell>
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
