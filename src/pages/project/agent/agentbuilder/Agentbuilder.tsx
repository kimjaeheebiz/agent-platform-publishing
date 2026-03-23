import React from 'react';
import {
    Box,
    Button,
    IconButton,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Tabs,
    Typography,
} from '@mui/material';
import {
    AddCircleOutlineOutlined,
    ChevronLeft,
    CropFreeOutlined,
    RedoOutlined,
    RemoveCircleOutlineOutlined,
    UndoOutlined,
} from '@mui/icons-material';

// Import page-specific types
import { AgentbuilderPageState } from './Agentbuilder.types';

export const Agentbuilder: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: '100%',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    py: '8px',
                    px: '24px',
                    borderTop: '1px solid',
                    borderTopColor: 'divider',
                    borderBottom: '1px solid',
                    borderBottomColor: 'divider',
                }}
            >
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" color="secondary">
                        변수 설정
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        에이전트 설정
                    </Button>
                    <Button variant="contained" size="small" color="inherit">
                        가져오기
                    </Button>
                    <Button variant="contained" size="small" color="inherit">
                        내보내기
                    </Button>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Button variant="contained" size="small" color="inherit">
                        저장 이력
                    </Button>
                    <Button variant="contained" size="small">
                        저장
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        테스트 실행
                    </Button>
                    <Button variant="contained" size="small" color="secondary">
                        노드 추가
                    </Button>
                </Stack>
            </Stack>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Stack>
                    <Paper>
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                                py: '0px',
                                pl: '0px',
                                pr: '16px',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Tabs></Tabs>
                        </Stack>
                    </Paper>
                    <IconButton color="default">
                        <ChevronLeft />
                    </IconButton>
                </Stack>
                <Stack
                    sx={{
                        backgroundColor: 'background.defaultLightgray',
                    }}
                >
                    <Stack>
                        <Menu
                            open
                            slotProps={{ list: { dense: true } }}
                            sx={{
                                width: '160px',
                            }}
                        >
                            <MenuItem
                                dense
                                sx={{
                                    justifyContent: 'center',
                                }}
                            >
                                부드러운 선
                            </MenuItem>
                            <MenuItem
                                dense
                                sx={{
                                    justifyContent: 'center',
                                }}
                            >
                                꺽은 선
                            </MenuItem>
                        </Menu>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Paper
                            sx={{
                                borderRadius: '4px',
                            }}
                        >
                            <Button size="xsmall"></Button>
                        </Paper>
                        <Paper
                            sx={{
                                borderRadius: '4px',
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    borderRadius: '4px',
                                }}
                            >
                                <IconButton color="default">
                                    <CropFreeOutlined />
                                </IconButton>
                                <IconButton color="default">
                                    <AddCircleOutlineOutlined />
                                </IconButton>
                                <IconButton color="default">
                                    <RemoveCircleOutlineOutlined />
                                </IconButton>
                            </Stack>
                        </Paper>
                        <Paper
                            sx={{
                                borderRadius: '4px',
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{
                                    borderRadius: '4px',
                                }}
                            >
                                <IconButton color="default">
                                    <UndoOutlined />
                                </IconButton>
                                <IconButton color="default">
                                    <RedoOutlined />
                                </IconButton>
                            </Stack>
                        </Paper>
                    </Stack>
                    <Stack
                        sx={{
                            p: '8px',
                            backgroundColor: '_components.paper.elevation-0',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '16px',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                color="success"
                                sx={{
                                    height: '32px',
                                }}
                            ></Button>
                            <Typography variant="body2">시작</Typography>
                        </Stack>
                    </Stack>
                    <Stack
                        sx={{
                            p: '8px',
                            backgroundColor: '_components.paper.elevation-0',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '16px',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                color="info"
                                sx={{
                                    height: '32px',
                                }}
                            ></Button>
                            <Typography variant="body2">코드 실행</Typography>
                        </Stack>
                    </Stack>
                    <Stack
                        sx={{
                            p: '8px',
                            backgroundColor: '_components.paper.elevation-0',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '16px',
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                                color="info"
                                sx={{
                                    height: '32px',
                                }}
                            ></Button>
                            <Typography variant="body2">메시지 보내기</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <ListItem>
                    <ListItemText primary="메시지 보내기" />
                </ListItem>
            </Box>
        </Box>
    );
};
