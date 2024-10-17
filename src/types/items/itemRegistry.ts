import {useAdventureStore} from '@/stores/adventureStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {workerSet, workerSetII} from '@/types/items/sets/WorkerSet'
import {soldierSet, soldierSetII} from '@/types/items/sets/SoldierSet'
import {royalSet} from '@/types/items/sets/royalSet'
import {volcanoSet} from '@/types/items/sets/volcanoSet'
import {underworldSet} from '@/types/items/sets/underworldSet'
import {arcticTundraSet} from '@/types/items/sets/arcticTundraSet'
import {consumableItems} from '@/types/items/consumableItems'
import {passiveItems} from '@/types/items/passiveItems'

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
  maxLevel?: number   // Maximum level the item can reach
  amount?: number     // For stackable items
  effect?: (context: any, item: Item) => boolean
  onRemove?: (context: any, item: Item) => void
  applyOnLoad?: boolean;
  applyOnPrestige?: boolean;
  duration?: number;
  image?: string;
  multiplier?: number;
}

export type SetBonus = {
  apply: () => void;
  remove: () => void;
  explanation?: string;
};

export type SetName =
  'Worker Set'
  | 'Worker Set II'
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
      resourcesStore.productionRates.collectionRateModifier += 0.15
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier -= 0.15
    },
    explanation: 'Increases resource gathering by 15%.',
  },
  'Worker Set II': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier += 0.20
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier -= 0.20
    },
    explanation: 'Increases resource gathering by 20%.',
  },
  'Soldier Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier += 0.15
      adventureStore.armyDefenseModifier += 0.15
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.15
      adventureStore.armyDefenseModifier -= 0.15
    },
    explanation: 'Increases army attack and defense by 15%.',
  },
  'Soldier Set II': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier += 0.20
      adventureStore.armyDefenseModifier += 0.20
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.20
      adventureStore.armyDefenseModifier -= 0.20
    },
    explanation: 'Increases army attack and defense by 20%.',
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
  ...workerSetII,

  // Soldier Set
  ...soldierSet,
  ...soldierSetII,

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
