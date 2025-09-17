import { useState, useMemo } from "react";

export type GameType = { name: string; values: (number | string)[] };

const PRESETS: GameType[] = [
  { name: 'Fibonacci', values: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '☕'] },
  { name: 'Camisetas', values: ['I', 'PP', 'P', 'M', 'L', 'XL', '☕'] },
  { name: 'Mult. 2', values: [0, 1, 2, 4, 8, 16, 32, 64, '☕'] },
];

export function GameTypePicker({
  onChange,
}: {
  onChange: (gt: GameType | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [customValues, setCustomValues] = useState<(number | string)[] | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const currentGameType = useMemo(() => {
    if (selected === 'Custom Fibonacci' && customValues) {
      return { name: 'Custom Fibonacci', values: customValues } as GameType;
    }
    const preset = PRESETS.find(p => p.name === selected);
    return preset ?? null;
  }, [selected, customValues]);

  // expõe mudança para o pai
  useMemo(() => onChange(currentGameType), [currentGameType]);

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-white/90 text-lg font-semibold mb-3">A planning será feita em:</h2>

      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => setSelected(p.name)}
            className={`rounded-xl border p-4 text-white text-left transition
              ${selected === p.name ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
          >
            <div className="font-bold">{p.name}</div>
            <div className="text-xs opacity-80 mt-1 truncate">
              {p.values.join(' · ')}
            </div>
          </button>
        ))}

        <button
          onClick={() => { setSelected('Custom Fibonacci'); setCustomOpen(true); }}
          className={`rounded-xl border p-4 text-white text-left transition
            ${selected === 'Custom Fibonacci' ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >
          <div className="font-bold">Custom Fibonacci</div>
          <div className="text-xs opacity-80 mt-1">Monte suas cartas e vete o que não quiser</div>
        </button>
      </div>

      {/* Modal de customização */}
      {customOpen && (
        <CustomFibonacciModal
          initial={[0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '☕']}
          onClose={() => setCustomOpen(false)}
          onSave={(vals) => { setCustomValues(vals); setCustomOpen(false); }}
        />
      )}

      {/* Preview do selecionado */}
      {currentGameType && (
        <div className="mt-4 text-white/90 text-sm">
          <div className="mb-1">Selecionado: <b>{currentGameType.name}</b></div>
          <div className="flex flex-wrap gap-2">
            {currentGameType.values.map((v, i) => (
              <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-xs">{String(v)}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CustomFibonacciModal({
  initial,
  onSave,
  onClose,
}: {
  initial: (number | string)[];
  onSave: (values: (number | string)[]) => void;
  onClose: () => void;
}) {
  const [cards, setCards] = useState<(number | string)[]>(initial);
  const [veto, setVeto] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null); // opcional

  // 🔑 normalizador — usa string para comparar; numéricos viram "42", strings viram UPPERCASE; "☕" é preservado
  const norm = (v: number | string) => {
    const s = String(v).trim();
    if (s === '☕') return '☕';
    const n = Number(s);
    if (!Number.isNaN(n)) return String(n);
    return s.toUpperCase();
  };

  const toggleVeto = (val: number | string) => {
    const key = norm(val);
    setVeto(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const removeCard = (val: number | string) => {
    const key = norm(val);
    setCards(prev => prev.filter(c => norm(c) !== key));
    // também limpa veto referente a essa carta (opcional)
    setVeto(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const addCard = (val: string) => {
    setError(null);
    const raw = val.trim();
    if (!raw) return;

    const key = norm(raw);
    const exists = cards.some(c => norm(c) === key);
    if (exists) {
      setError(`"${raw}" já existe no baralho.`);
      return;
    }

    const parsed =
      key === "☕"
        ? "☕"
        : !Number.isNaN(Number(raw))
          ? Number(raw)
          : raw.toUpperCase();

    setCards(prev => {
      // ☕ sempre vai pro fim
      if (parsed === "☕") {
        return [...prev.filter(c => c !== "☕"), "☕"];
      }

      // se for número, mantém ordem numérica
      if (typeof parsed === "number") {
        const withoutCoffee = prev.filter(c => c !== "☕") as (number | string)[];
        const coffee = prev.includes("☕") ? ["☕"] : [];
        const newList = [...withoutCoffee, parsed].sort((a, b) => {
          const na = typeof a === "number" ? a : Number.MAX_SAFE_INTEGER;
          const nb = typeof b === "number" ? b : Number.MAX_SAFE_INTEGER;
          return na - nb;
        });
        return [...newList, ...coffee];
      }

      // se for string (ex.: "XL", "PP"), insere logo antes do ☕ se existir
      const coffeeIndex = prev.indexOf("☕");
      if (coffeeIndex >= 0) {
        const before = prev.slice(0, coffeeIndex);
        const after = prev.slice(coffeeIndex);
        return [...before, parsed, ...after];
      }
      return [...prev, parsed];
    });
  };


  const handleSave = () => {
    // filtro final: aplica veto e dedup por segurança
    const seen = new Set<string>();
    const result: (number | string)[] = [];
    for (const c of cards) {
      const k = norm(c);
      if (veto[k]) continue;
      if (seen.has(k)) continue;
      seen.add(k);
      // mantém tipo number quando possível
      if (k === '☕') result.push('☕');
      else if (!Number.isNaN(Number(k))) result.push(Number(k));
      else result.push(k); // já está em UPPERCASE
    }
    if (result.length === 0) return; // mantém pelo menos 1
    onSave(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-2xl bg-[#22243a] border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">Custom Fibonacci</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>

        <p className="text-white/80 text-sm mb-3">
          Clique numa carta para <b>vetar</b> (anima efeito) ou remova do baralho.
        </p>

        {/* (Opcional) erro de duplicado */}
        {error && (
          <div className="mb-3 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {cards.map((c, i) => {
            const isVeto = !!veto[norm(c)];
            return (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => toggleVeto(c)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleVeto(c)}
                className={`
                  relative group select-none px-3 py-2 rounded-xl border cursor-pointer
                  ${isVeto ? 'border-red-400 bg-red-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                  text-white text-sm transition
                `}
              >
                <span className={`${isVeto ? 'line-through opacity-50 scale-95' : ''}`}>
                  {String(c)}
                </span>

                {/* Remover carta SEM disparar veto */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeCard(c); }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/10 border border-white/20 text-white text-xs opacity-0 group-hover:opacity-100 transition"
                  title="Remover"
                  aria-label="Remover carta"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <AddCardInline onAdd={addCard} />

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-white/10 text-white hover:bg-white/20">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-600">Salvar</button>
        </div>
      </div>
    </div>
  );
}

function AddCardInline({ onAdd }: { onAdd: (v: string) => void }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex items-center gap-2">
      <input
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Adicionar carta (ex: 144 ou ☕)"
        className="flex-1 px-3 py-2 rounded-md bg-[#1a1c2e] text-white border border-white/10 outline-none"
      />
      <button
        onClick={() => { onAdd(val); setVal(''); }}
        className="px-3 py-2 rounded-md bg-white/10 text-white hover:bg-white/20"
      >
        Adicionar
      </button>
    </div>
  );
}
