import {useAdventureStore} from '@/stores/adventureStore'
import {Item} from '@/types/items/itemRegistry'

export const consumableItems: Item[] = [
  {
    id: 'grasshopper-leg',
    name: 'Grasshopper Leg',
    type: 'consumable',
    description: 'Heals the army by 5% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.05
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'common',
  },
  {
    id: 'termite-mandible',
    name: 'Termite Mandible',
    type: 'consumable',
    description: 'Heals the army by 7.5% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.075
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
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
    description: 'Heals the army by 10% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.10
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'uncommon',
  },
  {
    id: 'moth-dust',
    name: 'Moth Dust',
    type: 'consumable',
    description: 'Heals the army by 15% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.15
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'rare',
  },
  {
    id: 'butterfly-dust',
    name: 'Butterfly Dust',
    type: 'consumable',
    description: 'Heals the army by 20% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.20
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
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
    description: 'Heals the army by 30% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.30
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
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
    description: 'Heals the army by 40% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.40
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
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
    description: 'Heals the army by 50% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.50
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
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
    description: 'Heals the army by 75% of its maximum health.',
    effect: () => {
      const adventureStore = useAdventureStore()
      const healAmount = adventureStore.armyMaxHealth * 0.75
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth + healAmount, adventureStore.armyMaxHealth)
      return true
    },
    rarity: 'legendary',
  },
]
