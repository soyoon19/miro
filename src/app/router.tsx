import { createBrowserRouter } from 'react-router-dom';
import StartPage from '../pages/start/StartPage';
import PlayPage from '../pages/play/PlayPage';
import TeamPage from '../pages/team/TeamPage';
import TutorialPage from '../pages/tutorial/TutorialPage';
import ResultPage from '../pages/result/ResultPage';
import TheoryPage from '../pages/theory/TheoryPage';

const router = createBrowserRouter([
    {
        path: '/',
        element: <StartPage />,
    },
    {
        path: '/team',
        element: <TeamPage />,
    },
    {
        path: '/tutorial',
        element: <TutorialPage />,
    },
    {
        path: '/play',
        element: <PlayPage />,
    },
    {
        path: '/result',
        element: <ResultPage />,
    },
    {
        path: '/theory',
        element: <TheoryPage />,
    },
]);

export default router;
