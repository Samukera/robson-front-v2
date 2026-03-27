import Modal from './Modal';
import { useGame } from '../context/GameContext';
import { useI18n, type Language } from '../context/I18nContext';
import type { ThemeName } from '../theme';

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
  const radioClass = 'w-4 h-4 accent-[var(--accent)]';
  const optionClass = 'ui-panel-muted flex items-center gap-3 cursor-pointer rounded-lg px-3 py-2 transition-all hover:border-[var(--accent-soft)]';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('settings.title')}>
      <div className="space-y-4">
        <p className="text-[var(--text-muted)] text-sm">
          {t('settings.description')}
        </p>

        <div className="space-y-2">
          <p className="text-[var(--text-primary)] text-sm font-medium">{t('settings.theme')}</p>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'dark'}
              onChange={() => onThemeChange('dark')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themeDark')}</span>
          </label>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'white'}
              onChange={() => onThemeChange('white')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themeWhite')}</span>
          </label>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'default'}
              onChange={() => onThemeChange('default')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themeDefault')}</span>
          </label>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'modern-minimal'}
              onChange={() => onThemeChange('modern-minimal')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themeMinimal')}</span>
          </label>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'lagoon'}
              onChange={() => onThemeChange('lagoon')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themeLagoon')}</span>
          </label>

          <label className={optionClass}>
            <input
              type="radio"
              name="theme"
              checked={theme === 'poker-felt'}
              onChange={() => onThemeChange('poker-felt')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">{t('settings.themePoker')}</span>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-[var(--text-primary)] text-sm font-medium">{t('settings.language')}</p>
          <label className={optionClass}>
            <input
              type="radio"
              name="language"
              checked={language === 'pt-BR'}
              onChange={() => onLanguageChange('pt-BR')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">Português (Brasil)</span>
          </label>
          <label className={optionClass}>
            <input
              type="radio"
              name="language"
              checked={language === 'en-US'}
              onChange={() => onLanguageChange('en-US')}
              className={radioClass}
            />
            <span className="text-[var(--text-primary)] text-sm">English (US)</span>
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-[var(--text-primary)] text-sm font-medium">{t('settings.format')}</p>

          {gameTypes.map((type) => (
            <label
              key={type.name}
              className={optionClass}
            >
              <input
                type="radio"
                name="gameFormat"
                checked={gameFormat.name === type.name}
                onChange={() => updateGameFormat(type)}
                className={radioClass}
              />
              <span className="text-[var(--text-primary)] text-sm">
                {type.name} ({type.values.map(String).join(', ')})
              </span>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}
