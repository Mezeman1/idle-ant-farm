import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useToast} from 'vue-toast-notification'
import {useInventoryStore} from './inventoryStore'
import {adventureEnemyWaves, Enemy} from '../types/AdventureEnemyWaves'

interface KillCounts {
  [key: string]: number
}

interface ActiveBuff {
  id: string
  name: string
  duration: number
  effect: () => void
  onRemove: () => void
  active?: boolean
}


export const useAdventureStore = defineStore('adventureStore', {
  state: () => ({
    loaded: false, // To track when adventure state is fully loaded
    progress: 0, // Track progress for offline calculation
    activeBuffs: [] as Array<ActiveBuff>,

    armyHealth: 100,
    armyMaxHealth: 100,
    armyAttack: 10,
    armyDefense: 5,
    armyRegen: 5,

    armyAttackModifier: 1.0, // Multiplicative modifier for army attack
    armyDefenseModifier: 1.0, // Multiplicative modifier for army defense
    armyMaxHealthModifier: 1.0, // Multiplicative modifier for army max health

    bugHealth: 0,
    bugMaxHealth: 0,
    bugAttack: 0,
    bugDefense: 0,
    bugRegen: 2,

    currentArea: '',
    enemyWaves: adventureEnemyWaves,
    currentEnemy: null as Enemy | null,

    enemySpawned: false,
    battleRunning: false, // Combat status
    isFighting: false, // Whether the combat is currently happening
    battleCooldown: false,
    lastFrameTime: 0,
    accumulatedTime: 0, // To accumulate time between frames
    combatTick: 2000, // Combat happens every 2000ms (2 seconds)

    // Kill counts
    killCounts: {} as KillCounts,

    // For offline progress
    lastSavedTime: Date.now(),
    isSimulatingOffline: false,
    animationFrameId: 0,
    regenLoopActive: false,
    toggleCooldown: false,

    animationFrameIds: [] as Array<number>,  // Array to store multiple animation frame IDs
    loopActive: [] as Array<number>,  // Array to track if loops are active

    toggleCooldownTimeout: 0,
  }),
  actions: {
    toggleBattle() {
      // Always allow stopping the battle
      if (this.isFighting || this.battleCooldown) {
        this.stopAllBattles() // Stop all active loops
        return
      }

      // Apply cooldown only when trying to start the battle
      if (this.battleRunning || this.toggleCooldown) {
        return // Prevent starting multiple loops or rapid starts
      }

      if (this.toggleCooldown) {
        console.log('Battle toggle is on cooldown')
        return // Prevent starting multiple loops during cooldown
      }

      // Start the battle if not already running
      this.startBattle()
    },

    // Start the battle loop
    startBattle() {
      this.stopAllBattles() // Stop any existing battle before starting a new one

      // Clear any previous toggle cooldown timeout
      if (this.toggleCooldownTimeout) {
        clearTimeout(this.toggleCooldownTimeout)
      }

      // Set a cooldown to prevent rapid toggling
      this.toggleCooldown = true
      this.toggleCooldownTimeout = setTimeout(() => {
        this.toggleCooldown = false
        this.toggleCooldownTimeout = 0 // Clear the timeout reference after it's done
      }, 3000) // Adjust cooldown period as needed

      // Check if the loop is already active to avoid multiple starts
      if (this.battleRunning) {
        console.warn('Battle loop is already running')
        return // Prevent starting multiple loops
      }

      // Set flags immediately to prevent further calls
      this.battleRunning = true
      this.isFighting = true

      console.log('Battle Loop Started')
      this.lastFrameTime = performance.now()
      this.accumulatedTime = 0

      // Spawn a new enemy if necessary
      if (this.bugHealth === 0 || !this.enemySpawned) {
        this.spawnRandomEnemy()
      }

      // Start the battle loop and store the animation frame ID in the array
      const animationFrameId = requestAnimationFrame(this.battleLoop)
      this.animationFrameIds.push(animationFrameId) // Store each new loop's ID
      this.loopActive.push(true) // Keep track of the active loop

      console.log('Battle Started')
    },

    // Stop the battle loop
    stopBattle() {
      // Always allow stopping, regardless of cooldown
      this.isFighting = false
      this.battleRunning = false
      this.battleCooldown = false

      // Cancel the animation frames to stop the loop
      if (this.animationFrameIds.length > 0) {
        this.animationFrameIds.forEach((id) => cancelAnimationFrame(id))
        this.animationFrameIds = [] // Clear the array of animation frame IDs
      }

      this.loopActive = []  // Ensure the loops can be restarted after stopping

      console.log('Battle Stopped')
    },

    // Stop all active battles (useful when managing multiple loops)
    stopAllBattles() {
      if (this.animationFrameIds.length > 0) {
        console.log('Stopping all battles')
        this.animationFrameIds.forEach((id) => cancelAnimationFrame(id))
        this.animationFrameIds = [] // Clear the array of animation frame IDs
      }
      this.loopActive = []  // Clear all loop active states
      this.battleRunning = false
      this.isFighting = false
      this.battleCooldown = false
      console.log('All battles stopped')
    },

    // Main battle loop with requestAnimationFrame (tick-based)
    battleLoop(currentTime) {
      if (this.loaded === false) return

      if (!this.battleRunning) {
        console.log('Battle loop stopped')
        this.loopActive = this.loopActive.map(() => false) // Ensure the loop is fully inactive when stopped
        return
      }

      const deltaTime = (currentTime - this.lastFrameTime) / 1000 // Convert time to seconds
      this.lastFrameTime = currentTime
      this.accumulatedTime += deltaTime

      // Process combat every tick (based on how much time has passed)
      this.applyBuffs(deltaTime)
      this.processCombat(deltaTime)

      // Continue the loop as long as the battle is active
      if (this.battleRunning) {
        const newAnimationFrameId = requestAnimationFrame(this.battleLoop)
        this.animationFrameIds.push(newAnimationFrameId) // Keep adding new frame IDs to the array
      }
    },
    applyBuffs(deltaTime) {
      this.activeBuffs.forEach((buff) => {
        if (buff.active) {
          buff.duration -= deltaTime
        }

        if (buff.duration > 0 && !buff.active && buff.effect) {
          buff.effect()
          buff.active = true
        }

        if (buff.duration <= 0 && buff.active && buff.onRemove) {
          console.log(`Buff ${buff.id} expired`)
          buff.onRemove()
          this.activeBuffs = this.activeBuffs.filter((activeBuff) => activeBuff.id !== buff.id)
        }
      })
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
      if (!this.isSimulatingOffline) {
        const $toast = useToast()
        $toast.error('You were defeated by the bug!')
      }
      this.isFighting = false

      // Start a regeneration loop after defeat to limit full healing
      this.regenAfterDefeat()
    },

    regenAfterDefeat() {
      if (this.battleCooldown) {
        console.log('Regeneration is already running.')
        return // Prevent multiple regen loops
      }

      this.battleCooldown = true // Enter cooldown state
      const regenInterval = 100 // Apply regeneration every 100ms

      const defeatRegen = () => {
        if (this.armyHealth < this.armyMaxHealth) {
          this.applyDefeatRegeneration() // Apply gradual regeneration
          setTimeout(defeatRegen, regenInterval) // Continue regeneration
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
      const killKey = this.currentEnemy?.name.toLowerCase().replace(/\s+/g, '') + 'Kills'
      if (this.killCounts[killKey] !== undefined) {
        this.killCounts[killKey] += 1
      } else {
        this.killCounts[killKey] = 1 // Initialize if not present
      }
    },
    handleEnemyDrop() {
      this.currentEnemy?.dropOptions?.forEach((drop) => {
        if (Math.random() < drop.chance) {
          const amount =
            Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) +
            drop.amountBetween[0]

          if (!this.isSimulatingOffline) {
            const $toast = useToast()
            $toast.success(`Loot: +${amount} ${drop.name}`)
          }

          if (drop.name === 'Seeds') {
            // Add seeds to gameStore
            useGameStore().resources.seeds += amount
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
          if (this.battleCooldown || this.isFighting) {
            this.applyRegeneration() // Apply regeneration
            setTimeout(cooldownRegen, regenInterval) // Continue regenerating during cooldown
          } else {
            this.regenLoopActive = false // Stop the loop when battle resumes
          }
        }

        cooldownRegen() // Start the regeneration loop during cooldown
      }
    },

    applyDefeatRegeneration() {
      const regenPercentage = 0.1 // 10% regeneration per tick

      // Calculate 10% of the army's max health and apply it to the current health
      const healthToRegen = this.armyMaxHealth * regenPercentage

      // Apply the regeneration, but don't exceed max health
      this.armyHealth = Math.min(this.armyHealth + healthToRegen, this.armyMaxHealth)
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
    getAdventureState() {
      return {
        armyHealth: this.armyHealth,
        armyMaxHealth: this.armyMaxHealth,
        armyAttack: this.armyAttack,
        armyDefense: this.armyDefense,
        armyRegen: this.armyRegen,
        killCounts: this.killCounts,
        currentArea: this.currentArea,
        activeBuffs: this.activeBuffs.map((buff) => ({
          id: buff.id,
          name: buff.name,
          duration: buff.duration,
        })),
        isFighting: this.isFighting || this.battleCooldown, // Save the current battle state
      }
    },

    // Load adventure state from Firebase Firestore
    async loadAdventureState(adventureState) {
      this.loaded = false // Mark as not loaded

      // Load the saved state
      this.armyHealth = adventureState.armyHealth ?? this.armyHealth
      this.armyMaxHealth = adventureState.armyMaxHealth ?? this.armyMaxHealth
      this.armyAttack = adventureState.armyAttack ?? this.armyAttack
      this.armyDefense = adventureState.armyDefense ?? this.armyDefense
      this.armyRegen = adventureState.armyRegen ?? this.armyRegen
      this.killCounts = adventureState.killCounts ?? this.killCounts
      this.currentArea = adventureState.currentArea ?? this.currentArea

      const inventoryStore = useInventoryStore()
      this.activeBuffs = adventureState.activeBuffs?.map((buff) => {
        const itemFromName = inventoryStore.getItemById(buff.name)
        return {
          ...buff,
          active: false,
          effect: itemFromName?.effect,
          onRemove: itemFromName?.onRemove,
        }
      }) ?? []

      this.isFighting = adventureState.isFighting ?? false
      this.lastSavedTime = adventureState.lastSavedTime ?? Date.now()

      await this.loadEnemyImages()

      // Mark as loaded once the state is fully set
      this.loaded = true
    },

    async loadEnemyImages() {
      for (const wave of adventureEnemyWaves) {
        for (const enemy of wave.enemies) {
          try {
            const image = await import(`../assets/enemies/${enemy.name.toLowerCase().replace(' ', '-')}.webp`)
            enemy.image = image.default
          } catch (error) {
            console.error(`Error loading image for ${enemy.name}:`, error)
          }
        }
      }
    },


    // Reset adventure state and clear from Firebase Firestore
    async resetAdventureState() {

      // Reset the local adventure state
      this.armyHealth = 100
      this.armyMaxHealth = 100
      this.armyAttack = 10
      this.armyDefense = 5
      this.armyRegen = 5
      this.lastSavedTime = Date.now()
      this.currentArea = ''
    },

    // Offline progress calculation
    calculateOfflineProgress() {
      if (!this.currentArea) return Promise.resolve() // No area to calculate progress for

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
            const playerDied = this.updateCombat(deltaTime)

            if (playerDied) {
              console.log('Player died during offline progress. Stopping simulation.')
              this.isSimulatingOffline = false
              resolve() // End the simulation early
              return
            }

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
        this.applyArmyDamage(this.combatTick / 1000)

        // Bug attacks the army
        this.applyBugDamage(this.combatTick / 1000)

        // Check if either the army or the bug is defeated
        if (this.armyHealth === 0) {
          this.handlePlayerDefeat()
          return true // Stop combat if the player is defeated
        }

        if (this.bugHealth === 0) {
          this.handleEnemyDefeat()
          // After defeating an enemy, reset health for army (optional)
          // this.armyHealth = this.armyMaxHealth
          // Continue to next enemy
        }

        this.applyRegeneration(deltaTime) // Simulate health regeneration
      }

      return false
    },

    handleLoot() {
      if (this.bugHealth === 0 && this.enemySpawned) {
        this.currentEnemy?.dropOptions?.forEach((drop) => {
          if (Math.random() < drop.chance) {
            const amount =
              Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) +
              drop.amountBetween[0]

            // Only show toast notifications if not simulating offline progress
            if (!this.isSimulatingOffline) {
              const $toast = useToast()
              $toast.success(`Loot: +${amount} ${drop.name}`)
            }

            if (drop.name === 'Seeds') {
              useGameStore().collectSeedsManually(amount)
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

    setupAdventureStats() {
      const gameStore = useGameStore()
      const inventoryStore = useInventoryStore()
      if (gameStore.resources.ants === 0 && gameStore.resources.queens <= 1) return

      const baseAttack =
        gameStore.resources.ants * gameStore.attackPerAnt +
        (gameStore.resources.queens - 1) *
        gameStore.attackPerAnt *
        gameStore.resourceCosts.antCostPerQueen
      const baseDefense =
        gameStore.resources.ants * gameStore.defensePerAnt +
        (gameStore.resources.queens - 1) *
        gameStore.defensePerAnt *
        gameStore.resourceCosts.antCostPerQueen
      const baseHealth =
        gameStore.resources.ants * gameStore.healthPerAnt +
        (gameStore.resources.queens - 1) *
        gameStore.healthPerAnt *
        gameStore.resourceCosts.antCostPerQueen

      // Apply modifiers
      this.armyAttack = baseAttack * this.armyAttackModifier
      this.armyDefense = baseDefense * this.armyDefenseModifier
      this.armyMaxHealth = baseHealth * this.armyMaxHealthModifier

      // Ensure current health does not exceed max health
      if (this.armyHealth > this.armyMaxHealth) {
        this.armyHealth = this.armyMaxHealth
      }

      this.armyRegen = 5
      this.activeBuffs = this.activeBuffs?.map((buff) => {
        return {
          ...buff,
          active: false,
        }
      })

      inventoryStore.reApplyPassiveEffects()
      this.armyHealth = Math.min(this.armyHealth, this.armyMaxHealth)
    },
  },
})
