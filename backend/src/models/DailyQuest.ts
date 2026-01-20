import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyQuest extends Document {
  userId: mongoose.Types.ObjectId;
  questId: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'legendary';
  requiredLevel: number;
  objectives: Array<{
    type: string;
    target: number;
    current: number;
  }>;
  rewards: {
    gold: number;
    experience: number;
    gems?: number;
  };
  expiresAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
  progress: number;
  createdAt: Date;
}

const DailyQuestSchema = new Schema<IDailyQuest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard', 'legendary'],
      default: 'normal',
    },
    requiredLevel: { type: Number, default: 1 },
    objectives: [
      {
        type: String,
        target: Number,
        current: { type: Number, default: 0 },
      },
    ],
    rewards: {
      gold: { type: Number, required: true },
      experience: { type: Number, required: true },
      gems: { type: Number, default: 0 },
    },
    expiresAt: { type: Date, required: true },
    completedAt: { type: Date },
    isCompleted: { type: Boolean, default: false },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

DailyQuestSchema.index({ userId: 1, isCompleted: 1 });
DailyQuestSchema.index({ expiresAt: 1 });

export default mongoose.model<IDailyQuest>('DailyQuest', DailyQuestSchema);
