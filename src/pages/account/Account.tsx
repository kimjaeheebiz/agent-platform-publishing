import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    FormControl,
    Paper,
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
                p: 3,
                minHeight: '100%',
            }}
        >
            <Stack direction="row" spacing={3}>
                <Paper
                    sx={{
                        width: '300px',
                        borderRadius: '4px',
                    }}
                >
                    <Avatar
                        sx={{ width: 40, height: 40, backgroundColor: 'common.white_states.main' }}
                    >
                        <Person />
                    </Avatar>
                    <Stack
                        spacing={0.5}
                        alignItems="center"
                        sx={{
                            backgroundColor: '#ffffff',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'common.white_states.main',
                            }}
                        >
                            홍길동
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'common.white_states.main',
                            }}
                        >
                            honggildong@hecto.co.kr
                        </Typography>
                    </Stack>
                    <Chip label="일반사용자" color="secondary" size="small" />
                </Paper>
                <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                        width: '600px',
                        borderRadius: '4px',
                    }}
                >
                    <CardHeader title="계정 정보" subheader="{Subheader}" hasAction />
                    <CardContent>
                        <Stack spacing={4}>
                            <Stack spacing={2}>
                                <FormControl></FormControl>
                                <FormControl></FormControl>
                            </Stack>
                            <Stack spacing={1}>
                                <Stack>
                                    <Stack direction="row">
                                        <Stack
                                            spacing={0.5}
                                            sx={{
                                                backgroundColor: 'text.primary',
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                }}
                                            >
                                                최소 8자 이상, 대문자, 소문자, 특수문자를 각각 1개
                                                이상 포함
                                            </Typography>
                                        </Stack>
                                        <Stack
                                            spacing={3}
                                            sx={{
                                                height: '12px',
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            <Stack></Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <TextField label="새 비밀번호">새 비밀번호</TextField>
                                    <TextField label="새 비밀번호 확인">새 비밀번호 확인</TextField>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" color="secondary">
                            취소
                        </Button>
                        <Button variant="contained">저장</Button>
                    </CardActions>
                </Card>
            </Stack>
        </Box>
    );
};
