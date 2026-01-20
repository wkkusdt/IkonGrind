import mongoose, { Schema, Document } from 'mongoose';

export interface IGameSession extends Document {
  userId: mongoose.Types.ObjectId;
  gameType: 'clicker' | 'reaction' | 'timing' | 'puzzle';
  difficulty: number;
  score: number;
  result: 'win' | 'loss' | 'draw';
  duration: number;
  goldEarned: number;
  experienceEarned: number;
  gamesPlayedToday: number;
  maxGamesPerDay: number;
  rewards: {
    gold: number;
    experience: number;
    bonus?: number;
  };
  playedAt: Date;
}

const GameSessionSchema = new Schema<IGameSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    gameType: {
      type: String,
      enum: ['clicker', 'reaction', 'timing', 'puzzle'],
      required: true,
    },
    difficulty: { type: Number, default: 1, min: 1, max: 10 },
    score: { type: Number, default: 0 },
    result: {
      type: String,
      enum: ['win', 'loss', 'draw'],
      required: true,
    },
    duration: { type: Number, required: true },
    goldEarned: { type: Number, default: 0 },
    experienceEarned: { type: Number, default: 0 },
    gamesPlayedToday: { type: Number, default: 0 },
    maxGamesPerDay: { type: Number, default: 5 },
    rewards: {
      gold: { type: Number, required: true },
      experience: { type: Number, required: true },
      bonus: { type: Number, default: 0 },
    },
    playedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

GameSessionSchema.index({ userId: 1, playedAt: -1 });
GameSessionSchema.index({ playedAt: -1 });

export default mongoose.model<IGameSession>('GameSession', GameSessionSchema);
