import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import apiClient from '../api/client';
import { AnimatedContainer, fadeInUp, staggerContainer } from '../utils/animations';

const GamesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameStore();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await apiClient.getDailyStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const games = [
    {
      id: 'clicker',
      name: 'Кликер',
      icon: '🖱️',
      description: 'Кликай как можно больше за 60 секунд',
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'reaction',
      name: 'Реакция',
      icon: '⚡',
      description: 'Проверь свою скорость реакции',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 'timing',
      name: 'Тайминг',
      icon: '🎯',
      description: 'Попади в нужный момент',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'puzzle',
      name: 'Пазл',
      icon: '🧩',
      description: 'Собери паттерн быстро',
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 px-4 py-4 bg-gradient-to-b from-slate-900 to-transparent backdrop-blur"
      >
        <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white mb-3">
          ← Назад
        </button>
        <h1 className="text-3xl font-black gradient-text">🎮 Мини-игры</h1>
        <p className="text-slate-400 text-sm mt-1">Играй и зарабатывай награды</p>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="game-card text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.gamesRemaining}</div>
              <div className="text-xs text-slate-400">Игр осталось</div>
            </div>
            <div className="game-card text-center">
              <div className="text-2xl font-bold text-green-400">{stats.totalGoldEarned}</div>
              <div className="text-xs text-slate-400">Золота заработано</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Games */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-4 py-4 space-y-4"
      >
        {games.map((game) => (
          <motion.button
            key={game.id}
            variants={fadeInUp}
            onClick={() => navigate(`/games/${game.id}`)}
            className={`w-full game-card bg-gradient-to-br ${game.color} p-6 rounded-xl text-white hover:scale-105 active:scale-95 transition-transform`}
          >
            <div className="text-left">
              <div className="text-5xl mb-2">{game.icon}</div>
              <h2 className="text-2xl font-bold mb-1">{game.name}</h2>
              <p className="text-sm opacity-90">{game.description}</p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="px-4 py-6">
        <div className="game-card text-center text-sm text-slate-400">
          📊 Ты можешь играть в <strong>5 игр</strong> в день. Награды зависят от результата!
        </div>
      </motion.div>
    </div>
  );
};

export default GamesPage;
