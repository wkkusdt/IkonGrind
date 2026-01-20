import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  userId: mongoose.Types.ObjectId;
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
  skills: Array<{
    skillId: string;
    name: string;
    level: number;
    unlocked: boolean;
  }>;
  equipment: {
    weapon?: {
      id: string;
      name: string;
      rarity: string;
    };
    armor?: {
      id: string;
      name: string;
      rarity: string;
    };
    accessory?: {
      id: string;
      name: string;
      rarity: string;
    };
  };
  appearance: {
    skinColor: string;
    hairColor: string;
    eyeColor: string;
    customization?: Record<string, string>;
  };
  createdAt: Date;
  lastUsedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    class: {
      type: String,
      enum: ['warrior', 'mage', 'rogue', 'paladin'],
      default: 'warrior',
    },
    level: { type: Number, default: 1, min: 1, max: 100 },
    experience: { type: Number, default: 0 },
    stats: {
      health: { type: Number, default: 100 },
      mana: { type: Number, default: 50 },
      strength: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      agility: { type: Number, default: 10 },
      endurance: { type: Number, default: 10 },
    },
    skills: [
      {
        skillId: String,
        name: String,
        level: { type: Number, default: 1 },
        unlocked: { type: Boolean, default: false },
      },
    ],
    equipment: {
      weapon: {
        id: String,
        name: String,
        rarity: String,
      },
      armor: {
        id: String,
        name: String,
        rarity: String,
      },
      accessory: {
        id: String,
        name: String,
        rarity: String,
      },
    },
    appearance: {
      skinColor: { type: String, default: '#FDBCB4' },
      hairColor: { type: String, default: '#8B4513' },
      eyeColor: { type: String, default: '#8B4513' },
      customization: { type: Map, of: String },
    },
    createdAt: { type: Date, default: Date.now },
    lastUsedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ICharacter>('Character', CharacterSchema);
