import {defineStore} from 'pinia'
import {useResourcesStore} from '@/stores/resourcesStore'
import {
  BASE_XP,
  CraftingRecipe,
  CraftingRecipeType,
  MiningResource,
  ResourceType,
  Seed,
  Skill,
  TrainingState,
  XP_MULTIPLIER,
} from '@/types/trainingTypes'
import {miningResources} from '@/types/miningResources'
import {useAdventureStore} from '@/stores/adventureStore'
import {useSettingsStore} from '@/stores/settingsStore'
import {SeedNames, seeds} from '@/types/farmingSeeds'
import {toast} from 'vue3-toastify'
import {useBossStore} from '@/stores/bossStore'
import combatMilestones, { CombatMilestone } from '@/types/combatMilestones'
import { useEvolveStore } from './evolveStore'
import { useGameStore } from './gameStore'
import BigNumber from 'bignumber.js'

export const useTrainingStore = defineStore({
  id: 'Training',
  state: () => ({
    activeTab: 'mining',

    training: {
      mining: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
      crafting: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
      attack: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
      defense: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
      hitpoints: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
      farming: {
        level: 1,
        xp: 0,
        xpToNextLevel: BASE_XP,
      },
    },
    // Mining
    miningMilestones: [
      {
        levelRequired: 75,
        effect: {
          maxActiveResources: 2,
        },
        description: 'Unlocks the ability to mine 2 resources at once',
      },
      {
        levelRequired: 150,
        effect: {
          maxActiveResources: 3,
        },
        description: 'Unlocks the ability to mine 3 resources at once',
      },
    ],
    activeResources: [] as ResourceType[],
    maxActiveResources: 1,
    miningResources: miningResources,
    resourcesCollected: {
      [ResourceType.Dirt]: 0,
      [ResourceType.Clay]: 0,
      [ResourceType.Sand]: 0,
      [ResourceType.Leaf]: 0,
    },

    // Crafting
    activeCraftingRecipe: '',
    craftingRecipes: [
      {
        name: CraftingRecipeType.SeedStorage,
        description: 'Increase the storage capacity for seeds by 0.1%',
        cost: {[ResourceType.Dirt]: 5},
        storageIncrease: {
          seed: 0.001,
        },

        xpPerAction: 25,
        levelRequired: 1,
        initialTimePerAction: 5,
        timePerAction: 5,
      },
      {
        name: CraftingRecipeType.LarvaeStorage,
        description: 'Increase the storage capacity for ant larvae by 0.1%',
        cost: {[ResourceType.Clay]: 5},
        storageIncrease: {
          larvae: 0.001,
        },

        xpPerAction: 25,
        levelRequired: 1,
        initialTimePerAction: 5,
        timePerAction: 5,
      },
      {
        name: CraftingRecipeType.AntStorage,
        description: 'Increase the storage capacity for ants by 0.1%',
        cost: {
          [ResourceType.Dirt]: 5,
          [ResourceType.Sand]: 5,
        },
        storageIncrease: {
          ant: 0.001,
        },

        xpPerAction: 25,
        levelRequired: 1,
        initialTimePerAction: 5,
        timePerAction: 5,
      },
      {
        name: CraftingRecipeType.AntHill,
        description: 'Generates 1 ant passively per Ant Hill',
        cost: {
          [ResourceType.Leaf]: 5,
          [ResourceType.Clay]: 20,
          ants: 10,
        },

        xpPerAction: 50,
        levelRequired: 15,
        initialTimePerAction: 10,
        timePerAction: 10,
        effect: {
          antGeneration: 1,
        },
      },
      {
        name: CraftingRecipeType.AdvancedSeedStorage,
        description: 'Increase the storage capacity for seeds by 0.5%',
        cost: {
          [ResourceType.Twig]: 10,
          [ResourceType.RockFragment]: 10,
        },

        storageIncrease: {
          seed: 0.005,
        },

        xpPerAction: 50,
        levelRequired: 25,
        initialTimePerAction: 10,
        timePerAction: 10,
      },
      {
        name: CraftingRecipeType.AdvancedLarvaeStorage,
        description: 'Increase the storage capacity for ant larvae by 0.5%',
        cost: {
          [ResourceType.RottenWood]: 10,
          [ResourceType.Fungus]: 10,
        },

        storageIncrease: {
          larvae: 0.005,
        },

        xpPerAction: 50,
        levelRequired: 25,
        initialTimePerAction: 10,
        timePerAction: 10,
      },
      {
        name: CraftingRecipeType.AdvancedAntStorage,
        description: 'Increase the storage capacity for ants by 0.5%',
        cost: {
          [ResourceType.RockFragment]: 10,
          [ResourceType.RottenWood]: 15,
          [ResourceType.Fungus]: 15,
        },

        storageIncrease: {
          ant: 0.005,
        },

        xpPerAction: 50,
        levelRequired: 25,
        initialTimePerAction: 10,
        timePerAction: 10,
      },
      {
        name: CraftingRecipeType.AdvancedAntHill,
        description: 'Generates 5 ants passively per Ant Hill',
        cost: {
          [ResourceType.RockFragment]: 10,
          [ResourceType.Fungus]: 10,
          ants: 100,
        },

        xpPerAction: 100,
        levelRequired: 50,
        initialTimePerAction: 20,
        timePerAction: 20,
        effect: {
          antGeneration: 5,
        },
      },
    ],
    craftedItems: {
      [CraftingRecipeType.SeedStorage]: 0,
      [CraftingRecipeType.LarvaeStorage]: 0,
      [CraftingRecipeType.AntStorage]: 0,
    },

    // Farming
    selectedSeed: null,
    farmingPlots: Array(9).fill({seed: null, growthStage: 'Empty', growthProgress: 0}),
    harvestedResources: {
      [SeedNames.NutrientFungus]: 0,
    },
    farmingModifiers: {
      growthRate: 1,
      craftingRate: 1,
      regenerationRate: 1,
      spawnRate: 1,
      defense: 1,
    },
    eatenFungus: [] as {
      name: SeedNames,
      effect: object,
      duration: number,
    }[],

    combatMilestones: combatMilestones,

    modifiers: {
      army: {
        attack: 0,
        defense: 0,
        health: 0,
        regen: 0,
      },
    },

    pastNotifications: {},

    activeTrainings: [] as Skill[],

    // Crafting
    craftingMilestones: [
      {
        levelRequired: 50,
        effect: {
          maxActiveCraftingRecipes: 2,
        },
        description: 'Unlocks the ability to craft 2 recipes at once',
      },
      {
        levelRequired: 100,
        effect: {
          maxActiveCraftingRecipes: 3,
        },
        description: 'Unlocks the ability to craft 3 recipes at once',
      },
    ],
    activeCraftingRecipes: [] as string[],
    maxActiveCraftingRecipes: 1,
    miningDoubleChance: 0,
    xpMultiplier: 1,
  }),

  getters: {
    amountCraftedItems: (state) => (recipeName: string) => {
      return state.craftedItems[recipeName] ?? 0
    },
    getAvailableSeeds() {
      return seeds
    },
    getSeedByName: (state) => (name: string) => {
      return seeds.find(seed => seed.name === name)
    },
  },

  actions: {
    processCombat(skill: Skill, amount = 4) {
      this.addXp(skill, amount)
      this.addXp(Skill.Hitpoints, amount / 1.5)
    },

    processTraining(deltaTime: number) {
      if (this.activeTrainings.includes(Skill.Mining)) this.processMining(deltaTime)
      if (this.activeTrainings.includes(Skill.Crafting)) this.processCrafting(deltaTime)
      this.processFarming(deltaTime)
    },

    processFarming(deltaTime: number) {
      const growthDelta = deltaTime * this.farmingModifiers.growthRate

      this.farmingPlots.forEach((plot, index) => {
        if (plot.seed) {
          plot.growthProgress += growthDelta

          // If the growth progress exceeds the growth time, move to the next stage
          if (plot.growthStage === 'Planted' && plot.growthProgress >= plot.seed.growthTime / 2) {
            plot.growthStage = 'Growing'
          } else if (plot.growthStage === 'Growing' && plot.growthProgress >= plot.seed.growthTime) {
            plot.growthStage = 'Mature'
            // If the setting is set and the first notification of this seed type was over 10 seconds ago
            if (useSettingsStore().getNotificationSetting('matureCrops') && (!this.pastNotifications[plot.seed.name] || Date.now() - this.pastNotifications[plot.seed.name] > 10 * 1000)) {
              this.pastNotifications[plot.seed.name] = Date.now()
              toast.success(`Mature crop: ${plot.seed.name}`, {
                position: toast.POSITION.TOP_LEFT,
              })
            }
          }
        }
      })

      this.handleFungusDuration(deltaTime)
    },
    cancelEffect(fungus: Seed) {
      this.eatenFungus = this.eatenFungus.filter(f => f.name !== fungus.name)
      this.applyFungusEffects()
    },
    eatFungus(fungus: Seed) {
      const existingFungus = this.eatenFungus.find(f => f.name === fungus.name)
      
      if (existingFungus) {
        // If the fungus already exists, extend its duration
        existingFungus.duration += fungus.duration
      } else {
        // If it's a new fungus, add it to the list
        this.eatenFungus.push({
          name: fungus.name,
          effect: fungus.effect,
          duration: fungus.duration,
        })
      }

      this.applyFungusEffects()
      this.harvestedResources[fungus.name]--

      // clear harvested resources if the amount is 0
      Object.keys(this.harvestedResources).forEach(key => {
        if (this.harvestedResources[key] <= 0) delete this.harvestedResources[key]
      })
    },
    handleFungusDuration(deltaTime: number) {
      this.eatenFungus = this.eatenFungus.filter(fungus => {
        fungus.duration -= deltaTime
        return fungus.duration > 0
      })

      this.applyFungusEffects()
    },
    applyFungusEffects() {
      this.resetFarmingModifiers()
      this.eatenFungus.filter(fungus => fungus.duration > 0).forEach(fungus => {
        Object.keys(fungus.effect).forEach(effect => {
          this.farmingModifiers[effect] = fungus.effect[effect]
        })
      })
    },
    resetFarmingModifiers() {
      this.farmingModifiers = {
        growthRate: 1,
        craftingRate: 1,
        regenerationRate: 1,
        spawnRate: 1,
        defense: 1,
      }
    },

    plantSeed(index: number, seed: Seed) {
      if (!this.farmingPlots[index].seed) {
        this.farmingPlots[index] = {
          seed: seed,
          growthStage: 'Planted',
          growthProgress: 0,
        }
      }
    },

    harvestPlant(index: number) {
      if (this.farmingPlots[index].growthStage === 'Mature') {
        const seed = this.farmingPlots[index].seed
        this.addXp(Skill.Farming, seed.xpPerAction)
        if (!this.harvestedResources[seed.name]) this.harvestedResources[seed.name] = 0
        this.harvestedResources[seed.name]++

        // Reset the plot after harvesting
        this.farmingPlots[index] = {seed: null, growthStage: 'Empty', growthProgress: 0}
      }
    },

    processMining(deltaTime: number) {
      this.activeResources.forEach((activeResourceName) => {
        const activeResource = this.miningResources.find(res => res.name === activeResourceName)
        if (!activeResource) return

        if (this.training.mining.level < activeResource.levelRequired) return

        if (activeResource.isDepleted) {
          this.handleRespawn(activeResource, deltaTime)
          return
        }

        this.handleMining(activeResource, deltaTime)
      })
    },


    processCrafting(deltaTime: number) {
      this.activeCraftingRecipes.forEach(recipeName => {
        const activeRecipe = this.craftingRecipes.find(recipe => recipe.name === recipeName)
        if (!activeRecipe) return

        if (this.training.crafting.level < activeRecipe.levelRequired) return

        if (!this.canCraft(activeRecipe)) {
          this.stopCrafting(recipeName)
          return
        }

        activeRecipe.timePerAction -= deltaTime * this.farmingModifiers.craftingRate

        if (activeRecipe.timePerAction > 0) return

        // Crafting is complete, add XP and increase storage
        this.addXp(Skill.Crafting, activeRecipe.xpPerAction)
        this.increaseStorage(activeRecipe.name)
        this.subtractResources(activeRecipe.cost)

        // Reset timePerAction
        activeRecipe.timePerAction = activeRecipe.initialTimePerAction
      })
    },

    subtractResources(cost: Record<ResourceType, number>) {
      const resourceStore = useResourcesStore()
      const resourcesToCheckInStore = [
        'ants',
      ]

      for (const [resource, amount] of Object.entries(cost)) {
        if (resourcesToCheckInStore.includes(resource)) {
          resourceStore.resources[resource] -= amount
          continue
        }

        this.resourcesCollected[resource] -= amount
      }
    },

    increaseStorage(recipeName: string) {
      if (!this.craftedItems[recipeName]) this.craftedItems[recipeName] = 0
      this.craftedItems[recipeName]++

      this.applyModifiers()
    },

    canCraft(recipe: CraftingRecipe): boolean {
      if (this.training.crafting.level < recipe.levelRequired) return false

      const resourceStore = useResourcesStore()
      const resourcesToCheckInStore = [
        'ants',
      ]
      const currentResources = this.resourcesCollected

      for (const [resource, amount] of Object.entries(recipe.cost)) {
        if (resourcesToCheckInStore.includes(resource)) {
          if (resourceStore.resources[resource] < amount) return false

          continue
        }

        if (!currentResources[resource]) return false
        if (currentResources[resource] < amount) return false
      }

      return true
    },

    startCrafting(recipeName: string) {
      if (this.activeCraftingRecipes.length >= this.maxActiveCraftingRecipes) {
        // If we're at the limit, remove the oldest crafting recipe
        this.stopCrafting(this.activeCraftingRecipes[0])
      }

      this.setActiveTraining(Skill.Crafting)
      this.activeCraftingRecipes.push(recipeName)
    },

    stopCrafting(recipeName?: string) {
      if (!recipeName) {
        // Stop all crafting
        this.activeCraftingRecipes.forEach(recipe => this.resetCraftingRecipe(recipe))
        this.activeCraftingRecipes = []
        this.removeActiveTraining(Skill.Crafting)
        return
      }

      const index = this.activeCraftingRecipes.indexOf(recipeName)
      if (index !== -1) {
        this.activeCraftingRecipes.splice(index, 1)
        this.resetCraftingRecipe(recipeName)
      }

      if (this.activeCraftingRecipes.length === 0) {
        this.removeActiveTraining(Skill.Crafting)
      }
    },

    resetCraftingRecipe(recipeName: string) {
      const recipe = this.craftingRecipes.find(r => r.name === recipeName)
      if (recipe) {
        recipe.timePerAction = recipe.initialTimePerAction
      }
    },

    checkCraftingMilestones() {
      this.craftingMilestones.forEach(milestone => {
        if (this.training.crafting.level >= milestone.levelRequired) {
          this.applyCraftingMilestone(milestone)
        }
      })
    },

    applyCraftingMilestone(milestone: { effect: { maxActiveCraftingRecipes: number } }) {
      this.maxActiveCraftingRecipes = milestone.effect.maxActiveCraftingRecipes
    },

    handleMining(resource: MiningResource, deltaTime: number) {
      resource.timePerAction -= deltaTime

      if (resource.timePerAction > 0) return

      // Resource is depleted, add XP and increment resources collected
      this.addXp(Skill.Mining, resource.xpPerAction)
      this.addXpToMiningResource(resource, resource.xpPerAction * 2)
      if (!this.resourcesCollected[resource.name]) this.resourcesCollected[resource.name] = 0
      
      let lootMultiplier = 1
      if (Math.random() < this.miningDoubleChance) {
        lootMultiplier = 2
      }
      this.resourcesCollected[resource.name] += resource.collectionMultiplier * lootMultiplier

      // Mark the resource as depleted and reset timePerAction
      resource.isDepleted = true
      resource.timePerAction = resource.initialTimePerAction - resource.timeReduction
    },

    addXpToMiningResource(resource: MiningResource, xp: number) {
      resource.xp += xp
      if (resource.xp >= resource.xpToNextLevel) this.addLevelToMiningResource(resource)
    },

    addLevelToMiningResource(resource: MiningResource) {
      resource.level++
      resource.xp -= resource.xpToNextLevel
      resource.xpToNextLevel = this.getXpToNextLevel(resource.level)

      if (resource.xp >= resource.xpToNextLevel) this.addLevelToMiningResource(resource)

      this.checkAndApplyMileStoneBonusses(resource)
    },

    checkAndApplyMileStoneBonusses(resource: MiningResource) {
      const resourceMilestones = resource.milestones ?? []
      if (resourceMilestones.length === 0) return

      this.resetMilstoneBonusses(resource)

      resourceMilestones.forEach(milestone => {
        if (resource.level >= milestone.level) {
          resource.collectionMultiplier *= (1 + milestone.collectionMultiplierBonus)
          resource.timeReduction += milestone.timeReductionBonus
          resource.respawnReduction += milestone.respawnReductionBonus
        }
      })
    },

    resetMilstoneBonusses(resource: MiningResource) {
      resource.collectionMultiplier = 1
      resource.timeReduction = 0
      resource.respawnReduction = 0
    },

    handleRespawn(resource: MiningResource, deltaTime: number) {
      resource.respawnTime -= deltaTime

      if (resource.respawnTime > 0) return

      // Resource has respawned, reset respawn time and make it available again
      resource.isDepleted = false
      resource.respawnTime = resource.initialRespawnTime - resource.respawnReduction
    },

    startMining(resource: MiningResource) {
      this.setActiveTraining(Skill.Mining)
      this.resetOreNode(resource)
      this.setActiveResource(resource.name)
      this.resetNoneActiveOreNodes()
    },

    resetNoneActiveOreNodes() {
      this.miningResources.forEach(resource => {
        if (!this.activeResources.includes(resource.name)) {
          this.resetOreNode(resource)
        }
      })
    },

    stopMining(resourceName?: string) {
      if (!resourceName) {
        this.activeResources.forEach(resource => {
          this.stopMining(resource)
        })
        return
      }

      const resourceIndex = this.activeResources.indexOf(resourceName)
      if (resourceIndex !== -1) {
        this.activeResources.splice(resourceIndex, 1)
      }

      const activeResource = this.miningResources.find(res => res.name === resourceName)
      if (activeResource) {
        this.resetOreNode(activeResource)
      }

      if (this.activeResources.length === 0) {
        this.removeActiveTraining(Skill.Mining)
      }
    },

    resetOreNode(resource: MiningResource) {
      resource.timePerAction = resource.initialTimePerAction - resource.timeReduction
      resource.respawnTime = resource.initialRespawnTime - resource.respawnReduction
      resource.isDepleted = false
    },

    setActiveTraining(skill: Skill) {
      if (!this.activeTrainings.includes(skill) && skill !== Skill.None) {
        this.activeTrainings.push(skill)
      } else if (skill === Skill.None) {
        this.activeTrainings = []
      }
    },

    removeActiveTraining(skill: Skill) {
      const index = this.activeTrainings.indexOf(skill)
      if (index !== -1) {
        this.activeTrainings.splice(index, 1)
      }
    },

    stopEverything(skill: Skill) {
      if (skill === Skill.Mining) this.stopCrafting()
      if (skill === Skill.Crafting) this.stopMining()
    },

    setActiveResource(resource: ResourceType) {
      const allowedAmount = this.maxActiveResources
      if (this.activeResources.includes(resource)) return

      if (this.activeResources.length >= allowedAmount) {
        this.activeResources.shift()
      }

      this.activeResources.push(resource)
    },

    addLevel(skill: Skill) {
      const training = this.getTrainingState(skill)
      if (!training) return

      training.level++
      training.xp -= training.xpToNextLevel
      training.xpToNextLevel = this.getXpToNextLevel(training.level)

      if (training.xp >= training.xpToNextLevel) this.addLevel(skill)

      if (skill === Skill.Mining) this.checkMiningMilestones()
      if (skill === Skill.Attack || skill === Skill.Defense || skill === Skill.Hitpoints) this.applyCombatMilestones()
    },

    checkMiningMilestones() {
      this.miningMilestones.forEach(milestone => {
        if (this.training.mining.level >= milestone.levelRequired) {
          this.applyMiningMilestone(milestone)
        }
      })
    },

    applyMiningMilestone(milestone) {
      Object.keys(milestone.effect).forEach(effect => {
        if (effect === 'maxActiveResources') {
          this.maxActiveResources = milestone.effect[effect]
        }
      })
    },

    addXp(skill: Skill, xp: number) {
      const training = this.getTrainingState(skill)
      if (!training) return

      const multipliedXp = xp * this.xpMultiplier
      training.xp += multipliedXp
      if (training.xp >= training.xpToNextLevel) this.addLevel(skill)
    },

    getXpToNextLevel(level: number): number {
      return Math.floor(BASE_XP * Math.pow(XP_MULTIPLIER, level))
    },

    getTrainingState(skill: Skill): TrainingState | undefined {
      if (skill === Skill.Mining) return this.training.mining
      if (skill === Skill.Crafting) return this.training.crafting
      if (skill === Skill.Attack) return this.training.attack
      if (skill === Skill.Defense) return this.training.defense
      if (skill === Skill.Hitpoints) return this.training.hitpoints
      if (skill === Skill.Farming) return this.training.farming

      return undefined
    },
    getTrainingStateToSave() {
      return {
        activeTab: this.activeTab,

        training: this.training,
        activeResources: this.activeResources,
        activeCraftingRecipe: this.activeCraftingRecipe,
        resourcesCollected: this.resourcesCollected,
        craftedItems: this.craftedItems,
        selectedSeed: this.selectedSeed,
        harvestedResources: this.harvestedResources,
        farmingPlots: this.farmingPlots,
        eatenFungus: this.eatenFungus,

        miningResourceLevels: this.miningResources.map(resource => ({
          name: resource.name,
          level: resource.level,
          xp: resource.xp,
          xpToNextLevel: resource.xpToNextLevel,
        })),

        activeTrainings: this.activeTrainings,
        activeCraftingRecipes: this.activeCraftingRecipes,
        maxActiveCraftingRecipes: this.maxActiveCraftingRecipes,
        xpMultiplier: this.xpMultiplier,
      }
    },
    loadTrainingState(state) {
      this.activeTab = state.activeTab ?? this.activeTab

      this.training = {
        ...this.training,
        ...state.training ?? {},
      }

      this.activeResources = state.activeResources ?? this.activeResources
      this.activeCraftingRecipe = state.activeCraftingRecipe ?? this.activeCraftingRecipe
      this.resourcesCollected = state.resourcesCollected ?? this.resourcesCollected
      this.craftedItems = state.craftedItems ?? this.craftedItems
      this.selectedSeed = state.selectedSeed ?? this.selectedSeed
      this.harvestedResources = state.harvestedResources ?? this.harvestedResources
      this.farmingPlots = state.farmingPlots ?? this.farmingPlots
      this.eatenFungus = state.eatenFungus ?? this.eatenFungus

      this.miningResources = this.miningResources.map(resource => {
        const savedResource = state.miningResourceLevels?.find(saved => saved.name === resource.name)
        if (!savedResource) return resource

        return {
          ...resource,
          ...savedResource,
        }
      })

      this.activeTrainings = state.activeTrainings ?? []
      this.activeCraftingRecipes = state.activeCraftingRecipes ?? []
      this.maxActiveCraftingRecipes = state.maxActiveCraftingRecipes ?? 1
      this.miningDoubleChance = 0
      this.xpMultiplier = 1

      this.addMilestonesToMiningResources()
      this.applyModifiers()
      this.applyMiningMilestoneBonusses()
      this.applyCombatMilestones()
      this.checkMiningMilestones()
      this.checkCraftingMilestones()
      this.resetAllOreNodes()
    },
    resetTrainingState() {
      this.activeTab = 'mining'
      Object.keys(this.training).forEach(key => {
        this.training[key].level = 1
        this.training[key].xp = 0
        this.training[key].xpToNextLevel = BASE_XP
      })

      this.activeResources = []
      this.maxActiveResources = 1

      this.resourcesCollected = {}

      this.activeCraftingRecipe = ''

      this.craftedItems = {}

      this.selectedSeed = null

      this.farmingPlots = Array(9).fill({seed: null, growthStage: 'Empty', growthProgress: 0})

      this.harvestedResources = {}

      this.eatenFungus = []

      this.miningResources.forEach(resource => {
        resource.level = 1
        resource.xp = 0
        resource.xpToNextLevel = BASE_XP
      })

      this.activeTrainings = []
      this.activeCraftingRecipes = []
      this.maxActiveCraftingRecipes = 1
      this.miningDoubleChance = 0
      this.xpMultiplier = 1

      this.addMilestonesToMiningResources()
      this.applyModifiers()
      this.applyMiningMilestoneBonusses()
      this.applyCombatMilestones()
      this.checkMiningMilestones()
      this.checkCraftingMilestones()
      this.resetAllOreNodes()
    },
    resetAllOreNodes() {
      this.miningResources.forEach(resource => {
        this.resetOreNode(resource)
      })
    },
    addMilestonesToMiningResources() {
      this.miningResources.forEach(resource => {
        const milestones = []
        const initialCollectionMultiplierBonus = 0.05
        const collectionMultiplierIncrement = 0.05
        const initialTimeReductionBonus = 0.1
        const initialRespawnReductionBonus = 0.05
        const timeReductionIncrement = 0.05
        let timePerAction = resource.initialTimePerAction
        let respawnPerAction = resource.initialRespawnTime

        const milestoneLevels = [5, 10, 20, 30, 50, 100, 150, 200, 250, 500, 750, 1000]

        milestoneLevels.forEach(level => {
          const collectionMultiplierBonus = initialCollectionMultiplierBonus + (Math.floor(level / 5) - 1) * collectionMultiplierIncrement
          let timeReductionBonus = initialTimeReductionBonus + (Math.floor(level / 5) - 1) * timeReductionIncrement
          let respawnReductionBonus = initialRespawnReductionBonus + (Math.floor(level / 5) - 1) * timeReductionIncrement

          // Ensure that timePerAction never goes below 1 second
          if (timePerAction - timeReductionBonus < 1) {
            timeReductionBonus = Math.max(0, timePerAction - 1)
            timePerAction = 1 // Cap timePerAction at 1 second once reached
          } else {
            timePerAction -= timeReductionBonus // Continue reducing timePerAction
          }

          if (respawnPerAction - respawnReductionBonus < 1) {
            respawnReductionBonus = Math.max(0, respawnPerAction - 1)
            respawnPerAction = 1 // Cap respawnPerAction at 1 second once reached
          } else {
            respawnPerAction -= respawnReductionBonus // Continue reducing respawnPer
          }

          // Stop giving time bonuses after timePerAction reaches 1 second
          if (timePerAction <= 1) {
            timeReductionBonus = 0
          }

          if (respawnPerAction <= 1) {
            respawnReductionBonus = 0
          }

          milestones.push({
            level,
            collectionMultiplierBonus: parseFloat(collectionMultiplierBonus.toFixed(3)), // Keep precision
            timeReductionBonus: parseFloat(timeReductionBonus.toFixed(3)),
            respawnReductionBonus: parseFloat(respawnReductionBonus.toFixed(3)),
          })
        })

        resource.milestones = milestones
      })
    },
    applyMiningMilestoneBonusses() {
      this.miningResources.forEach(resource => {
        this.checkAndApplyMileStoneBonusses(resource)
      })
    },
    applyModifiers() {
      const resourcesStore = useResourcesStore() // Access the resources store
      resourcesStore.productionRates.antsGenerationRate = 0
      const craftedItems = this.craftedItems

      // Initialize the storageModifiers object
      const storageModifiers = this.resetStorageModifiers()

      // Loop through crafted items and apply modifiers
      for (const [key, amountOfUpgrade] of Object.entries(craftedItems)) {
        this.applyCraftingRecipeModifiers(key, amountOfUpgrade, storageModifiers)
      }

      // Apply the updated storage modifiers to the resourcesStore
      resourcesStore.applyStorageModifiers(storageModifiers)
    },

    applyCombatMilestones() {
      this.resetArmyModifiers()
      this.combatMilestones.forEach(milestone => {
        if (this.training[milestone.type].level >= milestone.levelRequired) {
          this.applyCombatMilestone(milestone)
        }
      })
    },

    applyCombatMilestone(milestone: CombatMilestone) {
      if (milestone.appliedTo === 'bosses') {
        const bossStore = useBossStore()
        Object.entries(milestone.effect).forEach(([effect, value]) => {
          if (effect in bossStore.combatModifiers) {
            const key = effect as keyof typeof bossStore.combatModifiers
            if (milestone.multiplyModifier) {
              bossStore.combatModifiers[key] = bossStore.combatModifiers[key].times(new BigNumber(1).plus(value as number))
            } else {
              bossStore.combatModifiers[key] = bossStore.combatModifiers[key].plus(new BigNumber(value as number))
            }
          }
        })
      }

      if (milestone.appliedTo === 'army') {
        Object.entries(milestone.effect).forEach(([effect, value]) => {
          const key = effect as keyof typeof this.modifiers.army
          if (milestone.multiplyModifier) {
            this.modifiers.army[key] *= value as number
          } else {
            this.modifiers.army[key] += value as number
          }
        })
      }

      useAdventureStore().setupAdventureStats()
    },

    resetArmyModifiers() {
      this.modifiers.army = {
        attack: 0,
        defense: 0,
        health: 0,
        regen: 0,
      }
    },

    // Helper method to reset the storage modifiers to default values
    resetStorageModifiers() {
      return {
        seed: 1,
        larvae: 1,
        ant: 1,
        queen: 1,
        eliteAnt: 1,
      }
    },

    // Helper method to apply modifiers from crafting recipes
    applyCraftingRecipeModifiers(key, amountOfUpgrade, storageModifiers) {
      // Find the corresponding crafting recipe
      const craftingRecipe = this.craftingRecipes.find(recipe => recipe.name === key)
      if (!craftingRecipe) return

      // Apply storage modifiers from the recipe
      if (craftingRecipe.storageIncrease) {
        this.applyStorageIncrease(craftingRecipe.storageIncrease, amountOfUpgrade, storageModifiers)
      }

      // Apply other modifiers like production, resource generation, etc.
      if (craftingRecipe.effect) {
        this.applyOtherEffects(craftingRecipe.effect, amountOfUpgrade)
      }
    },

    // Apply storage increase modifiers
    applyStorageIncrease(storageIncrease, amountOfUpgrade, storageModifiers) {
      for (const [resource, modifier] of Object.entries(storageIncrease)) {
        if (storageModifiers[resource] !== undefined) {
          storageModifiers[resource] += amountOfUpgrade * modifier
        }
      }
    },

    // Handle other crafting effects such as resource generation or production boosts
    applyOtherEffects(effect, amountOfUpgrade) {
      const resourcesStore = useResourcesStore()

      if (effect.antGeneration) {
        resourcesStore.addAnts(effect.antGeneration * amountOfUpgrade)
      }
    },
  },
})
