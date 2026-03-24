import React from 'react';
import {
    Box,
    Button,
    Chip,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
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
import { Add, MoreVert, Search } from '@mui/icons-material';

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
                    flex: 1,
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1">총 6건</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FormControl
                                sx={{
                                    width: '200px',
                                }}
                            >
                                <InputLabel id="select-확장자-label">확장자</InputLabel>
                                <Select labelId="select-확장자-label" label="확장자">
                                    <MenuItem value={`확장자`}>확장자</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                sx={{
                                    width: '200px',
                                }}
                            >
                                <InputLabel id="select-등록일-label">등록일</InputLabel>
                                <Select labelId="select-등록일-label" label="등록일">
                                    <MenuItem value={`등록일`}>등록일</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                            size="medium"
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
                        />
                        <Button variant="outlined">설정</Button>
                        <Button variant="contained" startIcon={<Add />}>
                            문서 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>문서 이름</TableCell>
                                <TableCell>용량</TableCell>
                                <TableCell>청킹 상태</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.pdf</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99Bit</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            label="완료"
                                            color="success"
                                            size="small"
                                            sx={{
                                                backgroundColor: 'success._states.selected',
                                                color: 'success.main',
                                            }}
                                        />
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
                                            <MoreVert fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.pptx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99Byte</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Chip
                                            label="완료"
                                            color="success"
                                            size="small"
                                            sx={{
                                                backgroundColor: 'success._states.selected',
                                                color: 'success.main',
                                            }}
                                        />
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
                                            <MoreVert fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.docx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99KB</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="오류"
                                        color="error"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'error._states.selected',
                                            color: 'error.main',
                                        }}
                                    />
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
                                            <MoreVert fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.hwp</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99MB</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="오류"
                                        color="error"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'error._states.selected',
                                            color: 'error.main',
                                        }}
                                    />
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
                                            <MoreVert fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.txt</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99GB</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="오류"
                                        color="error"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'error._states.selected',
                                            color: 'error.main',
                                        }}
                                    />
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
                                            <MoreVert fontSize="inherit" />
                                        </IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack
                                            direction="row"
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
                                                    height: '30px',
                                                }}
                                            ></Stack>
                                        </Stack>
                                        <Typography variant="body2">문서 이름.xlsx</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">999.99GB</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label="오류"
                                        color="error"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'error._states.selected',
                                            color: 'error.main',
                                        }}
                                    />
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
                                            <MoreVert fontSize="inherit" />
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
