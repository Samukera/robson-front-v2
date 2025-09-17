import { GiCardPick } from "react-icons/gi";

interface PokerChipButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function PokerChipButton({ label, onClick, disabled }: PokerChipButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 px-6 py-3
        text-sm uppercase tracking-wider font-bold text-white rounded-full
        border-2 ${disabled ? 'border-gray-500 bg-gray-700/60 cursor-not-allowed' : 'border-green-400 bg-gradient-to-br from-green-600 via-green-700 to-green-800'}
        ${disabled ? '' : 'shadow-[0_0_10px_rgba(0,255,0,0.3)] hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]'}
        transition-all duration-300
      `}
      title={disabled ? 'Escolha um baralho primeiro' : undefined}
    >
      <GiCardPick />
      {label}
    </button>
  );
}
