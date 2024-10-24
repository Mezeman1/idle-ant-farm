import {useEvolveStore} from '@/stores/evolveStore'

export const workerSet = [
  {
    id: 'worker-helm',
    name: 'Worker Helm',
    type: 'equipment',
    description: 'Head armor for workers, increases resource gathering by 0.1035% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.001035313244622532,
    effect: ({gameStore}, item) => {
      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'worker-body',
    name: 'Worker Chestplate',
    type: 'equipment',
    description: 'Body armor for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0015529698669337984,
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'worker-legs',
    name: 'Worker Legs',
    type: 'equipment',
    description: 'Leg armor for workers, increases resource gathering by 0.0776% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0007758055940675406,
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'worker-gloves',
    name: 'Worker Gloves',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1293% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0012934622163788066,
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'worker-pickaxe',
    name: 'Worker Pickaxe',
    type: 'equipment',
    description: 'Weapon for workers, increases resource gathering by 0.2071% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.002070626489245064,
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
  {
    id: 'worker-shield',
    name: 'Worker Shield',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0015529698669337984,
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
    evolves: true,
  },
]
