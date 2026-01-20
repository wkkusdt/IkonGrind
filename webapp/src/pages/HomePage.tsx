import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { AnimatedContainer, staggerContainer, fadeInUp } from '../utils/animations';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameStore();

  const menuItems = [
    { id: 'quests', label: '📋 Задания', color: 'from-amber-500 to-orange-500' },
    { id: 'games', label: '🎮 Мини-игры', color: 'from-cyan-500 to-blue-500' },
    { id: 'profile', label: '👤 Профиль', color: 'from-purple-500 to-pink-500' },
    { id: 'leaderboard', label: '🏆 Рейтинг', color: 'from-green-500 to-emerald-500' },
  ];

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-slate-400">Загрузка игры...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pt-6 px-4 pb-4 bg-gradient-to-b from-slate-900 to-transparent"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-black gradient-text mb-2">IKONGRID</h1>
          <p className="text-slate-400 text-sm">Добро пожаловать обратно, {user.firstName}!</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="game-card text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-1">{user.level}</div>
            <div className="text-xs text-slate-400">Уровень</div>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" delay={0.1} className="game-card text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">⭐</div>
            <div className="text-xs text-slate-400">{user.loginStreak}x Стрик</div>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" delay={0.2} className="game-card text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{user.gold}</div>
            <div className="text-xs text-slate-400">Золото</div>
          </motion.div>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" delay={0.3} className="game-card text-center">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{user.gems}</div>
            <div className="text-xs text-slate-400">Кристаллы</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Experience Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="px-4 py-4">
        <div className="game-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Опыт</span>
            <span className="text-xs text-slate-400">{user.experience} / 100</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((user.experience / 100) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Daily Bonus */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="px-4 py-2">
        <div
          className="game-card border-2 border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 cursor-pointer hover:border-green-500/50 transition"
          onClick={() => navigate('/quests')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-green-400">🎁 Ежедневный бонус</div>
              <p className="text-sm text-slate-400">+200 Золота за вход</p>
            </div>
            <div className="text-2xl">→</div>
          </div>
        </div>
      </motion.div>

      {/* Menu */}
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="px-4 py-6 space-y-3">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            variants={fadeInUp}
            onClick={() => navigate(`/${item.id}`)}
            className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 bg-gradient-to-r ${item.color} text-white shadow-lg hover:shadow-2xl`}
          >
            {item.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Fun Facts */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="px-4 pb-6">
        <div className="game-card text-center text-sm text-slate-400 border-dashed border">
          💡 <strong>Совет:</strong> Заходи каждый день, чтобы получить бонус и сохранить стрик!
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
