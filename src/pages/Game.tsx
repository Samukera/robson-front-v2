import GameLayout from '../components/layout/GameLayout';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketProvider, useSocketContext } from '../provider/SocketProvider';
import { GameProvider } from '../context/GameContext';
import { I18nProvider } from '../context/I18nContext';

function GameRoom() {
  const navigate = useNavigate();
  const { once, off } = useSocketContext();

  useEffect(() => {
    const handleRoom = (newRoomId: string) => {
      if (newRoomId) {
        navigate(`/game/${newRoomId}`, { replace: true });
      }
    };

    once('room', handleRoom as (...args: unknown[]) => void);

    return () => {
      off('room', handleRoom as (...args: unknown[]) => void);
    };
  }, [navigate, off, once]);

  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
}

export default function Game() {
  const { id } = useParams<{ id: string }>();
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    setRoomId(id || 'undefined');
  }, [id]);

  if (!roomId) return null;

  return (
    <I18nProvider>
      <SocketProvider roomId={roomId}>
        <GameRoom />
      </SocketProvider>
    </I18nProvider>
  );
}
