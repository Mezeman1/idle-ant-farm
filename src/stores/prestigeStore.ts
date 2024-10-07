import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useAdventureStore} from '@/stores/adventureStore'
import {useEvolveStore} from '@/stores/evolveStore'
import {toast} from 'vue3-toastify'

interface PrestigeShopItem {
  id: string
  name: string
  description: string
  cost: number
  oneTimePurchase?: boolean
  applyOnPrestige?: boolean
  category?: 'auto' | 'production' | 'storage' | 'combat' | 'expansion',
  unlockedWhen?: () => boolean // Function to determine if the upgrade is unlocked
  maxPurchases?: number // Maximum number of times the upgrade can be purchased
}

export const usePrestigeStore = defineStore('prestige', {
  state: () => ({
    prestigePoints: 0, // New prestige currency
    timesPrestiged: 0, // Number of times prestiged
    purchasedUpgrades: [] as Array<string>, // List of purchased prestige upgrades
    appliedUpgrades: [] as Array<string>, // List of applied prestige upgrades
    prestigeShop: [
      {
        id: 'autoAnts',
        name: 'Auto Ant Creation',
        description: 'Automatically create ants based on larvae and seeds',
        cost: 20,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoQueens',
        name: 'Auto Queen Creation',
        description: 'Automatically create queens based on ants and seeds',
        cost: 20,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoSeedStorageUpgrade',
        name: 'Auto Seed Storage Upgrade',
        description: 'Automatically upgrade seed storage',
        cost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoLarvaeStorageUpgrade',
        name: 'Auto Larvae Storage Upgrade',
        description: 'Automatically upgrade larvae storage',
        cost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoEliteAntsCreation',
        name: 'Auto Elite Ants Creation',
        description: 'Automatically create elite ants based on ants and seeds',
        cost: 100,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('eliteAnts')
        },
      },
      {
        id: 'betterAnts',
        name: 'Stronger Ants',
        description: 'Increase ants army strength by 10% (decreases with each purchase)',
        cost: 50,
        applyOnPrestige: true,
        category: 'combat',
      },
      {
        id: 'betterAntsDefense',
        name: 'Stronger Ants Defense',
        description: 'Increase ants army defense by 10% (decreases with each purchase)',
        cost: 50,
        applyOnPrestige: true,
        category: 'combat',
      },
      {
        id: 'poisonChance',
        name: 'Poison Chance',
        description: 'Increase the chance of poisoning enemies by 1%',
        cost: 100,
        applyOnPrestige: true,
        applyOnLoad: true,
        category: 'combat',
        maxPurchases: 100,
      },
      {
        id: 'poisonDamage',
        name: 'Poison Damage',
        description: 'Increase the damage of poison by 1%',
        cost: 100,
        applyOnPrestige: true,
        applyOnLoad: true,
        category: 'combat',
      },
      {
        id: 'poisonDuration',
        name: 'Poison Duration',
        description: 'Increase the duration of poison by 1s',
        cost: 300,
        applyOnPrestige: true,
        applyOnLoad: true,
        category: 'combat',
      },
      {
        id: 'startWithAnts',
        name: 'Start with Ants',
        description: 'Start the game with ants!',
        cost: 20,
        applyOnPrestige: true,
        category: 'expansion',
      },
      {
        id: 'eliteAnts',
        name: 'Elite Ants',
        description: 'Unlock elite ants',
        cost: 500,
        applyOnPrestige: true,
        oneTimePurchase: true,
        category: 'expansion',
        unlockedWhen: () => {
          return usePrestigeStore().timesPrestiged >= 5
        },
      },
      {
        id: 'storageUpgrade',
        name: 'Storage Upgrade',
        description: 'Increase the storage for seeds, larvae, ants, and queens',
        cost: 5,
        category: 'storage',
        applyOnPrestige: true,
      },
      {
        id: 'eliteAntsStoreUpgrade',
        name: 'Elite Ants Store Upgrade',
        description: 'Increase the amount of elite ants you can store by 1',
        cost: 100,
        applyOnPrestige: true,
        category: 'storage',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('eliteAnts')
        },
        maxPurchases: 3,
      },
      {
        id: 'productionBoost',
        name: 'Production Boost',
        description: 'Increase production speed by 10% (decreases with each purchase)',
        cost: 10,
        category: 'production',
      },
      {
        id: 'queenEfficiency',
        name: 'Queen Efficiency',
        description: 'Queens produce 50% more larvae (decreases with each purchase)',
        cost: 15,
        category: 'production',
      },
      {
        id: 'royalJelly',
        name: 'Royal Jelly',
        description: 'Queens will have a chance to produce royal jelly',
        cost: 1000,
        category: 'expansion',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().timesPrestiged >= 5
        },
      },
      {
        id: 'tunnels',
        name: 'Tunnels',
        description: 'Unlock the tunnel system for exploration',
        cost: 500,
        category: 'expansion',
        applyOnPrestige: true,
        oneTimePurchase: true,
      },
      {
        id: 'autoCreateHousing',
        name: 'Auto Create Housing',
        description: 'Automatically create housing for ants',
        cost: 20,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoAdventure',
        name: 'Auto Adventure Mode',
        description: 'Automatically send ants on adventures when available',
        cost: 50,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'jellyBoost',
        name: 'Royal Jelly Boost',
        description: 'Increase the chance of queens producing royal jelly by 1%',
        cost: 100,
        category: 'production',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('royalJelly')
        },
      },
      {
        id: 'prestigeMultiplier',
        name: 'Prestige Multiplier',
        description: 'Increase the benefits gained from prestiging by 10%',
        cost: 500,
        category: 'expansion',
        applyOnPrestige: true,
        unlockedWhen: () => {
          return usePrestigeStore().timesPrestiged >= 5
        },
      },
      {
        id: 'antHousingUpgrade',
        name: 'Ant Housing Upgrade',
        description: 'Increase the capacity of ant housing by 1',
        cost: 250,
        category: 'storage',
        applyOnPrestige: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('autoCreateHousing')
        },
      },
      {
        id: 'evolve',
        name: 'Evolve',
        description: 'Evolve to the next stage, this resets the game but gives you a new ant type, equipment and inventory is kept',
        cost: 10000,
        category: 'expansion',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return true
        },
      },
    ] as PrestigeShopItem[], // List of items in the prestige shop

    // Prestige-related variables
    autoLarvaeCreation: false, // Auto-create larvae based on seeds
    autoAntCreation: false, // Auto-create ants based on larvae and seeds
    autoEliteAntsCreation: false, // Auto-create elite ants based on ants and seeds
    autoQueenCreation: false, // Auto-create queens based on ants and seeds
    autoSeedStorageUpgrade: false, // Auto-upgrade seed storage
    autoLarvaeStorageUpgrade: false, // Auto-upgrade larvae storage
    autoCreateHousing: false, // Auto-create housing for ants
    autoAdventure: false, // Auto-send ants on adventures when available

    antsFromPrestigeShop: 0, // Ants from the prestige shop

    baseAntThreshold: 16,

    prestigeMultiplierNumber: 1.0,
  }),
  getters: {
    upgradePurchased: (state) => (upgradeId: string) => state.purchasedUpgrades.includes(upgradeId),
    amountOfUpgrade: (state) => (upgradeId: string) => state.appliedUpgrades.filter(id => id === upgradeId).length,
  },
  actions: {
    calculatePrestigePoints() {
      const resourcesStore = useResourcesStore()

      // Get current ants from the game store
      const ants = resourcesStore.resources.ants - this.antsFromPrestigeShop

      // Calculate prestige points using log1.01 scaling for ants
      return this.calculatePrestigePointsFor(ants, this.baseAntThreshold) * this.prestigeMultiplierNumber * this.prestigeEvolveMultiplier()
    },

    prestigeEvolveMultiplier() {
      const evolveStore = useEvolveStore()
      const current = evolveStore.currentEvolution

      if (current === 0) {
        return 1
      }

      // Modified logarithmic growth with a multiplier factor
      const growthFactor = 1.5
      const multiplier = (Math.log(current + 1) / Math.log(5) + 1) * growthFactor

      // Ensure the result is never less than 1
      return Math.max(multiplier, 1)
    },

    calculatePrestigePointsFor(currentResources: number, baseThreshold: number) {
      // Ensure resources are above the threshold to earn prestige points
      if (currentResources < baseThreshold) {
        return 0 // No prestige points if resources are below the threshold
      }

      const prestigePointUpper = (this.timesPrestiged * 0.2) + 1 // Scale points based on times prestiged

      // Calculate prestige points using log1.01 for faster scaling
      const points = Math.floor(Math.log2(currentResources / baseThreshold) * 12) * prestigePointUpper

      // Ensure points don’t drop below 0
      return points > 0 ? points : 0
    },

    // Function to handle prestige/reset
    async prestige() {
      const gameStore = useGameStore()
      try {
        const userId = await gameStore.getUserId()
        if (!userId) {
          return
        }

        // Calculate the earned prestige points
        const earnedPrestigePoints = this.calculatePrestigePoints()
        if (earnedPrestigePoints === 0) {
          return
        }

        // Add earned prestige points
        this.prestigePoints += earnedPrestigePoints
        this.timesPrestiged += 1

        // Reset the game state for prestige without deleting the Firestore doc
        await gameStore.resetLocalGameState({isDebug: false})

        // Save the updated state to Firestore
        await gameStore.saveGameState({
          force: true,
        }).then(() => {
            gameStore.loadGameState()
          })
      } catch (error) {
        console.error('Error during prestige:', error)
      }
    },
    getCostMultiplier(upgrade) {
      let defaultCostMultiplier = 1.2

      switch (upgrade.id) {
        case 'eliteAntsStoreUpgrade':
          defaultCostMultiplier = 3
          break
        case 'startWithAnts':
          defaultCostMultiplier = 1.3
          break
        case 'prestigeMultiplier':
          defaultCostMultiplier = 2
          break
        case 'antHousingUpgrade':
          defaultCostMultiplier = 2
          break
        case 'poisonChance':
        case 'poisonDamage':
          defaultCostMultiplier = 1.1
          break
        case 'poisonDuration':
          defaultCostMultiplier = 1.5
          break
      }
      return defaultCostMultiplier
    },
    buyUpgrade(upgradeId: string): boolean {
      const upgrade = this.prestigeShop.find(u => u.id === upgradeId)

      const amountOfUpgrade = this.amountOfUpgrade(upgradeId)
      if (upgrade && upgrade.maxPurchases && amountOfUpgrade >= upgrade.maxPurchases) {
        return false
      }

      if (upgrade && this.prestigePoints >= upgrade.cost) {
        this.prestigePoints -= upgrade.cost

        upgrade.cost *= this.getCostMultiplier(upgrade)
        upgrade.cost = Math.floor(upgrade.cost) // Round down to the nearest integer

        this.purchasedUpgrades.push(upgradeId)
        this.applyPrestigeUpgrade(upgradeId)
        return true
      }

      return false
    },
    // Buy max upgrades based on available prestige points
    buyMaxUpgrade(upgradeId: string): boolean {
      const upgrade = this.prestigeShop.find(u => u.id === upgradeId)
      if (!upgrade) {
        console.log('Invalid upgrade.')
        return false
      }

      // Keep buying the upgrade until you can't afford the next one
      while (this.prestigePoints >= upgrade.cost) {
        this.prestigePoints -= upgrade.cost
        if (upgrade.maxPurchases && this.amountOfUpgrade(upgradeId) >= upgrade.maxPurchases) {
          break
        }

        this.purchasedUpgrades.push(upgradeId)
        this.applyPrestigeUpgrade(upgradeId)

        // Increase the cost for the next purchase
        upgrade.cost *= this.getCostMultiplier(upgrade)
        upgrade.cost = Math.floor(upgrade.cost) // Round down to the nearest integer
      }

      console.log(`Purchased max upgrades for: ${upgrade.name}`)
      return true
    },
    // Apply a purchased upgrade
    applyPrestigeUpgrade(upgradeId, fromPrestige = false) {
      const gameStore = useGameStore()
      const evolveStore = useEvolveStore()
      const resourcesStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const prestigeInShop = this.prestigeShop.find(u => u.id === upgradeId)
      if (fromPrestige && prestigeInShop?.applyOnPrestige === false) {
        return
      }

      // Object map for handling upgrade logic
      const upgrades = {
        storageUpgrade: () => {
          resourcesStore.storage.maxSeeds += resourcesStore.initialCaps.maxSeeds // Increase seed storage
          resourcesStore.storage.maxLarvae += resourcesStore.initialCaps.maxLarvae // Increase larvae storage
          resourcesStore.storage.maxAnts += resourcesStore.initialCaps.maxAnts // Increase ant storage
          resourcesStore.storage.maxQueens += 1 // Increase queen storage
        },
        eliteAntsStoreUpgrade: () => {
          resourcesStore.storage.maxEliteAnts += 1 // Increase elite ant storage
        },
        productionBoost: () => {
          const prestigeScalingFactor = Math.log(this.amountOfUpgrade(upgradeId) + 1) / Math.log(5) + 1

          if (this.amountOfUpgrade(upgradeId) === 1) {
            resourcesStore.productionRates.collectionRateModifier *= 1.1

            return
          }

          resourcesStore.productionRates.collectionRateModifier *= 1 + (0.1 / prestigeScalingFactor)
        },
        queenEfficiency: () => {
          const prestigeScalingFactor = Math.log(this.amountOfUpgrade(upgradeId) + 1) / Math.log(3) + 1

          if (this.amountOfUpgrade(upgradeId) === 1) {
            resourcesStore.productionRates.larvaeProductionModifier *= 1.5

            return
          }

          resourcesStore.productionRates.larvaeProductionModifier *= 1 + (0.5 / prestigeScalingFactor)
        },
        autoLarvae: () => {
          // this.autoLarvaeCreation = true
        },
        autoEliteAntsCreation: () => {
          // this.autoEliteAntsCreation = true
        },
        betterAnts: () => {
          const prestigeScalingFactor = Math.log2(this.amountOfUpgrade(upgradeId) + 1) + 1
          if (this.amountOfUpgrade(upgradeId) === 1) {
            adventureStore.armyAttackModifier *= 1.1
            adventureStore.setupAdventureStats()

            return
          }

          adventureStore.armyAttackModifier *= 1 + (0.1 / prestigeScalingFactor)
          adventureStore.setupAdventureStats()
        },
        betterAntsDefense: () => {
          const prestigeScalingFactor = Math.log2(this.amountOfUpgrade(upgradeId) + 1) + 1
          if (this.amountOfUpgrade(upgradeId) === 1) {
            adventureStore.armyDefenseModifier *= 1.1
            adventureStore.setupAdventureStats()

            return
          }

          adventureStore.armyDefenseModifier *= 1 + (0.1 / prestigeScalingFactor)
          adventureStore.setupAdventureStats()
        },
        poisonChance: () => {
          adventureStore.poisonChance += 0.01
        },
        poisonDamage: () => {
          adventureStore.poisonDamage *= 1.01
        },
        poisonDuration: () => {
          adventureStore.poisonDuration += 1
        },
        autoAnts: () => {
          // this.autoAntCreation = true
        },
        autoQueens: () => {
          // this.autoQueenCreation = true
        },
        autoSeedStorageUpgrade: () => {
          // this.autoSeedStorageUpgrade = true
        },
        autoLarvaeStorageUpgrade: () => {
          // this.autoLarvaeStorageUpgrade = true
        },
        autoCreateHousing: () => {
          // this.autoCreateHousing = true
        },
        autoAdventure: () => {
          this.autoAdventure = true
        },
        startWithAnts: () => {
          resourcesStore.resources.ants += 1
          this.antsFromPrestigeShop += 1
        },
        eliteAnts: () => {
          gameStore.eliteAntsUnlocked = true
        },
        royalJelly: () => {
          gameStore.royalJellyUnlocked = true
        },
        jellyBoost: () => {
          resourcesStore.royalJellyCollectionModifier += 0.01
        },
        prestigeMultiplier: () => {
          this.prestigeMultiplierNumber += 0.1
        },
        antHousingUpgrade: () => {
          resourcesStore.antsPerHousing += 1
        },
        evolve: () => {
          evolveStore.evolve()
            .then(() => {
              toast.info('You have evolved to the next stage!', {
                position: toast.POSITION.TOP_CENTER,
              })
            })
        },
      }

      // Execute the appropriate upgrade or log an error if the upgrade ID is invalid
      if (upgrades[upgradeId]) {
        upgrades[upgradeId]()

        // Add the upgrade to the applied upgrades list
        this.appliedUpgrades.push(upgradeId)
      } else {
        console.log('Invalid upgrade ID:', upgradeId)
      }
    },


    // Apply purchased upgrades to the game
    applyPrestigeUpgrades(fromPrestige = false) {
      this.purchasedUpgrades.forEach(upgradeId => {
        this.applyPrestigeUpgrade(upgradeId, fromPrestige)
      })
    },

    getPrestigeState() {
      return {
        prestigePoints: this.prestigePoints,
        timesPrestiged: this.timesPrestiged,
        purchasedUpgrades: this.purchasedUpgrades,

        storagePrestigeCost: this.prestigeShop.find(u => u.id === 'storageUpgrade')?.cost ?? 5,
        eliteAntsStoreUpgradeCost: this.prestigeShop.find(u => u.id === 'eliteAntsStoreUpgrade')?.cost ?? 100,
        productionPrestigeCost: this.prestigeShop.find(u => u.id === 'productionBoost')?.cost ?? 10,
        queenPrestigeCost: this.prestigeShop.find(u => u.id === 'queenEfficiency')?.cost ?? 15,
        betterAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'betterAnts')?.cost ?? 50,
        betterAntsDefensePrestigeCost: this.prestigeShop.find(u => u.id === 'betterAntsDefense')?.cost ?? 50,
        startWithAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'startWithAnts')?.cost ?? 15,
        jellyBoostCost: this.prestigeShop.find(u => u.id === 'jellyBoost')?.cost ?? 100,
        prestigeMultiplierCost: this.prestigeShop.find(u => u.id === 'prestigeMultiplier')?.cost ?? 500,
        antHousingUpgradeCost: this.prestigeShop.find(u => u.id === 'antHousingUpgrade')?.cost ?? 50,
        poisonChanceCost: this.prestigeShop.find(u => u.id === 'poisonChance')?.cost ?? 100,
        poisonDamageCost: this.prestigeShop.find(u => u.id === 'poisonDamage')?.cost ?? 100,
        poisonDurationCost: this.prestigeShop.find(u => u.id === 'poisonDuration')?.cost ?? 300,

        autoLarvaeCreation: this.autoLarvaeCreation,
        autoAntCreation: this.autoAntCreation,
        autoEliteAntsCreation: this.autoEliteAntsCreation,
        autoQueenCreation: this.autoQueenCreation,
        autoSeedStorageUpgrade: this.autoSeedStorageUpgrade,
        autoLarvaeStorageUpgrade: this.autoLarvaeStorageUpgrade,
        autoCreateHousing: this.autoCreateHousing,
        autoAdventure: this.autoAdventure,
        eliteAntsUnlocked: this.upgradePurchased('eliteAnts'),
        royalJellyUnlocked: this.upgradePurchased('royalJelly'),
        jellyBoost: this.upgradePurchased('jellyBoost'),
        prestigeMultiplier: this.upgradePurchased('prestigeMultiplier'),
        antHousingUpgrade: this.upgradePurchased('antHousingUpgrade'),
      }
    },

    loadPrestigeState(savedState) {
      this.prestigePoints = savedState.prestigePoints ?? this.prestigePoints
      this.timesPrestiged = savedState.timesPrestiged ?? this.timesPrestiged
      this.purchasedUpgrades = savedState.purchasedUpgrades ?? this.purchasedUpgrades

      this.autoLarvaeCreation = savedState.autoLarvaeCreation ?? this.autoLarvaeCreation
      this.autoAntCreation = savedState.autoAntCreation ?? this.autoAntCreation
      this.autoQueenCreation = savedState.autoQueenCreation ?? this.autoQueenCreation
      this.autoSeedStorageUpgrade = savedState.autoSeedStorageUpgrade ?? this.autoSeedStorageUpgrade
      this.autoLarvaeStorageUpgrade = savedState.autoLarvaeStorageUpgrade ?? this.autoLarvaeStorageUpgrade
      this.autoCreateHousing = savedState.autoCreateHousing ?? this.autoCreateHousing
      this.autoAdventure = savedState.autoAdventure ?? this.autoAdventure
      this.autoEliteAntsCreation = savedState.autoEliteAntsCreation ?? this.autoEliteAntsCreation

      // Load prestige shop costs
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = savedState.storagePrestigeCost ?? 5
        if (shop.id === 'eliteAntsStoreUpgrade') shop.cost = savedState.eliteAntsStoreUpgradeCost ?? 100
        if (shop.id === 'productionBoost') shop.cost = savedState.productionPrestigeCost ?? 10
        if (shop.id === 'queenEfficiency') shop.cost = savedState.queenPrestigeCost ?? 15
        if (shop.id === 'betterAnts') shop.cost = savedState.betterAntsPrestigeCost ?? 50
        if (shop.id === 'betterAntsDefense') shop.cost = savedState.betterAntsDefensePrestigeCost ?? 50
        if (shop.id === 'startWithAnts') shop.cost = savedState.startWithAntsPrestigeCost ?? 15
        if (shop.id === 'jellyBoost') shop.cost = savedState.jellyBoostCost ?? 100
        if (shop.id === 'prestigeMultiplier') shop.cost = savedState.prestigeMultiplierCost ?? 500
        if (shop.id === 'antHousingUpgrade') shop.cost = savedState.antHousingUpgradeCost ?? 50
        if (shop.id === 'evolve') shop.cost = this.getEvolveCost()
        if (shop.id === 'poisonChance') shop.cost = savedState.poisonChanceCost ?? 100
        if (shop.id === 'poisonDamage') shop.cost = savedState.poisonDamageCost ?? 100
        if (shop.id === 'poisonDuration') shop.cost = savedState.poisonDurationCost ?? 300
      })

      this.applyPrestigeUpgrades()
    },

    getEvolveCost() {
      const evolveStore = useEvolveStore()
      const current = evolveStore.currentEvolution

      return Math.pow(10, current + 1) * 10000
    },

    resetPrestigeShopCosts() {
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = 5
        if (shop.id === 'eliteAntsStoreUpgrade') shop.cost = 100
        if (shop.id === 'productionBoost') shop.cost = 10
        if (shop.id === 'queenEfficiency') shop.cost = 15
        if (shop.id === 'autoLarvae') shop.cost = 10
        if (shop.id === 'betterAnts') shop.cost = 50
        if (shop.id === 'betterAntsDefense') shop.cost = 50
        if (shop.id === 'autoAnts') shop.cost = 20
        if (shop.id === 'autoQueens') shop.cost = 20
        if (shop.id === 'startWithAnts') shop.cost = 15
        if (shop.id === 'eliteAnts') shop.cost = 500
        if (shop.id === 'autoSeedStorageUpgrade') shop.cost = 10
        if (shop.id === 'autoLarvaeStorageUpgrade') shop.cost = 10
        if (shop.id === 'autoEliteAntsCreation') shop.cost = 100
        if (shop.id === 'royalJelly') shop.cost = 1000
        if (shop.id === 'tunnels') shop.cost = 500
        if (shop.id === 'autoCreateHousing') shop.cost = 20
        if (shop.id === 'autoAdventure') shop.cost = 50
        if (shop.id === 'jellyBoost') shop.cost = 100
        if (shop.id === 'prestigeMultiplier') shop.cost = 500
        if (shop.id === 'antHousingUpgrade') shop.cost = 50
        if (shop.id === 'evolve') shop.cost = this.getEvolveCost()
        if (shop.id === 'poisonChance') shop.cost = 100
        if (shop.id === 'poisonDamage') shop.cost = 100
        if (shop.id === 'poisonDuration') shop.cost = 300
      })
    },

    resetPrestigeState() {
      this.appliedUpgrades = []
    },
  },
})
