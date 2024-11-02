import {Item} from '@/types/items/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'

export const abyssalSet = [
  {
    id: 'abyssal-helm',
    name: 'Abyssal Helm',
    type: 'equipment',
    description: 'Helm that enhances storage by 1.5% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Abyssal Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Abyssal Set')
    },
    multiplier: 0.015,
    effect: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier *= bonusMultiplier
      return true
    },
    onRemove: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'abyssal-chestplate',
    name: 'Abyssal Chestplate',
    description: 'Chestplate that enhances storage by 1.5% per level.',
    type: 'equipment',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Abyssal Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Abyssal Set')
    },
    multiplier: 0.015,
    effect: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier *= bonusMultiplier
      return true
    },
    onRemove: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'abyssal-boots',
    name: 'Abyssal Boots',
    description: 'Boots that enhance storage by 1.5% per level.',
    type: 'equipment',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Abyssal Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Abyssal Set')
    },
    multiplier: 0.015,
    effect: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier *= bonusMultiplier
      return true
    },
    onRemove: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.storageModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'abyssal-sword',
    name: 'Abyssal Sword',
    description: 'Sword that enhances army attack by 1.5% per level.',
    type: 'equipment',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Abyssal Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Abyssal Set')
    },
    multiplier: 0.015,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'abyssal-shield',
    name: 'Abyssal Shield',
    description: 'Shield that enhances army defense by 1.5% per level.',
    type: 'equipment',
    equipmentType: 'shield',
    slotType: 'shield',
    set: 'Abyssal Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Abyssal Set')
    },
    multiplier: 0.015,
    effect: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.defenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({equipmentStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      equipmentStore.defenseModifier /= bonusMultiplier
    },
    evolves: true,
  },
]
