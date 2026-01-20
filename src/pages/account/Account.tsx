import React from 'react';
import {
    Box,
    Stack,
    Paper,
    Avatar,
    Typography,
    Chip,
    Card,
    CardHeader,
    CardContent,
    FormControl,
    TextField,
    CardActions,
    Button,
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
                        backgroundColor: '#6200eaff',
                        borderRadius: '4px',
                    }}
                >
                    <Avatar sx={{ width: '80px', height: '80px' }}>
                        <Person />
                    </Avatar>
                    <Stack
                        spacing={4}
                        alignItems="center"
                        sx={{
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#ffffffff',
                            }}
                        >
                            홍길동
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#ffffffff',
                            }}
                        >
                            honggildong@hecto.co.kr
                        </Typography>
                    </Stack>
                    <Chip
                        variant="filled"
                        color="secondary"
                        size="small"
                        sx={{
                            backgroundColor: '#121212ff',
                            borderRadius: '100px',
                        }}
                        label="OP"
                    />
                </Paper>
                <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                        width: '600px',
                        borderRadius: '4px',
                    }}
                >
                    <CardHeader title="계정 정보" subheader="{Subheader}" />
                    <CardContent>
                        <Stack spacing={4}>
                            <Stack spacing={2}>
                                <FormControl
                                    sx={{
                                        flex: 1,
                                    }}
                                ></FormControl>
                                <FormControl
                                    sx={{
                                        flex: 1,
                                    }}
                                ></FormControl>
                            </Stack>
                            <Stack spacing={1}>
                                <Stack>
                                    <Stack direction="row">
                                        <Stack
                                            spacing={4}
                                            sx={{
                                                backgroundColor: '#121212ff',
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    flex: 1,
                                                    color: '#000000ff',
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
                                            }}
                                        >
                                            <Stack></Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        sx={{
                                            flex: 1,
                                        }}
                                    ></TextField>
                                    <TextField
                                        sx={{
                                            flex: 1,
                                        }}
                                    ></TextField>
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
