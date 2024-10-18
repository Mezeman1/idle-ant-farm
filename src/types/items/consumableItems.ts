import {useAdventureStore} from '@/stores/adventureStore'
import {Item} from '@/types/items/itemRegistry'

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
      adventureStore.armyRegenModifier += 0.01
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier -= 0.01
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
      adventureStore.armyAttackModifier += 0.10
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.10
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
      adventureStore.armyDefenseModifier += 0.10
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyD -= 0.10
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
      adventureStore.armyAttackModifier += 0.20

      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.20
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
      adventureStore.armyDefenseModifier += 0.20
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier -= 0.20
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
      adventureStore.armyAttackModifier += 0.20
      adventureStore.armyDefenseModifier += 0.20
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 0.20
      adventureStore.armyDefenseModifier -= 0.20
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
      adventureStore.armyDefenseModifier += 0.50
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier -= 0.50
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
      adventureStore.armyAttackModifier += 1
      adventureStore.armyDefenseModifier += 1
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 1
      adventureStore.armyDefenseModifier -= 1
    },
    duration: 30,
    rarity: 'epic',
  },
  {
    id: 'ice-beetle-shell',
    name: 'Ice Beetle Shell',
    type: 'consumable',
    description: 'Increases army defense by 50% for 2 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier += 0.50
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier -= 0.50
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
      adventureStore.armyDefenseModifier += 1
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyDefenseModifier -= 1
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
      adventureStore.armyRegenModifier += 1
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyRegenModifier -= 1
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
      adventureStore.armyAttackModifier += 1
      return true
    },
    onRemove: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier -= 1
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
