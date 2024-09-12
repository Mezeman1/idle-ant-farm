// Common drop definitions for reusability
const seedDrop = (min, max, chance = 0.75) => ({
  name: 'Seeds',
  chance,
  amountBetween: [min, max],
})

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
            chance: 0.1,
            amountBetween: [1, 2],
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
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.ants >= 10 || gameStore.queens >= 2,
    unlockText: 'Unlocked when you have 10 ants or 2 queens.',
  },
  {
    name: 'Forest',
    enemies: [
      {
        name: 'Spider',
        health: 3500,
        attack: 700,
        defense: 350,
        regen: 10,
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
        health: 4000,
        attack: 850,
        defense: 380,
        regen: 15,
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
        health: 3200,
        attack: 750,
        defense: 300,
        regen: 8,
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
        health: 4200,
        attack: 900,
        defense: 400,
        regen: 20,
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
        health: 6000,
        attack: 1000,
        defense: 500,
        regen: 30,
        isBoss: true,
        dropOptions: [
          {
            name: 'Queen Stinger',
            chance: 0.005,
            amountBetween: [1, 1],
          },
          seedDrop(500, 1500, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.ants >= 100 || gameStore.queens >= 2,
    unlockText: 'Unlocked when you have 100 ants or 2 queens.',
  },
  // New wave: Mountains
  {
    name: 'Mountains',
    enemies: [
      {
        name: 'Mountain Ant',
        health: 13000,
        attack: 2800,
        defense: 1200,
        regen: 60,
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
        health: 15000,
        attack: 3000,
        defense: 1500,
        regen: 75,
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
        health: 18000,
        attack: 3200,
        defense: 1700,
        regen: 100,
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
        health: 23000,
        attack: 3500,
        defense: 2000,
        regen: 150,
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
    unlockedWhen: (gameStore) => gameStore.ants >= 1000 || gameStore.queens >= 10,
    unlockText: 'Unlocked when you have 1000 ants or 10 queens.',
  },

  // New wave: Volcano
  {
    name: 'Volcano',
    enemies: [
      {
        name: 'Lava Ant',
        health: 120000,
        attack: 32000,
        defense: 15000,
        regen: 500,
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
        health: 140000,
        attack: 35000,
        defense: 16000,
        regen: 600,
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
        health: 160000,
        attack: 37000,
        defense: 17000,
        regen: 700,
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
        health: 200000,
        attack: 40000,
        defense: 18000,
        regen: 1000,
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
    unlockedWhen: (gameStore) => gameStore.ants >= 5000 || gameStore.queens >= 20,
    unlockText: 'Unlocked when you have 5000 ants or 20 queens.',
  },

  // New wave: Underworld
  {
    name: 'Underworld',
    enemies: [
      {
        name: 'Hellfire Ant',
        health: 8_000_000,
        attack: 2_000_000,
        defense: 1_000_000,
        regen: 500,
        dropOptions: [
          seedDrop(10_000, 15_000, 0.5),
          {
            name: 'Hellfire Ant Fang',
            chance: 0.08,
            amountBetween: [1, 2],
          },
        ],
      },
      {
        name: 'Demonic Beetle',
        health: 9_000_000,
        attack: 2_200_000,
        defense: 1_200_000,
        regen: 600,
        dropOptions: [
          seedDrop(12_000, 18_000, 0.6),
          {
            name: 'Demonic Carapace',
            chance: 0.05,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Infernal Scorpion',
        health: 10_000_000,
        attack: 2_500_000,
        defense: 1_300_000,
        regen: 750,
        dropOptions: [
          seedDrop(15_000, 20_000, 0.4),
          {
            name: 'Infernal Tail',
            chance: 0.03,
            amountBetween: [1, 1],
          },
        ],
      },
      {
        name: 'Underworld Lord',
        health: 12_000_000,
        attack: 3_000_000,
        defense: 1_500_000,
        regen: 1_000,
        isBoss: true,
        dropOptions: [
          {
            name: 'Underworld Crown',
            chance: 0.001,
            amountBetween: [1, 1],
          },
          seedDrop(20_000, 30_000, 0.5),
        ],
      },
    ],
    unlockedWhen: (gameStore) => gameStore.ants >= 1_000_000 || gameStore.queens >= 10_000,
    unlockText: 'Unlocked when you have 1 million ants or 10 thousand queens.',
  },

  {
    name: 'Arctic Tundra',
    enemies: [
      {
        name: 'Ice Beetle',
        health: 15_000_000, // Lower than player health
        attack: 3_500_000,  // Slightly lower attack than player
        defense: 1_800_000, // Slightly lower defense than player
        regen: 1_500,       // Moderate regen
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
        health: 18_000_000, // Higher health than player
        attack: 4_000_000,  // On par with player’s attack
        defense: 2_000_000, // On par with player’s defense
        regen: 1_800,       // High regen
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
        health: 22_000_000, // Stronger health than player
        attack: 4_500_000,  // Stronger attack than player
        defense: 2_300_000, // Slightly stronger defense than player
        regen: 2_000,       // High regen
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
        health: 30_000_000, // Significantly higher than player health
        attack: 5_500_000,  // Strong attack for boss
        defense: 2_500_000, // Strong defense
        regen: 3_000,       // Very strong regen for a boss
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
    unlockedWhen: (gameStore) => gameStore.ants >= 2_000_000 || gameStore.queens >= 20_000,
    unlockText: 'Unlocked when you have 2 million ants or 20 thousand queens.',
  },

  {
    name: 'Abyssal Depths',
    enemies: [
      {
        name: 'Abyss Crab',
        health: 40_000_000, // Higher than player health
        attack: 6_000_000,  // Strong attack
        defense: 3_000_000, // Strong defense
        regen: 4_000,       // Strong regen
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
        health: 45_000_000, // Stronger health
        attack: 7_000_000,  // On par with strong player attack
        defense: 3_500_000, // On par with defense
        regen: 5_000,       // High regen
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
        health: 50_000_000, // Very high health
        attack: 8_000_000,  // Strong attack
        defense: 4_000_000, // Strong defense
        regen: 6_000,       // High regen
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
        health: 60_000_000, // Boss-level health
        attack: 10_000_000, // Stronger than player
        defense: 5_000_000, // Strong boss defense
        regen: 8_000,       // High regen for a boss
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
    unlockedWhen: (gameStore) => gameStore.ants >= 5_000_000 || gameStore.queens >= 50_000,
    unlockText: 'Unlocked when you have 5 million ants or 50 thousand queens.',
  },

  {
    name: 'Cosmic Rift',
    enemies: [
      {
        name: 'Cosmic Wasp',
        health: 100_000_000,  // Higher than player health
        attack: 15_000_000,   // Strong attack
        defense: 6_000_000,   // High defense
        regen: 7_000,         // Strong regen
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
        health: 120_000_000, // Stronger health than player
        attack: 18_000_000,  // On par with player's attack
        defense: 7_000_000,  // Strong defense
        regen: 8_000,        // Higher regen
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
        health: 150_000_000, // Very strong health
        attack: 20_000_000,  // Stronger than player’s attack
        defense: 8_000_000,  // High defense
        regen: 10_000,       // High regen
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
        health: 180_000_000, // Boss-level health
        attack: 25_000_000,  // Stronger than player’s attack
        defense: 10_000_000, // Strong defense
        regen: 15_000,       // Very high regen for a boss
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
    unlockedWhen: (gameStore) => gameStore.ants >= 10_000_000 || gameStore.queens >= 100_000,
    unlockText: 'Unlocked when you have 10 million ants or 100 thousand queens.',
  },
]

// Function to load images dynamically
const loadEnemyImages = async () => {
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
}

// Call this function when the component or store is initialized
await loadEnemyImages()

