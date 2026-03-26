import { useState } from 'react';
import Modal from './Modal';
import { useI18n } from '../context/I18nContext';

type Role = 'player' | 'observer';

interface NicknameModalProps {
  isOpen: boolean;
  onSubmit: (name: string, role: Role) => void;
}

export default function NicknameModal({ isOpen, onSubmit }: NicknameModalProps) {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('player');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed, role);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title={t('nickname.title')}>
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">{t('nickname.description')}</p>

        <div className="space-y-2">
          <label className="text-slate-300 text-xs uppercase tracking-wider">{t('nickname.name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-slate-950/70 border border-slate-600/70 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400/90"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 text-xs uppercase tracking-wider">Papel</label>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="role"
              checked={role === 'player'}
              onChange={() => setRole('player')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
              <span className="text-white text-sm">{t('nickname.playerDesc')}</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="role"
              checked={role === 'observer'}
              onChange={() => setRole('observer')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
              <span className="text-white text-sm">{t('nickname.observerDesc')}</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="w-full bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium border border-amber-200/70 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('common.enter')}
        </button>
      </div>
    </Modal>
  );
}
