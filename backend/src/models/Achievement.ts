import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievement extends Document {
  userId: mongoose.Types.ObjectId;
  achievementId: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlockedAt: Date;
  reward: {
    gold?: number;
    gems?: number;
    experience?: number;
  };
}

const AchievementSchema = new Schema<IAchievement>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String },
    category: { type: String },
    unlockedAt: { type: Date, default: Date.now },
    reward: {
      gold: { type: Number, default: 0 },
      gems: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

AchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export default mongoose.model<IAchievement>('Achievement', AchievementSchema);
