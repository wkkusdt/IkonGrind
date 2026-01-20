import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import apiClient from '../api/client';

const GamePlayPage: React.FC = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { user, updateGold, updateExperience } = useGameStore();

  const [gameState, setGameState] = useState<'loading' | 'playing' | 'finished'>('loading');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [rewards, setRewards] = useState<any>(null);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const startGame = async () => {
    try {
      const gameData = await apiClient.startGame(gameType || 'clicker');
      setGameState('playing');
      setScore(0);
      setTime(0);
    } catch (error) {
      console.error('Failed to start game:', error);
      navigate('/games');
    }
  };

  const handleGameEnd = async (finalResult: 'win' | 'loss') => {
    try {
      setGameState('finished');

      const response = await apiClient.endGame(
        gameType || 'clicker',
        score,
        finalResult,
        time
      );

      setResult(finalResult);
      setRewards(response.rewards);

      if (response.rewards) {
        updateGold(response.rewards.gold);
        updateExperience(response.rewards.experience);
      }
    } catch (error) {
      console.error('Failed to end game:', error);
    }
  };

  const gameConfigs: any = {
    clicker: {
      name: 'Кликер',
      icon: '🖱️',
      duration: 60,
      render: () => <ClickerGame score={score} setScore={setScore} time={time} onEnd={handleGameEnd} />,
    },
    reaction: {
      name: 'Реакция',
      icon: '⚡',
      duration: 90,
      render: () => <ReactionGame time={time} onEnd={handleGameEnd} />,
    },
    timing: {
      name: 'Тайминг',
      icon: '🎯',
      duration: 120,
      render: () => <TimingGame score={score} setScore={setScore} time={time} onEnd={handleGameEnd} />,
    },
    puzzle: {
      name: 'Пазл',
      icon: '🧩',
      duration: 120,
      render: () => <PuzzleGame score={score} setScore={setScore} time={time} onEnd={handleGameEnd} />,
    },
  };

  const config = gameConfigs[gameType] || gameConfigs.clicker;

  if (gameState === 'finished') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-8xl mb-4 animate-bounce">
            {result === 'win' ? '🎉' : '😢'}
          </div>
          <h1 className="text-4xl font-black mb-4">
            {result === 'win' ? 'Ты победил!' : 'Попробуй снова'}
          </h1>

          {rewards && (
            <div className="mb-8 space-y-2">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="stat-badge text-lg"
              >
                💰 +{rewards.gold} золота
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="stat-badge text-lg"
              >
                📈 +{rewards.experience} опыта
              </motion.div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/games')}
              className="w-full game-button text-white font-bold py-3 text-lg"
            >
              Вернуться в меню
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full game-button text-white font-bold py-3 text-lg opacity-70"
            >
              Играть снова
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-b from-slate-900 to-transparent flex items-center justify-between">
        <button onClick={() => navigate('/games')} className="text-slate-400 hover:text-white">
          ← Назад
        </button>
        <div className="text-center flex-1">
          <div className="text-2xl mb-1">{config.icon}</div>
          <h1 className="text-xl font-bold">{config.name}</h1>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-cyan-400">{time}s</div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center">
        {gameState === 'loading' ? (
          <div className="text-center">
            <div className="animate-spin text-5xl mb-4">⚙️</div>
            <p className="text-slate-400">Загрузка игры...</p>
          </div>
        ) : (
          config.render()
        )}
      </div>

      {/* Score */}
      <div className="px-4 py-4 bg-gradient-to-t from-slate-900 to-transparent">
        <div className="game-card text-center">
          <div className="text-4xl font-black gradient-text mb-2">{score}</div>
          <div className="text-slate-400">Текущий счёт</div>
        </div>
      </div>
    </div>
  );
};

// Простые игровые компоненты
interface GameComponentProps {
  score?: number;
  setScore?: (score: number | ((s: number) => number)) => void;
  time?: number;
  onEnd?: (result: 'win' | 'loss') => void;
}

const ClickerGame: React.FC<GameComponentProps & { time: number }> = ({ score = 0, setScore, time, onEnd }) => {
  useEffect(() => {
    if (time >= 60) {
      onEnd?.('win');
    }
  }, [time, onEnd]);

  return (
    <button
      onClick={() => setScore?.((s) => s + 1)}
      className="w-48 h-48 rounded-full text-8xl bg-gradient-to-br from-red-500 to-pink-500 hover:scale-105 active:scale-95 transition-transform shadow-2xl pulse-glow"
    >
      🖱️
    </button>
  );
};

const ReactionGame: React.FC<GameComponentProps> = ({ time, onEnd }) => {
  const [showBox, setShowBox] = useState(false);
  const [reactionTime, setReactionTime] = useState<number | null>(null);

  useEffect(() => {
    const delay = Math.random() * 3000 + 1000;
    const timer = setTimeout(() => setShowBox(true), delay);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (time >= 30) {
      onEnd?.('win');
    }
  }, [time, onEnd]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {showBox ? (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => {
            onEnd?.('win');
          }}
          className="w-32 h-32 rounded-2xl text-6xl bg-gradient-to-br from-yellow-500 to-orange-500 hover:scale-110 active:scale-90 transition-transform shadow-2xl"
        >
          ⚡
        </motion.button>
      ) : (
        <div className="text-center">
          <div className="text-4xl text-slate-500 mb-4">Жди...</div>
          <div className="text-6xl opacity-50">⏱️</div>
        </div>
      )}
    </div>
  );
};

const TimingGame: React.FC<GameComponentProps> = ({ score = 0, setScore, time, onEnd }) => {
  const [boxPosition, setBoxPosition] = useState(0);
  const [inZone, setInZone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoxPosition((p) => (p + 5) % 100);
      setInZone(Math.abs(p - 50) < 10);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time >= 60) {
      onEnd?.('win');
    }
  }, [time, onEnd]);

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm mb-8">
        <div className="relative h-20 bg-slate-800 rounded-xl overflow-hidden mb-4">
          <motion.div
            animate={{ x: `${boxPosition}%` }}
            className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded"
          />
          <div className="absolute top-0 left-1/2 h-full w-16 -ml-8 border-2 border-cyan-500 pointer-events-none" />
        </div>

        <button
          onClick={() => {
            if (inZone) {
              setScore?.((s) => s + 10);
            }
          }}
          className="w-full game-button text-white font-bold py-3"
        >
          {inZone ? '✓ НАЖМИ!' : 'Жди...'}
        </button>
      </div>
    </div>
  );
};

const PuzzleGame: React.FC<GameComponentProps> = ({ score = 0, setScore, time, onEnd }) => {
  const [tiles, setTiles] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5));

  useEffect(() => {
    if (time >= 120) {
      onEnd?.('win');
    }
  }, [time, onEnd]);

  const handleTileClick = (index: number) => {
    if (tiles[index] === index + 1) {
      setScore?.((s) => s + 10);
      const newTiles = [...tiles];
      newTiles.splice(index, 1);
      setTiles(newTiles);

      if (newTiles.length === 0) {
        onEnd?.('win');
      }
    }
  };

  return (
    <div className="w-full max-w-xs">
      <div className="grid grid-cols-3 gap-2 px-4">
        {tiles.map((tile, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTileClick(index)}
            className="aspect-square rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 font-bold text-2xl text-white hover:shadow-lg transition-shadow"
          >
            {tile}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GamePlayPage;
