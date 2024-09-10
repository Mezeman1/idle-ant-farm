import {defineStore} from 'pinia'
import {useAdventureStore} from './adventureStore'
import {useInventoryStore} from './inventoryStore'
import firebase from 'firebase/compat'
import {getAuth, signInAnonymously} from 'firebase/auth'
import {db} from '../firebase'
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {useToast} from 'vue-toast-notification'
import {usePrestigeStore} from './prestigeStore'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    loaded: false,
    loggedIn: false,
    larvae: 0,
    ants: 0,
    seeds: 10,
    queens: 1, // Initial queen
    lastSavedTime: Date.now(),

    // Resource caps
    maxSeeds: 1000, // Initial seed storage capacity
    maxLarvae: 10, // Initial larvae storage capacity
    maxAnts: 100, // Initial ant storage capacity
    maxQueens: 2, // Initial queen storage capacity

    // Initial resource caps
    initialMaxSeeds: 1000,
    initialMaxLarvae: 10,
    initialMaxAnts: 100,
    initialMaxQueens: 2,

    // Upgrade variables
    seedStorageUpgradeCost: 500, // Initial cost to upgrade seed storage
    larvaeStorageUpgradeCost: 100, // Initial cost to upgrade larvae storage

    // Balancing factors
    storageUpgradeFactor: 1.4, // How much each upgrade increases storage by (20%)
    upgradeCostFactor: 1.5, // How much each upgrade increases the cost by (30%)

    // Production rates and costs
    larvaeProductionRate: 1, // Larvae produced per queen per minute
    collectionRatePerAnt: 60, // Seeds collected per ant per minute
    seedCostPerLarva: 100, // Cost in seeds to create one larva
    seedCostPerAnt: 50, // Cost in seeds to create one ant
    larvaCostPerAnt: 1, // Cost in larvae to create one ant
    antCostPerQueen: 100, // Ants required to buy one queen
    seedCostPerQueen: 250, // Seeds required to buy one queen

    // Adventure-related variables
    attackPerAnt: 2, // Attack value per ant
    healthPerAnt: 10, // Health value per ant
    defensePerAnt: 1, // Defense value per ant

    gameLoopInterval: null as number | null,
    isGameLoopRunning: false,
    progress: 0, // Track progress for offline calculation
  }),

  getters: {
    // Calculate larvae production per minute based on queens
    larvaePerMinute: (state) => state.queens * state.larvaeProductionRate,
    // Calculate larvae production per second for real-time updates
    larvaePerSecond: (state) => (state.queens * state.larvaeProductionRate) / 60,
    // Calculate seed production per second based on ants
    seedsPerSecond: (state) => (state.collectionRatePerAnt * state.ants) / 60,
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
      if (this.larvae >= this.larvaCostPerAnt && this.seeds >= this.seedCostPerAnt && this.ants < this.maxAnts) {
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
      const maxAntsToCreate = Math.min(maxAntsByLarvae, maxAntsBySeeds, this.maxAnts - this.ants)

      if (maxAntsToCreate > 0) {
        this.larvae -= maxAntsToCreate * this.larvaCostPerAnt
        this.seeds -= maxAntsToCreate * this.seedCostPerAnt
        this.ants += maxAntsToCreate
      }
    },
    // Function to buy more queens
    buyQueen() {
      if (this.ants >= this.antCostPerQueen && this.seeds >= this.seedCostPerQueen && this.queens < this.maxQueens) {
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
      const maxQueensToBuy = Math.min(maxQueensByAnts, maxQueensBySeeds, this.maxQueens - this.queens)

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
          const prestigeStore = usePrestigeStore()

          // Always log lastSavedTime, currentTime, and the time difference
          console.log(`lastSavedTime: ${this.lastSavedTime}`)
          console.log(`currentTime: ${currentTime}`)
          console.log(`Time elapsed (offline): ${timeElapsed} seconds`)

          let remainingTime = timeElapsed
          const totalTime = timeElapsed // Store total offline time for progress calculation
          const chunkDuration = 60 // Simulate in larger chunks (e.g., 60 seconds)
          let offlineTimeAccumulator = 0 // Track offline time for auto-actions
          const logInterval = 600 // Log progress every 10 minutes for less spam

          const simulateOffline = () => {
            if (remainingTime <= 0) {
              // All offline progress has been simulated, resolve the promise
              this.lastSavedTime = currentTime
              this.progress = 100 // Set progress to 100% when done
              console.log('Offline progress simulation complete.')
              console.log(`New lastSavedTime: ${this.lastSavedTime}`)
              resolve()
              return
            }

            const deltaTime = Math.min(chunkDuration, remainingTime) // Simulate in larger chunks or remaining time
            this.updateResources(deltaTime)

            // Accumulate the offline time for auto actions
            offlineTimeAccumulator += deltaTime

            // Trigger auto-actions after accumulating sufficient time
            if (offlineTimeAccumulator >= 1) {
              this.handleAutoCreations()

              // Reset accumulator after triggering auto actions
              offlineTimeAccumulator = 0
            }

            // Reduce remaining time and update progress
            remainingTime -= deltaTime
            this.progress = Math.min(100, ((totalTime - remainingTime) / totalTime) * 100) // Update progress

            // Log progress every `logInterval` seconds to avoid spamming
            if (totalTime - remainingTime % logInterval === 0) {
              console.log(`Offline time remaining: ${remainingTime}s`)
              console.log(`Progress: ${this.progress}%`)
            }

            // Continue simulating in the next event loop cycle
            setTimeout(simulateOffline, 0) // Allows for async behavior
          }

          // Start the simulation
          simulateOffline()
        } catch (error) {
          console.error('Error during offline progress simulation:', error)
          // Reject the promise if an error occurs
          reject(error)
        }
      })
    },

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
      // Update larvae, but only if there are queens
      if (this.queens > 0) {
        this.larvae = Math.min(
          this.larvae + (this.larvaeProductionRate * this.queens * deltaTime) / 60,
          this.maxLarvae,
        )
      }

      // Update seeds, but only if there are ants
      if (this.ants > 0) {
        this.seeds = Math.min(
          this.seeds + (this.collectionRatePerAnt * this.ants * deltaTime) / 60,
          this.maxSeeds,
        )
      }
    },

    handleAutoCreations() {
      const prestigeStore = usePrestigeStore()

      const autoActions = [
        { enabled: prestigeStore.autoLarvaeCreation, action: this.createMaxLarvae },
        { enabled: prestigeStore.autoAntCreation, action: this.createMaxAnts },
        { enabled: prestigeStore.autoQueenCreation, action: this.buyMaxQueens },
        { enabled: prestigeStore.autoSeedStorageUpgrade, action: this.upgradeSeedStorage },
      ]

      autoActions.forEach(autoAction => {
        if (autoAction.enabled) {
          autoAction.action()
        }
      })
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
      console.log('Game state is being saved...')
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
      const prestigeStore = usePrestigeStore()
      return {
        ants: this.ants,
        seeds: this.seeds,
        queens: this.queens,
        larvae: this.larvae,
        maxSeeds: this.maxSeeds,
        maxLarvae: this.maxLarvae,
        maxAnts: this.maxAnts,
        maxQueens: this.maxQueens,
        seedStorageUpgradeCost: this.seedStorageUpgradeCost,
        larvaeStorageUpgradeCost: this.larvaeStorageUpgradeCost,
        lastSavedTime: Date.now(),
        userId,
        attackPerAnt: this.attackPerAnt,
        healthPerAnt: this.healthPerAnt,
        defensePerAnt: this.defensePerAnt,
        larvaeProductionRate: this.larvaeProductionRate,
        collectionRatePerAnt: this.collectionRatePerAnt,

        ...prestigeStore.getPrestigeState(),
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
        const adventureStore = useAdventureStore()
        await adventureStore.calculateOfflineProgress()

        if (adventureStore.isFighting) {
          adventureStore.startBattle()
        }

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
      this.maxAnts = savedState.maxAnts ?? this.maxAnts
      this.maxQueens = savedState.maxQueens ?? this.maxQueens
      this.seedStorageUpgradeCost = savedState.seedStorageUpgradeCost ?? this.seedStorageUpgradeCost
      this.larvaeStorageUpgradeCost = savedState.larvaeStorageUpgradeCost ?? this.larvaeStorageUpgradeCost
      this.lastSavedTime = savedState.lastSavedTime ?? this.lastSavedTime
      this.larvaeProductionRate = savedState.larvaeProductionRate ?? this.larvaeProductionRate
      this.collectionRatePerAnt = savedState.collectionRatePerAnt ?? this.collectionRatePerAnt
      this.attackPerAnt = savedState.attackPerAnt ?? this.attackPerAnt
      this.healthPerAnt = savedState.healthPerAnt ?? this.healthPerAnt
      this.defensePerAnt = savedState.defensePerAnt ?? this.defensePerAnt

      const prestigeStore = usePrestigeStore()
      prestigeStore.loadPrestigeState(savedState)
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
        this.resetLocalGameState({isDebug: debug})

        // Apply any prestige-based bonuses
        usePrestigeStore().applyPrestigeUpgrades()

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
    resetLocalGameState({isDebug}) {
      console.log('Resetting local game state...')
      this.larvae = 0
      this.ants = 0
      this.seeds = 10
      this.queens = 1

      this.larvaeProductionRate = 1
      this.collectionRatePerAnt = 60

      this.maxSeeds = this.initialMaxSeeds
      this.maxLarvae = this.initialMaxLarvae
      this.maxAnts = this.initialMaxAnts
      this.maxQueens = this.initialMaxQueens

      this.seedStorageUpgradeCost = 500
      this.larvaeStorageUpgradeCost = 100

      this.lastSavedTime = Date.now()

      if (isDebug) {
        this.resetDebugState()
      }

      const prestigeStore = usePrestigeStore()
      prestigeStore.applyPrestigeUpgrades(true)

      // Reset auto-creation flags
      prestigeStore.autoQueenCreation = false
      prestigeStore.autoAntCreation = false
      prestigeStore.autoLarvaeCreation = false
      prestigeStore.autoSeedStorageUpgrade = false
    },


    resetDebugState() {
      const prestigeStore = usePrestigeStore()
      prestigeStore.prestigePoints = 0
      prestigeStore.purchasedUpgrades = []

      this.healthPerAnt = 10
      this.attackPerAnt = 2
      this.defensePerAnt = 1

      prestigeStore.resetPrestigeShopCosts()

      prestigeStore.autoQueenCreation = false
      prestigeStore.autoAntCreation = false
      prestigeStore.autoLarvaeCreation = false
      prestigeStore.autoSeedStorageUpgrade = false
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
