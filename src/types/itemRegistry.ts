// itemRegistry.ts
import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'

export const itemRegistry = {
  'grasshopper-leg': {
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
  },
  'ant-strength-potion': {
    id: 'ant-strength-potion',
    name: 'Ant Strength Potion',
    type: 'buff',
    description: 'Increases army attack by 10% for 5 minutes.',
    effect: () => {
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.10
      setTimeout(() => {
        adventureStore.armyAttack /= 1.10 // Revert the buff after 5 minutes
      }, 300000) // 5 minutes in milliseconds
    },
  },
  'queen-crown': {
    id: 'queen-crown',
    name: 'Queen’s Crown',
    type: 'passive',
    description: 'Increases queen larvae production by 10%.',
    effect: () => {
      const gameStore = useGameStore()
      gameStore.larvaeProductionRate *= 1.10 // Passive effect
    },
  },
  // Add more items here...
}
