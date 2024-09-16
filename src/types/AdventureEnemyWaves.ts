// Common drop definitions for reusability
const seedDrop = (min, max, chance = 0.75) => ({
  name: 'Seeds',
  chance,
  amountBetween: [min, max],
})

export interface Enemy {
  image?: string
  name: string
  health: number
  attack: number
  defense: number
  regen: number
  dropOptions: {
    name: string
    chance: number
    amountBetween: [number, number]
  }[]
  isBoss?: boolean
}

export interface AdventureEnemyWave {
  name: string
  enemies: Enemy[]
  unlockedWhen: (gameStore: any) => boolean
  unlockText: string
}

export const adventureEnemyWaves = [
  {
    name: 'Wasteland',
    enemies: [
      {
        name: 'Grasshopper',
        health: 90,
        attack: 18,
        defense: 8,
        regen: 3,
        dropOptions: [
          seedDrop(100, 500),
          {
            name: 'Grasshopper Leg',
            chance: 0.2,
            amountBetween: [1, 2],
          },
          {
            name: 'Grasshopper Wing',
            chance: 0.1,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Beetle',
        health: 110,
        attack: 20,
        defense: 10,
        regen: 4,
        dropOptions: [
          seedDrop(100, 500),
          {
            name: 'Ant Strength Potion',
            chance: 0.15,
            amountBetween: [1, 2],
          },
          {
            name: 'Beetle Shell',
            chance: 0.1,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Wasp',
        health: 130,
        attack: 22,
        defense: 12,
        regen: 5,
        dropOptions: [
          seedDrop(100, 500),
          {
            name: 'Queen Crown',
            chance: 0.05,
            amountBetween: [1, 1],
          },
          {
            name: 'Wasp Stinger',
            chance: 0.075,
            amountBetween: [1, 2],
          },
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 15 || gameStore.resources.queens >= 3,
    unlockText: 'Unlocked when you have 15 ants or 3 queens.',
  },
  {
    name: 'Forest',
    enemies: [
      {
        name: 'Spider',
        health: 1500,
        attack: 300,
        defense: 150,
        regen: 6,
        dropOptions: [
          seedDrop(300, 750, 0.7),
          {
            name: 'Spider Silk',
            chance: 0.05,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Centipede',
        health: 1600,
        attack: 340,
        defense: 160,
        regen: 7,
        dropOptions: [
          seedDrop(300, 750, 0.7),
          {
            name: 'Centipede Leg',
            chance: 0.2,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Moth',
        health: 1400,
        attack: 310,
        defense: 140,
        regen: 5,
        dropOptions: [
          seedDrop(400, 800, 0.5),
          {
            name: 'Moth Dust',
            chance: 0.1,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Butterfly',
        health: 1700,
        attack: 360,
        defense: 170,
        regen: 8,
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
          seedDrop(400, 1000, 0.5),
        ],
      },
      {
        name: 'Queen Wasp',
        health: 2400,
        attack: 400,
        defense: 200,
        regen: 10,
        isBoss: true,
        dropOptions: [
          {
            name: 'Queen Stinger',
            chance: 0.005,
            amountBetween: [1, 1],
          },
          {
            name: 'Wasp Stinger',
            chance: 0.08,
            amountBetween: [1, 2],
          },
          seedDrop(500, 1500, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 100 || gameStore.resources.queens >= 2,
    unlockText: 'Unlocked when you have 100 ants or 2 queens.',
  },
  {
    name: 'Mountains',
    enemies: [
      {
        name: 'Mountain Ant',
        health: 12000,
        attack: 2400,
        defense: 1200,
        regen: 20,
        dropOptions: [
          seedDrop(1000, 2500, 0.7),
          {
            name: 'Mountain Ant Mandible',
            chance: 0.15,
            amountBetween: [1, 3],
          },
        ],
      },
      {
        name: 'Rock Beetle',
        health: 13000,
        attack: 2600,
        defense: 1400,
        regen: 25,
        dropOptions: [
          seedDrop(1200, 3000, 0.7),
          {
            name: 'Rock Carapace',
            chance: 0.1,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Giant Mantis',
        health: 15000,
        attack: 2800,
        defense: 1600,
        regen: 30,
        dropOptions: [
          seedDrop(1500, 3500, 0.5),
          {
            name: 'Mantis Claw',
            chance: 0.08,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Stone Golem',
        health: 20000,
        attack: 3200,
        defense: 1800,
        regen: 50,
        isBoss: true,
        dropOptions: [
          {
            name: 'Stone Heart',
            chance: 0.005,
            amountBetween: [1, 1],
          },
          seedDrop(2500, 5000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 1000 || gameStore.resources.queens >= 20,
    unlockText: 'Unlocked when you have 1000 ants or 20 queens.',
  },
  {
    name: 'Volcano',
    enemies: [
      {
        name: 'Lava Ant',
        health: 60000,
        attack: 12000,
        defense: 7000,
        regen: 15,
        dropOptions: [
          seedDrop(3000, 7000, 0.6),
          {
            name: 'Lava Ant Tooth',
            chance: 0.1,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Magma Beetle',
        health: 70000,
        attack: 13000,
        defense: 7500,
        regen: 18,
        dropOptions: [
          seedDrop(3500, 7500, 0.7),
          {
            name: 'Magma Carapace',
            chance: 0.1,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Fire Scorpion',
        health: 80000,
        attack: 14000,
        defense: 8000,
        regen: 20,
        dropOptions: [
          seedDrop(4000, 8000, 0.5),
          {
            name: 'Scorpion Tail',
            chance: 0.05,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Molten Dragon',
        health: 100000,
        attack: 16000,
        defense: 9000,
        regen: 25,
        isBoss: true,
        dropOptions: [
          {
            name: 'Dragon Scale',
            chance: 0.002,
            amountBetween: [1, 1],
          },
          seedDrop(5000, 10000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 5000 || gameStore.resources.queens >= (5000 / 50),
    unlockText: 'Unlocked when you have 5000 ants or 100 queens.',
  },
  {
    name: 'Underworld',
    enemies: [
      {
        name: 'Hellfire Ant',
        health: 120000,
        attack: 30000,
        defense: 16000,
        regen: 25,
        dropOptions: [
          seedDrop(10000, 15000, 0.5),
          {
            name: 'Hellfire Ant Fang',
            chance: 0.08,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Demonic Beetle',
        health: 130000,
        attack: 32000,
        defense: 18000,
        regen: 30,
        dropOptions: [
          seedDrop(12000, 18000, 0.6),
          {
            name: 'Demonic Carapace',
            chance: 0.05,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Infernal Scorpion',
        health: 150000,
        attack: 35000,
        defense: 20000,
        regen: 40,
        dropOptions: [
          seedDrop(15000, 20000, 0.4),
          {
            name: 'Infernal Tail',
            chance: 0.03,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Underworld Lord',
        health: 180000,
        attack: 40000,
        defense: 24000,
        regen: 50,
        isBoss: true,
        dropOptions: [
          {
            name: 'Underworld Crown',
            chance: 0.001,
            amountBetween: [1, 1],
          },
          seedDrop(20000, 30000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 10000 || gameStore.resources.queens >= (10000 / gameStore.resourceCosts.antCostPerQueen),
    unlockText: 'Unlocked when you have 10 thousand ants or 200 queens.',
  },

  {
    name: 'Arctic Tundra',
    enemies: [
      {
        name: 'Ice Beetle',
        health: 240_000, // Slightly lower than player health
        attack: 48_000,  // Slightly lower attack than player
        defense: 24_000, // Slightly lower defense than player
        regen: 1_500,    // Moderate regen
        dropOptions: [
          seedDrop(25_000, 35_000, 0.6),
          {
            name: 'Ice Beetle Shell',
            chance: 0.1,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Frost Scorpion',
        health: 270_000, // Higher health than player
        attack: 50_000,  // On par with player’s attack
        defense: 25_000, // On par with player’s defense
        regen: 1_800,    // High regen
        dropOptions: [
          seedDrop(30_000, 40_000, 0.7),
          {
            name: 'Frost Scorpion Tail',
            chance: 0.08,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Glacier Mantis',
        health: 300_000, // Stronger health than player
        attack: 55_000,  // Stronger attack than player
        defense: 26_500, // Slightly stronger defense than player
        regen: 2_000,    // High regen
        dropOptions: [
          seedDrop(35_000, 45_000, 0.5),
          {
            name: 'Glacier Mantis Claw',
            chance: 0.05,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Frost Wyrm',
        health: 350_000, // Significantly higher than player health
        attack: 60_000,  // Strong attack for boss
        defense: 28_000, // Strong defense
        regen: 3_000,    // Very strong regen for a boss
        isBoss: true,
        dropOptions: [
          {
            name: 'Frost Wyrm Scale',
            chance: 0.005,
            amountBetween: [1, 1],
          },
          seedDrop(50_000, 60_000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 25_000 || gameStore.resources.queens >= 500,
    unlockText: 'Unlocked when you have 25 thousand ants or 500 queens.',
  },

  {
    name: 'Abyssal Depths',
    enemies: [
      {
        name: 'Abyss Crab',
        health: 600_000, // Higher than player health
        attack: 120_000, // Strong attack
        defense: 60_000, // Strong defense
        regen: 40,       // Strong regen
        dropOptions: [
          seedDrop(70_000, 90_000, 0.6),
          {
            name: 'Abyss Crab Claw',
            chance: 0.07,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Deep Sea Angler',
        health: 650_000, // Stronger health
        attack: 140_000, // On par with strong player attack
        defense: 70_000, // On par with defense
        regen: 50,       // High regen
        dropOptions: [
          seedDrop(80_000, 100_000, 0.5),
          {
            name: 'Angler Teeth',
            chance: 0.05,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Kraken Tentacle',
        health: 700_000, // Very high health
        attack: 160_000, // Strong attack
        defense: 80_000, // Strong defense
        regen: 60,       // High regen
        dropOptions: [
          seedDrop(90_000, 110_000, 0.4),
          {
            name: 'Kraken Ink',
            chance: 0.02,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Abyssal Leviathan',
        health: 800_000, // Boss-level health
        attack: 200_000, // Stronger than player
        defense: 100_000, // Strong boss defense
        regen: 80,       // High regen for a boss
        isBoss: true,
        dropOptions: [
          {
            name: 'Leviathan Scale',
            chance: 0.001,
            amountBetween: [1, 1],
          },
          seedDrop(100_000, 150_000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 50_000 || gameStore.resources.queens >= 1_000,
    unlockText: 'Unlocked when you have 50 thousand ants or 1 thousand queens.',
  },

  {
    name: 'Cosmic Rift',
    enemies: [
      {
        name: 'Cosmic Wasp',
        health: 2_000_000,  // Higher than player health
        attack: 300_000,    // Strong attack
        defense: 120_000,   // High defense
        regen: 140,         // Strong regen
        dropOptions: [
          seedDrop(150_000, 200_000, 0.4),
          {
            name: 'Cosmic Wasp Wing',
            chance: 0.02,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Void Mantis',
        health: 2_400_000, // Stronger health than player
        attack: 360_000,   // On par with player's attack
        defense: 140_000,  // Strong defense
        regen: 160,        // Higher regen
        dropOptions: [
          seedDrop(180_000, 230_000, 0.3),
          {
            name: 'Void Mantis Claw',
            chance: 0.02,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Galaxy Spider',
        health: 3_000_000, // Very strong health
        attack: 400_000,   // Stronger than player’s attack
        defense: 160_000,  // High defense
        regen: 200,        // High regen
        dropOptions: [
          seedDrop(200_000, 300_000, 0.2),
          {
            name: 'Galaxy Web',
            chance: 0.01,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Celestial Dragon',
        health: 3_600_000, // Boss-level health
        attack: 500_000,   // Stronger than player’s attack
        defense: 200_000,  // Strong defense
        regen: 300,        // Very high regen for a boss
        isBoss: true,
        dropOptions: [
          {
            name: 'Celestial Scale',
            chance: 0.001,
            amountBetween: [1, 1],
          },
          seedDrop(250_000, 500_000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.resources.ants >= 100_000 || gameStore.resources.queens >= 2_000,
    unlockText: 'Unlocked when you have 100 thousand ants or 2 thousand queens.',
  },
] as AdventureEnemyWave[]

