import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';

interface TeamInfo {
    teamName: string;
    agent1: string;
    agent2: string;
    explorer: string;
    recorder: string;
}

const TeamPage = () => {
    const navigate = useNavigate();
    const [teamInfo, setTeamInfo] = useState<TeamInfo>({
        teamName: '',
        agent1: '',
        agent2: '',
        explorer: '',
        recorder: ''
    });

    const [currentStep, setCurrentStep] = useState(0); // 0 to 4 (Total 5 steps)

    // Load from localStorage on mount
    useEffect(() => {
        const savedInfo = localStorage.getItem('rl_maze_team_info');
        if (savedInfo) {
            try {
                setTeamInfo(JSON.parse(savedInfo));
            } catch (e) {
                console.error('Failed to parse team info', e);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTeamInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem('rl_maze_team_info', JSON.stringify(teamInfo));
    };

    const isValid =
        teamInfo.teamName.trim() !== '' &&
        teamInfo.agent1.trim() !== '' &&
        teamInfo.agent2.trim() !== '' &&
        teamInfo.explorer.trim() !== '' &&
        teamInfo.recorder.trim() !== '';

    const handleNext = () => {
        if (currentStep === 1 && !isValid) {
            alert('팀 정보 입력을 완료해주세요.');
            return;
        }

        if (currentStep === 1) {
            handleSave(); // Auto save when moving from form step
        }

        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            navigate('/tutorial');
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
        marginBottom: '15px'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555'
    };

    // Step Content Renderers
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // 역할 설명
                return (
                    <Card title="1. 역할 설명 (4인 1팀)">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: '#E3F2FD', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#1565C0' }}>정책 결정자 (에이전트) - 2명</h4>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                    이동 방향(↑, ↓, ←, →)을 토론하여 최종 결정합니다.<br />
                                    탐험가의 의견과 Q-Table을 참고하여 최적의 행동을 결정합니다.
                                </p>
                            </div>
                            <div style={{ background: '#E8F5E9', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#2E7D32' }}>탐험가 - 1명</h4>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                    위험을 감수하더라도 새로운 경로를 시도하자고 주장합니다.<br />
                                    탐험가는 세게 주장하거나 약하게 주장할 수 있습니다.
                                </p>
                            </div>
                            <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#EF6C00' }}>기록원 - 1명</h4>
                                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                    Q-Table 기록을 담당합니다.<br />
                                    탐험가의 의견 반영 여부와 정책을 판단 결과를 기록합니다.
                                </p>
                            </div>
                        </div>
                    </Card>
                );
            case 1: // 팀 정보 입력
                return (
                    <Card title="2. 팀 정보 입력">
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>팀 이름</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    value={teamInfo.teamName}
                                    onChange={handleChange}
                                    placeholder="예: 미로 정복자"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>정책 결정자 1</label>
                                    <input
                                        type="text"
                                        name="agent1"
                                        value={teamInfo.agent1}
                                        onChange={handleChange}
                                        placeholder="이름 입력"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>정책 결정자 2</label>
                                    <input
                                        type="text"
                                        name="agent2"
                                        value={teamInfo.agent2}
                                        onChange={handleChange}
                                        placeholder="이름 입력"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={labelStyle}>탐험가</label>
                                    <input
                                        type="text"
                                        name="explorer"
                                        value={teamInfo.explorer}
                                        onChange={handleChange}
                                        placeholder="이름 입력"
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>기록원</label>
                                    <input
                                        type="text"
                                        name="recorder"
                                        value={teamInfo.recorder}
                                        onChange={handleChange}
                                        placeholder="이름 입력"
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            case 2: // 게임 규칙 1
                return (
                    <Card title="3-1. 게임 규칙 - 기본">
                        <div>
                            <ul style={{ paddingLeft: '20px', lineHeight: '2.0', fontSize: '1.1rem' }}>
                                <li style={{ marginBottom: '10px' }}><strong>목표:</strong> 시작 지점에서 출발하여 목표 지점(★)에 도착하세요.</li>
                                <li style={{ marginBottom: '10px' }}><strong>행동(Action):</strong> 상(Up), 하(Down), 좌(Left), 우(Right) 중 하나를 선택합니다.</li>
                                <li style={{ marginBottom: '10px' }}><strong>에피소드:</strong> 총 3번의 에피소드를 진행합니다.</li>
                                <li><strong>종료 조건:</strong> 목표 도착(+10점) 또는 최대 12회 행동 시 종료됩니다.</li>
                            </ul>
                        </div>
                    </Card>
                );
            case 3: // 게임 규칙 2
                return (
                    <Card title="3-2. 게임 규칙 - 이동 및 점수">
                        <div>
                            <ul style={{ paddingLeft: '20px', lineHeight: '2.0', fontSize: '1.1rem' }}>
                                <li style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#2196F3' }}>이동 성공 (-1점):</strong><br />
                                    벽이 없는 곳으로 이동하면 1점이 감점됩니다. (시간 비용)
                                </li>
                                <li style={{ marginBottom: '15px' }}>
                                    <strong style={{ color: '#F44336' }}>이동 불가능 (-5점):</strong><br />
                                    미로 밖이나 벽/장애물로 이동을 시도하면 5점이 감점되고, <strong>제자리에 머무릅니다.</strong>
                                </li>
                                <li>
                                    <strong style={{ color: '#4CAF50' }}>목표 도착 (+10점):</strong><br />
                                    목표 지점에 도착하면 10점을 얻고, <strong>즉시 에피소드가 종료됩니다.</strong>
                                </li>
                            </ul>
                        </div>
                    </Card>
                );
            case 4: // 게임 규칙 3
                return (
                    <Card title="3-3. 게임 규칙 - Turn 진행 순서">
                        <div>
                            <ol style={{ paddingLeft: '20px', lineHeight: '2.0', fontSize: '1.1rem', background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
                                <li style={{ marginBottom: '15px' }}><strong>정책 결정자:</strong> 탐험가 의견 + Q-Table을 보고 이동 방향 결정</li>
                                <li style={{ marginBottom: '15px' }}><strong>환경(시스템):</strong> 미로 화면에서 화살표 버튼 클릭 → 결과(이동/점수) 확인</li>
                                <li style={{ marginBottom: '15px' }}><strong>기록원:</strong> 탐험가의 의견 반영 여부와 정책 판단 결과를 협의하여 Q-Table에 결과 기록</li>
                            </ol>
                            <p style={{ textAlign: 'center', marginTop: '30px', fontWeight: 'bold', color: '#2196F3', fontSize: '1.2rem' }}>
                                “3번의 에피소드를 통해 최적의 경로를 탐색해보세요.”
                            </p>
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        if (currentStep === 0) return "역할 분담";
        if (currentStep === 1) return "팀 정보 설정";
        return "규칙 ";
    };

    return (
        <PageLayout
            title="팀 구성 및 규칙"
            headerContent={
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>{getStepTitle()} ({currentStep + 1}/5)</div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', overflow: 'hidden', margin: '0 auto', maxWidth: '300px' }}>
                        <div style={{
                            height: '100%',
                            background: 'white',
                            width: `${((currentStep + 1) / 5) * 100}%`,
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
            }
            maxWidth="800px" // Fixed width as requested
            center={true}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={currentStep === 4 ? '튜토리얼 시작하기' : '다음'}
            nextDisabled={currentStep === 1 && !isValid}
        >

            {renderStepContent()}

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <div style={{ marginBottom: '10px', minHeight: '20px' }}>
                    {currentStep === 1 && !isValid && (
                        <span style={{ color: '#777777ff', fontSize: '0.9rem' }}>
                            모든 정보를 입력해야 다음으로 넘어갈 수 있습니다.
                        </span>
                    )}
                </div>
            </div>
        </PageLayout>
    );
};

export default TeamPage;
