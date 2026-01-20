import { Router, Request, Response } from 'express';
import { UserController, QuestController, GameController, LeaderboardController } from '../controllers/GameController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// User routes
const userController = new UserController();

router.post('/auth/init', userController.initUser);
router.get('/user/profile', authMiddleware, userController.getProfile);
router.post('/user/gold', authMiddleware, userController.addGold);
router.post('/user/experience', authMiddleware, userController.addExperience);

// Quest routes
const questController = new QuestController();

router.get('/quests', authMiddleware, questController.getQuests);
router.post('/quests/:questId/complete', authMiddleware, questController.completeQuest);
router.get('/quests/active', authMiddleware, questController.getActiveQuests);

// Game routes
const gameController = new GameController();

router.post('/games/start', authMiddleware, gameController.startGame);
router.post('/games/end', authMiddleware, gameController.endGame);
router.get('/games/stats', authMiddleware, gameController.getDailyStats);

// Leaderboard routes
const leaderboardController = new LeaderboardController();

router.get('/leaderboard/top', leaderboardController.getTopPlayers);
router.get('/leaderboard/rank', authMiddleware, leaderboardController.getUserRank);
router.get('/leaderboard/season', leaderboardController.getSeasonInfo);

export default router;
