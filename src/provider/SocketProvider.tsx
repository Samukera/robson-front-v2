import { createContext, useContext, type ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();

  // ✅ Se id ainda não foi carregado, não renderiza nada ou renderiza loader
  if (!id) return null;

  const socket = useSocket({ roomId: id });

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context.socket;
};
