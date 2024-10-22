// achievementStore.ts or gameStore.ts
import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {toast} from 'vue3-toastify'
import {useAdventureStore} from '@/stores/adventureStore'
import {useBossStore} from '@/stores/bossStore'
import {evolutions} from '@/types/evolutions'
import {setBonuses, SetName} from '@/types/items/itemRegistry'

export const useEvolveStore = defineStore({
  id: 'evolveStore',
  state: () => ({
    currentEvolution: 0,
    evolutions: evolutions,
  }),
  getters: {
    currentEvolutionData() {
      return this.evolutions[this.currentEvolution]
    },
  },
  actions: {
    getMaxItemLevel(set: SetName) {
      const currentEvolution = this.currentEvolution

      // Check if the set exists in setBonuses and has maxLevelsPerEvolution
      if (setBonuses[set] && setBonuses[set].maxLevelsPerEvolution) {
        const levels = setBonuses[set].maxLevelsPerEvolution

        // Find the maximum level for the current evolution
        const evolutionLevels = Object.keys(levels).map(Number).sort((a, b) => b - a) // Sort evolutions in descending order
        for (const evolution of evolutionLevels) {
          if (currentEvolution >= evolution) {
            return levels[evolution] // Return the max level for the current evolution
          }
        }
      }

      return 0 // Default value if no match is found
    },

    getMaxEvolutionsForSet(set: SetName) {
      if (set === 'Default') {
        return this.evolutions.length
      }
      
      if (setBonuses[set] && setBonuses[set].maxLevelsPerEvolution) {
        return Object.keys(setBonuses[set].maxLevelsPerEvolution).length
      }

      return 0
    },

    getCurrentEvolutionInRomanLetters(set: SetName) {
      const romanNumeralsMap: { [key: number]: string } = {
        1: 'I', 4: 'IV', 5: 'V', 9: 'IX',
        10: 'X', 40: 'XL', 50: 'L', 90: 'XC',
        100: 'C', 400: 'CD', 500: 'D', 900: 'CM',
        1000: 'M',
      }

      let evolution = this.currentEvolution + 1
      let roman = ''

      const maxEvolutions = this.getMaxEvolutionsForSet(set)

      // Cap the evolution value at the maxEvolutions limit
      if (evolution > maxEvolutions) {
        evolution = maxEvolutions
      }

      // Loop through the Roman numeral values, from largest to smallest
      const romanValues = Object.keys(romanNumeralsMap)
        .map(Number)
        .sort((a, b) => b - a) // Sort descending

      for (const value of romanValues) {
        while (evolution >= value) {
          roman += romanNumeralsMap[value]
          evolution -= value
        }
      }

      return roman || 'I'
    },
    getEvolveDescription(): string {
      let bossesToDefeat = 7 // Base number of bosses to defeat

      // Add 3 bosses for each evolution
      bossesToDefeat += this.currentEvolution * 3

      return `Defeat ${bossesToDefeat} bosses to evolve.`
    },
    canEvolve() {
      let bossesToDefeat = 7 // Base number of bosses to defeat

      // Add 3 bosses for each evolution
      bossesToDefeat += this.currentEvolution * 3

      return useBossStore().currentBoss >= bossesToDefeat
    },
    async evolve() {
      if (this.currentEvolution + 1 >= this.evolutions.length) {
        toast.info('You have reached the end of the evolutions.', {
          position: 'top',
          duration: 5000,
        })
        toast.info('Congratulations!', {
          position: 'top',
          duration: 5000,
        })
        toast.info('You have won the game (so far)!', {
          position: 'top',
          duration: 5000,
        })
        return
      }

      this.currentEvolution += 1

      const gameStore = useGameStore()
      await gameStore.resetLocalGameState({
        isEvolution: true,
      })

      toast.success(`You have evolved to ${this.currentEvolutionData.name}!`, {
        position: 'top',
        duration: 5000,
      })

      gameStore.saveGameState({
        force: true,
      }).then(() => {
        gameStore.loadGameState()
      })
    },
    async applyEvolution() {
      return new Promise<void>((resolve) => {
        const resourceStore = useResourcesStore()
        const gameStore = useGameStore()
        const adventureStore = useAdventureStore()
        const currentEvolution = this.currentEvolutionData

        this.applyProductionRates(currentEvolution.productionRates, resourceStore)
        this.applyResourceCosts(currentEvolution.resourceCosts, resourceStore)
        this.applyInitialCaps(currentEvolution.initialCaps, resourceStore)
        this.applyArmyAntsStats(currentEvolution.statsPerAnt, gameStore)
        this.applyBugModifiers(currentEvolution.bugModifiers, adventureStore)
        this.applyArmyModifiers(currentEvolution.armyModifiers, adventureStore)

        resolve()
      })
    },
    applyBugModifiers(bugModifiers, adventureStore) {
      if (!bugModifiers) {
        adventureStore.bugAttackModifier = 1
        adventureStore.bugDefenseModifier = 1
        adventureStore.bugMaxHealthModifier = 1
        adventureStore.bugRegenModifier = 1
        return
      }

      adventureStore.bugAttackModifier = bugModifiers.bugAttackModifier
      adventureStore.bugDefenseModifier = bugModifiers.bugDefenseModifier
      adventureStore.bugMaxHealthModifier = bugModifiers.bugMaxHealthModifier
      adventureStore.bugRegenModifier = bugModifiers.bugRegenModifier
    },

    applyArmyModifiers(armyModifiers, adventureStore) {
      if (!armyModifiers) {
        adventureStore.armyAttackModifier = 1
        adventureStore.armyDefenseModifier = 1
        adventureStore.armyMaxHealthModifier = 1
        adventureStore.armyRegenModifier = 1
        return
      }

      adventureStore.armyAttackModifier = armyModifiers.armyAttackModifier
      adventureStore.armyDefenseModifier = armyModifiers.armyDefenseModifier
      adventureStore.armyMaxHealthModifier = armyModifiers.armyMaxHealthModifier
      adventureStore.armyRegenModifier = armyModifiers.armyRegenModifier
    },

    applyArmyAntsStats(statsPerAnt, gameStore) {
      if (!statsPerAnt) {
        return
      }

      gameStore.attackPerAnt = statsPerAnt.attackPerAnt
      gameStore.healthPerAnt = statsPerAnt.healthPerAnt
      gameStore.defensePerAnt = statsPerAnt.defensePerAnt
    },

    applyProductionRates(productionRates, resourceStore) {
      resourceStore.productionRates.larvaeProductionRate = productionRates.larvaeProductionRate
      resourceStore.productionRates.collectionRatePerAnt = productionRates.collectionRatePerAnt
      resourceStore.productionRates.collectionRatePerWorker = productionRates.collectionRatePerWorker
      resourceStore.productionRates.collectionRateModifier = productionRates.collectionRateModifier
      resourceStore.productionRates.larvaeProductionModifier = productionRates.larvaeProductionModifier
    },

    applyResourceCosts(resourceCosts, resourceStore) {
      if (resourceCosts) {
        resourceStore.resourceCosts.seedCostPerLarva = resourceCosts.seedCostPerLarva
        resourceStore.resourceCosts.seedCostPerAnt = resourceCosts.seedCostPerAnt
        resourceStore.resourceCosts.seedCostPerEliteAnt = resourceCosts.seedCostPerEliteAnt
        resourceStore.resourceCosts.larvaCostPerAnt = resourceCosts.larvaCostPerAnt
        resourceStore.resourceCosts.larvaCostPerEliteAnt = resourceCosts.larvaCostPerEliteAnt
        resourceStore.resourceCosts.antCostPerQueen = resourceCosts.antCostPerQueen
        resourceStore.resourceCosts.seedCostPerQueen = resourceCosts.seedCostPerQueen
        resourceStore.resourceCosts.royalJellyCostPerUpgrade = resourceCosts.royalJellyCostPerUpgrade
      }
    },

    applyInitialCaps(initialCaps, resourceStore) {
      if (initialCaps) {
        resourceStore.initialCaps.maxSeeds = initialCaps.maxSeeds
        resourceStore.initialCaps.maxLarvae = initialCaps.maxLarvae
        resourceStore.initialCaps.maxAnts = initialCaps.maxAnts
        resourceStore.initialCaps.maxQueens = initialCaps.maxQueens
        resourceStore.initialCaps.maxEliteAnts = initialCaps.maxEliteAnts

        resourceStore.storage.maxSeeds = initialCaps.maxSeeds
        resourceStore.storage.maxLarvae = initialCaps.maxLarvae
        resourceStore.storage.maxAnts = initialCaps.maxAnts
        resourceStore.storage.maxQueens = initialCaps.maxQueens
        resourceStore.storage.maxEliteAnts = initialCaps.maxEliteAnts
      }
    },
    loadEvolveState(savedState: any) {
      this.currentEvolution = savedState.currentEvolution ?? 0

      this.applyEvolution()
    },
    getEvolveState() {
      return {
        currentEvolution: this.currentEvolution,
      }
    },
    resetEvolveState() {
      this.currentEvolution = 0
      this.applyEvolution()
    },
  },
})
