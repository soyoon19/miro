import React from 'react';
import { Action, OpinionReflected, PolicyJudgment } from '../../types';
import MazeGrid from '../../components/MazeGrid';
import ControlPanel from '../../components/ControlPanel';
import QTable from '../../components/QTable';
import EpisodeTabs from '../../components/EpisodeTabs';
import PageLayout from '../../components/layout/PageLayout';
import { MAZE_CONFIG } from '../../utils/gameLogic';

interface PlayViewProps {
    gameState: any;
    moveStatus: { status: '가능' | '불가능' | null };
    viewEpisode: number;
    setViewEpisode: (episode: number) => void;
    handleAction: (action: Action) => void;
    handleNextEpisode: () => void;
    handleOpinionReflectedChange: (episode: number, step: number, value: OpinionReflected) => void;
    handlePolicyJudgmentChange: (episode: number, step: number, value: PolicyJudgment) => void;
    episodes: any[];
    canProceedToNextEpisode: boolean;
    currentEpisodeFinished: boolean;
    currentEpisodeInputComplete: boolean;
    isExitReached: boolean;
    isMaxStepsReached: boolean;
    canProceed: boolean;
    bestEpisode: any;
    opinionReflectionRate: number;
    isTutorial?: boolean;
}

const PlayView: React.FC<PlayViewProps> = ({
    gameState,
    moveStatus,
    viewEpisode,
    setViewEpisode,
    handleAction,
    handleNextEpisode,
    handleOpinionReflectedChange,
    handlePolicyJudgmentChange,
    episodes,
    canProceedToNextEpisode,
    currentEpisodeFinished,
    currentEpisodeInputComplete,
    isExitReached,
    isMaxStepsReached,
    canProceed,
    bestEpisode,
    opinionReflectionRate,
    isTutorial = false
}) => {
    return (
        <PageLayout
            title="강화학습 미로 탐험 시뮬레이터"
            headerContent={
                <div className="game-info">
                    <div>에피소드: {gameState.currentEpisode} / {MAZE_CONFIG.maxEpisodes}</div>
                    <div>Step: {gameState.currentStep} / {MAZE_CONFIG.maxStepsPerEpisode}</div>
                    <div>Total Score: {gameState.totalScore}</div>
                </div>
            }
        >
            {gameState.isGameComplete && currentEpisodeInputComplete && (
                <div className="game-complete">
                    <h2>🎉 게임 완료!</h2>
                    <div className="final-stats">
                        <p>최종 점수: {gameState.totalScore}</p>
                        {bestEpisode && (
                            <div className="best-episode-stats">
                                <p className="best-episode-title">🏆 최고 점수 에피소드</p>
                                <p>에피소드 {bestEpisode.episode}: {bestEpisode.score}점 ({bestEpisode.moveCount}회 이동)</p>
                                <p className="best-episode-note">이동 횟수가 적으면서 점수가 높은 에피소드가 우수합니다!</p>
                            </div>
                        )}
                        <p className="reflection-rate">
                            탐험가 의견 반영률: {opinionReflectionRate}%
                        </p>
                    </div>
                </div>
            )}

            <div className="main-content" style={{ flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
                <div className="left-panel">
                    <div data-tutorial-id="maze-grid">
                        <MazeGrid currentPosition={gameState.currentPosition} />
                    </div>
                    <div data-tutorial-id="control-panel">
                        <ControlPanel
                            onAction={handleAction}
                            moveStatus={moveStatus.status}
                            isDisabled={
                                !isTutorial && ( // 튜토리얼일때는 overlay에서 제어하므로 여기서는 막지 않음 (실제로는 overlay가 막음)
                                    gameState.isGameComplete ||
                                    currentEpisodeFinished ||
                                    !canProceed ||
                                    isExitReached
                                )
                            }
                            isExitReached={isExitReached}
                            isMaxStepsReached={isMaxStepsReached}
                        />
                    </div>
                </div>

                <div className="right-panel">
                    <EpisodeTabs
                        currentEpisode={viewEpisode}
                        onEpisodeChange={setViewEpisode}
                        episodes={episodes}
                        canProceedToNext={canProceedToNextEpisode}
                        onNextEpisode={handleNextEpisode}
                    />
                    <div data-tutorial-id="q-table">
                        <QTable
                            rows={gameState.qTableRowsByEpisode[viewEpisode] || []}
                            currentEpisode={gameState.currentEpisode}
                            currentStep={gameState.currentStep}
                            onOpinionReflectedChange={handleOpinionReflectedChange}
                            onPolicyJudgmentChange={handlePolicyJudgmentChange}
                            canProceed={canProceed}
                            isExitReached={isExitReached && viewEpisode === gameState.currentEpisode}
                        />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default PlayView;
