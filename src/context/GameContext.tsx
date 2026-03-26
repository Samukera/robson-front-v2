import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSocketContext } from '../provider/SocketProvider';
import type {
  EmojiBurst,
  GameType,
  Player,
  ScoreTimeItem,
  ShowPayload,
  Ticket,
  UpdatePayload,
  VoteValue,
} from '../types/game';

type Role = 'player' | 'observer';

interface GameContextType {
  players: Player[];
  tickets: Ticket[];
  showVotes: boolean;
  currentVote: VoteValue | null;
  countdown: number;
  gameFormat: GameType;
  gameTypes: GameType[];
  closestValue: VoteValue | null;
  averageValue: VoteValue | null;
  votingOnName: string | null;
  scoreTime: ScoreTimeItem[];
  scoreTimeDraft: ScoreTimeItem[];
  isHydrated: boolean;
  revealCountdown: number;
  emojiBursts: EmojiBurst[];
  restart: () => void;
  show: () => void;
  nextTicket: () => void;
  resetCurrent: () => void;
  vote: (card: VoteValue) => void;
  setName: (name: string, role: Role) => void;
  self: Player | null;
  updateGameFormat: (format: GameType) => void;
  selectTicket: (ticketId: string) => void;
  setTickets: (items: Ticket[]) => void;
  setScoreTime: (items: ScoreTimeItem[]) => void;
  addScoreTime: () => void;
  removeScoreTime: (index: number) => void;
  requestScoreTime: () => void;
  sendEmoji: (to: string, emoji: string) => void;
  clearEmoji: (id: string) => void;
  setScoreTimeDraft: (items: ScoreTimeItem[]) => void;
  flushScoreTimeDraft: (items: ScoreTimeItem[]) => void;
  addTask: () => void;
  updateTaskName: (id: string, name: string) => void;
  removeTask: (id: string) => void;
  exportTasksCsv: () => void;
  connected: boolean;
  isObserver: boolean;
}

const DEFAULT_GAME_TYPE: GameType = {
  name: 'Fibonacci',
  values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '☕'],
};

const GameContext = createContext<GameContextType | null>(null);

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { on, off, emit, connected, socketId } = useSocketContext();

  const [players, setPlayers] = useState<Player[]>([]);
  const [tickets, setTicketsState] = useState<Ticket[]>([]);
  const [gameFormat, setGameFormat] = useState<GameType>(DEFAULT_GAME_TYPE);
  const [gameTypes, setGameTypes] = useState<GameType[]>([DEFAULT_GAME_TYPE]);
  const [scoreTime, setScoreTimeState] = useState<ScoreTimeItem[]>([]);
  const [scoreTimeDraft, setScoreTimeDraftState] = useState<ScoreTimeItem[]>([]);
  const [scoreTimeDirty, setScoreTimeDirty] = useState(false);
  const [showVotes, setShowVotes] = useState(false);
  const [closestValue, setClosestValue] = useState<VoteValue | null>(null);
  const [averageValue, setAverageValue] = useState<VoteValue | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState(0);
  const [emojiBursts, setEmojiBursts] = useState<EmojiBurst[]>([]);

  useEffect(() => {
    const handleUpdate = (payload: UpdatePayload) => {
      setPlayers(Array.isArray(payload.players) ? payload.players : []);
      setTicketsState(Array.isArray(payload.tickets) ? payload.tickets : []);
      setGameFormat(payload.gameType || DEFAULT_GAME_TYPE);
      if (Array.isArray(payload.gameTypes) && payload.gameTypes.length > 0) {
        setGameTypes(payload.gameTypes);
      }
      setIsHydrated(true);
    };

    const handleShow = (payload: ShowPayload) => {
      setClosestValue(payload?.closest ?? null);
      setAverageValue(payload?.average ?? null);
      setShowVotes(false);
      setRevealCountdown(3);
    };

    const handleRestart = () => {
      setShowVotes(false);
      setRevealCountdown(0);
      setClosestValue(null);
      setAverageValue(null);
    };

    const handleScoreTime = (items: ScoreTimeItem[]) => {
      const normalized = Array.isArray(items) ? items : [];
      setScoreTimeState(normalized);
      setScoreTimeDraftState(normalized);
      setScoreTimeDirty(false);
    };

    const handleGameTypes = (items: GameType[]) => {
      if (Array.isArray(items) && items.length > 0) {
        setGameTypes(items);
      }
    };

    const handleReceiveEmoji = (payload: { from: string; to: string; emoji: string }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setEmojiBursts((prev) => [...prev, { id, ...payload, createdAt: Date.now() }]);
    };

    on('update', handleUpdate as (...args: unknown[]) => void);
    on('show', handleShow as (...args: unknown[]) => void);
    on('restart', handleRestart as (...args: unknown[]) => void);
    on('scoreTime', handleScoreTime as (...args: unknown[]) => void);
    on('gameTypes', handleGameTypes as (...args: unknown[]) => void);
    on('receiveEmoji', handleReceiveEmoji as (...args: unknown[]) => void);

    emit('scoreTime:get');
    emit('gameTypes:get');

    return () => {
      off('update', handleUpdate as (...args: unknown[]) => void);
      off('show', handleShow as (...args: unknown[]) => void);
      off('restart', handleRestart as (...args: unknown[]) => void);
      off('scoreTime', handleScoreTime as (...args: unknown[]) => void);
      off('gameTypes', handleGameTypes as (...args: unknown[]) => void);
      off('receiveEmoji', handleReceiveEmoji as (...args: unknown[]) => void);
    };
  }, [emit, on, off]);

  useEffect(() => {
    if (!connected) return;
    emit('gameTypes:get');
    emit('scoreTime:get');
  }, [connected, emit]);

  useEffect(() => {
    if (revealCountdown <= 0) return;
    const timeout = window.setTimeout(() => {
      setRevealCountdown((prev) => {
        if (prev <= 1) {
          setShowVotes(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [revealCountdown]);

  useEffect(() => {
    if (!scoreTimeDirty || scoreTimeDraft.length === 0) return;
    const timeout = window.setTimeout(() => {
      emit('scoreTime:set', scoreTimeDraft);
      setScoreTimeDirty(false);
    }, 400);
    return () => window.clearTimeout(timeout);
  }, [emit, scoreTimeDirty, scoreTimeDraft]);

  const self = useMemo(
    () => players.find((player) => player.id === socketId) || null,
    [players, socketId],
  );

  const currentVote = self?.vote ?? null;
  const votingOnName = tickets.find((ticket) => ticket.votingOn)?.name || null;
  const isObserver = self?.role === 'observer';

  const value = useMemo<GameContextType>(
    () => ({
      players,
      tickets,
      showVotes,
      currentVote,
      countdown: 0,
      gameFormat,
      gameTypes,
      closestValue,
      averageValue,
      votingOnName,
      scoreTime,
      scoreTimeDraft,
      isHydrated,
      revealCountdown,
      emojiBursts,
      restart: () => emit('restart'),
      show: () => emit('show'),
      nextTicket: () => emit('nextTicket'),
      resetCurrent: () => emit('resetCurrent'),
      vote: (card) => {
        if (!isObserver) {
          emit('vote', card);
        }
      },
      setName: (name, role) => emit('name', { name, role }),
      self,
      updateGameFormat: (format) => emit('gameTypeChanged', format),
      selectTicket: (ticketId) => emit('selectTicket', ticketId),
      setTickets: (items) => emit('ticket', items),
      setScoreTime: (items) => emit('scoreTime:set', items),
      addScoreTime: () => emit('scoreTime:add'),
      removeScoreTime: (index) => emit('scoreTime:remove', index),
      requestScoreTime: () => emit('scoreTime:get'),
      sendEmoji: (to, emoji) => emit('sendEmoji', { to, emoji }),
      clearEmoji: (id) => setEmojiBursts((prev) => prev.filter((item) => item.id !== id)),
      setScoreTimeDraft: (items) => {
        setScoreTimeDraftState(items);
        setScoreTimeDirty(true);
      },
      flushScoreTimeDraft: (items) => emit('scoreTime:set', items),
      addTask: () => {
        const next = [
          ...tickets,
          {
            id: crypto.randomUUID(),
            name: 'Nova tarefa',
            roomId: self?.roomId || '',
            votingOn: false,
          },
        ];
        emit('ticket', next);
      },
      updateTaskName: (id, name) => {
        const next = tickets.map((item) => (item.id === id ? { ...item, name } : item));
        emit('ticket', next);
      },
      removeTask: (id) => {
        const next = tickets.filter((item) => item.id !== id);
        emit('ticket', next);
      },
      exportTasksCsv: () => {
        const header = ['id', 'name', 'votingOn', 'done', 'score', 'average', 'closest'];
        const rows = tickets.map((task) => [
          task.id,
          task.name,
          String(Boolean(task.votingOn)),
          String(Boolean(task.done)),
          String(task.score ?? ''),
          String(task.average ?? ''),
          String(task.closest ?? ''),
        ]);
        const csv = [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tarefas-votadas.csv';
        link.click();
        URL.revokeObjectURL(url);
      },
      connected,
      isObserver,
    }),
    [
      players,
      tickets,
      showVotes,
      currentVote,
      gameFormat,
      gameTypes,
      closestValue,
      averageValue,
      votingOnName,
      scoreTime,
      scoreTimeDraft,
      isHydrated,
      revealCountdown,
      emojiBursts,
      emit,
      self,
      connected,
      isObserver,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
