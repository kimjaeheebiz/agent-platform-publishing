import { Grid, Box, Typography, Button, Card, CardContent, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowForward } from '@mui/icons-material';

const HomeContent = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100%', p: 3, gap: 3 }}>
            <Grid container spacing={2} sx={{ minHeight: '100%' }}>
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                프로젝트 / 에이전트
                            </Typography>
                            <Typography sx={{ mb: 2 }}>프로젝트별 에이전트 관리 및 실행</Typography>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/project/project1/agent')}
                            >
                                에이전트
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                어드민 / 프로젝트
                            </Typography>
                            <Typography sx={{ mb: 2 }}>어드민 프로젝트 관리</Typography>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/admin/project')}
                            >
                                프로젝트
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h5" component="h3" gutterBottom>
                                    프로젝트 / 에이전트 / 에이전트 빌더
                                </Typography>
                                <Chip label="작업 중" color="error" size="small" />
                            </Stack>
                            <Typography sx={{ mb: 2 }}>프로젝트별 에이전트의 워크플로우 관리</Typography>
                            <Button
                                variant="contained"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/project/project1/agent/agentbuilder')}
                            >
                                에이전트 빌더
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h5" component="h3" gutterBottom>
                                    계정 정보
                                </Typography>
                                <Chip label="작업 중" color="error" size="small" />
                            </Stack>
                            <Typography sx={{ mb: 2 }}>계정 정보</Typography>
                            <Button variant="contained" endIcon={<ArrowForward />} onClick={() => navigate('/account')}>
                                계정 정보
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                컴포넌트 안내
                            </Typography>
                            <Typography sx={{ mb: 2 }}>주요 컴포넌트 참고</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/guide')}
                            >
                                컴포넌트 안내
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export const Home = () => {
    return <HomeContent />;
};
