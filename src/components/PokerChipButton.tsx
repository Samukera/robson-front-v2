import { GiCardPick } from "react-icons/gi";

interface PokerChipButtonProps {
  label: string;
  onClick: () => void;
}

export default function PokerChipButton({ label, onClick }: PokerChipButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center justify-center gap-2
        px-6 py-3
        text-sm uppercase tracking-wider
        font-bold text-white
        rounded-full
        border-2 border-green-400
        bg-gradient-to-br from-green-600 via-green-700 to-green-800
        shadow-[0_0_10px_rgba(0,255,0,0.3)]
        hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]
        transition-all duration-300
      "
    >
      <GiCardPick />
      {label}
    </button>
  );
}
