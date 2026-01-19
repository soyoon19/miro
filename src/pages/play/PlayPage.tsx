/**
 * 실습(Play) 페이지
 * 기존 App.tsx의 게임 로직을 이관
 */

import { useGameLogic } from '../../hooks/useGameLogic';
import PlayView from '../../components/play/PlayView';

function PlayPage() {
    const gameLogic = useGameLogic();

    return <PlayView {...gameLogic} />;
}

export default PlayPage;
