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

    bosses: [
      { id: 1,  name: 'Boss 1', health: 500, damage: 50, defense: 20, regen: 5, maxHealth: 500 },
      { id: 2,  name: 'Boss 2', health: 3866, damage: 386, defense: 154, regen: 38, maxHealth: 3866 },
      { id: 3,  name: 'Boss 3', health: 13230, damage: 1323, defense: 529, regen: 132, maxHealth: 13230 },
      { id: 4,  name: 'Boss 4', health: 113218, damage: 11321, defense: 4528, regen: 1132, maxHealth: 113218 },
      { id: 5,  name: 'Boss 5', health: 540526, damage: 54052, defense: 21621, regen: 5405, maxHealth: 540526 },
      { id: 6,  name: 'Boss 6', health: 49308921, damage: 4930892, defense: 1972356, regen: 493089, maxHealth: 49308921 },
      { id: 7,  name: 'Boss 7', health: 19913295, damage: 1991329, defense: 796531, regen: 199132, maxHealth: 19913295 },
      { id: 8,  name: 'Boss 8', health: 828901777, damage: 82890177, defense: 33156071, regen: 8289017, maxHealth: 828901777 },
      { id: 9,  name: 'Boss 9', health: 24773444855, damage: 2477344485, defense: 990937794, regen: 247734448, maxHealth: 24773444855 },
      { id: 10, name: 'Boss 10', health: 425320477885, damage: 42532047788, defense: 17012819115, regen: 4253204778, maxHealth: 425320477885 },
      { id: 11, name: 'Boss 11', health: 1170150532627, damage: 117015053262, defense: 46806021305, regen: 11701505326, maxHealth: 1170150532627 },
      { id: 12, name: 'Boss 12', health: 4317401210023, damage: 431740121002, defense: 172696048400, regen: 43174012100, maxHealth: 4317401210023 },
      { id: 13, name: 'Boss 13', health: 448697502617873, damage: 44869750261787, defense: 17947900104714, regen: 4486975026178, maxHealth: 448697502617873 },
      { id: 14, name: 'Boss 14', health: 1402038231502047, damage: 140203823150204, defense: 56081529260081, regen: 14020382315020, maxHealth: 1402038231502047 },
      { id: 15, name: 'Boss 15', health: 48430408012763576, damage: 4843040801276358, defense: 1937216320510543, regen: 484304080127635, maxHealth: 48430408012763576 },
      { id: 16, name: 'Boss 16', health: 142146481175521936, damage: 14214648117552194, defense: 5685859247020878, regen: 1421464811755219, maxHealth: 142146481175521936 },
      { id: 17, name: 'Boss 17', health: 2486444417575979008, damage: 248644441757597888, defense: 99457776703039168, regen: 24864444175759792, maxHealth: 2486444417575979008 },
      { id: 18, name: 'Boss 18', health: 46812858468065378304, damage: 4681285846806537216, defense: 1872514338722615040, regen: 468128584680653760, maxHealth: 46812858468065378304 },
      { id: 19, name: 'Boss 19', health: 322794872858600144896, damage: 32279487285860012032, defense: 12911794914344005632, regen: 3227948728586001408, maxHealth: 322794872858600144896 },
      { id: 20, name: 'Boss 20', health: 953447132688225009664, damage: 95344713268822507520, defense: 38137885307529003008, regen: 9534471326882250752, maxHealth: 953447132688225009664 },
    ] as Boss[],

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
        this.armyStats.health = this.armyStats.maxHealth
      } else if (army.health <= 0) {
        this.setBattleState('idle')
        this.armyStats.health = this.armyStats.maxHealth
      }
    },
  },
})
