import { useState } from "react";

interface NicknameModalProps {
  onConfirm: (nickname: string, role: "player" | "observer") => void;
  defaultNickname?: string;
  defaultRole?: "player" | "observer";
}

export default function NicknameModal({ onConfirm, defaultNickname = "", defaultRole = "player" }: NicknameModalProps) {
  const [nickname, setNickname] = useState(defaultNickname);
  const [role, setRole] = useState<"player" | "observer">(() => defaultRole);

  const handleConfirm = () => {
    if (nickname.trim()) {
      onConfirm(nickname.trim(), role);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md text-white">
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-6 drop-shadow-md">
          Escolha seu nome
        </h2>

        <input
          className="bg-black/30 text-white border border-white/30 rounded-md px-3 sm:px-4 py-2 sm:py-3 w-full placeholder:text-white/60 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
          placeholder="Seu nome"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
        />

        <select
          className="bg-black/30 text-white border border-white/30 rounded-md px-3 sm:px-4 py-2 sm:py-3 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value as "player" | "observer")}
        >
          <option value="player">Participante</option>
          <option value="observer">Observador</option>
        </select>

        <button
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-3 sm:px-4 py-2 sm:py-3 rounded-md w-full text-sm sm:text-base transition-colors"
          onClick={handleConfirm}
          disabled={!nickname.trim()}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
