import { useEffect, useRef, useState } from 'react';
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
  const [pendingFocusTaskId, setPendingFocusTaskId] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!pendingFocusTaskId) return;
    const target = tickets.find((ticket) => ticket.id === pendingFocusTaskId);
    if (!target) return;

    const input = inputRefs.current[pendingFocusTaskId];
    if (!input) return;

    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
    setPendingFocusTaskId(null);
  }, [pendingFocusTaskId, tickets]);

  const handleAddTask = () => {
    const newTaskId = addTask();
    setPendingFocusTaskId(newTaskId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('tasks.title')}>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddTask}
            className="ui-btn-secondary flex-1 text-sm px-3 py-2 rounded-lg"
          >
            {t('tasks.add')}
          </button>
          <button
            type="button"
            onClick={exportTasksCsv}
            className="ui-btn-secondary flex-1 text-sm px-3 py-2 rounded-lg"
          >
            {t('tasks.export')}
          </button>
        </div>

        {tickets.length === 0 && (
          <div className="text-sm text-[var(--text-muted)] border border-[var(--surface-border)] rounded-lg p-3">{t('tasks.empty')}</div>
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
                  ? 'ui-btn-primary'
                  : 'ui-panel-muted text-[var(--text-primary)] hover:border-[var(--accent-soft)]'
                }
              `}
            >
              <div className="w-full flex items-center justify-between gap-2">
                <span className="font-bold text-sm truncate">{ticket.name || t('tasks.placeholder')}</span>
                {ticket.done && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-400/30">{t('tasks.done')}</span>
                )}
              </div>
              <div className="w-full flex items-center gap-2 mt-1">
                <input
                  ref={(element) => {
                    inputRefs.current[ticket.id] = element;
                  }}
                  value={ticket.name || ''}
                  onChange={(e) => updateTaskName(ticket.id, e.target.value)}
                  placeholder={t('tasks.placeholder')}
                  className="flex-1 ui-input rounded px-2 py-1 text-xs"
                  onClick={(event) => event.stopPropagation()}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTask(ticket.id);
                  }}
                  className="ui-btn-danger px-2 py-1 rounded"
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
