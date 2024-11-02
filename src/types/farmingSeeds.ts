import {Seed} from '@/types/trainingTypes'

// SeedNames Enum
export enum SeedNames {
  NutrientFungus = 'Nutrient Fungus',
  HealingFungus = 'Healing Fungus',
  EnergyFungus = 'Energy Fungus',
  PheromoneFungus = 'Pheromone Fungus',
  DefenseFungus = 'Defense Fungus',
  InsightFungus = 'Insight Fungus',
}

export const seeds: Seed[] = [
  {
    name: SeedNames.NutrientFungus,
    levelRequired: 1,
    growthTime: 30 * 60,
    xpPerAction: 10,
    description: 'A fungus that provides nutrients to soil, increasing the growth rate of plants for 30 minutes.',
    effect: {growthRate: 1.5},
    duration: 30 * 60,
  },
  {
    name: SeedNames.HealingFungus, levelRequired: 5, growthTime: 60 * 60, xpPerAction: 30,
    description: 'A fungus that heals ants, increasing their regeneration for 1 hour.',
    effect: {regenerationRate: 2},
    duration: 60 * 60,
  },
  {
    name: SeedNames.EnergyFungus, levelRequired: 10, growthTime: 90 * 60, xpPerAction: 50,
    description: 'A fungus that provides energy to ants, increasing their crafting speed for 1 hour.',
    effect: {craftingRate: 2},
    duration: 60 * 60,
  },
  {
    name: SeedNames.PheromoneFungus, levelRequired: 15, growthTime: 120 * 60, xpPerAction: 100,
    description: 'A fungus that attracts ants, increasing the spawn rate of ant hills for 2 hours.',
    effect: {spawnRate: 2},
    duration: 120 * 60,
  },
  {
    name: SeedNames.DefenseFungus, levelRequired: 20, growthTime: 180 * 60, xpPerAction: 165,
    description: 'A fungus that strengthens ants, increasing their defense for 1 hours',
    effect: {defense: 2},
    duration: 60 * 60,
  },
  {
    name: SeedNames.InsightFungus,
    levelRequired: 50,
    growthTime: 500 * 60,
    xpPerAction: 450,
    description: 'A unique fungus that enhances mental acuity, doubling experience gain from actions for 1 hour.',
    effect: {xpBoost: 2},
    duration: 60 * 60,
  },
  
]
