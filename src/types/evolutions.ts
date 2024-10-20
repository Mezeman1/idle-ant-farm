export type AntNames = 'Start' |
  'Leaf cutters' |
  'Fire Ants' |
  'Harvester Ants' |
  'Army Ants' |
  'Weaver Ants' |
  'Desert Ants' |
  'Bullet Ants' |
  'Carpenter Ants' |
  'Trap-jaw Ants' |
  'Argentine Ants' |
  'Slave-making Ants' |
  'Honey Pot Ants' |
  'Acrobat Ants'

export interface ProductionRates {
  larvaeProductionRate: number;
  collectionRatePerAnt: number;
  collectionRatePerWorker: number;
  collectionRateModifier: number;
  larvaeProductionModifier: number;
}

export interface ResourceCosts {
  seedCostPerLarva: number;
  seedCostPerAnt: number;
  seedCostPerEliteAnt: number;
  larvaCostPerAnt: number;
  larvaCostPerEliteAnt: number;
  antCostPerQueen: number;
  seedCostPerQueen: number;
  royalJellyCostPerUpgrade: number;
}

export interface InitialCaps {
  maxSeeds: number;
  maxLarvae: number;
  maxAnts: number;
  maxQueens: number;
  maxEliteAnts: number;
}

export interface Evolution {
  id: number;
  name: AntNames;
  description: string;
  productionRates: ProductionRates;
  resourceCosts?: ResourceCosts;
  initialCaps?: InitialCaps;
  statsPerAnt?: Record<string, number>;
  bugModifiers?: Record<string, number>;
  adventureStore?: Record<string, number>;
  resources: Record<string, any>;
}

export const evolutions = [
  {
    id: 0,
    name: 'Start',
    description: 'The start of the game',

    productionRates: {
      larvaeProductionRate: 2.5, // Larvae produced per queen per minute
      collectionRatePerAnt: 60, // Seeds collected per ant per minute
      collectionRatePerWorker: 6000, // Seeds collected per worker per minute
      collectionRateModifier: 1.0, // Multiplicative modifier for seed collection rate
      larvaeProductionModifier: 1.0, // Multiplicative modifier for larvae production
    },

    resources: {
      seeds: {
        name: 'Seeds',
        lowerName: 'seeds',
        description: 'You have a species of ants that collect seeds.',
        emoji: '🌱',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae are the main resource used to create ants.',
        emoji: '🐛',
      },
      ants: {
        name: 'Ants',
        lowerName: 'ants',
        description: 'Ants collect seeds and fight bugs.',
        emoji: '🐜',
      },
      queens: {
        name: 'Queens',
        lowerName: 'queens',
        description: 'Queens are the main producers of larvae.',
        emoji: '👑',
      },
    },
  },
  {
    id: 1,
    name: 'Leaf cutters',
    description: 'The first evolution',

    statsPerAnt: {
      attackPerAnt: 4, // Attack value per ant
      healthPerAnt: 8, // Health value per ant
      defensePerAnt: 1, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 1.5,
      bugDefenseModifier: 1.5,
      bugMaxHealthModifier: 1.5,
      bugRegenModifier: 1.5,
    },

    productionRates: {
      larvaeProductionRate: 3, // Larvae produced per queen per minute
      collectionRatePerAnt: 120, // Seeds collected per ant per minute
      collectionRatePerWorker: 12000, // Seeds collected per worker per minute
      collectionRateModifier: 1.0,
      larvaeProductionModifier: 1.0,
    },

    resourceCosts: {
      seedCostPerLarva: 80,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 110,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 45,
      seedCostPerQueen: 500,

      royalJellyCostPerUpgrade: 1,
    },

    initialCaps: {
      maxSeeds: 1000,
      maxLarvae: 10,
      maxAnts: 300,
      maxQueens: 10,
      maxEliteAnts: 1,
    },

    resources: {
      seeds: {
        name: 'Leaves',
        lowerName: 'leaves',
        description: 'You have a species of ants that cuts leaves.',
        emoji: '🍃',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae are the main resource used to create ants.',
        emoji: '🐛',
      },
      ants: {
        name: 'Leafcutter ants',
        lowerName: 'leafcutter ants',
        description: 'Ants that cut leaves and fight bugs.',
        emoji: '🐜',
      },
      queens: {
        name: 'Queens',
        lowerName: 'queens',
        description: 'Queens are the main producers of larvae.',
        emoji: '👑',
      },
    },
  },
  {
    id: 2,
    name: 'Fire Ants',
    description: 'This evolution brings aggressive ants that excel in combat.',

    statsPerAnt: {
      attackPerAnt: 5, // Attack value per ant
      healthPerAnt: 10, // Health value per ant
      defensePerAnt: 1, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 2.25,
      bugDefenseModifier: 2.25,
      bugMaxHealthModifier: 2.25,
      bugRegenModifier: 2.25,
    },

    productionRates: {
      larvaeProductionRate: 3.5, // Larvae produced per queen per minute
      collectionRatePerAnt: 130, // Seeds collected per ant per minute
      collectionRatePerWorker: 13000, // Seeds collected per worker per minute
      collectionRateModifier: 1.1, // Slight increase in seed collection
      larvaeProductionModifier: 1.2, // Faster larvae production
    },

    resourceCosts: {
      seedCostPerLarva: 90,
      seedCostPerAnt: 85,
      seedCostPerEliteAnt: 120,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 50,
      seedCostPerQueen: 600,

      royalJellyCostPerUpgrade: 2,
    },

    initialCaps: {
      maxSeeds: 1500,
      maxLarvae: 15,
      maxAnts: 350,
      maxQueens: 12,
      maxEliteAnts: 2,
    },

    resources: {
      seeds: {
        name: 'Insects',
        lowerName: 'insects',
        description: 'Fire ants hunt insects for sustenance.',
        emoji: '🦗',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae are essential for growing your fire ant colony.',
        emoji: '🐛',
      },
      ants: {
        name: 'Fire Ants',
        lowerName: 'fire ants',
        description: 'Aggressive ants that can burn through enemies.',
        emoji: '🐜🔥',
      },
      queens: {
        name: 'Fire Queens',
        lowerName: 'fire queens',
        description: 'Queens that produce more larvae with fiery speed.',
        emoji: '👑🔥',
      },
    },
  },
  {
    id: 3,
    name: 'Harvester Ants',
    description: 'This evolution introduces ants specialized in gathering food efficiently.',

    statsPerAnt: {
      attackPerAnt: 1, // Attack value per ant
      healthPerAnt: 5, // Health value per ant
      defensePerAnt: 1, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 3.38,
      bugDefenseModifier: 3.38,
      bugMaxHealthModifier: 3.38,
      bugRegenModifier: 3.38,
    },

    productionRates: {
      larvaeProductionRate: 3, // Larvae produced per queen per minute
      collectionRatePerAnt: 200, // Seeds collected per ant per minute
      collectionRatePerWorker: 18000, // Seeds collected per worker per minute
      collectionRateModifier: 1.3, // Increased seed collection rate
      larvaeProductionModifier: 1.1, // Slight increase in larvae production
    },

    resourceCosts: {
      seedCostPerLarva: 70,
      seedCostPerAnt: 65,
      seedCostPerEliteAnt: 100,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 40,
      seedCostPerQueen: 450,

      royalJellyCostPerUpgrade: 1.5,
    },

    initialCaps: {
      maxSeeds: 2000,
      maxLarvae: 12,
      maxAnts: 400,
      maxQueens: 15,
      maxEliteAnts: 3,
    },

    resources: {
      seeds: {
        name: 'Seeds',
        lowerName: 'seeds',
        description: 'Harvester ants specialize in gathering large quantities of seeds.',
        emoji: '🌰',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae are the key to growing your harvester ant colony.',
        emoji: '🐛',
      },
      ants: {
        name: 'Harvester Ants',
        lowerName: 'harvester ants',
        description: 'Efficient gatherers that excel at collecting seeds.',
        emoji: '🐜🛠️',
      },
      queens: {
        name: 'Harvester Queens',
        lowerName: 'harvester queens',
        description: 'Queens that ensure a steady supply of larvae for your growing colony.',
        emoji: '👑🛠️',
      },
    },
  },
  {
    id: 4,
    name: 'Army Ants',
    description: 'This evolution introduces nomadic ants that are ruthless in combat and expansion.',

    statsPerAnt: {
      attackPerAnt: 10, // Attack value per ant
      healthPerAnt: 10, // Health value per ant
      defensePerAnt: 4, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 5.06,
      bugDefenseModifier: 5.06,
      bugMaxHealthModifier: 5.06,
      bugRegenModifier: 5.06,
    },

    productionRates: {
      larvaeProductionRate: 3.5, // Larvae produced per queen per minute
      collectionRatePerAnt: 60, // Seeds collected per ant per minute
      collectionRatePerWorker: 8000, // Seeds collected per worker per minute
      collectionRateModifier: 0.8, // Lower seed collection rate due to focus on meat collection
      larvaeProductionModifier: 1.5, // Higher larvae production rate
    },

    resourceCosts: {
      seedCostPerLarva: 100,
      seedCostPerAnt: 95,
      seedCostPerEliteAnt: 130,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 8,
      antCostPerQueen: 55,
      seedCostPerQueen: 700,

      royalJellyCostPerUpgrade: 3,
    },

    initialCaps: {
      maxSeeds: 1800,
      maxLarvae: 20,
      maxAnts: 500,
      maxQueens: 20,
      maxEliteAnts: 5,
    },

    resources: {
      seeds: {
        name: 'Meat',
        lowerName: 'meat',
        description: 'Army ants collect meat from their prey.',
        emoji: '🍖',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that quickly grow into fierce soldiers.',
        emoji: '🐛',
      },
      ants: {
        name: 'Army Ants',
        lowerName: 'army ants',
        description: 'Powerful ants that conquer enemies and expand their territory.',
        emoji: '🐜⚔️',
      },
      queens: {
        name: 'Army Queens',
        lowerName: 'army queens',
        description: 'Queens that breed large numbers of aggressive soldier ants.',
        emoji: '👑⚔️',
      },
    },
  },
  {
    id: 5,
    name: 'Weaver Ants',
    description: 'Ants that weave leaves together to form nests and are highly territorial.',

    statsPerAnt: {
      attackPerAnt: 2, // Attack value per ant
      healthPerAnt: 5, // Health value per ant
      defensePerAnt: 2, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 7.59,
      bugDefenseModifier: 7.59,
      bugMaxHealthModifier: 7.59,
      bugRegenModifier: 7.59,
    },

    productionRates: {
      larvaeProductionRate: 4, // Larvae produced per queen per minute
      collectionRatePerAnt: 80, // Seeds collected per ant per minute
      collectionRatePerWorker: 10000, // Seeds collected per worker per minute
      collectionRateModifier: 1.4, // Faster seed collection
      larvaeProductionModifier: 1.2, // Increased larvae production rate
    },

    resourceCosts: {
      seedCostPerLarva: 90,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 120,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 55,
      seedCostPerQueen: 700,

      royalJellyCostPerUpgrade: 2.5,
    },

    initialCaps: {
      maxSeeds: 2500,
      maxLarvae: 25,
      maxAnts: 550,
      maxQueens: 18,
      maxEliteAnts: 6,
    },

    resources: {
      seeds: {
        name: 'Silk',
        lowerName: 'silk',
        description: 'Weaver ants gather silk from their larvae to weave nests.',
        emoji: '🕸️',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that produce silk, essential for building nests.',
        emoji: '🐛',
      },
      ants: {
        name: 'Weaver Ants',
        lowerName: 'weaver ants',
        description: 'Ants that use silk to build and defend elaborate nests.',
        emoji: '🐜🕸️',
      },
      queens: {
        name: 'Weaver Queens',
        lowerName: 'weaver queens',
        description: 'Queens that breed silk-producing larvae.',
        emoji: '👑🕸️',
      },
    },
  },
  {
    id: 6,
    name: 'Desert Ants',
    description: 'Ants that thrive in hot, dry climates and are adapted to efficient foraging.',

    statsPerAnt: {
      attackPerAnt: 4, // Attack value per ant
      healthPerAnt: 5, // Health value per ant
      defensePerAnt: 5, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 11.39,
      bugDefenseModifier: 11.39,
      bugMaxHealthModifier: 11.39,
      bugRegenModifier: 11.39,
    },

    productionRates: {
      larvaeProductionRate: 3.5, // Larvae produced per queen per minute
      collectionRatePerAnt: 140, // Seeds collected per ant per minute
      collectionRatePerWorker: 16000, // Seeds collected per worker per minute
      collectionRateModifier: 1.6, // High efficiency in resource collection
      larvaeProductionModifier: 1.3, // Higher larvae production to survive harsh conditions
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 140,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 7,
      antCostPerQueen: 60,
      seedCostPerQueen: 850,

      royalJellyCostPerUpgrade: 3.0,
    },

    initialCaps: {
      maxSeeds: 3000,
      maxLarvae: 30,
      maxAnts: 600,
      maxQueens: 25,
      maxEliteAnts: 7,
    },

    resources: {
      seeds: {
        name: 'Cactus',
        lowerName: 'cactus',
        description: 'Desert ants gather moisture from cacti and other scarce plants.',
        emoji: '🌵',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow in harsh desert environments.',
        emoji: '🐛',
      },
      ants: {
        name: 'Desert Ants',
        lowerName: 'desert ants',
        description: 'Ants that travel far distances to gather resources in the desert.',
        emoji: '🐜☀️',
      },
      queens: {
        name: 'Desert Queens',
        lowerName: 'desert queens',
        description: 'Queens that breed hardy ants for the desert climate.',
        emoji: '👑☀️',
      },
    },
  },
  {
    id: 7,
    name: 'Bullet Ants',
    description: 'Aggressive ants with a sting powerful enough to fend off enemies.',

    statsPerAnt: {
      attackPerAnt: 15, // Attack value per ant
      healthPerAnt: 10, // Health value per ant
      defensePerAnt: 10, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 17.08,
      bugDefenseModifier: 17.08,
      bugMaxHealthModifier: 17.08,
      bugRegenModifier: 17.08,
    },

    productionRates: {
      larvaeProductionRate: 3, // Larvae produced per queen per minute
      collectionRatePerAnt: 150, // Seeds collected per ant per minute
      collectionRatePerWorker: 18000, // Seeds collected per worker per minute
      collectionRateModifier: 1.5, // High seed collection rate
      larvaeProductionModifier: 1.4, // Increased larvae production to support aggressive behavior
    },

    resourceCosts: {
      seedCostPerLarva: 95,
      seedCostPerAnt: 90,
      seedCostPerEliteAnt: 150,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 8,
      antCostPerQueen: 65,
      seedCostPerQueen: 900,

      royalJellyCostPerUpgrade: 3.5,
    },

    initialCaps: {
      maxSeeds: 3500,
      maxLarvae: 35,
      maxAnts: 700,
      maxQueens: 30,
      maxEliteAnts: 8,
    },

    resources: {
      seeds: {
        name: 'Flesh',
        lowerName: 'flesh',
        description: 'Bullet ants collect flesh from larger prey.',
        emoji: '🍖',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow quickly into aggressive soldiers.',
        emoji: '🐛',
      },
      ants: {
        name: 'Bullet Ants',
        lowerName: 'bullet ants',
        description: 'Powerful ants with a painful sting, capable of taking down large enemies.',
        emoji: '🐜💥',
      },
      queens: {
        name: 'Bullet Queens',
        lowerName: 'bullet queens',
        description: 'Queens that produce tough, aggressive offspring.',
        emoji: '👑💥',
      },
    },
  },
  {
    id: 8,
    name: 'Carpenter Ants',
    description: 'Ants that build intricate nests by carving wood, making them excellent gatherers.',

    statsPerAnt: {
      attackPerAnt: 2, // Attack value per ant
      healthPerAnt: 5, // Health value per ant
      defensePerAnt: 2, // Defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 25.61,
      bugDefenseModifier: 25.61,
      bugMaxHealthModifier: 25.61,
      bugRegenModifier: 25.61,
    },

    productionRates: {
      larvaeProductionRate: 4.5, // Larvae produced per queen per minute
      collectionRatePerAnt: 180, // Seeds collected per ant per minute
      collectionRatePerWorker: 22000, // Seeds collected per worker per minute
      collectionRateModifier: 1.8, // High seed collection rate
      larvaeProductionModifier: 1.5, // High larvae production rate
    },

    resourceCosts: {
      seedCostPerLarva: 100,
      seedCostPerAnt: 100,
      seedCostPerEliteAnt: 160,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 9,
      antCostPerQueen: 70,
      seedCostPerQueen: 1000,

      royalJellyCostPerUpgrade: 4.0,
    },

    initialCaps: {
      maxSeeds: 4000,
      maxLarvae: 40,
      maxAnts: 800,
      maxQueens: 35,
      maxEliteAnts: 10,
    },

    resources: {
      seeds: {
        name: 'Wood',
        lowerName: 'wood',
        description: 'Carpenter ants collect wood and carve out nests from trees.',
        emoji: '🪵',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow into carpenter ants specialized in wood gathering.',
        emoji: '🐛',
      },
      ants: {
        name: 'Carpenter Ants',
        lowerName: 'carpenter ants',
        description: 'Ants that build and live in wooden structures.',
        emoji: '🐜🪵',
      },
      queens: {
        name: 'Carpenter Queens',
        lowerName: 'carpenter queens',
        description: 'Queens that breed carpenter ants to expand your wooden nest.',
        emoji: '👑🪵',
      },
    },
  },
  {
    id: 9,
    name: 'Trap-jaw Ants',
    description: 'Ants with powerful jaws that can snap shut at incredible speeds, used both for hunting and defense.',

    statsPerAnt: {
      attackPerAnt: 12,
      healthPerAnt: 8,
      defensePerAnt: 4,
    },

    bugModifiers: {
      bugAttackModifier: 3.0,
      bugDefenseModifier: 2.5,
      bugMaxHealthModifier: 2.5,
      bugRegenModifier: 2.0,
    },

    productionRates: {
      larvaeProductionRate: 2.8,
      collectionRatePerAnt: 100,
      collectionRatePerWorker: 15000,
      collectionRateModifier: 1.2,
      larvaeProductionModifier: 1.4,
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 120,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 50,
      seedCostPerQueen: 650,

      royalJellyCostPerUpgrade: 2.0,
    },

    initialCaps: {
      maxSeeds: 2500,
      maxLarvae: 25,
      maxAnts: 450,
      maxQueens: 12,
      maxEliteAnts: 2,
    },

    resources: {
      seeds: {
        name: 'Insects',
        lowerName: 'insects',
        description: 'Trap-jaw ants hunt fast-moving insects using their powerful jaws.',
        emoji: '🦗',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow into strong and fast predators.',
        emoji: '🐛',
      },
      ants: {
        name: 'Trap-jaw Ants',
        lowerName: 'trap-jaw ants',
        description: 'Ants with incredibly fast jaws, used for hunting and defense.',
        emoji: '🐜🦷',
      },
      queens: {
        name: 'Trap-jaw Queens',
        lowerName: 'trap-jaw queens',
        description: 'Queens that produce powerful and fast-jawed offspring.',
        emoji: '👑🦷',
      },
    },
  },
  {
    id: 10,
    name: 'Argentine Ants',
    description: 'Highly invasive ants known for forming massive supercolonies that span great distances, overwhelming other species.',

    statsPerAnt: {
      attackPerAnt: 4,
      healthPerAnt: 5,
      defensePerAnt: 2,
    },

    bugModifiers: {
      bugAttackModifier: 2.8,
      bugDefenseModifier: 2.8,
      bugMaxHealthModifier: 2.8,
      bugRegenModifier: 2.5,
    },

    productionRates: {
      larvaeProductionRate: 5.0, // High larvae production to support massive colonies
      collectionRatePerAnt: 170,
      collectionRatePerWorker: 25000,
      collectionRateModifier: 2.0,
      larvaeProductionModifier: 2.0,
    },

    resourceCosts: {
      seedCostPerLarva: 95,
      seedCostPerAnt: 85,
      seedCostPerEliteAnt: 140,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 65,
      seedCostPerQueen: 900,

      royalJellyCostPerUpgrade: 3.0,
    },

    initialCaps: {
      maxSeeds: 4000,
      maxLarvae: 30,
      maxAnts: 650,
      maxQueens: 30,
      maxEliteAnts: 5,
    },

    resources: {
      seeds: {
        name: 'Resources',
        lowerName: 'resources',
        description: 'Argentine ants gather whatever they can find to fuel their supercolony.',
        emoji: '🪨',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae produced en masse to fuel the growing supercolony.',
        emoji: '🐛',
      },
      ants: {
        name: 'Argentine Ants',
        lowerName: 'argentine ants',
        description: 'Invasive ants that form large supercolonies and displace other species.',
        emoji: '🐜🌍',
      },
      queens: {
        name: 'Argentine Queens',
        lowerName: 'argentine queens',
        description: 'Queens that breed vast numbers of ants, forming massive supercolonies.',
        emoji: '👑🌍',
      },
    },
  },
  {
    id: 11,
    name: 'Slave-making Ants',
    description: 'Ants that raid the colonies of other species, capturing their brood to raise as workers for their own colonies.',

    statsPerAnt: {
      attackPerAnt: 8,
      healthPerAnt: 6,
      defensePerAnt: 4,
    },

    bugModifiers: {
      bugAttackModifier: 3.5,
      bugDefenseModifier: 3.0,
      bugMaxHealthModifier: 3.0,
      bugRegenModifier: 2.5,
    },

    productionRates: {
      larvaeProductionRate: 2.5, // Lower because of reliance on raided colonies
      collectionRatePerAnt: 140,
      collectionRatePerWorker: 20000,
      collectionRateModifier: 1.3,
      larvaeProductionModifier: 1.0,
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 130,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 60,
      seedCostPerQueen: 850,

      royalJellyCostPerUpgrade: 2.8,
    },

    initialCaps: {
      maxSeeds: 3200,
      maxLarvae: 25,
      maxAnts: 500,
      maxQueens: 20,
      maxEliteAnts: 4,
    },

    resources: {
      seeds: {
        name: 'Plundered Seeds',
        lowerName: 'plundered seeds',
        description: 'Slave-making ants raid other colonies for seeds and resources.',
        emoji: '🍂',
      },
      larvae: {
        name: 'Raided Larvae',
        lowerName: 'raided larvae',
        description: 'Captured larvae from other colonies that grow into workers for your colony.',
        emoji: '🐛',
      },
      ants: {
        name: 'Slave-making Ants',
        lowerName: 'slave-making ants',
        description: 'Aggressive ants that raid other colonies, forcing captured ants to work for them.',
        emoji: '🐜🗡️',
      },
      queens: {
        name: 'Slave-making Queens',
        lowerName: 'slave-making queens',
        description: 'Queens that breed raiders capable of enslaving ants from other colonies.',
        emoji: '👑🗡️',
      },
    },
  },
  {
    id: 12,
    name: 'Sugar Ants',
    description: 'Ants known for their preference for sweet substances, often scavenging in human environments to find sugar and nectar.',

    statsPerAnt: {
      attackPerAnt: 2,
      healthPerAnt: 4,
      defensePerAnt: 1,
    },

    bugModifiers: {
      bugAttackModifier: 1.5,
      bugDefenseModifier: 1.5,
      bugMaxHealthModifier: 1.5,
      bugRegenModifier: 1.2,
    },

    productionRates: {
      larvaeProductionRate: 2.5,
      collectionRatePerAnt: 180,
      collectionRatePerWorker: 20000,
      collectionRateModifier: 1.8,
      larvaeProductionModifier: 1.0,
    },

    resourceCosts: {
      seedCostPerLarva: 75,
      seedCostPerAnt: 65,
      seedCostPerEliteAnt: 110,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 45,
      seedCostPerQueen: 500,

      royalJellyCostPerUpgrade: 1.8,
    },

    initialCaps: {
      maxSeeds: 2500,
      maxLarvae: 18,
      maxAnts: 400,
      maxQueens: 15,
      maxEliteAnts: 2,
    },

    resources: {
      seeds: {
        name: 'Sugar',
        lowerName: 'sugar',
        description: 'Sugar ants collect sweet substances like nectar and sugar.',
        emoji: '🍬',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow with a steady supply of sweet resources.',
        emoji: '🐛',
      },
      ants: {
        name: 'Sugar Ants',
        lowerName: 'sugar ants',
        description: 'Small ants that prefer sweet foods, often found in human environments.',
        emoji: '🐜🍬',
      },
      queens: {
        name: 'Sugar Queens',
        lowerName: 'sugar queens',
        description: 'Queens that breed ants with a strong preference for sugary substances.',
        emoji: '👑🍬',
      },
    },
  },
  {
    id: 13,
    name: 'Woodland Ants',
    description: 'Ants that live in forested areas, foraging for seeds and small insects while building underground nests among tree roots.',

    statsPerAnt: {
      attackPerAnt: 5,
      healthPerAnt: 7,
      defensePerAnt: 3,
    },

    bugModifiers: {
      bugAttackModifier: 2.2,
      bugDefenseModifier: 2.2,
      bugMaxHealthModifier: 2.2,
      bugRegenModifier: 2.0,
    },

    productionRates: {
      larvaeProductionRate: 3.5,
      collectionRatePerAnt: 160,
      collectionRatePerWorker: 22000,
      collectionRateModifier: 1.5,
      larvaeProductionModifier: 1.3,
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 125,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 55,
      seedCostPerQueen: 700,

      royalJellyCostPerUpgrade: 2.0,
    },

    initialCaps: {
      maxSeeds: 2800,
      maxLarvae: 20,
      maxAnts: 450,
      maxQueens: 20,
      maxEliteAnts: 3,
    },

    resources: {
      seeds: {
        name: 'Acorns',
        lowerName: 'acorns',
        description: 'Woodland ants collect seeds and acorns from forest floors.',
        emoji: '🌰',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae grow in the nutrient-rich soil beneath forest trees.',
        emoji: '🐛',
      },
      ants: {
        name: 'Woodland Ants',
        lowerName: 'woodland ants',
        description: 'Ants that thrive in forest environments, gathering seeds and building nests underground.',
        emoji: '🐜🌳',
      },
      queens: {
        name: 'Woodland Queens',
        lowerName: 'woodland queens',
        description: 'Queens that produce ants adapted to forest ecosystems.',
        emoji: '👑🌳',
      },
    },
  },
  {
    id: 14,
    name: 'Pharaoh Ants',
    description: 'Tiny ants notorious for infiltrating homes and hospitals, thriving in warm, indoor environments and scavenging a variety of foods.',

    statsPerAnt: {
      attackPerAnt: 3,
      healthPerAnt: 4,
      defensePerAnt: 1,
    },

    bugModifiers: {
      bugAttackModifier: 1.7,
      bugDefenseModifier: 1.7,
      bugMaxHealthModifier: 1.5,
      bugRegenModifier: 1.4,
    },

    productionRates: {
      larvaeProductionRate: 3.0,
      collectionRatePerAnt: 130,
      collectionRatePerWorker: 17000,
      collectionRateModifier: 1.4,
      larvaeProductionModifier: 1.1,
    },

    resourceCosts: {
      seedCostPerLarva: 75,
      seedCostPerAnt: 70,
      seedCostPerEliteAnt: 115,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 50,
      seedCostPerQueen: 600,

      royalJellyCostPerUpgrade: 1.8,
    },

    initialCaps: {
      maxSeeds: 2600,
      maxLarvae: 18,
      maxAnts: 400,
      maxQueens: 15,
      maxEliteAnts: 2,
    },

    resources: {
      seeds: {
        name: 'Scraps',
        lowerName: 'scraps',
        description: 'Pharaoh ants scavenge for food scraps in human environments.',
        emoji: '🍞',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae grow quickly with easy access to scavenged human food.',
        emoji: '🐛',
      },
      ants: {
        name: 'Pharaoh Ants',
        lowerName: 'pharaoh ants',
        description: 'Tiny ants that infiltrate homes, scavenging for any available food.',
        emoji: '🐜🏠',
      },
      queens: {
        name: 'Pharaoh Queens',
        lowerName: 'pharaoh queens',
        description: 'Queens that produce fast-breeding ants capable of living in warm, indoor environments.',
        emoji: '👑🏠',
      },
    },
  },
  {
    id: 15,
    name: 'Thatching Ants',
    description: 'Ants that build large, thatch-like nests out of grass and plant material, known for aggressively defending their colonies.',

    statsPerAnt: {
      attackPerAnt: 7,
      healthPerAnt: 8,
      defensePerAnt: 5,
    },

    bugModifiers: {
      bugAttackModifier: 2.5,
      bugDefenseModifier: 2.5,
      bugMaxHealthModifier: 2.5,
      bugRegenModifier: 2.3,
    },

    productionRates: {
      larvaeProductionRate: 3.2,
      collectionRatePerAnt: 140,
      collectionRatePerWorker: 20000,
      collectionRateModifier: 1.5,
      larvaeProductionModifier: 1.2,
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 125,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 55,
      seedCostPerQueen: 750,

      royalJellyCostPerUpgrade: 2.1,
    },

    initialCaps: {
      maxSeeds: 3000,
      maxLarvae: 20,
      maxAnts: 500,
      maxQueens: 22,
      maxEliteAnts: 4,
    },

    resources: {
      seeds: {
        name: 'Grass',
        lowerName: 'grass',
        description: 'Thatching ants collect grass and plant material to build their massive nests.',
        emoji: '🌾',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that develop in the safety of thatch nests.',
        emoji: '🐛',
      },
      ants: {
        name: 'Thatching Ants',
        lowerName: 'thatching ants',
        description: 'Aggressive ants known for building large, thatched nests from grass and plant material.',
        emoji: '🐜🌾',
      },
      queens: {
        name: 'Thatching Queens',
        lowerName: 'thatching queens',
        description: 'Queens that produce strong, aggressive workers to defend the colony and build elaborate nests.',
        emoji: '👑🌾',
      },
    },
  },
  {
    id: 16,
    name: 'Citronella Ants',
    description: 'Ants known for their lemony scent when disturbed, often living in underground nests and farming aphids for honeydew.',

    statsPerAnt: {
      attackPerAnt: 3,
      healthPerAnt: 5,
      defensePerAnt: 2,
    },

    bugModifiers: {
      bugAttackModifier: 1.8,
      bugDefenseModifier: 1.8,
      bugMaxHealthModifier: 1.7,
      bugRegenModifier: 1.5,
    },

    productionRates: {
      larvaeProductionRate: 3.5,
      collectionRatePerAnt: 120,
      collectionRatePerWorker: 17000,
      collectionRateModifier: 1.3,
      larvaeProductionModifier: 1.4,
    },

    resourceCosts: {
      seedCostPerLarva: 80,
      seedCostPerAnt: 70,
      seedCostPerEliteAnt: 115,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 50,
      seedCostPerQueen: 600,

      royalJellyCostPerUpgrade: 1.9,
    },

    initialCaps: {
      maxSeeds: 2600,
      maxLarvae: 18,
      maxAnts: 420,
      maxQueens: 18,
      maxEliteAnts: 2,
    },

    resources: {
      seeds: {
        name: 'Honeydew',
        lowerName: 'honeydew',
        description: 'Citronella ants collect honeydew produced by aphids, which they farm underground.',
        emoji: '🍯',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that are nurtured with honeydew and other underground resources.',
        emoji: '🐛',
      },
      ants: {
        name: 'Citronella Ants',
        lowerName: 'citronella ants',
        description: 'Ants that farm aphids underground and emit a lemony scent when disturbed.',
        emoji: '🐜🍋',
      },
      queens: {
        name: 'Citronella Queens',
        lowerName: 'citronella queens',
        description: 'Queens that breed ants capable of farming aphids and collecting honeydew.',
        emoji: '👑🍋',
      },
    },
  },
  {
    id: 17,
    name: 'Field Ants',
    description: 'Large ants that prefer open habitats like grasslands, known for their aggressive defense of their colonies and their foraging skills.',

    statsPerAnt: {
      attackPerAnt: 6,
      healthPerAnt: 8,
      defensePerAnt: 4,
    },

    bugModifiers: {
      bugAttackModifier: 2.6,
      bugDefenseModifier: 2.6,
      bugMaxHealthModifier: 2.6,
      bugRegenModifier: 2.3,
    },

    productionRates: {
      larvaeProductionRate: 3.8,
      collectionRatePerAnt: 150,
      collectionRatePerWorker: 23000,
      collectionRateModifier: 1.6,
      larvaeProductionModifier: 1.5,
    },

    resourceCosts: {
      seedCostPerLarva: 90,
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 130,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 60,
      seedCostPerQueen: 750,

      royalJellyCostPerUpgrade: 2.2,
    },

    initialCaps: {
      maxSeeds: 3200,
      maxLarvae: 22,
      maxAnts: 500,
      maxQueens: 25,
      maxEliteAnts: 4,
    },

    resources: {
      seeds: {
        name: 'Grains',
        lowerName: 'grains',
        description: 'Field ants collect grains and seeds from open fields and grasslands.',
        emoji: '🌾',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that thrive in open habitats, nourished by grains and seeds.',
        emoji: '🐛',
      },
      ants: {
        name: 'Field Ants',
        lowerName: 'field ants',
        description: 'Aggressive ants that defend their colonies in grasslands and open habitats.',
        emoji: '🐜🏞️',
      },
      queens: {
        name: 'Field Queens',
        lowerName: 'field queens',
        description: 'Queens that produce strong workers for foraging in open fields.',
        emoji: '👑🏞️',
      },
    },
  },
  {
    id: 18,
    name: 'Ponerine Ants',
    description: 'Primitive ants with strong mandibles and stingers, known for hunting live prey and establishing small but highly efficient colonies.',

    statsPerAnt: {
      attackPerAnt: 9,
      healthPerAnt: 7,
      defensePerAnt: 3,
    },

    bugModifiers: {
      bugAttackModifier: 3.0,
      bugDefenseModifier: 2.5,
      bugMaxHealthModifier: 2.5,
      bugRegenModifier: 2.0,
    },

    productionRates: {
      larvaeProductionRate: 2.8,
      collectionRatePerAnt: 100,
      collectionRatePerWorker: 17000,
      collectionRateModifier: 1.3,
      larvaeProductionModifier: 1.2,
    },

    resourceCosts: {
      seedCostPerLarva: 85,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 120,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 55,
      seedCostPerQueen: 700,

      royalJellyCostPerUpgrade: 2.3,
    },

    initialCaps: {
      maxSeeds: 2800,
      maxLarvae: 18,
      maxAnts: 420,
      maxQueens: 20,
      maxEliteAnts: 3,
    },

    resources: {
      seeds: {
        name: 'Prey',
        lowerName: 'prey',
        description: 'Ponerine ants hunt live prey for sustenance.',
        emoji: '🦗',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae grow quickly, nourished by the captured prey.',
        emoji: '🐛',
      },
      ants: {
        name: 'Ponerine Ants',
        lowerName: 'ponerine ants',
        description: 'Primitive ants that hunt live prey with strong mandibles and stingers.',
        emoji: '🐜🗡️',
      },
      queens: {
        name: 'Ponerine Queens',
        lowerName: 'ponerine queens',
        description: 'Queens that breed strong and predatory ants, capable of taking down live prey.',
        emoji: '👑🗡️',
      },
    },
  },
  {
    id: 19,
    name: 'Acrobat Ants',
    description: 'Agile ants known for their ability to raise their abdomens in defense, often nesting in cavities in trees or under bark.',

    statsPerAnt: {
      attackPerAnt: 5,
      healthPerAnt: 6,
      defensePerAnt: 4,
    },

    bugModifiers: {
      bugAttackModifier: 2.1,
      bugDefenseModifier: 2.2,
      bugMaxHealthModifier: 2.2,
      bugRegenModifier: 2.0,
    },

    productionRates: {
      larvaeProductionRate: 3.4,
      collectionRatePerAnt: 140,
      collectionRatePerWorker: 18000,
      collectionRateModifier: 1.5,
      larvaeProductionModifier: 1.3,
    },

    resourceCosts: {
      seedCostPerLarva: 80,
      seedCostPerAnt: 75,
      seedCostPerEliteAnt: 120,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 50,
      seedCostPerQueen: 650,

      royalJellyCostPerUpgrade: 2.0,
    },

    initialCaps: {
      maxSeeds: 3000,
      maxLarvae: 20,
      maxAnts: 450,
      maxQueens: 18,
      maxEliteAnts: 3,
    },

    resources: {
      seeds: {
        name: 'Bark',
        lowerName: 'bark',
        description: 'Acrobat ants collect bark and small debris from trees for their nests.',
        emoji: '🌿',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that develop in the safe confines of tree bark and cavities.',
        emoji: '🐛',
      },
      ants: {
        name: 'Acrobat Ants',
        lowerName: 'acrobat ants',
        description: 'Agile ants that raise their abdomens in defense, often nesting under bark.',
        emoji: '🐜🎪',
      },
      queens: {
        name: 'Acrobat Queens',
        lowerName: 'acrobat queens',
        description: 'Queens that breed agile workers adapted to building in treetop environments.',
        emoji: '👑🎪',
      },
    },
  },
  {
    id: 20,
    name: 'Yellow Crazy Ants',
    description: 'Highly invasive ants with erratic movement patterns, known for overwhelming prey with their sheer numbers.',

    statsPerAnt: {
      attackPerAnt: 6,
      healthPerAnt: 5,
      defensePerAnt: 2,
    },

    bugModifiers: {
      bugAttackModifier: 3.2,
      bugDefenseModifier: 3.0,
      bugMaxHealthModifier: 3.0,
      bugRegenModifier: 2.5,
    },

    productionRates: {
      larvaeProductionRate: 4.2,
      collectionRatePerAnt: 180,
      collectionRatePerWorker: 24000,
      collectionRateModifier: 2.0,
      larvaeProductionModifier: 1.6,
    },

    resourceCosts: {
      seedCostPerLarva: 90,
      seedCostPerAnt: 85,
      seedCostPerEliteAnt: 140,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 7,
      antCostPerQueen: 65,
      seedCostPerQueen: 850,

      royalJellyCostPerUpgrade: 3.0,
    },

    initialCaps: {
      maxSeeds: 3500,
      maxLarvae: 25,
      maxAnts: 550,
      maxQueens: 30,
      maxEliteAnts: 4,
    },

    resources: {
      seeds: {
        name: 'Insects',
        lowerName: 'insects',
        description: 'Yellow crazy ants hunt insects and overwhelm prey with their numbers.',
        emoji: '🦗',
      },
      larvae: {
        name: 'Larvae',
        lowerName: 'larvae',
        description: 'Larvae that grow quickly due to the vast resources collected by their colony.',
        emoji: '🐛',
      },
      ants: {
        name: 'Yellow Crazy Ants',
        lowerName: 'yellow crazy ants',
        description: 'Erratic and invasive ants that can overwhelm prey and other colonies.',
        emoji: '🐜🌀',
      },
      queens: {
        name: 'Yellow Crazy Queens',
        lowerName: 'yellow crazy queens',
        description: 'Queens that breed erratic and highly invasive workers.',
        emoji: '👑🌀',
      },
    },
  },
] as Evolution[]
