import { Request, Response } from 'express';
import UserService from '../services/UserService.js';
import QuestService from '../services/QuestService.js';
import GameService from '../services/GameService.js';
import LeaderboardService from '../services/LeaderboardService.js';

export class UserController {
  async initUser(req: Request, res: Response) {
    try {
      const { telegramId } = req.body;
      // На практике использовать Telegram Web App init data для валидации

      const user = await UserService.getUserByTelegramId(telegramId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to init user' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await UserService.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  async addGold(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { amount } = req.body;

      const user = await UserService.updateUserGold(userId, amount);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add gold' });
    }
  }

  async addExperience(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { amount } = req.body;

      const user = await UserService.updateUserExperience(userId, amount);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add experience' });
    }
  }
}

export class QuestController {
  async getQuests(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const user = await UserService.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Генерируем задания, если их нет
      const quests = await QuestService.generateDailyQuests(userId, user.level);
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get quests' });
    }
  }

  async completeQuest(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { questId } = req.params;

      const result = await QuestService.completeQuest(questId, userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete quest' });
    }
  }

  async getActiveQuests(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const quests = await QuestService.getActiveQuests(userId);

      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get active quests' });
    }
  }
}

export class GameController {
  async startGame(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { gameType } = req.body;

      const game = await GameService.startGame(userId, gameType);
      res.json(game);
    } catch (error) {
      res.status(500).json({ error: 'Failed to start game' });
    }
  }

  async endGame(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { gameType, score, result, duration } = req.body;

      const gameResult = await GameService.endGame(
        userId,
        gameType,
        score,
        result,
        duration
      );
      res.json(gameResult);
    } catch (error) {
      res.status(500).json({ error: 'Failed to end game' });
    }
  }

  async getDailyStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const stats = await GameService.getDailyStats(userId);

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }
}

export class LeaderboardController {
  async getTopPlayers(req: Request, res: Response) {
    try {
      const { limit = 100 } = req.query;
      const players = await LeaderboardService.getTopPlayers(parseInt(limit as string));

      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  }

  async getUserRank(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const rank = await LeaderboardService.getUserRank(userId);

      res.json(rank);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user rank' });
    }
  }

  async getSeasonInfo(req: Request, res: Response) {
    try {
      const seasonInfo = await LeaderboardService.getSeasonInfo();
      res.json(seasonInfo);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get season info' });
    }
  }
}
