type PlayerSeatProps = {
  player: any;
  showVotes: boolean;
  style: React.CSSProperties;
};

export default function PlayerSeat({ player, showVotes, style }: PlayerSeatProps) {
  return (
    <div
      style={style}
      className="flex flex-col items-center gap-2"
    >
      <div className="bg-green-700 border-4 border-yellow-500 rounded-full px-4 py-2 shadow-md">
        {player.name}
      </div>
      <div className="bg-white text-black px-4 py-2 rounded-lg border-2 border-gray-700 shadow">
        {showVotes ? player.vote : '🂠'}
      </div>
    </div>
  );
}
