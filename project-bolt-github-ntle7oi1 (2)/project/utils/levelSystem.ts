// Level System and Rewards for Fitness RPG

export interface LevelReward {
  level: number;
  title: string;
  description: string;
  rewards: {
    badges?: string[];
    features?: string[];
    customization?: string[];
    bonuses?: string[];
  };
  xpRequired: number;
}

export interface CharacterClass {
  id: string;
  name: string;
  description: string;
  icon: string;
  primaryAttribute: 'strength' | 'endurance' | 'agility' | 'discipline';
  bonuses: {
    xpMultiplier: number;
    specialAbilities: string[];
  };
}

export interface Rank {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  icon: string;
  description: string;
  benefits: string[];
}

// Character Classes
export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'fitness_paladin',
    name: 'Fitness Paladin',
    description: 'Balanced warrior focused on overall health and consistency',
    icon: '🛡️',
    primaryAttribute: 'discipline',
    bonuses: {
      xpMultiplier: 1.1,
      specialAbilities: [
        'Consistency Bonus: +20% XP for 7+ day streaks',
        'Recovery Boost: Faster rest timer regeneration',
        'Motivation Aura: Bonus XP for completing all daily goals'
      ]
    }
  },
  {
    id: 'strength_warrior',
    name: 'Strength Warrior',
    description: 'Mighty fighter specializing in power and muscle building',
    icon: '⚔️',
    primaryAttribute: 'strength',
    bonuses: {
      xpMultiplier: 1.2,
      specialAbilities: [
        'Power Surge: +30% XP for strength training workouts',
        'Iron Will: Bonus XP for lifting heavier weights',
        'Muscle Memory: Reduced XP penalty for missed workouts'
      ]
    }
  },
  {
    id: 'endurance_runner',
    name: 'Endurance Runner',
    description: 'Swift athlete mastering cardio and stamina',
    icon: '🏃',
    primaryAttribute: 'endurance',
    bonuses: {
      xpMultiplier: 1.15,
      specialAbilities: [
        'Cardio Master: +25% XP for cardio workouts',
        'Stamina Boost: Extended workout duration bonuses',
        'Runner\'s High: Bonus XP for outdoor activities'
      ]
    }
  },
  {
    id: 'agility_ninja',
    name: 'Agility Ninja',
    description: 'Flexible warrior focusing on mobility and coordination',
    icon: '🥷',
    primaryAttribute: 'agility',
    bonuses: {
      xpMultiplier: 1.1,
      specialAbilities: [
        'Flexibility Focus: +25% XP for yoga and stretching',
        'Quick Recovery: Faster rest between exercises',
        'Balance Master: Bonus XP for balance and coordination exercises'
      ]
    }
  }
];

// Rank System
export const RANKS: Rank[] = [
  {
    id: 'novice',
    name: 'Novice',
    minLevel: 1,
    maxLevel: 5,
    icon: '🌱',
    description: 'Just starting your fitness journey',
    benefits: [
      'Basic workout tracking',
      'Simple meal logging',
      'Beginner achievement badges'
    ]
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    minLevel: 6,
    maxLevel: 10,
    icon: '⭐',
    description: 'Building healthy habits and consistency',
    benefits: [
      'Advanced workout metrics',
      'Nutrition goal tracking',
      'Weekly progress reports',
      'Custom workout plans'
    ]
  },
  {
    id: 'warrior',
    name: 'Warrior',
    minLevel: 11,
    maxLevel: 20,
    icon: '⚔️',
    description: 'Dedicated fitness enthusiast with proven commitment',
    benefits: [
      'Advanced analytics dashboard',
      'Social features and challenges',
      'Premium workout library',
      'Nutrition coaching tips'
    ]
  },
  {
    id: 'champion',
    name: 'Champion',
    minLevel: 21,
    maxLevel: 35,
    icon: '🏆',
    description: 'Elite athlete with exceptional dedication',
    benefits: [
      'AI-powered workout recommendations',
      'Advanced meal planning',
      'Priority customer support',
      'Exclusive champion badges'
    ]
  },
  {
    id: 'legend',
    name: 'Legend',
    minLevel: 36,
    maxLevel: 50,
    icon: '👑',
    description: 'Legendary fitness master inspiring others',
    benefits: [
      'Mentor status and coaching tools',
      'Exclusive legendary content',
      'Beta access to new features',
      'Hall of Fame recognition'
    ]
  },
  {
    id: 'mythic',
    name: 'Mythic',
    minLevel: 51,
    maxLevel: 100,
    icon: '🌟',
    description: 'Transcendent being of ultimate fitness mastery',
    benefits: [
      'Mythic avatar customizations',
      'Unlimited premium features',
      'Direct developer feedback channel',
      'Immortal hall of legends'
    ]
  }
];

// Level Rewards System
export const LEVEL_REWARDS: LevelReward[] = [
  {
    level: 1,
    title: 'Welcome, Warrior!',
    description: 'Begin your epic fitness journey',
    rewards: {
      badges: ['First Steps'],
      features: ['Basic workout tracking', 'Meal logging'],
      customization: ['Default avatar'],
    },
    xpRequired: 0
  },
  {
    level: 2,
    title: 'Gaining Momentum',
    description: 'Your dedication is showing',
    rewards: {
      badges: ['Consistency Seeker'],
      features: ['Water tracking'],
      customization: ['Avatar color variants'],
    },
    xpRequired: 100
  },
  {
    level: 3,
    title: 'Building Habits',
    description: 'Healthy routines are forming',
    rewards: {
      badges: ['Habit Builder'],
      features: ['Sleep tracking'],
      customization: ['Basic equipment accessories'],
    },
    xpRequired: 400
  },
  {
    level: 5,
    title: 'Novice Graduate',
    description: 'Ready for bigger challenges',
    rewards: {
      badges: ['Novice Master'],
      features: ['Weekly progress reports', 'Goal setting'],
      customization: ['Class selection unlock'],
      bonuses: ['10% XP bonus for next level']
    },
    xpRequired: 1600
  },
  {
    level: 10,
    title: 'Apprentice Warrior',
    description: 'Proven dedication and growth',
    rewards: {
      badges: ['Apprentice Champion', 'Dedication Medal'],
      features: ['Advanced analytics', 'Custom workouts'],
      customization: ['Weapon accessories', 'Armor variants'],
      bonuses: ['Streak protection (1 day forgiveness)']
    },
    xpRequired: 8100
  },
  {
    level: 15,
    title: 'Rising Champion',
    description: 'Your strength inspires others',
    rewards: {
      badges: ['Rising Star', 'Inspiration Badge'],
      features: ['Social challenges', 'Friend system'],
      customization: ['Elite armor sets', 'Glowing effects'],
      bonuses: ['15% XP bonus', 'Double streak rewards']
    },
    xpRequired: 19600
  },
  {
    level: 20,
    title: 'True Warrior',
    description: 'Battle-tested and victorious',
    rewards: {
      badges: ['Warrior Elite', 'Battle Veteran'],
      features: ['AI coaching', 'Premium content'],
      customization: ['Legendary weapons', 'Aura effects'],
      bonuses: ['Weekly bonus XP events']
    },
    xpRequired: 36100
  },
  {
    level: 25,
    title: 'Champion Rising',
    description: 'Excellence in every endeavor',
    rewards: {
      badges: ['Champion Candidate', 'Excellence Medal'],
      features: ['Advanced meal planning', 'Biometric integration'],
      customization: ['Champion armor', 'Victory animations'],
      bonuses: ['20% XP bonus', 'Milestone celebrations']
    },
    xpRequired: 57600
  },
  {
    level: 30,
    title: 'Elite Champion',
    description: 'Among the fitness elite',
    rewards: {
      badges: ['Elite Status', 'Mastery Crown'],
      features: ['Personal coaching', 'Exclusive content'],
      customization: ['Elite champion gear', 'Prestige effects'],
      bonuses: ['Monthly XP bonuses', 'Priority support']
    },
    xpRequired: 84100
  },
  {
    level: 40,
    title: 'Legendary Hero',
    description: 'Your legend grows with each victory',
    rewards: {
      badges: ['Legendary Status', 'Hero Medal'],
      features: ['Mentor tools', 'Beta features'],
      customization: ['Legendary artifacts', 'Divine auras'],
      bonuses: ['25% XP bonus', 'Legendary events access']
    },
    xpRequired: 156100
  },
  {
    level: 50,
    title: 'Fitness Legend',
    description: 'A true master of the fitness realm',
    rewards: {
      badges: ['Fitness Legend', 'Master of All'],
      features: ['All premium features', 'Developer access'],
      customization: ['Mythic transformations', 'Cosmic effects'],
      bonuses: ['30% XP bonus', 'Immortal recognition']
    },
    xpRequired: 240100
  }
];

// Utility functions
export function getLevelReward(level: number): LevelReward | undefined {
  return LEVEL_REWARDS.find(reward => reward.level === level);
}

export function getCurrentRank(level: number): Rank {
  return RANKS.find(rank => level >= rank.minLevel && level <= rank.maxLevel) || RANKS[0];
}

export function getNextRank(level: number): Rank | null {
  const currentRank = getCurrentRank(level);
  const currentRankIndex = RANKS.findIndex(rank => rank.id === currentRank.id);
  return currentRankIndex < RANKS.length - 1 ? RANKS[currentRankIndex + 1] : null;
}

export function getCharacterClass(classId: string): CharacterClass | undefined {
  return CHARACTER_CLASSES.find(cls => cls.id === classId);
}

export function calculateAttributeGrowth(
  baseAttribute: number,
  level: number,
  characterClass: CharacterClass,
  activityHistory: { [key: string]: number }
): number {
  let growth = baseAttribute;
  
  // Level-based growth
  growth += Math.floor(level / 2);
  
  // Class bonus for primary attribute
  if (characterClass.primaryAttribute) {
    growth += Math.floor(level / 3);
  }
  
  // Activity-based growth
  const relevantActivity = activityHistory[characterClass.primaryAttribute] || 0;
  growth += Math.floor(relevantActivity / 10);
  
  return Math.min(growth, 100); // Cap at 100
}

export function getUnlockedFeatures(level: number): string[] {
  const features: string[] = [];
  
  LEVEL_REWARDS.forEach(reward => {
    if (level >= reward.level && reward.rewards.features) {
      features.push(...reward.rewards.features);
    }
  });
  
  return [...new Set(features)]; // Remove duplicates
}

export function getUnlockedCustomizations(level: number): string[] {
  const customizations: string[] = [];
  
  LEVEL_REWARDS.forEach(reward => {
    if (level >= reward.level && reward.rewards.customization) {
      customizations.push(...reward.rewards.customization);
    }
  });
  
  return [...new Set(customizations)];
}

export function calculateLevelUpRewards(newLevel: number): {
  xpBonus: number;
  newFeatures: string[];
  newCustomizations: string[];
  badges: string[];
} {
  const reward = getLevelReward(newLevel);
  
  if (!reward) {
    return {
      xpBonus: 0,
      newFeatures: [],
      newCustomizations: [],
      badges: []
    };
  }
  
  return {
    xpBonus: reward.rewards.bonuses?.includes('XP bonus') ? Math.floor(newLevel * 10) : 0,
    newFeatures: reward.rewards.features || [],
    newCustomizations: reward.rewards.customization || [],
    badges: reward.rewards.badges || []
  };
}