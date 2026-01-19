import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameLogic } from '../../hooks/useGameLogic';
import PlayView from '../../components/play/PlayView';
import TutorialOverlay from '../../components/tutorial/TutorialOverlay';
import { Action, OpinionReflected, PolicyJudgment } from '../../types';

const TutorialPage = () => {
    const navigate = useNavigate();
    const gameLogic = useGameLogic();
    const [tutorialStep, setTutorialStep] = useState(1);

    // Step 1: Start/Position (Click Confirm)
    // Step 2: Action (Wait for click) -> Step 2.5: Result -> Step 3
    // Step 3: Opinion (Wait for select)
    // Step 4: Policy (Wait for select) -> Completed

    // Wrappers to track user interaction for tutorial progress

    const handleActionWrapper = (action: Action) => {
        if (tutorialStep === 2) {
            gameLogic.handleAction(action);
            // Move to Step 3 (Result Confirmation)
            setTutorialStep(3);
        }
    };

    const handleOpinionWrapper = (episode: number, step: number, value: OpinionReflected) => {
        if (tutorialStep === 4) {
            gameLogic.handleOpinionReflectedChange(episode, step, value);
            if (value !== '') {
                setTutorialStep(5);
            }
        }
    };

    const handlePolicyWrapper = (episode: number, step: number, value: PolicyJudgment) => {
        if (tutorialStep === 5) {
            gameLogic.handlePolicyJudgmentChange(episode, step, value);
            if (value !== '') {
                setTutorialStep(6); // Completed
            }
        }
    };

    // Overlay Configuration based on step
    let targetSelector = null;
    let guideText = null;
    let showNextButton = false;
    let placement: 'right' | 'bottom' | 'top' = 'right';

    switch (tutorialStep) {
        case 1:
            targetSelector = '[data-tutorial-id="maze-grid"]';
            guideText = (
                <>
                    <p><strong>초록색 칸</strong>이 시작 지점입니다.</p>
                    <p><strong>파란색 테두리</strong>가 현재 위치입니다.</p>
                </>
            );
            showNextButton = true;
            break;
        case 2:
            targetSelector = '[data-tutorial-id="control-panel"]';
            guideText = (
                <>
                    <p>과연 장애물은 어디 있을까요?</p>
                    <p><strong>위, 아래, 왼쪽, 오른쪽</strong> 중 이동할 방향을 선택하세요.</p>
                </>
            );
            showNextButton = false; // Action button click triggers next
            break;
        case 3:
            targetSelector = '[data-tutorial-qtable-row="current"]';
            guideText = (
                <>
                    <p>행동 결과가 <strong>Q-Table</strong>에 기록되었습니다!</p>
                    <p>다음 단계로 넘어가볼까요?</p>
                </>
            );
            showNextButton = true;
            placement = 'top';
            break;
        case 4:
            targetSelector = '[data-tutorial-id="opinion-select"]';
            guideText = (
                <>
                    <p>이번 행동에 <strong>탐험가의 의견</strong>이 반영되었나요?</p>
                    <p><strong>O</strong> 또는 <strong>X</strong>를 선택해보세요.</p>
                </>
            );
            showNextButton = false; // Select change triggers next
            placement = 'top';
            break;
        case 5:
            targetSelector = '[data-tutorial-id="policy-select"]';
            guideText = (
                <>
                    <p>팀 회의를 통해 <strong>정책 판단</strong>을 내려주세요.</p>
                    <p><strong>좋은 정책</strong>인지 <strong>나쁜 정책</strong>인지 선택하면 튜토리얼이 완료됩니다.</p>
                </>
            );
            showNextButton = false; // Select change triggers next
            placement = 'top';
            break;
        default:
            targetSelector = null;
    }

    return (
        <>
            <PlayView
                {...gameLogic}
                handleAction={handleActionWrapper}
                handleOpinionReflectedChange={handleOpinionWrapper}
                handlePolicyJudgmentChange={handlePolicyWrapper}
                isTutorial={true}
            />
            <TutorialOverlay
                step={Math.floor(tutorialStep)}
                targetSelector={targetSelector}
                guideText={guideText}
                showNextButton={showNextButton}
                onNext={() => setTutorialStep(prev => prev + 1)}
                isCompleted={tutorialStep === 6}
                placement={placement}
                onComplete={() => navigate('/play')}
            />
        </>
    );
};

export default TutorialPage;
