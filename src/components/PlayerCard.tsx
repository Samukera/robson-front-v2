interface PlayerCardProps {
  player: any;
  showVotes: boolean;
  countdown: number;
}

export default function PlayerCard({ player, showVotes, countdown }: PlayerCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-24 h-32 rounded-xl flex items-center justify-center text-3xl font-bold ${showVotes && countdown === 0 ? "bg-red-500" : "bg-gray-300"
          }`}
      >
        {showVotes && countdown === 0 ? player.vote : "🂠"}
      </div>
      <span className="mt-2 text-white">{player.name}</span>
    </div>
  );
}
