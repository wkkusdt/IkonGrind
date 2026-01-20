import TelegramBot from 'node-telegram-bot-api';
import UserService from '../services/UserService.js';
import QuestService from '../services/QuestService.js';
import LeaderboardService from '../services/LeaderboardService.js';

export class TelegramBotService {
  private bot: TelegramBot;
  private miniAppUrl: string;

  constructor(token: string, miniAppUrl: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.miniAppUrl = miniAppUrl;
    this.setupHandlers();
  }

  private setupHandlers() {
    // Обработчик /start
    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text;

      if (text === '/start' || text?.startsWith('/start')) {
        await this.handleStart(chatId, msg);
      } else if (text === '/profile') {
        await this.handleProfile(chatId, msg);
      } else if (text === '/quests') {
        await this.handleQuests(chatId, msg);
      } else if (text === '/leaderboard') {
        await this.handleLeaderboard(chatId, msg);
      } else if (text === '/help') {
        await this.handleHelp(chatId);
      }
    });

    // Обработчик web_app_data
    this.bot.on('web_app_data', async (msg) => {
      console.log('Web App Data:', msg.web_app_data?.data);
      // Обработка данных из Mini App
    });
  }

  private async handleStart(chatId: number, msg: any) {
    try {
      // Создаём или обновляем пользователя
      const user = await UserService.createOrUpdateUser(msg.from);
      await UserService.addLoginStreak(user._id.toString());

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🎮 Открыть игру',
              web_app: { url: this.miniAppUrl },
            },
          ],
          [
            { text: '📋 Задания', callback_data: 'quests' },
            { text: '🏆 Рейтинг', callback_data: 'leaderboard' },
          ],
          [
            { text: '👤 Профиль', callback_data: 'profile' },
            { text: '❓ Помощь', callback_data: 'help' },
          ],
        ],
      };

      await this.bot.sendMessage(
        chatId,
        `
🎮 Добро пожаловать в **IkonGrind**!

Ты только что присоединился к эпической ролевой игре с:
• 🧠 Прокачкой персонажа
• 📋 Ежедневными заданиями
• 🎮 Мини-играми
• 🏆 Глобальным рейтингом

**Твой прогресс:**
⭐ Уровень: ${user.level}
💰 Золото: ${user.gold}
📈 Опыт: ${user.experience}
🔥 Стрик входов: ${user.loginStreak}

Открой игру и начни свою легенду!
      `,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      );
    } catch (error) {
      console.error('Error in handleStart:', error);
      await this.bot.sendMessage(chatId, '❌ Ошибка при инициализации игры');
    }
  }

  private async handleProfile(chatId: number, msg: any) {
    try {
      const user = await UserService.getUserByTelegramId(msg.from.id);
      if (!user) throw new Error('User not found');

      const stats = `
👤 **Профиль игрока**

**${user.firstName}**
📊 Уровень: ${user.level}
📈 Опыт: ${user.experience}
💰 Золото: ${user.gold}
💎 Кристаллы: ${user.gems}

📊 **Статистика**
🎮 Игр сыграно: ${user.statistics.totalGamesPlayed}
🏆 Побед: ${user.statistics.totalGamesWon}
📋 Заданий выполнено: ${user.statistics.totalQuestsCompleted}
💵 Золота заработано: ${user.statistics.totalGoldEarned}

🔥 Стрик входов: ${user.loginStreak} дней
      `;

      await this.bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in handleProfile:', error);
      await this.bot.sendMessage(chatId, '❌ Ошибка при загрузке профиля');
    }
  }

  private async handleQuests(chatId: number, msg: any) {
    try {
      const user = await UserService.getUserByTelegramId(msg.from.id);
      if (!user) throw new Error('User not found');

      // Генерируем задания, если их нет
      const quests = await QuestService.generateDailyQuests(user._id.toString(), user.level);

      let questText = '📋 **Ежедневные задания**\n\n';

      quests.forEach((quest, index) => {
        questText += `
${index + 1}. **${quest.title}**
   ${quest.description}
   Сложность: ${quest.difficulty}
   Награда: ${quest.rewards.gold} 💰 + ${quest.rewards.experience} 📈
        `;
      });

      questText += '\n\n_Открой игру, чтобы выполнять задания_';

      await this.bot.sendMessage(chatId, questText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in handleQuests:', error);
      await this.bot.sendMessage(chatId, '❌ Ошибка при загрузке заданий');
    }
  }

  private async handleLeaderboard(chatId: number, msg: any) {
    try {
      const topPlayers = await LeaderboardService.getTopPlayers(10);
      const seasonInfo = await LeaderboardService.getSeasonInfo();

      let leaderboardText = `
🏆 **Таблица лидеров - Сезон ${seasonInfo.seasonNumber}**

Осталось: ${seasonInfo.daysRemaining} дней

      `;

      topPlayers.forEach((entry, index) => {
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || `#${index + 1}`;
        leaderboardText += `
${medal} **${entry.username}** (Уровень ${entry.level})
   Счёт: ${entry.score}
        `;
      });

      await this.bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error in handleLeaderboard:', error);
      await this.bot.sendMessage(chatId, '❌ Ошибка при загрузке рейтинга');
    }
  }

  private async handleHelp(chatId: number) {
    const helpText = `
❓ **Помощь**

**/start** - Начать игру
**/profile** - Посмотреть профиль
**/quests** - Ежедневные задания
**/leaderboard** - Таблица лидеров
**/help** - Эта справка

🎮 **Как играть:**
1. Нажми "🎮 Открыть игру" для запуска Mini App
2. Выполняй ежедневные задания
3. Играй в мини-игры и зарабатывай награды
4. Прокачивай персонажа
5. Поднимайся в рейтинге!

💡 **Советы:**
• Заходи каждый день для бонуса входа
• Выполняй все задания до истечения времени
• Выигрывай игры для большего количества награды
• Поднимайся в уровнях, чтобы разблокировать новое содержание
    `;

    await this.bot.sendMessage(chatId, helpText, { parse_mode: 'Markdown' });
  }

  // Отправить уведомление
  async sendNotification(userId: number, message: string, keyboard?: any) {
    try {
      await this.bot.sendMessage(userId, message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  getBot() {
    return this.bot;
  }
}

export default TelegramBotService;
