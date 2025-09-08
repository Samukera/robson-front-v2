import { createContext, useContext, type ReactNode } from "react";
import type { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";

interface SocketContextType { socket: Socket | null }
const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { id } = useParams();
  const socket = useSocket({ roomId: id ?? "" }); // só conecta quando id existir
  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocketContext must be used within a SocketProvider");
  return ctx.socket; // Socket | null
};
