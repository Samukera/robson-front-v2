export default function CardSVG({ value, hidden = false }: { value?: string; hidden?: boolean }) {
  return (
    <div className="w-full h-full object-cover rounded-md border shadow-inner bg-white relative flex items-center justify-center text-lg sm:text-xl font-bold">
      {hidden ? (
        <img
          src="/robson/back-card.svg"
          alt="Carta Virada"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <span className="text-black">{value}</span>
      )}
    </div>
  );
}
