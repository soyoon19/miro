import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';

const StartPage = () => {
    const navigate = useNavigate();

    return (
        <PageLayout maxWidth="1000px">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                padding: '20px',
                width: '100%'
            }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '3rem', color: '#333', marginBottom: '16px' }}>
                        미로로 배우는 강화학습
                    </h1>
                    <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: '1.6' }}>
                        에이전트가 미로를 탈출하는 과정을 통해<br />
                        <strong> Q-learning 기반 강화학습</strong>을 직접 체험할 수 있습니다.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={() => navigate('/team')}
                        style={{ minWidth: '200px' }}
                    >
                        팀 구성 및 규칙 시작하기 ▶
                    </Button>
                </div>
            </div>
        </PageLayout>
    );
};

export default StartPage;
