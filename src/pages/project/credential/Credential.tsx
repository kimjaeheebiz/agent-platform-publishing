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
    Checkbox,
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
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'text.primary',
                            }}
                        >
                            총 5건
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Stack
                                sx={{
                                    backgroundColor: '#ffffffff',
                                }}
                            >
                                <Stack
                                    sx={{
                                        p: [0, 6, 0, 12],
                                        borderColor: '#000000ff',
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
                            variant="outlined"
                            size="small"
                            sx={{
                                width: '360px',
                                backgroundColor: '#ffffffff',
                            }}
                        ></TextField>
                        <Button variant="contained" size="small" startIcon={<Add />}>
                            Credential 추가
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
                                <TableCell></TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack
                                        sx={{
                                            height: '20px',
                                        }}
                                    >
                                        <Checkbox size="small" />
                                    </Stack>
                                    <Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    backgroundColor: '#ffffffff',
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
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.primary',
                                                }}
                                            >
                                                Anthropic account
                                            </Typography>
                                        </Stack>
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
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack
                                        sx={{
                                            height: '20px',
                                        }}
                                    >
                                        <Checkbox size="small" />
                                    </Stack>
                                    <Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    backgroundColor: '#ffffffff',
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
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'text.primary',
                                                }}
                                            >
                                                OpenAI account
                                            </Typography>
                                        </Stack>
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
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack
                                        sx={{
                                            height: '20px',
                                        }}
                                    >
                                        <Checkbox size="small" />
                                    </Stack>
                                    <Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    backgroundColor: '#ffffffff',
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
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.primary',
                                                }}
                                            >
                                                Upstage account
                                            </Typography>
                                        </Stack>
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
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack
                                        sx={{
                                            height: '20px',
                                        }}
                                    >
                                        <Checkbox size="small" />
                                    </Stack>
                                    <Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    backgroundColor: '#ffffffff',
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
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.primary',
                                                }}
                                            >
                                                MySQL account
                                            </Typography>
                                        </Stack>
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
                                        <Button>수정</Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Stack
                                        sx={{
                                            height: '20px',
                                        }}
                                    >
                                        <Checkbox size="small" />
                                    </Stack>
                                    <Stack>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Stack
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    backgroundColor: '#ffffffff',
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
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.primary',
                                                }}
                                            >
                                                MySQL account
                                            </Typography>
                                        </Stack>
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
                                        <Button>수정</Button>
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
