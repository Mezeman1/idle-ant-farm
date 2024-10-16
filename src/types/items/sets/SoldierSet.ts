export const soldierSet = [
  {
    id: 'soldier-helm',
    name: 'Soldier Helm',
    type: 'equipment',
    description: 'Head armor for soldiers, increases defense by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-body',
    name: 'Soldier Chestplate',
    type: 'equipment',
    description: 'Body armor for soldiers, increases defense by 0.62% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0062, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-legs',
    name: 'Soldier Legs',
    type: 'equipment',
    description: 'Leg armor for soldiers, increases attack by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-shield',
    name: 'Soldier Shield',
    type: 'equipment',
    description: 'Accessory for soldiers, increases defense by 0.77% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-sword',
    name: 'Soldier Sword',
    type: 'equipment',
    description: 'Weapon for soldiers, increases attack by 0.77% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
  },
]
export const soldierSetII = [
  {
    id: 'soldier-helm-ii',
    name: 'Soldier Helm II',
    type: 'equipment',
    description: 'Head armor for soldiers, increases defense by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-body-ii',
    name: 'Soldier Chestplate II',
    type: 'equipment',
    description: 'Body armor for soldiers, increases defense by 0.62% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0062, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-legs-ii',
    name: 'Soldier Legs II',
    type: 'equipment',
    description: 'Leg armor for soldiers, increases attack by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-shield-ii',
    name: 'Soldier Shield II',
    type: 'equipment',
    description: 'Accessory for soldiers, increases defense by 0.77% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
  },
  {
    id: 'soldier-sword-ii',
    name: 'Soldier Sword II',
    type: 'equipment',
    description: 'Weapon for soldiers, increases attack by 0.77% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
  },
]
