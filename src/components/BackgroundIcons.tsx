export default function BackgroundIcons() {
  const icons = ["♠️", "♥️", "♣️", "♦️", "🎰", "🎲", "🃏"];

  const positions = Array.from({ length: 20 }, (_, i) => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    icon: icons[Math.floor(Math.random() * icons.length)],
    size: Math.random() * (4 - 2) + 2, // entre 2rem e 4rem
    rotate: Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, index) => (
        <div
          key={index}
          className="absolute select-none text-white opacity-10"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            fontSize: `${pos.size}rem`,
            transform: `rotate(${pos.rotate}deg)`,
            textShadow: "0 0 10px rgba(255,255,255,0.3)"
          }}
        >
          {pos.icon}
        </div>
      ))}
    </div>
  );
}
