import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Game from '../pages/Game';
import { GameProvider } from '../context/GameContext';
import { SocketProvider } from '../provider/SocketProvider';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/game/:id',
      element: (
        <SocketProvider>
          <GameProvider>
            <Game />
          </GameProvider>
        </SocketProvider>
      ),
    },
  ],
  {
    basename: '/',
  }
);