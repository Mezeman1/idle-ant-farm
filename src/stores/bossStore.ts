import { defineStore } from 'pinia'
import BigNumber from 'bignumber.js'
import { useAdventureStore } from '@/stores/adventureStore'

interface Boss {
  id: number
  name: string
  health: BigNumber
  maxHealth: BigNumber
  damage: BigNumber
  defense: BigNumber
  regen: BigNumber
}

export const useBossStore = defineStore({
  id: 'Boss',
  state: () => ({
    currentBoss: 0,

    bosses: [] as Boss[],

    armyStats: {
      health: new BigNumber(0),
      maxHealth: new BigNumber(0),

      damage: new BigNumber(0),
      defense: new BigNumber(0),
      regen: new BigNumber(0),

      damageMultiplier: new BigNumber(1),
      defenseMultiplier: new BigNumber(1),
      regenMultiplier: new BigNumber(1),
      healthMultiplier: new BigNumber(1),
    },

    combatModifiers: {
      damage: new BigNumber(1),
      defense: new BigNumber(1),
      regen: new BigNumber(1),
      health: new BigNumber(1),
    },

    battleState: 'idle',
  }),
  getters: {
    currentBossData: (state) => {
      return state.bosses[state.currentBoss]
    },
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
      healthMultiplier: number
    }) {
      this.armyStats = {
        health: new BigNumber(this.armyStats.health ?? 0),
        maxHealth: new BigNumber(stats.maxHealth),
        damage: new BigNumber(stats.damage),
        defense: new BigNumber(stats.defense),
        regen: new BigNumber(stats.regen),
        damageMultiplier: new BigNumber(stats.damageMultiplier),
        defenseMultiplier: new BigNumber(stats.defenseMultiplier),
        regenMultiplier: new BigNumber(stats.regenMultiplier),
        healthMultiplier: new BigNumber(stats.healthMultiplier),
      }
    },
    generateBosses() {
      this.bosses = Array.from({ length: 1000 }, (_, i) => this.generateBoss(i))
    },
    generateBoss(level: number): Boss {
      level += 1

      const multiplier = new BigNumber(3).pow(level) // exponential scaling

      const baseBossStats = {
        health: new BigNumber(100),
        damage: new BigNumber(10),
        defense: new BigNumber(5),
        regen: new BigNumber(5),
      }

      return {
        id: level,
        name: `Boss ${level}`,
        health: baseBossStats.health.multipliedBy(multiplier),
        maxHealth: baseBossStats.health.multipliedBy(multiplier),
        damage: baseBossStats.damage.multipliedBy(multiplier),
        defense: baseBossStats.defense.multipliedBy(multiplier),
        regen: baseBossStats.regen.multipliedBy(multiplier),
      }
    },
    processCombat(deltaTime: number) {
      const boss = this.currentBossData
      const army = this.armyStats

      // Army regeneration and boss regeneration
      army.health = BigNumber.min(
        army.health.plus(army.regen.times(army.regenMultiplier).times(deltaTime)),
        army.maxHealth.times(this.combatModifiers.health).times(army.healthMultiplier),
      )
      boss.health = BigNumber.min(
        boss.health.plus(boss.regen.times(deltaTime)),
        boss.maxHealth,
      )

      if (this.battleState === 'idle') return

      const bossDamage = BigNumber.max(
        boss.damage.minus(army.defense.times(army.defenseMultiplier).times(this.combatModifiers.defense)),
        new BigNumber(0),
      )
      const armyDamage = BigNumber.max(
        army.damage.times(army.damageMultiplier).times(this.combatModifiers.damage).minus(boss.defense),
        new BigNumber(0),
      )

      boss.health = boss.health.minus(armyDamage.times(deltaTime))
      army.health = army.health.minus(bossDamage.times(deltaTime))

      // Check for battle outcomes
      if (boss.health.lte(0)) {
        this.setBattleState('idle')
        this.currentBoss++
      }

      if (army.health.lte(0)) {
        army.health = new BigNumber(0)
        this.setBattleState('idle')
      }
    },
    getBossState() {
      return {
        boss: this.currentBoss,
      }
    },
    loadBossState(state: { boss?: number }) {
      this.currentBoss = state.boss ?? 0
    },
    resetBossState() {
      this.currentBoss = 0
    },
  },
})
