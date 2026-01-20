import GameSession from '../models/GameSession.js';
import User from '../models/User.js';

// Формула вознаграждения
const calculateRewards = (gameType: string, score: number, result: string) => {
  const baseGold = {
    clicker: 50,
    reaction: 60,
    timing: 70,
    puzzle: 80,
  };

  const baseExp = {
    clicker: 25,
    reaction: 30,
    timing: 35,
    puzzle: 40,
  };

  let multiplier = result === 'win' ? 1.5 : result === 'loss' ? 0.7 : 1;
  const scoreBonus = Math.floor(score / 100);

  return {
    gold: Math.ceil(baseGold[gameType as keyof typeof baseGold] * multiplier + scoreBonus),
    experience: Math.ceil(baseExp[gameType as keyof typeof baseExp] * multiplier),
  };
};

export class GameService {
  async startGame(userId: string, gameType: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    // Проверяем лимит игр в день
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const gamesPlayedToday = await GameSession.countDocuments({
      userId,
      createdAt: { $gte: today },
    });

    if (gamesPlayedToday >= 5) {
      throw new Error('Daily game limit reached');
    }

    return {
      gameType,
      startTime: Date.now(),
      maxDuration: gameType === 'clicker' ? 60000 : 90000, // 1-1.5 minutes
    };
  }

  async endGame(
    userId: string,
    gameType: string,
    score: number,
    result: 'win' | 'loss' | 'draw',
    duration: number
  ) {
    const rewards = calculateRewards(gameType, score, result);

    const session = await GameSession.create({
      userId,
      gameType,
      score,
      result,
      duration,
      goldEarned: rewards.gold,
      experienceEarned: rewards.experience,
      rewards,
    });

    // Обновляем пользователя
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.gold += rewards.gold;
    user.experience += rewards.experience;
    user.statistics.totalGamesPlayed += 1;

    if (result === 'win') {
      user.statistics.totalGamesWon += 1;
    }

    await user.save();

    return { session, rewards };
  }

  async getDailyStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessions = await GameSession.find({
      userId,
      createdAt: { $gte: today },
    });

    return {
      gamesPlayed: sessions.length,
      gamesWon: sessions.filter((s) => s.result === 'win').length,
      totalGoldEarned: sessions.reduce((sum, s) => sum + s.goldEarned, 0),
      totalExpEarned: sessions.reduce((sum, s) => sum + s.experienceEarned, 0),
      gamesRemaining: 5 - sessions.length,
    };
  }
}

export default new GameService();
