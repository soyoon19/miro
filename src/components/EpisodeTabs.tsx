/**
 * 에피소드 탭 컴포넌트
 * 3개 에피소드 간 전환
 */

import './EpisodeTabs.css';

interface EpisodeTabsProps {
  currentEpisode: number;
  onEpisodeChange: (episode: number) => void;
  episodes: Array<{
    episode: number;
    isComplete: boolean;
    isFinished: boolean;
    canProceedToNext: boolean;
  }>;
}

export default function EpisodeTabs({
  currentEpisode,
  onEpisodeChange,
  episodes,
}: EpisodeTabsProps) {
  return (
    <div className="episode-tabs">
      <h3>에피소드</h3>
      <div className="tabs">
        {episodes.map((ep) => (
          <button
            key={ep.episode}
            onClick={() => onEpisodeChange(ep.episode)}
            className={`tab ${currentEpisode === ep.episode ? 'active' : ''} ${ep.isComplete ? 'complete' : ''
              }`}
          >
            에피소드 {ep.episode}
            {ep.isComplete && ' ✓'}
          </button>
        ))}
      </div>
    </div>
  );
}
