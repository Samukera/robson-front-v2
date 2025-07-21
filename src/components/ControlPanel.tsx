export default function ControlPanel({
  vote,
  restart,
  show,
}: any) {
  const cards = ["1", "2", "3", "5", "8", "13", "21", "☕", "?"];

  return (
    <>
      <div className="flex gap-2">
        {cards.map((card) => (
          <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded"

            key={card}
            onClick={() => vote(card)}
          >
            {card}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded"
          onClick={show}
        >
          Revelar Cartas
        </button>
        <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded"
          onClick={restart}
        >
          Resetar
        </button>
      </div>
    </>
  );
}
