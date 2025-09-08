import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";

export function useSocket({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const s = io("/", {
      path: "/socket.io",                 // Apache proxy
      transports: ["websocket", "polling"],
      query: { roomId },
    });
    setSocket(s);
    return () => { s.close(); setSocket(null); };
  }, [roomId]);

  return socket;
}
