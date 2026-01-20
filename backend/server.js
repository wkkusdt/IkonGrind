const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

// Import ES modules using dynamic import
async function startServer() {
  dotenv.config();

  const app = express();
  const PORT = process.env.PORT || 10000;

  // Initialize Telegram Bot
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  let bot = null;

  if (botToken) {
    try {
      bot = new TelegramBot(botToken, { polling: true });
      
      // Handle /start command
      bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const userName = msg.from.first_name || 'Игрок';
        
        await bot.sendMessage(chatId, `
🎮 Добро пожаловать в **IkonGrind**, ${userName}!

Это эпическая ролевая игра с:
• 🧠 Прокачкой персонажа
• 📋 Ежедневными заданиями
• 🎮 Мини-играми
• 🏆 Глобальным рейтингом

🚀 Скоро здесь будет полноценная игра!
        `, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🎮 Играть', web_app: { url: `${process.env.SERVER_URL || 'https://your-app-url.railway.app'}` } }],
              [{ text: '👤 Профиль', callback_data: 'profile' }],
              [{ text: '❓ Помощь', callback_data: 'help' }]
            ]
          }
        });
      });

      // Handle callback queries
      bot.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;

        if (data === 'profile') {
          await bot.sendMessage(chatId, '👤 Профиль в разработке...');
        } else if (data === 'help') {
          await bot.sendMessage(chatId, `
❓ **Помощь**

🎮 **Команды:**
/start - Начать игру
/profile - Профиль персонажа
/help - Эта справка

🚀 Скоро добавятся:
• Ежедневные задания
• Мини-игры  
• Таблица лидеров
          `, { parse_mode: 'Markdown' });
        }

        await bot.answerCallbackQuery(callbackQuery.id);
      });

      console.log('✓ Telegram Bot initialized');
    } catch (error) {
      console.error('✗ Failed to initialize Telegram Bot:', error.message);
    }
  } else {
    console.log('⚠️ TELEGRAM_BOT_TOKEN not found, bot disabled');
  }

  // Middleware
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve static files for Mini App
  app.use(express.static('public'));

  // Main Mini App route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  // Basic API routes
  app.get('/api', (req, res) => {
    res.json({ message: 'IkonGrind API is running!' });
  });

  // API для сохранения прогресса
  app.post('/api/save-progress', (req, res) => {
    try {
      const { userId, gameData } = req.body;
      // Здесь можно сохранить прогресс в базу данных
      console.log('Saving progress for user:', userId, gameData);
      res.json({ success: true, message: 'Progress saved' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API для загрузки прогресса
  app.get('/api/load-progress/:userId', (req, res) => {
    try {
      const { userId } = req.params;
      // Здесь можно загрузить прогресс из базы данных
      console.log('Loading progress for user:', userId);
      res.json({ success: true, data: null });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  // Start server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔════════════════════════════════════════╗
║        IkonGrind Backend Server        ║
╚════════════════════════════════════════╝

✓ Server running on port ${PORT}
✓ Environment: ${process.env.NODE_ENV || 'development'}
✓ Telegram Bot: ${bot ? 'Active' : 'Disabled'}

Press Ctrl+C to stop
    `);
  });
}

startServer().catch(console.error);
