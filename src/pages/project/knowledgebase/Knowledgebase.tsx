import React from 'react';
import {
    Box,
    Button,
    InputAdornment,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Add, MailOutline, Search } from '@mui/icons-material';

// Import page-specific types
import { KnowledgebasePageState } from './Knowledgebase.types';

export const Knowledgebase: React.FC = () => {
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
                    p: '0px',
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        p: '0px',
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            p: '0px',
                        }}
                    >
                        <Typography variant="body1">총 5건</Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                p: '0px',
                            }}
                        >
                            <Select
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MailOutline />
                                    </InputAdornment>
                                }
                                sx={{
                                    width: '160px',
                                }}
                            ></Select>
                            <Select
                                startAdornment={
                                    <InputAdornment position="start">
                                        <MailOutline />
                                    </InputAdornment>
                                }
                                sx={{
                                    width: '160px',
                                }}
                            ></Select>
                        </Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{
                            p: '0px',
                        }}
                    >
                        <TextField
                            size="small"
                            placeholder="지식베이스 이름, 문서 이름, 등록자 이름"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            sx={{
                                width: '360px',
                            }}
                        ></TextField>
                        <Button variant="outlined" size="small">
                            설정
                        </Button>
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            지식베이스 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>지식베이스 이름</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2">지식베이스 이름</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2">지식베이스 이름</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2">지식베이스 이름</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2">지식베이스 이름</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body2">지식베이스 이름</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            honggildong@hecto.co.kr
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack
                                        direction="row"
                                        spacing={0.5}
                                        alignItems="center"
                                        sx={{
                                            p: '0px',
                                        }}
                                    >
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
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
