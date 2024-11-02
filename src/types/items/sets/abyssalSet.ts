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
]
