import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import './TheoryPage.css';

const TheoryPage = () => {
    return (
        <PageLayout title="Q-Learning 개념 정리">
            <div className="theory-container">

                {/* Section A: Summary */}
                <Card title="🎯 방금 여러분이 한 활동은 인공지능의 학습 방법 중 하나입니다">
                    <div className="summary-card-content">
                        <p>여러분은 미로를 탐험하면서 <strong>상태를 보고</strong>, <strong>행동을 선택하고</strong>, <strong>보상을 받고</strong>, 그 결과를 기록하고 어떤 선택이 좋은지 토론했습니다.</p>
                        <p>이 과정이 바로 <strong>Q-Learning</strong>이라는 강화학습 방법의 핵심입니다.</p>
                    </div>
                </Card>

                {/* Section B: Definition */}
                <Card title="📘 Q-Learning이란?">
                    <p className="definition-text">
                        Q-Learning은 에이전트가 환경과 상호작용하면서 <strong>Q-Table(점수표)</strong>을 계속 업데이트하여
                        "어떤 상태에서 어떤 행동이 좋은지"를 학습하는 <strong>강화학습(Reinforcement Learning)</strong> 알고리즘입니다.
                    </p>
                    <p className="definition-text">
                        이 학습 방법은 정답이 주어지지 않고, 직접 해보고(시행착오) 보상을 통해 배우는 방식입니다.
                    </p>
                    <div className="highlight-box">
                        💡 이 수업에서는 컴퓨터 대신 <strong>사람이 정책을 판단하는 특별한 방식</strong>으로 Q-Learning을 체험했습니다.
                    </div>
                </Card>

                {/* Section C: Core Elements */}
                <section>
                    <h3 className="theory-section-title">🧠 Q-Learning의 5가지 핵심 요소</h3>
                    <div className="core-elements-grid">
                        <div className="element-card">
                            <div className="element-header">1. 에이전트 (Agent)</div>
                            <div className="element-desc">환경 속에서 행동을 선택하는 주체입니다. 더 많은 보상을 받기 위한 정책(Policy)을 만들려고 합니다.</div>
                            <div className="element-context">👉 이 수업에서는 <strong>여러분 팀</strong>이 바로 에이전트입니다.</div>
                        </div>

                        <div className="element-card">
                            <div className="element-header">2. 환경 (Environment)</div>
                            <div className="element-desc">에이전트가 행동하는 외부 세계입니다.</div>
                            <div className="element-context">👉 이 수업에서는 <strong>미로</strong>가 환경입니다.</div>
                        </div>

                        <div className="element-card">
                            <div className="element-header">3. 상태 (State)</div>
                            <div className="element-desc">에이전트가 현재 보고 있는 상황 정보입니다.</div>
                            <div className="element-context">👉 이 수업에서는 <strong>현재 좌표(Y, X)</strong>가 상태입니다.</div>
                        </div>

                        <div className="element-card">
                            <div className="element-header">4. 행동 (Action)</div>
                            <div className="element-desc">상태에서 선택할 수 있는 움직임입니다.</div>
                            <div className="element-context">👉 이 수업에서는 <strong>Up / Down / Left / Right</strong> 입니다.</div>
                        </div>

                        <div className="element-card">
                            <div className="element-header">5. 보상 (Reward)</div>
                            <div className="element-desc">행동 후 환경이 주는 피드백 점수입니다.</div>
                            <div className="element-context">
                                👉 이 수업에서는:<br />
                                • 벽/장애물: -5점<br />
                                • 정상 이동: -1점<br />
                                • 목표 도착: +10점
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section D: Q-Table */}
                <Card title="📊 Q-Table이란?">
                    <p className="definition-text">
                        Q-Table은 "이 상태에서 이 행동을 하면 얼마나 좋았는가?"를 기록해두는 점수표입니다.
                    </p>
                    <p className="definition-text">
                        여러분이 실습에서 매 Step마다 기록한 표가 바로 Q-Table이며, Q-Learning은 이 표를 점점 더 좋은 값으로 고쳐가며 학습합니다.
                    </p>
                    <div className="highlight-box">
                        💡 오늘 수업에서는 숫자 대신, 사람이 ‘좋은 정책 / 나쁜 정책’을 판단해서 기록했습니다.
                    </div>
                </Card>

                {/* Section E: Connection */}
                <Card title="🔗 오늘 활동 다시 보기">
                    <ul className="connection-list">
                        <li>현재 위치를 보고 (State)</li>
                        <li>어디로 갈지 정하고 (Action)</li>
                        <li>점수를 받고 (Reward)</li>
                        <li>Q-Table에 기록하고</li>
                        <li>이게 좋은 선택인지 토론했다 (Policy 평가)</li>
                    </ul>
                    <div className="connection-summary">
                        이것이 바로 강화학습의 기본 구조이며,<br />
                        여러분은 오늘 인공지능이 학습하는 방식을 사람의 판단으로 체험한 것입니다.
                    </div>
                </Card>

                {/* Section F: Footer Buttons */}
                <div className="theory-footer">
                    <Link to="/" className="btn-home">
                        처음으로 돌아가기
                    </Link>
                    {/* 선택 사항: 다시 실습하기 버튼 */}
                    {/* <Link to="/play" className="btn-restart">
                        다시 실습하기
                    </Link> */}
                </div>

            </div>
        </PageLayout>
    );
};

export default TheoryPage;
