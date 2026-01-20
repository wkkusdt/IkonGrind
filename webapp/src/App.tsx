import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { TelegramWebApp } from './utils/telegram';
import apiClient from './api/client';

// Pages
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import QuestsPage from './pages/QuestsPage';
import GamesPage from './pages/GamesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GamePlayPage from './pages/GamePlayPage';

import './styles/globals.css';

const App: React.FC = () => {
  const { setUser, setLoading, setError } = useGameStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);

      // Initialize Telegram Web App
      const webApp = TelegramWebApp.getInstance();

      if (!webApp.initDataUnsafe.user?.id) {
        setError('Telegram user not available');
        return;
      }

      // Initialize user
      const user = await apiClient.initUser(webApp.initDataUnsafe.user.id);
      setUser(user);

      // Set theme
      if (webApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }

      // Expand to fullscreen
      webApp.expand();

      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError('Failed to initialize app');
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="w-full h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/:gameType" element={<GamePlayPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
