/**
 * 미로 그리드 컴포넌트
 * 4x4 그리드를 표시하고 현재 위치만 파란색 테두리로 표시
 * 출구와 장애물은 시각화하지 않음
 */

import { Position } from '../types';
import { MAZE_CONFIG } from '../utils/gameLogic';
import './MazeGrid.css';

interface MazeGridProps {
  currentPosition: Position;
}

export default function MazeGrid({ currentPosition }: MazeGridProps) {
  const [currentY, currentX] = currentPosition;
  const [startY, startX] = MAZE_CONFIG.startPosition;
  
  // 4x4 그리드 생성
  const grid = [];
  for (let y = 0; y < MAZE_CONFIG.size; y++) {
    for (let x = 0; x < MAZE_CONFIG.size; x++) {
      const isCurrentPosition = y === currentY && x === currentX;
      const isStartPosition = y === startY && x === startX;
      
      grid.push(
        <div
          key={`${y}-${x}`}
          className={`maze-cell ${
            isCurrentPosition ? 'current-position' : ''
          } ${
            isStartPosition ? 'start-position' : ''
          }`}
        >
          {isCurrentPosition && (
            <div className="position-indicator"></div>
          )}
          {isStartPosition && !isCurrentPosition && (
            <div className="start-indicator">시작</div>
          )}
        </div>
      );
    }
  }
  
  return (
    <div className="maze-container">
      <h2>미로</h2>
      <div className="maze-grid">
        {grid}
      </div>
      <div className="maze-info">
        <p>좌표계: (X, Y)</p>
        <p>현재 위치: ({currentY}, {currentX})</p>
      </div>
    </div>
  );
}
