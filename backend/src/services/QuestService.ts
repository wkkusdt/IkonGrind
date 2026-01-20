import DailyQuest from '../models/DailyQuest.js';
import User from '../models/User.js';

// Генератор заданий
const QUEST_TEMPLATES = [
  {
    id: 'play_games',
    title: 'Геймер',
    description: 'Сыграй в 3 мини-игры',
    objectives: [{ type: 'games_played', target: 3, current: 0 }],
    rewards: { gold: 100, experience: 50 },
  },
  {
    id: 'level_up',
    title: 'Стремительный рост',
    description: 'Набери 50 опыта',
    objectives: [{ type: 'experience_gained', target: 50, current: 0 }],
    rewards: { gold: 75, experience: 100 },
  },
  {
    id: 'collect_gold',
    title: 'Охотник за золотом',
    description: 'Заработай 200 золота',
    objectives: [{ type: 'gold_earned', target: 200, current: 0 }],
    rewards: { gold: 150, experience: 75 },
  },
  {
    id: 'win_games',
    title: 'Чемпион',
    description: 'Выиграй 2 игры подряд',
    objectives: [{ type: 'consecutive_wins', target: 2, current: 0 }],
    rewards: { gold: 200, experience: 100, gems: 5 },
  },
  {
    id: 'daily_login',
    title: 'Верный боец',
    description: 'Заходи каждый день на неделю',
    objectives: [{ type: 'login_days', target: 7, current: 0 }],
    rewards: { gold: 300, experience: 150, gems: 10 },
  },
];

export class QuestService {
  async generateDailyQuests(userId: string, userLevel: number) {
    // Удаляем старые невыполненные задания
    await DailyQuest.deleteMany({
      userId,
      isCompleted: false,
      expiresAt: { $lt: new Date() },
    });

    // Проверяем, есть ли уже задания на сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingQuests = await DailyQuest.find({
      userId,
      createdAt: { $gte: today },
    });

    if (existingQuests.length >= 5) return existingQuests;

    // Генерируем новые задания
    const newQuests = [];
    const selectedTemplates = QUEST_TEMPLATES.slice(0, 5);

    for (const template of selectedTemplates) {
      const expiresAt = new Date();
      expiresAt.setHours(23, 59, 59, 999);

      const quest = await DailyQuest.create({
        userId,
        questId: template.id,
        title: template.title,
        description: template.description,
        difficulty:
          userLevel < 20
            ? 'easy'
            : userLevel < 50
              ? 'normal'
              : userLevel < 80
                ? 'hard'
                : 'legendary',
        requiredLevel: 1,
        objectives: template.objectives,
        rewards: {
          ...template.rewards,
          gold: Math.ceil(template.rewards.gold * (1 + userLevel / 100)),
          experience: Math.ceil(template.rewards.experience * (1 + userLevel / 50)),
        },
        expiresAt,
      });

      newQuests.push(quest);
    }

    return newQuests;
  }

  async completeQuest(questId: string, userId: string) {
    const quest = await DailyQuest.findById(questId);
    if (!quest || quest.isCompleted) throw new Error('Quest not valid');

    quest.isCompleted = true;
    quest.completedAt = new Date();
    quest.progress = 100;
    await quest.save();

    // Выдаём награды
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    user.gold += quest.rewards.gold;
    user.experience += quest.rewards.experience;
    user.statistics.totalQuestsCompleted += 1;

    if (quest.rewards.gems) {
      user.gems += quest.rewards.gems;
    }

    await user.save();

    return { quest, rewards: quest.rewards };
  }

  async updateQuestProgress(questId: string, progress: number) {
    return DailyQuest.findByIdAndUpdate(
      questId,
      { progress: Math.min(100, progress) },
      { new: true }
    );
  }

  async getActiveQuests(userId: string) {
    return DailyQuest.find({
      userId,
      isCompleted: false,
      expiresAt: { $gt: new Date() },
    }).sort({ expiresAt: 1 });
  }
}

export default new QuestService();
