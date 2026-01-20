import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import PathVisualization from '../../components/result/PathVisualization';
import { RunSummary } from '../../types';
import './ResultPage.css';

const ResultPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<RunSummary | null>(null);

    useEffect(() => {
        // Load data from localStorage
        const dataStr = localStorage.getItem('rl_maze_run_summary');
        if (dataStr) {
            try {
                const parsed: RunSummary = JSON.parse(dataStr);
                setSummary(parsed);
            } catch (e) {
                console.error("Failed to parse result data", e);
            }
        }
    }, []);

    const handleGoToTheory = () => {
        navigate('/theory');
    };

    if (!summary) {
        return (
            <PageLayout title="게임 결과">
                <div className="no-data-card">
                    <h2>데이터가 없습니다</h2>
                    <p>아직 실습을 완료하지 않았습니다.</p>
                    <button onClick={handleGoToTheory} className="btn-primary">
                        개념 학습하기
                    </button>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout
            title="게임 결과"
            headerContent={
                summary.teamName ? (
                    <div style={{ textAlign: 'center', color: '#ffffffff', marginTop: '4px' }}>
                        Team: {summary.teamName}
                    </div>
                ) : null
            }
            onNext={handleGoToTheory}
            nextLabel="개념 학습하기"
        >
            <div className="result-container">
                {/* 1. Explorer Reflection Rate */}
                <div className="result-card reflection-card">
                    <h3>탐험가 의견 반영률</h3>
                    <div className="reflection-stats">
                        <div className="main-stat">
                            <span className="stat-value">{summary.explorerRate * 100}%</span>
                            <span className="stat-label">반영률</span>
                        </div>
                        <div className="sub-stats">
                            <div>총 단계: {summary.explorerTotalCount}</div>
                            <div>반영 횟수: {summary.explorerOCount}</div>
                        </div>
                    </div>
                </div>

                {/* 2. Path Visualization */}
                <div className="result-card path-card">
                    <h3>에피소드별 이동 경로</h3>
                    <div className="path-grid-container">
                        {summary.episodes.map((ep) => (
                            <div key={ep.episodeIndex} className="episode-path-panel">
                                <h4>에피소드 {ep.episodeIndex}</h4>
                                <PathVisualization path={ep.path} isSuccess={ep.success} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Summary Table */}
                <div className="result-card summary-table-card">
                    <h3>에피소드 요약</h3>
                    <table className="summary-table">
                        <thead>
                            <tr>
                                <th>에피소드</th>
                                <th>단계</th>
                                <th>누적 점수</th>
                                <th>탈출 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.episodes.map((ep) => (
                                <tr key={ep.episodeIndex}>
                                    <td>{ep.episodeIndex}</td>
                                    <td>{ep.stepsUsed}</td>
                                    <td>{ep.totalScoreEnd}</td>
                                    <td>
                                        <span className={`status-badge ${ep.success ? 'success' : 'fail'}`}>
                                            {ep.success ? 'Success' : 'Fail'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageLayout>
    );
};

export default ResultPage;
