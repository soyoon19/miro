import React from 'react';
import { EpisodePath } from '../../types';
import './PathVisualization.css';

interface PathVisualizationProps {
    path: EpisodePath[];
    isSuccess: boolean;
}

const PathVisualization: React.FC<PathVisualizationProps> = ({ path, isSuccess }) => {
    // 4x4 그리드 생성
    const grid = Array(4).fill(null).map(() => Array(4).fill(null));

    return (
        <div className="path-grid">
            {grid.map((row, y) => (
                <div key={y} className="path-row">
                    {row.map((_, x) => {
                        // 해당 좌표의 path 정보 찾기
                        const step = path.find(p => p.y === y && p.x === x);
                        const isStart = y === 0 && x === 0;
                        const isExit = y === 1 && x === 3;

                        let className = 'path-cell';
                        if (step) className += ' visited';
                        if (isStart) className += ' start';

                        return (
                            <div key={`${y}-${x}`} className={className}>
                                {isStart && <span className="cell-marker">S</span>}
                                {step && !isStart && <span className="step-number">{step.stepIndex}</span>}
                            </div>
                        );
                    })}
                </div>
            ))}
            <div className={`result-badge ${isSuccess ? 'success' : 'fail'}`}>
                {isSuccess ? 'Success' : 'Fail'}
            </div>
        </div>
    );
};

export default PathVisualization;
