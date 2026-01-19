import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const TheoryPage = () => {
    return (
        <PageLayout title="강화학습 개념">
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>🚧 준비 중입니다</h2>
                <p style={{ margin: '20px 0', color: '#666' }}>Q-Learning 및 강화학습 이론 설명 페이지가 개발 중입니다.</p>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    처음으로 돌아가기
                </Link>
            </div>
        </PageLayout>
    );
};

export default TheoryPage;
