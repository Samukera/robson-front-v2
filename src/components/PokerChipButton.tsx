export default function PokerChipButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}
