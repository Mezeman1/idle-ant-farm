import {useEvolveStore} from '@/stores/evolveStore'

export const royalSet = [
  {
    id: 'royal-crown',
    name: 'Royal Crown',
    type: 'equipment',
    description: 'Crown for the queen, increases larvae production by 0.112% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Royal Set')
    },
    evolves: true,
    multiplier: 0.00112, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-robe',
    name: 'Royal Robe',
    type: 'equipment',
    description: 'Body armor for the queen, increases larvae production by 0.157% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Royal Set')
    },
    evolves: true,
    multiplier: 0.00157, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-legs',
    name: 'Royal Greaves',
    type: 'equipment',
    description: 'Leg armor for the queen, increases larvae production by 0.067% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Royal Set')
    },
    evolves: true,
    multiplier: 0.00067, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-scepter',
    name: 'Royal Scepter',
    type: 'equipment',
    description: 'Weapon for the queen, increases larvae production by 0.224% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Royal Set')
    },
    evolves: true,
    multiplier: 0.00224, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-ring',
    name: 'Royal Ring',
    type: 'equipment',
    description: 'Accessory for the queen, increases overall army stats by 0.223% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Royal Set')
    },
    evolves: true,
    multiplier: 0.00223, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier *= bonusMultiplier
      adventureStore.armyDefenseModifier *= bonusMultiplier
      adventureStore.armyMaxHealthModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier /= bonusMultiplier
      adventureStore.armyDefenseModifier /= bonusMultiplier
      adventureStore.armyMaxHealthModifier /= bonusMultiplier
    },
  },
]
