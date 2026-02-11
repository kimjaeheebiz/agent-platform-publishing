import { Grid, Box, Typography, Button, Card, CardContent } from '@mui/material';
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
                                에이전트
                            </Typography>
                            <Typography sx={{ mb: 2 }}>프로젝트별 워크플로우 관리 및 실행</Typography>
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
                                계정 정보
                            </Typography>
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
                <Grid size={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" component="h3" gutterBottom>
                                Test
                            </Typography>
                            <Typography color="error.main" sx={{ mb: 2 }}>페이지 자동 생성 (컴포넌트 매핑 개발 중)</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/test')}
                            >
                                Test
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
