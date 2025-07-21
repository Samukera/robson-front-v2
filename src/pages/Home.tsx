import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PokerChipButton from "../components/PokerChipButton";
import BackgroundIcons from "../components/BackgroundIcons";
import InfoModal from "../components/InfoModal";
import { IoHelpSharp } from "react-icons/io5";

export default function Home() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateRoom = () => {
    navigate("/game/" + crypto.randomUUID());
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#1a1c2e] bg-gradient-to-br from-[#1a1c2e] via-[#2b2f48] to-[#1a1c2e] overflow-hidden">
      <BackgroundIcons />

      <div className="backdrop-blur-lg bg-white/5 rounded-2xl p-10 border border-white/10 shadow-xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-white tracking-wide mb-4 drop-shadow-md">
          Planeje com <span className="text-yellow-400 glow-text">Robson</span>
        </h1>

        <img
          src="https://d2a0gza273xfgz.cloudfront.net/35835/uploads/6e2cb9f8-93d4-43f5-ab16-436df4cf34fa_800_420.png"
          className="w-80 mb-6 rounded-xl border-4 border-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.5)]"
        />

        <PokerChipButton label="Criar Sala" onClick={handleCreateRoom} />
      </div>

      {/* Ícone de ajuda no canto */}
      <button
        onClick={() => setModalOpen(true)}
        className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white text-xl w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-white/10 transition"
        title="O que é o Robson?"
      >
        <IoHelpSharp />
      </button>

      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
