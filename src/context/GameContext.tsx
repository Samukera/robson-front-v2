import { createContext, useContext, type ReactNode } from "react";
import { useGameEngine } from "../hooks/useGameEngine";
import { useSocketContext } from "../provider/SocketProvider";

const GameContext = createContext<ReturnType<typeof useGameEngine> | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const socket = useSocketContext();
  const game = useGameEngine(socket);

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {

  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
