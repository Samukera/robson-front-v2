import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { useI18n } from '../../context/I18nContext';
import type { Player } from '../../types/game';

const EMOJIS = ['🚀', '👍', '🤔', '🏖️', '🚭', '☢️','🚬'];

function shouldRenderRevealVote(player: Player) {
  return player.role !== 'observer';
}

function getMenuPlacement(position: { left: number; top: number }) {
  if (position.left >= 78) return 'left';
  if (position.left <= 22) return 'right';
  if (position.top <= 24) return 'bottom';
  if (position.top >= 76) return 'top';

  const dx = position.left - 50;
  const dy = position.top - 50;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx < 0 ? 'left' : 'right';
  }

  return dy < 0 ? 'top' : 'bottom';
}

function getMenuClass(placement: 'top' | 'bottom' | 'left' | 'right') {
  if (placement === 'top') return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
  if (placement === 'bottom') return 'top-full mt-2 left-1/2 -translate-x-1/2';
  if (placement === 'left') return 'right-full mr-2 top-1/2 -translate-y-1/2';
  return 'left-full ml-2 top-1/2 -translate-y-1/2';
}

export default function PokerTable() {
  const {
    showVotes,
    show,
    restart,
    nextTicket,
    players,
    closestValue,
    revealCountdown,
    sendEmoji,
    emojiBursts,
    clearEmoji,
  } = useGame();
  const { t } = useI18n();

  const [emojiMenuFor, setEmojiMenuFor] = useState<string | null>(null);
  const tableRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!tableRef.current) return;
      if (!tableRef.current.contains(event.target as Node)) return;
      const target = event.target as HTMLElement;
      if (target.closest('[data-emoji-menu]') || target.closest('[data-emoji-trigger]')) return;
      setEmojiMenuFor(null);
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const positions = useMemo(() => {
    const count = Math.max(players.length, 1);
    const baseX = count > 14 ? 37 : count > 10 ? 39 : count > 7 ? 41 : 43;
    const baseY = count > 14 ? 28 : count > 10 ? 30 : count > 7 ? 32 : 35;

    return players.map((_, index) => {
      const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
      const left = 50 + Math.cos(angle) * baseX;
      const top = 50 + Math.sin(angle) * baseY;

      return {
        left: Math.min(88, Math.max(12, left)),
        top: Math.min(85, Math.max(15, top)),
      };
    });
  }, [players]);

  const positionByPlayerId = useMemo(() => {
    const map = new Map<string, { left: number; top: number }>();
    players.forEach((player, index) => {
      const position = positions[index];
      if (position) {
        map.set(player.id, position);
      }
    });
    return map;
  }, [players, positions]);

  return (
    <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div ref={tableRef} className="relative w-full max-w-2xl aspect-[4/3] max-h-full animate-enter-scale">
        <div className="table-ambient absolute inset-6 sm:inset-10 rounded-full blur-xl pointer-events-none" />

        <div className="absolute inset-0 table-surface border-[clamp(2px,1.5vw,6px)] border-[var(--table-border)] rounded-[50%] sm:rounded-[58%] flex items-center justify-center m-2 sm:m-4">
          <div className="absolute inset-[15%] sm:inset-[20%] border border-[var(--table-ring-1)] rounded-[50%] animate-pulse" />
          <div className="absolute inset-[25%] sm:inset-[30%] border border-[var(--table-ring-2)] rounded-[50%]" />
        </div>

        {!showVotes && revealCountdown === 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <button
              onClick={show}
              className="ui-btn-primary font-bold py-2 px-4 sm:py-3 sm:px-6 lg:py-4 lg:px-8 rounded-full text-sm sm:text-base lg:text-lg active:scale-[1.02]"
            >
              {t('game.revealVotes')}
            </button>
          </div>
        )}

        {revealCountdown > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="text-[var(--text-primary)] text-sm">{t('game.countdown')}</div>
            <div className="text-[var(--accent)] text-6xl font-black drop-shadow-lg">{revealCountdown}</div>
          </div>
        )}

        {showVotes && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center">
            <div className="ui-panel backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2 sm:py-4 mb-2 sm:mb-4">
              <span className="text-[var(--text-muted)] text-xs sm:text-sm">{t('game.result')}:</span>
              <div className="text-[var(--accent)] text-2xl sm:text-3xl font-bold">{closestValue ?? '?'}</div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={restart}
                className="ui-btn-secondary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
              >
                {t('game.restart')}
              </button>
              <button
                onClick={nextTicket}
                className="ui-btn-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
              >
                {t('game.nextTask')}
              </button>
            </div>
          </div>
        )}

        {players.map((player, index) => {
          const position = positions[index];
          const isMenuOpen = emojiMenuFor === player.id;
          const menuPlacement = getMenuPlacement(position);

          return (
            <div
              key={player.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 animate-enter-up z-20"
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
            >
              <PlayerCard
                player={player}
                showVotes={showVotes}
                emojiActive={isMenuOpen}
                onToggleEmoji={() => setEmojiMenuFor((prev) => (prev === player.id ? null : player.id))}
                positionTop={position.top}
              />

              {isMenuOpen && (
                <div
                  data-emoji-menu
                  className={`absolute z-40 ui-panel flex max-w-[150px] flex-wrap items-center justify-center gap-1 rounded-lg px-1.5 py-1 ${getMenuClass(menuPlacement)}`}
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      className="text-sm hover:scale-110 transition-transform"
                      title={t('emoji.send')}
                      onClick={() => {
                        sendEmoji(player.id, emoji);
                        setEmojiMenuFor(null);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {emojiBursts.map((burst) => {
          const from = positionByPlayerId.get(burst.from) || { left: 50, top: 50 };
          const to = positionByPlayerId.get(burst.to) || from;
          const travelY = to.top - from.top;
          const travelX = to.left - from.left;
          const arcHeight = Math.max(8, Math.min(16, Math.abs(travelY) * 0.55 + Math.abs(travelX) * 0.18));

          return (
            <motion.div
              key={burst.id}
              className="absolute z-40 text-xl pointer-events-none"
              initial={{ left: `${from.left}%`, top: `${from.top}%`, x: '-50%', y: '-50%', scale: 0.9, opacity: 1 }}
              animate={{ left: `${to.left}%`, top: `${to.top}%`, x: '-50%', y: '-50%', scale: 1.08, opacity: 1 }}
              transition={{ duration: 0.62, ease: [0.22, 0.61, 0.36, 1] }}
              onAnimationComplete={() => clearEmoji(burst.id)}
            >
              <motion.div
                animate={{ y: [0, -arcHeight, 0], rotate: [0, 220, 420, 620] }}
                transition={{ duration: 0.62, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {burst.emoji}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function PlayerCard({
  player,
  showVotes,
  onToggleEmoji,
  emojiActive,
  positionTop,
}: {
  player: Player;
  showVotes: boolean;
  onToggleEmoji: () => void;
  emojiActive: boolean;
  positionTop: number;
}) {
  const hasVoted = player.vote !== undefined && player.vote !== null;
  const placeInfoOutward = positionTop < 50;

  return (
    <div className={`flex items-center gap-1.5 sm:gap-1 ${placeInfoOutward ? 'flex-col-reverse' : 'flex-col'}`}>
      <button
        type="button"
        data-emoji-trigger
        title="Emoji"
        onClick={onToggleEmoji}
        className={`w-[clamp(1.75rem,4.2vw,2.55rem)] h-[clamp(1.75rem,4.2vw,2.55rem)] sm:w-[clamp(2rem,5vw,3rem)] sm:h-[clamp(2rem,5vw,3rem)] rounded-full bg-gradient-to-br from-[var(--accent-soft)] to-[var(--accent)] flex items-center justify-center text-[var(--text-on-accent)] font-bold text-[10px] sm:text-base border border-[var(--surface-border)] shadow-[var(--floating-shadow-sm)] transition-all ${emojiActive ? 'ring-2 ring-[var(--accent-soft)] scale-105' : 'hover:scale-105 hover:brightness-105'}`}
      >
        {(player.name || '?').charAt(0).toUpperCase()}
      </button>

      <div className="ui-panel-muted px-1.5 sm:px-2 py-0.5 rounded text-[var(--text-primary)] text-[10px] sm:text-xs font-medium whitespace-nowrap">
        {player.name || 'Sem nome'}
      </div>

      {showVotes ? (
        shouldRenderRevealVote(player) ? (
          <div className="ui-panel px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[var(--accent)] font-bold text-sm sm:text-lg">
            {player.vote ?? '?'}
          </div>
        ) : null
      ) : (
        <div>
          {hasVoted ? (
            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-[var(--success-bg)] border border-[var(--accent-soft)] flex items-center justify-center">
              <svg className="w-2.5 sm:w-4 h-2.5 sm:h-4 text-[var(--success-text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-4 sm:w-6 h-4 sm:h-6 rounded-full bg-[var(--surface-2)] border border-[var(--surface-border)] flex items-center justify-center">
              <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[var(--text-muted)]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
