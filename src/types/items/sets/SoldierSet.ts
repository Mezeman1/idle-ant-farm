import {useEvolveStore} from '@/stores/evolveStore'

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
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Soldier Set')
    },
    evolves: true,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier /= bonusMultiplier
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
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Soldier Set')
    },
    evolves: true,
    multiplier: 0.0062, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier /= bonusMultiplier
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
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Soldier Set')
    },
    evolves: true,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier /= bonusMultiplier
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
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Soldier Set')
    },
    evolves: true,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier /= bonusMultiplier
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
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Soldier Set')
    },
    evolves: true,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
]
