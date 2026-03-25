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
    Tab,
    Tabs,
} from '@mui/material';
import {
    AddCircleOutlineOutlined,
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
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%',
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    py: 1,
                    px: 3,
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
                    flex: 1,
                }}
            >
                {/* 변수 목록 패널 */}
                <Paper
                    elevation={0}
                    sx={{
                        width: '360px',
                        borderRight: '1px solid',
                        borderRightColor: 'divider',
                    }}
                >
                    <Tabs value={0} variant="fullWidth" sx={{ borderBottom: '1px solid', borderBottomColor: 'divider' }}>
                        <Tab label="사용자정의 변수" />
                        <Tab label="시스템 변수" />
                    </Tabs>
                </Paper>

                <Box
                    sx={{
                        flex: 1,
                        backgroundColor: 'background.defaultLightgray',
                    }}
                >
                    리액트 플로우 영역
                </Box>
                {/* 노드 목록 패널 */}
                <Paper
                    elevation={4}
                    sx={{
                        width: '360px',
                        borderLeft: '1px solid',
                        borderLeftColor: 'divider',
                    }}
                >
                    노드 목록
                </Paper>
                {/* <Stack
                    sx={{
                        backgroundColor: 'background.defaultLightgray',
                    }}
                >
                    <Stack>
                        <Stack
                            sx={{
                                height: '725px',
                            }}
                        ></Stack>
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
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                부드러운 선
                            </MenuItem>
                            <MenuItem
                                dense
                                sx={{
                                    display: 'flex',
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
                                p: 0.5,
                                backgroundColor: '_components.paper.elevation-3',
                            }}
                        >
                            <Button size="xsmall"></Button>
                        </Paper>
                        <Paper
                            sx={{
                                p: 0.5,
                                backgroundColor: '_components.paper.elevation-3',
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
                                p: 0.5,
                                backgroundColor: '_components.paper.elevation-3',
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
                </Stack> */}
            </Box>
        </Box>
    );
};
