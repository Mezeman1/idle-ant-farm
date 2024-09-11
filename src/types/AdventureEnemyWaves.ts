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
  {
    name: 'Mountains',
    enemies: [
      {
        name: 'Mountain Ant',
        health: 12000,  // A bit lower than player health
        attack: 2400,   // Slightly lower attack than player
        defense: 1000,  // Slightly lower defense
        regen: 50,      // Moderate regen, lower than player’s
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
        health: 14000,  // Slightly higher than player health
        attack: 2600,   // On par with player's attack
        defense: 1300,  // On par with player's defense
        regen: 60,      // Higher regen than Mountain Ant
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
        health: 16000,  // Higher than player's health
        attack: 2800,   // Slightly higher than player's attack
        defense: 1500,  // Higher than player's defense
        regen: 100,     // Higher regen
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
        health: 22000,  // Significantly higher than player's health
        attack: 3000,   // Stronger than player’s attack
        defense: 2000,  // Stronger defense
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
    unlockedWhen: (gameStore) => gameStore.ants >= 1000 || gameStore.queens >= 5,
  },


  // New wave: Volcano
  {
    name: 'Volcano',
    enemies: [
      {
        name: 'Lava Ant',
        health: 50000,
        attack: 8000,
        defense: 4000,
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
        health: 60000,
        attack: 9000,
        defense: 5000,
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
        health: 70000,
        attack: 10000,
        defense: 6000,
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
        health: 100000,
        attack: 12000,
        defense: 8000,
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
    unlockedWhen: (gameStore) => gameStore.ants >= 5000 || gameStore.queens >= 10,
  },

  // New wave: Underworld
  {
    name: 'Underworld',
    enemies: [
      {
        name: 'Hellfire Ant',
        health: 250000,
        attack: 20000,
        defense: 10000,
        regen: 2000,
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
        health: 300000,
        attack: 25000,
        defense: 12000,
        regen: 2500,
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
        health: 350000,
        attack: 30000,
        defense: 15000,
        regen: 3000,
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
        health: 500000,
        attack: 50000,
        defense: 25000,
        regen: 5000,
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
    unlockedWhen: (gameStore) => gameStore.ants >= 10000 || gameStore.queens >= 20,
  },
]
