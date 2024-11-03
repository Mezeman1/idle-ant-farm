import {useEvolveStore} from '@/stores/evolveStore'

export const workerSet = [
  {
    id: 'worker-helm',
    name: 'Worker Helm',
    type: 'equipment',
    description: 'Head armor for workers, increases resource gathering by 0.1% per level. Also increases defense and health by 0.05% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.001,
    effect: ({gameStore, adventureStore}, item) => {
      const modifier = {
        defense: 0.0005,
        health: 0.0005,
      }

      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      adventureStore.armyDefenseModifier *= 1 + (modifier.defense * item.level)
      adventureStore.armyMaxHealthModifier *= 1 + (modifier.health * item.level)
      return true
    },
    onRemove: ({gameStore, adventureStore}, item) => {
      const modifier = {
        defense: 0.0005,
        health: 0.0005,
      }
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
      adventureStore.armyDefenseModifier /= 1 + (modifier.defense * item.level)
      adventureStore.armyMaxHealthModifier /= 1 + (modifier.health * item.level)
    },
    evolves: true,
  },
  {
    id: 'worker-body',
    name: 'Worker Chestplate',
    type: 'equipment',
    description: 'Body armor for workers, increases resource gathering by 0.1% per level. Also increases defense and health by 0.05% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.001,
    effect: ({gameStore, adventureStore}, item) => {
      const modifier = {
        defense: 0.0005,
        health: 0.0005,
      }


      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      adventureStore.armyDefenseModifier *= 1 + (modifier.defense * item.level)
      adventureStore.armyMaxHealthModifier *= 1 + (modifier.health * item.level)
      return true
    },
    onRemove: ({gameStore, adventureStore}, item) => {
      const modifier = {
        defense: 0.0005,
        health: 0.0005,
      }
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
      adventureStore.armyDefenseModifier /= 1 + (modifier.defense * item.level)
      adventureStore.armyMaxHealthModifier /= 1 + (modifier.health * item.level)
    },
    evolves: true,
  },
  {
    id: 'worker-legs',
    name: 'Worker Legs',
    type: 'equipment',
    description: 'Leg armor for workers, increases resource gathering by 0.08% per level. Also increases damage by 0.05% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0008,
    effect: ({gameStore, adventureStore}, item) => {
      const modifier = {
        damage: 0.0005,
      }
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      adventureStore.armyAttackModifier *= 1 + (modifier.damage * item.level)
      return true
    },
    onRemove: ({gameStore, adventureStore}, item) => {
      const modifier = {
        damage: 0.0005,
      }
      const bonusMultiplier = 1 + (item.multiplier * item.level)
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
      adventureStore.armyAttackModifier /= 1 + (modifier.damage * item.level)
    },
    evolves: true,
  },
  {
    id: 'worker-gloves',
    name: 'Worker Gloves',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.13% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0013,
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
    description: 'Weapon for workers, increases resource gathering by 0.2% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.002,
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
    description: 'Accessory for workers, increases resource gathering by 0.16% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set',
    rarity: 'uncommon',
    level: 1,
    maxLevel: () => {
      return useEvolveStore().getMaxItemLevel('Worker Set')
    },
    multiplier: 0.0016,
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
