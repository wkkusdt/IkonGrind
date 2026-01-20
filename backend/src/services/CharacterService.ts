import Character from '../models/Character.js';
import User from '../models/User.js';

const CLASS_STATS = {
  warrior: { health: 150, strength: 15, endurance: 13, intelligence: 8, agility: 10, mana: 30 },
  mage: { health: 80, strength: 8, endurance: 10, intelligence: 18, agility: 12, mana: 100 },
  rogue: { health: 100, strength: 12, endurance: 11, intelligence: 10, agility: 16, mana: 50 },
  paladin: { health: 130, strength: 13, endurance: 14, intelligence: 12, agility: 10, mana: 60 },
};

const SKILLS = {
  warrior: [
    { skillId: 'slash', name: 'Slash', level: 1, unlocked: true },
    { skillId: 'power_strike', name: 'Power Strike', level: 1, unlocked: false, requiredLevel: 5 },
    { skillId: 'whirlwind', name: 'Whirlwind', level: 1, unlocked: false, requiredLevel: 15 },
  ],
  mage: [
    { skillId: 'fireball', name: 'Fireball', level: 1, unlocked: true },
    { skillId: 'ice_bolt', name: 'Ice Bolt', level: 1, unlocked: false, requiredLevel: 5 },
    { skillId: 'teleport', name: 'Teleport', level: 1, unlocked: false, requiredLevel: 15 },
  ],
  rogue: [
    { skillId: 'backstab', name: 'Backstab', level: 1, unlocked: true },
    { skillId: 'shadow_clone', name: 'Shadow Clone', level: 1, unlocked: false, requiredLevel: 5 },
    { skillId: 'invisibility', name: 'Invisibility', level: 1, unlocked: false, requiredLevel: 15 },
  ],
  paladin: [
    { skillId: 'holy_strike', name: 'Holy Strike', level: 1, unlocked: true },
    { skillId: 'shield_bash', name: 'Shield Bash', level: 1, unlocked: false, requiredLevel: 5 },
    { skillId: 'divine_protection', name: 'Divine Protection', level: 1, unlocked: false, requiredLevel: 15 },
  ],
};

export class CharacterService {
  async createCharacter(userId: string, characterClass: keyof typeof CLASS_STATS, name: string) {
    const stats = CLASS_STATS[characterClass];
    const skills = SKILLS[characterClass] || [];

    const character = await Character.create({
      userId,
      name,
      class: characterClass,
      level: 1,
      experience: 0,
      stats: {
        health: stats.health,
        mana: stats.mana,
        strength: stats.strength,
        intelligence: stats.intelligence,
        agility: stats.agility,
        endurance: stats.endurance,
      },
      skills,
    });

    return character;
  }

  async levelUpCharacter(characterId: string) {
    const character = await Character.findById(characterId);
    if (!character) throw new Error('Character not found');

    character.level += 1;
    character.experience = 0;

    // Увеличиваем статы при уровне
    const statIncrease = {
      health: 10,
      strength: 1,
      intelligence: 1,
      agility: 1,
      endurance: 1,
      mana: 5,
    };

    character.stats.health += statIncrease.health;
    character.stats.strength += statIncrease.strength;
    character.stats.intelligence += statIncrease.intelligence;
    character.stats.agility += statIncrease.agility;
    character.stats.endurance += statIncrease.endurance;
    character.stats.mana += statIncrease.mana;

    // Разблокируем новые скиллы
    character.skills = character.skills.map((skill: any) => {
      if (!skill.unlocked && skill.requiredLevel && skill.requiredLevel <= character.level) {
        skill.unlocked = true;
      }
      return skill;
    });

    await character.save();
    return character;
  }

  async upgradeCharacterStat(characterId: string, stat: string, amount: number = 1) {
    const character = await Character.findById(characterId);
    if (!character) throw new Error('Character not found');

    if (stat in character.stats) {
      character.stats[stat as keyof typeof character.stats] += amount;
    }

    await character.save();
    return character;
  }

  async equipItem(
    characterId: string,
    slot: 'weapon' | 'armor' | 'accessory',
    itemId: string,
    itemName: string,
    rarity: string
  ) {
    const character = await Character.findById(characterId);
    if (!character) throw new Error('Character not found');

    character.equipment[slot] = {
      id: itemId,
      name: itemName,
      rarity,
    };

    await character.save();
    return character;
  }

  async customizeAppearance(
    characterId: string,
    appearance: {
      skinColor?: string;
      hairColor?: string;
      eyeColor?: string;
      customization?: Record<string, string>;
    }
  ) {
    const character = await Character.findById(characterId);
    if (!character) throw new Error('Character not found');

    if (appearance.skinColor) character.appearance.skinColor = appearance.skinColor;
    if (appearance.hairColor) character.appearance.hairColor = appearance.hairColor;
    if (appearance.eyeColor) character.appearance.eyeColor = appearance.eyeColor;
    if (appearance.customization) {
      character.appearance.customization = {
        ...character.appearance.customization,
        ...appearance.customization,
      };
    }

    await character.save();
    return character;
  }

  async getCharacter(characterId: string) {
    return Character.findById(characterId);
  }
}

export default new CharacterService();
