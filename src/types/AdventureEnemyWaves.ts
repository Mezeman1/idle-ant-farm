// Import the JSON file
import enemyData from '@/data/enemies.json'

// Reusable drop function
const seedDrop = (min: number, max: number, chance = 0.75) => ({
  name: 'Seeds',
  chance,
  amountBetween: [min, max],
})

interface DropOption {
  name: string;
  chance: number;
  amountBetween: [number, number];
  unlockedWhen?: () => boolean;
  unlockedWhenFunctionName?: string;
  unlockText?: string;
}

export interface Enemy {
  name: string;
  health: number;
  attack: number;
  defense: number;
  regen: number;
  dropOptions: DropOption[];
  xp?: number;
  isBoss?: boolean;
  effectChances?: {
    effect: string
    chance: number
    damage?: number
    healing?: number
    duration?: number
  }[];
}

export interface AdventureEnemyWave {
  name: string;
  enemies: Enemy[];
  unlockedWhen?: () => boolean;
  unlockedWhenFunctionName?: string;
  unlockText: string;
}

// Process the JSON data and apply functions
export const adventureEnemyWaves: AdventureEnemyWave[] = enemyData.map((wave: AdventureEnemyWave) => ({
  name: wave.name,
  enemies: wave.enemies.map((enemy: Enemy) => ({
    ...enemy,
    dropOptions: enemy.dropOptions.map((drop: DropOption) => {
      if (drop.type === 'seedDrop') {
        return seedDrop(drop.min, drop.max) // Apply the seedDrop function
      }

      return drop // Otherwise, return the drop as is
    }),
  })),
  unlockText: wave.unlockText,
  unlockedWhenContext: wave.unlockedWhen,
}))
