import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import CardSVG from '../components/CardSVG';
import { useGame } from '../context/GameContext';
import classNames from 'classnames';
import SharingModal from '../components/SharingModal';
import Tickets from '../components/Tickets';
import SettingsModal from '../components/SettingsModal';
import { useSocketContext } from '../provider/SocketProvider';
import NicknameModal from '../components/NicknameModal';
import ActionButton from '../components/ActionButton';
import { MdContentCopy, MdMiscellaneousServices } from 'react-icons/md';
import { motion } from 'framer-motion';
import CardItem from '../components/CardItem';
import ScoreTimeList from "../components/ScoreTimeList";
import RobsonTitle from '../components/RobsonTitle';
import { IconPlanningText } from '../components/IconPlanningText';


interface ActiveEmoji {
  id: number;
  emoji: string;
  startX: number;
  startY: number;
  endX?: number;
  endY?: number;
  isSelf: boolean;
}

export default function Game() {

  const socket = useSocketContext();

  const {
    players,
    showVotes,
    currentVote,
    countdown,
    gameFormat,
    closestValue,
    votingOnName,
    restart,
    show,
    vote,
    setName,
    self,
    sendEmoji,
    updateGameFormat,
  } = useGame();

  const [nickname, setNickname] = useState(() => localStorage.getItem('name') || '');
  const [showNicknameModal, setShowNicknameModal] = useState(!nickname);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [role, setRole] = useState<'player' | 'observer'>('player');
  const playerRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({});
  const [activeEmojis, setActiveEmojis] = useState<ActiveEmoji[]>([]);
  const tableRef = useRef<HTMLDivElement>(null);
  const hasVotes = players.some(p => p.vote !== null && p.vote !== undefined);
  const location = useLocation() as { state?: { gameType?: { name: string; values: (number | string)[] } } };
  const selectedFromHome = location.state?.gameType;
  // evita emitir duas vezes
  const sentOnceRef = useRef(false);



  const animateEmoji = (fromId: string, toId: string, emoji: string) => {
    const fromEl = playerRefs.current[fromId]?.current;
    const toEl = playerRefs.current[toId]?.current;
    const containerRect = tableRef.current?.getBoundingClientRect();

    if (!fromEl || !containerRect) return;

    const fromRect = fromEl.getBoundingClientRect();

    if (fromId === toId) {
      // animação para si mesmo
      const centerX = fromRect.left - containerRect.left + fromRect.width / 2;
      const centerY = fromRect.top - containerRect.top - 30;

      const newEmoji = {
        id: Date.now(),
        emoji,
        startX: centerX,
        startY: centerY,
        isSelf: true,
      };

      setActiveEmojis(prev => [...prev, newEmoji]);

      setTimeout(() => {
        setActiveEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
      }, 1000);

      return;
    }

    if (!toEl) return; // 🚨 CORREÇÃO: se toEl não existe, não anima

    const toRect = toEl.getBoundingClientRect();

    const startX = fromRect.left - containerRect.left + fromRect.width / 2;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2;
    const endX = toRect.left - containerRect.left + toRect.width / 2;
    const endY = toRect.top - containerRect.top + toRect.height / 2;

    const newEmoji = {
      id: Date.now(),
      emoji,
      startX,
      startY,
      endX,
      endY,
      isSelf: false,
    };

    setActiveEmojis(prev => [...prev, newEmoji]);

    setTimeout(() => {
      setActiveEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 1000);
  };


  useEffect(() => {
    if (!socket || !self) return;

    socket.on("receiveEmoji", ({ from, to, emoji }) => {
      console.log('Received emoji from', from, 'to', to, 'self:', self.id);

      // 💡 Caso seja um envio para si mesmo (A -> A)
      if (from === to) {
        animateEmoji(from, to, emoji);
      }
      // 💡 Caso geral: A -> B
      else {
        animateEmoji(from, to, emoji);
      }
    });

    return () => {
      socket.off("receiveEmoji");
    };
  }, [socket, self]);

  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('name');
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  useEffect(() => {
    if (!socket || !selectedFromHome || sentOnceRef.current) return;

    const send = () => {
      updateGameFormat({
        ...selectedFromHome,
        values: selectedFromHome.values.map(String), // garante serialização
      });
      sentOnceRef.current = true;
    };

    if (socket.connected) send();

    socket.on('connect', send);

    // ✅ cleanup precisa retornar uma função que retorna void
    return () => {
      if (!socket) return;
      socket.off('connect', send);
    };
  }, [socket, selectedFromHome, updateGameFormat]);


  return (
    <div className="min-h-screen text-white flex items-center justify-center relative overflow-hidden bg-[#1f2c45] bg-[radial-gradient(ellipse_at_center,_#2f3f65_0%,_#1f2c45_80%)]"

    >
      {/* Título ROBSON — menor em telas menores */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none
             top-1 sm:top-2 md:top-3 lg:top-4"
      >
        <div className="origin-top 
                  scale-[0.55] sm:scale-[0.65] md:scale-[0.75] lg:scale-[0.90] xl:scale-100">
          <RobsonTitle card={votingOnName} />
        </div>
      </div>

      {/* 🔗 Header com tickets à esquerda e botões à direita */}
      <div className="absolute top-5 w-full px-4 flex justify-between items-start z-50">
        {/* 🧾 Tarefas (lado esquerdo) */}
        <Tickets />

        {/* ⚙️ Botões (lado direito) */}
        <div className="flex gap-3">
          <ActionButton label={<MdMiscellaneousServices />} onClick={() => setShowSettings(true)} variant="outlied" />
          <ActionButton label={<MdContentCopy />} onClick={() => setShowShareModal(true)} variant="outlied" />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 w-[1250px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-3xl z-0"></div>
      <div
        ref={tableRef}
        className="relative w-full max-w-[1200px] aspect-[12/7] rounded-[300px] 
             border-[20px] border-[#FFD700]/30 
             shadow-[inset_0_0_60px_rgba(0,0,0,0.6),0_20px_60px_rgba(0,0,0,0.8)] 
             bg-gradient-to-br from-[#2b2f3b] to-[#1e222b] 
             transition-all duration-500 ease-in-out overflow-hidden backdrop-blur-sm "
      >
        <div className="absolute inset-10 bg-[#304464] rounded-[260px] shadow-inner"></div>


        {/* 🎉 Emojis animados */}
        {activeEmojis.map(e =>
          e.isSelf ? (
            <motion.div
              key={e.id}
              initial={{ x: e.startX, y: e.startY, opacity: 1, rotate: 0, scale: 1 }}
              animate={{ rotate: 360, scale: [1, 1.2, 1], opacity: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute text-3xl pointer-events-none z-50"
            >
              {e.emoji}
            </motion.div>
          ) : (
            <motion.div
              key={e.id}
              initial={{ x: e.startX, y: e.startY, opacity: 1, rotate: 0 }}
              animate={{
                x: [
                  e.startX,
                  (e.startX + e.endX!) / 2,
                  e.endX! - (e.endX! - e.startX) / 4,
                  e.endX!,
                ],
                y: [
                  e.startY,
                  e.startY - 100,
                  e.endY! - 100,
                  e.endY!,
                ],
                rotate: [0, 360, 720, 1080],
                opacity: [1, 1, 1, 0],
              }}
              transition={{ duration: 1, ease: 'linear' }}
              className="absolute text-3xl pointer-events-none z-50"
            >
              {e.emoji}
            </motion.div>
          )
        )}

        {/* 👥 Jogadores em elipse angular realista */}
        {players
          .filter((p) => p.role === 'player')
          .map((player, index) => {
            const total = players.filter((p) => p.role === 'player').length;
            const angle = (2 * Math.PI / total) * index;

            // 📱 Responsivo: raio da elipse muda conforme o tamanho da tela
            let a = 300;
            let b = 160;
            const width = window.innerWidth;

            if (width < 640) {
              a = 140;
              b = 80;
            } else if (width < 1024) {
              a = 200;
              b = 110;
            }

            const x = a * Math.cos(angle);
            const y = b * Math.sin(angle);

            if (!playerRefs.current[player.id]) {
              playerRefs.current[player.id] = React.createRef();
            }

            return (
              <div
                key={player.id}
                ref={playerRefs.current[player.id]}
                className="absolute group"
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Emoji picker */}
                    <div className="hidden group-hover:flex absolute top-0 right-0 bg-white rounded shadow p-1 z-50">
                      <button onClick={() => sendEmoji(player.id, '👍')}>👍</button>
                      <button onClick={() => sendEmoji(player.id, '🔥')}>🔥</button>
                      <button onClick={() => sendEmoji(player.id, '❤️')}>❤️</button>
                      <button onClick={() => sendEmoji(player.id, '😂')}>😂</button>
                      <button onClick={() => sendEmoji(player.id, '🚬')}>🚬</button>
                    </div>

                    {/* Avatar ou voto */}
                    <div
                      className={classNames(
                        'w-16 h-24 rounded-lg border-2 border-black flex items-center justify-center shadow-lg bg-white transition-transform',
                        {
                          'scale-100': showVotes,
                          'scale-90': !showVotes,
                        }
                      )}
                    >
                      <CardSVG value={player.vote} hidden={!showVotes || countdown !== 0} />
                    </div>
                    <img
                      src="/chip1.svg"
                      alt="Ficha"
                      className="absolute -bottom-3 -right-3 w-6 h-6"
                    />
                  </div>
                  <span className="text-white mt-1 text-xs sm:text-sm">{player.name}</span>
                </div>
              </div>
            );
          })}


        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 text-center z-10">

          {countdown > 0 ? (
            <div className="animate-ping-slow w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-yellow-500 flex items-center justify-center text-4xl sm:text-6xl font-bold text-black shadow-lg border-4 border-yellow-300">
              {countdown}
            </div>
          ) : (
            // ⬇️ Aqui vai o botão com anel animado
            <div className="relative flex flex-col items-center justify-center">
              {hasVotes && (
                <div className="absolute inset-0 rounded-full border-4 border-yellow-300 animate-ping opacity-50 pointer-events-none" />
              )}

              {/* Botão Revelar */}
              <button
                onClick={show}
                disabled={showVotes || !hasVotes}
                className={classNames(
                  "relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                  "bg-gradient-to-br from-blue-600 to-blue-800 text-yellow-200",
                  "border-[6px] border-yellow-300 shadow-[0_0_30px_rgba(255,255,0,0.4)]",
                  "hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,0,0.6)]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="drop-shadow text-sm sm:text-base lg:text-xl tracking-wide">
                  Revelar
                </span>
                <div className="absolute inset-0 rounded-full bg-yellow-300 opacity-10 pointer-events-none blur-[8px]" />
              </button>

              {/* Texto PLANNING responsivo abaixo do botão */}
              <div className="mt-3 sm:mt-4">
                <IconPlanningText
                  fill="#F8C83F"
                  opacity={0.20}
                  texting="PLANNING"
                  className="pointer-events-none select-none blur-[0.5px]
                 w-[120px] sm:w-[160px] md:w-[200px] lg:w-[260px] xl:w-[320px]"
                  height={50}
                />
              </div>
            </div>

          )}
        </div>




        {/* 📊 Resultados */}
        {showVotes && countdown === 0 && String(closestValue) && (
          <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] z-20">
            <div className="flex flex-col items-center">
              <div className="w-20 h-28 bg-yellow-400 rounded-lg shadow-2xl border-4 border-yellow-400">
                <CardSVG value={closestValue != null ? String(closestValue) : '☕'} hidden={false} />
              </div>
              <span className="text-yellow-100 mt-2 text-xs sm:text-sm font-semibold">Mais próximo</span>
            </div>
          </div>
        )}
        {showVotes && countdown === 0 && (
          <div
            className="absolute 
    bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-14 xl:bottom-16 
    left-1/2 -translate-x-1/2 z-30 flex gap-4"
          >
            <button
              onClick={() => socket?.emit("resetCurrent")}
              className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-1 px-3 sm:py-2 sm:px-4 text-xs sm:text-sm rounded"
            >
              Votar novamente
            </button>
            <button
              onClick={() => socket?.emit("nextTicket")}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded"
            >
              Concluído
            </button>
          </div>
        )}

      </div>

      {/* Lista de pontos e tempos */}
      <ScoreTimeList onReset={restart} />
      {/* 🃏 Cartas para Votar */}
      {
        self?.role === 'player' && (
          <div
            className="
    absolute 
    bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-16 xl:bottom-20
    left-1/2 -translate-x-1/2 
    w-full max-w-[700px] px-2
    flex justify-center gap-2
    z-40
  "
          >
            {gameFormat?.values.map((card, index) => (
              <CardItem
                key={card}
                card={String(card)}
                index={index}
                total={gameFormat.values.length}
                vote={vote}
                currentVote={String(currentVote)}
                countdown={countdown}
              />
            ))}
          </div>
        )
      }

      {/* 🔥 Modais */}
      {showShareModal && <SharingModal onClose={() => setShowShareModal(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

      {
        showNicknameModal && (
          <NicknameModal
            defaultNickname={nickname}
            defaultRole={role}
            onConfirm={(name, role) => {
              setNickname(name);
              setRole(role);
              setName(name, role);
              setShowNicknameModal(false);
            }}
          />
        )
      }
    </div >
  );
}
