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
      console.log('Healing army by 20 points')
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
      console.log('Buffing army attack by 10% for 5 minutes')
      const adventureStore = useAdventureStore()
      adventureStore.armyAttack *= 1.10
      setTimeout(() => {
        console.log('Reverting army attack buff')
        adventureStore.armyAttack /= 1.10 // Revert the buff after 5 minutes
      }, 300000) // 5 minutes in milliseconds

      return true
    },
  },
  'queen-crown': {
    id: 'queen-crown',
    name: 'Queen’s Crown',
    type: 'passive',
    description: 'Increases queen larvae production by 100%.',
    effect: () => {
      console.log('Increasing queen larvae production by 100%')
      const gameStore = useGameStore()
      gameStore.larvaeProductionRate *= 2 // Passive effect
    },
  },
  // Add more items here...
}
