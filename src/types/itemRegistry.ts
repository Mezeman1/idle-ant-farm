import {useAdventureStore} from '../stores/adventureStore'
import {useResourcesStore} from '@/stores/resourcesStore'

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
      resourcesStore.productionRates.collectionRateModifier *= 1.15
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier /= 1.15
    },
    explanation: 'Increases resource gathering by 15%.',
  },
  'Worker Set II': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier *= 1.20
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier /= 1.20
    },
    explanation: 'Increases resource gathering by 20%.',
  },
  'Soldier Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 1.15
      adventureStore.armyDefenseModifier *= 1.15
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier /= 1.15
      adventureStore.armyDefenseModifier /= 1.15
    },
    explanation: 'Increases army attack and defense by 15%.',
  },
  'Royal Set': {
    apply: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier *= 1.20
    },
    remove: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier /= 1.20
    },
    explanation: 'Increases queen larvae production by 20%.',
  },
  'Volcano Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 1.25
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier /= 1.25
    },
    explanation: 'Increases army attack by 25%.',
  },
  'Underworld Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealthModifier *= 1.30
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealthModifier /= 1.30
    },
    explanation: 'Increases max health of the army by 30%.',
  },
  'Arctic Tundra Set': {
    apply: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier *= 1.20
      adventureStore.armyRegenModifier *= 1.20
    },
    remove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier /= 1.20
      adventureStore.armyRegenModifier /= 1.20
    },
    explanation: 'Increases army defense and regeneration by 20%.',
  },
}

// Separate exports for consumables and passives

export const consumableItems: Item[] = [
  {
    id: 'grasshopper-leg',
    name: 'Grasshopper Leg',
    type: 'consumable',
    description: 'Heals the army by 20 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 20 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 20
      return true
    },
    rarity: 'common',
  },
  {
    id: 'termite-mandible',
    name: 'Termite Mandible',
    type: 'consumable',
    description: 'Heals the army by 30 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 30 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 30
      return true
    },
    rarity: 'common',
  },
  {
    id: 'grasshopper-wing',
    name: 'Grasshopper Wing',
    type: 'consumable',
    description: 'Increases army regen by 1% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier *= 1.01
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier /= 1.01
    },
    duration: 60 * 5,
    rarity: 'common',
  },
  {
    id: 'ant-strength-potion',
    name: 'Ant Strength Potion',
    type: 'consumable',
    description: 'Increases army attack by 10% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.10
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack /= 1.10
    },
    duration: 60 * 5,
    rarity: 'uncommon',
  },
  {
    id: 'beetle-shell',
    name: 'Beetle Shell',
    type: 'consumable',
    description: 'Increase army defense by 10% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.10
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense /= 1.10
    },
    duration: 60 * 5,
    rarity: 'uncommon',
  },
  {
    id: 'centipede-leg',
    name: 'Centipede Leg',
    type: 'consumable',
    description: 'Heals the army by 50 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 50 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 50
      return true
    },
    rarity: 'uncommon',
  },
  {
    id: 'moth-dust',
    name: 'Moth Dust',
    type: 'consumable',
    description: 'Heals the army by 100 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 100 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 100
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'butterfly-dust',
    name: 'Butterfly Dust',
    type: 'consumable',
    description: 'Heals the army by 200 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 200 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 200
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'wasp-stinger',
    name: 'Wasp Stinger',
    type: 'consumable',
    description: 'Increases army attack by attack by 20% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.20

      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack /= 1.20
    },
    duration: 60 * 5,
    rarity: 'rare',
  },
  {
    id: 'mountain-ant-mandible',
    name: 'Mountain Ant Mandible',
    type: 'consumable',
    description: 'Increases army defense by 20% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.20
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense /= 1.20
    },
    duration: 60 * 5,
    rarity: 'rare',
  },
  {
    id: 'lava-ant-tooth',
    name: 'Lava Ant Tooth',
    type: 'consumable',
    description: 'Increases army attack and defense by 20% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.20
      adventureStore.armyDefense *= 1.20
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack /= 1.20
      adventureStore.armyDefense /= 1.20
    },
    duration: 60 * 5,
    rarity: 'rare',
  },
  {
    id: 'magma-carapace',
    name: 'Magma Carapace',
    type: 'consumable',
    description: 'Increases army defense by 50% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.50
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense /= 1.50
    },
    duration: 60 * 5,
    rarity: 'rare',
  },
  {
    id: 'scorpion-tail',
    name: 'Scorpion Tail',
    type: 'consumable',
    description: 'Heals the army by 2500 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + 2500, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'infernal-tail',
    name: 'Infernal Tail',
    type: 'consumable',
    description: 'Increases army attack and defense by 100% for 30 seconds.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 2
      adventureStore.armyDefense *= 2
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack /= 2
      adventureStore.armyDefense /= 2
    },
    duration: 30,
    rarity: 'epic',
  },
  {
    id: 'ice-beetle-shell',
    name: 'Ice Beetle Shell',
    type: 'passive',
    description: 'Increases army defense by 50% for 2 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.50
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense /= 1.50
    },
    duration: 60 * 2,
    rarity: 'epic',
  },
  {
    id: 'frost-scorpion-tail',
    name: 'Frost Scorpion Tail',
    type: 'consumable',
    description: 'Heals the army by 5000 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + 5000, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'epic',
  },
  {
    id: 'frost-wyrm-scale',
    name: 'Frost Wyrm Scale',
    type: 'consumable',
    description: 'Increases army defense by 100% for 2 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 2
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense /= 2
    },
    duration: 60 * 2,
    rarity: 'legendary',
  },
  {
    id: 'kraken-ink',
    name: 'Kraken Ink',
    type: 'consumable',
    description: 'Increases army regen by 100% for 2 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier *= 2
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier /= 2
    },
    duration: 60 * 2,
    rarity: 'legendary',
  },
  {
    id: 'leviathan-scale',
    name: 'Leviathan Scale',
    type: 'consumable',
    description: 'Heals the army by 10000 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + 10000, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'epic',
  },
  {
    name: 'Cosmic Wasp Wing',
    id: 'cosmic-wasp-wing',
    type: 'consumable',
    description: 'Increases army attack by 100% for 2 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 2
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack /= 2
    },
    duration: 60 * 2,
    rarity: 'epic',
  },
  {
    name: 'Celestial Scale',
    id: 'celestial-scale',
    type: 'consumable',
    description: 'Heals the army by 25000 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + 25000, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'legendary',
  },
]

export const passiveItems: Item[] = [
  {
    name: 'Galaxy Web',
    id: 'galaxy-web',
    type: 'passive',
    description: 'Increases resource gathering by 100%.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier *= 2
      return true
    },
    rarity: 'legendary',
  },
  {
    name: 'Void Mantis Claw',
    id: 'void-mantis-claw',
    type: 'passive',
    description: 'Increases army attack by 100%.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 2
      return true
    },
    rarity: 'legendary',
  },
  {
    id: 'abyss-crab-claw',
    name: 'Abyss Crab Claw',
    type: 'passive',
    description: 'Increases army attack by 50%.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 1.50
      return true
    },
    rarity: 'legendary',
  },
  {
    id: 'angler-teeth',
    name: 'Angler Teeth',
    type: 'passive',
    description: 'Increases regeneration by 100%.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier *= 2
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'glacier-mantis-claw',
    name: 'Glacier Mantis Claw',
    type: 'passive',
    description: 'Increases army attack by 50%.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 1.50
      return true
    },
    rarity: 'legendary',
  },
  {
    id: 'queen-crown',
    name: 'Queen’s Crown',
    type: 'passive',
    description: 'Increases queen larvae production by 100%. ',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier *= 2
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'queen-crown-ii',
    name: 'Queen’s Crown II',
    type: 'passive',
    description: 'Increases queen larvae production by 100%. ',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.larvaeProductionModifier *= 2
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'queen-stinger',
    name: 'Queen Stinger',
    type: 'passive',
    description: 'Increases army health regeneration by 100%.',
    applyOnPrestige: true,
    applyOnLoad: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier *= 2
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'queen-head',
    name: 'Queen Head',
    type: 'passive',
    description: 'Increases ant production by 100%.',
    applyOnPrestige: true,
    applyOnLoad: true,
    effect: () => {
      const resourcesStore = useResourcesStore()
      resourcesStore.productionRates.collectionRateModifier *= 2
      return true
    },
  },
  {
    id: 'spider-silk',
    name: 'Spider Silk',
    type: 'passive',
    description: 'Increases army defense by 10%. ',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.10
      return true
    },
    applyOnLoad: true,
    rarity: 'uncommon',
  },
  {
    id: 'stone-heart',
    name: 'Stone Heart',
    type: 'passive',
    description: 'Increases max health of the army by 20%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealth *= 1.20
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
  {
    id: 'butterfly-wing',
    name: 'Butterfly Wing',
    type: 'passive',
    description: 'Health regeneration increased by 50%. ',
    applyOnPrestige: true,
    applyOnLoad: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier *= 1.50
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'mantis-claw',
    name: 'Mantis Claw',
    type: 'passive',
    description: 'Increases army attack by 15%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.15
      return true
    },
    rarity: 'rare',
    applyOnLoad: true,
  },
  {
    id: 'rock-carapace',
    name: 'Rock Carapace',
    type: 'passive',
    description: 'Increases army defense by 20%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.20
      return true
    },
    rarity: 'rare',
    applyOnLoad: true,
  },
  {
    id: 'dragon-scale',
    name: 'Dragon Scale',
    type: 'passive',
    description: 'Increases max health and defense by 50%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyMaxHealth *= 1.50
      adventureStore.armyDefense *= 1.50
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
  {
    id: 'underworld-crown',
    name: 'Underworld Crown',
    type: 'passive',
    description: 'Increases all army stats by 100%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 2
      adventureStore.armyDefense *= 2
      adventureStore.armyMaxHealth *= 2
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
  {
    id: 'hellfire-ant-fang',
    name: 'Hellfire Ant Fang',
    type: 'passive',
    description: 'Increases army attack by 20%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier *= 1.2
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
  {
    id: 'demonic-carapace',
    name: 'Demonic Carapace',
    type: 'passive',
    description: 'Increases army defense by 20%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier *= 1.2
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
]

const workerSet = [
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
    maxLevel: 100,
    multiplier: 0.001035313244622532,
    effect: ({gameStore}, item) => {
      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
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
    maxLevel: 100,
    multiplier: 0.0015529698669337984, // Already done
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
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
    maxLevel: 100,
    multiplier: 0.0007758055940675406, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
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
    maxLevel: 100,
    multiplier: 0.0012934622163788066, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
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
    maxLevel: 100,
    multiplier: 0.002070626489245064, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
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
    maxLevel: 100,
    multiplier: 0.0015529698669337984, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
]

const workerSetII = [
  {
    id: 'worker-helm-ii',
    name: 'Worker Helm II',
    type: 'equipment',
    description: 'Head armor for workers, increases resource gathering by 0.1035% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.001035313244622532,
    effect: ({gameStore}, item) => {
      // Increase resource gathering by 0.1035% per level
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
  {
    id: 'worker-body-ii',
    name: 'Worker Chestplate II',
    type: 'equipment',
    description: 'Body armor for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0015529698669337984, // Already done
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
  {
    id: 'worker-legs-ii',
    name: 'Worker Legs II',
    type: 'equipment',
    description: 'Leg armor for workers, increases resource gathering by 0.0776% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0007758055940675406, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
  {
    id: 'worker-gloves-ii',
    name: 'Worker Gloves II',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1293% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0012934622163788066, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
  {
    id: 'worker-pickaxe-ii',
    name: 'Worker Pickaxe II',
    type: 'equipment',
    description: 'Weapon for workers, increases resource gathering by 0.2071% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.002070626489245064, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
  {
    id: 'worker-shield-ii',
    name: 'Worker Shield II',
    type: 'equipment',
    description: 'Accessory for workers, increases resource gathering by 0.1553% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Worker Set II',
    rarity: 'uncommon',
    level: 1,
    maxLevel: 250,
    multiplier: 0.0015529698669337984, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.collectionRateModifier /= bonusMultiplier
    },
  },
]

const soldierSet = [
  {
    id: 'soldier-helm',
    name: 'Soldier Helm',
    type: 'equipment',
    description: 'Head armor for soldiers, increases defense by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-body',
    name: 'Soldier Chestplate',
    type: 'equipment',
    description: 'Body armor for soldiers, increases defense by 0.62% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0062, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-legs',
    name: 'Soldier Legs',
    type: 'equipment',
    description: 'Leg armor for soldiers, increases attack by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-shield',
    name: 'Soldier Shield',
    type: 'equipment',
    description: 'Accessory for soldiers, increases defense by 0.77% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-sword',
    name: 'Soldier Sword',
    type: 'equipment',
    description: 'Weapon for soldiers, increases attack by 0.77% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Soldier Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
]

const soldierSetII = [
  {
    id: 'soldier-helm-ii',
    name: 'Soldier Helm II',
    type: 'equipment',
    description: 'Head armor for soldiers, increases defense by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-body-ii',
    name: 'Soldier Chestplate II',
    type: 'equipment',
    description: 'Body armor for soldiers, increases defense by 0.62% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0062, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-legs-ii',
    name: 'Soldier Legs II',
    type: 'equipment',
    description: 'Leg armor for soldiers, increases attack by 0.31% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0031, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-shield-ii',
    name: 'Soldier Shield II',
    type: 'equipment',
    description: 'Accessory for soldiers, increases defense by 0.77% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'soldier-sword-ii',
    name: 'Soldier Sword II',
    type: 'equipment',
    description: 'Weapon for soldiers, increases attack by 0.77% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Soldier Set II',
    rarity: 'rare',
    level: 1,
    maxLevel: 800,
    multiplier: 0.0077, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
]

export const equipmentSets: Item[] = [
  // Worker Set
  ...workerSet,
  ...workerSetII,

  // Soldier Set
  ...soldierSet,
  ...soldierSetII,

  // Royal Set
  {
    id: 'royal-crown',
    name: 'Royal Crown',
    type: 'equipment',
    description: 'Crown for the queen, increases larvae production by 0.112% per level.',
    equipmentType: 'armor',
    slotType: 'head',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.00112, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-robe',
    name: 'Royal Robe',
    type: 'equipment',
    description: 'Body armor for the queen, increases larvae production by 0.157% per level.',
    equipmentType: 'armor',
    slotType: 'body',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.00157, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-legs',
    name: 'Royal Greaves',
    type: 'equipment',
    description: 'Leg armor for the queen, increases larvae production by 0.067% per level.',
    equipmentType: 'armor',
    slotType: 'legs',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.00067, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-scepter',
    name: 'Royal Scepter',
    type: 'equipment',
    description: 'Weapon for the queen, increases larvae production by 0.224% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.00224, // Refactored multiplier
    effect: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier *= bonusMultiplier
      return true
    },
    onRemove: ({gameStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      gameStore.productionRates.larvaeProductionModifier /= bonusMultiplier
    },
  },
  {
    id: 'royal-ring',
    name: 'Royal Ring',
    type: 'equipment',
    description: 'Accessory for the queen, increases overall army stats by 0.223% per level.',
    equipmentType: 'accessory',
    slotType: 'accessory',
    set: 'Royal Set',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1000,
    multiplier: 0.00223, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      adventureStore.armyDefenseModifier *= bonusMultiplier
      adventureStore.armyMaxHealthModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
      adventureStore.armyDefenseModifier /= bonusMultiplier
      adventureStore.armyMaxHealthModifier /= bonusMultiplier
    },
  },

  // Volcano Set
  // Volcano Set
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
    maxLevel: 500,
    multiplier: 0.005, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
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
    maxLevel: 500,
    multiplier: 0.0075, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
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
    maxLevel: 500,
    multiplier: 0.006, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier /= bonusMultiplier
    },
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
    maxLevel: 500,
    multiplier: 0.008, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
  },
  {
    id: 'volcano-blade',
    name: 'Volcano Blade',
    type: 'equipment',
    description: 'A sword forged in the depths of a volcano that increases attack by 1% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.01, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
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
    maxLevel: 500,
    multiplier: 0.012, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyMaxHealthModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyMaxHealthModifier /= bonusMultiplier
    },
  },
  {
    id: 'volcano-scepter',
    name: 'Volcano Scepter',
    type: 'equipment',
    description: 'A scepter that increases army attack by 1.5% per level.',
    equipmentType: 'weapon',
    slotType: 'weapon',
    set: 'Volcano Set',
    rarity: 'rare',
    level: 1,
    maxLevel: 500,
    multiplier: 0.015, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
  // Underworld Set
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
    maxLevel: 750,
    multiplier: 0.009, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
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
    maxLevel: 750,
    multiplier: 0.012, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyMaxHealthModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyMaxHealthModifier /= bonusMultiplier
    },
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
    maxLevel: 750,
    multiplier: 0.006, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
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
    maxLevel: 750,
    multiplier: 0.009, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier /= bonusMultiplier
    },
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
    maxLevel: 750,
    multiplier: 0.015, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },

  // Arctic Tundra Set
  // Arctic Tundra Set
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
    maxLevel: 300,
    multiplier: 0.007, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
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
    maxLevel: 300,
    multiplier: 0.011, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyDefenseModifier /= bonusMultiplier
    },
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
    maxLevel: 300,
    multiplier: 0.006, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armySpeedModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armySpeedModifier /= bonusMultiplier
    },
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
    maxLevel: 300,
    multiplier: 0.013, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyRegenModifier /= bonusMultiplier
    },
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
    maxLevel: 300,
    multiplier: 0.008, // Refactored multiplier
    effect: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier *= bonusMultiplier
      return true
    },
    onRemove: ({adventureStore}, item) => {
      const bonusMultiplier = 1 + item.multiplier * item.level
      adventureStore.armyAttackModifier /= bonusMultiplier
    },
  },
]

export const itemRegistry: Item[] = [
  ...equipmentSets,
  ...consumableItems,
  ...passiveItems,
]
