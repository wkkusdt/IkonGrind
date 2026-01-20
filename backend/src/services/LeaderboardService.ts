import Leaderboard from '../models/Leaderboard.js';
import User from '../models/User.js';

export class LeaderboardService {
  async updateLeaderboard() {
    const currentSeason = this.getCurrentSeason();

    // Получаем всех пользователей
    const users = await User.find({}).sort({ level: -1, experience: -1 });

    // Очищаем старый leaderboard
    await Leaderboard.deleteMany({ seasonNumber: currentSeason });

    // Создаём новый leaderboard
    const entries = users.map((user, index) => ({
      userId: user._id,
      username: user.username || user.firstName,
      level: user.level,
      totalExperience: user.experience,
      seasonNumber: currentSeason,
      rank: index + 1,
      score: user.level * 1000 + user.experience, // Простая формула скора
    }));

    await Leaderboard.insertMany(entries);
  }

  async getTopPlayers(limit: number = 100) {
    const currentSeason = this.getCurrentSeason();

    return Leaderboard.find({ seasonNumber: currentSeason })
      .limit(limit)
      .sort({ rank: 1 })
      .populate('userId', 'username firstName profilePicture');
  }

  async getUserRank(userId: string) {
    const currentSeason = this.getCurrentSeason();

    const entry = await Leaderboard.findOne({
      userId,
      seasonNumber: currentSeason,
    });

    return entry;
  }

  async getFriendsLeaderboard(userIds: string[]) {
    const currentSeason = this.getCurrentSeason();

    return Leaderboard.find({
      userId: { $in: userIds },
      seasonNumber: currentSeason,
    })
      .sort({ rank: 1 })
      .populate('userId', 'username firstName profilePicture');
  }

  private getCurrentSeason(): number {
    const seasonStartDate = new Date(2024, 0, 1); // Сезон 1 начинается 1 января 2024
    const now = new Date();

    const monthsDiff = (now.getFullYear() - seasonStartDate.getFullYear()) * 12 + 
                       (now.getMonth() - seasonStartDate.getMonth());

    return Math.floor(monthsDiff / 3) + 1; // Сезон каждые 3 месяца
  }

  async getSeasonInfo() {
    const seasonNumber = this.getCurrentSeason();
    const seasonStartDate = new Date(2024, 0, 1);
    seasonStartDate.setMonth(seasonStartDate.getMonth() + (seasonNumber - 1) * 3);

    const nextSeasonDate = new Date(seasonStartDate);
    nextSeasonDate.setMonth(nextSeasonDate.getMonth() + 3);

    return {
      seasonNumber,
      startDate: seasonStartDate,
      endDate: nextSeasonDate,
      daysRemaining: Math.ceil((nextSeasonDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    };
  }
}

export default new LeaderboardService();
