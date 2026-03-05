import React from 'react';
import {
    Box,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
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
    Typography,
} from '@mui/material';
import { Search, Add, ChevronRight, ChevronLeft } from '@mui/icons-material';
import { FilterToggleGroup, StatusChip } from '@/components';

// Import page-specific types
import { UsersPageState } from './Users.types';

export const Users: React.FC = () => {
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
                        <FilterToggleGroup />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl
                            size="small"
                            sx={{
                                width: '160px',
                            }}
                        >
                            <InputLabel id="select-소속-label">소속</InputLabel>
                            <Select
                                labelId="select-소속-label"
                                value="전체"
                                size="small"
                                label="소속"
                            >
                                <MenuItem value={`전체`}>전체</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            placeholder="사용자 이름, 사용자 이메일"
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
                            사용자 추가
                        </Button>
                    </Stack>
                </Stack>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>사용자</TableCell>
                                <TableCell>소속</TableCell>
                                <TableCell>권한</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록일</TableCell>
                                <TableCell>최근 로그인</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">(주)헥토</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">관리자</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status="active" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
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
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">일반사용자</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status="stop" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
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
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">(주)헥토</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">일반사용자</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status="active" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
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
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">(주)헥토이노베이션</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">일반사용자</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status="active" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
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
                                    <Stack>
                                        <Typography variant="body2">홍길동</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            2eb8fa4703f4482a93f281e07232bdcb
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">(주)헥토</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">일반사용자</Typography>
                                </TableCell>
                                <TableCell>
                                    <StatusChip status="active" />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">2025.01.01</Typography>
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
