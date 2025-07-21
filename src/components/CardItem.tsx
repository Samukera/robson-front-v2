import { motion, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";
import CardSVG from "./CardSVG";
import classNames from "classnames";

interface Props {
  card: string;
  index: number;
  total: number;
  vote: (card: string) => void;
  currentVote: string | null;
  countdown: number;
}

export default function CardItem({ card, index, total, vote, currentVote, countdown }: Props) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const cardWidth = 64;
  const overlap = -24;
  const effectiveWidth = cardWidth + overlap;
  const totalWidth = effectiveWidth * (total - 1);
  const startOffset = -totalWidth / 2;

  // 🌙 Curvatura vertical
  const curveY = -Math.pow(index - (total - 1) / 2, 2) * 1.5;

  // 🌀 Rotação lateral mais acentuada nas pontas
  const center = (total - 1) / 2;
  const distanceFromCenter = index - center;
  const angleStep = 4; // quanto maior, mais curva
  const rotateZ = distanceFromCenter * angleStep;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    rotateX.set((-deltaY / centerY) * 10);
    rotateY.set((deltaX / centerX) * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(8);
    rotateY.set(0);
    setHovered(false);
  };

  return (
    <div
      className="absolute"
      style={{
        left: `calc(50% + ${startOffset + index * effectiveWidth}px)`,
        bottom: `${curveY}px`,
        transform: `translateX(-50%) rotate(${rotateZ}deg)`,
      }}
    >
      {/* Wrapper para ring visual estável */}
      <div
        className={classNames(
          "w-14 h-20 sm:w-16 sm:h-24 pointer-events-none rounded-lg",
          {
            "ring-4 ring-yellow-400 z-20": currentVote === card,
          }
        )}
      >
        <motion.div
          ref={cardRef}
          onClick={() => vote(card)}
          onMouseEnter={() => {
            if (window.innerWidth >= 640) {
              rotateX.set(8);
              setHovered(true);
            }
          }}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          animate={{
            scale: hovered ? 1.1 : 1,
            y: hovered ? -24 : 0,
            boxShadow: hovered
              ? "0px 10px 20px rgba(0,0,0,0.4)"
              : "0px 0px 0px rgba(0,0,0,0)",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className={classNames(
            "cursor-pointer w-14 h-20 sm:w-16 sm:h-24 rounded-lg border-2 border-black shadow-md pointer-events-auto bg-white",
            {
              "opacity-50 cursor-not-allowed": countdown > 0,
            }
          )}
        >
          <CardSVG value={card} hidden={false} />
        </motion.div>
      </div>
    </div>
  );
}
