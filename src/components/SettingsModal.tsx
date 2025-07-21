import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const { gameFormat, updateGameFormat } = useGame();
  const [formats, setFormats] = useState<{ name: string; values: string[] }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('gameTypes');
    if (stored) {
      setFormats(JSON.parse(stored));
    }
  }, []);

  const handleSelect = (format: { name: string; values: string[] }) => {
    updateGameFormat(format);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-sm sm:max-w-md text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Configurações de Votação
        </h2>

        <div className="flex flex-col gap-2 sm:gap-3">
          {formats.map((format) => (
            <button
              key={format.name}
              onClick={() => handleSelect(format)}
              className={`px-4 py-2 sm:py-3 rounded-md font-semibold text-sm sm:text-base transition-colors ${gameFormat?.name === format.name
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-black/30 text-white hover:bg-white/10'
                }`}
            >
              {format.name}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 sm:mt-6 w-full border border-white text-white hover:bg-white/10 font-semibold px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
