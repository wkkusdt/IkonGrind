import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  level: number;
  totalExperience: number;
  seasonNumber: number;
  rank: number;
  score: number;
  updateAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    username: { type: String, required: true },
    level: { type: Number, required: true },
    totalExperience: { type: Number, required: true },
    seasonNumber: { type: Number, default: 1, index: true },
    rank: { type: Number },
    score: { type: Number, required: true },
    updateAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

LeaderboardSchema.index({ seasonNumber: 1, score: -1 });
LeaderboardSchema.index({ userId: 1, seasonNumber: 1 });

export default mongoose.model<ILeaderboardEntry>(
  'Leaderboard',
  LeaderboardSchema
);
