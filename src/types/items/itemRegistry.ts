import {useAdventureStore} from '@/stores/adventureStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {workerSet} from '@/types/items/sets/WorkerSet'
import {soldierSet, soldierSetII} from '@/types/items/sets/SoldierSet'
import {royalSet} from '@/types/items/sets/royalSet'
import {volcanoSet} from '@/types/items/sets/volcanoSet'
import {underworldSet} from '@/types/items/sets/underworldSet'
import {arcticTundraSet} from '@/types/items/sets/arcticTundraSet'
import {consumableItems} from '@/types/items/consumableItems'
import {passiveItems} from '@/types/items/passiveItems'
import {useEvolveStore} from '@/stores/evolveStore'
import {toPercentage} from '@/utils/index'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useEquipmentStore } from '@/stores/equipmentStore'
import { abyssalSet } from './sets/abyssalSet'

export interface Item {
  id: string
  name: string
  type: 'equipment' | 'consumable' | 'material' | 'passive'
  description: string
  equipmentType?: 'armor' | 'weapon' | 'accessory'
  slotType?: 'head' | 'body' | 'legs' | 'weapon' | 'accessory'
  set?: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  level?: number      // Current level of the item
  // number or callable function that returns a number
  maxLevel?: number | (() => number) // Maximum level of the item
  amount?: number     // For stackable items
  effect?: (context: any, item: Item) => boolean
  onRemove?: (context: any, item: Item) => void
  applyOnLoad?: boolean;
  applyOnPrestige?: boolean;
  duration?: number;
  image?: string;
  multiplier?: number;

  evolves?: boolean;
}

export function getItemFromRegistry(item: Item): Item {  
  if (!item.id && !item.name) {
    return item
  }

  const itemFromRegistry = useInventoryStore().getItemById(item.id ?? item.name)

  if (itemFromRegistry) {
    return itemFromRegistry
  }

  return item
}

export function getMaxItemLevel(item: Item): number|null {
  item = getItemFromRegistry(item)

  if (item.maxLevel) {
    if (typeof item.maxLevel === 'function') {
      return item.maxLevel()
    }

    return item.maxLevel
  }

  return null
}

export function getItemName(item: Item): string {
  item = getItemFromRegistry(item)
  if (item.evolves) {
    return `${item.name} ${useEvolveStore().getCurrentEvolutionInRomanLetters(item.set)}`
  }

  return item.name
}

export type SetBonus = {
  apply: () => void;
  remove: () => void;
  explanation?: string | (() => string);
  maxLevelsPerEvolution?: Record<number, number>;
};

export type SetName =
  'Default'
  | 'Worker Set'
  | 'Soldier Set'
  | 'Royal Set'
  | 'Volcano Set'
  | 'Underworld Set'
  | 'Arctic Tundra Set'
  | 'Abyssal Set';

export const setBonuses: Record<SetName, SetBonus> = {
  'Worker Set': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.collectionRateModifier *= 1 + (0.05 * currentEvolution)
      }

      resourcesStore.productionRates.collectionRateModifier *= 1.15
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.collectionRateModifier /= 1 + (0.05 * currentEvolution)
      }

      resourcesStore.productionRates.collectionRateModifier /= 1.15
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.15 + 0.05 * currentEvolution

      return `Increases resource gathering by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 100,
      1: 300,
      2: 500,
      3: 700,
      4: 900,
      5: 1100,
      6: 1300,
      7: 1500,
      8: 1700,
      9: 1900,
      10: 2100,
      11: 2300,
      12: 2500,
      13: 2700,
      14: 2900,
      15: 3100,
      16: 3300,
      17: 3500,
      18: 3700,
      19: 3900,
      20: 4100,
    },
  },
  'Soldier Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier *= 1 + (0.05 * currentEvolution)
        adventureStore.armyDefenseModifier *= 1 + (0.05 * currentEvolution)
      }

      adventureStore.armyAttackModifier *= 1.15
      adventureStore.armyDefenseModifier *= 1.15
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier /= 1 + (0.05 * currentEvolution)
        adventureStore.armyDefenseModifier /= 1 + (0.05 * currentEvolution)
      }

      adventureStore.armyAttackModifier /= 1.15
      adventureStore.armyDefenseModifier /= 1.15
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.15 + 0.05 * currentEvolution

      return `Increases army attack and defense by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 500,
      1: 800,
      2: 1000,
      3: 1200,
      4: 1500,
      5: 2000,
      6: 2500,
      7: 3000,
      8: 3500,
      9: 4000,
      10: 4500,
      11: 5000,
      12: 5500,
      13: 6000,
      14: 6500,
      15: 7000,
      16: 7500,
      17: 8000,
      18: 8500,
      19: 9000,
      20: 9500,
    },
  },
  'Royal Set': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.larvaeProductionModifier *= 1 + (0.05 * currentEvolution)
      }

      resourcesStore.productionRates.larvaeProductionModifier *= 1.2
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.larvaeProductionModifier /= 1 + (0.05 * currentEvolution)
      }

      resourcesStore.productionRates.larvaeProductionModifier /= 1.2
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.2 + 0.05 * currentEvolution

      return `Increases larvae production by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 1000,
      1: 1200,
      2: 1500,
      3: 2000,
      4: 2500,
      5: 3000,
      6: 3500,
      7: 4000,
      8: 4500,
      9: 5000,
      10: 5500,
      11: 6000,
      12: 6500,
      13: 7000,
      14: 7500,
      15: 8000,
      16: 8500,
      17: 9000,
      18: 9500,
      19: 10000,
      20: 10500,
    },
  },
  'Volcano Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier *= 1 + (0.05 * currentEvolution)
      }
      adventureStore.armyAttackModifier *= 1.25
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier /= 1 + (0.05 * currentEvolution)
      }
      adventureStore.armyAttackModifier /= 1.25
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.25 + 0.05 * currentEvolution
      return `Increases army attack by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 500,
      1: 750,
      2: 1000,
      3: 1250,
      4: 1500,
      5: 1750,
      6: 2000,
      7: 2250,
      8: 2500,
      9: 2750,
      10: 3000,
      11: 3250,
      12: 3500,
      13: 3750,
      14: 4000,
      15: 4250,
      16: 4500,
      17: 4750,
      18: 5000,
      19: 5250,
      20: 5500,
    },
  },
  'Underworld Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyMaxHealthModifier *= 1 + (0.06 * currentEvolution)
      }
      adventureStore.armyMaxHealthModifier *= 1.30
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyMaxHealthModifier /= 1 + (0.06 * currentEvolution)
      }
      adventureStore.armyMaxHealthModifier /= 1.30
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.30 + 0.06 * currentEvolution
      return `Increases max health of the army by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 750,
      1: 1000,
      2: 1250,
      3: 1500,
      4: 1750,
      5: 2000,
      6: 2250,
      7: 2500,
      8: 2750,
      9: 3000,
      10: 3250,
      11: 3500,
      12: 3750,
      13: 4000,
      14: 4250,
      15: 4500,
      16: 4750,
      17: 5000,
      18: 5250,
      19: 5500,
      20: 5750,
    },
  },
  'Arctic Tundra Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyDefenseModifier *= 1 + (0.04 * currentEvolution)
        adventureStore.armyRegenModifier *= 1 + (0.04 * currentEvolution)
      }
      adventureStore.armyDefenseModifier *= 1.20
      adventureStore.armyRegenModifier *= 1.20
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyDefenseModifier /= 1 + (0.04 * currentEvolution)
        adventureStore.armyRegenModifier /= 1 + (0.04 * currentEvolution)
      }
      adventureStore.armyDefenseModifier /= 1.20
      adventureStore.armyRegenModifier /= 1.20
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.20 + 0.04 * currentEvolution
      return `Increases army defense and regeneration by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 300,
      1: 500,
      2: 700,
      3: 900,
      4: 1100,
      5: 1300,
      6: 1500,
      7: 1700,
      8: 1900,
      9: 2100,
      10: 2300,
      11: 2500,
      12: 2700,
      13: 2900,
      14: 3100,
      15: 3300,
      16: 3500,
      17: 3700,
      18: 3900,
      19: 4100,
      20: 4300,
    },
  },
  'Abyssal Set': {
    apply: () => {
      const equipmentStore = useEquipmentStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        equipmentStore.storageModifier *= 1 + (0.015 * currentEvolution)
      }
      equipmentStore.storageModifier *= 1.2
    },
    remove: () => {
      const equipmentStore = useEquipmentStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        equipmentStore.storageModifier /= 1 + (0.015 * currentEvolution)
      }
      equipmentStore.storageModifier /= 1.2
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.20 + 0.015 * currentEvolution
      return `Increases storage by ${toPercentage(totalBonus, 1)}%.`
    },
    maxLevelsPerEvolution: {
      0: 300,
      1: 500,
      2: 700,
      3: 900,
      4: 1100,
      5: 1300,
      6: 1500,
      7: 1700,
      8: 1900,
      9: 2100,
      10: 2300,
      11: 2500,
      12: 2700,
      13: 2900,
      14: 3100,
      15: 3300,
      16: 3500,
      17: 3700,
      18: 3900,
      19: 4100,
      20: 4300,
    },
  },
}

export const equipmentSets: Item[] = [
  // Worker Set
  ...workerSet,

  // Soldier Set
  ...soldierSet,

  {
    id: 'mantis-hunter-claw',
    name: 'Mantis Hunter Claw',
    type: 'equipment',
    description: 'Increases army chance to bleed by 0.1% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.001,
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.bleedChance += bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = item.multiplier * item.level
      adventureStore.bleedChance -= bonusMultiplier
    },
  },

  // Royal Set
  ...royalSet,

  // Volcano Set
  ...volcanoSet,
  // Underworld Set
  ...underworldSet,

  // Arctic Tundra Set
  ...arcticTundraSet,

  // Abyssal Set
  ...abyssalSet,
]

export const itemRegistry: Item[] = [
  ...equipmentSets,
  ...consumableItems,
  ...passiveItems,
]
