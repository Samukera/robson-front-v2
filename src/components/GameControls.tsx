interface GameControlsProps {
  show: () => void;
  restart: () => void;
  showVotes: boolean;
  countdown: number;
  closestValue: string | null;
  averageValue: string | null;
}

export default function GameControls({
  show,
  restart,
  showVotes,
  countdown,
  closestValue,
  averageValue,
}: GameControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {!showVotes && (
        <button
          onClick={show}
          className="bg-red-600 px-6 py-3 rounded-full text-white hover:bg-red-700"
        >
          Revelar Votos
        </button>
      )}

      {showVotes && countdown === 0 && (
        <button
          onClick={restart}
          className="bg-green-600 px-6 py-3 rounded-full text-white hover:bg-green-700"
        >
          Nova Rodada
        </button>
      )}

      {showVotes && countdown === 0 && (
        <div className="text-white mt-2">
          <div>Média: {averageValue}</div>
          <div>Mais próximo: {closestValue}</div>
        </div>
      )}
    </div>
  );
}
