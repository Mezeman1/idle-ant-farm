import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'

export interface Item {
  id: string;
  name: string;
  type: 'consumable' | 'passive';
  description: string;
  effect: () => boolean;
  onRemove?: () => void;
  applyOnLoad?: boolean;
  applyOnPrestige?: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'; // New rarity field
  duration?: number;
}

export const itemRegistry: Item[] = [
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
    id: 'grasshopper-wing',
    name: 'Grasshopper Wing',
    type: 'consumable',
    description: 'Increases army regen by 1% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegen *= 1.01
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegen /= 1.01
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
    id: 'queen-crown',
    name: 'Queen’s Crown',
    type: 'passive',
    description: 'Increases queen larvae production by 100%. (Does not stack)',
    applyOnPrestige: true,
    effect: () => {
      const gameStore = useGameStore()
      gameStore.productionRates.larvaeProductionRate *= 2

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
    id: 'queen-stinger',
    name: 'Queen Stinger',
    type: 'passive',
    description: 'Increases army health regeneration by 100%. (Does not stack)',
    applyOnPrestige: true,
    applyOnLoad: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegen *= 2

      return true
    },
    rarity: 'rare',
  },
  {
    id: 'spider-silk',
    name: 'Spider Silk',
    type: 'passive',
    description: 'Increases army defense by 10%. (Does not stack)',
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
    id: 'butterfly-wing',
    name: 'Butterfly Wing',
    type: 'passive',
    description: 'Health regeneration increased by 50%. (Does not stack)',
    applyOnPrestige: true,
    applyOnLoad: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegen *= 1.50

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
  // New items for the expanded waves
  {
    id: 'mountain-ant-mandible',
    name: 'Mountain Ant Mandible',
    type: 'consumable',
    description: 'Heals the army by 250 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 250 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 250
      return true
    },
    rarity: 'rare',
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
    id: 'lava-ant-tooth',
    name: 'Lava Ant Tooth',
    type: 'consumable',
    description: 'Heals the army by 500 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 500 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 500
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'magma-carapace',
    name: 'Magma Carapace',
    type: 'passive',
    description: 'Increases army defense by 30%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.30

      return true
    },
    rarity: 'rare',
    applyOnLoad: true,
  },
  {
    id: 'scorpion-tail',
    name: 'Scorpion Tail',
    type: 'passive',
    description: 'Increases army attack by 20%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.20

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
    id: 'hellfire-ant-fang',
    name: 'Hellfire Ant Fang',
    type: 'consumable',
    description: 'Heals the army by 1000 points.',
    effect: () => {
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 1000 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 1000
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'demonic-carapace',
    name: 'Demonic Carapace',
    type: 'passive',
    description: 'Increases defense by 40%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.40

      return true
    },
    rarity: 'rare',
    applyOnLoad: true,
  },
  {
    id: 'infernal-tail',
    name: 'Infernal Tail',
    type: 'passive',
    description: 'Increases attack by 30%.',
    applyOnPrestige: true,
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.30

      return true
    },
    rarity: 'rare',
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
]
