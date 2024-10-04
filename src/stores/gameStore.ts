import {defineStore} from 'pinia'
import {useAdventureStore} from './adventureStore'
import {useInventoryStore} from './inventoryStore'
import firebase from 'firebase/compat'
import {getAuth, signInAnonymously} from 'firebase/auth'
import {db} from '../firebase'
import {addDoc, collection, deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {useToast} from 'vue-toast-notification'
import {usePrestigeStore} from './prestigeStore'
import {useSettingsStore} from '@/stores/settingsStore'
import {useEquipmentStore} from '@/stores/equipmentStore'
import {useAchievementStore} from '@/stores/achievementStore'
import LZString from 'lz-string'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useTunnelStore} from '@/stores/tunnelStore'
import {useEvolveStore} from '@/stores/evolveStore'
import FirestoreError = firebase.firestore.FirestoreError;


export const useGameStore = defineStore('gameStore', {
  state: () => ({
    compressedData: '',
    email: '',
    password: '',
    passwordConfirm: '',
    error: null,
    privacyAgreement: false,

    loaded: false,
    loggedIn: false,
    lastSavedTime: Date.now(),

    deltaMultiplier: 1,

    eliteAntsUnlocked: false,
    royalJellyUnlocked: false,

    // Adventure-related variables
    attackPerAnt: 2, // Attack value per ant
    healthPerAnt: 10, // Health value per ant
    defensePerAnt: 1, // Defense value per ant

    attackPerSoldier: 20, // Attack value per soldier
    healthPerSoldier: 100, // Health value per soldier
    defensePerSoldier: 10, // Defense value per soldier

    gameLoopInterval: null as number | null,
    isGameLoopRunning: false,
    progress: 0, // Track progress for offline calculation
    simulatingOfflineProgress: false,
  }),
  actions: {
    // Import game data from a string (decrypt and load into state)
    async importData(encryptedString: string) {
      try {
        // Parse the base64 encoded JSON string to retrieve IV and encrypted data
        const decodedString = atob(encryptedString)
        const {iv, data} = JSON.parse(decodedString)

        // Decrypt the data using the stored IV
        const decryptedData = await this.decryptData(data, Uint8Array.from(iv))
        const {game} = decryptedData

        await this.loadStateFromFirebase(game)
        await this.loadGameState(false)

        console.log('Import successful!')
      } catch (error) {
        console.error('Error importing data:', error)
      }
    },

    // Export game data as encrypted string
    async exportData() {
      const userId = await this.getUserId()
      const dataToExport = {
        game: this.getGameState(userId), // Entire game state
        timestamp: Date.now(), // Add a timestamp
      }

      try {
        // Generate an IV
        const iv = crypto.getRandomValues(new Uint8Array(12))

        // Encrypt data
        const encryptedData = await this.encryptData(dataToExport, iv)

        // Combine IV and encrypted data
        const exportPayload = {
          iv: Array.from(iv), // Store IV as an array of numbers
          data: encryptedData,
        }

        // Return the base64 encoded JSON string containing IV and encrypted data
        return btoa(JSON.stringify(exportPayload))
      } catch (error) {
        console.error('Error exporting data:', error)
        return null
      }
    },

    // Encrypt the game data with provided IV
    async encryptData(data: any, iv: Uint8Array) {
      const key = await this.getCryptoKey()
      const encoder = new TextEncoder()
      const encodedData = encoder.encode(JSON.stringify(data))

      const encryptedData = await crypto.subtle.encrypt(
        {name: 'AES-GCM', iv},
        key,
        encodedData,
      )

      return btoa(String.fromCharCode(...new Uint8Array(encryptedData))) // Convert to base64 string
    },
    // Decrypt the imported string using the provided IV
    async decryptData(encryptedString: string, iv: Uint8Array) {
      const key = await this.getCryptoKey()
      const encryptedData = Uint8Array.from(atob(encryptedString), (c) => c.charCodeAt(0))

      const decryptedData = await crypto.subtle.decrypt(
        {name: 'AES-GCM', iv},
        key,
        encryptedData,
      )

      const decoder = new TextDecoder()
      return JSON.parse(decoder.decode(decryptedData))
    },

    // Generate the encryption key
    async getCryptoKey() {
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('YourSecretKey12345'), // Use a secure key
        {name: 'PBKDF2'},
        false,
        ['deriveKey'],
      )

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('YourUniqueSalt'), // Use a unique salt
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        {name: 'AES-GCM', length: 256},
        false,
        ['encrypt', 'decrypt'],
      )
    },
    async calculateOfflineProgress() {
      this.simulatingOfflineProgress = true

      return new Promise((resolve, reject) => {
        try {
          const resourceStore = useResourcesStore()
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
              resolve(null)
              return
            }

            const deltaTime = Math.min(chunkDuration, remainingTime) * this.deltaMultiplier // Simulate in larger chunks or remaining time
            resourceStore.updateResources(deltaTime)

            // Accumulate the offline time for auto actions
            offlineTimeAccumulator += deltaTime

            // Trigger auto-actions after accumulating sufficient time
            if (offlineTimeAccumulator >= 1) {
              resourceStore.handleAutoCreations()

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
      let achievementCheckAccumulator = 0 // Time tracking for achievement checks
      const achievementUpdateInterval = 5 // Check achievements every second

      let lastAutoCreationTime = 0 // Time tracking for throttling auto creations
      const autoCreationInterval = 1 // Only allow auto-creation every second
      const resourcesStore = useResourcesStore()
      const adventureStore = useAdventureStore()
      const tunnelStore = useTunnelStore()
      const gameLoop = (currentTime) => {
        const deltaTime = (currentTime - lastFrameTime) / 1000 * this.deltaMultiplier // Delta time in seconds
        const updateInterval = 1 / 60 // Target update rate (e.g., 30 FPS)

        timeAccumulator += deltaTime
        achievementCheckAccumulator += deltaTime

        if (timeAccumulator >= updateInterval) {
          resourcesStore.updateResources(updateInterval) // Update resources based on the target update rate

          // Throttle auto-creations to once per second
          if (currentTime - lastAutoCreationTime >= autoCreationInterval * 1000) {
            resourcesStore.handleAutoCreations()
            lastAutoCreationTime = currentTime // Reset the auto-creation throttle timer
          }

          tunnelStore.handleTunnel(currentTime)

          adventureStore.applyBuffs(updateInterval) // Apply active buffs
          adventureStore.processCombat(updateInterval) // Process combat

          // Reset the time accumulator, subtracting the update interval to handle any leftover time
          timeAccumulator -= updateInterval
        }

        // Check achievements every 5 seconds
        if (achievementCheckAccumulator >= achievementUpdateInterval) {
          useAchievementStore().checkAchievements()
          achievementCheckAccumulator = 0
        }

        lastFrameTime = currentTime

        if (this.isGameLoopRunning) {
          this.gameLoopInterval = requestAnimationFrame(gameLoop)
        }
      }

      this.gameLoopInterval = requestAnimationFrame(gameLoop)
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

          await this.setConsent(await this.getUserId())

          await this.loadGameState()
        })
        .catch((error) => {
          this.error = error.message
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
          await this.setConsent(await this.getUserId())

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
        this.resetLocalGameState({
          isDebug: true,
        })
      }).catch((error) => {
        console.error('Error signing out:', error)
      })
    },

    cleanGameState(gameState, userId) {
      // Base case: If it's not an object (e.g., string, number), return it directly
      if (typeof gameState !== 'object' || gameState === null) {
        return gameState
      }

      // Iterate over each property in the object
      for (const key in gameState) {
        if (gameState.hasOwnProperty(key)) {
          const value = gameState[key]

          // If the value is undefined, log it and set to null
          if (value === undefined) {
            this.logInvalidData(userId, key, 'undefined')
            gameState[key] = null
          }
          // If the value is NaN, log it and set to null
          else if (typeof value === 'number' && isNaN(value)) {
            this.logInvalidData(userId, key, 'NaN')
            gameState[key] = null
          }
          // Recursively clean objects or arrays
          else if (typeof value === 'object') {
            this.cleanGameState(value, userId)
          }
        }
      }
      return gameState
    },
    async saveGameState() {
      console.log('Game state is being saved...')
      const userId = await this.getUserId()
      if (!userId) {
        console.error('User ID not found')
        return
      }

      try {
        const gameState = this.getGameState(userId)
        const cleanedGameState = this.cleanGameState(gameState, userId)
        const compressedGameState = LZString.compressToUTF16(JSON.stringify(cleanedGameState))

        console.log('Game state compressed:', compressedGameState.length, 'bytes')

        await setDoc(doc(db, 'games', userId), {
          data: compressedGameState,
          version: 1,
        })

        console.log('Game state saved to Firestore')

        const $toast = useToast()
        $toast.success('Game saved successfully', {
          position: 'top-left',
        })
        this.lastSavedTime = Date.now()
      } catch (error: FirestoreError | any) {
        console.error('Error saving game state to Firebase:', error)
        const $toast = useToast()
        $toast.error('Failed to save game state', {
          position: 'top-left',
        })

        await this.logInvalidData(userId, 'gameState', error?.message)
      }
    },
    async logInvalidData(userId, key, type) {
      try {
        const logEntry = {
          userId: userId,
          field: key,
          issueType: type, // Either 'undefined' or 'NaN'
          timestamp: new Date().toISOString(),
        }

        // Add log to Firestore
        await addDoc(collection(db, `gameStateLogs/${userId}/logs`), logEntry)

        console.log(`Logged issue: ${type} for key: ${key}`)
      } catch (error) {
        console.error('Error logging data to Firebase:', error)
      }
    },

    getGameState(userId) {
      const prestigeStore = usePrestigeStore()
      const adventureStore = useAdventureStore()
      const inventoryStore = useInventoryStore()
      const settingsStore = useSettingsStore()
      const equipmentStore = useEquipmentStore()
      const achievementStore = useAchievementStore()
      const resourcesStore = useResourcesStore()
      const evolveStore = useEvolveStore()

      return {
        ...resourcesStore.getResourcesState(),
        lastSavedTime: Date.now(),
        userId,

        attackPerAnt: this.attackPerAnt,
        healthPerAnt: this.healthPerAnt,
        defensePerAnt: this.defensePerAnt,

        ...prestigeStore.getPrestigeState(),
        ...adventureStore.getAdventureState(),
        ...inventoryStore.getInventoryState(),
        ...settingsStore.getSettingsState(),
        ...equipmentStore.getEquipmentState(),
        ...achievementStore.getAchievementState(),
        ...useTunnelStore().getTunnelState(),
        ...evolveStore.getEvolveState(),
      }
    },

    async loadGameState(fromFireBase = true) {
      this.loaded = false
      try {
        if (fromFireBase) {
          const userId = await this.getUserId()
          if (!userId) {
            console.error('User ID not found')
            return
          }

          const docRef = doc(db, 'games', userId)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            let data = docSnap.data()
            if (data.version) {
              console.log('Game state version:', data.version)
              console.log('Game state compressed:', data.data.length, 'bytes')
              data = JSON.parse(LZString.decompressFromUTF16(data.data))
            }

            await this.loadStateFromFirebase(data)
            console.log('Game state loaded from Firestore')
          } else {
            console.log('No saved game state found in Firestore')
          }
        }

        // Recalculate based on upgrades, apply offline progress
        await this.calculateOfflineProgress()
        this.setupAdventureStats()
        const adventureStore = useAdventureStore()
        await adventureStore.calculateOfflineProgress()
        adventureStore.startBattle()
        this.loaded = true
        console.log('Game state loaded successfully', this.lastSavedTime)
      } catch (error) {
        console.error('Error loading game state from Firestore:', error)
      }

      this.saveGameState()
    },

    async loadStateFromFirebase(savedState) {
      const resourcesStore = useResourcesStore()
      resourcesStore.resetResourcesState()
      resourcesStore.loadResourcesState(savedState)

      const evolveStore = useEvolveStore()
      evolveStore.loadEvolveState(savedState)

      this.lastSavedTime = savedState.lastSavedTime ?? this.lastSavedTime

      this.attackPerAnt = savedState.attackPerAnt ?? this.attackPerAnt
      this.healthPerAnt = savedState.healthPerAnt ?? this.healthPerAnt
      this.defensePerAnt = savedState.defensePerAnt ?? this.defensePerAnt

      const prestigeStore = usePrestigeStore()
      prestigeStore.resetPrestigeState()
      prestigeStore.loadPrestigeState(savedState)

      this.eliteAntsUnlocked = prestigeStore.upgradePurchased('eliteAnts')
      this.royalJellyUnlocked = prestigeStore.upgradePurchased('royalJelly')

      const adventureStore = useAdventureStore()
      await adventureStore.loadAdventureState(savedState)

      const inventoryStore = useInventoryStore()
      inventoryStore.appliedPassiveEffects = []
      await inventoryStore.loadInventoryState(savedState)

      const settingsStore = useSettingsStore()
      settingsStore.loadSettingsState(savedState)

      const equipmentStore = useEquipmentStore()
      equipmentStore.loadEquipmentState(savedState)

      const achievementStore = useAchievementStore()
      achievementStore.loadAchievementState(savedState)

      const tunnelStore = useTunnelStore()
      tunnelStore.loadTunnelState(savedState)

      resourcesStore.applyUpgrades()
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
      auth.currentUser?.delete().then(async () => {
        console.log('User deleted')
        const $toast = useToast()
        $toast.success('User deleted successfully', {
          position: 'top-left',
        })
        await this.logout(true)
      }).catch((error) => {
        console.error('Error deleting user:', error)
        const $toast = useToast()
        $toast.error('Failed to delete user: ' + error.message, {
          position: 'top-left',
        })
      })
    },

    // Clear Firestore document
    async clearGameStateFromFirestore(userId) {
      const docRef = doc(db, 'games', userId)
      await deleteDoc(docRef)
      console.log('Game state cleared from Firestore')
    },

    async resetLocalGameState({
                                isDebug,
                                isEvolution,
                              }): Promise<void> {
      return new Promise((resolve) => {
        const resourcesStore = useResourcesStore()
        resourcesStore.resetResourcesState(isDebug || isEvolution)

        const evolveStore = useEvolveStore()
        evolveStore.applyEvolution()

        // Set the last saved time
        this.lastSavedTime = Date.now()

        // Handle debug state reset if applicable
        if (isDebug) {
          this.resetDebugState()
          const achievementStore = useAchievementStore()
          achievementStore.resetAchievements()
        }

        if (isEvolution) {
          const prestigeStore = usePrestigeStore()
          prestigeStore.prestigePoints = 0
          prestigeStore.timesPrestiged = 0
          prestigeStore.purchasedUpgrades = []

          this.healthPerAnt = 10
          this.attackPerAnt = 2
          this.defensePerAnt = 1

          prestigeStore.resetPrestigeShopCosts()

          prestigeStore.autoQueenCreation = false
          prestigeStore.autoAntCreation = false
          prestigeStore.autoLarvaeCreation = false
          prestigeStore.autoSeedStorageUpgrade = false
          prestigeStore.autoLarvaeStorageUpgrade = false
          prestigeStore.autoEliteAntsCreation = false
          prestigeStore.autoCreateHousing = false
        }

        // Apply prestige upgrades
        const prestigeStore = usePrestigeStore()
        prestigeStore.resetPrestigeState()
        prestigeStore.applyPrestigeUpgrades(true)

        const adventureStore = useAdventureStore()
        adventureStore.resetAdventureState()


        const inventoryStore = useInventoryStore()
        inventoryStore.appliedPassiveEffects = []
        inventoryStore.applyPassiveEffects()

        const equipmentStore = useEquipmentStore()
        equipmentStore.checkForSetBonus()
        adventureStore.setupAdventureStats()

        // Resolve the promise once everything is done
        resolve()
      })
    },

    resetDebugState() {
      const prestigeStore = usePrestigeStore()
      const inventoryStore = useInventoryStore()
      prestigeStore.prestigePoints = 0
      prestigeStore.timesPrestiged = 0
      prestigeStore.purchasedUpgrades = []

      this.healthPerAnt = 10
      this.attackPerAnt = 2
      this.defensePerAnt = 1
      this.eliteAntsUnlocked = false
      this.royalJellyUnlocked = false

      prestigeStore.resetPrestigeShopCosts()

      // Reset auto-creation flags
      prestigeStore.autoQueenCreation = false
      prestigeStore.autoAntCreation = false
      prestigeStore.autoLarvaeCreation = false
      prestigeStore.autoSeedStorageUpgrade = false
      prestigeStore.autoLarvaeStorageUpgrade = false
      prestigeStore.autoEliteAntsCreation = false
      prestigeStore.autoCreateHousing = false

      inventoryStore.resetInventoryState()

      const equipmentStore = useEquipmentStore()
      equipmentStore.resetEquipmentState()

      const evolveStore = useEvolveStore()
      evolveStore.resetEvolveState()
    },

    async resetOtherStores(debug) {
      if (debug) {
        // Reset inventory store
        const inventoryStore = useInventoryStore()
        await inventoryStore.resetInventoryState()

        const tunnelStore = useTunnelStore()
        tunnelStore.resetTunnel()
      }
      // Reset adventure store
      const adventureStore = useAdventureStore()
      await adventureStore.resetAdventureState()
    },

    setupAdventureStats() {
      const adventureStore = useAdventureStore()
      adventureStore.setupAdventureStats()
    },

    async setConsent(userId) {
      try {
        const docRef = doc(db, 'consent', userId)
        const docSnap = await getDoc(docRef)

        // Check if the document exists
        if (docSnap.exists()) {
          const userData = docSnap.data()

          // Check if consent has already been given
          if (!userData.consentGiven) {
            // If not, check if privacyAgreement is true and update Firestore
            if (this.privacyAgreement) {
              await setDoc(docRef, {
                consentGiven: true,
                consentTimestamp: new Date().toISOString(), // Store the current timestamp
              }, {merge: true}) // Merge so that other data is not overwritten

              console.log('Consent has been set with timestamp.')
              return
            }
          } else {
            console.log('Consent already given.')
          }
        } else {
          console.log('No user data found, creating new document...')
          const userData = {
            consentGiven: this.privacyAgreement,
            consentTimestamp: new Date().toISOString(),
          }

          await setDoc(docRef, userData)
          console.log('Consent has been set with timestamp.')
        }
      } catch (error) {
        console.error('Error updating consent:', error)
      }
    },

    formatNumber(num: number, toFixed = 2): string {
      if (num > Number.MAX_SAFE_INTEGER) return 'Infinity'

      if (toFixed === 0) num = Math.floor(num)

      const notation = useSettingsStore().notation

      const longTextSuffixes = [
        '', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion',
        'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion',
        'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sexdecillion',
        'Septendecillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion',
      ]

      if (notation === 'longText') {
        if (num < 1000) return num.toFixed(toFixed)

        const exponent = Math.floor(Math.log10(Math.abs(num)) / 3)
        const scaledNumber = num / Math.pow(1000, exponent)
        const suffix = longTextSuffixes[exponent] || `E${exponent * 3}`

        return scaledNumber.toFixed(2) + ' ' + suffix
      }

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
