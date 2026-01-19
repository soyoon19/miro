/**
 * Q-Table 컴포넌트
 * 에피소드별 Q-Table을 표시하고 학생 입력을 받음
 */

import { QTableRow, OpinionReflected, PolicyJudgment } from '../types';
import './QTable.css';

interface QTableProps {
  rows: QTableRow[];
  currentEpisode: number;
  currentStep: number;
  onOpinionReflectedChange: (episode: number, step: number, value: OpinionReflected) => void;
  onPolicyJudgmentChange: (episode: number, step: number, value: PolicyJudgment) => void;
  canProceed: boolean;
  isExitReached?: boolean;
}

export default function QTable({
  rows,
  currentEpisode,
  currentStep,
  onOpinionReflectedChange,
  onPolicyJudgmentChange,
  canProceed,
  isExitReached = false,
}: QTableProps) {
  // rows는 이미 현재 에피소드의 행만 포함 (App.tsx에서 필터링됨)
  const episodeRows = rows;

  // 탈출 성공한 step 찾기 (reward === 10인 마지막 행)
  const exitRow = isExitReached
    ? episodeRows.find((row) => row.reward === 10) || episodeRows[episodeRows.length - 1]
    : null;

  // 현재 step의 행 찾기 (현재 에피소드이고 현재 step인 경우)
  // 탈출 성공 시에는 탈출 성공한 step의 입력을 받을 수 있도록 함
  const currentRow = isExitReached && exitRow
    ? exitRow
    : episodeRows.find(
      (row) => row.episode === currentEpisode && row.step === currentStep
    );

  // 표시할 에피소드 번호 (rows에서 가져오거나 currentEpisode 사용)
  const displayEpisode = rows.length > 0 ? rows[0].episode : currentEpisode;

  return (
    <div className="qtable-container">
      <h2>Q-Table (에피소드 {displayEpisode})</h2>

      {!canProceed && currentRow && (
        <div className="warning-message">
          ⚠️ 탐험가 의견 반영 여부와 정책 판단을 모두 선택해야 다음 단계로 진행할 수 있습니다.
        </div>
      )}

      <div className="table-wrapper">
        <table className="qtable">
          <thead>
            <tr>
              <th>에피소드/단계/Step</th>
              <th>현재 좌표</th>
              <th>선택한 행동</th>
              <th>이동 가능 여부</th>
              <th>보상</th>
              <th>이동한 좌표</th>
              <th>누적 점수</th>
              <th>정책</th>
              <th>탐험가 의견 반영 여부</th>
              <th>정책 판단</th>
            </tr>
          </thead>
          <tbody>
            {episodeRows.map((row, index) => {
              // 탈출 성공 시 탈출 성공한 step을 현재 행으로 표시
              const isCurrentRow = isExitReached && exitRow
                ? row.step === exitRow.step && row.episode === exitRow.episode
                : row.episode === currentEpisode && row.step === currentStep;

              return (
                <tr key={index} className={isCurrentRow ? 'current-row' : ''} data-tutorial-qtable-row={isCurrentRow ? 'current' : undefined}>
                  <td>{row.episode} / {row.step}</td>
                  <td>{row.state}</td>
                  <td>{row.action}</td>
                  <td className={row.moveStatus === '가능' ? 'status-possible' : 'status-impossible'}>
                    {row.moveStatus}
                  </td>
                  <td className={row.reward > 0 ? 'reward-positive' : 'reward-negative'}>
                    {row.reward > 0 ? '+' : ''}{row.reward}
                  </td>
                  <td>{row.nextState}</td>
                  <td className="total-score">{row.totalScore}</td>
                  <td>{row.policy}</td>
                  <td>
                    {isCurrentRow ? (
                      <select
                        value={row.opinionReflected}
                        onChange={(e) =>
                          onOpinionReflectedChange(
                            row.episode,
                            row.step,
                            e.target.value as OpinionReflected
                          )
                        }
                        className="select-box"
                        data-tutorial-id="opinion-select"
                      >
                        <option value="">선택</option>
                        <option value="O">O</option>
                        <option value="X">X</option>
                      </select>
                    ) : (
                      <span className={row.opinionReflected === 'O' ? 'selected-o' : 'selected-x'}>
                        {row.opinionReflected || '-'}
                      </span>
                    )}
                  </td>
                  <td>
                    {isCurrentRow ? (
                      <select
                        value={row.policyJudgment}
                        onChange={(e) =>
                          onPolicyJudgmentChange(
                            row.episode,
                            row.step,
                            e.target.value as PolicyJudgment
                          )
                        }
                        className="select-box"
                        data-tutorial-id="policy-select"
                      >
                        <option value="">선택</option>
                        <option value="좋은 정책">좋은 정책</option>
                        <option value="나쁜 정책">나쁜 정책</option>
                      </select>
                    ) : (
                      <span className={row.policyJudgment === '좋은 정책' ? 'judgment-good' : 'judgment-bad'}>
                        {row.policyJudgment || '-'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
