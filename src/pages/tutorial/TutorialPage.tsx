import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const TutorialPage = () => {
    return (
        <PageLayout title="튜토리얼">
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>🚧 준비 중입니다</h2>
                <p style={{ margin: '20px 0', color: '#666' }}>튜토리얼 페이지가 개발 중입니다.</p>
                <Link
                    to="/play"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    다음: 실습 시작하기 ▶
                </Link>
            </div>
        </PageLayout>
    );
};

export default TutorialPage;
