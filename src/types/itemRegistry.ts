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
    description: 'Increases queen larvae production by 100%. (Does not stack)',
    effect: () => {
      console.log('Increasing queen larvae production by 100%')
      const gameStore = useGameStore()
      gameStore.larvaeProductionRate *= 2 // Passive effect
    },
  },
  'spider-silk': {
    id: 'spider-silk',
    name: 'Spider Silk',
    type: 'passive',
    description: 'Increases army defense by 10%. (Does not stack)',
    effect: () => {
      console.log('Increasing army defense by 10%')
      const adventureStore = useAdventureStore()
      adventureStore.armyDefense *= 1.10 // Passive effect
    },
  },
  'centipede-leg': {
    id: 'centipede-leg',
    name: 'Centipede Leg',
    type: 'consumable',
    description: 'Heals the army by 50 points.',
    effect: () => {
      console.log('Healing army by 50 points')
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 50 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 50
      return true
    },
  },
  'moth-dust': {
    id: 'moth-dust',
    name: 'Moth Dust',
    type: 'consumable',
    description: 'Heals the army by 100 points.',
    effect: () => {
      console.log('Healing army by 100 points')
      const adventureStore = useAdventureStore()
      if (adventureStore.armyHealth + 100 > adventureStore.armyMaxHealth) {
        adventureStore.armyHealth = adventureStore.armyMaxHealth
        return false
      }
      adventureStore.armyHealth += 100
      return true
    },
  },
}
