import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';

interface SocketContextType {
  emit: (event: string, data?: unknown) => void;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  off: (event: string, handler?: (...args: unknown[]) => void) => void;
  once: (event: string, handler: (...args: unknown[]) => void) => void;
  connected: boolean;
  socketId: string | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
  roomId: string;
}

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:3001';

export function SocketProvider({ children, roomId }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      query: { roomId },
      transports: ['websocket'],
    });

    socket.on('ping', () => {
      socket.emit('pong');
    });

    socket.on('connect', () => {
      setConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      setSocketId(null);
    });

    socketRef.current = socket;

    return () => {
      socket.off('ping');
      socket.off('connect');
      socket.off('disconnect');
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
      setSocketId(null);
    };
  }, [roomId]);

  const value = useMemo<SocketContextType>(
    () => ({
      emit: (event, data) => {
        socketRef.current?.emit(event, data);
      },
      on: (event, handler) => {
        socketRef.current?.on(event, handler);
      },
      off: (event, handler) => {
        if (handler) {
          socketRef.current?.off(event, handler);
          return;
        }
        socketRef.current?.off(event);
      },
      once: (event, handler) => {
        socketRef.current?.once(event, handler);
      },
      connected,
      socketId,
    }),
    [connected, socketId],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocketContext must be used within SocketProvider');
  return context;
}
