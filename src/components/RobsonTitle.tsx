interface RobsonTitleProps {
  card?: string;
}

export default function RobsonTitle({ card }: RobsonTitleProps) {
  return (
    <div className="flex flex-col items-center mt-4 sm:mt-6 md:mt-8">
      {/* Título em arco estilizado */}
      <img
        src="/robson/robsonTitle.png"
        alt="ROBSON"
        className="w-48 sm:w-60 md:w-72 h-auto drop-shadow-[0_2px_8px_rgba(255,255,0,0.4)]"
      />

      {card && (
        <span className="-mt-12 sm:-mt-14 md:-mt-16 text-base sm:text-lg md:text-xl text-yellow-200 font-semibold tracking-wider italic drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          Estimando <span className="text-white">{card}</span>
        </span>
      )}
    </div>
  );
}
