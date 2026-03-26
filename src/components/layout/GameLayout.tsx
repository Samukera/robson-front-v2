import { useEffect, useState } from 'react';
import Header from './Header';
import SharingModal from '../SharingModal';
import SettingsModal from '../SettingsModal';
import TicketsModal from '../TicketsModal';
import LegendaModal from '../LegendaModal';
import NicknameModal from '../NicknameModal';
import PokerTable from '../content/PokerTable';
import VoteCards from '../footer/VoteCards';
import { useGame } from '../../context/GameContext';
import { useI18n } from '../../context/I18nContext';

type ThemeName = 'default' | 'modern-minimal' | 'poker-felt' | 'lagoon';
const THEME_STORAGE_KEY = 'robson:theme';

function toTheme(theme: string): ThemeName {
  if (theme === 'modern-minimal' || theme === 'poker-felt' || theme === 'default' || theme === 'lagoon') {
    return theme;
  }
  return 'default';
}

export default function GameLayout() {
  const { setName, self, votingOnName, connected, isHydrated, tickets } = useGame();
  const { t, language, setLanguage } = useI18n();

  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [legendaModalOpen, setLegendaModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('default');

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      setTheme(toTheme(storedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const themeClass =
    theme === 'modern-minimal'
      ? 'theme-modern-minimal'
      : theme === 'poker-felt'
        ? 'theme-poker-felt'
        : theme === 'lagoon'
          ? 'theme-lagoon'
        : '';

  const showNicknameModal = connected && !self?.name;

  return (
    <div className={`app-shell h-screen flex flex-col overflow-hidden ${themeClass}`}>
      <Header 
        votingOnName={tickets.length > 0 ? (votingOnName || t('header.noActiveTask')) : undefined}
        onShare={() => setSharingModalOpen(true)}
        onSettings={() => setSettingsModalOpen(true)}
        onTickets={() => setTicketsModalOpen(true)}
        onLegenda={() => setLegendaModalOpen(true)}
      />

      <main className="flex-1 min-h-0 pt-12 sm:pt-14 flex items-center justify-center px-2 sm:px-4 overflow-hidden">
        {!isHydrated ? (
          <div className="w-full max-w-2xl aspect-[4/3] rounded-[58%] border border-slate-600/40 bg-slate-900/45 flex items-center justify-center text-slate-300 animate-pulse">
            {t('game.loadingRoom')}
          </div>
        ) : (
          <PokerTable />
        )}
      </main>

      <footer className="
        app-footer-surface relative z-30 animate-enter-up
        h-20
        flex items-center justify-center px-2 sm:px-4
      ">
        <VoteCards />
      </footer>

      <SharingModal 
        isOpen={sharingModalOpen} 
        onClose={() => setSharingModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)} 
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={setLanguage}
      />
      <TicketsModal 
        isOpen={ticketsModalOpen} 
        onClose={() => setTicketsModalOpen(false)} 
      />
      <LegendaModal 
        isOpen={legendaModalOpen} 
        onClose={() => setLegendaModalOpen(false)} 
      />
      <NicknameModal
        isOpen={showNicknameModal}
        onSubmit={(name, role) => setName(name, role)}
      />
    </div>
  );
}
