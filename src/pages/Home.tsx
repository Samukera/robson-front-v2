import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import PokerChipButton from "../components/PokerChipButton";
import { I18nProvider, useI18n } from '../context/I18nContext';
import { THEME_STORAGE_KEY, getThemeClass, toTheme, type ThemeName } from '../theme';

function HomeContent() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  const [themeClass, setThemeClass] = useState('theme-dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const parsedTheme: ThemeName = toTheme(storedTheme || 'dark');
    setThemeClass(getThemeClass(parsedTheme));
  }, []);
  
  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID();
    navigate('/game/' + roomId);
  };

  return (
    <div className={`app-shell min-h-screen relative overflow-hidden flex items-center justify-center p-4 ${themeClass}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 ui-panel rounded-lg p-1">
        <button
          type="button"
          onClick={() => setLanguage('pt-BR')}
          className={`px-2 py-1 text-xs rounded transition-all ${language === 'pt-BR' ? 'ui-btn-secondary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          PT
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en-US')}
          className={`px-2 py-1 text-xs rounded transition-all ${language === 'en-US' ? 'ui-btn-secondary' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          EN
        </button>
      </div>

      <div className="relative text-center w-full max-w-xl">
        <h1
          className="mb-5 leading-none text-[clamp(3rem,14vw,7.25rem)]"
          style={{ fontFamily: 'Nabla, Roboto, sans-serif' }}
        >
          Robson!
        </h1>
        <p className="text-[var(--text-primary)] text-base sm:text-lg mb-3">{t('home.subtitle')}</p>
        <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed mb-8 px-2">
          {t('home.description')}
        </p>
        
        <PokerChipButton 
          label={t('home.createRoom')} 
          onClick={handleCreateRoom} 
        />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <HomeContent />
    </I18nProvider>
  );
}
