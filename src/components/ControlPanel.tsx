/**
 * 제어 패널 컴포넌트
 * 방향 버튼과 이동 판정 메시지를 표시
 */

import { Action, MoveStatus } from '../types';
import './ControlPanel.css';

interface ControlPanelProps {
  onAction: (action: Action) => void;
  moveStatus: MoveStatus | null;
  isDisabled: boolean;
  isExitReached?: boolean;
  isMaxStepsReached?: boolean;
}

export default function ControlPanel({
  onAction,
  moveStatus,
  isDisabled,
  isExitReached = false,
  isMaxStepsReached = false,
}: ControlPanelProps) {
  const actionLabels: Record<Action, string> = {
    up: '↑ Up',
    down: '↓ Down',
    left: '← Left',
    right: '→ Right',
  };
  
  return (
    <div className="control-panel">
      <h3>행동 선택</h3>
      <div className="action-buttons">
        {/* Up 버튼 */}
        <button
          onClick={() => onAction('up')}
          disabled={isDisabled}
          className="action-button action-up"
        >
          {actionLabels.up}
        </button>
        
        {/* Left, Right 버튼 */}
        <div className="action-row">
          <button
            onClick={() => onAction('left')}
            disabled={isDisabled}
            className="action-button action-left"
          >
            {actionLabels.left}
          </button>
          <button
            onClick={() => onAction('right')}
            disabled={isDisabled}
            className="action-button action-right"
          >
            {actionLabels.right}
          </button>
        </div>
        
        {/* Down 버튼 */}
        <button
          onClick={() => onAction('down')}
          disabled={isDisabled}
          className="action-button action-down"
        >
          {actionLabels.down}
        </button>
      </div>
      {isExitReached ? (
        <div className="move-status success exit-success">
          🎉 탈출 성공!
        </div>
      ) : isMaxStepsReached ? (
        <div className="move-status error exit-failed">
          ❌ 탈출 실패
        </div>
      ) : moveStatus !== null && (
        <div className={`move-status ${moveStatus === '가능' ? 'success' : 'error'}`}>
          {moveStatus === '가능' ? '✅ 이동 가능' : '❌ 이동 불가능'}
        </div>
      )}
    </div>
  );
}
