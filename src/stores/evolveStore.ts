// achievementStore.ts or gameStore.ts
import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {toast} from 'vue3-toastify'
import {useAdventureStore} from '@/stores/adventureStore'

type AntNames = 'Start' | 'Leaf cutters' | 'Fire Ants' | 'Harvester Ants' | 'Army Ants' | 'Weaver Ants' | 'Desert Ants' | 'Bullet Ants' | 'Carpenter Ants'

interface ProductionRates {
  larvaeProductionRate: number;
  collectionRatePerAnt: number;
  collectionRatePerWorker: number;
  collectionRateModifier: number;
  larvaeProductionModifier: number;
}

interface ResourceCosts {
  seedCostPerLarva: number;
  seedCostPerAnt: number;
  seedCostPerEliteAnt: number;
  larvaCostPerAnt: number;
  larvaCostPerEliteAnt: number;
  antCostPerQueen: number;
  seedCostPerQueen: number;
  royalJellyCostPerUpgrade: number;
}

interface InitialCaps {
  maxSeeds: number;
  maxLarvae: number;
  maxAnts: number;
  maxQueens: number;
  maxEliteAnts: number;
}

interface Evolution {
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

export const useEvolveStore = defineStore({
  id: 'evolveStore',
  state: () => ({
    currentEvolution: 0,
    evolutions:
      [
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
      ] as Evolution[],
  }),
  getters: {
    currentEvolutionData() {
      return this.evolutions[this.currentEvolution]
    },
  },
  actions: {
    async evolve() {
      if (this.currentEvolution + 1 >= this.evolutions.length) {
        toast.info('You have reached the end of the evolutions.', {
          position: 'top',
          duration: 5000,
        })
        toast.info('Congratulations!', {
          position: 'top',
          duration: 5000,
        })
        toast.info('You have won the game (so far)!', {
          position: 'top',
          duration: 5000,
        })
        return
      }

      this.currentEvolution += 1

      const gameStore = useGameStore()
      await gameStore.resetLocalGameState({
        isEvolution: true,
      })

      toast.success(`You have evolved to ${this.currentEvolutionData.name}!`, {
        position: 'top',
        duration: 5000,
      })

      gameStore.saveGameState({
        force: true,
      }).then(() => {
        gameStore.loadGameState()
      })
    },
    async applyEvolution() {
      return new Promise<void>((resolve) => {
        const resourceStore = useResourcesStore()
        const gameStore = useGameStore()
        const adventureStore = useAdventureStore()
        const currentEvolution = this.currentEvolutionData

        this.applyProductionRates(currentEvolution.productionRates, resourceStore)
        this.applyResourceCosts(currentEvolution.resourceCosts, resourceStore)
        this.applyInitialCaps(currentEvolution.initialCaps, resourceStore)
        this.applyArmyAntsStats(currentEvolution.statsPerAnt, gameStore)
        this.applyBugModifiers(currentEvolution.bugModifiers, adventureStore)
        this.applyArmyModifiers(currentEvolution.armyModifiers, adventureStore)

        resolve()
      })
    },
    applyBugModifiers(bugModifiers, adventureStore) {
      if (!bugModifiers) {
        adventureStore.bugAttackModifier = 1
        adventureStore.bugDefenseModifier = 1
        adventureStore.bugMaxHealthModifier = 1
        adventureStore.bugRegenModifier = 1
        return
      }

      adventureStore.bugAttackModifier = bugModifiers.bugAttackModifier
      adventureStore.bugDefenseModifier = bugModifiers.bugDefenseModifier
      adventureStore.bugMaxHealthModifier = bugModifiers.bugMaxHealthModifier
      adventureStore.bugRegenModifier = bugModifiers.bugRegenModifier
    },

    applyArmyModifiers(armyModifiers, adventureStore) {
      if (!armyModifiers) {
        adventureStore.armyAttackModifier = 1
        adventureStore.armyDefenseModifier = 1
        adventureStore.armyMaxHealthModifier = 1
        adventureStore.armyRegenModifier = 1
        return
      }

      adventureStore.armyAttackModifier = armyModifiers.armyAttackModifier
      adventureStore.armyDefenseModifier = armyModifiers.armyDefenseModifier
      adventureStore.armyMaxHealthModifier = armyModifiers.armyMaxHealthModifier
      adventureStore.armyRegenModifier = armyModifiers.armyRegenModifier
    },

    applyArmyAntsStats(statsPerAnt, gameStore) {
      if (!statsPerAnt) {
        return
      }

      gameStore.attackPerAnt = statsPerAnt.attackPerAnt
      gameStore.healthPerAnt = statsPerAnt.healthPerAnt
      gameStore.defensePerAnt = statsPerAnt.defensePerAnt
    },

    applyProductionRates(productionRates, resourceStore) {
      resourceStore.productionRates.larvaeProductionRate = productionRates.larvaeProductionRate
      resourceStore.productionRates.collectionRatePerAnt = productionRates.collectionRatePerAnt
      resourceStore.productionRates.collectionRatePerWorker = productionRates.collectionRatePerWorker
      resourceStore.productionRates.collectionRateModifier = productionRates.collectionRateModifier
      resourceStore.productionRates.larvaeProductionModifier = productionRates.larvaeProductionModifier
    },

    applyResourceCosts(resourceCosts, resourceStore) {
      if (resourceCosts) {
        resourceStore.resourceCosts.seedCostPerLarva = resourceCosts.seedCostPerLarva
        resourceStore.resourceCosts.seedCostPerAnt = resourceCosts.seedCostPerAnt
        resourceStore.resourceCosts.seedCostPerEliteAnt = resourceCosts.seedCostPerEliteAnt
        resourceStore.resourceCosts.larvaCostPerAnt = resourceCosts.larvaCostPerAnt
        resourceStore.resourceCosts.larvaCostPerEliteAnt = resourceCosts.larvaCostPerEliteAnt
        resourceStore.resourceCosts.antCostPerQueen = resourceCosts.antCostPerQueen
        resourceStore.resourceCosts.seedCostPerQueen = resourceCosts.seedCostPerQueen
        resourceStore.resourceCosts.royalJellyCostPerUpgrade = resourceCosts.royalJellyCostPerUpgrade
      }
    },

    applyInitialCaps(initialCaps, resourceStore) {
      if (initialCaps) {
        resourceStore.initialCaps.maxSeeds = initialCaps.maxSeeds
        resourceStore.initialCaps.maxLarvae = initialCaps.maxLarvae
        resourceStore.initialCaps.maxAnts = initialCaps.maxAnts
        resourceStore.initialCaps.maxQueens = initialCaps.maxQueens
        resourceStore.initialCaps.maxEliteAnts = initialCaps.maxEliteAnts

        resourceStore.storage.maxSeeds = initialCaps.maxSeeds
        resourceStore.storage.maxLarvae = initialCaps.maxLarvae
        resourceStore.storage.maxAnts = initialCaps.maxAnts
        resourceStore.storage.maxQueens = initialCaps.maxQueens
        resourceStore.storage.maxEliteAnts = initialCaps.maxEliteAnts
      }
    },
    loadEvolveState(savedState: any) {
      this.currentEvolution = savedState.currentEvolution ?? 0

      this.applyEvolution()
    },
    getEvolveState() {
      return {
        currentEvolution: this.currentEvolution,
      }
    },
    resetEvolveState() {
      this.currentEvolution = 0
      this.applyEvolution()
    },
  },
})
