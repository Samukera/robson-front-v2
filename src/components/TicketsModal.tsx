import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { useI18n } from '../context/I18nContext';

interface TicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TicketsModal({ isOpen, onClose }: TicketsModalProps) {
  const { tickets, selectTicket, addTask, updateTaskName, removeTask, exportTasksCsv } = useGame();
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('tasks.title')}>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addTask}
            className="flex-1 text-sm text-slate-100 px-3 py-2 rounded-lg border border-slate-600/70 bg-slate-900/50 hover:border-slate-400"
          >
            {t('tasks.add')}
          </button>
          <button
            type="button"
            onClick={exportTasksCsv}
            className="flex-1 text-sm text-slate-100 px-3 py-2 rounded-lg border border-slate-600/70 bg-slate-900/50 hover:border-slate-400"
          >
            {t('tasks.export')}
          </button>
        </div>

        {tickets.length === 0 && (
          <div className="text-sm text-slate-400 border border-slate-700 rounded-lg p-3">{t('tasks.empty')}</div>
        )}
        {tickets.map((ticket) => {
          const isActive = Boolean(ticket.votingOn);
          return (
            <button
              key={ticket.id}
              onClick={() => selectTicket(ticket.id)}
              className={`
                w-full flex flex-col items-start justify-center
                p-3 rounded-lg transition-all
                ${isActive
                  ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border border-amber-200/80 shadow-[0_8px_18px_rgba(245,158,11,0.35)]'
                  : 'bg-slate-900/60 text-slate-200 border border-slate-600/70 hover:bg-slate-800/85 hover:border-slate-500'
                }
              `}
            >
              <div className="w-full flex items-center justify-between gap-2">
                <span className="font-bold text-sm truncate">{ticket.name || ticket.id}</span>
                {ticket.done && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-400/30">{t('tasks.done')}</span>
                )}
              </div>
              <div className="w-full flex items-center gap-2 mt-1">
                <input
                  value={ticket.name || ''}
                  onChange={(e) => updateTaskName(ticket.id, e.target.value)}
                  placeholder={t('tasks.placeholder')}
                  className="flex-1 bg-slate-950/70 border border-slate-600/70 rounded px-2 py-1 text-xs text-slate-100"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(ticket.id);
                  }}
                  className="text-slate-300 hover:text-red-300 px-2 py-1 rounded border border-slate-600/70 hover:border-red-400/50"
                >
                  -
                </button>
              </div>
              <div className="w-full flex items-center justify-between text-xs opacity-75 mt-1">
                <span>{ticket.id}</span>
                <span>{`score: ${ticket.score ?? '-'}`}</span>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
