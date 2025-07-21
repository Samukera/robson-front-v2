interface VotingCardsProps {
  currentVote: string | null;
  setCurrentVote: (v: string) => void;
  vote: (v: string) => void;
  disabled: boolean;
  gameFormat: any;
}

export default function VotingCards({
  currentVote,
  setCurrentVote,
  vote,
  disabled,
  gameFormat,
}: VotingCardsProps) {
  const cards: string[] = gameFormat?.values || ["1", "2", "3", "5", "8", "13", "☕", "?"];


  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      {cards.map((card) => (
        <button
          key={card}
          onClick={() => {
            setCurrentVote(card);
            vote(card);
          }}
          disabled={disabled}
          className={`w-16 h-20 rounded-lg flex items-center justify-center text-2xl font-bold ${currentVote === card ? "bg-yellow-400" : "bg-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            } transition`}
        >
          {card}
        </button>
      ))}
    </div>
  );
}
