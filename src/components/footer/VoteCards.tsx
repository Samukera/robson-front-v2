import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useI18n } from '../../context/I18nContext';

interface VoteCardsProps {
  onVote?: (value: string) => void;
}

const SPREAD_PRESETS = {
  compact: { arcAngle: 58, radius: 110 },
  medium: { arcAngle: 72, radius: 125 },
  wide: { arcAngle: 150, radius: 125 },
} as const;

export default function VoteCards({ onVote }: VoteCardsProps) {
  const { gameFormat, vote, currentVote, isObserver, showVotes, connected } = useGame();
  const { t } = useI18n();
  const [selected, setSelected] = useState<string | null>(null);
  const spreadPreset: keyof typeof SPREAD_PRESETS = 'wide';

  const cards = (gameFormat?.values || [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '☕']).map(String);

  const handleSelect = (value: string) => {
    if (!connected || isObserver || showVotes) return;
    setSelected(value);
    onVote?.(value);
    vote(value);
  };

  const totalCards = cards.length;
  const { arcAngle, radius } = SPREAD_PRESETS[spreadPreset];
  const startAngle = -arcAngle / 2;
  const angleStep = arcAngle / (totalCards - 1);

  return (
    <div className="relative w-full flex items-end justify-center px-2 sm:px-6 overflow-visible pb-2 animate-enter-up">
      <div className="relative w-full max-w-5xl h-16 sm:h-16 flex items-end justify-center">
        {cards.map((value, index) => {
          const angle = startAngle + angleStep * index;
          const radians = (angle - 90) * (Math.PI / 180);
          const x = Math.cos(radians) * radius;
          const y = Math.sin(radians) * radius * 0.22;

          const isSelected = (currentVote !== null ? String(currentVote) : selected) === value;

          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              disabled={!connected || isObserver || showVotes}
              className={`
                absolute flex items-center justify-center
                w-8 h-10 sm:w-9 sm:h-11 lg:w-10 lg:h-12
                rounded-[10px] font-bold text-xs sm:text-sm lg:text-base
                transition-all duration-200 ease-out will-change-transform
                ${isSelected 
                  ? 'bg-gradient-to-b from-[var(--vote-card-active-top)] to-[var(--vote-card-active-bottom)] text-[var(--vote-card-active-text)] border border-[var(--accent-soft)] z-20 scale-110 shadow-[var(--floating-shadow-md)]'
                  : 'bg-gradient-to-b from-[var(--vote-card-idle-top)] to-[var(--vote-card-idle-bottom)] text-[var(--vote-card-idle-text)] border border-[var(--surface-border)] shadow-[var(--floating-shadow-sm)] enabled:hover:brightness-105 enabled:hover:border-[var(--accent-soft)] enabled:hover:translate-y-[-12px] enabled:hover:scale-110 enabled:hover:z-10 disabled:opacity-40 disabled:cursor-not-allowed'
                }
              `}
              style={{
                transform: `translate(${x}px, ${y}px)`,
              }}
              title={value}
            >
              {value}
            </button>
          );
        })}
      </div>
      {isObserver && (
        <div className="absolute right-2 bottom-1 text-[10px] text-[var(--text-muted)]">{t('nickname.observerDesc')}</div>
      )}
    </div>
  );
}
