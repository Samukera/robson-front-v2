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
          <div key={`${mapping.point}-${index}`} className="flex items-center gap-2 p-2 bg-slate-900/55 border border-slate-600/70 rounded-lg">
            <input
              type="text"
              value={mapping.point}
              onChange={(e) => handleChange(index, 'point', e.target.value)}
              className="
                w-12
                bg-slate-950/70 border border-slate-600/70 
                rounded px-2 py-1 
                text-slate-300 text-sm
                focus:outline-none focus:border-amber-400/90 focus:bg-slate-800
              "
              placeholder="pt"
            />
            <span className="text-slate-400">=</span>
            <input
              type="text"
              value={mapping.time}
              onChange={(e) => handleChange(index, 'time', e.target.value)}
              className="
                flex-1
                bg-slate-950/70 border border-slate-600/70 
                rounded px-2 py-1 
                text-slate-300 text-sm
                focus:outline-none focus:border-amber-400/90 focus:bg-slate-800
              "
              placeholder="ex: 2h, 1d, 1w"
            />
            <button
              type="button"
              onClick={() => removeScoreTime(index)}
              className="text-slate-300 hover:text-red-300 px-2 py-1 rounded border border-slate-600/70 hover:border-red-400/50"
              title="Remover linha"
            >
              -
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addScoreTime}
          className="w-full text-sm text-slate-200 hover:text-white px-3 py-2 rounded-lg border border-slate-600/70 hover:border-slate-400 bg-slate-900/50"
        >
          {t('legend.addRow')}
        </button>
      </div>
    </Modal>
  );
}
