import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { useI18n } from '../context/I18nContext';

interface LegendaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegendaModal({ isOpen, onClose }: LegendaModalProps) {
  const {
    scoreTimeDraft,
    setScoreTimeDraft,
    addScoreTime,
    removeScoreTime,
    flushScoreTimeDraft,
  } = useGame();
  const { t } = useI18n();

  const handleChange = (index: number, key: 'point' | 'time', value: string) => {
    const updated = [...scoreTimeDraft];
    const current = updated[index] || { point: '', time: '' };
    updated[index] = { ...current, [key]: value };
    setScoreTimeDraft(updated);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        flushScoreTimeDraft(scoreTimeDraft);
        onClose();
      }}
      title={t('legend.title')}
    >
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {scoreTimeDraft.map((mapping, index) => (
          <div key={index} className="ui-panel-muted flex items-center gap-2 p-2 rounded-lg">
            <input
              type="text"
              value={mapping.point}
              onChange={(e) => handleChange(index, 'point', e.target.value)}
              className="w-12 ui-input rounded px-2 py-1 text-sm"
              placeholder="pt"
            />
            <span className="text-[var(--text-muted)]">=</span>
            <input
              type="text"
              value={mapping.time}
              onChange={(e) => handleChange(index, 'time', e.target.value)}
              className="flex-1 ui-input rounded px-2 py-1 text-sm"
              placeholder="ex: 2h, 1d, 1w"
            />
            <button
              type="button"
              onClick={() => removeScoreTime(index)}
              className="ui-btn-danger px-2 py-1 rounded"
              title="Remover linha"
            >
              -
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addScoreTime}
          className="ui-btn-secondary w-full text-sm px-3 py-2 rounded-lg"
        >
          {t('legend.addRow')}
        </button>
      </div>
    </Modal>
  );
}
