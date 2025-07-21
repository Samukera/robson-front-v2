export type Player = {
  id: string;
  name: string;
  vote: string;
  role: 'player' | 'observer';
};

export type GameFormat = {
  name: string;
  values: string[];
};

export type Ticket = {
  id: string;
  name: string;
  votingOn: boolean;
  average?: string;
  closest?: string;
  score?: string;
  voted?: boolean;
  done?: boolean;
};

export type Game = {
  players: Player[];
  tickets: Ticket[];
  gameType: GameFormat;
};
