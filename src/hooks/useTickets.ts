import { useMemo, useState } from 'react';
import { Socket } from 'socket.io-client';

export type Ticket = {
  id: string;
  name: string;
  voted: boolean;
  votingOn: boolean;
  average: string;
  closest: string;
  score: string;
};

export function useTickets(socket: Socket | null) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [votingOnId, setVotingOnId] = useState<string>('');

  const votingOnName = useMemo(() => {
    return tickets.find((ticket) => ticket.votingOn)?.name || '';
  }, [tickets]);

  const ticketUpdated = () => {
    socket?.emit('ticket', tickets);
  };

  return {
    tickets,
    setTickets,
    votingOnId,
    setVotingOnId,
    votingOnName,
    ticketUpdated,
  };
}
