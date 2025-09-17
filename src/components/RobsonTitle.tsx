interface RobsonTitleProps {
  card?: string;
}

export default function RobsonTitle({ card }: RobsonTitleProps) {
  return (
    <div className="flex flex-col items-center mt-2 sm:mt-4 md:mt-6 select-none">
      {/* Logo ROBSON */}
      <img
        src="/robsonTitle.png"
        alt="ROBSON"
        className="w-36 sm:w-48 md:w-60 lg:w-72 h-auto
                   drop-shadow-[0_2px_8px_rgba(255,255,0,0.4)]"
      />

      {card && (
        <span
          className="-mt-8 sm:-mt-10 md:-mt-28
                     text-[clamp(10px,1.6vw,18px)]
                     text-yellow-200 font-semibold tracking-wider italic
                     leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
        >
          Estimando <span className="text-white">{card}</span>
        </span>
      )}
    </div>
  );
}
