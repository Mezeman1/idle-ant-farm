export enum Skill {
  None = 'none',
  Mining = 'mining',
  Foraging = 'foraging',
  Crafting = 'crafting',
  Attack = 'attack',
  Defense = 'defense',
  Hitpoints = 'hitpoints',
}

export enum ForagingArea {
  None = 'None',
  Wasteland = 'Wasteland',
  Forest = 'Forest',
  Mountains = 'Mountains',
}

export interface Seed {
  name: string;
  description?: string;
  levelRequired: number;
  growthTime: number; // Time in seconds for the seed to mature
  xpPerAction: number;
  effect?: object; // Special effect for when the seed matures
  duration: number; // Duration of the effect in seconds
}

export enum ResourceType {
  None = 'None',
  Dirt = 'Dirt',
  Clay = 'Clay',
  Sand = 'Sand',
  Leaf = 'Leaf',
  Twig = 'Twig',
  RockFragment = 'Rock Fragment',
  RottenWood = 'Rotten Wood',
  Fungus = 'Fungus',
  Pebble = 'Pebble',
  Resin = 'Resin',
  Mushroom = 'Mushroom',
  Sap = 'Sap',
  Root = 'Root',
  CarapaceFragment = 'Carapace Fragment',
  AntLarvae = 'Ant Larvae',
  AntPheromones = 'Ant Pheromones',
  RoyalJelly = 'Royal Jelly',
}

export enum CraftingRecipeType {
  SeedStorage = 'Seed Storage',
  AdvancedSeedStorage = 'Advanced Seed Storage',

  LarvaeStorage = 'Larvae Storage',
  AdvancedLarvaeStorage = 'Advanced Larvae Storage',

  AntStorage = 'Ant Storage',
  AdvancedAntStorage = 'Advanced Ant Storage',

  AntHill = 'Ant Hill',
}

export interface TrainingState {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface MiningResource {
  name: ResourceType;
  xpPerAction: number;
  levelRequired: number;

  initialTimePerAction: number; // Variable to reset timePerAction
  timePerAction: number; // Time in seconds to complete an action

  initialRespawnTime: number; // Variable to reset respawnTime
  respawnTime: number; // Time in seconds for the resource to respawn
  isDepleted: boolean; // Tracks if the resource is currently depleted

  level: number;
  xp: number;
  xpToNextLevel: number;

  collectionMultiplier: number; // Multiplier for collection
  timeReduction: number; // Reduction in time
  respawnReduction: number; // Reduction in respawn time
  milestones?: MiningMilestone[];
}

export interface MiningMilestone {
  level: number;
  collectionMultiplierBonus: number;  // Bonus multiplier for collection
  timeReductionBonus: number;         // Bonus reduction in time
  respawnReductionBonus: number;      // Bonus reduction in respawn time
}

export interface ForagingMilestone {
  dropChanceModifier?: number;
  dropAmountModifier?: number;
  xpModifier?: number;
  speedModifier?: number;
  spawnTimeModifier?: number;
  coolDownModifier?: number;

  amountForaged: number;
}

export interface ResourcesCollected {
  [key: string]: number; // Dictionary for resources collected (e.g. Dirt, Clay)
}

export interface CraftingRecipe {
  name: string;
  cost: Record<ResourceType, number>; // Resource cost for crafting
  storageIncrease: Record<string, number>; // Dynamic key-value for storage increases
  xpReward: number;
}

export interface TrainingStoreState {
  activeTraining: Skill;
  training: {
    mining: TrainingState;
    crafting: TrainingState;
  };
  activeResource: ResourceType;
  miningResources: MiningResource[];
  resourcesCollected: ResourcesCollected;
  activeCraftingRecipe: string;
  craftingRecipes: CraftingRecipe[];
}

export const XP_MULTIPLIER = 1.1
export const BASE_XP = 90
