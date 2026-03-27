import { FiMoon, FiSettings, FiShare2, FiSun } from 'react-icons/fi';
import { MdOutlineSubtitles } from 'react-icons/md';
import {FaTasks } from 'react-icons/fa';
import { useI18n } from '../../context/I18nContext';
import type { ThemeName } from '../../theme';

interface HeaderProps {
  onShare: () => void;
  onSettings: () => void;
  onTickets?: () => void;
  onLegenda?: () => void;
  theme: ThemeName;
  onToggleTheme: () => void;
}

export default function Header({
  onShare,
  onSettings,
  onTickets,
  onLegenda,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const { t } = useI18n();
  const isWhiteTheme = theme === 'white';

  return (
    <header className="
      app-header-surface animate-enter-down
      fixed top-0 left-0 right-0 z-50
      h-12 sm:h-14
      flex items-center justify-between
      px-3 sm:px-4
    ">
      <div className="w-28 sm:w-36 md:w-44 flex items-center gap-1 sm:gap-2">
        <button
          onClick={onTickets}
          className="
            icon-button
            p-2 rounded-lg
          "
          title={t('header.tasks')}
        >
          <FaTasks size={17} />
        </button>

        <button
          onClick={onLegenda}
          className="
            icon-button
            p-2 rounded-lg
          "
          title={t('header.legend')}
        >
          <MdOutlineSubtitles  size={17} />
        </button>
      </div>

      {/* Título - Centro */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        <h1
          className="leading-none text-[clamp(1.45rem,3vw,2.35rem)]"
          style={{ fontFamily: 'Nabla, Roboto, sans-serif', color: 'var(--text-primary)' }}
        >
          Robson!
        </h1>
      </div>

      {/* Botões - Direita */}
      <div className="w-28 sm:w-36 md:w-44 flex items-center justify-end gap-1 sm:gap-2 ml-auto">
        <button
          onClick={onToggleTheme}
          className="icon-button p-2 rounded-lg"
          title={isWhiteTheme ? t('settings.themeDark') : t('settings.themeWhite')}
        >
          {isWhiteTheme ? <FiMoon size={17} /> : <FiSun size={17} />}
        </button>

        <button
          onClick={onShare}
          className="
            icon-button
            p-2 rounded-lg
          "
          title={t('common.share')}
        >
          <FiShare2 size={17} />
        </button>
        
        <button
          onClick={onSettings}
          className="
            icon-button
            p-2 rounded-lg
          "
          title={t('common.settings')}
        >
          <FiSettings size={17} />
        </button>
      </div>
    </header>
  );
}
