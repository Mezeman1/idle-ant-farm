import {Item} from '@/types/items/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'

export const volcanoSet = [
  {
    id: 'volcano-helm',
    name: 'Volcano Helm',
    type: 'equipment',
    description: 'A fiery helm that increases attack by 0.5% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.005,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-chestplate',
    name: 'Volcano Chestplate',
    type: 'equipment',
    description: 'A molten chestplate that increases defense by 0.75% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.0075,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-boots',
    name: 'Volcano Boots',
    type: 'equipment',
    description: 'Boots forged in lava that increase movement speed and health regeneration by 0.6% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.006,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyRegenModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyRegenModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-gloves',
    name: 'Volcano Gauntlets',
    type: 'equipment',
    description: 'Gauntlets that increase army attack and defense by 0.8% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.008,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      adventureStore.armyDefenseModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
      adventureStore.armyDefenseModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-blade',
    name: 'Volcano Blade',
    type: 'equipment',
    description: 'A sword forged in the depths of a volcano that increases attack by 1% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.01,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-ring',
    name: 'Volcano Ring',
    type: 'equipment',
    description: 'A ring that increases army health by 1.2% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.012,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyMaxHealthModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyMaxHealthModifier -= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'volcano-scepter',
    name: 'Volcano Scepter',
    type: 'equipment',
    description: 'A scepter that increases army attack by 1.5% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    rarity: 'rare',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Volcano Set')
    },
    multiplier: 0.015,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.armyAttackModifier -= bonusMultiplier
    },
    evolves: true,
  },
]
