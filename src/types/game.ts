export type Role = 'player' | 'observer' | 'admin';

export type VoteValue = string | number;

export interface Player {
  id: string;
  name: string;
  role: Role | string;
  roomId: string;
  vote?: VoteValue;
}

export interface Ticket {
  id: string;
  name: string;
  roomId: string;
  votingOn?: boolean;
  done?: boolean;
  score?: VoteValue | '';
  average?: VoteValue | '';
  closest?: VoteValue | '';
}

export interface GameType {
  name: string;
  values: VoteValue[];
}

export interface ScoreTimeItem {
  point: string;
  time: string;
}

export interface ShowPayload {
  average: VoteValue | '☕';
  closest: VoteValue | '☕';
}

export interface UpdatePayload {
  players: Player[];
  tickets: Ticket[];
  gameType: GameType;
  gameTypes?: GameType[];
}

export interface EmojiBurst {
  id: string;
  from: string;
  to: string;
  emoji: string;
  createdAt: number;
}
