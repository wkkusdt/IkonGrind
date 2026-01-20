import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  username: string;
  firstName: string;
  lastName?: string;
  profilePicture?: string;
  level: number;
  experience: number;
  gold: number;
  gems: number;
  selectedCharacterId: mongoose.Types.ObjectId;
  joinedAt: Date;
  lastActiveAt: Date;
  totalPlayTime: number;
  loginStreak: number;
  referredBy?: number;
  referralCode: string;
  statistics: {
    totalQuestsCompleted: number;
    totalGamesPlayed: number;
    totalGamesWon: number;
    totalGoldEarned: number;
  };
}

const UserSchema = new Schema<IUser>(
  {
    telegramId: { type: Number, required: true, unique: true, index: true },
    username: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    profilePicture: { type: String },
    level: { type: Number, default: 1, min: 1, max: 100 },
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 100, min: 0 },
    gems: { type: Number, default: 0, min: 0 },
    selectedCharacterId: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
    lastActiveAt: { type: Date, default: Date.now },
    totalPlayTime: { type: Number, default: 0 },
    loginStreak: { type: Number, default: 0 },
    referredBy: { type: Number },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    statistics: {
      totalQuestsCompleted: { type: Number, default: 0 },
      totalGamesPlayed: { type: Number, default: 0 },
      totalGamesWon: { type: Number, default: 0 },
      totalGoldEarned: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

UserSchema.index({ createdAt: -1 });
UserSchema.index({ level: -1, experience: -1 });

export default mongoose.model<IUser>('User', UserSchema);
