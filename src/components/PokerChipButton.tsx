export default function PokerChipButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="ui-btn-primary font-bold py-3 px-8 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {label}
    </button>
  );
}
