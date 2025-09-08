// Tickets.tsx
import { memo, useEffect, useState, useCallback } from "react";
import { IoAdd, IoCloseSharp } from "react-icons/io5";
import { FiChevronLeft } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { useGame } from "../context/GameContext";
import { useSocketContext } from "../provider/SocketProvider";
import type { Ticket } from '../types';
// type Ticket = {
//   id: string;
//   name: string;
//   votingOn: boolean;
//   average: string;
//   closest: string;
//   score: string;
//   voted: boolean;
//   done?: boolean;
// };

type TicketListProps = {
  isMobile: boolean;
  ticketName: string;
  setTicketName: (v: string) => void;
  tickets: Ticket[];
  onCloseDrawer: () => void;
  onAddTicket: () => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onExport: () => void;
};

// ⬇️ Agora FORA do componente principal + memo
const TicketList = memo(function TicketList({
  isMobile,
  ticketName,
  setTicketName,
  tickets,
  onExport,
  onCloseDrawer,
  onAddTicket,
  onDelete,
  onSelect,
}: TicketListProps) {
  return (
    <div className="bg-white/10 backdrop-blur border border-yellow-400 rounded-xl p-4 shadow-lg w-full sm:w-80 text-white h-full sm:h-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-yellow-300">Cards</h2>
        <div className="flex items-center gap-2">
          {isMobile && (
            <button onClick={onCloseDrawer} className="text-white text-2xl" title="Fechar">
              <FiChevronLeft />
            </button>
          )}
          <button
            onClick={onExport}
            className="bg-yellow-600 hover:bg-yellow-500 text-white text-xs sm:text-sm px-3 py-1 rounded"
            title="Exportar CSV"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="flex mb-3 gap-2">
        <input
          className="bg-white/10 border border-white/20 rounded px-3 py-1 w-full text-sm text-white placeholder-white/50 focus:outline-none focus:ring focus:ring-yellow-300"
          placeholder="Adicionar tarefa"
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAddTicket()}
        />
        <button
          className="bg-yellow-600 hover:bg-yellow-500 text-white text-xl px-3 rounded transition"
          onClick={onAddTicket}
        >
          <IoAdd />
        </button>
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className={`flex justify-between items-center px-3 py-2 rounded-lg cursor-pointer transition ${ticket.votingOn
              ? "bg-yellow-500/30 border border-yellow-300"
              : "bg-white/10 hover:bg-white/20 border border-white/10"
              }`}
            onClick={() => onSelect(ticket.id)}
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
                onDelete(ticket.id);
              }}
            >
              <IoCloseSharp />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default function Tickets() {
  const socket = useSocketContext();
  const { tickets, updateTickets } = useGame();
  const [ticketName, setTicketName] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const exportTicketsCSV = useCallback(() => {
    // exporta só tickets que já têm estimativa (score)
    const rows = tickets
      .filter(t => t.score !== undefined && t.score !== null && String(t.score) !== "")
      .map(t => [t.name, String(t.score)]);

    if (rows.length === 0) {
      alert("Nenhum ticket com estimativa para exportar.");
      return;
    }

    const SEP = ";";
    const escapeCSV = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

    const header = ["Tarefa", "Estimativa"];
    const csv = [header, ...rows]
      .map(cols => cols.map(escapeCSV).join(SEP))
      .join("\r\n");

    // BOM para abrir com acentuação correta no Excel
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Planning_Poker_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tickets]);


  // Detecta telas pequenas
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 637);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const addTicket = useCallback(() => {
    if (!ticketName.trim()) return;
    const newTicket: Ticket = {
      id: uuidv4(),
      name: ticketName.trim(),
      votingOn: false,
      average: "0",
      closest: "0",
      score: "0",
      voted: false,
    };
    updateTickets([...tickets, newTicket]);
    setTicketName("");
  }, [ticketName, tickets, updateTickets]);

  const deleteTicket = useCallback(
    (id: string) => updateTickets(tickets.filter((t) => t.id !== id)),
    [tickets, updateTickets]
  );

  const selectTicket = useCallback(
    (id: string) => {
      if (!socket) return;
      socket.emit("selectTicket", id);
      if (isMobile) setShowDrawer(false);
    },
    [socket, isMobile]
  );

  return (
    <>
      {isMobile ? (
        <>
          {showDrawer && (
            <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
              <div className="w-[90%] max-w-xs h-full bg-[#1c1c1c] p-4">
                <TicketList
                  isMobile
                  ticketName={ticketName}
                  setTicketName={setTicketName}
                  tickets={tickets}
                  onExport={exportTicketsCSV}
                  onCloseDrawer={() => setShowDrawer(false)}
                  onAddTicket={addTicket}
                  onDelete={deleteTicket}
                  onSelect={selectTicket}
                />
              </div>
            </div>
          )}

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
        <TicketList
          isMobile={false}
          ticketName={ticketName}
          setTicketName={setTicketName}
          tickets={tickets}
          onExport={exportTicketsCSV}
          onCloseDrawer={() => { }}
          onAddTicket={addTicket}
          onDelete={deleteTicket}
          onSelect={selectTicket}
        />
      )}
    </>
  );
}
