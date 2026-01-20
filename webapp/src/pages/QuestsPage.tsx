import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import apiClient from '../api/client';
import { AnimatedContainer, fadeInUp, staggerContainer } from '../utils/animations';

interface Quest {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary';
  rewards: { gold: number; experience: number; gems?: number };
  progress: number;
  isCompleted: boolean;
  expiresAt: string;
}

const QuestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameStore();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      const data = await apiClient.getQuests();
      setQuests(data);
    } catch (error) {
      console.error('Failed to load quests:', error);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColors: any = {
    easy: 'from-green-500 to-emerald-500',
    normal: 'from-blue-500 to-cyan-500',
    hard: 'from-orange-500 to-red-500',
    legendary: 'from-purple-500 to-pink-500',
  };

  const difficultyLabels: any = {
    easy: '✨ Легко',
    normal: '⭐ Обычно',
    hard: '💎 Сложно',
    legendary: '👑 Легендарно',
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      await apiClient.completeQuest(questId);
      loadQuests();
    } catch (error) {
      console.error('Failed to complete quest:', error);
    }
  };

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
        <h1 className="text-3xl font-black gradient-text">📋 Ежедневные задания</h1>
        <p className="text-slate-400 text-sm mt-1">Выполни задания и получи награды</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-slate-400">Загрузка заданий...</p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="px-4 py-4 space-y-4"
        >
          {quests.length === 0 ? (
            <motion.div variants={fadeInUp} className="game-card text-center py-8">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-slate-400">Нет доступных заданий</p>
            </motion.div>
          ) : (
            quests.map((quest, index) => (
              <motion.div
                key={quest._id}
                variants={fadeInUp}
                className={`game-card border-2 ${
                  quest.isCompleted ? 'border-green-500/50 opacity-60' : 'border-slate-700 hover:border-slate-600'
                } transition cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{quest.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold bg-gradient-to-r ${
                          difficultyColors[quest.difficulty]
                        } text-white`}
                      >
                        {difficultyLabels[quest.difficulty]}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400">{quest.description}</p>
                  </div>
                  {quest.isCompleted && <div className="text-2xl">✅</div>}
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${quest.progress}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{quest.progress}% завершено</div>
                </div>

                {/* Rewards */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="stat-badge">💰 +{quest.rewards.gold}</div>
                  <div className="stat-badge">📈 +{quest.rewards.experience}</div>
                  {quest.rewards.gems && <div className="stat-badge">💎 +{quest.rewards.gems}</div>}
                </div>

                {/* Time */}
                <div className="text-xs text-slate-500 mb-3">
                  ⏰ Истекает: {new Date(quest.expiresAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                {/* Button */}
                {!quest.isCompleted && (
                  <button
                    onClick={() => handleCompleteQuest(quest._id)}
                    className="w-full game-button text-white font-bold py-2"
                  >
                    Выполнить задание →
                  </button>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default QuestsPage;
