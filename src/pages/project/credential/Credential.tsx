import React from 'react';
import {
    Box,
    Stack,
    Typography,
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
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#121212ff',
                            }}
                        >
                            총 5건
                        </Typography>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                                alignItems: 'center',
                            }}
                        >
                            <Stack>
                                <Stack
                                    sx={{
                                        padding: '0px 6px 0px 12px',
                                        borderColor: '#000000ff',
                                        borderWidth: '1px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            alignItems: 'center',
                                            padding: '3px 0px 3px 0px',
                                            backgroundColor: '#000000ff',
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
                            Credential 추가
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
                                <TableCell></TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">Anthropic account</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">OpenAI account</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">Upstage account</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">MySQL account</TableCell>
                                <TableCell size="small">2025.01.01</TableCell>
                                <TableCell size="small">홍길동</TableCell>
                                <TableCell size="small">수정</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">MySQL account</TableCell>
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
