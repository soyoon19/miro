import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '../../components/ui/Button';
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

    const [isSaved, setIsSaved] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedInfo = localStorage.getItem('rl_maze_team_info');
        if (savedInfo) {
            try {
                setTeamInfo(JSON.parse(savedInfo));
                // If data exists, consider it effectively saved properly unless user changes it, 
                // but explicit save action confirms it. 
                // We'll leave isSaved false initially to encourage checking/saving, 
                // or we could check validity. Let's keep it simple.
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
        setIsSaved(false); // Reset saved status on change
    };

    const handleSave = () => {
        localStorage.setItem('rl_maze_team_info', JSON.stringify(teamInfo));
        setIsSaved(true);
        alert('저장되었습니다.'); // Simple alert as toast replacement for now
    };

    const isValid =
        teamInfo.teamName.trim() !== '' &&
        teamInfo.agent1.trim() !== '' &&
        teamInfo.agent2.trim() !== '' &&
        teamInfo.explorer.trim() !== '' &&
        teamInfo.recorder.trim() !== '';

    const handleNext = () => {
        if (isValid) {
            navigate('/tutorial');
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

    return (
        <PageLayout
            title="팀 구성 및 규칙"
            maxWidth="1200px"
        >
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                    4인 1팀으로 역할을 나누고, 미로 탐험 규칙을 확인합니다.
                </p>
                <div style={{ marginTop: '10px' }}>
                    <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                        ← 처음으로 돌아가기
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>

                {/* Section 1: Role Description */}
                <Card title="1. 역할 설명 (4인 1팀)">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ background: '#E3F2FD', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#1565C0' }}>정책 결정자 (에이전트) - 2명</h4>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                이동 방향(↑, ↓, ←, →)을 토론하여 최종 결정합니다.<br />
                                탐험가의 의견과 Q-Table을 참고하여 최선의 선택을 합니다.
                            </p>
                        </div>
                        <div style={{ background: '#E8F5E9', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#2E7D32' }}>탐험가 - 1명</h4>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                ‘탐험가 의견 반영 여부(O/X)’ 판단을 담당합니다.<br />
                                에이전트가 새로운 길을 가보려 했는지, 확신을 가졌는지 판단합니다.
                            </p>
                        </div>
                        <div style={{ background: '#FFF3E0', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: '#EF6C00' }}>기록원 - 1명</h4>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>
                                Q-Table 기록 및 ‘정책 판단(좋은/나쁜)’ 입력을 담당합니다.<br />
                                결과에 따른 보상과 변화를 기록합니다.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Section 2: Team Info Form */}
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

                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleSave} variant="secondary" size="md">
                                정보 저장하기
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Section 3: Game Rules */}
                <Card title="3. 게임 규칙" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        <div>
                            <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>기본 규칙</h4>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                <li><strong>목표:</strong> 시작 지점에서 출발하여 목표 지점(★)에 도착하세요.</li>
                                <li><strong>행동(Action):</strong> 상(Up), 하(Down), 좌(Left), 우(Right) 중 하나를 선택합니다.</li>
                                <li><strong>말하기 규칙:</strong> "현재 상태 (Y, X)에서 [Action]을 시도합니다" 라고 크게 말하세요.</li>
                                <li><strong>에피소드:</strong> 총 3번의 에피소드를 진행합니다.</li>
                                <li><strong>종료 조건:</strong> 목표 도착(+10점) 또는 최대 12회 행동 시 종료됩니다.</li>
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>이동 및 점수</h4>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                <li><strong>이동 성공:</strong> -1점 (시간 비용), 캐릭터가 해당 방향으로 이동</li>
                                <li><strong>이동 불가능:</strong> -5점 (벽/장애물/맵 밖), 제자리 유지</li>
                                <li><strong>목표 도착:</strong> +10점, 즉시 해당 에피소드 종료</li>
                            </ul>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Turn 진행 순서</h4>
                            <ol style={{ paddingLeft: '20px', lineHeight: '1.8', background: '#f9f9f9', padding: '15px 40px', borderRadius: '8px' }}>
                                <li><strong>정책 결정자:</strong> 탐험가 의견 + Q-Table을 보고 이동 방향 결정</li>
                                <li><strong>환경(시스템):</strong> 미로 화면에서 화살표 버튼 클릭 → 결과(이동/점수) 확인</li>
                                <li><strong>기록원:</strong> Q-Table에 결과 기록, 정책 판단(좋은/나쁜) 입력</li>
                                <li><strong>탐험가:</strong> 이번 행동이 모험적이었는지 의견 반영 여부 체크</li>
                            </ol>
                            <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', color: '#2196F3' }}>
                                “이 게임은 빨리 깨는 것보다 선택의 근거를 설명하는 것이 중요합니다.”
                            </p>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Footer CTA */}
            <div style={{ marginTop: '40px', textAlign: 'center', paddingBottom: '40px' }}>
                <div style={{ marginBottom: '10px' }}>
                    {!isValid && (
                        <span style={{ color: '#F44336', fontSize: '0.9rem' }}>
                            팀 이름과 모든 역할 이름을 입력해야 다음으로 진행할 수 있습니다.
                        </span>
                    )}
                </div>
                <Button
                    onClick={handleNext}
                    disabled={!isValid}
                    size="lg"
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        opacity: isValid ? 1 : 0.5
                    }}
                >
                    다음: 튜토리얼로 이동 ▶
                </Button>
            </div>
        </PageLayout>
    );
};

export default TeamPage;
