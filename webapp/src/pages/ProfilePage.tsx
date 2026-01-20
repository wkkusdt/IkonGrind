import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { AnimatedContainer, fadeInUp } from '../utils/animations';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameStore();

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = [
    { label: 'Уровень', value: user.level, icon: '⭐' },
    { label: 'Опыт', value: user.experience, icon: '📈' },
    { label: 'Золото', value: user.gold, icon: '💰' },
    { label: 'Кристаллы', value: user.gems, icon: '💎' },
    { label: 'Стрик входов', value: user.loginStreak, icon: '🔥' },
  ];

  const achievements = [
    { name: 'Первый шаг', icon: '👣', unlocked: true },
    { name: 'Охотник', icon: '🎮', unlocked: user.statistics.totalGamesPlayed > 5 },
    { name: 'Чемпион', icon: '🏆', unlocked: user.statistics.totalGamesWon > 3 },
    { name: 'Трудяга', icon: '⚙️', unlocked: user.statistics.totalQuestsCompleted > 10 },
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
        <h1 className="text-3xl font-black gradient-text">👤 Профиль</h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-4">
        <div className="game-card text-center border-2 border-cyan-500/30 py-6">
          <div className="text-6xl mb-4">🧑‍🚀</div>
          <h2 className="text-3xl font-black mb-2 gradient-text">{user.firstName}</h2>
          <p className="text-slate-400 mb-4">@{user.username || 'Player'}</p>

          <div className="space-y-2 mb-6">
            <div className="inline-block stat-badge text-lg">
              ⭐ Уровень {user.level}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Статистика</h3>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 * index }} className="game-card text-center p-4">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Detailed Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Достижения</h3>
        <div className="game-card space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <span className="text-slate-400">🎮 Всего игр сыграно</span>
            <span className="font-bold">{user.statistics.totalGamesPlayed}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <span className="text-slate-400">🏆 Побед</span>
            <span className="font-bold text-green-400">{user.statistics.totalGamesWon}</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <span className="text-slate-400">📋 Заданий выполнено</span>
            <span className="font-bold text-blue-400">{user.statistics.totalQuestsCompleted}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">💵 Всего золота заработано</span>
            <span className="font-bold text-yellow-400">{user.statistics.totalGoldEarned}</span>
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="px-4 py-4">
        <h3 className="font-bold text-lg mb-3">Достижения</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`game-card text-center p-4 ${achievement.unlocked ? '' : 'opacity-50 grayscale'}`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <div className="text-sm font-semibold">{achievement.name}</div>
              {achievement.unlocked && <div className="text-xs text-green-400 mt-1">✓ Разблокировано</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Referral Code */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="px-4 py-4">
        <div className="game-card bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 p-4">
          <div className="text-center">
            <h3 className="font-bold mb-2">Пригласи друга</h3>
            <div className="bg-slate-800 rounded p-3 mb-3 family-mono text-sm">
              <code>{user.referralCode || 'CODE123'}</code>
            </div>
            <button className="w-full game-button text-white text-sm">
              📋 Скопировать код
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
