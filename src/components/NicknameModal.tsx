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
        <p className="text-[var(--text-muted)] text-sm">{t('nickname.description')}</p>

        <div className="space-y-2">
          <label className="text-[var(--text-muted)] text-xs uppercase tracking-wider">{t('nickname.name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="w-full ui-input rounded-lg px-3 py-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[var(--text-muted)] text-xs uppercase tracking-wider">Papel</label>

          <label className="ui-panel-muted flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:border-[var(--accent-soft)] transition-colors">
            <input
              type="radio"
              name="role"
              checked={role === 'player'}
              onChange={() => setRole('player')}
              className="w-4 h-4 accent-[var(--accent)]"
            />
              <span className="text-[var(--text-primary)] text-sm">{t('nickname.playerDesc')}</span>
          </label>

          <label className="ui-panel-muted flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 hover:border-[var(--accent-soft)] transition-colors">
            <input
              type="radio"
              name="role"
              checked={role === 'observer'}
              onChange={() => setRole('observer')}
              className="w-4 h-4 accent-[var(--accent)]"
            />
              <span className="text-[var(--text-primary)] text-sm">{t('nickname.observerDesc')}</span>
          </label>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim()}
          className="ui-btn-primary w-full px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
        >
          {t('common.enter')}
        </button>
      </div>
    </Modal>
  );
}
