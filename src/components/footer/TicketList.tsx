import { useState } from 'react';

interface Ticket {
  id: string;
  name: string;
  isActive: boolean;
}

const mockTickets: Ticket[] = [
  { id: 'T-001', name: 'Login', isActive: true },
  { id: 'T-002', name: 'Dashboard', isActive: false },
  { id: 'T-003', name: 'API Users', isActive: false },
  { id: 'T-004', name: 'CRUD', isActive: false },
  { id: 'T-005', name: 'Reports', isActive: false },
];

interface TicketListProps {
  onSelectTicket?: (ticketId: string) => void;
}

export default function TicketList({ onSelectTicket }: TicketListProps) {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [activeId, setActiveId] = useState<string>('T-001');

  const handleSelect = (ticketId: string) => {
    setActiveId(ticketId);
    onSelectTicket?.(ticketId);
  };

  return (
    <div className="w-28 sm:w-36 lg:w-44 h-full flex flex-col">
      <div className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1 px-1">
        Tickets
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        <div className="flex gap-1.5 sm:gap-2 px-1 h-full items-center">
          {tickets.map((ticket) => {
            const isActive = activeId === ticket.id;
            return (
              <button
                key={ticket.id}
                onClick={() => handleSelect(ticket.id)}
                className={`
                  flex-shrink-0 flex flex-col items-center justify-center
                  h-8 sm:h-10 px-2 sm:px-3 rounded-lg
                  transition-all duration-200
                  ${isActive
                    ? 'bg-amber-600 text-white border-2 border-amber-400'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                  }
                `}
              >
                <span className="text-[10px] sm:text-xs font-medium leading-tight">
                  {ticket.id}
                </span>
                <span className="text-[8px] sm:text-[10px] opacity-75 truncate max-w-[50px]">
                  {ticket.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
