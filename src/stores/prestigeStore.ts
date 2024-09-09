import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'


interface PrestigeShopItem {
  id: string
  name: string
  description: string
  cost: number
  oneTimePurchase?: boolean
  applyOnPrestige?: boolean
  category?: 'auto' | 'production' | 'storage' | 'combat' | 'expansion'
}

export const usePrestigeStore = defineStore('prestige', {
  state: () => ({
    prestigePoints: 0, // New prestige currency
    timesPrestiged: 0, // Number of times prestiged
    purchasedUpgrades: [], // List of purchased prestige upgrades
    prestigeShop: [
      {
        id: 'autoLarvae',
        name: 'Auto Larvae Creation',
        description: 'Automatically create larvae based on seeds',
        cost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
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
        id: 'betterAnts',
        name: 'Stronger Ants',
        description: 'Increase ant strength by 10%',
        cost: 50,
        applyOnPrestige: false,
        category: 'combat',
      },
      {
        id: 'startWithAnts',
        name: 'Start with Ants',
        description: 'Start the game with ants!',
        cost: 50,
        applyOnPrestige: true,
        category: 'expansion',
      },
      {
        id: 'storageUpgrade',
        name: 'Storage Upgrade',
        description: 'Increase seed and larvae storage by 20% <br> Increase ant storage by 100% and queen storage by 50%',
        cost: 5,
        category: 'storage',
      },
      {
        id: 'productionBoost',
        name: 'Production Boost',
        description: 'Increase production speed by 20%',
        cost: 10,
        category: 'production',
      },
      {
        id: 'queenEfficiency',
        name: 'Queen Efficiency',
        description: 'Queens produce 50% more larvae',
        cost: 15,
        category: 'production',
      },
    ] as PrestigeShopItem[], // List of items in the prestige shop

    // Prestige-related variables
    autoLarvaeCreation: false, // Auto-create larvae based on seeds
    autoAntCreation: false, // Auto-create ants based on larvae and seeds
    autoQueenCreation: false, // Auto-create queens based on ants and seeds
    autoSeedStorageUpgrade: false, // Auto-upgrade seed storage

    antsFromPrestigeShop: 0, // Ants from the prestige shop
  }),
  getters: {
    upgradePurchased: (state) => (upgradeId: string) => state.purchasedUpgrades.includes(upgradeId),
    amountOfUpgrade: (state) => (upgradeId: string) => state.purchasedUpgrades.filter(id => id === upgradeId).length,
  },
  actions: {
    calculatePrestigePoints() {
      // Logarithmic scale for seeds with a minimum reward
      const seedThreshold = 2000
      let pointsFromSeeds = 0
      const gameStore = useGameStore()

      if (gameStore.seeds >= seedThreshold) {
        const seedsOverThreshold = gameStore.seeds - seedThreshold
        pointsFromSeeds = Math.floor(Math.log10(seedsOverThreshold + 1) / 2) + 1
      }

      // Increase ant threshold to reward 1 point per 200 ants instead of 50 or 100
      const pointsFromAnts = Math.floor((gameStore.ants - this.antsFromPrestigeShop) / 50) // 1 point per 200 ants

      // Increase queen contribution to 10 points per queen after the first one
      const pointsFromQueens = Math.max((gameStore.queens - 1) * 2, 0) // 2 points per extra queen after the first

      // Combine all points together
      return pointsFromSeeds + pointsFromAnts + pointsFromQueens
    },
    // Function to handle prestige/reset
    async prestige() {
      const gameStore = useGameStore()
      try {
        const userId = await gameStore.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        // Calculate the earned prestige points
        const earnedPrestigePoints = this.calculatePrestigePoints()
        if (earnedPrestigePoints === 0) {
          console.log('Not enough resources to earn prestige points.')
          return
        }

        // Add earned prestige points
        this.prestigePoints += earnedPrestigePoints
        this.timesPrestiged += 1

        // Reset the game state for prestige without deleting the Firestore doc
        gameStore.resetLocalGameState({isDebug: false})

        await gameStore.resetOtherStores(false)

        // Save the updated state to Firestore
        await gameStore.saveGameState()
        console.log(`Prestige successful! You earned ${earnedPrestigePoints} prestige points.`)
      } catch (error) {
        console.error('Error during prestige:', error)
      }
    },
    // Buy an upgrade from the prestige shop
    buyUpgrade(upgradeId) {
      const upgrade = this.prestigeShop.find(u => u.id === upgradeId)

      if (upgrade && this.prestigePoints >= upgrade.cost) {
        this.prestigePoints -= upgrade.cost
        upgrade.cost *= 1.5 // Increase cost by 50%
        this.purchasedUpgrades.push(upgradeId)
        this.applyPrestigeUpgrade(upgradeId)
        console.log(`Purchased upgrade: ${upgrade.name}`)
      } else {
        console.log('Not enough prestige points or invalid upgrade.')
      }
    },
    // Apply a purchased upgrade
    applyPrestigeUpgrade(upgradeId, fromPrestige = false) {
      const gameStore = useGameStore()
      console.log('Try to apply upgrade:', upgradeId, fromPrestige)
      const prestigeInShop = this.prestigeShop.find(u => u.id === upgradeId)
      console.log('Prestige in shop:', prestigeInShop)
      if (fromPrestige && prestigeInShop?.applyOnPrestige === false) {
        console.log('Upgrade not applicable for prestige purchase:', upgradeId)
        return
      }

      console.log('Applying upgrade:', upgradeId)
      // Object map for handling upgrade logic
      const upgrades = {
        storageUpgrade: () => {
          gameStore.maxSeeds *= 1.2 // Increase seed storage
          gameStore.maxLarvae *= 1.2 // Increase larvae storage
          gameStore.maxAnts *= 2 // Increase ant storage
          gameStore.maxQueens *= 1.5 // Increase queen storage
        },
        productionBoost: () => {
          gameStore.larvaeProductionRate *= 1.2
          gameStore.collectionRatePerAnt *= 1.2
        },
        queenEfficiency: () => {
          gameStore.larvaeProductionRate *= 1.5
        },
        autoLarvae: () => {
          this.autoLarvaeCreation = true
        },
        betterAnts: () => {
          gameStore.attackPerAnt *= 1.1
          gameStore.setupAdventureStats()
        },
        autoAnts: () => {
          this.autoAntCreation = true
        },
        autoQueens: () => {
          this.autoQueenCreation = true
        },
        autoSeedStorageUpgrade: () => {
          this.autoSeedStorageUpgrade = true
        },
        startWithAnts: () => {
          gameStore.ants += 1
          this.antsFromPrestigeShop += 1
        },
      }

      // Execute the appropriate upgrade or log an error if the upgrade ID is invalid
      if (upgrades[upgradeId]) {
        upgrades[upgradeId]()
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
        purchasedUpgrades: this.purchasedUpgrades,

        storagePrestigeCost: this.prestigeShop.find(u => u.id === 'storageUpgrade')?.cost ?? 5,
        productionPrestigeCost: this.prestigeShop.find(u => u.id === 'productionBoost')?.cost ?? 10,
        queenPrestigeCost: this.prestigeShop.find(u => u.id === 'queenEfficiency')?.cost ?? 15,
        betterAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'betterAnts')?.cost ?? 50,
        startWithAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'startWithAnts')?.cost ?? 50,

        autoLarvaeCreation: this.autoLarvaeCreation,
        autoAntCreation: this.autoAntCreation,
        autoQueenCreation: this.autoQueenCreation,
        autoSeedStorageUpgrade: this.autoSeedStorageUpgrade,
      }
    },

    loadPrestigeState(savedState) {
      this.prestigePoints = savedState.prestigePoints ?? this.prestigePoints
      this.purchasedUpgrades = savedState.purchasedUpgrades ?? this.purchasedUpgrades

      this.autoLarvaeCreation = savedState.autoLarvaeCreation ?? this.autoLarvaeCreation
      this.autoAntCreation = savedState.autoAntCreation ?? this.autoAntCreation
      this.autoQueenCreation = savedState.autoQueenCreation ?? this.autoQueenCreation
      this.autoSeedStorageUpgrade = savedState.autoSeedStorageUpgrade ?? this.autoSeedStorageUpgrade

      // Load prestige shop costs
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = savedState.storagePrestigeCost
        if (shop.id === 'productionBoost') shop.cost = savedState.productionPrestigeCost
        if (shop.id === 'queenEfficiency') shop.cost = savedState.queenPrestigeCost
        if (shop.id === 'betterAnts') shop.cost = savedState.betterAntsPrestigeCost
        if (shop.id === 'startWithAnts') shop.cost = savedState.startWithAntsPrestigeCost
      })
    },

    resetPrestigeShopCosts() {
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = 5
        if (shop.id === 'productionBoost') shop.cost = 10
        if (shop.id === 'queenEfficiency') shop.cost = 15
        if (shop.id === 'autoLarvae') shop.cost = 10
        if (shop.id === 'betterAnts') shop.cost = 50
        if (shop.id === 'autoAnts') shop.cost = 20
        if (shop.id === 'autoQueens') shop.cost = 20
        if (shop.id === 'startWithAnts') shop.cost = 50
      })
    },


  },
})
