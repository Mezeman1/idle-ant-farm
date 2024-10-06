import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useInventoryStore} from './inventoryStore'
import {adventureEnemyWaves, Enemy} from '../types/AdventureEnemyWaves'
import {useResourcesStore} from '@/stores/resourcesStore'
import {itemRegistry} from '@/types/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'
import { toast } from 'vue3-toastify'
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

type BattleStatus = 'idle' | 'fighting' | 'cooldown'


export const useAdventureStore = defineStore('adventureStore', {
  state: () => ({
    loaded: false, // To track when adventure state is fully loaded
    progress: 0, // Track progress for offline calculation
    activeBuffs: [] as Array<ActiveBuff>,
    battleStatus: 'idle' as BattleStatus,

    armyHealth: 100,
    armyMaxHealth: 100,
    armyAttack: 10,
    armyDefense: 5,
    armyRegen: 5,

    armyAttackModifier: 1.0, // Multiplicative modifier for army attack
    armyDefenseModifier: 1.0, // Multiplicative modifier for army defense
    armyMaxHealthModifier: 1.0, // Multiplicative modifier for army max health
    armyRegenModifier: 1.0, // Multiplicative modifier for army regen

    bugHealth: 0,
    bugMaxHealth: 0,
    bugAttack: 0,
    bugDefense: 0,
    bugRegen: 2,

    bugAttackModifier: 1.0, // Multiplicative modifier for bug attack
    bugDefenseModifier: 1.0, // Multiplicative modifier for bug defense
    bugMaxHealthModifier: 1.0, // Multiplicative modifier for bug max health
    bugRegenModifier: 1.0, // Multiplicative modifier for bug regen

    currentArea: 'Safe Zone',
    enemyWaves: adventureEnemyWaves,
    currentEnemy: null as Enemy | null,

    enemySpawned: false,
    lastFrameTime: 0,
    accumulatedTime: 0, // To accumulate time between frames
    combatTick: 2000, // Combat happens every 2000ms (2 seconds)

    // Kill counts
    killCounts: {} as KillCounts,
    enemyKillCount: 0,

    // For offline progress
    lastSavedTime: Date.now(),
    isSimulatingOffline: false,
    animationFrameId: 0,
    regenLoopActive: false,
    toggleCooldown: false,

    toggleCooldownTimeout: 0,
    spawnEnemyTimeout: 0,
    fightingTimeout: 0,
  }),
  actions: {
    // Start the battle loop
    startBattle() {
      // Set flags immediately to prevent further calls
      this.battleStatus = 'fighting'

      this.lastFrameTime = performance.now()
      this.accumulatedTime = 0

      // Spawn a new enemy if necessary
      if (this.bugHealth === 0 || !this.enemySpawned || !this.currentEnemy) {
        this.spawnRandomEnemy()
      }
    },

    // Stop all active battles (useful when managing multiple loops)
    stopAllBattles() {
      this.battleStatus = 'idle'
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
          buff.onRemove()
          this.activeBuffs = this.activeBuffs.filter((activeBuff) => activeBuff.id !== buff.id)
        }
      })

      this.activeBuffs = this.activeBuffs.filter((buff) => buff.duration > 0)
    },
    processCombat(deltaTime) {
      if (this.battleStatus === 'fighting' && this.currentEnemy) {
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

    calculateDamage(attackerAttack, defenderDefense) {
      const variation = 0.9 + Math.random() * 0.2
      const baseDamage = attackerAttack - defenderDefense
      return Math.max(baseDamage * variation, 1)
    },

    applyArmyDamage(deltaTime) {
      const damage = this.calculateDamage(this.armyAttack, this.bugDefense) * deltaTime
      this.bugHealth = Math.max(this.bugHealth - damage, 0)
    },

    applyBugDamage(deltaTime) {
      const damage = this.calculateDamage(this.bugAttack, this.armyDefense) * deltaTime
      this.armyHealth = Math.max(this.armyHealth - damage, 0)
    },

    handlePlayerDefeat() {
      if (!this.isSimulatingOffline) {
        toast.error('You were defeated by the bug!', {
          position: 'top-left',
        })
      }

      this.currentArea = 'Safe Zone' // Reset the area to the safe zone
      this.battleStatus = 'idle'

      // Start a regeneration loop after defeat to limit full healing
      this.regenAfterDefeat()
    },

    regenAfterDefeat() {
      if (this.battleStatus === 'cooldown') {
        return // Prevent multiple regen loops
      }

      this.battleStatus = 'cooldown' // Set the battle status to regenerating
      const regenInterval = 100 // Apply regeneration every 100ms

      const defeatRegen = () => {
        if (this.armyHealth < this.armyMaxHealth) {
          this.applyDefeatRegeneration() // Apply gradual regeneration
          setTimeout(defeatRegen, regenInterval) // Continue regeneration
        } else {
          this.battleStatus = 'fighting' // Reset the battle status
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

      this.enemyKillCount += 1
    },
    async handleEnemyDrop() {
      const evolveStore = useEvolveStore()
      if (this.currentEnemy?.dropOptions) {
        for (const drop of this.currentEnemy.dropOptions) {
          // Some drops have unlockedWhen function to check if they should drop
          if (drop.unlockedWhen && !drop.unlockedWhen({
            evolveStore,
          })) {
            continue
          }

          // Check the drop chance
          if (Math.random() < drop.chance) {
            const amount =
              Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) +
              drop.amountBetween[0]

            if (drop.name === 'Seeds') {
              // Add seeds to gameStore
              useResourcesStore().resources.seeds += amount
            } else {
              // Handle item drops
              const itemId = drop.name.toLowerCase().replace(/\s+/g, '-')
              const item = useInventoryStore().getItemById(itemId)
              if (item) {
                if (!this.isSimulatingOffline) {
                  toast.success(`Loot: +${amount} ${drop.name}`, {
                    position: toast.POSITION.TOP_RIGHT,
                  })
                }
                // Await the item drop handling
                this.handleItemDrop(item, amount)
              } else {

              }
            }
          }
        }
      }
    },
    handleEnemyDefeat() {
      this.enemySpawned = false
      this.battleStatus = 'cooldown' // Set the battle status to 'cooldown

      // Update kill counts
      this.handleKillCount()

      // Handle loot
      this.handleEnemyDrop()

      if (this.spawnEnemyTimeout) {
        clearTimeout(this.spawnEnemyTimeout)
      }
      if (this.fightStatusTimeout) {
        clearTimeout(this.fightStatusTimeout)
      }

      // Spawn a new enemy after a delay
      this.spawnEnemyTimeout = setTimeout(() => {
        this.spawnRandomEnemy()

        // Set battle status back to 'fighting' after a second delay
        this.fightStatusTimeout = setTimeout(() => {
          if (this.battleStatus === 'cooldown') {
            this.battleStatus = 'fighting' // Set the battle status back to 'fighting'
          }
        }, 1000)
      }, 2000)

      // Continue applying regeneration during the cooldown phase
      this.regenDuringCooldown()
    },

    // Add regeneration during cooldown phase
    regenDuringCooldown() {
      const regenInterval = 300 // Apply regeneration every 100ms

      // Check if the regeneration loop is already running
      if (!this.regenLoopActive) {
        this.regenLoopActive = true // Mark the loop as active

        const cooldownRegen = () => {
          if (this.battleStatus === 'cooldown') {
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
    async handleItemDrop(item, amount) {
      const inventoryStore = useInventoryStore()
      await inventoryStore.addItemToInventory({
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
      if (!enemy) {
        this.currentEnemy = null
        return
      }

      this.currentEnemy = enemy

      this.bugHealth = enemy.health * this.bugMaxHealthModifier
      this.bugMaxHealth = enemy.health * this.bugMaxHealthModifier
      this.bugAttack = enemy.attack * this.bugAttackModifier
      this.bugDefense = enemy.defense * this.bugDefenseModifier
      this.bugRegen = enemy.regen * this.bugRegenModifier

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
        enemyKillCount: this.enemyKillCount,
        currentArea: this.currentArea,
        activeBuffs: this.activeBuffs.map((buff) => ({
          id: buff.id,
          name: buff.name,
          duration: buff.duration,
        })),
        battleStatus: this.battleStatus,
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
      this.enemyKillCount = adventureState.enemyKillCount ?? this.enemyKillCount

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

      this.battleStatus = adventureState.battleStatus ?? 'idle'
      this.lastSavedTime = adventureState.lastSavedTime ?? Date.now()

      await this.loadEnemyImages()

      // Mark as loaded once the state is fully set
      this.loaded = true
    },

    async loadEnemyImages() {
      for (const wave of adventureEnemyWaves) {
        for (const enemy of wave.enemies) {
          try {
            const image = await import(`../assets/enemies/${enemy.name.toLowerCase().replaceAll(' ', '-')}.webp`)
            enemy.image = image.default
          } catch (error) {

          }
        }
      }

      // Load item images
      for (const item in itemRegistry) {
        try {
          const image = await import(`../assets/items/${itemRegistry[item].name.toLowerCase().replaceAll(' ', '-')}.webp`)
          itemRegistry[item].image = image.default
        } catch (error) {
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
      this.currentArea = 'Safe Zone'
      this.enemySpawned = false
      this.currentEnemy = null
      this.battleStatus = 'idle'
    },

    // Offline progress calculation
    async calculateOfflineProgress() {
      this.loaded = false // Mark as not loaded
      if (!this.currentArea || this.currentArea === '') return Promise.resolve() // No area to calculate progress for

      try {
        return await new Promise((resolve, reject) => {
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
                resolve(null)
                return
              }

              const deltaTime = Math.min(chunkDuration, remainingTime)
              const playerDied = this.updateCombat(deltaTime)

              if (playerDied) {
                console.log('Player died during offline progress. Stopping simulation.')
                this.isSimulatingOffline = false
                resolve(null) // End the simulation early
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
      } finally {
        this.isSimulatingOffline = false
        this.loaded = true // Mark as loaded
      }
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

            if (drop.name === 'Seeds') {
              useResourcesStore().collectSeedsManually(amount)
            } else {
              const itemId = drop.name.toLowerCase().replace(/\s+/g, '-')
              const item = useInventoryStore().getItemById(itemId)
              if (item) {
                // Only show toast notifications if not simulating offline progress
                if (!this.isSimulatingOffline) {
                  toast.success(`Loot: +${amount} ${drop.name}`, {
                    position: 'top-right',
                  })
                }
                this.handleItemDrop(item, amount)
              } else {

              }
            }
          }
        })

        this.enemySpawned = false
      }
    },

    setupAdventureStats() {
      const gameStore = useGameStore()
      const resourcesStore = useResourcesStore()
      const inventoryStore = useInventoryStore()
      if (resourcesStore.resources.ants === 0 && resourcesStore.resources.queens <= 1) return

      const baseAttack =
        resourcesStore.resources.ants * gameStore.attackPerAnt +
        (resourcesStore.resources.queens - 1) *
        gameStore.attackPerAnt *
        resourcesStore.resourceCosts.antCostPerQueen +
        resourcesStore.resources.soldiers * gameStore.attackPerSoldier
      const baseDefense =
        resourcesStore.resources.ants * gameStore.defensePerAnt +
        (resourcesStore.resources.queens - 1) *
        gameStore.defensePerAnt *
        resourcesStore.resourceCosts.antCostPerQueen +
        resourcesStore.resources.soldiers * gameStore.defensePerSoldier
      const baseHealth =
        resourcesStore.resources.ants * gameStore.healthPerAnt +
        (resourcesStore.resources.queens - 1) *
        gameStore.healthPerAnt *
        resourcesStore.resourceCosts.antCostPerQueen +
        resourcesStore.resources.soldiers * gameStore.healthPerSoldier

      // Apply modifiers
      this.armyAttack = baseAttack * this.armyAttackModifier
      this.armyDefense = baseDefense * this.armyDefenseModifier
      this.armyMaxHealth = baseHealth * this.armyMaxHealthModifier
      this.armyRegen = 5 * this.armyRegenModifier

      // Ensure current health does not exceed max health
      if (this.armyHealth > this.armyMaxHealth) {
        this.armyHealth = this.armyMaxHealth
      }

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
