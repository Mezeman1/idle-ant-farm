import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useAdventureStore} from '@/stores/adventureStore'
import {useEvolveStore} from '@/stores/evolveStore'
import {toast} from 'vue3-toastify'
import {formatTime} from '@/utils'
import firebase from 'firebase/compat'
import functions = firebase.functions;
import {useAchievementStore} from '@/stores/achievementStore'

interface PrestigeShopItem {
  id: string
  name: string
  description: string
  cost: number
  initialCost: number
  oneTimePurchase?: boolean
  applyOnPrestige?: boolean
  category?: 'auto' | 'production' | 'storage' | 'combat' | 'expansion' | 'bosses' | 'adventure'
  unlockedWhen?: () => boolean // Function to determine if the upgrade is unlocked
  // Can be string or function
  unlockedWhenDescription?: string | (() => string) // Description of the unlock condition
  maxPurchases?: number // Maximum number of times the upgrade can be purchased
}

export const usePrestigeStore = defineStore('prestige', {
  state: () => ({
    prestigePoints: 0, // New prestige currency
    timesPrestiged: 0, // Number of times prestiged
    lastPrestige: Date.now(), // Timestamp of the last prestige
    purchasedUpgrades: [] as Array<string>, // List of purchased prestige upgrades
    appliedUpgrades: [] as Array<string>, // List of applied prestige upgrades
    prestigeShop: [
      {
        id: 'manualCollectionSpeed',
        name: 'Manual Collection Speed',
        description: 'Increase the speed of manual collection by 5%',
        cost: 20,
        initialCost: 20,
        applyOnPrestige: true,
        category: 'production',
      },
      {
        id: 'autoAnts',
        name: 'Auto Ant Creation',
        description: 'Automatically create ants based on larvae and seeds',
        cost: 20,
        initialCost: 20,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoQueens',
        name: 'Auto Queen Creation',
        description: 'Automatically create queens based on ants and seeds',
        cost: 20,
        initialCost: 20,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoSeedStorageUpgrade',
        name: 'Auto Seed Storage Upgrade',
        description: 'Automatically upgrade seed storage',
        cost: 10,
        initialCost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoLarvaeStorageUpgrade',
        name: 'Auto Larvae Storage Upgrade',
        description: 'Automatically upgrade larvae storage',
        cost: 10,
        initialCost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoEliteAntsCreation',
        name: 'Auto Elite Ants Creation',
        description: 'Automatically create elite ants based on ants and seeds',
        cost: 100,
        initialCost: 100,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('eliteAnts')
        },
        unlockedWhenDescription: 'Unlock the Elite Ants upgrade',
      },
      {
        id: 'betterAnts',
        name: 'Stronger Ants',
        description: 'Increase ants army strength by 10% (decreases with each purchase)',
        cost: 50,
        initialCost: 50,
        applyOnPrestige: true,
        category: 'combat',
      },
      {
        id: 'betterAntsDefense',
        name: 'Stronger Ants Defense',
        description: 'Increase ants army defense by 10% (decreases with each purchase)',
        cost: 50,
        initialCost: 50,
        applyOnPrestige: true,
        category: 'combat',
      },
      {
        id: 'poisonChance',
        name: 'Poison Chance',
        description: 'Increase the chance of poisoning enemies by 1%',
        cost: 100,
        initialCost: 100,
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
        initialCost: 100,
        applyOnPrestige: true,
        applyOnLoad: true,
        category: 'combat',
      },
      {
        id: 'poisonDuration',
        name: 'Poison Duration',
        description: 'Increase the duration of poison by 1s',
        cost: 300,
        initialCost: 300,
        applyOnPrestige: true,
        applyOnLoad: true,
        category: 'combat',
      },
      {
        id: 'startWithAnts',
        name: 'Start with Ants',
        description: 'Start the game with ants!',
        cost: 20,
        initialCost: 20,
        applyOnPrestige: true,
        category: 'expansion',
      },
      {
        id: 'eliteAnts',
        name: 'Elite Ants',
        description: 'Unlock elite ants',
        cost: 2500,
        initialCost: 2500,
        applyOnPrestige: true,
        oneTimePurchase: true,
        category: 'expansion',
      },
      {
        id: 'storageUpgrade',
        name: 'Storage Upgrade',
        description: 'Increase the storage for seeds, larvae, ants, and queens',
        cost: 20,
        initialCost: 20,
        category: 'storage',
        applyOnPrestige: true,
      },
      {
        id: 'eliteAntsStoreUpgrade',
        name: 'Elite Ants Store Upgrade',
        description: 'Increase the amount of elite ants you can store by 1',
        cost: 100,
        initialCost: 100,
        applyOnPrestige: true,
        category: 'storage',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('eliteAnts')
        },
        maxPurchases: 3,
        unlockedWhenDescription: 'Unlock the Elite Ants upgrade',
      },
      {
        id: 'productionBoost',
        name: 'Production Boost',
        description: 'Increase production speed by 1%',
        cost: 5,
        initialCost: 5,
        category: 'production',
      },
      {
        id: 'queenEfficiency',
        name: 'Queen Efficiency',
        description: 'Queens produce 5% more larvae (decreases with each purchase)',
        cost: 5,
        initialCost: 5,
        category: 'production',
      },
      {
        id: 'royalJelly',
        name: 'Royal Jelly',
        description: 'Queens will have a chance to produce royal jelly',
        cost: 2500,
        initialCost: 2500,
        category: 'expansion',
        applyOnPrestige: true,
        oneTimePurchase: true,
      },
      {
        id: 'autoCreateHousing',
        name: 'Auto Create Housing',
        description: 'Automatically create housing for ants',
        cost: 50,
        initialCost: 50,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'autoAdventure',
        name: 'Auto Adventure Mode',
        description: 'Automatically send ants on adventures when available',
        cost: 10,
        initialCost: 10,
        oneTimePurchase: true,
        applyOnPrestige: true,
        category: 'auto',
      },
      {
        id: 'jellyBoost',
        name: 'Royal Jelly Boost',
        description: 'Increase the chance of queens producing royal jelly by 1%',
        cost: 100,
        initialCost: 100,
        category: 'production',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('royalJelly')
        },
        unlockedWhenDescription: 'Unlock the Royal Jelly upgrade',
      },
      {
        id: 'prestigeMultiplier',
        name: 'Prestige Multiplier',
        description: 'Increase the benefits gained from prestiging by 10%',
        cost: 500,
        initialCost: 500,
        category: 'expansion',
        applyOnPrestige: true,
        maxPurchases: 5,
      },
      {
        id: 'antHousingUpgrade',
        name: 'Ant Housing Upgrade',
        description: 'Increase the capacity of ant housing by 1',
        cost: 250,
        initialCost: 250,
        category: 'storage',
        applyOnPrestige: true,
        maxPurchases: 4,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('autoCreateHousing')
        },
        unlockedWhenDescription: 'Unlock the Auto Create Housing upgrade',
      },
      {
        id: 'evolve',
        name: 'Evolve',
        description: 'Evolve to the next stage, this resets the game but gives you a new ant type, equipment and inventory is kept',
        cost: 10000,
        initialCost: 10000,
        category: 'expansion',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return useEvolveStore().canEvolve()
        },
        unlockedWhenDescription: () => useEvolveStore().getEvolveDescription(),
      },
      {
        id: 'adventureEnemySpawnModifier',
        name: 'Enemy Spawn Modifier',
        description: 'Decrease the time between enemy spawns by 1%',
        cost: 100,
        maxPurchases: 90,
        initialCost: 100,
        category: 'combat',
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('autoAdventure')
        },
        applyOnPrestige: true,
      },
      {
        id: 'leafcutterGrove',
        name: 'Leafcutter Grove',
        description: 'Unlock the leafcutter grove area for exploration',
        cost: 100,
        initialCost: 100,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
      },
      {
        id: 'mountains',
        name: 'Mountains',
        description: 'Unlock the mountain area for exploration',
        cost: 500,
        initialCost: 500,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('leafcutterGrove')
        },
        unlockedWhenDescription: 'Unlock the Leafcutter Grove upgrade',
      },
      {
        id: 'volcano',
        name: 'Volcano',
        description: 'Unlock the volcano area for exploration',
        cost: 1000,
        initialCost: 1000,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('mountains')
        },
        unlockedWhenDescription: 'Unlock the Mountains upgrade',
      },
      {
        id: 'underworld',
        name: 'Underworld',
        description: 'Unlock the underworld area for exploration',
        cost: 5000,
        initialCost: 5000,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('volcano')
        },
        unlockedWhenDescription: 'Unlock the Volcano upgrade',
      },
      {
        id: 'arcticTundra',
        name: 'Arctic Tundra',
        description: 'Unlock the arctic tundra area for exploration',
        cost: 10000,
        initialCost: 10000,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('underworld')
        },
        unlockedWhenDescription: 'Unlock the Underworld upgrade',
      },
      {
        id: 'abyssalDepths',
        name: 'Abyssal Depths',
        description: 'Unlock the abyssal depths area for exploration',
        cost: 20000,
        initialCost: 20000,
        category: 'adventure',
        applyOnPrestige: true,
        oneTimePurchase: true,
        unlockedWhen: () => {
          return usePrestigeStore().upgradePurchased('arcticTundra')
        },
        unlockedWhenDescription: 'Unlock the Arctic Tundra upgrade',
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

    baseAntThreshold: 15,

    prestigeMultiplierNumber: 1.0,
  }),
  getters: {
    upgradePurchased: (state) => (upgradeId: string) => state.purchasedUpgrades.includes(upgradeId),
    amountOfUpgrade: (state) => (upgradeId: string) => state.appliedUpgrades.filter(id => id === upgradeId).length,
    timeSinceLastPrestige: (state) => {
      return Date.now() - state.lastPrestige
    },
    canPrestige: (state) => {
      return state.calculatePrestigePoints() > 0 && state.timeSinceLastPrestige > 60000
    },
    prestigeShopCost: (state) => (upgradeId: string) => {
      const amountOfUpgrade = state.amountOfUpgrade(upgradeId)

      const upgrade = state.prestigeShop.find(u => u.id === upgradeId)

      if (!upgrade) {
        return 0
      }

      let cost = upgrade.initialCost
      for (let i = 0; i < amountOfUpgrade; i++) {
        cost *= state.getCostMultiplier(upgrade)
      }

      return Math.floor(cost)
    },
  },
  actions: {
    timeSinceLastPrestigeFormatted(){
      const timeSinceLastPrestige = Date.now() - this.lastPrestige
      if (timeSinceLastPrestige < 0) {
        return formatTime(0)
      }

      return formatTime(timeSinceLastPrestige)
    },
    calculatePrestigePoints() {
      const resourcesStore = useResourcesStore()

      // Get current ants from the game store
      const ants = resourcesStore.resources.ants - this.antsFromPrestigeShop

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

      const resourcesStore = useResourcesStore()
      const now = Date.now()
      const timeElapsed = this.lastPrestige ? (now - this.lastPrestige) / (1000 * 60) : 0
      let resourceFactor = 1

      if (resourcesStore.maxAnts < 10000) {
        resourceFactor = Math.floor(currentResources / baseThreshold)
      } else {
        // Adjust the resource factor for more linear scaling with minor diminishing returns
        resourceFactor = Math.floor((currentResources / baseThreshold) + Math.pow(currentResources / baseThreshold, 1.1))
      }

      // Time multiplier: grows as a percentage increase based on timeElapsed
      // Let's assume every 30 minutes gives you a 1% bonus (this can be adjusted)
      const timeMultiplier = Math.pow(1.025, timeElapsed / 15) // 1% bonus every 60 minutes

      // Calculate prestige points with time multiplier
      const points = Math.floor(resourceFactor * 5  * timeMultiplier)

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
        useAchievementStore().addToTotal('timesPrestiged', 1)
        this.lastPrestige = Date.now()

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
        case 'poisonChance':
        case 'poisonDamage':
          defaultCostMultiplier = 1.1
          break
        case 'startWithAnts':
          defaultCostMultiplier = 1.3
          break
        case 'poisonDuration':
        case 'adventureEnemySpawnModifier':
          defaultCostMultiplier = 1.5
          break
        case 'prestigeMultiplier':
        case 'antHousingUpgrade':
          defaultCostMultiplier = 2
          break
        case 'eliteAntsStoreUpgrade':
          defaultCostMultiplier = 3
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
        this.purchasedUpgrades.push(upgradeId)
        this.applyPrestigeUpgrade(upgradeId)
        upgrade.cost = this.prestigeShopCost(upgradeId)
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
        manualCollectionSpeed: () => {
          resourcesStore.manualCollectionMultiplier += 0.05
        },
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
            resourcesStore.productionRates.collectionRateModifier += 0.01
        },
        queenEfficiency: () => {
            resourcesStore.productionRates.larvaeProductionModifier += 0.05
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
            adventureStore.armyAttackModifier += 0.1
            adventureStore.setupAdventureStats()

            return
          }

          adventureStore.armyAttackModifier +=  (0.1 / prestigeScalingFactor)
          adventureStore.setupAdventureStats()
        },
        betterAntsDefense: () => {
          const prestigeScalingFactor = Math.log2(this.amountOfUpgrade(upgradeId) + 1) + 1
          if (this.amountOfUpgrade(upgradeId) === 1) {
            adventureStore.armyDefenseModifier += 0.1
            adventureStore.setupAdventureStats()

            return
          }

          adventureStore.armyDefenseModifier += (0.1 / prestigeScalingFactor)
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
        adventureEnemySpawnModifier: () => {
          adventureStore.spawnTimeModifier -= 0.01
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
        lastPrestige: this.lastPrestige ? this.lastPrestige : Date.now(),

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
      const adventureStore = useAdventureStore()
      adventureStore.armyAttackModifier = 1
      adventureStore.armyDefenseModifier = 1
      adventureStore.spawnTime = 2000
      adventureStore.spawnTimeModifier = 1

      this.lastPrestige = savedState.lastPrestige ? savedState.lastPrestige : Date.now()
      this.prestigePoints = savedState.prestigePoints ?? this.prestigePoints
      this.timesPrestiged = savedState.timesPrestiged ?? this.timesPrestiged
      this.purchasedUpgrades = savedState.purchasedUpgrades ?? this.purchasedUpgrades
      this.prestigeMultiplierNumber = 1

      this.autoLarvaeCreation = savedState.autoLarvaeCreation ?? this.autoLarvaeCreation
      this.autoAntCreation = savedState.autoAntCreation ?? this.autoAntCreation
      this.autoQueenCreation = savedState.autoQueenCreation ?? this.autoQueenCreation
      this.autoSeedStorageUpgrade = savedState.autoSeedStorageUpgrade ?? this.autoSeedStorageUpgrade
      this.autoLarvaeStorageUpgrade = savedState.autoLarvaeStorageUpgrade ?? this.autoLarvaeStorageUpgrade
      this.autoCreateHousing = savedState.autoCreateHousing ?? this.autoCreateHousing
      this.autoAdventure = savedState.autoAdventure ?? this.autoAdventure
      this.autoEliteAntsCreation = savedState.autoEliteAntsCreation ?? this.autoEliteAntsCreation

      // Load prestige shop costs
      this.applyPrestigeUpgrades()
      this.resetPrestigeShopCosts()
    },

    getEvolveCost() {
      const evolveStore = useEvolveStore()
      const current = evolveStore.currentEvolution
      const shop = this.prestigeShop.find(u => u.id === 'evolve')

      return Math.pow(10, current + 1) * this.prestigeShopCost(shop.id)
    },

    resetPrestigeShopCosts() {
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'evolve') shop.cost = this.getEvolveCost()
        else shop.cost = this.prestigeShopCost(shop.id)
      })
    },

    resetPrestigeState() {
      this.appliedUpgrades = []
    },
  },
})
