import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Person } from '@mui/icons-material';

// Import page-specific types
import { AccountPageState } from './Account.types';

export const Account: React.FC = () => {
    return (
        <Box
            sx={{
                px: 3,
                pt: 3,
                pb: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100%',
            }}
        >
            <Stack direction="row" spacing={3}>
                <Paper
                    elevation={0}
                    sx={{
                        width: '300px',
                        backgroundColor: 'primary.dark',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Stack
                        sx={{
                            py: '0px',
                            px: '75px',
                        }}
                    >
                        <Stack spacing={2} alignItems="center">
                            <Avatar sx={{ width: 80, height: 80, backgroundColor: 'common.white' }}>
                                <Person fontSize="large" sx={{ color: 'primary.dark' }} />
                            </Avatar>
                            <Stack spacing={1} alignItems="center">
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'common.white',
                                    }}
                                >
                                    홍길동
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'common.white',
                                    }}
                                >
                                    honggildong@hecto.co.kr
                                </Typography>
                            </Stack>
                            <Chip
                                label="일반사용자"
                                sx={{ backgroundColor: 'common.black', color: 'common.white' }}
                            />
                        </Stack>
                    </Stack>
                </Paper>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 4,
                        width: '460px',
                    }}
                >
                    <Stack spacing={4}>
                        <Stack spacing={2}>
                            <Typography variant="h5">계정 정보</Typography>
                            <TextField
                                size="medium"
                                label="이름 *"
                                fullWidth
                                defaultValue="홍길동"
                            />
                            <FormControl>
                                <InputLabel id="select-소속--label">소속 *</InputLabel>
                                <Select
                                    labelId="select-소속--label"
                                    value="(주)헥토"
                                    label="소속 *"
                                >
                                    <MenuItem value={`(주)헥토`}>(주)헥토</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack spacing={2}>
                            <Stack spacing={0.5}>
                                <Typography variant="h5">비밀번호 변경</Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                    }}
                                >
                                    최소 8자 이상, 대문자, 소문자, 특수문자를 각각 1개 이상 포함
                                </Typography>
                            </Stack>
                            <TextField type="password" size="medium" label="새 비밀번호" fullWidth />
                            <TextField type="password" size="medium" label="새 비밀번호 확인" fullWidth />
                        </Stack>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <Button variant="contained" color="inherit">
                                취소
                            </Button>
                            <Button variant="contained">저장</Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </Box>
    );
};
