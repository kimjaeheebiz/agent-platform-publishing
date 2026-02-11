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
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        height: '30px',
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                            }}
                        >
                            총 500건
                        </Typography>
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
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            프로젝트 추가
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
                                            1
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
                                            1
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
                                            2025.02.01
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
                                        <Button>소유자 변경</Button>
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
                                            1
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
                                            1
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
                                            2025.02.01
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
                                        <Button>소유자 변경</Button>
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
                                            1
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
                                            1
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
                                            2025.02.01
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
                                        <Button>소유자 변경</Button>
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
                                            1
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
                                            1
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
                                            2025.02.01
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
                                        <Button>소유자 변경</Button>
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
                                            1
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
                                            1
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
                                            2025.02.01
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
                                        <Button>소유자 변경</Button>
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
