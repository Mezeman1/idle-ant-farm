interface CombatMilestone {
  levelRequired: number,
  type: 'attack' | 'defense' | 'hitpoints',
  effect: object,
  description: string,
  appliedTo?: string,
}

const bossCombatMilestones =
  [
    {
      levelRequired: 5,
      effect: {
        damage: 1.1,
      },
      description: 'Increase damage to bosses by 10%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 5,
      effect: {
        defense: 1.1,
      },
      description: 'Increase defense against bosses by 10%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 5,
      effect: {
        health: 1.05,
        regen: 1.05,
      },
      description: 'Increase hitpoints by 5% and regeneration by 5% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 10,
      effect: {
        damage: 1.2,
      },
      description: 'Increase damage to bosses by 20%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 10,
      effect: {
        defense: 1.2,
      },
      description: 'Increase defense against bosses by 20%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 10,
      effect: {
        health: 1.1,
        regen: 1.1,
      },
      description: 'Increase hitpoints by 10% and regeneration by 10% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 15,
      effect: {
        damage: 1.3,
      },
      description: 'Increase damage to bosses by 30%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 15,
      effect: {
        defense: 1.3,
      },
      description: 'Increase defense against bosses by 30%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 15,
      effect: {
        health: 1.15,
        regen: 1.15,
      },
      description: 'Increase hitpoints by 15% and regeneration by 15% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 20,
      effect: {
        damage: 1.4,
      },
      description: 'Increase damage to bosses by 40%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 20,
      effect: {
        defense: 1.4,
      },
      description: 'Increase defense against bosses by 40%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 20,
      effect: {
        health: 1.2,
        regen: 1.2,
      },
      description: 'Increase hitpoints by 20% and regeneration by 20% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 25,
      effect: {
        damage: 1.5,
      },
      description: 'Increase damage to bosses by 50%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 25,
      effect: {
        defense: 1.5,
      },
      description: 'Increase defense against bosses by 50%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 25,
      effect: {
        health: 1.25,
        regen: 1.25,
      },
      description: 'Increase hitpoints by 25% and regeneration by 25% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 30,
      effect: {
        damage: 1.6,
      },
      description: 'Increase damage to bosses by 60%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 30,
      effect: {
        defense: 1.6,
      },
      description: 'Increase defense against bosses by 60%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 30,
      effect: {
        health: 1.3,
        regen: 1.3,
      },
      description: 'Increase hitpoints by 30% and regeneration by 30% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 35,
      effect: {
        damage: 1.7,
      },
      description: 'Increase damage to bosses by 70%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 35,
      effect: {
        defense: 1.7,
      },
      description: 'Increase defense against bosses by 70%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 35,
      effect: {
        health: 1.35,
        regen: 1.35,
      },
      description: 'Increase hitpoints by 35% and regeneration by 35% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 40,
      effect: {
        damage: 1.8,
      },
      description: 'Increase damage to bosses by 80%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 40,
      effect: {
        defense: 1.8,
      },
      description: 'Increase defense against bosses by 80%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 40,
      effect: {
        health: 1.4,
        regen: 1.4,
      },
      description: 'Increase hitpoints by 40% and regeneration by 40% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 45,
      effect: {
        damage: 1.9,
      },
      description: 'Increase damage to bosses by 90%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 45,
      effect: {
        defense: 1.9,
      },
      description: 'Increase defense against bosses by 90%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 45,
      effect: {
        health: 1.45,
        regen: 1.45,
      },
      description: 'Increase hitpoints by 45% and regeneration by 45% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 50,
      effect: {
        damage: 2.0,
      },
      description: 'Increase damage to bosses by 100%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 50,
      effect: {
        defense: 2.0,
      },
      description: 'Increase defense against bosses by 100%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 50,
      effect: {
        health: 1.5,
        regen: 1.5,
      },
      description: 'Increase hitpoints by 50% and regeneration by 50% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 60,
      effect: {
        damage: 2.2,
      },
      description: 'Increase damage to bosses by 120%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 60,
      effect: {
        defense: 2.2,
      },
      description: 'Increase defense against bosses by 120%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 60,
      effect: {
        health: 1.6,
        regen: 1.6,
      },
      description: 'Increase hitpoints by 60% and regeneration by 60% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 70,
      effect: {
        damage: 2.4,
      },
      description: 'Increase damage to bosses by 140%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 70,
      effect: {
        defense: 2.4,
      },
      description: 'Increase defense against bosses by 140%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 70,
      effect: {
        health: 1.7,
        regen: 1.7,
      },
      description: 'Increase hitpoints by 70% and regeneration by 70% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 80,
      effect: {
        damage: 2.6,
      },
      description: 'Increase damage to bosses by 160%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 80,
      effect: {
        defense: 2.6,
      },
      description: 'Increase defense against bosses by 160%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 80,
      effect: {
        health: 1.8,
        regen: 1.8,
      },
      description: 'Increase hitpoints by 80% and regeneration by 80% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 90,
      effect: {
        damage: 2.8,
      },
      description: 'Increase damage to bosses by 180%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 90,
      effect: {
        defense: 2.8,
      },
      description: 'Increase defense against bosses by 180%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 90,
      effect: {
        health: 1.9,
        regen: 1.9,
      },
      description: 'Increase hitpoints by 90% and regeneration by 90% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 100,
      effect: {
        damage: 3.0,
      },
      description: 'Increase damage to bosses by 200%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 100,
      effect: {
        defense: 3.0,
      },
      description: 'Increase defense against bosses by 200%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 100,
      effect: {
        health: 2.0,
        regen: 2.0,
      },
      description: 'Increase hitpoints by 100% and regeneration by 100% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 120,
      effect: {
        damage: 3.5,
      },
      description: 'Increase damage to bosses by 250%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 120,
      effect: {
        defense: 3.5,
      },
      description: 'Increase defense against bosses by 250%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 120,
      effect: {
        health: 2.5,
        regen: 2.5,
      },
      description: 'Increase hitpoints by 150% and regeneration by 150% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 150,
      effect: {
        damage: 4.0,
      },
      description: 'Increase damage to bosses by 300%',
      type: 'attack',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 150,
      effect: {
        defense: 4.0,
      },
      description: 'Increase defense against bosses by 300%',
      type: 'defense',
      appliedTo: 'bosses',
    },
    {
      levelRequired: 150,
      effect: {
        health: 3.0,
        regen: 3.0,
      },
      description: 'Increase hitpoints by 200% and regeneration by 200% when fighting bosses',
      type: 'hitpoints',
      appliedTo: 'bosses',
    },
  ] as CombatMilestone[]

const armyCombatMilestones = [
  {
    levelRequired: 5,
    effect: {
      attack: 0.1,
    },
    description: 'Increase damage by 10% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 5,
    effect: {
      defense: 0.1,
    },
    description: 'Increase defense by 10% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 5,
    effect: {
      health: 1.05,
      regen: 1.05,
    },
    description: 'Increase hitpoints by 5% and regeneration by 5% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 10,
    effect: {
      attack: 0.2,
    },
    description: 'Increase damage by 20% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 10,
    effect: {
      defense: 0.2,
    },
    description: 'Increase defense by 20% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 10,
    effect: {
      health: 1.1,
      regen: 1.1,
    },
    description: 'Increase hitpoints by 10% and regeneration by 10% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 15,
    effect: {
      attack: 0.3,
    },
    description: 'Increase damage by 30% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 15,
    effect: {
      defense: 0.3,
    },
    description: 'Increase defense by 30% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 15,
    effect: {
      health: 1.15,
      regen: 1.15,
    },
    description: 'Increase hitpoints by 15% and regeneration by 15% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 20,
    effect: {
      attack: 0.4,
    },
    description: 'Increase damage by 40% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 20,
    effect: {
      defense: 0.4,
    },
    description: 'Increase defense by 40% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 20,
    effect: {
      health: 1.2,
      regen: 1.2,
    },
    description: 'Increase hitpoints by 20% and regeneration by 20% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 25,
    effect: {
      attack: 0.5,
    },
    description: 'Increase damage by 50% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 25,
    effect: {
      defense: 0.5,
    },
    description: 'Increase defense by 50% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 25,
    effect: {
      health: 1.25,
      regen: 1.25,
    },
    description: 'Increase hitpoints by 25% and regeneration by 25% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 30,
    effect: {
      attack: 0.6,
    },
    description: 'Increase damage by 60% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 30,
    effect: {
      defense: 0.6,
    },
    description: 'Increase defense by 60% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 30,
    effect: {
      health: 1.3,
      regen: 1.3,
    },
    description: 'Increase hitpoints by 30% and regeneration by 30% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 35,
    effect: {
      attack: 0.7,
    },
    description: 'Increase damage by 70% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 35,
    effect: {
      defense: 0.7,
    },
    description: 'Increase defense by 70% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 35,
    effect: {
      health: 1.35,
      regen: 1.35,
    },
    description: 'Increase hitpoints by 35% and regeneration by 35% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 40,
    effect: {
      attack: 0.8,
    },
    description: 'Increase damage by 80% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 40,
    effect: {
      defense: 0.8,
    },
    description: 'Increase defense by 80% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 40,
    effect: {
      health: 1.4,
      regen: 1.4,
    },
    description: 'Increase hitpoints by 40% and regeneration by 40% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 45,
    effect: {
      attack: 0.9,
    },
    description: 'Increase damage by 90% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 45,
    effect: {
      defense: 0.9,
    },
    description: 'Increase defense by 90% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 45,
    effect: {
      health: 1.45,
      regen: 1.45,
    },
    description: 'Increase hitpoints by 45% and regeneration by 45% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 50,
    effect: {
      attack: 1.0,
    },
    description: 'Increase damage by 100% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 50,
    effect: {
      defense: 1.0,
    },
    description: 'Increase defense by 100% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 50,
    effect: {
      health: 1.5,
      regen: 1.5,
    },
    description: 'Increase hitpoints by 50% and regeneration by 50% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 60,
    effect: {
      attack: 1.2,
    },
    description: 'Increase damage by 120% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 60,
    effect: {
      defense: 1.2,
    },
    description: 'Increase defense by 120% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 60,
    effect: {
      health: 1.6,
      regen: 1.6,
    },
    description: 'Increase hitpoints by 60% and regeneration by 60% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 70,
    effect: {
      attack: 1.4,
    },
    description: 'Increase damage by 140% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 70,
    effect: {
      defense: 1.4,
    },
    description: 'Increase defense by 140% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 70,
    effect: {
      health: 1.7,
      regen: 1.7,
    },
    description: 'Increase hitpoints by 70% and regeneration by 70% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 80,
    effect: {
      attack: 1.6,
    },
    description: 'Increase damage by 160% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 80,
    effect: {
      defense: 1.6,
    },
    description: 'Increase defense by 160% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 80,
    effect: {
      health: 1.8,
      regen: 1.8,
    },
    description: 'Increase hitpoints by 80% and regeneration by 80% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 90,
    effect: {
      attack: 1.8,
    },
    description: 'Increase damage by 180% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 90,
    effect: {
      defense: 1.8,
    },
    description: 'Increase defense by 180% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 90,
    effect: {
      health: 1.9,
      regen: 1.9,
    },
    description: 'Increase hitpoints by 90% and regeneration by 90% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 100,
    effect: {
      attack: 2.0,
    },
    description: 'Increase damage by 200% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 100,
    effect: {
      defense: 2.0,
    },
    description: 'Increase defense by 200% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 100,
    effect: {
      health: 2.0,
      regen: 2.0,
    },
    description: 'Increase hitpoints by 100% and regeneration by 100% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 120,
    effect: {
      attack: 2.5,
    },
    description: 'Increase damage by 250% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 120,
    effect: {
      defense: 2.5,
    },
    description: 'Increase defense by 250% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 120,
    effect: {
      health: 2.5,
      regen: 2.5,
    },
    description: 'Increase hitpoints by 150% and regeneration by 150% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
  {
    levelRequired: 150,
    effect: {
      attack: 3.0,
    },
    description: 'Increase damage by 300% for both army and bosses',
    type: 'attack',
    appliedTo: 'army',
  },
  {
    levelRequired: 150,
    effect: {
      defense: 3.0,
    },
    description: 'Increase defense by 300% for both army and bosses',
    type: 'defense',
    appliedTo: 'army',
  },
  {
    levelRequired: 150,
    effect: {
      health: 3.0,
      regen: 3.0,
    },
    description: 'Increase hitpoints by 200% and regeneration by 200% for both army and bosses',
    type: 'hitpoints',
    appliedTo: 'army',
  },
] as CombatMilestone[]

const combatMilestones = [
  ...bossCombatMilestones,
  ...armyCombatMilestones,
] as CombatMilestone[]


export default combatMilestones
