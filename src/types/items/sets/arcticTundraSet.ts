import {Item} from '@/types/items/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'

export const arcticTundraSet = [
  {
    id: 'tundra-helm',
    name: 'Tundra Helm',
    type: 'equipment',
    description: 'Helm that enhances defense by 0.7% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Arctic Tundra Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Arctic Tundra Set')
    },
    multiplier: 0.007,
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
    id: 'tundra-armor',
    name: 'Tundra Armor',
    type: 'equipment',
    description: 'Body armor that increases defense by 1.1% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Arctic Tundra Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Arctic Tundra Set')
    },
    multiplier: 0.011,
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
    id: 'tundra-greaves',
    name: 'Tundra Greaves',
    type: 'equipment',
    description: 'Leg armor that increases movement speed by 0.6% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Arctic Tundra Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Arctic Tundra Set')
    },
    multiplier: 0.006,
    effect: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armySpeedModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item: Item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      adventureStore.armySpeedModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'tundra-cloak',
    name: 'Tundra Cloak',
    type: 'equipment',
    description: 'A cloak that increases health regeneration by 1.3% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Arctic Tundra Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Arctic Tundra Set')
    },
    multiplier: 0.013,
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
    id: 'tundra-blade',
    name: 'Tundra Blade',
    type: 'equipment',
    description: 'An icy blade that increases attack by 0.8% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Arctic Tundra Set',
    rarity: 'epic',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Arctic Tundra Set')
    },
    multiplier: 0.008,
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
