import React, { useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Chip,
    FormControl,
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
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { FolderOutlined, FormatAlignLeft, Search, StarSharp } from '@mui/icons-material';
import { FavoriteButton, FilterToggleGroup, StatusChip } from '@/components';

// Import page-specific types
import { AgentPageState } from './Agent.types';

export const Agent: React.FC = () => {
    const [value, setValue] = useState<string | null>('value2');
    const handleChange = (_e: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setValue(newValue);
    };
    const [value2, setValue2] = useState<string | null>('test2');
    const handleChange2 = (_e: React.MouseEvent<HTMLElement>, newValue: string | null) => {
        setValue2(newValue);
    };

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
                        <FilterToggleGroup
                            options={[
                                { value: 'all', label: '전체', count: 5, selected: true },
                                { value: 'my', label: '나의 에이전트', count: 2 },
                                { value: 'favorites', label: '즐겨찾기', count: 1 },
                            ]}
                        />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FormControl
                            size="small"
                            sx={{
                                width: '160px',
                            }}
                        >
                            <InputLabel id="select-소속-프로젝트-label">소속 프로젝트</InputLabel>
                            <Select
                                labelId="select-소속-프로젝트-label"
                                value="전체"
                                size="small"
                                label="소속 프로젝트"
                            >
                                <MenuItem value={`전체`}>전체</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            placeholder="에이전트 이름, 등록자 이름, 등록자 이메일"
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
                    </Stack>
                </Stack>
                <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>즐겨찾기</TableCell>
                                <TableCell>에이전트</TableCell>
                                <TableCell>설명</TableCell>
                                <TableCell>소속 프로젝트</TableCell>
                                <TableCell>상태</TableCell>
                                <TableCell>등록자</TableCell>
                                <TableCell>수정일</TableCell>
                                <TableCell>관리</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">
                                    <FavoriteButton selected />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">에이전트 이름</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">에이전트 설명입니다.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">소속 프로젝트 이름</Typography>
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
                                    <StatusChip status="active" />
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
                                            복제
                                        </Button>
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
                                <TableCell align="center">
                                    <FavoriteButton />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">에이전트 이름</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">에이전트 설명입니다.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">소속 프로젝트 이름</Typography>
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
                                    <StatusChip status="stop" />
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
                                            복제
                                        </Button>
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
                                <TableCell align="center">
                                    <FavoriteButton />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">에이전트 이름</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">에이전트 설명입니다.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">소속 프로젝트 이름</Typography>
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
                                    <StatusChip status="undeployed" />
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
                                            복제
                                        </Button>
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
                                <TableCell align="center">
                                    <FavoriteButton />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">에이전트 이름</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">에이전트 설명입니다.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">소속 프로젝트 이름</Typography>
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
                                    <StatusChip status="inactive" />
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
                                            복제
                                        </Button>
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
                                <TableCell align="center">
                                    <FavoriteButton />
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">에이전트 이름</Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'text.disabled',
                                            }}
                                        >
                                            17c5b92ee94c438ead1ef8a613269b76
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">에이전트 설명입니다.</Typography>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography variant="body2">소속 프로젝트 이름</Typography>
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
                                    <StatusChip status="inactive" />
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
                                            복제
                                        </Button>
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
                <ToggleButtonGroup exclusive value={value} onChange={handleChange}>
                    <ToggleButton value="value1">
                        <FolderOutlined />
                    </ToggleButton>
                    <ToggleButton value="value2">
                        <FolderOutlined />
                    </ToggleButton>
                    <ToggleButton value="value3">
                        <FolderOutlined />
                    </ToggleButton>
                    <ToggleButton value="value4" disabled>
                        <FolderOutlined />
                    </ToggleButton>
                    <ToggleButton value="value5" disabled>
                        <FolderOutlined />
                    </ToggleButton>
                    <ToggleButton value="value6">
                        <FormatAlignLeft />
                    </ToggleButton>
                </ToggleButtonGroup>
                <ToggleButtonGroup exclusive size="small" value={value2} onChange={handleChange2}>
                    <ToggleButton value="test1" size="small">
                        Value 1
                        <Chip label="Chip" size="small" />
                    </ToggleButton>
                    <ToggleButton value="test2" size="small">
                        <StarSharp />
                        Value 2
                        <Chip label="2" size="small" />
                    </ToggleButton>
                    <ToggleButton value="test3" size="small">
                        <StarSharp />
                        Value 3
                        <Chip label="33" size="small" />
                    </ToggleButton>
                    <ToggleButton value="test4" size="small" disabled>
                        Value 4
                        <Chip label="44" size="small" />
                    </ToggleButton>
                    <ToggleButton value="test5" size="small" disabled>
                        <StarSharp />
                        Value 5
                        <Chip label="55" size="small" />
                    </ToggleButton>
                    <ToggleButton value="test6" size="small">
                        <StarSharp />
                        Value 6
                        <Chip label="66" size="small" />
                    </ToggleButton>
                </ToggleButtonGroup>
                <Stack direction="row" spacing={1}>
                    <ButtonGroup variant="contained">
                        <Button variant="contained">111</Button>
                        <Button variant="contained">222</Button>
                        <Button variant="contained">333</Button>
                    </ButtonGroup>
                    <ButtonGroup color="secondary">
                        <Button variant="outlined" size="small" color="secondary">
                            444
                        </Button>
                        <Button variant="outlined" size="small" color="secondary">
                            555
                        </Button>
                        <Button variant="outlined" size="small" color="secondary">
                            666
                        </Button>
                    </ButtonGroup>
                </Stack>
            </Box>
        </Box>
    );
};
