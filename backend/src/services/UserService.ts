import User from '../models/User.js';
import Character from '../models/Character.js';
import crypto from 'crypto';

export class UserService {
  async createOrUpdateUser(telegramUser: any) {
    const { id, username, first_name, last_name } = telegramUser;

    let user = await User.findOne({ telegramId: id });

    if (user) {
      user.lastActiveAt = new Date();
      await user.save();
      return user;
    }

    // Генерируем referral код
    const referralCode = crypto
      .randomBytes(8)
      .toString('hex')
      .toUpperCase()
      .slice(0, 8);

    user = await User.create({
      telegramId: id,
      username,
      firstName: first_name,
      lastName: last_name,
      referralCode,
    });

    // Создаём стартовый персонаж
    const character = await Character.create({
      userId: user._id,
      name: `${first_name}'s Warrior`,
      class: 'warrior',
    });

    user.selectedCharacterId = character._id;
    await user.save();

    return user;
  }

  async getUser(userId: string) {
    return User.findById(userId).populate('selectedCharacterId');
  }

  async getUserByTelegramId(telegramId: number) {
    return User.findOne({ telegramId }).populate('selectedCharacterId');
  }

  async updateUserGold(userId: string, amount: number) {
    return User.findByIdAndUpdate(
      userId,
      { $inc: { gold: amount, 'statistics.totalGoldEarned': Math.max(0, amount) } },
      { new: true }
    );
  }

  async updateUserExperience(userId: string, amount: number) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.experience += amount;

    // Проверяем level up (100 exp за уровень)
    const expForLevel = 100;
    while (user.experience >= expForLevel) {
      user.level += 1;
      user.experience -= expForLevel;
    }

    // Bonus gold при level up
    if (user.level > 1) {
      user.gold += 50;
    }

    await user.save();
    return user;
  }

  async addLoginStreak(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const lastActive = user.lastActiveAt;
    const now = new Date();

    // Проверяем, был ли вход вчера или сегодня
    const daysDifference = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference <= 1) {
      user.loginStreak += 1;
      // Бонус за стрик
      if (user.loginStreak % 7 === 0) {
        user.gold += 200;
      }
    } else {
      user.loginStreak = 1;
    }

    user.lastActiveAt = now;
    await user.save();
    return user;
  }
}

export default new UserService();
