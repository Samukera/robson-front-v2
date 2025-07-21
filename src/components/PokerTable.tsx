import React from 'react';

interface PokerTableProps {
  children?: React.ReactNode;
}

export default function PokerTable({ children }: PokerTableProps) {
  return (
    <div className="relative w-[900px] h-[580px] bg-[#2b2f3b] rounded-[300px] border-[20px] border-[#4b3621] shadow-[inset_0_0_60px_rgba(0,0,0,0.5),0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Área verde central da mesa */}
      <div className="absolute inset-10 bg-[#1f5132] rounded-[260px] shadow-inner" />

      {/* Espaço reservado para jogadores, cartas, etc */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        {children}
      </div>
    </div>
  );
}
