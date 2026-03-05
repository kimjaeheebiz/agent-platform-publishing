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
    Checkbox,
    Chip,
    IconButton,
} from '@mui/material';
import { MailOutline, Search, ChevronLeft, ChevronRight, Add, MoreVert } from '@mui/icons-material';

// Import page-specific types
import { DocumentPageState } from './Document.types';

export const Document: React.FC = () => {
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
                        <Typography variant="body1">총 6건</Typography>
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
                            placeholder="문서 이름, 등록자 이름"
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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>용량</TableCell>
                                <TableCell>청킹 상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.pdf</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99Bit</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Chip label="완료" color="success" size="small" />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.pptx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99Byte</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Stack>
                                        <Chip label="완료" color="success" size="small" />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2025.01.01
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.docx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99KB</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Chip label="오류" color="error" size="small" />
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.hwp</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99MB</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Chip label="오류" color="error" size="small" />
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.txt</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99GB</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Chip label="오류" color="error" size="small" />
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell size="small">
                                    <Checkbox size="small" />
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Button></Button>
                                        <Typography variant="body2">문서 이름.xlsx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">999.99GB</Typography>
                                </TableCell>
                                <TableCell size="small">
                                    <Chip label="오류" color="error" size="small" />
                                </TableCell>
                                <TableCell size="small">
                                    <Typography variant="body2">2025.01.01</Typography>
                                </TableCell>
                                <TableCell size="small">
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
                                <TableCell size="small">
                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            다운로드
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            이동
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="secondary">
                                            수정
                                        </Button>
                                        <Button variant="outlined" size="xsmall" color="error">
                                            삭제
                                        </Button>
                                        <IconButton color="default">
                                            <MoreVert />
                                        </IconButton>
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
