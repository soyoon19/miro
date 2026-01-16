/**
 * 게임 로직 유틸리티 함수
 */

import { Position, Action, MoveStatus, MazeConfig } from '../types';

// 미로 설정 상수
export const MAZE_CONFIG: MazeConfig = {
  size: 4,
  startPosition: [0, 0],
  exitPosition: [1, 3],
  obstacles: [[3, 0], [1, 1], [0, 3]],
  maxEpisodes: 3,
  maxStepsPerEpisode: 12,
};

/**
 * 행동에 따른 다음 위치 계산
 */
export function calculateNextPosition(
  currentPosition: Position,
  action: Action
): Position {
  const [y, x] = currentPosition;
  
  switch (action) {
    case 'up':
      return [y - 1, x];
    case 'down':
      return [y + 1, x];
    case 'left':
      return [y, x - 1];
    case 'right':
      return [y, x + 1];
    default:
      return currentPosition;
  }
}

/**
 * 위치가 미로 범위 내에 있는지 확인
 */
export function isWithinBounds(position: Position): boolean {
  const [y, x] = position;
  return y >= 0 && y < MAZE_CONFIG.size && x >= 0 && x < MAZE_CONFIG.size;
}

/**
 * 위치가 장애물인지 확인
 */
export function isObstacle(position: Position): boolean {
  const [y, x] = position;
  return MAZE_CONFIG.obstacles.some(([oy, ox]) => oy === y && ox === x);
}

/**
 * 위치가 출구인지 확인
 */
export function isExit(position: Position): boolean {
  const [y, x] = position;
  const [ey, ex] = MAZE_CONFIG.exitPosition;
  return y === ey && x === ex;
}

/**
 * 이동 가능 여부 판정
 */
export function checkMoveValidity(
  currentPosition: Position,
  action: Action
): { isValid: boolean; status: MoveStatus; nextPosition: Position } {
  const nextPosition = calculateNextPosition(currentPosition, action);
  
  // 미로 밖으로 나가는지 확인
  if (!isWithinBounds(nextPosition)) {
    return {
      isValid: false,
      status: '불가능',
      nextPosition: currentPosition, // 제자리 유지
    };
  }
  
  // 장애물인지 확인
  if (isObstacle(nextPosition)) {
    return {
      isValid: false,
      status: '불가능',
      nextPosition: currentPosition, // 제자리 유지
    };
  }
  
  // 정상 이동 가능
  return {
    isValid: true,
    status: '가능',
    nextPosition,
  };
}

/**
 * 보상 계산
 */
export function calculateReward(
  currentPosition: Position,
  action: Action,
  isValid: boolean
): number {
  // 이동 불가능 (미로 밖 또는 장애물)
  if (!isValid) {
    return -5;
  }
  
  const nextPosition = calculateNextPosition(currentPosition, action);
  
  // 출구 도착
  if (isExit(nextPosition)) {
    return 10;
  }
  
  // 정상 이동
  return -1;
}

/**
 * 위치를 문자열로 변환 (예: "0,0")
 */
export function positionToString(position: Position): string {
  return `${position[0]},${position[1]}`;
}

/**
 * 정책 문자열 생성 (예: "(1,0) → down")
 */
export function generatePolicyString(
  currentPosition: Position,
  action: Action
): string {
  return `(${currentPosition[0]},${currentPosition[1]}) → ${action}`;
}
