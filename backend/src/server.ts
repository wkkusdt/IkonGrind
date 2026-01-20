import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import apiRoutes from './routes/api.js';
import TelegramBotService from './bot/TelegramBotService.js';
import LeaderboardService from './services/LeaderboardService.js';
import cron from 'node-cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
await connectDB();

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const miniAppUrl = process.env.TELEGRAM_MINI_APP_URL || 'https://yourdomain.com/app';
const botService = new TelegramBotService(botToken, miniAppUrl);

console.log('✓ Telegram Bot initialized');

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files for Mini App
app.use(express.static('public'));

// CRON Jobs
// Обновляем leaderboard каждый час
cron.schedule('0 * * * *', async () => {
  try {
    await LeaderboardService.updateLeaderboard();
    console.log('✓ Leaderboard updated');
  } catch (error) {
    console.error('✗ Leaderboard update failed:', error);
  }
});

// Ежедневное уведомление в 08:00 UTC
cron.schedule('0 8 * * *', async () => {
  console.log('🔔 Daily notification job triggered');
  // Здесь можно отправлять уведомления пользователям
});

// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
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

✓ Server running on http://localhost:${PORT}
✓ Database connected
✓ Telegram Bot active
✓ Mini App URL: ${miniAppUrl}

Press Ctrl+C to stop
  `);
});

export default app;
