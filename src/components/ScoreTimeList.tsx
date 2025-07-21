import { useState, useEffect } from 'react';
import { useSocketContext } from '../provider/SocketProvider';
import { FiChevronRight } from 'react-icons/fi';

interface ScoreTimeItem {
  point: string;
  time: string;
}

export default function ScoreTimeList({ onReset }: { onReset: () => void }) {
  const [items, setItems] = useState<ScoreTimeItem[]>([
    { point: '0', time: '1h' },
    { point: '1', time: '2h' },
  ]);

  const [isMobile, setIsMobile] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const socket = useSocketContext();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleChange = (index: number, field: 'point' | 'time', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { point: '', time: '' }]);
  };

  const handleRemove = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const List = () => (
    <div className="w-full sm:w-[250px] bg-[#2f3e5d] rounded-xl shadow-lg p-3 sm:p-4 border border-yellow-400 text-white text-xs sm:text-sm h-full sm:h-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-yellow-300 font-semibold text-sm sm:text-base">Pontuação x Tempo</h3>
        {isMobile && (
          <button onClick={() => setShowDrawer(false)} className="text-white text-lg">
            <FiChevronRight />
          </button>
        )}
      </div>

      <div className="max-h-[160px] overflow-y-auto pr-1 scrollbar scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-[#1f2e45]">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-1 gap-1">
            <input
              type="text"
              value={item.point}
              onChange={(e) => handleChange(index, 'point', e.target.value)}
              className="bg-[#1f2e45] text-white rounded px-2 py-1 w-[40%] border border-gray-600"
            />
            =
            <input
              type="text"
              value={item.time}
              onChange={(e) => handleChange(index, 'time', e.target.value)}
              className="bg-[#1f2e45] text-white rounded px-2 py-1 w-[45%] border border-gray-600"
            />
            <button
              onClick={() => handleRemove(index)}
              className="text-yellow-300 hover:text-red-400 text-sm ml-1"
              title="Remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="mt-2 text-yellow-200 hover:text-yellow-100 underline text-xs sm:text-sm"
      >
        + Adicionar linha
      </button>

      <button
        onClick={() => socket?.emit("resetCurrent")}
        className="mt-3 bg-yellow-700 hover:bg-yellow-600 w-full py-1 rounded text-xs sm:text-sm text-white font-semibold shadow"
      >
        Resetar Rodada
      </button>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          {showDrawer && (
            <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
              <div className="w-[90%] max-w-xs h-full bg-[#1c1c1c] p-4">
                <List />
              </div>
            </div>
          )}

          {!showDrawer && (
            <button
              onClick={() => setShowDrawer(true)}
              className="fixed bottom-4 right-4 z-40 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full shadow-md"
            >
              ⏱ Score
            </button>
          )}
        </>
      ) : (
        <div className="absolute bottom-5 right-5 z-50">
          <List />
        </div>
      )}
    </>
  );
}
