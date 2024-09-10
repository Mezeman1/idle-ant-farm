import { defineStore } from 'pinia'
import { useGameStore } from './gameStore'
import { useToast } from 'vue-toast-notification'
import { useInventoryStore } from './inventoryStore'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

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
    enemyWaves: [
      {
        name: 'Wasteland',
        enemies: [
          {
            name: 'Grasshopper',
            health: 100,
            attack: 8,
            defense: 4,
            regen: 2,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Grasshopper Leg',
                chance: 0.2,
                amountBetween: [1, 2],
              },
            ],
          },
          {
            name: 'Beetle',
            health: 150,
            attack: 10,
            defense: 5,
            regen: 3,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Ant Strength Potion',
                chance: 0.1,
                amountBetween: [1, 2],
              },
            ],
          },
          {
            name: 'Wasp',
            health: 120,
            attack: 12,
            defense: 6,
            regen: 2,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Queen Crown',
                chance: 0.05,
                amountBetween: [1, 1],
              },
            ],
          },
        ],
        unlocked: true,
      },
      {
        name: 'Forest',
        enemies: [
          {
            name: 'Spider',
            health: 2000,
            attack: 150,
            defense: 80,
            regen: 40,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Spider Silk',
                chance: 0.05,
                amountBetween: [1, 2],
              },
            ],
          },
          {
            name: 'Centipede',
            health: 2500,
            attack: 180,
            defense: 100,
            regen: 50,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Centipede Leg',
                chance: 0.2,
                amountBetween: [1, 2],
              },
            ],
          },
          {
            name: 'Moth',
            health: 1800,
            attack: 140,
            defense: 70,
            regen: 30,
            dropOptions: [
              {
                name: 'Seeds',
                chance: 0.5,
                amountBetween: [100, 500],
              },
              {
                name: 'Moth Dust',
                chance: 0.1,
                amountBetween: [1, 2],
              },
            ],
          },
          {
            name: 'Butterfly',
            health: 3000,
            attack: 200,
            defense: 120,
            regen: 60,
            dropOptions: [
              {
                name: 'Butterfly Wing',
                chance: 0.01,
                amountBetween: [1, 2],
              },
              {
                name: 'Butterfly Dust',
                chance: 0.05,
                amountBetween: [1, 1],
              },
            ],
          },
        ],
        unlocked: true,
      },
    ],
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

      requestAnimationFrame(this.battleLoop)
    },

    // Stop the battle loop
    stopBattle() {
      this.isFighting = false
      this.battleRunning = false
      this.battleCooldown = false
    },

    // Main battle loop with requestAnimationFrame
    battleLoop(currentTime) {
      const deltaTime = currentTime - this.lastFrameTime
      this.lastFrameTime = currentTime
      this.accumulatedTime += deltaTime

      // Process combat if the accumulated time exceeds the tick threshold
      if (this.accumulatedTime >= this.combatTick) {
        this.processCombat()
        this.accumulatedTime = 0
      }

      // Keep running the loop as long as the battle is running
      if (this.battleRunning) {
        requestAnimationFrame(this.battleLoop)
      }
    },

    processCombat() {
      if (this.isFighting && this.enemySpawned) {
        this.applyArmyDamage()
        this.applyBugDamage()

        if (this.armyHealth === 0) {
          this.handlePlayerDefeat()
        }

        if (this.bugHealth === 0) {
          this.handleEnemyDefeat()
        }
      }

      this.applyRegeneration() // No params for real-time loop
    },

    applyArmyDamage() {
      const armyDamage = Math.max(this.armyAttack - this.bugDefense, 1)
      this.bugHealth = Math.max(this.bugHealth - armyDamage, 0)
    },

    applyBugDamage() {
      const bugDamage = Math.max(this.bugAttack - this.armyDefense, 1)
      this.armyHealth = Math.max(this.armyHealth - bugDamage, 0)
    },

    handlePlayerDefeat() {
      console.log('Bug Wins!')
      this.isFighting = false
      this.applyRegeneration() // Regenerate after defeat
    },

    handleEnemyDefeat() {
      this.enemySpawned = false
      this.battleCooldown = true // Enter cooldown state
      this.isFighting = false

      // Update kill counts
      const killKey = this.currentEnemy.name.toLowerCase().replace(/\s+/g, '') + 'Kills'
      if (this.killCounts[killKey] !== undefined) {
        this.killCounts[killKey] += 1
      } else {
        this.killCounts[killKey] = 1 // Initialize if not present
      }

      // Handle loot
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
      const regenTicks = deltaTime ? Math.floor(deltaTime) : 1 // Use deltaTime for offline, or 1 tick for real-time

      // Apply army regeneration
      this.armyHealth = Math.min(
        this.armyHealth + this.armyRegen * regenTicks,
        this.armyMaxHealth,
      )

      // Apply bug regeneration if the bug was spawned
      if (this.enemySpawned) {
        this.bugHealth = Math.min(
          this.bugHealth + this.bugRegen * regenTicks,
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

      console.log(`New Enemy Spawned: ${enemy.name}`)
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
          const timeElapsed = (currentTime - this.lastSavedTime) / 1000
          console.log(`Time elapsed (offline): ${timeElapsed} seconds`)

          let remainingTime = timeElapsed
          const chunkDuration = 60

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
            this.updateCombat(deltaTime)
            this.applyRegeneration(deltaTime)
            this.handleLoot()

            remainingTime -= deltaTime
            this.progress = Math.min(100, ((timeElapsed - remainingTime) / timeElapsed) * 100) // Update progress

            setTimeout(simulateOffline, 0)
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
