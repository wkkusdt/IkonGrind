import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import apiClient from '../api/client';
import { AnimatedContainer, fadeInUp, staggerContainer } from '../utils/animations';

interface LeaderboardEntry {
  _id: string;
  username: string;
  level: number;
  score: number;
  rank: number;
}

const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameStore();
  const [players, setPlayers] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [seasonInfo, setSeasonInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const [topPlayers, rank, season] = await Promise.all([
        apiClient.getTopPlayers(100),
        apiClient.getUserRank(),
        apiClient.getSeasonInfo(),
      ]);

      setPlayers(topPlayers);
      setUserRank(rank);
      setSeasonInfo(season);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
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
        <h1 className="text-3xl font-black gradient-text">🏆 Таблица лидеров</h1>

        {seasonInfo && (
          <p className="text-slate-400 text-sm mt-1">
            Сезон {seasonInfo.seasonNumber} • Осталось {seasonInfo.daysRemaining} дней
          </p>
        )}
      </motion.div>

      {/* User Rank */}
      {userRank && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="px-4 py-4">
          <div
            className={`game-card border-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 ${
              userRank.rank <= 3 ? 'border-yellow-500/50' : 'border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getMedalEmoji(userRank.rank)}</div>
                <div>
                  <div className="font-bold">Твой рейтинг</div>
                  <div className="text-sm text-slate-400">{user?.firstName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{userRank.rank}</div>
                <div className="text-xs text-slate-400">место</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <p className="text-slate-400">Загрузка рейтинга...</p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="px-4 py-4 space-y-2"
        >
          {players.map((player, index) => (
            <motion.div
              key={player._id}
              variants={fadeInUp}
              className={`game-card flex items-center justify-between p-4 ${
                player._id === user?._id ? 'border-2 border-cyan-500' : 'border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl font-bold w-10 text-center">{getMedalEmoji(player.rank)}</div>
                <div>
                  <div className="font-semibold">{player.username}</div>
                  <div className="text-xs text-slate-400">Уровень {player.level}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-cyan-400">{player.score}</div>
                <div className="text-xs text-slate-400">очков</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="px-4 py-6">
        <div className="game-card text-center text-sm text-slate-400">
          📊 Рейтинг обновляется каждый час. Лучшие игроки получают награды в конце сезона!
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
