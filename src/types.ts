/**
 * 강화학습 시뮬레이터 타입 정의
 */

// 좌표 타입 (Y, X)
export type Position = [number, number];

// 가능한 행동
export type Action = 'up' | 'down' | 'left' | 'right';

// 이동 가능 여부
export type MoveStatus = '가능' | '불가능';

// 탐험가 의견 반영 여부
export type OpinionReflected = 'O' | 'X' | '';

// 정책 판단
export type PolicyJudgment = '좋은 정책' | '나쁜 정책' | '';

// Q-Table의 각 행 데이터
export interface QTableRow {
  episode: number;
  step: number;
  state: string; // "Y,X" 형식
  action: Action;
  moveStatus: MoveStatus;
  reward: number;
  nextState: string; // "Y,X" 형식
  totalScore: number;
  policy: string; // 예: "(1,0) → down"
  opinionReflected: OpinionReflected;
  policyJudgment: PolicyJudgment;
}

// 게임 상태
export interface GameState {
  currentPosition: Position;
  currentEpisode: number;
  currentStep: number;
  totalScore: number;
  isEpisodeComplete: boolean;
  isGameComplete: boolean;
  qTableRowsByEpisode: Record<number, QTableRow[]>; // 에피소드별 Q-table 저장
}

// 미로 설정
export interface MazeConfig {
  size: number; // 4x4
  startPosition: Position; // [0, 0]
  exitPosition: Position; // [1, 3] - 시각화하지 않음
  obstacles: Position[]; // [[3,0], [1,1], [0,3]] - 시각화하지 않음
  maxEpisodes: number; // 3
  maxStepsPerEpisode: number; // 12
}
