import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useToast} from 'vue-toast-notification'
import {useInventoryStore} from './inventoryStore'

export const useAdventureStore = defineStore('adventureStore', {
  state: () => ({
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

    currentArea: 1,
    enemyWaves: {
      1: [
        {
          name: 'Grasshopper', health: 100, attack: 8, defense: 4, regen: 2, dropOptions: [
            {name: 'Seeds', chance: 0.5, amountBetween: [100, 500]},
            {name: 'Grasshopper Leg', chance: 0.5, amountBetween: [1, 2]},
          ],
        },
        // {name: 'Beetle', health: 150, attack: 10, defense: 5, regen: 3},
        // {name: 'Wasp', health: 120, attack: 12, defense: 6, regen: 2},
      ],
    },
    currentEnemy: null,

    enemySpawned: false,
    battleRunning: false, // Combat status
    isFighting: false,    // Whether the combat is currently happening
    lastFrameTime: 0,
    accumulatedTime: 0,  // To accumulate time between frames
    combatTick: 1000,    // Combat happens every 1000ms (1 second)
  }),

  actions: {
    toggleBattle(shouldJustStart = false) {
      if (this.isFighting && !shouldJustStart) {
        console.log('Battle Stopped')
        this.stopBattle() // Stop if currently running
      } else {
        console.log('Battle Started')
        this.startBattle() // Start if not running
      }
    },

    // Start the battle loop
    startBattle() {
      this.battleRunning = true
      this.isFighting = true
      this.lastFrameTime = performance.now()
      this.accumulatedTime = 0

      // Spawn a new enemy if none exists
      if (this.bugHealth === 0) {
        this.spawnRandomEnemy()
      }

      requestAnimationFrame(this.battleLoop)
    },

    // Stop the battle loop
    stopBattle() {
      this.isFighting = false
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
      if (this.isFighting) {
        // Combat logic here
        const armyDamage = Math.max(this.armyAttack - this.bugDefense, 1)
        this.bugHealth = Math.max(this.bugHealth - armyDamage, 0)

        const bugDamage = Math.max(this.bugAttack - this.armyDefense, 1)
        this.armyHealth = Math.max(this.armyHealth - bugDamage, 0)

        if (this.armyHealth === 0) {
          this.handlePlayerDefeat()
        }

        if (this.bugHealth === 0 && this.enemySpawned) {
          this.handleEnemyDefeat()
        }
      }

      this.applyRegeneration()
    },

    handlePlayerDefeat() {
      console.log('Bug Wins!')
      this.isFighting = false
      this.applyRegeneration() // Regenerate after defeat
    },

    handleEnemyDefeat() {
      this.enemySpawned = false
      // Reward the player for winning
      this.currentEnemy.dropOptions?.forEach((drop) => {
        if (Math.random() < drop.chance) {
          const amount = Math.floor(Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1)) + drop.amountBetween[0]
          console.log(`Loot: +${amount} ${drop.name}`)
          const $toast = useToast()
          $toast.success(`Loot: +${amount} ${drop.name}`)
          if (drop.name === 'Seeds') {
            // Add seeds to inventory
            useGameStore().seeds += amount
          } else if (drop.name === 'Grasshopper Leg') {
            const inventoryStore = useInventoryStore()
            inventoryStore.addItemToInventory({
              id: 'grasshopper-leg', // Unique ID for the item
              name: 'Grasshopper Leg',
              amount,
            })
          }
        }
      })
      // Spawn a new enemy
      setTimeout(() => {
        this.spawnRandomEnemy()
      }, 3000)
    },

    applyRegeneration() {
      if (this.armyHealth < this.armyMaxHealth) {
        this.armyHealth = Math.min(this.armyHealth + this.armyRegen, this.armyMaxHealth)
      }

      if (this.bugHealth < this.bugMaxHealth && this.enemySpawned) {
        this.bugHealth = Math.min(this.bugHealth + this.bugRegen, this.bugMaxHealth)
      }
    },

    spawnRandomEnemy() {
      const enemies = this.enemyWaves[this.currentArea]
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
  },
})

