import React from 'react';
import {
    Box,
    Button,
    Chip,
    IconButton,
    InputAdornment,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Tab,
    TextField,
    Typography,
} from '@mui/material';
import {
    AddCircleOutlineOutlined,
    ContentCopy,
    CropFreeOutlined,
    RedoOutlined,
    RemoveCircleOutlineOutlined,
    Search,
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
                        세션 설정
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        배포 관리
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        스케쥴링 설정
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        비동기 실행 결과
                    </Button>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                    <Button variant="contained" size="small">
                        저장
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        저장 이력
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        가져오기
                    </Button>
                    <Button variant="outlined" size="small" color="secondary">
                        내보내기
                    </Button>
                    <Button variant="outlined" size="small">
                        테스트 실행
                    </Button>
                    <Button variant="contained" size="small" color="secondary">
                        노드 모음
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
                        <Stack spacing={1}>
                            <Stack
                                sx={{
                                    borderBottom: '1px solid',
                                    borderBottomColor: 'divider',
                                }}
                            >
                                <Stack direction="row">
                                    <Tab
                                        sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        label=""
                                    />
                                    <Tab
                                        sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        label=""
                                    />
                                </Stack>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{
                                    py: '0px',
                                    px: '16px',
                                }}
                            >
                                <TextField
                                    size="small"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Search />
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                ></TextField>
                                <Button variant="outlined" size="small">
                                    설정
                                </Button>
                            </Stack>
                            <Stack
                                sx={{
                                    borderTop: '1px solid',
                                    borderTopColor: 'divider',
                                }}
                            >
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    &#123;
                                                </Typography>
                                            </Stack>
                                            <Button size="xsmall"></Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Value
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Value
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Value
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Value
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                                <Stack
                                    sx={{
                                        py: '3px',
                                        px: '0px',
                                        borderBottom: '1px solid',
                                        borderBottomColor: 'divider',
                                    }}
                                >
                                    <Stack
                                        justifyContent="center"
                                        sx={{
                                            py: '4px',
                                            px: '16px',
                                        }}
                                    >
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <Stack direction="row" spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    sx={{
                                                        py: '2px',
                                                        px: '0px',
                                                        backgroundColor: 'text.primary',
                                                    }}
                                                >
                                                    $name
                                                </Stack>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    sx={{
                                                        py: '3px',
                                                        px: '6px',
                                                        height: '18px',
                                                        backgroundColor: 'action.selected',
                                                        borderRadius: '100px',
                                                    }}
                                                >
                                                    <Stack
                                                        justifyContent="center"
                                                        sx={{
                                                            height: '18px',
                                                            backgroundColor: 'text.secondary',
                                                        }}
                                                    >
                                                        <Chip label="" />
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                            <IconButton color="default">
                                                <ContentCopy />
                                            </IconButton>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack direction="row" alignItems="center">
                                                <Typography
                                                    sx={{
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Value
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Paper>
                </Stack>
                <Stack
                    sx={{
                        backgroundColor: 'background.defaultLightgray',
                    }}
                >
                    <Stack></Stack>
                    <Paper
                        sx={{
                            borderRadius: '4px',
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
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
                            spacing={1}
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
                <ListItem
                    sx={{
                        height: '771px',
                    }}
                >
                    <ListItemText primary="메시지 보내기" />
                </ListItem>
            </Box>
        </Box>
    );
};
