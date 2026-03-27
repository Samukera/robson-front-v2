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
import { THEME_STORAGE_KEY, getThemeClass, toTheme, toggleDarkWhiteTheme, type ThemeName } from '../../theme';

export default function GameLayout() {
  const { setName, self, votingOnName, connected, isHydrated, tickets } = useGame();
  const { t, language, setLanguage } = useI18n();

  const [sharingModalOpen, setSharingModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [ticketsModalOpen, setTicketsModalOpen] = useState(false);
  const [legendaModalOpen, setLegendaModalOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
      setTheme(toTheme(storedTheme));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const themeClass = getThemeClass(theme);
  const handleToggleTheme = () => setTheme((current) => toggleDarkWhiteTheme(current));

  const showNicknameModal = connected && !self?.name;

  return (
    <div className={`app-shell h-screen flex flex-col overflow-hidden ${themeClass}`}>
      <Header 
        onShare={() => setSharingModalOpen(true)}
        onSettings={() => setSettingsModalOpen(true)}
        onTickets={() => setTicketsModalOpen(true)}
        onLegenda={() => setLegendaModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 min-h-0 pt-12 sm:pt-14 flex flex-col items-center justify-center px-2 sm:px-4 overflow-hidden">
        {tickets.length > 0 && votingOnName && (
          <span className="ui-panel text-xs sm:text-sm text-[var(--accent)] font-semibold px-3 py-1.5 rounded-full mb-4">
            Em votação: {votingOnName}
          </span>
        )}
        {!isHydrated ? (
          <div className="w-full max-w-2xl aspect-[4/3] rounded-[58%] border border-[var(--surface-border)] bg-[var(--surface-1)] flex items-center justify-center text-[var(--text-primary)] animate-pulse">
            {t('game.loadingRoom')}
          </div>
        ) : (
          <PokerTable />
        )}
      </main>

      <footer className="
        app-footer-surface relative z-30 animate-enter-up
        h-20
        flex items-center justify-between px-2 sm:px-4
      ">
        <div className="text-xs sm:text-sm text-[var(--text-muted)]" style={{ fontFamily: 'Quantico, sans-serif' }}>
          Powered by: SR.C
        </div>
        <VoteCards />
        <div className="w-16" />
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
