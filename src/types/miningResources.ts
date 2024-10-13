import {BASE_XP, MiningResource, ResourceType} from '@/types/trainingTypes'

export const miningResources = [
  {
    name: ResourceType.Dirt,
    xpPerAction: 15,
    levelRequired: 1,
    initialTimePerAction: 3,
    timePerAction: 3,
    initialRespawnTime: 2,
    respawnTime: 2,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,

    milestones: [],
  },
  {
    name: ResourceType.Clay,
    xpPerAction: 20,
    levelRequired: 5,
    initialTimePerAction: 3.6,
    timePerAction: 3.6,
    initialRespawnTime: 2,
    respawnTime: 2,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Sand,
    xpPerAction: 35,
    levelRequired: 10,
    initialTimePerAction: 4.2,
    timePerAction: 4.2,
    initialRespawnTime: 3,
    respawnTime: 3,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Leaf,
    xpPerAction: 50,
    levelRequired: 20,
    initialTimePerAction: 4.8,
    timePerAction: 4.8,
    initialRespawnTime: 3.5,
    respawnTime: 3.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Twig,
    xpPerAction: 65,
    levelRequired: 30,
    initialTimePerAction: 5.4,
    timePerAction: 5.4,
    initialRespawnTime: 4,
    respawnTime: 4,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.RockFragment,
    xpPerAction: 80,
    levelRequired: 40,
    initialTimePerAction: 6,
    timePerAction: 6,
    initialRespawnTime: 4.5,
    respawnTime: 4.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.RottenWood,
    xpPerAction: 100,
    levelRequired: 50,
    initialTimePerAction: 7.2,
    timePerAction: 7.2,
    initialRespawnTime: 5,
    respawnTime: 5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Fungus,
    xpPerAction: 120,
    levelRequired: 60,
    initialTimePerAction: 8.4,
    timePerAction: 8.4,
    initialRespawnTime: 5.5,
    respawnTime: 5.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Pebble,
    xpPerAction: 150,
    levelRequired: 70,
    initialTimePerAction: 9.6,
    timePerAction: 9.6,
    initialRespawnTime: 6,
    respawnTime: 6,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Resin,
    xpPerAction: 175,
    levelRequired: 75,
    initialTimePerAction: 10.8,
    timePerAction: 10.8,
    initialRespawnTime: 6.5,
    respawnTime: 6.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Mushroom,
    xpPerAction: 200,
    levelRequired: 80,
    initialTimePerAction: 12,
    timePerAction: 12,
    initialRespawnTime: 7,
    respawnTime: 7,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Sap,
    xpPerAction: 250,
    levelRequired: 85,
    initialTimePerAction: 13.2,
    timePerAction: 13.2,
    initialRespawnTime: 7.5,
    respawnTime: 7.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.Root,
    xpPerAction: 300,
    levelRequired: 90,
    initialTimePerAction: 14.4,
    timePerAction: 14.4,
    initialRespawnTime: 8,
    respawnTime: 8,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.CarapaceFragment,
    xpPerAction: 350,
    levelRequired: 92,
    initialTimePerAction: 15.6,
    timePerAction: 15.6,
    initialRespawnTime: 8.5,
    respawnTime: 8.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.AntLarvae,
    xpPerAction: 400,
    levelRequired: 95,
    initialTimePerAction: 16.8,
    timePerAction: 16.8,
    initialRespawnTime: 9,
    respawnTime: 9,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.AntPheromones,
    xpPerAction: 450,
    levelRequired: 97,
    initialTimePerAction: 18,
    timePerAction: 18,
    initialRespawnTime: 9.5,
    respawnTime: 9.5,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
  {
    name: ResourceType.RoyalJelly,
    xpPerAction: 500,
    levelRequired: 99,
    initialTimePerAction: 19.2,
    timePerAction: 19.2,
    initialRespawnTime: 10,
    respawnTime: 10,
    isDepleted: false,

    level: 1,
    xp: 0,
    xpToNextLevel: BASE_XP,
  },
] as MiningResource[]
