import {defineStore} from 'pinia'
import {useAdventureStore} from '@/stores/adventureStore'
interface Boss {
  id: number
  name: string

  health: number
  maxHealth: number
  damage: number
  defense: number
  regen: number
}

export const useBossStore = defineStore({
  id: 'Boss',
  state: () => ({
    currentBoss: 0,

    bosses: [],

    armyStats: {
      health: 0,
      maxHealth: 0,

      damage: 0,
      defense: 0,
      regen: 0,

      damageMultiplier: 1,
      defenseMultiplier: 1,
      regenMultiplier: 1,
    },

    battleState: 'idle',
  }),
  getters: {
    currentBossData: (state) => state.bosses[state.currentBoss],
  },
  actions: {
    setBattleState(battleState: string) {
      this.battleState = battleState
    },
    setCurrentBoss(boss: number) {
      this.currentBoss = boss
    },
    setArmyStats(stats: {
      maxHealth: number
      damage: number
      defense: number
      regen: number

      damageMultiplier: number
      defenseMultiplier: number
      regenMultiplier: number
    }) {
      this.armyStats = {
        ...this.armyStats,
        ...stats,
      }
    },
    generateBosses() {
      this.bosses = Array.from({length: 50}, (_, i) => this.generateBoss(i))
    },
    generateBoss(level: number): Boss {
      level += 1

      const multiplier = Math.pow(10, level) // exponential scaling
      const baseBossStats = {
        health: 100,
        damage: 10,
        defense: 5,
        regen: 5,
      }

      return {
        id: level,
        name: `Boss ${level}`,
        health: baseBossStats.health * multiplier,
        maxHealth: baseBossStats.health * multiplier,
        damage: baseBossStats.damage * multiplier,
        defense: baseBossStats.defense * multiplier,
        regen: baseBossStats.regen * multiplier,
      }
    },
    processCombat(deltaTime) {
      const boss = this.currentBossData
      const army = this.armyStats
      army.health = Math.min(army.health + army.regen * army.regenMultiplier * deltaTime, army.maxHealth)
      boss.health = Math.min(boss.health + boss.regen * deltaTime, boss.maxHealth)

      if (this.battleState === 'idle') return

      const bossDamage = Math.max(boss.damage - army.defense * army.defenseMultiplier, 0)
      const armyDamage = Math.max(army.damage * army.damageMultiplier - boss.defense, 0)

      boss.health -= armyDamage * deltaTime
      army.health -= bossDamage * deltaTime

      if (boss.health <= 0) {
        this.setBattleState('idle')
        this.currentBoss++
      }
      
      if (army.health <= 0) {
        army.health = 0
        this.setBattleState('idle')
      }
    },
  },
})
