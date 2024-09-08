import {defineStore} from 'pinia'
import {useAdventureStore} from './adventureStore'
import {useInventoryStore} from './inventoryStore'
import firebase from 'firebase/compat'
import {getAuth, signInAnonymously} from 'firebase/auth'
import {db} from '../firebase'
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {useToast} from 'vue-toast-notification'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    loaded: false,
    loggedIn: false,
    larvae: 0,
    ants: 0,
    antsFromPrestigeShop: 0,
    seeds: 10,
    queens: 1, // Initial queen
    lastSavedTime: Date.now(),

    // Resource caps
    maxSeeds: 1000, // Initial seed storage capacity
    maxLarvae: 10, // Initial larvae storage capacity

    // Initial resource caps
    initialMaxSeeds: 1000,
    initialMaxLarvae: 10,

    // Upgrade variables
    seedStorageUpgradeCost: 500, // Initial cost to upgrade seed storage
    larvaeStorageUpgradeCost: 100, // Initial cost to upgrade larvae storage

    // Balancing factors
    storageUpgradeFactor: 1.2, // How much each upgrade increases storage by (20%)
    upgradeCostFactor: 1.3, // How much each upgrade increases the cost by (30%)

    // Production rates and costs
    larvaeProductionRate: 1, // Larvae produced per queen per minute
    collectionRatePerAnt: 60, // Seeds collected per ant per minute
    seedCostPerLarva: 100, // Cost in seeds to create one larva
    seedCostPerAnt: 50, // Cost in seeds to create one ant
    larvaCostPerAnt: 1, // Cost in larvae to create one ant
    antCostPerQueen: 100, // Ants required to buy one queen
    seedCostPerQueen: 250, // Seeds required to buy one queen

    prestigePoints: 0, // New prestige currency
    purchasedUpgrades: [], // List of purchased prestige upgrades

    // Prestige-related upgrades
    prestigeShop: [
      {
        id: 'autoLarvae',
        name: 'Auto Larvae Creation',
        description: 'Automatically create larvae based on seeds',
        cost: 25,
        oneTimePurchase: true,
        applyOnPrestige: true,
      },
      {
        id: 'autoAnts',
        name: 'Auto Ant Creation',
        description: 'Automatically create ants based on larvae and seeds',
        cost: 50,
        oneTimePurchase: true,
        applyOnPrestige: true,
      },
      {
        id: 'autoQueens',
        name: 'Auto Queen Creation',
        description: 'Automatically create queens based on ants and seeds',
        cost: 75,
        oneTimePurchase: true,
        applyOnPrestige: true,
      },
      {
        id: 'betterAnts',
        name: 'Stronger Ants',
        description: 'Increase ant strength by 10%',
        cost: 100,
        applyOnPrestige: false,
      },
      {
        id: 'startWithAnts',
        name: 'Start with Ants',
        description: 'Start the game with ants!',
        cost: 50,
        applyOnPrestige: true,
      },
      {
        id: 'storageUpgrade',
        name: 'Storage Upgrade',
        description: 'Increase max storage by 20%',
        cost: 10,
      },
      {
        id: 'productionBoost',
        name: 'Production Boost',
        description: 'Increase production speed by 20%',
        cost: 15,
      },
      {
        id: 'queenEfficiency',
        name: 'Queen Efficiency',
        description: 'Queens produce 50% more larvae',
        cost: 20,
      },
    ],

    // Prestige-related variables
    autoLarvaeCreation: false, // Auto-create larvae based on seeds
    autoAntCreation: false, // Auto-create ants based on larvae and seeds
    autoQueenCreation: false, // Auto-create queens based on ants and seeds

    // Adventure-related variables
    attackPerAnt: 2, // Attack value per ant
    healthPerAnt: 10, // Health value per ant
    defensePerAnt: 1, // Defense value per ant

    gameLoopInterval: null as number | null,
    isGameLoopRunning: false,
  }),

  getters: {
    // Calculate larvae production per minute based on queens
    larvaePerMinute: (state) => state.queens * state.larvaeProductionRate,
    // Calculate larvae production per second for real-time updates
    larvaePerSecond: (state) => (state.queens * state.larvaeProductionRate) / 60,
    // Calculate seed production per second based on ants
    seedsPerSecond: (state) => (state.collectionRatePerAnt * state.ants) / 60,
    upgradePurchased: (state) => (upgradeId: string) => state.purchasedUpgrades.includes(upgradeId),
    amountOfUpgrade: (state) => (upgradeId: string) => state.purchasedUpgrades.filter(id => id === upgradeId).length,
  },

  actions: {
    // Function to create larvae using seeds, respecting the larvae cap
    createLarvae() {
      if (this.seeds >= this.seedCostPerLarva && this.larvae < this.maxLarvae) {
        this.larvae += 1
        this.seeds -= this.seedCostPerLarva
      } else {
        console.log('Not enough seeds to create larvae or larvae cap reached.')
      }
    },

    calculatePrestigePoints() {
      // Logarithmic scale for seeds with a minimum reward
      let pointsFromSeeds = Math.max(Math.floor(Math.log10(this.seeds + 1) / 2), 1) // Slow down seed contribution by dividing log result by 2
      if (pointsFromSeeds === 1) pointsFromSeeds = 0 // Minimum 1 point from seeds
      // Increase ant threshold to reward 1 point per 200 ants instead of 50 or 100
      const pointsFromAnts = Math.floor((this.ants - this.antsFromPrestigeShop) / 200) // 1 point per 200 ants

      // Increase queen contribution to 10 points per queen after the first one
      const pointsFromQueens = Math.max((this.queens - 1) * 2, 0) // 2 points per extra queen after the first

      // Combine all points together
      return pointsFromSeeds + pointsFromAnts + pointsFromQueens
    },

    // Function to handle prestige/reset
    async prestige() {
      try {
        const userId = await this.getUserId()
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

        // Reset the game state for prestige without deleting the Firestore doc
        this.resetLocalGameState({ isDebug: false })

        await this.resetOtherStores(false)

        // Save the updated state to Firestore
        await this.saveGameState()
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
        this.prestigeShop.find(u => u.id === upgradeId).cost *= 1.5 // Increase cost by 50%
        this.purchasedUpgrades.push(upgradeId)
        this.applyPrestigeUpgrade(upgradeId)
        console.log(`Purchased upgrade: ${upgrade.name}`)
      } else {
        console.log('Not enough prestige points or invalid upgrade.')
      }
    },

    // Apply a purchased upgrade
    applyPrestigeUpgrade(upgradeId, fromPrestige = false) {
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
          this.maxSeeds *= 1.2 // Increase seed storage
          this.maxLarvae *= 1.2 // Increase larvae storage
        },
        productionBoost: () => {
          this.larvaeProductionRate *= 1.2
          this.collectionRatePerAnt *= 1.2
        },
        queenEfficiency: () => {
          this.larvaeProductionRate *= 1.5
        },
        autoLarvae: () => {
          this.autoLarvaeCreation = true
        },
        betterAnts: () => {
          this.attackPerAnt *= 1.1
          this.setupAdventureStats()
        },
        autoAnts: () => {
          this.autoAntCreation = true
        },
        autoQueens: () => {
          this.autoQueenCreation = true
        },
        startWithAnts: () => {
          this.ants += 1
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

    // Create max larvae based on available seeds and larvae cap
    createMaxLarvae() {
      const maxLarvaeToCreate = Math.min(Math.floor(this.seeds / this.seedCostPerLarva), this.maxLarvae - this.larvae)
      if (maxLarvaeToCreate > 0) {
        this.larvae += maxLarvaeToCreate
        this.seeds -= maxLarvaeToCreate * this.seedCostPerLarva
      }
    },

    // Function to create ants using larvae and seeds
    createAnts() {
      if (this.larvae >= this.larvaCostPerAnt && this.seeds >= this.seedCostPerAnt) {
        this.ants += 1
        this.larvae -= this.larvaCostPerAnt
        this.seeds -= this.seedCostPerAnt
      } else {
        console.log('Not enough larvae or seeds to create an ant.')
      }
    },

    // Create max ants based on available larvae and seeds
    createMaxAnts() {
      const maxAntsByLarvae = this.larvae
      const maxAntsBySeeds = Math.floor(this.seeds / this.seedCostPerAnt)
      const maxAntsToCreate = Math.min(maxAntsByLarvae, maxAntsBySeeds)
      if (maxAntsToCreate > 0) {
        this.larvae -= maxAntsToCreate * this.larvaCostPerAnt
        this.seeds -= maxAntsToCreate * this.seedCostPerAnt
        this.ants += maxAntsToCreate
      }
    },

    // Function to buy more queens
    buyQueen() {
      if (this.ants >= this.antCostPerQueen && this.seeds >= this.seedCostPerQueen) {
        this.queens += 1
        this.ants -= this.antCostPerQueen
        this.seeds -= this.seedCostPerQueen
      } else {
        console.log('Not enough ants or seeds to buy a queen.')
      }
    },

    // Buy max queens based on available ants and seeds
    buyMaxQueens() {
      const maxQueensByAnts = Math.floor(this.ants / this.antCostPerQueen)
      const maxQueensBySeeds = Math.floor(this.seeds / this.seedCostPerQueen)
      const maxQueensToBuy = Math.min(maxQueensByAnts, maxQueensBySeeds)
      if (maxQueensToBuy > 0) {
        this.ants -= maxQueensToBuy * this.antCostPerQueen
        this.seeds -= maxQueensToBuy * this.seedCostPerQueen
        this.queens += maxQueensToBuy
      }
    },

    // Collect seeds manually, but respect the seed cap
    collectSeedsManually(amount = 1) {
      const manualSeedCollectionRate = 10 // Number of seeds collected per click
      const seedsToAdd = Math.min(manualSeedCollectionRate, this.maxSeeds - this.seeds)
      if (amount > 0 && this.seeds + seedsToAdd <= this.maxSeeds) {
        this.seeds += amount
        return
      }

      this.seeds += seedsToAdd
    },

    // Function to upgrade seed storage
    upgradeSeedStorage() {
      if (this.seeds >= this.seedStorageUpgradeCost) {
        this.seeds -= this.seedStorageUpgradeCost

        // Increase storage by 20% of the current max
        this.maxSeeds = Math.floor(this.maxSeeds * this.storageUpgradeFactor)

        // Increase the upgrade cost by 30%
        this.seedStorageUpgradeCost = Math.floor(this.seedStorageUpgradeCost * this.upgradeCostFactor)
      } else {
        console.log('Not enough seeds to upgrade seed storage.')
      }
    },

    // Function to upgrade larvae storage
    upgradeLarvaeStorage() {
      if (this.seeds >= this.larvaeStorageUpgradeCost) {
        this.seeds -= this.larvaeStorageUpgradeCost

        // Increase storage by 20% of the current max
        this.maxLarvae = Math.floor(this.maxLarvae * this.storageUpgradeFactor)

        // Increase the upgrade cost by 30%
        this.larvaeStorageUpgradeCost = Math.floor(this.larvaeStorageUpgradeCost * this.upgradeCostFactor)
      } else {
        console.log('Not enough seeds to upgrade larvae storage.')
      }
    },
    calculateOfflineProgress() {
      return new Promise((resolve, reject) => {
        try {
          const currentTime = Date.now()
          const timeElapsed = (currentTime - this.lastSavedTime) / 1000 // Total offline time in seconds

          let remainingTime = timeElapsed
          const tickDuration = 1 // Simulate in 1-second chunks of offline time
          let offlineTimeAccumulator = 0 // Track offline time for auto-actions

          const simulateOffline = () => {
            if (remainingTime <= 0) {
              // All offline progress has been simulated, resolve the promise
              this.lastSavedTime = currentTime
              resolve()
              return
            }

            const deltaTime = Math.min(tickDuration, remainingTime) // Simulate in 1-second chunks or the remaining time

            // Update resources with the current max storage limits for the elapsed time
            this.updateResources(deltaTime)

            // Accumulate the offline time since last auto action
            offlineTimeAccumulator += deltaTime

            // Call the createMax functions once for every 1 second of simulated offline time
            if (offlineTimeAccumulator >= 1) {
              if (this.autoLarvaeCreation) this.createMaxLarvae()
              if (this.autoAntCreation) this.createMaxAnts()
              if (this.autoQueenCreation) this.buyMaxQueens()

              // Reduce the accumulator by 1 second after triggering the auto actions
              offlineTimeAccumulator -= 1
            }

            // Reduce remaining time by the tick duration
            remainingTime -= tickDuration

            // Continue simulating in the next event loop cycle
            setTimeout(simulateOffline, 0) // Allows for async behavior
          }

          // Start the simulation
          simulateOffline()
        } catch (error) {
          // Reject the promise if an error occurs
          reject(error)
        }
      })
    },

    // Start the game loop for real-time resource generation, respecting caps
    // Start the game loop for real-time resource generation, respecting caps
    startGameLoop() {
      if (this.isGameLoopRunning) {
        return // Prevent multiple loops from being started
      }

      this.isGameLoopRunning = true
      let lastFrameTime = performance.now()
      let timeAccumulator = 0
      let lastAutoCreationTime = 0 // Time tracking for throttling auto creations
      const autoCreationInterval = 1 // Only allow auto-creation every second

      const gameLoop = (currentTime) => {
        const deltaTime = (currentTime - lastFrameTime) / 1000 // Time in seconds
        const updateInterval = 1 / 30 // Target update rate (e.g., 30 FPS)

        timeAccumulator += deltaTime

        if (timeAccumulator >= updateInterval) {
          this.updateResources(updateInterval) // Update resources based on the target update rate

          // Throttle auto-creations to once per second
          if (currentTime - lastAutoCreationTime >= autoCreationInterval * 1000) {
            this.handleAutoCreations()
            lastAutoCreationTime = currentTime // Reset the auto-creation throttle timer
          }

          // Reset the time accumulator, subtracting the update interval to handle any leftover time
          timeAccumulator -= updateInterval
        }

        lastFrameTime = currentTime

        if (this.isGameLoopRunning) {
          requestAnimationFrame(gameLoop)
        }
      }

      requestAnimationFrame(gameLoop)
    },

    updateResources(deltaTime) {
      this.larvae = Math.min(this.larvae + this.larvaeProductionRate * this.queens * deltaTime / 60, this.maxLarvae)
      this.seeds = Math.min(this.seeds + this.collectionRatePerAnt * this.ants * deltaTime / 60, this.maxSeeds)
    },

    handleAutoCreations() {
      if (this.autoLarvaeCreation) this.createMaxLarvae()
      if (this.autoAntCreation) this.createMaxAnts()
      if (this.autoQueenCreation) this.buyMaxQueens()
    },

    stopGameLoop() {
      if (this.gameLoopInterval) {
        cancelAnimationFrame(this.gameLoopInterval)
        this.gameLoopInterval = null // Reset the loop interval
        this.isGameLoopRunning = false
      }
    },

    // Get the user ID from the authentication service
    async getUserId(): Promise<string | null> {
      const auth = firebase.auth()
      const user = auth.currentUser
      if (user) {
        this.loggedIn = true
        return user.uid
      } else {
        console.error('User not found')
        return null
      }
    },

    async loginUsingGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().useDeviceLanguage()
      firebase.auth()
        .signInWithPopup(provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = result.credential as firebase.auth.OAuthCredential
          const token = credential.accessToken
          // The signed-in user info.
          const user = result.user
          console.log('Logged in as:', user?.displayName)


          console.log('Trying to get user ID...')

          const userId = await this.getUserId()
          if (!userId) {
            console.error('User ID not found')
            return
          }

          this.loggedIn = true

          await this.loadGameState()
        }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.error('Error signing in:', errorCode, errorMessage)
      })
    },

    loginAsGuest() {
      signInAnonymously(getAuth()).then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = result.credential as firebase.auth.OAuthCredential
        // The signed-in user info.
        const user = result.user
        console.log('Logged in as:', user?.uid)

        console.log('Trying to get user ID...')

        const userId = await this.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        this.loggedIn = true

        await this.loadGameState()
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code
        const errorMessage = error.message
        console.error('Error signing in:', errorCode, errorMessage)
      })
    },

    async logout() {
      // We don't need to save for anonymous users
      if (firebase.auth().currentUser?.isAnonymous === false) {
        await this.saveGameState()
      }

      firebase.auth().signOut().then(() => {
        console.log('Logged out successfully')
        this.loggedIn = false
        this.stopGameLoop()
      }).catch((error) => {
        console.error('Error signing out:', error)
      })
    },

    async saveGameState() {
      try {
        const userId = await this.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        const gameState = this.getGameState(userId)

        await setDoc(doc(db, 'games', userId), gameState)

        console.log('Game state saved to Firestore')

        // Save other store states
        await this.saveOtherStoreStates()

        const $toast = useToast()
        $toast.success('Game saved successfully')
        this.lastSavedTime = Date.now()
      } catch (error) {
        console.error('Error saving game state to Firebase:', error)
        const $toast = useToast()
        $toast.error('Failed to save game state')
      }
    },

    getGameState(userId) {
      return {
        ants: this.ants,
        seeds: this.seeds,
        queens: this.queens,
        larvae: this.larvae,
        maxSeeds: this.maxSeeds,
        maxLarvae: this.maxLarvae,
        seedStorageUpgradeCost: this.seedStorageUpgradeCost,
        larvaeStorageUpgradeCost: this.larvaeStorageUpgradeCost,
        prestigePoints: this.prestigePoints,
        purchasedUpgrades: this.purchasedUpgrades,
        lastSavedTime: Date.now(),
        userId,

        storagePrestigeCost: this.prestigeShop.find(u => u.id === 'storageUpgrade')?.cost ?? 10,
        productionPrestigeCost: this.prestigeShop.find(u => u.id === 'productionBoost')?.cost ?? 15,
        queenPrestigeCost: this.prestigeShop.find(u => u.id === 'queenEfficiency')?.cost ?? 20,
        betterAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'betterAnts')?.cost ?? 100,
        startWithAntsPrestigeCost: this.prestigeShop.find(u => u.id === 'startWithAnts')?.cost ?? 50,

        attackPerAnt: this.attackPerAnt,
        healthPerAnt: this.healthPerAnt,
        defensePerAnt: this.defensePerAnt,

        autoLarvaeCreation: this.autoLarvaeCreation,
        autoAntCreation: this.autoAntCreation,
        autoQueenCreation: this.autoQueenCreation,

        larvaeProductionRate: this.larvaeProductionRate,
        collectionRatePerAnt: this.collectionRatePerAnt,
      }
    },

    async saveOtherStoreStates() {
      try {
        const inventoryStore = useInventoryStore()
        await inventoryStore.saveInventoryState()

        const adventureStore = useAdventureStore()
        await adventureStore.saveAdventureState()
      } catch (error) {
        console.error('Error saving other store states:', error)
      }
    },

    async loadGameState() {
      this.loaded = false
      try {
        const userId = await this.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        const docRef = doc(db, 'games', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          this.loadStateFromFirebase(docSnap.data())
          console.log('Game state loaded from Firestore')

          await this.loadOtherStoreStates()
        } else {
          console.log('No saved game state found in Firestore')
        }

        // Recalculate based on upgrades, apply offline progress
        await this.calculateOfflineProgress()
        this.setupAdventureStats()
        this.loaded = true
        console.log('Game state loaded successfully')
      } catch (error) {
        console.error('Error loading game state from Firestore:', error)
      }
    },

    loadStateFromFirebase(savedState) {
      this.ants = savedState.ants ?? this.ants
      this.seeds = savedState.seeds ?? this.seeds
      this.queens = savedState.queens ?? this.queens
      this.larvae = savedState.larvae ?? this.larvae
      this.maxSeeds = savedState.maxSeeds ?? this.maxSeeds
      this.maxLarvae = savedState.maxLarvae ?? this.maxLarvae
      this.seedStorageUpgradeCost = savedState.seedStorageUpgradeCost ?? this.seedStorageUpgradeCost
      this.larvaeStorageUpgradeCost = savedState.larvaeStorageUpgradeCost ?? this.larvaeStorageUpgradeCost
      this.prestigePoints = savedState.prestigePoints ?? this.prestigePoints
      this.purchasedUpgrades = savedState.purchasedUpgrades ?? this.purchasedUpgrades
      this.lastSavedTime = savedState.lastSavedTime ?? this.lastSavedTime

      this.autoLarvaeCreation = savedState.autoLarvaeCreation ?? this.autoLarvaeCreation
      this.autoAntCreation = savedState.autoAntCreation ?? this.autoAntCreation
      this.autoQueenCreation = savedState.autoQueenCreation ?? this.autoQueenCreation

      this.larvaeProductionRate = savedState.larvaeProductionRate ?? this.larvaeProductionRate
      this.collectionRatePerAnt = savedState.collectionRatePerAnt ?? this.collectionRatePerAnt

      // Load prestige shop costs
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = savedState.storagePrestigeCost
        if (shop.id === 'productionBoost') shop.cost = savedState.productionPrestigeCost
        if (shop.id === 'queenEfficiency') shop.cost = savedState.queenPrestigeCost
        if (shop.id === 'betterAnts') shop.cost = savedState.betterAntsPrestigeCost
        if (shop.id === 'startWithAnts') shop.cost = savedState.startWithAntsPrestigeCost
      })

      this.attackPerAnt = savedState.attackPerAnt ?? this.attackPerAnt
      this.healthPerAnt = savedState.healthPerAnt ?? this.healthPerAnt
      this.defensePerAnt = savedState.defensePerAnt ?? this.defensePerAnt
    },

    async loadOtherStoreStates() {
      try {
        const inventoryStore = useInventoryStore()
        await inventoryStore.loadInventoryState()

        const adventureStore = useAdventureStore()
        await adventureStore.loadAdventureState()
      } catch (error) {
        console.error('Error loading other store states:', error)
      }
    },

    async resetGameState(debug = false) {
      console.log('Resetting game state...')
      try {
        const userId = await this.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        // Clear the user's game state from Firestore
        await this.clearGameStateFromFirestore(userId)

        // Reset the local game state, including prestige points if in debug mode
        this.resetLocalGameState({ isDebug: debug })

        // Apply any prestige-based bonuses
        this.applyPrestigeUpgrades()

        // Reset other stores (adventure, inventory, etc.)
        await this.resetOtherStores(debug)

        // Save the reset state
        await this.saveGameState()
        console.log('Game reset and cleared from Firestore')
      } catch (error) {
        console.error('Error resetting game state:', error)
      }
    },

    // Clear Firestore document
    async clearGameStateFromFirestore(userId) {
      const docRef = doc(db, 'games', userId)
      await deleteDoc(docRef)
      console.log('Game state cleared from Firestore')
    },

    // Reset the local game state, optionally resetting prestige-related data and debug state
    resetLocalGameState({ isDebug }) {
      this.larvae = 0
      this.ants = 0
      this.seeds = 10
      this.queens = 1

      this.larvaeProductionRate = 1
      this.collectionRatePerAnt = 60

      this.maxSeeds = this.initialMaxSeeds
      this.maxLarvae = this.initialMaxLarvae

      this.seedStorageUpgradeCost = 500
      this.larvaeStorageUpgradeCost = 100

      this.lastSavedTime = Date.now()

      if (isDebug) {
        this.resetDebugState()
      }

      this.applyPrestigeUpgrades(true)

      // Reset auto-creation flags
      this.autoQueenCreation = false
      this.autoAntCreation = false
      this.autoLarvaeCreation = false
    },

    resetPrestigeShopCosts() {
      this.prestigeShop.forEach(shop => {
        if (shop.id === 'storageUpgrade') shop.cost = 10
        if (shop.id === 'productionBoost') shop.cost = 15
        if (shop.id === 'queenEfficiency') shop.cost = 20
        if (shop.id === 'autoLarvae') shop.cost = 25
        if (shop.id === 'betterAnts') shop.cost = 100
      })
    },

    resetDebugState() {
      this.prestigePoints = 0
      this.purchasedUpgrades = []

      this.healthPerAnt = 10
      this.attackPerAnt = 2
      this.defensePerAnt = 1

      this.resetPrestigeShopCosts()

      this.autoQueenCreation = false
      this.autoAntCreation = false
      this.autoLarvaeCreation = false
    },

    async resetOtherStores(debug) {
      if (debug) {
        // Reset inventory store
        const inventoryStore = useInventoryStore()
        await inventoryStore.resetInventoryState()
      }
      // Reset adventure store
      const adventureStore = useAdventureStore()
      await adventureStore.resetAdventureState()
      adventureStore.stopBattle()
    },

    setupAdventureStats() {
      const adventureStore = useAdventureStore()
      if (this.ants === 0) return
      adventureStore.armyMaxHealth = this.ants * this.healthPerAnt
      adventureStore.armyHealth = adventureStore.armyHealth ? Math.min(adventureStore.armyHealth, adventureStore.armyMaxHealth) : adventureStore.armyMaxHealth
      adventureStore.armyAttack = this.ants * this.attackPerAnt
      adventureStore.armyDefense = this.ants * this.defensePerAnt
    },


    formatNumber(num: number): string {
      num = Math.floor(num)

      // Use normal formatting for numbers below 1 million
      if (num < 100e6) {
        if (num < 1000) return num.toFixed(0)

        const suffixes = ['', 'K', 'M']
        const exponent = Math.floor(Math.log10(Math.abs(num)) / 3)
        const scaledNumber = num / Math.pow(1000, exponent)
        return scaledNumber.toFixed(2) + suffixes[exponent]
      }

      // Use E notation for numbers 1 million and above
      return num.toExponential(2)
    },
  },
})
