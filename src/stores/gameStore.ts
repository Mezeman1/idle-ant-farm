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
    email: '',
    password: '',
    passwordConfirm: '',
    error: null,

    loaded: false,
    loggedIn: false,
    lastSavedTime: Date.now(),

    resources: {
      larvae: 0,
      ants: 0,
      eliteAnts: 0,
      seeds: 10,
      queens: 1,
      royalJelly: 0,

      // Evolved resources, bought using royal jelly
      royalJellyAnts: 0,
      workers: 0,
      soldiers: 0,
    },

    storage: {
      maxSeeds: 1000, // Initial seed storage capacity
      maxLarvae: 10, // Initial larvae storage capacity
      maxAnts: 100, // Initial ant storage capacity
      maxQueens: 2, // Initial queen storage capacity
      maxEliteAnts: 1,
    },

    initialCaps: {
      maxSeeds: 1000,
      maxLarvae: 10,
      maxAnts: 100,
      maxQueens: 2,
      maxEliteAnts: 1,
    },

    accumulators: {
      larvaeAccumulator: 0, // To accumulate fractional larvae production
      seedAccumulator: 0, // To accumulate fractional seed production
    },

    productionRates: {
      larvaeProductionRate: 1, // Larvae produced per queen per minute
      collectionRatePerAnt: 60, // Seeds collected per ant per minute

      collectionRatePerWorker: 6000, // Seeds collected per worker per minute
    },

    resourceCosts: {
      seedCostPerLarva: 100, // Cost in seeds to create one larva
      seedCostPerAnt: 50, // Cost in seeds to create one ant
      seedCostPerEliteAnt: 100,
      larvaCostPerAnt: 1, // Cost in larvae to create one ant
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 100, // Ants required to buy one queen
      seedCostPerQueen: 250, // Seeds required to buy one queen

      // Costs for evolved resources
      royalJellyCostPerUpgrade: 1,
    },

    upgradeCosts: {
      seedStorageUpgradeCost: 500, // Initial cost to upgrade seed storage
      larvaeStorageUpgradeCost: 100, // Initial cost to upgrade larvae storage
    },

    eliteAntsUnlocked: false,
    royalJellyUnlocked: false,

    royalJellyCollectionChance: 0.0001, // 0.1% chance to collect royal jelly when queen produces larvae

    // Balancing factors
    storageUpgradeFactor: 1.4, // How much each upgrade increases storage by (20%)
    upgradeCostFactor: 1.5, // How much each upgrade increases the cost by (30%)
    multiplierPerEliteAnt: 1.5,

    // Adventure-related variables
    attackPerAnt: 2, // Attack value per ant
    healthPerAnt: 10, // Health value per ant
    defensePerAnt: 1, // Defense value per ant

    gameLoopInterval: null as number | null,
    isGameLoopRunning: false,
    progress: 0, // Track progress for offline calculation
    simulatingOfflineProgress: false,
  }),

  getters: {
    // Calculate larvae production per minute based on queens
    larvaePerMinute: (state) => state.resources.queens * state.productionRates.larvaeProductionRate,
    // Calculate larvae production per second for real-time updates
    larvaePerSecond: (state) => (state.resources.queens * state.productionRates.larvaeProductionRate) / 60,
    // Calculate seed production per second based on ants
    seedsPerSecond: (state) => {
      const eliteMultiplier = state.resources.eliteAnts > 0 ? (state.resources.eliteAnts * state.multiplierPerEliteAnt) : 1
      const seedsFromAnts = (state.productionRates.collectionRatePerAnt * state.resources.ants * eliteMultiplier) / 60
      if (state.resources.workers > 0) {
        const seedsFromWorkers = (state.productionRates.collectionRatePerWorker * state.resources.workers * eliteMultiplier) / 60
        return seedsFromAnts + seedsFromWorkers
      }

      return seedsFromAnts
    },
  },

  actions: {
    upgradeAnt() {
      if (this.royalJellyUnlocked && this.resources.royalJelly >= this.resourceCosts.royalJellyCostPerUpgrade) {
        this.resources.royalJelly -= this.resourceCosts.royalJellyCostPerUpgrade
        this.resources.royalJellyAnts += 1
      }
    },
    upgradeAntTo(antType: 'workers' | 'soldiers') {
      if (this.resources.royalJellyAnts > 0) {
        this.resources.royalJellyAnts -= 1
        this.resources[antType] += 1
      }
    },
    downgradeAntFrom(antType: 'workers' | 'soldiers') {
      if (this.resources[antType] > 0) {
        this.resources[antType] -= 1
        this.resources.royalJellyAnts += 1
      }
    },
    // Function to create larvae using seeds, respecting the larvae cap
    createLarvae() {
      if (this.resources.seeds >= this.resourceCosts.seedCostPerLarva && this.resources.larvae < Math.floor(this.storage.maxLarvae)) {
        this.resources.larvae += 1
        this.resources.seeds -= this.resourceCosts.seedCostPerLarva
        return true
      }

      return false
    },
    // Create max larvae based on available seeds and larvae cap
    createMaxLarvae() {
      const availableLarvaeSpace = Math.floor(this.storage.maxLarvae) - this.resources.larvae
      const maxCreatableLarvae = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerLarva)

      // Calculate how many larvae can actually be created
      const larvaeToCreate = Math.min(availableLarvaeSpace, maxCreatableLarvae)

      // If there is space and enough seeds to create larvae
      if (larvaeToCreate > 0) {
        this.resources.larvae += larvaeToCreate
        this.resources.seeds -= larvaeToCreate * this.resourceCosts.seedCostPerLarva
      }
    },

    // Function to create ants using larvae and seeds
    createAnts() {
      if (this.resources.larvae >= this.resourceCosts.larvaCostPerAnt && this.resources.seeds >= this.resourceCosts.seedCostPerAnt && this.resources.ants < Math.floor(this.storage.maxAnts)) {
        this.resources.ants += 1
        this.resources.larvae -= this.resourceCosts.larvaCostPerAnt
        this.resources.seeds -= this.resourceCosts.seedCostPerAnt
        return true
      }

      return false
    },
    // Create max ants based on available larvae and seeds
    // Create max ants based on available larvae and seeds
    createMaxAnts() {
      const availableAntSpace = Math.floor(this.storage.maxAnts) - this.resources.ants
      const maxCreatableAntsByLarvae = Math.floor(this.resources.larvae / this.resourceCosts.larvaCostPerAnt)
      const maxCreatableAntsBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerAnt)

      // Calculate how many ants can actually be created based on both larvae and seeds
      const antsToCreate = Math.min(availableAntSpace, maxCreatableAntsByLarvae, maxCreatableAntsBySeeds)

      // If there is space and enough larvae and seeds to create ants
      if (antsToCreate > 0) {
        this.resources.ants += antsToCreate
        this.resources.larvae -= antsToCreate * this.resourceCosts.larvaCostPerAnt
        this.resources.seeds -= antsToCreate * this.resourceCosts.seedCostPerAnt
      }
    },
    // Function to create ants using larvae and seeds
    createEliteAnts() {
      if (this.resources.larvae >= this.resourceCosts.larvaCostPerEliteAnt && this.resources.seeds >= this.resourceCosts.seedCostPerEliteAnt && this.resources.eliteAnts < Math.floor(this.storage.maxEliteAnts)) {
        this.resources.eliteAnts += 1
        this.resources.larvae -= this.resourceCosts.larvaCostPerEliteAnt
        this.resources.seeds -= this.resourceCosts.seedCostPerEliteAnt
        return true
      }

      return false
    },
    // Create max ants based on available larvae and seeds
    // Create max elite ants based on available larvae and seeds
    createEliteMaxAnts() {
      const availableEliteAntSpace = Math.floor(this.storage.maxEliteAnts) - this.resources.eliteAnts
      const maxCreatableEliteAntsByLarvae = Math.floor(this.resources.larvae / this.resourceCosts.larvaCostPerEliteAnt)
      const maxCreatableEliteAntsBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerEliteAnt)

      // Calculate how many elite ants can actually be created based on both larvae and seeds
      const eliteAntsToCreate = Math.min(availableEliteAntSpace, maxCreatableEliteAntsByLarvae, maxCreatableEliteAntsBySeeds)

      // If there is space and enough larvae and seeds to create elite ants
      if (eliteAntsToCreate > 0) {
        this.resources.eliteAnts += eliteAntsToCreate
        this.resources.larvae -= eliteAntsToCreate * this.resourceCosts.larvaCostPerEliteAnt
        this.resources.seeds -= eliteAntsToCreate * this.resourceCosts.seedCostPerEliteAnt
      }
    },
    // Function to buy more queens
    buyQueen() {
      if (this.resources.ants >= this.resourceCosts.antCostPerQueen && this.resources.seeds >= this.resourceCosts.seedCostPerQueen && this.resources.queens < Math.floor(this.storage.maxQueens)) {
        this.resources.queens += 1
        this.resources.ants -= this.resourceCosts.antCostPerQueen
        this.resources.seeds -= this.resourceCosts.seedCostPerQueen
        return true
      }

      return false
    },
    // Buy max queens based on available ants and seeds
    // Buy max queens based on available ants and seeds
    buyMaxQueens() {
      const availableQueenSpace = Math.floor(this.storage.maxQueens) - this.resources.queens
      const maxPurchasableQueensByAnts = Math.floor(this.resources.ants / this.resourceCosts.antCostPerQueen)
      const maxPurchasableQueensBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerQueen)

      // Calculate how many queens can actually be bought based on both ants and seeds
      const queensToBuy = Math.min(availableQueenSpace, maxPurchasableQueensByAnts, maxPurchasableQueensBySeeds)

      // If there is space and enough ants and seeds to buy queens
      if (queensToBuy > 0) {
        this.resources.queens += queensToBuy
        this.resources.ants -= queensToBuy * this.resourceCosts.antCostPerQueen
        this.resources.seeds -= queensToBuy * this.resourceCosts.seedCostPerQueen
      }
    },
    // Collect seeds manually, but respect the seed cap
    collectSeedsManually(amount = 1) {
      const manualSeedCollectionRate = 10 // Number of seeds collected per click
      const seedsToAdd = Math.min(manualSeedCollectionRate, this.storage.maxSeeds - this.resources.seeds)
      if (amount > 0 && this.resources.seeds + seedsToAdd <= this.storage.maxSeeds) {
        this.resources.seeds += amount
        return
      }

      this.resources.seeds += seedsToAdd
    },
    // Function to upgrade seed storage
    upgradeSeedStorage() {
      if (this.resources.seeds >= this.upgradeCosts.seedStorageUpgradeCost) {
        this.resources.seeds -= this.upgradeCosts.seedStorageUpgradeCost

        // Increase storage by 20% of the current max
        this.storage.maxSeeds = Math.floor(this.storage.maxSeeds * this.storageUpgradeFactor)

        // Increase the upgrade cost by 30%
        this.upgradeCosts.seedStorageUpgradeCost = Math.floor(this.upgradeCosts.seedStorageUpgradeCost * this.upgradeCostFactor)
      }
    },
    upgradeMaxSeedStorage() {
      let affordableUpgrades = 0
      let totalCost = 0
      let nextUpgradeCost = this.upgradeCosts.seedStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds >= totalCost + nextUpgradeCost) {
        affordableUpgrades += 1
        totalCost += nextUpgradeCost
        nextUpgradeCost = Math.floor(nextUpgradeCost * this.upgradeCostFactor)
      }

      // If there are any affordable upgrades
      if (affordableUpgrades > 0) {
        // Deduct the total cost
        this.resources.seeds -= totalCost

        // Apply all upgrades at once
        this.storage.maxSeeds = Math.floor(this.storage.maxSeeds * Math.pow(this.storageUpgradeFactor, affordableUpgrades))

        // Update the upgrade cost
        this.upgradeCosts.seedStorageUpgradeCost = nextUpgradeCost

        console.log(`Upgraded seed storage ${affordableUpgrades} times.`)
      }
    },
    // Function to upgrade larvae storage
    upgradeLarvaeStorage() {
      if (this.resources.seeds >= this.upgradeCosts.larvaeStorageUpgradeCost) {
        this.resources.seeds -= this.upgradeCosts.larvaeStorageUpgradeCost

        // Increase storage by 20% of the current max
        this.storage.maxLarvae = Math.floor(this.storage.maxLarvae * this.storageUpgradeFactor)

        // Increase the upgrade cost by 30%
        this.upgradeCosts.larvaeStorageUpgradeCost = Math.floor(this.upgradeCosts.larvaeStorageUpgradeCost * this.upgradeCostFactor)
      }
    },
    upgradeMaxLarvaeStorage() {
      let affordableUpgrades = 0
      let totalCost = 0
      let nextUpgradeCost = this.upgradeCosts.larvaeStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds >= totalCost + nextUpgradeCost) {
        affordableUpgrades += 1
        totalCost += nextUpgradeCost
        nextUpgradeCost = Math.floor(nextUpgradeCost * this.upgradeCostFactor)
      }

      // If there are any affordable upgrades
      if (affordableUpgrades > 0) {
        // Deduct the total cost
        this.resources.seeds -= totalCost

        // Apply all upgrades at once
        this.storage.maxLarvae = Math.floor(this.storage.maxLarvae * Math.pow(this.storageUpgradeFactor, affordableUpgrades))

        // Update the upgrade cost
        this.upgradeCosts.larvaeStorageUpgradeCost = nextUpgradeCost

        console.log(`Upgraded larvae storage ${affordableUpgrades} times.`)
      }
    },
    calculateOfflineProgress() {
      this.simulatingOfflineProgress = true

      return new Promise((resolve, reject) => {
        try {
          const currentTime = Date.now()
          let timeElapsed = (currentTime - this.lastSavedTime) / 1000 // Total offline time in seconds

          // Define the offline cap (24 hours = 86400 seconds)
          const OFFLINE_CAP = 86400

          // Cap the offline time to 24 hours
          if (timeElapsed > OFFLINE_CAP) {
            console.log('Offline time capped to 24 hours (86400 seconds)')
            timeElapsed = OFFLINE_CAP
          }

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
      }).finally(() => this.simulatingOfflineProgress = false)
    },

    // Start the game loop for real-time resource generation, respecting caps
    startGameLoop() {
      if (this.isGameLoopRunning) {
        console.log('Game loop is already running')
        return // Prevent multiple loops from being started
      }

      console.log('Starting game loop')
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
          this.gameLoopInterval = requestAnimationFrame(gameLoop)
        }
      }

      this.gameLoopInterval = requestAnimationFrame(gameLoop)
    },

    updateResources(deltaTime) {
      // Update larvae, but only if there are queens
      if (this.resources.queens > 0) {
        const larvaePerSecond = this.larvaePerSecond // Use the larvaePerSecond calculation

        // Calculate how many larvae to add based on deltaTime
        const larvaeToAdd = larvaePerSecond * deltaTime
        this.accumulators.larvaeAccumulator += larvaeToAdd

        // Only add full larvae units when the accumulator reaches or exceeds 1
        const wholeLarvae = Math.floor(this.accumulators.larvaeAccumulator)
        if (wholeLarvae > 0) {
          this.resources.larvae = Math.min(this.resources.larvae + wholeLarvae, this.storage.maxLarvae)
          this.accumulators.larvaeAccumulator -= wholeLarvae // Subtract the whole units from the accumulator
        }

        // Check for royal jelly collection
        if (this.royalJellyUnlocked && !this.simulatingOfflineProgress) {
          const royalJellyChance = this.royalJellyCollectionChance * deltaTime
          if (Math.random() < royalJellyChance) {
            this.resources.royalJelly += 1
            const $toast = useToast()
            $toast.info('Royal jelly collected!')
          }
        }
      }

      // Update seeds, but only if there are ants
      if (this.resources.ants > 0) {
        const seedsPerSecond = this.seedsPerSecond // Use the seedsPerSecond calculation

        // Calculate how many seeds to add based on deltaTime
        const seedsToAdd = seedsPerSecond * deltaTime
        this.accumulators.seedAccumulator += seedsToAdd

        // Only add full seed units when the accumulator reaches or exceeds 1
        const wholeSeeds = Math.floor(this.accumulators.seedAccumulator)
        if (wholeSeeds > 0) {
          this.resources.seeds = Math.min(this.resources.seeds + wholeSeeds, this.storage.maxSeeds)
          this.accumulators.seedAccumulator -= wholeSeeds // Subtract the whole units from the accumulator
        }
      }
    },

    handleAutoCreations() {
      const prestigeStore = usePrestigeStore()

      const autoActions = [
        {enabled: prestigeStore.autoSeedStorageUpgrade, action: this.upgradeSeedStorage},
        {enabled: prestigeStore.autoEliteAntsCreation, action: this.createEliteMaxAnts},
        {enabled: prestigeStore.autoAntCreation, action: this.createMaxAnts},
        {enabled: prestigeStore.autoQueenCreation, action: this.buyMaxQueens},
      ]

      autoActions.forEach(autoAction => {
        if (autoAction.enabled) {
          autoAction.action()
        }
      })
    },

    stopGameLoop() {
      if (this.gameLoopInterval) {
        console.log('Stopping game loop')
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

    async register() {
      if (!this.email || !this.password || this.password !== this.passwordConfirm) {
        console.error('Email or password missing')
        return
      }

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          console.log('Registered as:', user?.email)

          this.loggedIn = true

          await this.loadGameState()
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          this.error = errorMessage
        })
    },

    async login() {
      if (!this.email || !this.password) {
        console.error('Email or password missing')
        return
      }

      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user
          console.log('Logged in as:', user?.email)

          console.log('Trying to get user ID...')

          const userId = await this.getUserId()
          if (!userId) {
            console.error('User ID not found')
            return
          }

          this.loggedIn = true

          await this.loadGameState()
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          console.error('Error signing in:', errorCode, errorMessage)
        })
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

    async logout(withoutSaving = false) {
      // We don't need to save for anonymous users
      if (firebase.auth().currentUser?.isAnonymous === false && !withoutSaving) {
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
      const adventureStore = useAdventureStore()
      const inventoryStore = useInventoryStore()

      return {
        resources: this.resources,
        storage: this.storage,
        upgradeCosts: this.upgradeCosts,
        lastSavedTime: Date.now(),
        userId,

        attackPerAnt: this.attackPerAnt,
        healthPerAnt: this.healthPerAnt,
        defensePerAnt: this.defensePerAnt,
        productionRates: this.productionRates,
        ...prestigeStore.getPrestigeState(),
        ...adventureStore.getAdventureState(),
        ...inventoryStore.getInventoryState(),
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
          await this.loadStateFromFirebase(docSnap.data())
          console.log('Game state loaded from Firestore')
        } else {
          console.log('No saved game state found in Firestore')
        }

        // Recalculate based on upgrades, apply offline progress
        await this.calculateOfflineProgress()
        this.setupAdventureStats()
        const adventureStore = useAdventureStore()
        await adventureStore.calculateOfflineProgress()
        console.log('Adventure state isFighting:', adventureStore.isFighting)
        if (adventureStore.isFighting || adventureStore.battleCooldown) {
          adventureStore.startBattle()
        }

        this.loaded = true
        console.log('Game state loaded successfully', this.lastSavedTime)
      } catch (error) {
        console.error('Error loading game state from Firestore:', error)
      }
    },

    async loadStateFromFirebase(savedState) {
      console.log('Loading game state from Firestore...', savedState)

      this.resources = {
        ...this.resources,
        ...savedState.resources,
      }

      this.storage = {
        ...this.storage,
        ...savedState.storage,
      }

      this.upgradeCosts = savedState.upgradeCosts ?? this.upgradeCosts

      this.lastSavedTime = savedState.lastSavedTime ?? this.lastSavedTime
      this.productionRates = {
        ...this.productionRates,
        ...savedState.productionRates,
      }
      this.attackPerAnt = savedState.attackPerAnt ?? this.attackPerAnt
      this.healthPerAnt = savedState.healthPerAnt ?? this.healthPerAnt
      this.defensePerAnt = savedState.defensePerAnt ?? this.defensePerAnt

      const prestigeStore = usePrestigeStore()
      prestigeStore.loadPrestigeState(savedState)

      this.eliteAntsUnlocked = prestigeStore.upgradePurchased('eliteAnts')
      this.royalJellyUnlocked = prestigeStore.upgradePurchased('royalJelly')

      const adventureStore = useAdventureStore()
      await adventureStore.loadAdventureState(savedState)

      const inventoryStore = useInventoryStore()
      await inventoryStore.loadInventoryState(savedState)
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
        await this.resetLocalGameState({isDebug: debug})

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

    deleteAllData() {
      const userId = this.getUserId()
      if (!userId) {
        console.error('User ID not found')
        return
      }

      const auth = firebase.auth()
      auth.currentUser?.delete().then(() => {
        console.log('User deleted')
        this.logout(true)
      }).catch((error) => {
        console.error('Error deleting user:', error)
      })
    },

    // Clear Firestore document
    async clearGameStateFromFirestore(userId) {
      const docRef = doc(db, 'games', userId)
      await deleteDoc(docRef)
      console.log('Game state cleared from Firestore')
    },

    resetLocalGameState({isDebug}): Promise<void> {
      return new Promise((resolve) => {
        console.log('Resetting local game state...')

        // Reset resources
        this.resources = {
          larvae: 0,
          ants: 0,
          eliteAnts: 0,
          seeds: 10,
          queens: 1,
          royalJelly: isDebug ? 0 : this.resources.royalJelly,

          royalJellyAnts: isDebug ? 0 : this.resources.royalJellyAnts,
          workers: isDebug ? 0 : this.resources.workers,
          soldiers: isDebug ? 0 : this.resources.soldiers,
        }

        // Reset production rates
        this.productionRates = {
          larvaeProductionRate: 1,
          collectionRatePerAnt: 60,

          collectionRatePerWorker: 6000,
        }

        // Reset storage to initial caps
        this.storage = {
          maxSeeds: this.initialCaps.maxSeeds,
          maxLarvae: this.initialCaps.maxLarvae,
          maxAnts: this.initialCaps.maxAnts,
          maxQueens: this.initialCaps.maxQueens,
          maxEliteAnts: this.initialCaps.maxEliteAnts,
        }

        // Reset upgrade costs
        this.upgradeCosts = {
          seedStorageUpgradeCost: 500,
          larvaeStorageUpgradeCost: 100,
        }

        // Set the last saved time
        this.lastSavedTime = Date.now()

        // Handle debug state reset if applicable
        if (isDebug) {
          this.resetDebugState()
        }

        // Apply prestige upgrades
        const prestigeStore = usePrestigeStore()
        prestigeStore.applyPrestigeUpgrades(true)

        // Reset auto-creation flags
        prestigeStore.autoQueenCreation = false
        prestigeStore.autoAntCreation = false
        prestigeStore.autoLarvaeCreation = false
        prestigeStore.autoSeedStorageUpgrade = false
        prestigeStore.autoEliteAntsCreation = false

        // Resolve the promise once everything is done
        resolve()
      })
    },


    resetDebugState() {
      const prestigeStore = usePrestigeStore()
      prestigeStore.prestigePoints = 0
      prestigeStore.timesPrestiged = 0
      prestigeStore.purchasedUpgrades = []

      this.healthPerAnt = 10
      this.attackPerAnt = 2
      this.defensePerAnt = 1
      this.eliteAntsUnlocked = false
      this.royalJellyUnlocked = false

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
      if (this.resources.ants === 0) return
      adventureStore.armyMaxHealth = this.resources.ants * this.healthPerAnt + (this.resources.queens - 1) * this.healthPerAnt * this.resourceCosts.antCostPerQueen
      adventureStore.armyHealth = Math.min(adventureStore.armyHealth, adventureStore.armyMaxHealth)
      adventureStore.armyAttack = this.resources.ants * this.attackPerAnt + (this.resources.queens - 1) * this.attackPerAnt * this.resourceCosts.antCostPerQueen
      adventureStore.armyDefense = this.resources.ants * this.defensePerAnt + (this.resources.queens - 1) * this.defensePerAnt * this.resourceCosts.antCostPerQueen
    },


    formatNumber(num: number, toFixed = 2): string {
      if (toFixed === 0) num = Math.floor(num)
      // Use normal formatting for numbers below 1 million
      if (num < 100e6) {
        if (num < 1000) return num.toFixed(toFixed)

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
