import { useGame } from '../context/GameContext';
import { useState, useEffect } from 'react';
import { IoAdd, IoCloseSharp } from 'react-icons/io5';
import { useSocketContext } from '../provider/SocketProvider';
import { v4 as uuidv4 } from 'uuid';
import { FiChevronLeft } from 'react-icons/fi';

export default function Tickets() {
  const socket = useSocketContext();
  const { tickets, updateTickets } = useGame();
  const [ticketName, setTicketName] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta telas pequenas
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 637);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const addTicket = () => {
    if (!ticketName.trim()) return;
    const newTicket = {
      id: uuidv4(),
      name: ticketName.trim(),
      votingOn: false,
      average: '0',
      closest: '0',
      score: '0',
      voted: false,
    };
    updateTickets([...tickets, newTicket]);
    setTicketName('');
  };

  const deleteTicket = (id: string) => {
    updateTickets(tickets.filter((t) => t.id !== id));
  };

  const selectTicket = (id: string) => {
    if (!socket) return;
    socket.emit("selectTicket", id);
    if (isMobile) setShowDrawer(false); // Fecha drawer ao selecionar
  };

  // 🎯 Componente da lista
  const TicketList = () => (
    <div className="bg-white/10 backdrop-blur border border-yellow-400 rounded-xl p-4 shadow-lg w-full sm:w-80 text-white h-full sm:h-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-yellow-300">Cards</h2>
        {isMobile && (
          <button
            onClick={() => setShowDrawer(false)}
            className="text-white text-2xl"
            title="Fechar"
          >
            <FiChevronLeft />
          </button>
        )}
      </div>

      <div className="flex mb-3 gap-2">
        <input
          className="bg-white/10 border border-white/20 rounded px-3 py-1 w-full text-sm text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-yellow-300"
          placeholder="Adicionar tarefa"
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTicket()}
        />
        <button
          className="bg-blue-700 hover:bg-blue-500 text-white text-xl px-3 rounded transition"
          onClick={addTicket}
        >
          <IoAdd />
        </button>
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition ${ticket.votingOn
              ? 'bg-yellow-500/30 border border-yellow-300'
              : 'bg-white/10 hover:bg-white/20 border border-white/10'
              }`}
            onClick={() => selectTicket(ticket.id)}
          >
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-medium">{ticket.name}</span>
              {ticket.done && ticket.score && (
                <span className="text-xs sm:text-sm text-white/70">
                  Estimativa: {ticket.score}
                </span>
              )}
            </div>
            <button
              className="text-red-400 hover:text-red-600 text-lg font-bold ml-2"
              onClick={(e) => {
                e.stopPropagation();
                deleteTicket(ticket.id);
              }}
            >
              <IoCloseSharp />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* 💬 Drawer responsivo para mobile */}
      {isMobile ? (
        <>
          {showDrawer && (
            <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
              <div className="w-[90%] max-w-xs h-full bg-[#1c1c1c] p-4">
                <TicketList />
              </div>
            </div>
          )}

          {/* 🎯 Botão flutuante para abrir o Drawer */}
          {!showDrawer && (
            <button
              onClick={() => setShowDrawer(true)}
              className="fixed bottom-4 left-4 z-40 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full shadow-md"
            >
              🃏 Cards
            </button>
          )}
        </>
      ) : (
        // 💻 Desktop mostra direto
        <TicketList />
      )}
    </>
  );
}
