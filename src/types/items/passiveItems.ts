import {useResourcesStore} from '@/stores/resourcesStore'
import {useAdventureStore} from '@/stores/adventureStore'
import {Item} from '@/types/items/itemRegistry'
import {useEquipmentStore} from '@/stores/equipmentStore'
import {useTrainingStore} from '@/stores/trainingStore'

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
      resourcesStore.productionRates.collectionRateModifier += 1
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
      adventureStore.armyAttackModifier += 1
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
      adventureStore.armyAttackModifier += 0.50
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
      adventureStore.armyRegenModifier += 1
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
      adventureStore.armyAttackModifier += 0.50
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
      resourcesStore.productionRates.larvaeProductionModifier += 1
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
      resourcesStore.productionRates.larvaeProductionModifier += 1
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
      adventureStore.armyRegenModifier += 1
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
      resourcesStore.productionRates.collectionRateModifier += 1
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'spider-silk',
    name: 'Spider Silk',
    type: 'passive',
    description: 'Increases army defense by 10%. ',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier += 0.10
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
      adventureStore.armyMaxHealthModifier += 0.20
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
      adventureStore.armyRegenModifier += 0.50
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
      adventureStore.armyAttackModifier += 0.15
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
      adventureStore.armyDefenseModifier += 0.20
      return true
    },
    rarity: 'rare',
    applyOnLoad: true,
  },
  {
    id: 'molded-slot',
    name: 'Molded Slot',
    type: 'passive',
    description: 'Adds an additional accessory slot.',
    applyOnPrestige: true,
    effect: () => {
      const equipmentStore = useEquipmentStore()
      equipmentStore.maxAccessories += 1
      return true
    },
    rarity: 'legendary',
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
      adventureStore.armyMaxHealthModifier += 0.50
      adventureStore.armyDefenseModifier += 0.50
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
      adventureStore.armyAttackModifier += 1
      adventureStore.armyDefenseModifier += 1
      adventureStore.armyMaxHealthModifier += 1
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
      adventureStore.armyAttackModifier += 0.2
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
      adventureStore.armyDefenseModifier += 0.2
      return true
    },
    rarity: 'legendary',
    applyOnLoad: true,
  },
  // Add this new item to the passiveItems array
  {
    id: 'lucky-charm',
    name: 'Lucky Charm',
    type: 'passive',
    description: 'Doubles the drop chance of all items.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.globalDropChanceModifier *= 2
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.globalDropChanceModifier /= 2
    },
    rarity: 'legendary',
  },
  // Add this new item to the passiveItems array
  {
    id: 'miners-charm',
    name: 'Miner\'s Charm',
    type: 'passive',
    description: 'Gives a 5% chance to double loot from mining.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const trainingStore = useTrainingStore()
      trainingStore.miningDoubleChance += 0.05
      return true
    },
    onRemove: () => {
      const trainingStore = useTrainingStore()
      trainingStore.miningDoubleChance -= 0.05
    },
    rarity: 'rare',
  },
  // Add this new item to the passiveItems array
  {
    id: 'wisdom-nectar',
    name: 'Wisdom Nectar',
    type: 'passive',
    description: 'Doubles XP gain for all training.',
    applyOnLoad: true,
    applyOnPrestige: true,
    effect: () => {
      const trainingStore = useTrainingStore()
      trainingStore.xpMultiplier *= 2
      return true
    },
    onRemove: () => {
      const trainingStore = useTrainingStore()
      trainingStore.xpMultiplier /= 2
    },
    rarity: 'legendary',
  },
]
