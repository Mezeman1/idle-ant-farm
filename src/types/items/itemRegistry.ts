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

export function getMaxItemLevel(item: Item): number|null {
  if (item.maxLevel) {
    if (typeof item.maxLevel === 'function') {
      return item.maxLevel()
    }

    return item.maxLevel
  }

  return null
}

export function getItemName(item: Item): string {
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
  'Worker Set'
  | 'Soldier Set'
  | 'Soldier Set II'
  | 'Royal Set'
  | 'Volcano Set'
  | 'Underworld Set'
  | 'Arctic Tundra Set';

export const setBonuses: Record<SetName, SetBonus> = {
  'Worker Set': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.collectionRateModifier += 0.05 * currentEvolution
      }

      resourcesStore.productionRates.collectionRateModifier += 0.15
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        resourcesStore.productionRates.collectionRateModifier -= 0.05 * currentEvolution
      }

      resourcesStore.productionRates.collectionRateModifier -= 0.15
    },
    explanation: () => {
      const currentEvolution = useEvolveStore().currentEvolution
      const totalBonus = 0.15 + 0.05 * currentEvolution

      return `Increases resource gathering by ${totalBonus * 100}%.`
    },
    maxLevelsPerEvolution: {
      0: 100,
      1: 250,
      2: 300,
      3: 400,
      4: 500,
      5: 650,
      6: 750,
      7: 900,
      8: 1000,
    },
  },
  'Soldier Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier += 0.05 * currentEvolution
        adventureStore.armyDefenseModifier += 0.05 * currentEvolution
      }

      adventureStore.armyAttackModifier += 0.15
      adventureStore.armyDefenseModifier += 0.15
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      const currentEvolution = useEvolveStore().currentEvolution
      if (currentEvolution >= 1) {
        adventureStore.armyAttackModifier -= 0.05 * currentEvolution
        adventureStore.armyDefenseModifier -= 0.05 * currentEvolution
      }

      adventureStore.armyAttackModifier -= 0.15
      adventureStore.armyDefenseModifier -= 0.15
    },
    explanation: 'Increases army attack and defense by 15%.',
    maxLevelsPerEvolution: {
      0: 500,
      1: 800,
      2: 1000,
      3: 1200,
      4: 1500,
    },
  },
  'Royal Set': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier += 0.20
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier -= 0.20
    },
    explanation: 'Increases queen larvae production by 20%.',
  },
  'Volcano Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier += 0.25
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.25
    },
    explanation: 'Increases army attack by 25%.',
  },
  'Underworld Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealthModifier += 0.30
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealthModifier -= 0.30
    },
    explanation: 'Increases max health of the army by 30%.',
  },
  'Arctic Tundra Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier += 0.20
      adventureStore.armyRegenModifier += 0.20
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier -= 0.20
      adventureStore.armyRegenModifier -= 0.20
    },
    explanation: 'Increases army defense and regeneration by 20%.',
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
]

export const itemRegistry: Item[] = [
  ...equipmentSets,
  ...consumableItems,
  ...passiveItems,
]
