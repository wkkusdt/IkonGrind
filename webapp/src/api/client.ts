import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || 'http://localhost:3000/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  // User endpoints
  async initUser(telegramId: number) {
    const response = await this.client.post('/auth/init', { telegramId });
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get('/user/profile');
    return response.data;
  }

  async addGold(amount: number) {
    const response = await this.client.post('/user/gold', { amount });
    return response.data;
  }

  // Quest endpoints
  async getQuests() {
    const response = await this.client.get('/quests');
    return response.data;
  }

  async completeQuest(questId: string) {
    const response = await this.client.post(`/quests/${questId}/complete`);
    return response.data;
  }

  async getActiveQuests() {
    const response = await this.client.get('/quests/active');
    return response.data;
  }

  // Game endpoints
  async startGame(gameType: string) {
    const response = await this.client.post('/games/start', { gameType });
    return response.data;
  }

  async endGame(gameType: string, score: number, result: 'win' | 'loss' | 'draw', duration: number) {
    const response = await this.client.post('/games/end', {
      gameType,
      score,
      result,
      duration,
    });
    return response.data;
  }

  async getDailyStats() {
    const response = await this.client.get('/games/stats');
    return response.data;
  }

  // Leaderboard endpoints
  async getTopPlayers(limit?: number) {
    const response = await this.client.get('/leaderboard/top', {
      params: { limit },
    });
    return response.data;
  }

  async getUserRank() {
    const response = await this.client.get('/leaderboard/rank');
    return response.data;
  }

  async getSeasonInfo() {
    const response = await this.client.get('/leaderboard/season');
    return response.data;
  }
}

export default new ApiClient();
