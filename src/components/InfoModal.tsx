import { IoClose } from "react-icons/io5";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function InfoModal({ open, onClose }: InfoModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1a1c2e] rounded-xl p-6 max-w-md w-full border border-white/10 shadow-lg relative text-white">
        <button
          className="absolute top-2 right-3 text-white text-xl hover:text-red-400 transition"
          onClick={onClose}
          aria-label="Fechar"
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold mb-3">O que é o Robson?</h2>
        <p className="text-gray-200 text-sm leading-relaxed">
          Robson é uma ferramenta de <strong>Planning Poker</strong> para squads de tecnologia que utilizam metodologias ágeis.
          <br />
          <br />
          A estética de cassino é uma brincadeira visual para tornar a experiência de planejamento de sprints mais leve, divertida e memorável — aqui, o que está em jogo é a sua próxima sprint!
        </p>
      </div>
    </div>
  );
}
