import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useToast} from 'vue-toast-notification'
import {useInventoryStore} from './inventoryStore'
import {deleteDoc, doc, getDoc, setDoc} from 'firebase/firestore'
import {db} from '../firebase'
import {adventureEnemyWaves} from '../types/AdventureEnemyWaves'

export const useAdventureStore = defineStore('adventureStore', {
  state: () => ({
    loaded: false, // To track when adventure state is fully loaded
    progress: 0, // Track progress for offline calculation

    armyHealth: 100,
    armyMaxHealth: 100,
    armyAttack: 10,
    armyDefense: 5,
    armyRegen: 5,

    bugHealth: 0,
    bugMaxHealth: 0,
    bugAttack: 0,
    bugDefense: 0,
    bugRegen: 2,

    currentArea: 'Wasteland',
    enemyWaves: adventureEnemyWaves,
    currentEnemy: null,

    enemySpawned: false,
    battleRunning: false, // Combat status
    isFighting: false, // Whether the combat is currently happening
    battleCooldown: false,
    lastFrameTime: 0,
    accumulatedTime: 0, // To accumulate time between frames
    combatTick: 2000, // Combat happens every 2000ms (2 seconds)

    // Kill counts
    killCounts: {
      grasshopperKills: 0,
      beetleKills: 0,
      waspKills: 0,
    },

    // For offline progress
    lastSavedTime: Date.now(),
    isSimulatingOffline: false,
    animationFrameId: 0,
    regenLoopActive: false,
  }),

  actions: {
    toggleBattle(shouldJustStart = false) {
      if ((this.isFighting && !shouldJustStart) || (this.battleCooldown && !shouldJustStart)) {
        console.log('Battle Stopped')
        this.stopBattle() // Stop if currently running
      } else {
        console.log('Battle Started')
        this.startBattle() // Start if not running
      }
    },

    // Start the battle loop
    startBattle() {
      // Check if already running
      console.log('Battle Loop Started')
      this.battleRunning = true
      this.isFighting = true
      this.lastFrameTime = performance.now()
      this.accumulatedTime = 0

      // Spawn a new enemy if none exists
      if (this.bugHealth === 0 || !this.enemySpawned) {
        this.spawnRandomEnemy()
      }

      this.animationFrameId = requestAnimationFrame(this.battleLoop)
    },

    // Stop the battle loop
    stopBattle() {
      this.isFighting = false
      this.battleRunning = false
      this.battleCooldown = false
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId)
        this.animationFrameId = 0
      }
    },

    // Main battle loop with requestAnimationFrame (tick-based)
    battleLoop(currentTime) {
      const deltaTime = (currentTime - this.lastFrameTime) / 1000 // Convert time to seconds
      this.lastFrameTime = currentTime
      this.accumulatedTime += deltaTime

      // Process combat every tick (based on how much time has passed)
      this.processCombat(deltaTime)

      // Keep running the loop as long as the battle is running
      if (this.battleRunning) {
        this.animationFrameId = requestAnimationFrame(this.battleLoop)
      }
    },

    processCombat(deltaTime) {
      if (this.isFighting && this.enemySpawned) {
        // Calculate damage based on DPS and the time passed since the last frame (deltaTime)
        this.applyArmyDamage(deltaTime)
        this.applyBugDamage(deltaTime)

        // Check for defeat conditions
        if (this.armyHealth <= 0) {
          this.handlePlayerDefeat()
        }

        if (this.bugHealth <= 0) {
          this.handleEnemyDefeat()
        }
      }

      this.applyRegeneration(deltaTime) // Regenerate health during the real-time loop
    },

    applyArmyDamage(deltaTime) {
      // Calculate how much damage is applied per tick (DPS * deltaTime)
      const variation = 0.9 + Math.random() * 0.2 // Random multiplier between 0.9 and 1.1
      const armyDPS = Math.max(this.armyAttack - this.bugDefense, 1) // Calculate DPS
      const damageThisTick = armyDPS * deltaTime * variation // Damage for this tick
      this.bugHealth = Math.max(this.bugHealth - damageThisTick, 0)
    },

    applyBugDamage(deltaTime) {
      // Calculate how much damage is applied per tick (DPS * deltaTime)
      const variation = 0.9 + Math.random() * 0.2 // Random multiplier between 0.9 and 1.1
      const bugDPS = Math.max(this.bugAttack - this.armyDefense, 1) // Calculate DPS
      const damageThisTick = bugDPS * deltaTime * variation // Damage for this tick
      this.armyHealth = Math.max(this.armyHealth - damageThisTick, 0)
    },

    handlePlayerDefeat() {
      console.log('Bug Wins!')
      this.isFighting = false
      this.battleCooldown = true // Enter a cooldown state after defeat

      // Start a regeneration loop after defeat to limit full healing
      this.regenAfterDefeat()
    },

    regenAfterDefeat() {
      const regenInterval = 100 // Apply regeneration every 100ms

      const defeatRegen = () => {
        if (this.armyHealth < this.armyMaxHealth) {
          this.applyRegeneration() // Apply gradual regeneration
          setTimeout(defeatRegen, regenInterval)
        } else {
          console.log('Regeneration after defeat finished')
          this.battleCooldown = false // Exit cooldown state
          this.isFighting = false // Stop fighting
          this.battleRunning = false // Stop the battle loop
        }
      }

      defeatRegen() // Start the regeneration loop
    },

    handleKillCount() {
      const killKey = this.currentEnemy.name.toLowerCase().replace(/\s+/g, '') + 'Kills'
      if (this.killCounts[killKey] !== undefined) {
        this.killCounts[killKey] += 1
      } else {
        this.killCounts[killKey] = 1 // Initialize if not present
      }
    },
    handleEnemyDrop() {
      this.currentEnemy.dropOptions?.forEach((drop) => {
        if (Math.random() < drop.chance) {
          const amount =
            Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) +
            drop.amountBetween[0]
          console.log(`Loot: +${amount} ${drop.name}`)

          if (!this.isSimulatingOffline) {
            const $toast = useToast()
            $toast.success(`Loot: +${amount} ${drop.name}`)
          }

          if (drop.name === 'Seeds') {
            // Add seeds to gameStore
            useGameStore().seeds += amount
          } else {
            // Handle item drops
            const itemId = drop.name.toLowerCase().replace(/\s+/g, '-')
            const item = useInventoryStore().getItemById(itemId)
            if (item) {
              this.handleItemDrop(item, amount)
            } else {
              console.error(`Item ${drop.name} not found in registry`)
            }
          }
        }
      })
    },
    handleEnemyDefeat() {
      this.enemySpawned = false
      this.battleCooldown = true // Enter cooldown state
      this.isFighting = false

      // Update kill counts
      this.handleKillCount()

      // Handle loot
      this.handleEnemyDrop()

      // Spawn a new enemy
      setTimeout(() => {
        this.spawnRandomEnemy()

        setTimeout(() => {
          if (this.battleRunning) {
            this.isFighting = true
            this.battleCooldown = false
          }
        }, 1000)
      }, 2000)

      // Continue applying regeneration during the cooldown phase
      this.regenDuringCooldown()
    },

    // Add regeneration during cooldown phase
    regenDuringCooldown() {
      const regenInterval = 100 // Apply regeneration every 100ms

      // Check if the regeneration loop is already running
      if (!this.regenLoopActive) {
        this.regenLoopActive = true // Mark the loop as active

        const cooldownRegen = () => {
          if (this.battleCooldown || !this.isFighting) {
            this.applyRegeneration() // Apply regeneration
            setTimeout(cooldownRegen, regenInterval) // Continue regenerating during cooldown
          } else {
            this.regenLoopActive = false // Stop the loop when battle resumes
          }
        }

        cooldownRegen() // Start the regeneration loop during cooldown
      }
    },

    // Apply effects based on item type
    handleItemDrop(item, amount) {
      const inventoryStore = useInventoryStore()
      inventoryStore.addItemToInventory({
        id: item.id,
        name: item.name,
        amount,
      })
    },

    applyRegeneration(deltaTime = null) {
      // If deltaTime is passed, use it; otherwise assume it's 1 tick (for real-time)
      const regenMultiplier = deltaTime ? deltaTime : 1

      // Apply army regeneration per tick
      if (this.armyHealth < this.armyMaxHealth) {
        this.armyHealth = Math.min(
          this.armyHealth + this.armyRegen * regenMultiplier,
          this.armyMaxHealth,
        )
      }

      // Apply bug regeneration if the bug is spawned and not at max health
      if (this.enemySpawned && this.bugHealth < this.bugMaxHealth) {
        this.bugHealth = Math.min(
          this.bugHealth + this.bugRegen * regenMultiplier,
          this.bugMaxHealth,
        )
      }
    },

    spawnRandomEnemy() {
      const enemies = this.enemyWaves.find((wave) => wave.name === this.currentArea)?.enemies
      if (!enemies) {
        console.error('No enemies found for the current area')
        return
      }

      const randomIndex = Math.floor(Math.random() * enemies.length)
      const enemy = enemies[randomIndex]
      this.currentEnemy = enemy

      this.bugHealth = enemy.health
      this.bugMaxHealth = enemy.health
      this.bugAttack = enemy.attack
      this.bugDefense = enemy.defense
      this.bugRegen = enemy.regen

      this.enemySpawned = true
    },

    // Save adventure state to Firebase Firestore
    async saveAdventureState() {
      const userId = await useGameStore().getUserId()
      if (!userId) {
        console.error('User ID not found')
        return
      }

      const adventureState = {
        armyHealth: this.armyHealth,
        armyMaxHealth: this.armyMaxHealth,
        armyAttack: this.armyAttack,
        armyDefense: this.armyDefense,
        armyRegen: this.armyRegen,
        killCounts: this.killCounts,
        currentArea: this.currentArea,
        isFighting: this.isFighting || this.battleCooldown, // Save the current battle state
        lastSavedTime: Date.now(),
        userId: userId,
      }

      console.log('Saving adventure state to Firestore:', adventureState)

      try {
        await setDoc(doc(db, 'adventure', userId), adventureState)
        console.log('Adventure state saved to Firestore')
      } catch (error) {
        console.error('Error saving adventure state to Firestore:', error)
      }
    },

    // Load adventure state from Firebase Firestore
    async loadAdventureState() {
      this.loaded = false // Mark as not loaded

      try {
        const gameStore = useGameStore()
        const userId = await gameStore.getUserId()
        if (!userId) {
          console.error('User ID not found')
          return
        }

        const docRef = doc(db, 'adventure', userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const adventureState = docSnap.data()
          console.log('Adventure state loaded from Firestore:', adventureState)

          // Load the saved state
          this.armyHealth = adventureState.armyHealth ?? this.armyHealth
          this.armyMaxHealth = adventureState.armyMaxHealth ?? this.armyMaxHealth
          this.armyAttack = adventureState.armyAttack ?? this.armyAttack
          this.armyDefense = adventureState.armyDefense ?? this.armyDefense
          this.armyRegen = adventureState.armyRegen ?? this.armyRegen
          this.killCounts = adventureState.killCounts ?? this.killCounts
          this.currentArea = adventureState.currentArea ?? this.currentArea
          this.isFighting = adventureState.isFighting ?? false
          this.lastSavedTime = adventureState.lastSavedTime ?? Date.now()

          // Mark as loaded once the state is fully set
          this.loaded = true
        } else {
          console.log('No adventure state found in Firestore')
          this.loaded = true
        }
      } catch (error) {
        console.error('Error loading adventure state from Firestore:', error)
        this.loaded = true
      }
    },

    // Reset adventure state and clear from Firebase Firestore
    async resetAdventureState() {
      try {
        const gameStore = useGameStore() // Access the gameStore
        const userId = await gameStore.getUserId() // Use gameStore's getUserId method
        if (!userId) {
          console.error('User ID not found')
          return
        }

        // Clear the user's adventure state from Firestore
        const docRef = doc(db, 'adventure', userId)
        await deleteDoc(docRef) // Delete the document from Firestore

        // Reset the local adventure state
        this.armyHealth = 100
        this.armyMaxHealth = 100
        this.armyAttack = 10
        this.armyDefense = 5
        this.armyRegen = 5
        this.killCounts = {
          grasshopperKills: 0,
          beetleKills: 0,
          waspKills: 0,
        }
        this.lastSavedTime = Date.now()

        console.log('Adventure state reset and cleared from Firestore')
      } catch (error) {
        console.error('Error resetting adventure state:', error)
      }
    },

    // Offline progress calculation
    calculateOfflineProgress() {
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

          console.log(`Time elapsed (offline): ${timeElapsed} seconds`)

          let remainingTime = timeElapsed
          const chunkDuration = 60 // Simulate in chunks of 60 seconds

          this.isSimulatingOffline = true
          this.progress = 0 // Initialize progress

          const simulateOffline = () => {
            if (remainingTime <= 0) {
              this.lastSavedTime = currentTime
              console.log('Offline progress simulation complete.')
              this.isSimulatingOffline = false
              this.progress = 100 // Set progress to 100%
              resolve()
              return
            }

            const deltaTime = Math.min(chunkDuration, remainingTime)
            this.updateCombat(deltaTime) // Simulate combat
            this.applyRegeneration(deltaTime) // Simulate health regeneration
            this.handleLoot() // Simulate loot collection

            remainingTime -= deltaTime
            this.progress = Math.min(100, ((timeElapsed - remainingTime) / timeElapsed) * 100) // Update progress

            setTimeout(simulateOffline, 0) // Continue simulating in the next event loop cycle
          }

          simulateOffline()
        } catch (error) {
          console.error('Error during offline progress simulation:', error)
          this.isSimulatingOffline = false
          reject(error)
        }
      })
    },

    updateCombat(deltaTime) {
      const combatTicks = Math.floor(deltaTime / (this.combatTick / 1000)) // Number of combat ticks

      for (let i = 0; i < combatTicks; i++) {
        if (!this.enemySpawned) {
          this.spawnRandomEnemy() // Spawn a new enemy if none exists
        }

        // Army attacks the bug
        const armyDamage = Math.max(this.armyAttack - this.bugDefense, 1)
        this.bugHealth = Math.max(this.bugHealth - armyDamage, 0)

        // Bug attacks the army
        const bugDamage = Math.max(this.bugAttack - this.armyDefense, 1)
        this.armyHealth = Math.max(this.armyHealth - bugDamage, 0)

        // Check if either the army or the bug is defeated
        if (this.armyHealth === 0) {
          this.handlePlayerDefeat()
          break // Stop combat if the player is defeated
        }

        if (this.bugHealth === 0) {
          this.handleEnemyDefeat()
          // After defeating an enemy, reset health for army (optional)
          // this.armyHealth = this.armyMaxHealth
          // Continue to next enemy
        }
      }
    },

    handleLoot() {
      if (this.bugHealth === 0 && this.enemySpawned) {
        this.currentEnemy.dropOptions?.forEach((drop) => {
          if (Math.random() < drop.chance) {
            const amount =
              Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) +
              drop.amountBetween[0]
            console.log(`Loot: +${amount} ${drop.name}`)

            // Only show toast notifications if not simulating offline progress
            if (!this.isSimulatingOffline) {
              const $toast = useToast()
              $toast.success(`Loot: +${amount} ${drop.name}`)
            }

            if (drop.name === 'Seeds') {
              useGameStore().seeds += amount
            } else {
              const itemId = drop.name.toLowerCase().replace(/\s+/g, '-')
              const item = useInventoryStore().getItemById(itemId)
              if (item) {
                this.handleItemDrop(item, amount)
              } else {
                console.error(`Item ${drop.name} not found in registry`)
              }
            }
          }
        })

        this.enemySpawned = false
      }
    },
  },
})
