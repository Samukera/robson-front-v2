// components/BackgroundIcons.tsx
import React, { useRef } from "react";

type Pos = {
  top: number;     // %
  left: number;    // %
  icon: string;
  size: number;    // rem
  rotate: number;  // deg
};

function generatePositions(count: number): Pos[] {
  const icons = ["♠️", "♥️", "♣️", "♦️", "🎰", "🎲", "🃏"];
  return Array.from({ length: count }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    icon: icons[Math.floor(Math.random() * icons.length)],
    size: 2 + Math.random() * 2, // 2rem ~ 4rem
    rotate: Math.random() * 360,
  }));
}

function BackgroundIconsInner({ count = 20 }: { count?: number }) {
  // ✅ gera UMA vez por montagem
  const positionsRef = useRef<Pos[] | null>(null);
  if (!positionsRef.current) {
    positionsRef.current = generatePositions(count);
  }
  const positions = positionsRef.current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {positions.map((pos, index) => (
        <span
          key={index}
          className="absolute text-white opacity-10 will-change-transform"
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            fontSize: `${pos.size}rem`,
            transform: `rotate(${pos.rotate}deg)`,
            textShadow: "0 0 10px rgba(255,255,255,0.3)",
            animation: "bgfloat 12s linear infinite",
          }}
        >
          {pos.icon}
        </span>
      ))}

      {/* animação suave opcional; não regenera posições */}
      <style>{`
        @keyframes bgfloat {
          0%   { transform: translateY(0) rotate(0deg); }
          50%  { transform: translateY(-6px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          span[style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

// ✅ evita re-render se props não mudarem
export default React.memo(BackgroundIconsInner);
