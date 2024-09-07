import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useToast} from 'vue-toast-notification'
import {useInventoryStore} from './inventoryStore'
import {itemRegistry} from '../types/itemRegistry'
import { set, get, del } from 'idb-keyval'
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

      currentArea: 'Wasteland',
      enemyWaves: [
        {
          name: 'Wasteland',
          enemies: [
            {
              name: 'Grasshopper', health: 100, attack: 8, defense: 4, regen: 2, dropOptions: [
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
              health: 200,
              attack: 15,
              defense: 8,
              regen: 4,
              dropOptions: [
                {
                  name: 'Seeds',
                  chance: 0.5,
                  amountBetween: [100, 500],
                },
                {
                  name: 'Spider Silk',
                  chance: 0.3,
                  amountBetween: [1, 2],
                },
              ],
            },
            {
              name: 'Centipede',
              health: 250,
              attack: 18,
              defense: 10,
              regen: 5,
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
              health: 180,
              attack: 14,
              defense: 7,
              regen: 3,
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
          ],
          unlocked: true,
        },
      ],
      currentEnemy: null,

      enemySpawned: false,
      battleRunning: false, // Combat status
      isFighting: false,    // Whether the combat is currently happening
      lastFrameTime: 0,
      accumulatedTime: 0,  // To accumulate time between frames
      combatTick: 1000,    // Combat happens every 1000ms (1 second)

      // Kill counts
      killCounts: {
        grasshopperKills: 0,
        beetleKills: 0,
        waspKills: 0,
      },
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

        // Update kill counts
        this.killCounts[this.currentEnemy.name.toLowerCase().replace(/\s+/g, '') + 'Kills'] += 1

        // Handle loot
        this.currentEnemy.dropOptions?.forEach((drop) => {
          if (Math.random() < drop.chance) {
            const amount = Math.floor(
              Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1),
            ) + drop.amountBetween[0]
            console.log(`Loot: +${amount} ${drop.name}`)

            const $toast = useToast()
            $toast.success(`Loot: +${amount} ${drop.name}`)

            if (drop.name === 'Seeds') {
              // Add seeds to gameStore
              useGameStore().seeds += amount
            } else {
              // Handle item drops
              const item = itemRegistry[drop.name.toLowerCase().replace(/\s+/g, '-')]
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
        }, 3000)
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

      applyRegeneration() {
        if (this.armyHealth < this.armyMaxHealth) {
          this.armyHealth = Math.min(this.armyHealth + this.armyRegen, this.armyMaxHealth)
        }

        if (this.bugHealth < this.bugMaxHealth && this.enemySpawned) {
          this.bugHealth = Math.min(this.bugHealth + this.bugRegen, this.bugMaxHealth)
        }
      },

      spawnRandomEnemy() {
        const enemies = this.enemyWaves.find(wave => wave.name === this.currentArea)?.enemies
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

      // Save adventure state using IndexedDB
      async saveAdventureState() {
        const adventureState = {
          armyHealth: this.armyHealth,
          armyMaxHealth: this.armyMaxHealth,
          armyAttack: this.armyAttack,
          armyDefense: this.armyDefense,
          armyRegen: this.armyRegen,
          killCounts: this.killCounts,
        }

        try {
          await set('adventure', JSON.parse(JSON.stringify(adventureState)))
          console.log('Adventure state saved to IndexedDB')
        } catch (error) {
          console.error('Error saving adventure state:', error)
        }
      },

      // Load adventure state using IndexedDB
      async loadAdventureState() {
        try {
          const adventureState = await get('adventure')
          if (adventureState) {
            this.armyHealth = adventureState.armyHealth ?? this.armyHealth
            this.armyMaxHealth = adventureState.armyMaxHealth ?? this.armyMaxHealth
            this.armyAttack = adventureState.armyAttack ?? this.armyAttack
            this.armyDefense = adventureState.armyDefense ?? this.armyDefense
            this.armyRegen = adventureState.armyRegen ?? this.armyRegen
            this.killCounts = adventureState.killCounts ?? this.killCounts

            console.log('Adventure state loaded from IndexedDB')
          } else {
            console.log('No adventure state found in IndexedDB')
          }
        } catch (error) {
          console.error('Error loading adventure state:', error)
        }
      },

      // Reset adventure state and clear IndexedDB
      async resetAdventureState() {
        try {
          await del('adventure')
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

          console.log('Adventure state reset and cleared from IndexedDB')
        } catch (error) {
          console.error('Error resetting adventure state:', error)
        }
      },
    },
  },
)

