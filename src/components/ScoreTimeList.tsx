// ScoreTimeList.tsx
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../provider/SocketProvider';
import { FiChevronRight } from 'react-icons/fi';

interface ScoreTimeItem {
  point: string;
  time: string;
}

const ScoreTimePanel = memo(function ScoreTimePanel({
  items,
  isMobile,
  onCloseDrawer,
  onChange,
  onAdd,
  onRemove,
  onReset,
}: {
  items: ScoreTimeItem[];
  isMobile: boolean;
  onCloseDrawer: () => void;
  onChange: (index: number, field: 'point' | 'time', value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="w-full sm:w-[250px] bg-[#2f3e5d] rounded-xl shadow-lg p-3 sm:p-4 border border-yellow-400 text-white text-xs sm:text-sm h-full sm:h-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-yellow-300 font-semibold text-sm sm:text-base">Pontuação x Tempo</h3>
        {isMobile && (
          <button onClick={onCloseDrawer} className="text-white text-lg">
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
              onChange={(e) => onChange(index, 'point', e.target.value)}
              className="bg-[#1f2e45] text-white rounded px-2 py-1 w-[40%] border border-gray-600"
            />
            =
            <input
              type="text"
              value={item.time}
              onChange={(e) => onChange(index, 'time', e.target.value)}
              className="bg-[#1f2e5d] text-white rounded px-2 py-1 w-[45%] border border-gray-600"
            />
            <button
              onClick={() => onRemove(index)}
              className="text-yellow-300 hover:text-red-400 text-sm ml-1"
              title="Remover"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button onClick={onAdd} className="mt-2 text-yellow-200 hover:text-yellow-100 underline text-xs sm:text-sm">
        + Adicionar linha
      </button>

      <button
        onClick={onReset}
        className="mt-3 bg-yellow-600 hover:bg-yellow-500 w-full py-1 rounded text-xs sm:text-sm text-white font-semibold shadow"
      >
        Resetar Rodada
      </button>
    </div>
  );
});

export default function ScoreTimeList({ onReset }: { onReset: () => void }) {
  const socket = useSocketContext();

  const [items, setItems] = useState<ScoreTimeItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // guarda última versão aplicada pra evitar reescrever desnecessariamente (eco do servidor)
  const lastSerializedRef = useRef<string>('');

  // receber do servidor
  useEffect(() => {
    if (!socket) return;

    const handleServerList = (list: ScoreTimeItem[]) => {
      const serialized = JSON.stringify(list ?? []);
      if (serialized !== lastSerializedRef.current) {
        lastSerializedRef.current = serialized;
        setItems(list ?? []);
      }
    };

    socket.on('scoreTime', handleServerList);
    socket.emit('scoreTime:get');

    return () => {
      socket.off('scoreTime', handleServerList);
    };
  }, [socket]);

  // detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- debounce SEM stale closure (sempre usa o socket atual) ---
  const debTimer = useRef<number | null>(null);
  const emitWithDebounce = useRef<(next: ScoreTimeItem[]) => void>(() => { });

  useEffect(() => {
    // toda vez que o socket muda (conecta/reconecta), reconfigura o emissor
    emitWithDebounce.current = (next: ScoreTimeItem[]) => {
      if (!socket) return;
      if (debTimer.current) window.clearTimeout(debTimer.current);
      debTimer.current = window.setTimeout(() => {
        lastSerializedRef.current = JSON.stringify(next);
        socket.emit('scoreTime:set', next);
      }, 200);
    };
    return () => {
      if (debTimer.current) window.clearTimeout(debTimer.current);
      debTimer.current = null;
    };
  }, [socket]);

  // --- handlers podem continuar estáveis; usam .current ---
  const handleChange = useCallback((index: number, field: 'point' | 'time', value: string) => {
    setItems(prev => {
      const next = prev.map((it, i) => (i === index ? { ...it, [field]: value } : it));
      emitWithDebounce.current(next);
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    setItems(prev => {
      const next = [...prev, { point: '', time: '' }];
      emitWithDebounce.current(next);
      return next;
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setItems(prev => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      emitWithDebounce.current(next);
      return next;
    });
  }, []);

  return (
    <>
      {isMobile ? (
        <>
          {showDrawer && (
            <div className="fixed inset-0 bg-black/70 z-50 flex justify-end">
              <div className="w-[90%] max-w-xs h-full bg-[#1c1c1c] p-4">
                <ScoreTimePanel
                  items={items}
                  isMobile
                  onCloseDrawer={() => setShowDrawer(false)}
                  onChange={handleChange}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                  onReset={onReset}
                />
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
          <ScoreTimePanel
            items={items}
            isMobile={false}
            onCloseDrawer={() => { }}
            onChange={handleChange}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onReset={onReset}
          />
        </div>
      )}
    </>
  );
}
