import React from 'react';
import {
    Box,
    Stack,
    Typography,
    TextField,
    InputAdornment,
    Button,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableBody,
    TableFooter,
    TableRow,
    TableCell,
} from '@mui/material';
import { MailOutline, Search, Add, ChevronRight, ChevronLeft } from '@mui/icons-material';

// Import page-specific types
import { CredentialPageState } from './Credential.types';

export const Credential: React.FC = () => {
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
                        <Typography variant="body1">총 5건</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Stack
                                sx={{
                                    backgroundColor: '#ffffff',
                                }}
                            >
                                <Stack
                                    sx={{
                                        p: [0, 6, 0, 1.5],
                                        borderColor: '#000000',
                                        borderWidth: '1px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            p: [3, 0, 3, 0],
                                            backgroundColor: 'text.secondary',
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                height: '24px',
                                            }}
                                        ></Stack>
                                        <Stack></Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Credential 이름, 등록자 이름, 등록자 이메일"
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
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            Credential 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Credential 이름</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">Anthropic account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
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
                                    <Stack direction="row" spacing={0.5} alignItems="center">
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
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">OpenAI account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
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
                                    <Stack direction="row" spacing={0.5} alignItems="center">
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
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">Upstage account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
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
                                    <Stack direction="row" spacing={0.5} alignItems="center">
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
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">MySQL account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
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
                                    <Stack direction="row" spacing={0.5} alignItems="center">
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
                                    <Stack direction="row" spacing={1}>
                                        <Stack
                                            alignItems="center"
                                            justifyContent="center"
                                            sx={{
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    height: '20px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">MySQL account</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
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
                                    <Stack direction="row" spacing={0.5} alignItems="center">
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
