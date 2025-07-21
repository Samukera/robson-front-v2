import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import type { Player, GameFormat, Ticket, Game } from "../types";
import { useParams } from "react-router-dom";

export const useGameEngine = (socket: Socket | null, animateEmoji?: (fromId: string, toId: string, emoji: string) => void) => {
  const { id } = useParams();

  const [players, setPlayers] = useState<Player[]>([]);
  const [self, setSelf] = useState<Player | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showVotes, setShowVotes] = useState(false);
  const [currentVote, setCurrentVote] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [gameFormat, setGameFormat] = useState<GameFormat | null>(null);
  const [closestValue, setClosestValue] = useState<string | null>(null);
  const [averageValue, setAverageValue] = useState<string | null>(null);

  const votingOnName = tickets.find((t) => t.votingOn)?.name || '';

  useEffect(() => {
    if (!socket || !id) return;

    // 🔗 Entrar na sala
    socket.emit("joinRoom", id);

    // 🔗 Emitir nome salvo no localStorage
    const storedName = localStorage.getItem("name");
    if (storedName) {
      socket.emit("name", storedName);
    }

    // 📥 Listeners
    socket.on("update", (game: Game) => {
      console.log("🟢 [Frontend] Recebi update com tickets:");
      game.tickets.forEach((t) =>
        console.log(`- ${t.name}: votingOn = ${t.votingOn}`)
      );

      setPlayers(game.players);
      setTickets((prev) => {
        return game.tickets.map((incoming) => {
          const existing = prev.find((t) => t.id === incoming.id);

          // Se o ticket já tinha score salvo, e o novo vem sem, preserve
          // if (existing && existing.score && !incoming.score) {
          //   return { ...incoming, score: existing.score, average: existing.average, closest: existing.closest };
          // }

          if (existing && hasValidScore(existing) && !hasValidScore(incoming)) {
            return { ...incoming, ...existing };
          }

          return incoming;
        });
      });
      setGameFormat(game.gameType);

      const me = game.players.find(p => p.id === socket.id);
      if (me) setSelf(me);
    });

    socket.on("gameTypes", (gameTypes: GameFormat[]) => {
      localStorage.setItem("gameTypes", JSON.stringify(gameTypes));
    });

    socket.on("show", (results: any) => {
      setCountdown(3);
      setShowVotes(false);

      // Limpa valores atuais antes da contagem
      setClosestValue(null);
      setAverageValue(null);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setShowVotes(true);
            console.log("🟢 [Frontend] Contagem finalizada, mostrando resultados");
            console.log("🟢 [Frontend] Resultados:", results);
            // ✅ Atualiza resultados imediatamente
            setClosestValue(results.closest);
            setAverageValue(results.average);

            setTickets((prevTickets) =>
              prevTickets.map((t) =>
                t.votingOn
                  ? {
                    ...t,
                    score: results.closest,
                    average: results.average,
                    closest: results.closest,
                  }
                  : t
              )
            );

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on("restart", () => {
      setShowVotes(false);
      setCurrentVote(null);
      setClosestValue(null);
      setAverageValue(null);

      // 🧹 Limpar estimativas dos tickets
      setTickets((prevTickets) =>
        prevTickets.map((t) =>
          t.votingOn
            ? { ...t, score: '', average: '', closest: '' } // apenas o ticket atual
            : t // mantém os já concluídos
        )
      );
    });

    socket.on("receiveEmoji", ({ from, to, emoji }) => {
      console.log('Received emoji from', from, 'to', to, emoji);
      if (animateEmoji) {
        animateEmoji(from, to, emoji);
      }
    });

    socket.on("ping", () => {
      socket.emit("pong");
    });

    // 🔌 Cleanup
    return () => {
      socket.off("update");
      socket.off("gameTypes");
      socket.off("show");
      socket.off("restart");
      socket.off("ping");
    };
  }, [socket, id]);



  const sendEmoji = (targetId: string, emoji: string) => {
    socket?.emit('sendEmoji', { to: targetId, emoji });
  };

  const vote = (value: string) => {
    setCurrentVote(value);
    socket?.emit("vote", value);
  };

  const restart = () => {
    socket?.emit("restart");
  };

  const show = () => {
    socket?.emit("show");
  };

  const updateTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets);
    socket?.emit("ticket", newTickets);
  };

  const setName = (name: string, role: 'player' | 'observer' = 'player') => {
    localStorage.setItem("name", name);
    socket?.emit("name", { name, role });
  };

  const updateGameFormat = (format: GameFormat) => {
    setGameFormat(format);
    socket?.emit('gameTypeChanged', format);
  };

  function hasValidScore(ticket: Ticket) {
    return ticket.score !== '' && ticket.score !== null && ticket.score !== undefined;
  }


  return {
    players,
    showVotes,
    currentVote,
    setCurrentVote,
    countdown,
    gameFormat,
    closestValue,
    averageValue,
    tickets,
    votingOnName,
    vote,
    restart,
    show,
    updateTickets,
    setName,
    updateGameFormat,
    self,
    sendEmoji,
  };
};
