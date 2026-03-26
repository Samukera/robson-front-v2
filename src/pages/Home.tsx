import { useNavigate } from "react-router-dom";
import PokerChipButton from "../components/PokerChipButton";
import { I18nProvider, useI18n } from '../context/I18nContext';

function HomeContent() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useI18n();
  
  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID();
    navigate('/game/' + roomId);
  };

  return (
    <div className="min-h-screen bg-[#333] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/30 pointer-events-none" />

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/25 border border-white/20 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setLanguage('pt-BR')}
          className={`px-2 py-1 text-xs rounded ${language === 'pt-BR' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
        >
          PT
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en-US')}
          className={`px-2 py-1 text-xs rounded ${language === 'en-US' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}
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
        <p className="text-white/90 text-base sm:text-lg mb-3">{t('home.subtitle')}</p>
        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 px-2">
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
