import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = ({
  roomId,
}: {
  roomId?: string;
} = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      query: roomId ? { roomId } : {},
    });

    newSocket.on('room', (newRoomId) => {
      console.log('Received new roomId from backend:', newRoomId);
      // redirecionar para a nova sala
      window.location.href = `/game/${newRoomId}`; // ajuste conforme sua rota
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  return socket;
};
