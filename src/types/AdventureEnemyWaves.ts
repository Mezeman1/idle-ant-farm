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
  },
  {
    name: 'Forest',
    enemies: [
      {
        name: 'Spider',
        health: 3500, // Slightly lower health
        attack: 700,  // Slightly lower attack
        defense: 350, // Slightly lower defense
        regen: 10,    // Slightly higher regen
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
        health: 4000, // Equal health
        attack: 850,  // Slightly higher attack
        defense: 380, // Slightly lower defense
        regen: 15,    // Higher regen than player
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
        health: 3200, // Slightly lower health
        attack: 750,  // Slightly lower attack
        defense: 300, // Slightly lower defense
        regen: 8,     // Slightly higher regen
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
        health: 4200, // Slightly higher health
        attack: 900,  // Higher attack
        defense: 400, // Equal defense
        regen: 20,    // Higher regen
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
        health: 6000, // Higher health (Boss level)
        attack: 1000, // Higher attack
        defense: 500, // Higher defense
        regen: 30,    // Higher regen
        isBoss: true, // Boss enemy
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
  },

  // New wave: Mountains
  // New wave: Mountains
  {
    name: 'Mountains',
    enemies: [
      {
        name: 'Mountain Ant',
        health: 13000,  // Slightly lower than player health
        attack: 2800,   // Slightly lower attack than player
        defense: 1200,  // Slightly lower defense
        regen: 60,      // Slightly lower regen than player
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
        health: 15000,  // On par with player health
        attack: 3000,   // On par with player's attack
        defense: 1500,  // On par with player's defense
        regen: 75,      // Slightly higher regen than player
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
        health: 18000,  // Higher than player's health
        attack: 3200,   // Slightly higher than player's attack
        defense: 1700,  // Higher than player's defense
        regen: 100,     // Higher regen than player
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
        health: 23000,  // Significantly higher than player's health
        attack: 3500,   // Stronger than player's attack
        defense: 2000,  // Stronger defense than player
        regen: 150,     // Strong regen for a boss
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
  },

  // New wave: Volcano
  {
    name: 'Volcano',
    enemies: [
      {
        name: 'Lava Ant',
        health: 120000,  // A bit lower than player health
        attack: 32000,   // Slightly lower attack than player
        defense: 15000,  // Slightly lower defense than player
        regen: 500,      // Moderate regen
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
        health: 140000,  // On par with player health
        attack: 35000,   // Slightly lower attack than player
        defense: 16000,  // On par with player defense
        regen: 600,      // Higher regen
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
        health: 160000,  // Slightly higher than player's health
        attack: 37000,   // On par with player's attack
        defense: 17000,  // Higher defense than player
        regen: 700,      // High regen
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
        health: 200000,  // Significantly higher than player's health
        attack: 40000,   // Stronger attack than player
        defense: 18000,  // Stronger defense
        regen: 1000,     // Very strong regen for a boss
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
  },

  // New wave: Underworld
  {
    name: 'Underworld',
    enemies: [
      {
        name: 'Hellfire Ant',
        health: 8_000_000,  // Lower than player health
        attack: 2_000_000,  // Close to player attack
        defense: 1_000_000, // Slightly lower than player's defense
        regen: 500,         // Moderate regen
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
        health: 9_000_000,  // Closer to player's health
        attack: 2_200_000,  // Slightly lower than player attack
        defense: 1_200_000, // Near player defense
        regen: 600,         // Slightly higher regen
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
        health: 10_000_000, // Matches player’s health
        attack: 2_500_000,  // On par with player attack
        defense: 1_300_000, // Matches player defense
        regen: 750,         // Higher regen than other enemies
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
        health: 12_000_000, // Stronger than player’s health
        attack: 3_000_000,  // Stronger than player’s attack
        defense: 1_500_000, // Stronger defense
        regen: 1_000,       // High regen for a boss
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
  },

]
