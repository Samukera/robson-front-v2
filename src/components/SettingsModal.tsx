import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { useI18n, type Language } from '../context/I18nContext';

type ThemeName = 'default' | 'modern-minimal' | 'poker-felt' | 'lagoon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
}: SettingsModalProps) {
  const { gameTypes, gameFormat, updateGameFormat } = useGame();
  const { t } = useI18n();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-4">
        <p className="text-slate-300 text-sm">
          {t('settings.description')}
        </p>

        <div className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">{t('settings.theme')}</p>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={theme === 'default'}
              onChange={() => onThemeChange('default')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">{t('settings.themeDefault')}</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={theme === 'modern-minimal'}
              onChange={() => onThemeChange('modern-minimal')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">{t('settings.themeMinimal')}</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={theme === 'lagoon'}
              onChange={() => onThemeChange('lagoon')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">{t('settings.themeLagoon')}</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="theme"
              checked={theme === 'poker-felt'}
              onChange={() => onThemeChange('poker-felt')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">{t('settings.themePoker')}</span>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">{t('settings.language')}</p>
          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="language"
              checked={language === 'pt-BR'}
              onChange={() => onLanguageChange('pt-BR')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">Português (Brasil)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors">
            <input
              type="radio"
              name="language"
              checked={language === 'en-US'}
              onChange={() => onLanguageChange('en-US')}
              className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
            />
            <span className="text-white text-sm">English (US)</span>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300 text-sm font-medium">{t('settings.format')}</p>

          {gameTypes.map((type) => (
            <label
              key={type.name}
              className="flex items-center gap-3 cursor-pointer rounded-lg border border-slate-700/70 bg-slate-900/45 px-3 py-2 hover:border-slate-500/80 transition-colors"
            >
              <input
                type="radio"
                name="gameFormat"
                checked={gameFormat.name === type.name}
                onChange={() => updateGameFormat(type)}
                className="w-4 h-4 text-amber-500 bg-slate-700 border-slate-600 focus:ring-amber-500"
              />
              <span className="text-white text-sm">
                {type.name} ({type.values.map(String).join(', ')})
              </span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
