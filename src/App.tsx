/**
 * 메인 App 컴포넌트
 * 전체 게임 상태 관리 및 컴포넌트 통합
 */

import { useState, useCallback } from 'react';
import { Action, QTableRow, GameState, OpinionReflected, PolicyJudgment } from './types';
import { MAZE_CONFIG, checkMoveValidity, calculateReward, positionToString, generatePolicyString } from './utils/gameLogic';
import MazeGrid from './components/MazeGrid';
import ControlPanel from './components/ControlPanel';
import QTable from './components/QTable';
import EpisodeTabs from './components/EpisodeTabs';
import './App.css';

function App() {
  // 게임 상태
  const [gameState, setGameState] = useState<GameState>({
    currentPosition: MAZE_CONFIG.startPosition,
    currentEpisode: 1,
    currentStep: 0,
    totalScore: 0,
    isEpisodeComplete: false,
    isGameComplete: false,
    qTableRowsByEpisode: {}, // 에피소드별 Q-table 저장
  });


  const [viewEpisode, setViewEpisode] = useState(1); // Q-Table에서 보는 에피소드


  /**
   * 다음 step으로 진행 가능한지 확인
   */
  const canProceedToNextStep = useCallback((episode: number, step: number): boolean => {
    const episodeRows = gameState.qTableRowsByEpisode[episode] || [];
    const currentRow = episodeRows.find((row) => row.step === step);

    if (!currentRow) return false;

    return (
      currentRow.opinionReflected !== '' &&
      currentRow.policyJudgment !== ''
    );
  }, [gameState.qTableRowsByEpisode]);

  /**
   * 행동 처리
   */
  const handleAction = useCallback((action: Action) => {
    // 게임이 완료된 경우 무시
    if (gameState.isGameComplete) {
      return;
    }

    // 현재 step의 입력이 완료되지 않았으면 무시
    if (gameState.currentStep > 0 && !canProceedToNextStep(gameState.currentEpisode, gameState.currentStep)) {
      return;
    }

    // 12번째 step을 초과하면 더 이상 행동 선택 불가
    if (gameState.currentStep >= MAZE_CONFIG.maxStepsPerEpisode) {
      return;
    }

    const { isValid, status, nextPosition } = checkMoveValidity(
      gameState.currentPosition,
      action
    );

    const reward = calculateReward(gameState.currentPosition, action, isValid);
    const newTotalScore = gameState.totalScore + reward;
    const newStep = gameState.currentStep + 1;

    // 이동 판정 메시지 표시
    setMoveStatus({ status });

    // 출구 도착 확인
    const reachedExit = isValid &&
      nextPosition[0] === MAZE_CONFIG.exitPosition[0] &&
      nextPosition[1] === MAZE_CONFIG.exitPosition[1];

    // Q-Table 행 추가
    const newRow: QTableRow = {
      episode: gameState.currentEpisode,
      step: newStep,
      state: positionToString(gameState.currentPosition),
      action,
      moveStatus: status,
      reward,
      nextState: positionToString(nextPosition),
      totalScore: newTotalScore,
      policy: generatePolicyString(gameState.currentPosition, action),
      opinionReflected: '',
      policyJudgment: '',
    };

    // 에피소드별 Q-table에 추가
    const currentEpisodeRows = gameState.qTableRowsByEpisode[gameState.currentEpisode] || [];
    const newQTableRowsByEpisode = {
      ...gameState.qTableRowsByEpisode,
      [gameState.currentEpisode]: [...currentEpisodeRows, newRow],
    };

    // 에피소드 완료 여부 확인 (12번째 step 도달 또는 출구 도착)
    const reachedMaxSteps = newStep >= MAZE_CONFIG.maxStepsPerEpisode;
    const isEpisodeComplete = reachedExit || reachedMaxSteps;
    const isGameComplete = isEpisodeComplete && gameState.currentEpisode >= MAZE_CONFIG.maxEpisodes;

    setGameState({
      // 에피소드 완료 시에도 미로 위치는 유지 (다음 에피소드로 넘어갈 때 리셋)
      currentPosition: nextPosition,
      currentEpisode: gameState.currentEpisode,
      // 탈출 성공 또는 12번째 step 도달 시에도 마지막 step 번호 유지 (입력 받기 위해)
      currentStep: newStep,
      totalScore: newTotalScore,
      isEpisodeComplete: isGameComplete, // 게임 완료 시에만 true
      isGameComplete,
      qTableRowsByEpisode: newQTableRowsByEpisode,
    });
  }, [gameState, canProceedToNextStep]);

  /**
   * 탐험가 의견 반영 여부 변경
   */
  const handleOpinionReflectedChange = useCallback((
    episode: number,
    step: number,
    value: OpinionReflected
  ) => {
    setGameState((prev) => {
      const episodeRows = prev.qTableRowsByEpisode[episode] || [];
      const updatedRows = episodeRows.map((row) =>
        row.step === step
          ? { ...row, opinionReflected: value }
          : row
      );
      return {
        ...prev,
        qTableRowsByEpisode: {
          ...prev.qTableRowsByEpisode,
          [episode]: updatedRows,
        },
      };
    });
  }, []);

  /**
   * 정책 판단 변경
   */
  const handlePolicyJudgmentChange = useCallback((
    episode: number,
    step: number,
    value: PolicyJudgment
  ) => {
    setGameState((prev) => {
      const episodeRows = prev.qTableRowsByEpisode[episode] || [];
      const updatedRows = episodeRows.map((row) =>
        row.step === step
          ? { ...row, policyJudgment: value }
          : row
      );
      return {
        ...prev,
        qTableRowsByEpisode: {
          ...prev.qTableRowsByEpisode,
          [episode]: updatedRows,
        },
      };
    });
  }, []);

  /**
   * 에피소드가 완료되었는지 확인 (12번째 step 도달 또는 출구 도착)
   */
  const isEpisodeFinished = useCallback((episode: number): boolean => {
    const episodeRows = gameState.qTableRowsByEpisode[episode] || [];
    if (episodeRows.length === 0) return false;

    // 출구 도착 확인
    const reachedExit = episodeRows.some((row) => row.reward === 10);
    // 12번째 step 도달 확인
    const reachedMaxSteps = episodeRows.some((row) => row.step >= MAZE_CONFIG.maxStepsPerEpisode);

    return reachedExit || reachedMaxSteps;
  }, [gameState.qTableRowsByEpisode]);

  /**
   * 에피소드의 모든 입력이 완료되었는지 확인
   */
  const isEpisodeInputComplete = useCallback((episode: number): boolean => {
    const episodeRows = gameState.qTableRowsByEpisode[episode] || [];
    if (episodeRows.length === 0) return false;

    // 모든 행의 입력이 완료되었는지 확인
    return episodeRows.every(
      (row) => row.opinionReflected !== '' && row.policyJudgment !== ''
    );
  }, [gameState.qTableRowsByEpisode]);

  /**
   * 다음 에피소드로 넘어가기
   */
  const handleNextEpisode = useCallback(() => {
    if (gameState.currentEpisode >= MAZE_CONFIG.maxEpisodes) {
      return;
    }

    const nextEpisode = gameState.currentEpisode + 1;
    setGameState((prev) => ({
      ...prev,
      currentEpisode: nextEpisode,
      currentPosition: MAZE_CONFIG.startPosition,
      currentStep: 0,
      isEpisodeComplete: false,
    }));
    setViewEpisode(nextEpisode);
    setMoveStatus({ status: null });
  }, [gameState.currentEpisode]);

  /**
   * 에피소드별 최종 점수와 이동 횟수 계산
   */
  const getEpisodeStats = useCallback((episode: number): { score: number; moveCount: number } => {
    const episodeRows = gameState.qTableRowsByEpisode[episode] || [];
    if (episodeRows.length === 0) {
      return { score: 0, moveCount: 0 };
    }

    const lastRow = episodeRows[episodeRows.length - 1];
    return {
      score: lastRow.totalScore,
      moveCount: episodeRows.length,
    };
  }, [gameState.qTableRowsByEpisode]);

  /**
   * 최고 점수 에피소드 찾기
   */
  const getBestEpisode = useCallback((): { episode: number; score: number; moveCount: number } | null => {
    let bestEpisode = null;
    let bestScore = -Infinity;

    for (let i = 1; i <= MAZE_CONFIG.maxEpisodes; i++) {
      const stats = getEpisodeStats(i);
      if (stats.moveCount > 0 && stats.score > bestScore) {
        bestScore = stats.score;
        bestEpisode = { episode: i, score: stats.score, moveCount: stats.moveCount };
      }
    }

    return bestEpisode;
  }, [getEpisodeStats]);

  /**
   * 탐험가 의견 반영률 계산
   */
  const calculateOpinionReflectionRate = useCallback((): number => {
    // 모든 에피소드의 행을 합침
    const allRows = Object.values(gameState.qTableRowsByEpisode).flat();
    const totalSteps = allRows.length;
    if (totalSteps === 0) return 0;

    const reflectedSteps = allRows.filter(
      (row) => row.opinionReflected === 'O'
    ).length;

    return Math.round((reflectedSteps / totalSteps) * 100);
  }, [gameState.qTableRowsByEpisode]);

  // 에피소드 정보 생성
  const episodes = Array.from({ length: MAZE_CONFIG.maxEpisodes }, (_, i) => {
    const episodeNum = i + 1;
    const finished = isEpisodeFinished(episodeNum);
    const inputComplete = isEpisodeInputComplete(episodeNum);
    return {
      episode: episodeNum,
      isComplete: finished && inputComplete,
      isFinished: finished,
      canProceedToNext: finished && inputComplete && episodeNum < MAZE_CONFIG.maxEpisodes,
    };
  });

  // 현재 에피소드가 완료되고 입력도 완료되었는지 확인
  const currentEpisodeFinished = isEpisodeFinished(gameState.currentEpisode);
  const currentEpisodeInputComplete = isEpisodeInputComplete(gameState.currentEpisode);
  const canProceedToNextEpisode = currentEpisodeFinished && currentEpisodeInputComplete &&
    gameState.currentEpisode < MAZE_CONFIG.maxEpisodes;

  // 탈출 성공 여부 확인 (현재 에피소드의 마지막 step이 출구 도착인지)
  const episodeRows = gameState.qTableRowsByEpisode[gameState.currentEpisode] || [];
  const lastRow = episodeRows[episodeRows.length - 1];
  const isExitReached = lastRow?.reward === 10;

  // 12번 step 도달했는데 탈출하지 못한 경우 확인
  const isMaxStepsReached = currentEpisodeFinished && !isExitReached;

  // 탈출 성공 시 탈출 성공한 step의 입력 완료 여부 확인
  const exitStepComplete = isExitReached && lastRow
    ? lastRow.opinionReflected !== '' && lastRow.policyJudgment !== ''
    : true;

  const canProceed = gameState.currentStep === 0 ||
    canProceedToNextStep(gameState.currentEpisode, gameState.currentStep) ||
    (isExitReached && exitStepComplete);

  // 최고 점수 에피소드 정보
  const bestEpisode = getBestEpisode();

  return (
    <div className="app">
      <header className="app-header">
        <h1>강화학습 미로 탐험 시뮬레이터</h1>
        <div className="game-info">
          <div>에피소드: {gameState.currentEpisode} / {MAZE_CONFIG.maxEpisodes}</div>
          <div>Step: {gameState.currentStep} / {MAZE_CONFIG.maxStepsPerEpisode}</div>
          <div>Total Score: {gameState.totalScore}</div>
        </div>
      </header>

      {gameState.isGameComplete && (
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
              탐험가 의견 반영률: {calculateOpinionReflectionRate()}%
            </p>
          </div>
        </div>
      )}

      <div className="main-content">
        <div className="left-panel">
          <MazeGrid currentPosition={gameState.currentPosition} />
          <ControlPanel
            onAction={handleAction}
            isDisabled={
              gameState.isGameComplete ||
              currentEpisodeFinished ||
              !canProceed ||
              isExitReached // 탈출 성공 시 행동 선택 비활성화
            }
          />
        </div>

        <div className="right-panel">
          <EpisodeTabs
            currentEpisode={viewEpisode}
            onEpisodeChange={setViewEpisode}
            episodes={episodes}
          />
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
  );
}

export default App;
