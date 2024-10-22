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
  'Sugar Ants' |
  'Woodland Ants' |
  'Pharaoh Ants' |
  'Thatching Ants' |
  'Citronella Ants' |
  'Field Ants' |
  'Ponerine Ants' |
  'Acrobat Ants' |
  'Yellow Crazy Ants'

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

function scaleEvolutions(baseEvolutions: Evolution[]): Evolution[] {
  const scaleFactor = 1.5 // 50% increase per evolution
  
  return baseEvolutions.map((evolution, index) => {
    if (index <= 1) return evolution // Don't scale the first two evolutions
    
    const scale = Math.pow(scaleFactor, index - 1)
    const baseEvolution = baseEvolutions[1] // Always base on the second evolution
    
    return {
      ...evolution,
      statsPerAnt: baseEvolution.statsPerAnt ? {
        attackPerAnt: Math.round(baseEvolution.statsPerAnt.attackPerAnt * scale),
        healthPerAnt: Math.round(baseEvolution.statsPerAnt.healthPerAnt * scale),
        defensePerAnt: Math.round(baseEvolution.statsPerAnt.defensePerAnt * scale),
      } : undefined,
      
      bugModifiers: baseEvolution.bugModifiers ? {
        bugAttackModifier: baseEvolution.bugModifiers.bugAttackModifier * scale,
        bugDefenseModifier: baseEvolution.bugModifiers.bugDefenseModifier * scale,
        bugMaxHealthModifier: baseEvolution.bugModifiers.bugMaxHealthModifier * scale,
        bugRegenModifier: baseEvolution.bugModifiers.bugRegenModifier * scale,
      } : undefined,
      
      productionRates: {
        larvaeProductionRate: baseEvolution.productionRates.larvaeProductionRate * scale,
        collectionRatePerAnt: Math.round(baseEvolution.productionRates.collectionRatePerAnt * scale),
        collectionRatePerWorker: Math.round(baseEvolution.productionRates.collectionRatePerWorker * scale),
        collectionRateModifier: baseEvolution.productionRates.collectionRateModifier * Math.sqrt(scale),
        larvaeProductionModifier: baseEvolution.productionRates.larvaeProductionModifier * Math.sqrt(scale),
      },
      
      resourceCosts: evolution.resourceCosts,
      
      initialCaps: baseEvolution.initialCaps ? {
        maxSeeds: Math.round(baseEvolution.initialCaps.maxSeeds * scale),
        maxLarvae: Math.round(baseEvolution.initialCaps.maxLarvae * scale),
        maxAnts: Math.round(baseEvolution.initialCaps.maxAnts * scale),
        maxQueens: Math.round(baseEvolution.initialCaps.maxQueens * scale),
        maxEliteAnts: Math.round(baseEvolution.initialCaps.maxEliteAnts * scale),
      } : undefined,
    }
  })
}

// Define base evolutions without scaling
const baseEvolutions: Evolution[] = [
  {
    id: 0,
    name: 'Seed Gatherers',
    description: 'The humble beginnings of your ant colony',

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
      attackPerAnt: 4, // Base attack value per ant
      healthPerAnt: 8, // Base health value per ant
      defensePerAnt: 1, // Base defense value per ant
    },

    bugModifiers: {
      bugAttackModifier: 1.5,
      bugDefenseModifier: 1.5,
      bugMaxHealthModifier: 1.5,
      bugRegenModifier: 1.5,
    },

    productionRates: {
      larvaeProductionRate: 4, // Larvae produced per queen per minute
      collectionRatePerAnt: 150, // Seeds collected per ant per minute
      collectionRatePerWorker: 15000, // Seeds collected per worker per minute
      collectionRateModifier: 1.1, // Slight increase to reflect better gathering efficiency
      larvaeProductionModifier: 1.1, // Increased to reflect better scaling
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
      attackPerAnt: 5, // Slight increase from Leafcutters
      healthPerAnt: 10, // Increased from 8 for better durability
      defensePerAnt: 2, // Increased from 1 for better combat resilience
    },

    bugModifiers: {
      bugAttackModifier: 2.0, // Scaled from 1.5 for more challenging enemies
      bugDefenseModifier: 2.0,
      bugMaxHealthModifier: 2.0,
      bugRegenModifier: 2.0,
    },

    productionRates: {
      larvaeProductionRate: 4.5, // Increased slightly from 4 for better scaling
      collectionRatePerAnt: 160, // Slightly increased from 150 to reflect combat efficiency
      collectionRatePerWorker: 16000, // Scaled to reflect more effective resource gathering
      collectionRateModifier: 1.15, // Improved gathering rate
      larvaeProductionModifier: 1.2, // Increased to reflect higher production
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
      maxSeeds: 1500, // Increased from 1000 for resource scaling
      maxLarvae: 15,  // Increased from 10 for better production
      maxAnts: 350,   // Increased from 300 for army size growth
      maxQueens: 12,  // Increased from 10 to support larger army
      maxEliteAnts: 2, // Increased from 1 to reflect stronger units
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
      attackPerAnt: 3, // Slight increase from 2 to 3 for balance
      healthPerAnt: 7, // Increased from 6 for better durability
      defensePerAnt: 2, // Increased from 1 to 2 for more balanced defense
    },

    bugModifiers: {
      bugAttackModifier: 2.5, // Scaled based on combat-focused stages
      bugDefenseModifier: 2.5,
      bugMaxHealthModifier: 2.5,
      bugRegenModifier: 2.5,
    },

    productionRates: {
      larvaeProductionRate: 5.5, // Lowered slightly for balance with resource gathering focus
      collectionRatePerAnt: 200, // Increased from 180 to reflect gathering specialization
      collectionRatePerWorker: 19000, // Increased slightly from 18000 to align with gathering focus
      collectionRateModifier: 1.45, // Increased slightly to reflect specialization in gathering
      larvaeProductionModifier: 1.25, // Slight improvement to maintain production efficiency
    },

    resourceCosts: {
      seedCostPerLarva: 75, // Scaled for resource gathering ants
      seedCostPerAnt: 70,
      seedCostPerEliteAnt: 110,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 45,
      seedCostPerQueen: 500,

      royalJellyCostPerUpgrade: 1.5,
    },

    initialCaps: {
      maxSeeds: 2800, // Increased for resource focus
      maxLarvae: 20,  // Increased slightly to maintain balance
      maxAnts: 480,   // Increased for larger colonies
      maxQueens: 20,  // Boost to queen capacity for efficient production
      maxEliteAnts: 4, // Maintained
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
      attackPerAnt: 14, // Increased from 12 for stronger attack power
      healthPerAnt: 14, // Increased from 12 for better survivability in combat
      defensePerAnt: 6, // Increased from 5 for stronger defense
    },

    bugModifiers: {
      bugAttackModifier: 5.5, // Adjusted for better balance with stronger enemies
      bugDefenseModifier: 5.5,
      bugMaxHealthModifier: 5.5,
      bugRegenModifier: 5.5,
    },

    productionRates: {
      larvaeProductionRate: 4.5, // Slight increase for better growth
      collectionRatePerAnt: 75, // Slightly improved to keep resource gathering balanced
      collectionRatePerWorker: 9500, // Slight increase for balance with larger armies
      collectionRateModifier: 0.9, // Improved to reflect better collection efficiency
      larvaeProductionModifier: 1.7, // Improved breeding rates for larger combat units
    },

    resourceCosts: {
      seedCostPerLarva: 110,
      seedCostPerAnt: 105,
      seedCostPerEliteAnt: 140,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 8,
      antCostPerQueen: 60,
      seedCostPerQueen: 750,

      royalJellyCostPerUpgrade: 3.2,
    },

    initialCaps: {
      maxSeeds: 3000, // Larger capacity for resources in combat-focused colonies
      maxLarvae: 30,  // Increased to reflect higher production needs
      maxAnts: 650,   // Increased for larger combat units
      maxQueens: 30,  // Boosted to allow higher production rates
      maxEliteAnts: 7, // Increased for stronger elite units
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
      attackPerAnt: 4, // Increased from 3 for stronger territorial defense
      healthPerAnt: 8, // Increased from 7 for better survivability
      defensePerAnt: 4, // Increased from 3 for improved defensive capabilities
    },

    bugModifiers: {
      bugAttackModifier: 8.0, // Increased slightly for scaling with tougher enemies
      bugDefenseModifier: 8.0,
      bugMaxHealthModifier: 8.0,
      bugRegenModifier: 8.0,
    },

    productionRates: {
      larvaeProductionRate: 5.5, // Increased from 5 for faster larvae production
      collectionRatePerAnt: 110, // Increased from 100 to improve resource gathering
      collectionRatePerWorker: 13000, // Increased from 12000 to reflect scaling
      collectionRateModifier: 1.55, // Increased slightly to reflect better gathering efficiency
      larvaeProductionModifier: 1.35, // Increased from 1.3 to match faster production
    },

    resourceCosts: {
      seedCostPerLarva: 95, // Adjusted to reflect increased production capabilities
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 130,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 60,
      seedCostPerQueen: 750,

      royalJellyCostPerUpgrade: 2.7,
    },

    initialCaps: {
      maxSeeds: 3200, // Increased for larger storage capacity
      maxLarvae: 35, // Increased to allow for more larvae production
      maxAnts: 650, // Increased for a larger colony
      maxQueens: 22, // Increased to reflect colony growth
      maxEliteAnts: 8, // Increased to allow for more elite units
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
      attackPerAnt: 6, // Increased from 5 for stronger combat abilities
      healthPerAnt: 7, // Increased from 6 for better durability
      defensePerAnt: 7, // Increased from 6 to reflect their resilience
    },

    bugModifiers: {
      bugAttackModifier: 12.0, // Increased to scale with tougher enemies
      bugDefenseModifier: 12.0,
      bugMaxHealthModifier: 12.0,
      bugRegenModifier: 12.0,
    },

    productionRates: {
      larvaeProductionRate: 4.5, // Increased from 4 for improved production in tough conditions
      collectionRatePerAnt: 170, // Slight increase from 160 to improve efficiency
      collectionRatePerWorker: 19000, // Increased from 18000 for better gathering efficiency
      collectionRateModifier: 1.75, // Increased to reflect gathering efficiency in harsh climates
      larvaeProductionModifier: 1.45, // Slight increase to reflect adaptability in tough environments
    },

    resourceCosts: {
      seedCostPerLarva: 90,
      seedCostPerAnt: 85,
      seedCostPerEliteAnt: 150,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 7,
      antCostPerQueen: 65,
      seedCostPerQueen: 900,

      royalJellyCostPerUpgrade: 3.2,
    },

    initialCaps: {
      maxSeeds: 3800, // Increased from 3500 to allow for more resource storage
      maxLarvae: 40, // Increased from 35 to reflect better production scaling
      maxAnts: 750, // Increased from 700 to allow for a larger colony
      maxQueens: 35, // Increased from 30 to boost overall growth
      maxEliteAnts: 9, // Increased from 8 to reflect stronger elite units
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
      attackPerAnt: 20, // Increased from 18 for even more powerful attack
      healthPerAnt: 14, // Increased from 12 to reflect better durability
      defensePerAnt: 13, // Increased from 12 to boost their defensive capabilities
    },

    bugModifiers: {
      bugAttackModifier: 17.5, // Slight increase from 17.08 to reflect stronger opponents
      bugDefenseModifier: 17.5,
      bugMaxHealthModifier: 17.5,
      bugRegenModifier: 17.5,
    },

    productionRates: {
      larvaeProductionRate: 4.0, // Increased from 3.5 to match their aggressive behavior
      collectionRatePerAnt: 180, // Increased slightly from 170 for better resource gathering
      collectionRatePerWorker: 21000, // Increased from 20000 to reflect improved efficiency
      collectionRateModifier: 1.65, // Increased slightly to boost overall collection
      larvaeProductionModifier: 1.55, // Increased slightly to keep pace with their high production needs
    },

    resourceCosts: {
      seedCostPerLarva: 100, // Slight increase to reflect their strength
      seedCostPerAnt: 95,
      seedCostPerEliteAnt: 160,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 8,
      antCostPerQueen: 70,
      seedCostPerQueen: 950,

      royalJellyCostPerUpgrade: 3.7,
    },

    initialCaps: {
      maxSeeds: 4500, // Increased from 4000 for a larger resource pool
      maxLarvae: 45, // Increased from 40 to scale with production
      maxAnts: 850, // Increased from 800 for a larger army
      maxQueens: 40, // Increased from 35 to support further production
      maxEliteAnts: 10, // Increased from 9 to reflect their combat strength
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
      attackPerAnt: 4, // Increased slightly from 3 for better combat potential
      healthPerAnt: 7, // Increased from 6 for better survivability
      defensePerAnt: 4, // Increased from 3 for improved defense
    },

    bugModifiers: {
      bugAttackModifier: 26.0, // Slightly increased from 25.61 for balance
      bugDefenseModifier: 26.0,
      bugMaxHealthModifier: 26.0,
      bugRegenModifier: 26.0,
    },

    productionRates: {
      larvaeProductionRate: 5.5, // Increased slightly from 5 to reflect improved production
      collectionRatePerAnt: 220, // Increased from 200 for more efficient resource gathering
      collectionRatePerWorker: 25000, // Increased from 24000 to reflect better gathering efficiency
      collectionRateModifier: 2.0, // Increased to reflect Carpenter Ants' resource-gathering strength
      larvaeProductionModifier: 1.65, // Slightly increased to reflect faster larvae production
    },

    resourceCosts: {
      seedCostPerLarva: 105, // Slightly increased to balance scaling
      seedCostPerAnt: 105,
      seedCostPerEliteAnt: 165,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 9,
      antCostPerQueen: 75,
      seedCostPerQueen: 1050,

      royalJellyCostPerUpgrade: 4.2,
    },

    initialCaps: {
      maxSeeds: 4800, // Increased from 4500 for more resource storage
      maxLarvae: 50, // Increased from 45 to reflect higher production
      maxAnts: 950, // Increased from 900 for a larger colony
      maxQueens: 45, // Increased from 40 to reflect their production growth
      maxEliteAnts: 12, // Increased from 11 to reflect further strength
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
      attackPerAnt: 20, // Scaled up from Bullet Ants (attackPerAnt: 18)
      healthPerAnt: 14, // Increased from Bullet Ants (healthPerAnt: 12)
      defensePerAnt: 10, // Increased from Bullet Ants (defensePerAnt: 8)
    },

    bugModifiers: {
      bugAttackModifier: 35, // Increased from Bullet Ants (bugAttackModifier: 17.5)
      bugDefenseModifier: 35,
      bugMaxHealthModifier: 35,
      bugRegenModifier: 35,
    },

    productionRates: {
      larvaeProductionRate: 5.5, // Increased from Bullet Ants (larvaeProductionRate: 4.0)
      collectionRatePerAnt: 220, // Increased from Bullet Ants (collectionRatePerAnt: 180)
      collectionRatePerWorker: 24000, // Increased from Bullet Ants (collectionRatePerWorker: 21000)
      collectionRateModifier: 1.8, // Increased from Bullet Ants (collectionRateModifier: 1.65)
      larvaeProductionModifier: 1.7, // Increased from Bullet Ants (larvaeProductionModifier: 1.55)
    },

    resourceCosts: {
      seedCostPerLarva: 105, // Increased from Bullet Ants
      seedCostPerAnt: 100,
      seedCostPerEliteAnt: 160,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 8,
      antCostPerQueen: 75,
      seedCostPerQueen: 1000,

      royalJellyCostPerUpgrade: 3.7,
    },

    initialCaps: {
      maxSeeds: 5000, // Increased from Bullet Ants (maxSeeds: 4500)
      maxLarvae: 50, // Increased from Bullet Ants (maxLarvae: 45)
      maxAnts: 900, // Increased from Bullet Ants (maxAnts: 850)
      maxQueens: 45, // Increased from Bullet Ants (maxQueens: 40)
      maxEliteAnts: 11, // Increased from Bullet Ants (maxEliteAnts: 10)
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
      attackPerAnt: 6, // Increased from 5 to reflect their strength in numbers
      healthPerAnt: 7, // Increased from 6 for better survivability in large groups
      defensePerAnt: 4, // Increased from 3 to reflect their ability to overwhelm through defense
    },

    bugModifiers: {
      bugAttackModifier: 26.0, // Increased slightly from 25 for better balance
      bugDefenseModifier: 26.0,
      bugMaxHealthModifier: 26.0,
      bugRegenModifier: 26.0,
    },

    productionRates: {
      larvaeProductionRate: 6.5, // Increased slightly from 6.0 to reflect even faster growth
      collectionRatePerAnt: 220, // Increased from 200 for better resource gathering efficiency
      collectionRatePerWorker: 30000, // Increased from 28000 for more efficient gathering
      collectionRateModifier: 2.3, // Slightly increased from 2.2 to reflect their gathering efficiency
      larvaeProductionModifier: 2.3, // Slight increase from 2.2 for better larvae production
    },

    resourceCosts: {
      seedCostPerLarva: 100, // Slightly increased to balance scaling
      seedCostPerAnt: 90,
      seedCostPerEliteAnt: 145,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 70,
      seedCostPerQueen: 950,

      royalJellyCostPerUpgrade: 3.2,
    },

    initialCaps: {
      maxSeeds: 5500, // Increased from 5000 for larger resource storage
      maxLarvae: 50,  // Increased from 40 to support their massive growth
      maxAnts: 900,   // Increased from 800 to reflect the growing supercolony
      maxQueens: 45,  // Increased from 40 to reflect higher reproduction needs
      maxEliteAnts: 7, // Increased from 6 for better scaling
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
      attackPerAnt: 12, // Increased from 10 to reflect even stronger raiding power
      healthPerAnt: 10, // Increased from 8 for better survivability during raids
      defensePerAnt: 6, // Increased from 5 for better defense during raids
    },

    bugModifiers: {
      bugAttackModifier: 42.0, // Increased slightly for scaling with tougher enemies
      bugDefenseModifier: 42.0,
      bugMaxHealthModifier: 42.0,
      bugRegenModifier: 42.0,
    },

    productionRates: {
      larvaeProductionRate: 3.5, // Increased from 3.0 to reflect improved production from raided colonies
      collectionRatePerAnt: 180, // Increased from 160 to reflect better gathering during raids
      collectionRatePerWorker: 24000, // Increased from 22000 to reflect more efficient gathering
      collectionRateModifier: 1.6, // Increased to reflect better resource gathering from raids
      larvaeProductionModifier: 1.3, // Increased from 1.2 to support larger-scale raids
    },

    resourceCosts: {
      seedCostPerLarva: 90, // Increased slightly for balance
      seedCostPerAnt: 80,
      seedCostPerEliteAnt: 135,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 6,
      antCostPerQueen: 65,
      seedCostPerQueen: 900,

      royalJellyCostPerUpgrade: 3.0,
    },

    initialCaps: {
      maxSeeds: 4500, // Increased from 4000 for more storage from raids
      maxLarvae: 35, // Increased from 30 for better larvae production
      maxAnts: 700, // Increased from 600 to reflect larger raiding parties
      maxQueens: 30, // Increased from 25 to boost production
      maxEliteAnts: 6, // Increased from 5 for stronger elite units
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
      attackPerAnt: 4, // Increased from 3 to reflect better balance between collection and defense
      healthPerAnt: 6, // Increased from 5 for slightly better survivability
      defensePerAnt: 3, // Increased from 2 to reflect improved defense capabilities
    },

    bugModifiers: {
      bugAttackModifier: 26.0, // Slight increase from 25 to scale with tougher enemies
      bugDefenseModifier: 26.0,
      bugMaxHealthModifier: 26.0,
      bugRegenModifier: 26.0,
    },

    productionRates: {
      larvaeProductionRate: 3.5, // Increased from 3.0 to improve larvae production
      collectionRatePerAnt: 220, // Increased from 200 to improve resource gathering efficiency
      collectionRatePerWorker: 24000, // Increased from 22000 to reflect better efficiency
      collectionRateModifier: 2.2, // Increased from 2.0 to reflect specialization in sweet resource collection
      larvaeProductionModifier: 1.3, // Increased from 1.2 to improve larvae production efficiency
    },

    resourceCosts: {
      seedCostPerLarva: 80, // Slight increase for balance
      seedCostPerAnt: 70,
      seedCostPerEliteAnt: 115,
      larvaCostPerAnt: 1,
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 50,
      seedCostPerQueen: 550,

      royalJellyCostPerUpgrade: 2.0,
    },

    initialCaps: {
      maxSeeds: 3500, // Increased from 3000 for larger resource capacity
      maxLarvae: 26, // Increased from 22 to allow for more larvae production
      maxAnts: 500, // Increased from 450 to reflect a growing colony
      maxQueens: 22, // Increased from 18 to boost queen capacity
      maxEliteAnts: 4, // Increased from 3 to reflect stronger elite units
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
      bugAttackModifier: 25,
      bugDefenseModifier: 25,
      bugMaxHealthModifier: 25,
      bugRegenModifier: 25,
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
      bugAttackModifier: 23,
      bugDefenseModifier: 23,
      bugMaxHealthModifier: 23,
      bugRegenModifier: 23,
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
      bugAttackModifier: 23,
      bugDefenseModifier: 23,
      bugMaxHealthModifier: 23,
      bugRegenModifier: 23,
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
      bugAttackModifier: 23,
      bugDefenseModifier: 23,
      bugMaxHealthModifier: 23,
      bugRegenModifier: 23,
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
      bugAttackModifier: 27,
      bugDefenseModifier: 27,
      bugMaxHealthModifier: 27,
      bugRegenModifier: 27,
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
      bugAttackModifier: 50,
      bugDefenseModifier: 50,
      bugMaxHealthModifier: 50,
      bugRegenModifier: 50,
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
      bugAttackModifier: 25,
      bugDefenseModifier: 55,
      bugMaxHealthModifier: 25,
      bugRegenModifier: 25,
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
      bugAttackModifier: 30,
      bugDefenseModifier: 30,
      bugMaxHealthModifier: 30,
      bugRegenModifier: 30,
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

export const evolutions = scaleEvolutions(baseEvolutions)
