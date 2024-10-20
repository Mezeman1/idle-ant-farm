import {ForagingArea, ForagingMilestone} from '@/types/trainingTypes'

export const foragingMilestones = [
    // Early-game milestones
    {
      amountForaged: 10,
      speedModifier: 0.10,        // 10% faster foraging time
      xpModifier: 0.05,           // 5% more XP per action
    },
    {
      amountForaged: 100,
      dropChanceModifier: 0.05,   // 5% increase in drop chance
      coolDownModifier: 0.05,     // 5% shorter cooldown between actions
    },
    {
      amountForaged: 250,
      dropChanceModifier: 0.05,   // 5% increase in drop chance
      coolDownModifier: 0.05,     // 5% shorter cooldown between actions
    },
    {
      amountForaged: 500,
      dropChanceModifier: 0.05,   // 5% increase in drop chance
      coolDownModifier: 0.05,     // 5% shorter cooldown between actions
    },

    {
      amountForaged: 750,
      dropChanceModifier: 0.05,   // 5% increase in drop chance
      coolDownModifier: 0.05,     // 5% shorter cooldown between actions
    },

    // Mid-game milestones
    {
      amountForaged: 1_000,
      dropAmountModifier: 0.1,    // 10% more items per forage
      speedModifier: 0.15,        // 15% faster foraging time
    },
    {
      amountForaged: 1_000,
      dropAmountModifier: 0.1,    // 10% more items per forage
      speedModifier: 0.15,        // 15% faster foraging time
    },
    {
      amountForaged: 10_000,
      xpModifier: 0.20,           // 20% more XP per action
      spawnTimeModifier: 0.10,    // 10% faster spawn time for resources
    },

    // Late-game milestones
    {
      amountForaged: 100_000,
      dropChanceModifier: 0.10,   // 10% increase in drop chance
      dropAmountModifier: 0.20,   // 20% more items per forage
    },
    {
      amountForaged: 1_000_000,
      speedModifier: 0.25,        // 25% faster foraging time
      xpModifier: 0.30,           // 30% more XP per action
    },

    // End-game milestones
    {
      amountForaged: 10_000_000,
      dropChanceModifier: 0.15,   // 15% increase in drop chance
      coolDownModifier: 0.30,     // 30% shorter cooldown between actions
    },
    {
      amountForaged: 100_000_000,
      dropAmountModifier: 0.50,   // 50% more items per forage
      xpModifier: 0.50,           // 50% more XP per action
    },
  ] as ForagingMilestone[]

export const foragingResources = [
  {
    name: ForagingArea.Wasteland,
    xpPerAction: 15,
    levelRequired: 1,
    cost: {ants: 10},
    initialTimePerAction: 5,
    timePerAction: 5,
  },
  {
    name: ForagingArea.Forest,
    xpPerAction: 25,
    levelRequired: 10,
    cost: {ants: 100},
    initialTimePerAction: 5,
    timePerAction: 5,
  },

  {
    name: ForagingArea.Mountains,
    xpPerAction: 48,
    levelRequired: 25,
    cost: {ants: 1000},
    initialTimePerAction: 5.6,
    timePerAction: 5.6,
  },
]
