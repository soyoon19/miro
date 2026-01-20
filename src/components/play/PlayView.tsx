import React from 'react';
import { Action, OpinionReflected, PolicyJudgment } from '../../types';
import MazeGrid from '../../components/MazeGrid';
import ControlPanel from '../../components/ControlPanel';
import QTable from '../../components/QTable';
import EpisodeTabs from '../../components/EpisodeTabs';
import PageLayout from '../../components/layout/PageLayout';
import { MAZE_CONFIG } from '../../utils/gameLogic';
import Toast from '../ui/Toast';

interface PlayViewProps {
    gameState: any;

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
    isTutorial?: boolean;
}

const PlayView: React.FC<PlayViewProps> = ({
    gameState,

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
    isTutorial = false
}) => {
    const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);

    React.useEffect(() => {
        if (currentEpisodeInputComplete) {
            if (isExitReached) {
                setToast({ message: '탈출 성공!', type: 'success' });
            } else if (isMaxStepsReached) {
                setToast({ message: '탈출 실패...', type: 'error' });
            }
        }
    }, [currentEpisodeInputComplete, isExitReached, isMaxStepsReached]);

    const nextLabel = gameState.currentEpisode >= MAZE_CONFIG.maxEpisodes ? '결과 보기' : '다음 에피소드로 진행';

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
            onNext={handleNextEpisode}
            nextLabel={nextLabel}
            nextDisabled={!canProceedToNextEpisode}
        >


            <div className="main-content" style={{ flexDirection: 'row', gap: '20px', alignItems: 'flex-start' }}>
                <div className="left-panel">
                    <div data-tutorial-id="maze-grid">
                        <MazeGrid currentPosition={gameState.currentPosition} />
                    </div>
                    <div data-tutorial-id="control-panel">
                        <ControlPanel
                            onAction={handleAction}
                            isDisabled={
                                !isTutorial && ( // 튜토리얼일때는 overlay에서 제어하므로 여기서는 막지 않음 (실제로는 overlay가 막음)
                                    gameState.isGameComplete ||
                                    currentEpisodeFinished ||
                                    !canProceed ||
                                    isExitReached
                                )
                            }
                        />
                    </div>
                </div>

                <div className="right-panel">
                    <EpisodeTabs
                        currentEpisode={viewEpisode}
                        onEpisodeChange={setViewEpisode}
                        episodes={episodes}
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
            {
                toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )
            }
        </PageLayout >
    );
};

export default PlayView;
