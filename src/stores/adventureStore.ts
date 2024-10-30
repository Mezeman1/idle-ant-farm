import {defineStore} from 'pinia'
import {useGameStore} from './gameStore'
import {useInventoryStore} from './inventoryStore'
import {adventureEnemyWaves, Enemy} from '../types/AdventureEnemyWaves'
import {useResourcesStore} from '@/stores/resourcesStore'
import {getItemName, Item, itemRegistry} from '@/types/items/itemRegistry'
import {useEvolveStore} from '@/stores/evolveStore'
import {toast} from 'vue3-toastify'
import {useSettingsStore} from '@/stores/settingsStore'
import {useBossStore} from '@/stores/bossStore'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useTrainingStore} from '@/stores/trainingStore'
import {ForagingArea, Skill} from '@/types/trainingTypes'
import {useAchievementStore} from '@/stores/achievementStore'

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

interface StatusEffect {
  id: string
  name: string
  type: 'poison' | 'burn' | 'freeze' | 'regen' | 'bleed'
  duration: number
  damagePerSecond?: number
  healingPerSecond?: number
}

type BattleStatus = 'idle' | 'fighting' | 'cooldown'


export const useAdventureStore = defineStore('adventureStore', {
  state: () => ({
    loaded: false, // To track when adventure state is fully loaded
    progress: 0, // Track progress for offline calculation
    activeBuffs: [] as Array<ActiveBuff>,
    battleStatus: 'idle' as BattleStatus,

    battleStyle: Skill.Attack as Skill.Defense | Skill.Attack | Skill.Hitpoints,

    armyHealth: 100,
    armyMaxHealth: 100,
    armyAttack: 10,
    armyDefense: 5,
    armyRegen: 5,

    armyActiveEffects: [] as Array<StatusEffect>,

    armyAttackModifier: 1.0, // Multiplicative modifier for army attack
    armyDefenseModifier: 1.0, // Multiplicative modifier for army defense
    armyMaxHealthModifier: 1.0, // Multiplicative modifier for army max health
    armyRegenModifier: 1.0, // Multiplicative modifier for army regen

    armyBossAttackModifier: 1.0, // Multiplicative modifier for army attack against bosses
    armyBossDefenseModifier: 1.0, // Multiplicative modifier for army defense against bosses
    armyBossMaxHealthModifier: 1.0, // Multiplicative modifier for army max health against bosses
    armyBossRegenModifier: 1.0, // Multiplicative modifier for army regen against bosses

    poisonChance: 0.0,
    poisonDamage: 10,
    poisonDuration: 2,

    bleedChance: 0.0,
    bleedDamage: 100,
    bleedDuration: 2,

    bugHealth: 0,
    bugMaxHealth: 0,
    bugAttack: 0,
    bugDefense: 0,
    bugRegen: 2,

    bugActiveEffects: [] as Array<StatusEffect>,

    bugAttackModifier: 1.0, // Multiplicative modifier for bug attack
    bugDefenseModifier: 1.0, // Multiplicative modifier for bug defense
    bugMaxHealthModifier: 1.0, // Multiplicative modifier for bug max health
    bugRegenModifier: 1.0, // Multiplicative modifier for bug regen

    currentArea: 'Safe Zone',
    enemyWaves: [],
    areaModifiers: {
      [ForagingArea.Forest]: {
        dropChanceModifier: 1.0,
        dropAmountModifier: 1.0,
        xpModifier: 1.0,
        speedModifier: 1.0,
        spawnTimeModifier: 1.0,
        coolDownModifier: 1.0,
      },
    },

    milestones: [
      { kills: 50, modifiers: { xpModifier: 1.1 } },
      { kills: 100, modifiers: { xpModifier: 1.2, dropChanceModifier: 1.1 } },
      { kills: 200, modifiers: { xpModifier: 1.3, speedModifier: 1.1 } },
      { kills: 300, modifiers: { xpModifier: 1.4, dropAmountModifier: 1.1 } },
      { kills: 400, modifiers: { xpModifier: 1.5, coolDownModifier: 1.1 } },
      { kills: 500, modifiers: { xpModifier: 1.6, spawnTimeModifier: 1.1 } },
      { kills: 600, modifiers: { xpModifier: 1.7, dropChanceModifier: 1.2 } },
      { kills: 700, modifiers: { xpModifier: 1.8, speedModifier: 1.2 } },
      { kills: 800, modifiers: { xpModifier: 1.9, dropAmountModifier: 1.2 } },
      { kills: 900, modifiers: { xpModifier: 2.0, coolDownModifier: 1.2 } },
      { kills: 1000, modifiers: { xpModifier: 2.1, spawnTimeModifier: 1.2 } },
      { kills: 1200, modifiers: { xpModifier: 2.2, dropChanceModifier: 1.3 } },
      { kills: 1400, modifiers: { xpModifier: 2.3, speedModifier: 1.3 } },
      { kills: 1600, modifiers: { xpModifier: 2.4, dropAmountModifier: 1.3 } },
      { kills: 1800, modifiers: { xpModifier: 2.5, coolDownModifier: 1.3 } },
      { kills: 2000, modifiers: { xpModifier: 2.6, spawnTimeModifier: 1.3 } },
      { kills: 2500, modifiers: { xpModifier: 2.7, dropChanceModifier: 1.4 } },
      { kills: 3000, modifiers: { xpModifier: 2.8, speedModifier: 1.4 } },
      { kills: 3500, modifiers: { xpModifier: 2.9, dropAmountModifier: 1.4 } },
      { kills: 4000, modifiers: { xpModifier: 3.0, coolDownModifier: 1.4 } },
      { kills: 4500, modifiers: { xpModifier: 3.1, spawnTimeModifier: 1.4 } },
      { kills: 5000, modifiers: { xpModifier: 3.2, dropChanceModifier: 1.5 } },
      { kills: 6000, modifiers: { xpModifier: 3.3, speedModifier: 1.5 } },
      { kills: 7000, modifiers: { xpModifier: 3.4, dropAmountModifier: 1.5 } },
      { kills: 8000, modifiers: { xpModifier: 3.5, coolDownModifier: 1.5 } },
      { kills: 9000, modifiers: { xpModifier: 3.6, spawnTimeModifier: 1.5 } },
      { kills: 10000, modifiers: { xpModifier: 3.7, dropChanceModifier: 1.6 } },
      { kills: 12000, modifiers: { xpModifier: 3.8, speedModifier: 1.6 } },
      { kills: 14000, modifiers: { xpModifier: 3.9, dropAmountModifier: 1.6 } },
      { kills: 16000, modifiers: { xpModifier: 4.0, coolDownModifier: 1.6 } },
      { kills: 18000, modifiers: { xpModifier: 4.1, spawnTimeModifier: 1.6 } },
      { kills: 20000, modifiers: { xpModifier: 4.2, dropChanceModifier: 1.7 } },
      { kills: 25000, modifiers: { xpModifier: 4.3, speedModifier: 1.7 } },
      { kills: 30000, modifiers: { xpModifier: 4.4, dropAmountModifier: 1.7 } },
      { kills: 35000, modifiers: { xpModifier: 4.5, coolDownModifier: 1.7 } },
      { kills: 40000, modifiers: { xpModifier: 4.6, spawnTimeModifier: 1.7 } },
      { kills: 45000, modifiers: { xpModifier: 4.7, dropChanceModifier: 1.8 } },
      { kills: 50000, modifiers: { xpModifier: 4.8, speedModifier: 1.8 } },
      { kills: 60000, modifiers: { xpModifier: 4.9, dropAmountModifier: 1.8 } },
      { kills: 70000, modifiers: { xpModifier: 5.0, coolDownModifier: 1.8 } },
      { kills: 80000, modifiers: { dropChanceModifier: 1.9, spawnTimeModifier: 1.8 } },
      { kills: 90000, modifiers: { speedModifier: 1.9, dropAmountModifier: 1.9 } },
      { kills: 100000, modifiers: { coolDownModifier: 1.9, dropChanceModifier: 2.0 } },
      { kills: 120000, modifiers: { spawnTimeModifier: 1.9, dropAmountModifier: 2.0 } },
      { kills: 140000, modifiers: { speedModifier: 2.0, dropChanceModifier: 2.1 } },
      { kills: 160000, modifiers: { coolDownModifier: 2.0, dropAmountModifier: 2.1 } },
      { kills: 180000, modifiers: { spawnTimeModifier: 2.0, dropChanceModifier: 2.2 } },
      { kills: 200000, modifiers: { speedModifier: 2.1, dropAmountModifier: 2.2 } },
      { kills: 250000, modifiers: { coolDownModifier: 2.1, dropChanceModifier: 2.3 } },
      { kills: 300000, modifiers: { spawnTimeModifier: 2.1, dropAmountModifier: 2.3 } },
      { kills: 350000, modifiers: { speedModifier: 2.2, dropChanceModifier: 2.4 } },
      { kills: 400000, modifiers: { coolDownModifier: 2.2, dropAmountModifier: 2.4 } },
      { kills: 450000, modifiers: { spawnTimeModifier: 2.2, dropChanceModifier: 2.5 } },
      { kills: 500000, modifiers: { speedModifier: 2.3, dropAmountModifier: 2.5 } },
      { kills: 600000, modifiers: { coolDownModifier: 2.3, dropChanceModifier: 2.6 } },
      { kills: 700000, modifiers: { spawnTimeModifier: 2.3, dropAmountModifier: 2.6 } },
      { kills: 800000, modifiers: { speedModifier: 2.4, dropChanceModifier: 2.7 } },
      { kills: 900000, modifiers: { coolDownModifier: 2.4, dropAmountModifier: 2.7 } },
      { kills: 1000000, modifiers: { spawnTimeModifier: 2.4, dropChanceModifier: 2.8 } },
      { kills: 1200000, modifiers: { speedModifier: 2.5, dropAmountModifier: 2.8 } },
      { kills: 1400000, modifiers: { coolDownModifier: 2.5, dropChanceModifier: 2.9 } },
      { kills: 1600000, modifiers: { spawnTimeModifier: 2.5, dropAmountModifier: 2.9 } },
      { kills: 1800000, modifiers: { speedModifier: 2.6, dropChanceModifier: 3.0 } },
      { kills: 2000000, modifiers: { coolDownModifier: 2.6, dropAmountModifier: 3.0 } },
      { kills: 2500000, modifiers: { spawnTimeModifier: 2.6, dropChanceModifier: 3.2 } },
      { kills: 3000000, modifiers: { speedModifier: 2.7, dropAmountModifier: 3.2 } },
      { kills: 3500000, modifiers: { coolDownModifier: 2.7, dropChanceModifier: 3.4 } },
      { kills: 4000000, modifiers: { spawnTimeModifier: 2.7, dropAmountModifier: 3.4 } },
      { kills: 4500000, modifiers: { speedModifier: 2.8, dropChanceModifier: 3.6 } },
      { kills: 5000000, modifiers: { coolDownModifier: 2.8, dropAmountModifier: 3.6 } },
      { kills: 6000000, modifiers: { spawnTimeModifier: 2.8, dropChanceModifier: 3.8 } },
      { kills: 7000000, modifiers: { speedModifier: 2.9, dropAmountModifier: 3.8 } },
      { kills: 8000000, modifiers: { coolDownModifier: 2.9, dropChanceModifier: 4.0 } },
      { kills: 9000000, modifiers: { spawnTimeModifier: 2.9, dropAmountModifier: 4.0 } },
      { kills: 10000000, modifiers: { speedModifier: 3.0, dropChanceModifier: 4.2 } },
      { kills: 12000000, modifiers: { coolDownModifier: 3.0, dropAmountModifier: 4.2 } },
      { kills: 14000000, modifiers: { spawnTimeModifier: 3.0, dropChanceModifier: 4.4 } },
      { kills: 16000000, modifiers: { speedModifier: 3.1, dropAmountModifier: 4.4 } },
      { kills: 18000000, modifiers: { coolDownModifier: 3.1, dropChanceModifier: 4.6 } },
      { kills: 20000000, modifiers: { spawnTimeModifier: 3.1, dropAmountModifier: 4.6 } },
      { kills: 25000000, modifiers: { speedModifier: 3.2, dropChanceModifier: 4.8 } },
      { kills: 30000000, modifiers: { coolDownModifier: 3.2, dropAmountModifier: 4.8 } },
      { kills: 35000000, modifiers: { spawnTimeModifier: 3.2, dropChanceModifier: 5.0 } },
      { kills: 40000000, modifiers: { speedModifier: 3.3, dropAmountModifier: 5.0 } },
    ],



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

    accumulatedTimeForChanceEffects: 0,
    chanceEffectInterval: 1000,

    spawnTime: 2000,
    spawnTimeModifier: 1.0,

    enemySpawnCooldownTime: 0, // Total cooldown time before the next enemy spawns
    initialSpawnCooldownTime: 0, // Initial cooldown time before the first enemy spawns
    remainingCooldownTime: 0,   // Time remaining in the cooldown phase
    enemySpawnActive: false,    // Indicates if the spawn cooldown is active
    fightStatusChangeTime: 1000, // Time until battle status changes to 'fighting' after cooldown
    remainingFightStatusTime: 1000, // Remaining time before switching to 'fighting'

    globalDropChanceModifier: 1,
  }),
  getters: {
    killCountsForCurrentArea: (state) => {
      return state.enemyWaves
        .find((wave) => wave.name === state.currentArea)?.enemies
        .reduce((acc, enemy) => {
          const killCount = state.killCounts[useAdventureStore().enemyNameToId(enemy.name) + 'Kills'] ?? 0
          return acc + killCount
        }, 0) ?? 0
    },
  },
  actions: {
    setAreaModifiers(modifiers, area) {
      this.areaModifiers[area] = modifiers
    },
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
    stopAllBattles() {
      this.battleStatus = 'idle'
    },
    applyBuffs(deltaTime) {
      this.activeBuffs.map((buff) => {
        if (buff.active && buff.duration > 0) {
          buff.duration -= deltaTime
          return buff
        }

        if (buff.duration > 0 && !buff.active) {
          buff.effect()
          buff.active = true
          return buff
        }

        if (buff.duration <= 0 && buff.onRemove) {
          buff.onRemove()
          this.activeBuffs = this.activeBuffs.filter((activeBuff) => activeBuff.id !== buff.id)
        }

        return buff
      })
    },

    processCombat(deltaTime) {
      this.applyStatusEffects(deltaTime, this.armyActiveEffects, 'army')

      if (this.battleStatus === 'fighting' && this.currentEnemy) {
        const speedModifier = this.areaModifiers[this.currentArea]?.speedModifier ?? 1.0
        this.accumulatedTimeForChanceEffects += deltaTime * 1000 * speedModifier // Convert deltaTime to milliseconds
        if (this.accumulatedTimeForChanceEffects >= this.chanceEffectInterval) {
          this.applyArmyDamage(this.accumulatedTimeForChanceEffects / 1000)
          this.applyBugDamage(this.accumulatedTimeForChanceEffects / 1000)
          this.applyChanceEffects()
          this.accumulatedTimeForChanceEffects = 0 // Reset the accumulator after applying effects
        }

        // Check for defeat conditions
        if (this.armyHealth <= 0) {
          this.handlePlayerDefeat()
        }

        if (this.bugHealth <= 0) {
          this.handleEnemyDefeat()
        }
      }

      if (this.enemySpawnActive && this.battleStatus === 'cooldown') {
        const spawnTimeModifier = this.areaModifiers[this.currentArea]?.spawnTimeModifier ?? 1.0
        this.enemySpawnCooldownTime -= deltaTime * 1000 * spawnTimeModifier // Convert deltaTime to milliseconds

        if (this.enemySpawnCooldownTime <= 0) {
          this.spawnRandomEnemy() // Spawn a new enemy
          this.enemySpawnCooldownTime = 0 // Ensure it doesn't go negative
          this.remainingFightStatusTime = this.fightStatusChangeTime // Start the fighting prep phase
          this.battleStatus = 'preparing' // Set status to preparing for battle after cooldown
        }
      }

      if (this.battleStatus === 'preparing') {
        const coolDownModifier = this.areaModifiers[this.currentArea]?.coolDownModifier ?? 1.0
        this.remainingFightStatusTime -= deltaTime * 1000 * coolDownModifier // Convert deltaTime to milliseconds

        if (this.remainingFightStatusTime <= 0) {
          this.remainingFightStatusTime = 0 // Ensure it doesn't go negative
          this.battleStatus = 'fighting' // Set battle status to 'fighting'
          this.enemySpawnActive = false // Cooldown and preparation are over
        }
      }

      this.applyRegeneration(deltaTime) // Regenerate health during the real-time loop
    },

    applyChanceEffects() {
      this.applyStatusEffectWithChance(
        'bug',
        'poison',
        this.poisonChance,
        this.poisonDuration,
        this.poisonDamage,
      )

      this.applyStatusEffectWithChance(
        'bug',
        'bleed',
        this.bleedChance,
        this.bleedDuration,
        this.bleedDamage,
      )

      this.currentEnemy.effectChances?.forEach((effect) => {
        this.applyStatusEffectWithChance(
          'army',
          effect.effect,
          effect.chance,
          effect.duration,
          effect.damage,
          effect.healing,
        )
      })
    },

    calculateDamage(attackerAttack, defenderDefense) {
      const variation = 0.9 + Math.random() * 0.2
      const baseDamage = attackerAttack - defenderDefense
      return Math.max(baseDamage * variation, 1)
    },

    applyArmyDamage(deltaTime) {
      const damage = this.calculateDamage(this.armyAttack, this.bugDefense) * deltaTime
      this.bugHealth = Math.max(this.bugHealth - damage, 0)

      this.applyStatusEffects(deltaTime, this.bugActiveEffects, 'bug')
    },

    applyStatusEffects(deltaTime: number, effects: StatusEffect[], target: 'army' | 'bug') {
      effects.forEach((effect) => {
        // Handle damage over time (e.g., poison)
        if (effect.damagePerSecond) {
          const damage = effect.damagePerSecond * deltaTime
          if (target === 'bug') {
            this.bugHealth = Math.max(this.bugHealth - damage, 0)
          } else if (target === 'army') {
            this.armyHealth = Math.max(this.armyHealth - damage, 0)
          }
        }

        // Handle healing over time (e.g., regeneration)
        if (effect.healingPerSecond) {
          const healing = effect.healingPerSecond * deltaTime
          if (target === 'bug') {
            this.bugHealth = Math.min(this.bugHealth + healing, this.bugMaxHealth)
          } else if (target === 'army') {
            this.armyHealth = Math.min(this.armyHealth + healing, this.armyMaxHealth)
          }
        }

        // Decrease effect duration
        effect.duration -= deltaTime

        // Remove expired effects
        if (effect.duration <= 0) {
          if (target === 'bug') {
            this.bugActiveEffects = this.bugActiveEffects.filter((e) => e.id !== effect.id)
          } else if (target === 'army') {
            this.armyActiveEffects = this.armyActiveEffects.filter((e) => e.id !== effect.id)
          }
        }
      })
    },

    applyStatusEffectWithChance(
      target: 'army' | 'bug',
      effectId: StatusEffect['id'],
      chance: number,
      duration: number,
      damagePerSecond?: number,
      healingPerSecond?: number,
    ) {
      if (this.effectIsActive(effectId, target)) return

      if (Math.random() <= chance) {
        // Create the new status effect
        const newEffect: StatusEffect = {
          id: `${effectId}`,
          name: effectId.charAt(0).toUpperCase() + effectId.slice(1), // Capitalize first letter
          type: effectId,
          duration,
          damagePerSecond,
          healingPerSecond,
        }

        this.applyStatusEffect(newEffect, target)
      }
    },

    effectIsActive(effectId: StatusEffect['id'], target: 'army' | 'bug') {
      return (target === 'bug')
        ? this.bugActiveEffects.some((activeEffect) => activeEffect.id === effectId)
        : this.armyActiveEffects.some((activeEffect) => activeEffect.id === effectId)
    },

    applyStatusEffect(effect: StatusEffect, target: 'army' | 'bug') {
      if (this.effectIsActive(effect.id, target)) return

      if (target === 'bug') {
        this.bugActiveEffects.push(effect)
      } else if (target === 'army') {
        this.armyActiveEffects.push(effect)
      }
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

    enemyNameToId(name: string) {
      return name.toLowerCase().replace(/\s+/g, '')
    },
    getAreaForEnemy(enemy: Enemy) {
      return this.enemyWaves.find((wave) => wave.enemies.includes(enemy))?.name
    },
    handleKillCount() {
      if (!this.currentEnemy) {
        return // Prevent errors if
      }

      const killKey = this.enemyNameToId(this.currentEnemy.name) + 'Kills'
      if (this.killCounts[killKey] !== undefined) {
        this.killCounts[killKey] += 1
      } else {
        this.killCounts[killKey] = 1 // Initialize if not present
      }

      this.enemyKillCount += 1

      useAchievementStore().addToTotal('enemyKills', 1)

      this.handleAdventureMilestones()
    },

    handleAdventureMilestones() {
      const currentArea = this.currentArea
      const totalKillsForCurrentArea = this.killCountsForCurrentArea

      const milestones = this.milestones
      // Initialize default modifiers
      const appliedModifiers = {
        dropChanceModifier: 1.0,
        dropAmountModifier: 1.0,
        xpModifier: 1.0,
        speedModifier: 1.0,
        spawnTimeModifier: 1.0,
        coolDownModifier: 1.0,
      }

      // Check if there are milestones for the current area
      if (totalKillsForCurrentArea && milestones) {
        // Check if the total kills for the current area meet any milestones
        for (const milestone of milestones) {
          if (totalKillsForCurrentArea >= milestone.kills) {
            for (const modifierKey in milestone.modifiers) {
              // Use the higher modifier if already applied
              appliedModifiers[modifierKey] = Math.max(
                appliedModifiers[modifierKey],
                milestone.modifiers[modifierKey],
              )
            }
          }
        }
      }

      // Set the updated modifiers for the current area
      this.setAreaModifiers(appliedModifiers, currentArea)
    },

    async handleEnemyDrop() {
      const settingsStore = useSettingsStore()
      if (this.currentEnemy?.dropOptions) {
        for (const drop of this.currentEnemy.dropOptions) {
          // Some drops have unlockedWhen function to check if they should drop
          if (drop.unlockedWhen && !drop.unlockedWhen()) {
            continue
          }

          const dropChanceModifier = this.areaModifiers[this.currentArea as keyof typeof this.areaModifiers]?.dropChanceModifier ?? 1.0
          const dropAmountModifier = this.areaModifiers[this.currentArea as keyof typeof this.areaModifiers]?.dropAmountModifier ?? 1.0

          // Check the drop chance, now including the global modifier
          if (Math.random() < drop.chance * dropChanceModifier * this.globalDropChanceModifier) {
            const amount = Math.floor(
              (Math.random() * (drop.amountBetween[1] - drop.amountBetween[0] + 1) +
                drop.amountBetween[0]) * dropAmountModifier,
            )

            if (drop.name === 'Seeds') {
              // Add seeds to gameStore
              useResourcesStore().resources.seeds += amount * useResourcesStore().productionRates.collectionRateModifier
            } else {
              // Handle item drops
              const itemId = drop.name.toLowerCase().replace(/\s+/g, '-')
              const item = useInventoryStore().getItemById(itemId)
              if (item) {
                // Only show notification if not simulating offline progress
                if (!this.isSimulatingOffline && settingsStore.getNotificationSetting('loot')) {
                  toast.success(`Loot: +${amount} ${drop.name}`, {
                    position: toast.POSITION.TOP_LEFT,
                  })
                }
                // Await the item drop handling
                await this.handleItemDrop(item, amount)
              }
            }
          }
        }
      }
    },
    handleEnemyDefeat() {
      if (this.battleStatus === 'cooldown') {
        return // Prevent multiple regen loops
      }

      this.enemySpawned = false
      this.battleStatus = 'cooldown' // Set the battle status to 'cooldown'
      this.bugActiveEffects = [] // Clear active effects on the bug

      // Update kill counts and handle loot
      this.handleKillCount()
      this.handleEnemyDrop()
      if (this.currentEnemy) {
        useTrainingStore().processCombat(this.battleStyle, this.getXpForEnemy(this.currentEnemy))
      }

      // Set the initial spawn time and fight status change timers
      this.enemySpawnCooldownTime = this.spawnTime * this.spawnTimeModifier
      this.initialSpawnCooldownTime = this.enemySpawnCooldownTime
      this.remainingCooldownTime = this.enemySpawnCooldownTime
      this.remainingFightStatusTime = this.fightStatusChangeTime

      // Indicate that the enemy spawn timer is active
      this.enemySpawnActive = true
    },

    getXpForEnemy(enemy: Enemy): number {
      // Calculate base XP based on enemy stats
      const baseXp = (enemy.health * 0.05) + (enemy.attack * 0.1) + (enemy.defense * 0.07) + (enemy.regen * 0.8)

      // If it's a boss, apply a multiplier (e.g., 1.2x)
      const xp = enemy.isBoss ? baseXp * 1.2 : baseXp

      const xpModifier = this.areaModifiers[this.currentArea as keyof typeof this.areaModifiers]?.xpModifier ?? 1.0

      // Return the XP, making sure it doesn't exceed the max XP cap
      return Math.floor(xp * xpModifier)
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
    async handleItemDrop(item: Item, amount: number) {
      const inventoryStore = useInventoryStore()
      await inventoryStore.addItemToInventory({
        id: item.id,
        name: getItemName(item),
        amount,
      })
    },

    applyRegeneration(deltaTime = null) {
      // If deltaTime is passed, use it; otherwise assume it's 1 tick (for real-time)
      const regenMultiplier = deltaTime ? deltaTime : 1
      const effectsToStop = [
        'poison',
        'burn',
        'freeze',
        'bleed',
      ]

      // Apply army regeneration per tick
      if (this.armyHealth < this.armyMaxHealth) {
        if (!this.armyActiveEffects.some((effect) => effectsToStop.includes(effect.type))) {
          this.regenArmy(regenMultiplier)
        }
      }

      // Apply bug regeneration if the bug is spawned and not at max health
      if (this.enemySpawned && this.bugHealth < this.bugMaxHealth) {
        this.regenBug(regenMultiplier)
      }
    },

    regenArmy(regenMultiplier) {
      this.armyHealth = Math.min(
        this.armyHealth + this.armyRegen * regenMultiplier * (useTrainingStore().farmingModifiers.regenerationRate ?? 1),
        this.armyMaxHealth,
      )
    },

    regenBug(regenMultiplier) {
      this.bugHealth = Math.min(
        this.bugHealth + this.bugRegen * regenMultiplier,
        this.bugMaxHealth,
      )
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
        battleStyle: this.battleStyle,
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

      this.battleStyle = adventureState.battleStyle ?? this.battleStyle

      this.poisonChance = 0.0
      this.poisonDamage = 10
      this.poisonDuration = 2

      this.globalDropChanceModifier = 1

      this.bleedChance = 0.0
      this.bleedDamage = 100
      this.bleedDuration = 2

      const inventoryStore = useInventoryStore()
      this.activeBuffs = adventureState.activeBuffs?.map((buff) => {
        const itemFromName = inventoryStore.getItemById(buff.name)
        if (itemFromName) {
          return {
          ...buff,
          effect: itemFromName?.effect,
          onRemove: itemFromName?.onRemove,
          }
        }

        return {
          ...buff,
          active: false,
        }
      }) ?? []
      

      this.battleStatus = adventureState.battleStatus ?? 'idle'
      this.lastSavedTime = adventureState.lastSavedTime ?? Date.now()

      await this.setEnemyUnlockConditions()
      await this.loadEnemyImages()

      // Mark as loaded once the state is fully set
      this.loaded = true
    },

    getEnemiesThatDropItem(itemId: string) {
      const enemiesThatDropItem: Enemy[] = []

      const transformNameToId = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-')
      }

      // Iterate over all enemy waves
      this.enemyWaves.forEach((wave) => {
        // Iterate over all enemies in the wave
        wave.enemies.forEach((enemy) => {
          // Check if any dropOption contains the specified itemId
          if (enemy.dropOptions.some((drop) => transformNameToId(drop.name) === itemId)) {
            enemiesThatDropItem.push({
              ...enemy,
              wave: wave.name,
            })
          }
        })
      })

      return enemiesThatDropItem
    },

    async setEnemyUnlockConditions() {
      return new Promise((resolve) => {
        this.enemyWaves = adventureEnemyWaves.map((wave) => {
          return {
            name: wave.name,
            enemies: wave.enemies.map((enemy: any) => ({
              ...enemy,
              dropOptions: enemy.dropOptions.map((drop: any) => {
                drop.unlockedWhen = this.getUnlockFunction(drop.unlockedWhenContext)
                return drop // Otherwise, return the drop as is
              }),
            })),
            unlockText: wave.unlockText,
            unlockedWhen: this.getUnlockFunction(wave.unlockedWhenContext),
          }
        })

        resolve()
      })
    },

    getUnlockFunction(unlockCondition: any) {
      const resourcesStore = useResourcesStore()
      const evolveStore = useEvolveStore()
      const prestigeStore = usePrestigeStore()

      let condition = unlockCondition?.condition
      if (!condition) {
        condition = unlockCondition
      }

      switch (condition) {
        case 'alwaysAvailable':
          return () => true
        case 'antsOrQueensCondition':
          return () => resourcesStore.resources.ants >= unlockCondition.antsRequired || resourcesStore.resources.queens >= unlockCondition.queensRequired
        case 'evolutionAtLeastLeafcutter':
          return () => evolveStore.currentEvolution >= 1
        case 'prestigeBought':
          return () => prestigeStore.upgradePurchased(unlockCondition.upgradeId)
        default:
          return () => true // Fallback for undefined conditions
      }
    },

    async loadEnemyImages() {
      for (const wave of this.enemyWaves) {
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
          const image = await import('../assets/items/default-item.webp')
          itemRegistry[item].image = image.default
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

      this.poisonChance = 0.0
      this.poisonDamage = 10
      this.poisonDuration = 2

      this.bleedChance = 0.0
      this.bleedDamage = 100
      this.bleedDuration = 2

      this.lastSavedTime = Date.now()
      this.currentArea = 'Safe Zone'
      this.enemySpawned = false
      this.currentEnemy = null
      this.battleStatus = 'idle'
      this.globalDropChanceModifier = 1
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
                if (!this.isSimulatingOffline && useSettingsStore().getNotificationSetting('loot')) {
                  toast.success(`Loot: +${amount} ${drop.name}`, {
                    position: 'top-left',
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
      const bossStore = useBossStore()
      const trainingStore = useTrainingStore()
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

      const baseRegen =
        resourcesStore.resources.ants * gameStore.regenPerAnt +
        (resourcesStore.resources.queens - 1) *
        gameStore.regenPerAnt *
        resourcesStore.resourceCosts.antCostPerQueen +
        resourcesStore.resources.soldiers * gameStore.regenPerSoldier

      // Apply modifiers
      this.armyAttack = baseAttack * this.armyAttackModifier * trainingStore.modifiers.army.attack
      this.armyDefense = baseDefense * this.armyDefenseModifier * useTrainingStore().farmingModifiers.defense * trainingStore.modifiers.army.defense
      this.armyMaxHealth = baseHealth * this.armyMaxHealthModifier * trainingStore.modifiers.army.health
      this.armyRegen = baseRegen * this.armyRegenModifier * trainingStore.modifiers.army.regen

      bossStore.setArmyStats({
        damage: baseAttack,
        defense: baseDefense,
        maxHealth: baseHealth,
        regen: baseRegen,

        damageMultiplier: this.armyAttackModifier * trainingStore.modifiers.army.attack,
        defenseMultiplier: this.armyDefenseModifier * useTrainingStore().farmingModifiers.defense * trainingStore.modifiers.army.defense,
        healthMultiplier: this.armyMaxHealthModifier * trainingStore.modifiers.army.health,
        regenMultiplier: this.armyRegenModifier * trainingStore.modifiers.army.regen,
      })

      inventoryStore.reApplyPassiveEffects()
    },
  },
})
