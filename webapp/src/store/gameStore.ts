import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface IUser {
  _id: string;
  telegramId: number;
  username: string;
  firstName: string;
  level: number;
  experience: number;
  gold: number;
  gems: number;
  selectedCharacterId: string;
  loginStreak: number;
  statistics: {
    totalQuestsCompleted: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    totalGoldEarned: number;
  };
}

export interface ICharacter {
  _id: string;
  name: string;
  class: 'warrior' | 'mage' | 'rogue' | 'paladin';
  level: number;
  experience: number;
  stats: {
    health: number;
    mana: number;
    strength: number;
    intelligence: number;
    agility: number;
    endurance: number;
  };
}

interface GameStore {
  user: IUser | null;
  character: ICharacter | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: IUser) => void;
  setCharacter: (character: ICharacter) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateGold: (amount: number) => void;
  updateExperience: (amount: number) => void;
}

export const useGameStore = create<GameStore>()(
  devtools(
    (set) => ({
      user: null,
      character: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setCharacter: (character) => set({ character }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      updateGold: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, gold: state.user.gold + amount }
            : null,
        })),

      updateExperience: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, experience: state.user.experience + amount }
            : null,
        })),
    }),
    { name: 'game-store' }
  )
);
