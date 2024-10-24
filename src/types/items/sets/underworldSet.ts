import {Item} from '@/types/items/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'

export const underworldSet = [
  {
    id: 'underworld-helm',
    name: 'Underworld Helm',
    type: 'equipment',
    description: 'Helm of the underworld, increases defense by 0.9% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Underworld Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Underworld Set')
    },
    multiplier: 0.009,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'underworld-chestplate',
    name: 'Underworld Chestplate',
    type: 'equipment',
    description: 'Chestplate from the underworld, increases max health by 1.2% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Underworld Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Underworld Set')
    },
    multiplier: 0.012,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyMaxHealthModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyMaxHealthModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'underworld-legs',
    name: 'Underworld Greaves',
    type: 'equipment',
    description: 'Leg armor from the underworld, increases defense by 0.6% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Underworld Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Underworld Set')
    },
    multiplier: 0.006,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'underworld-cloak',
    name: 'Underworld Cloak',
    type: 'equipment',
    description: 'A cloak that increases army health regeneration by 0.9% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Underworld Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Underworld Set')
    },
    multiplier: 0.009,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyRegenModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armyRegenModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'underworld-blade',
    name: 'Underworld Blade',
    type: 'equipment',
    description: 'A sword that increases attack by 1.5% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Underworld Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Underworld Set')
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
]
