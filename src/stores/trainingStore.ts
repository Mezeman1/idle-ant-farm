import {defineStore} from 'pinia'
import {useResourcesStore} from '@/stores/resourcesStore'
import {
  BASE_XP,
  CraftingRecipe,
  CraftingRecipeType,
  ForagingArea,
  MiningResource,
  ResourceType,
  Seed,
  Skill,
  TrainingState,
  TrainingStoreState,
  XP_MULTIPLIER,
} from '@/types/trainingTypes'
import {miningResources} from '@/types/miningResources'
import {useAdventureStore} from '@/stores/adventureStore'
import {foragingResources} from '@/types/foragingResources'
import {SeedNames, seeds} from '@/types/farmingSeeds'

export const useTrainingStore = defineStore({
  id: 'Training',
  state: (): TrainingStoreState => ({
    activeTab: 'mining',

    activeTraining: Skill.None,
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
      foraging: {
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
        description: 'Generates ants passively',
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
    ],
    craftedItems: {
      [CraftingRecipeType.SeedStorage]: 0,
      [CraftingRecipeType.LarvaeStorage]: 0,
      [CraftingRecipeType.AntStorage]: 0,
    },


    // Foraging
    activeForagingZones: [],
    maxActiveForagingZones: 1,
    foragingResources: foragingResources,
    foragedZones: {
      [ForagingArea.Grasslands]: 0,
    },
    foragingMilestones: [
      {
        levelRequired: 50,
        effect: {
          maxActiveForagingZones: 2,
        },
        description: 'Unlocks the ability to forage in 2 areas at once',
      },
    ],

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
    },
    eatenFungus: [] as {
      name: SeedNames,
      effect: object,
      duration: number,
    },
  }),

  getters: {
    amountCraftedItems: (state) => (recipeName: string) => {
      return state.craftedItems[recipeName] ?? 0
    },
    amountForagedZones: (state) => (zone: ForagingArea) => {
      return state.foragedZones[zone] ?? 0
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
      if (this.activeTraining === Skill.Mining) this.processMining(deltaTime)
      if (this.activeTraining === Skill.Crafting) this.processCrafting(deltaTime)
      if (this.activeTraining === Skill.Foraging) this.processForaging(deltaTime)
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
      if (this.eatenFungus.find(f => f.name === fungus.name)) return

      this.eatenFungus.push(
        {
          name: fungus.name,
          effect: fungus.effect,
          duration: fungus.duration,
        },
      )

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

    processForaging(deltaTime: number) {
      this.activeForagingZones.forEach(zone => {
        const activeResource = this.foragingResources.find(res => res.name === zone)
        if (!activeResource) return

        if (this.training.foraging.level < activeResource.levelRequired) return

        if (!this.canForage(activeResource.name)) {
          this.stopForaging()
          return
        }

        this.handleForaging(activeResource, deltaTime)
      })
    },

    handleForaging(resource, deltaTime: number) {
      resource.timePerAction -= deltaTime

      if (resource.timePerAction > 0) return

      // Resource is depleted, add XP and increment resources collected
      this.addXp(Skill.Foraging, resource.xpPerAction)
      this.handleCost(resource.cost)
      if (!this.foragedZones[resource.name]) this.foragedZones[resource.name] = 0
      this.foragedZones[resource.name]++
      this.applyForagingModifiers()

      // Reset timePerAction
      resource.timePerAction = resource.initialTimePerAction
    },

    handleCost(cost: Record<ResourceType, number>) {
      const resourceStore = useResourcesStore()
      const resources = resourceStore.resources

      for (const [resource, amount] of Object.entries(cost)) {
        resources[resource] -= amount
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
      const activeRecipe = this.craftingRecipes.find(recipe => recipe.name === this.activeCraftingRecipe)
      if (!activeRecipe) return

      if (this.training.crafting.level < activeRecipe.levelRequired) return

      if (!this.canCraft(activeRecipe)) {
        this.stopCrafting()
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

    canForage(zone: ForagingArea): boolean {
      const resourceStore = useResourcesStore()
      const currentResources = resourceStore.resources

      const activeResource = this.foragingResources.find(res => res.name === zone)
      if (!activeResource) return false

      for (const [resource, amount] of Object.entries(activeResource.cost)) {
        if (currentResources[resource] < amount) return false
      }

      return true
    },

    startCrafting(recipeName: string) {
      this.setActiveTraining(Skill.Crafting)
      this.setActiveCraftingRecipe(recipeName)
    },

    stopCrafting() {
      this.resetCraftingRecipe()
      this.setActiveCraftingRecipe('')
      this.setActiveTraining(Skill.None)
    },

    resetCraftingRecipe() {
      const activeRecipe = this.craftingRecipes.find(recipe => recipe.name === this.activeCraftingRecipe)
      if (!activeRecipe) return

      activeRecipe.timePerAction = activeRecipe.initialTimePerAction
    },

    setActiveCraftingRecipe(recipe: string) {
      this.activeCraftingRecipe = recipe
    },

    handleMining(resource: MiningResource, deltaTime: number) {
      resource.timePerAction -= deltaTime

      if (resource.timePerAction > 0) return

      // Resource is depleted, add XP and increment resources collected
      this.addXp(Skill.Mining, resource.xpPerAction)
      this.addXpToMiningResource(resource, resource.xpPerAction * 2)
      if (!this.resourcesCollected[resource.name]) this.resourcesCollected[resource.name] = 0
      this.resourcesCollected[resource.name] += resource.collectionMultiplier

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
      resource.xp = 0
      resource.xpToNextLevel = this.getXpToNextLevel(resource.level)

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

    startForaging(zone: ForagingArea) {
      this.setActiveTraining(Skill.Foraging)
      this.setActiveForagingZone(zone)
    },

    setActiveForagingZone(resource: ForagingArea) {
      const allowedAmount = this.maxActiveForagingZones
      if (this.activeForagingZones.includes(resource)) return

      if (this.activeForagingZones.length >= allowedAmount) {
        this.activeForagingZones.shift()
      }

      this.activeForagingZones.push(resource)
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
        this.activeResources.splice(resourceIndex, 1) // Remove resource from active list
      }

      const activeResource = this.miningResources.find(res => res.name === resourceName)
      if (activeResource) {
        this.resetOreNode(activeResource)
      }

      if (this.activeResources.length === 0) {
        this.setActiveTraining(Skill.None) // Stop training if no active mining resources
      }
    },

    stopForaging(zone?: string) {
      if (!zone) {
        this.activeForagingZones.forEach(zone => {
          this.stopForaging(zone)
        })
        return
      }

      const zoneIndex = this.activeForagingZones.indexOf(zone)
      if (zoneIndex !== -1) {
        this.activeForagingZones.splice(zoneIndex, 1) // Remove resource from active list
      }

      const activeResource = this.foragingResources.find(res => res.name === this.activeForagingZone)
      if (activeResource) {
        activeResource.timePerAction = activeResource.initialTimePerAction
      }

      this.setActiveTraining(Skill.None)
    },

    resetOreNode(resource: MiningResource) {
      resource.timePerAction = resource.initialTimePerAction - resource.timeReduction
      resource.respawnTime = resource.initialRespawnTime - resource.respawnReduction
      resource.isDepleted = false
    },

    setActiveTraining(skill: Skill) {
      if (skill !== Skill.None) this.stopEverything(skill)
      this.activeTraining = skill
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
      training.xp = 0
      training.xpToNextLevel = this.getXpToNextLevel(training.level)

      if (skill === Skill.Mining) this.checkMiningMilestones()
      if (skill === Skill.Foraging) this.checkForagingMilestones()
    },

    checkForagingMilestones() {
      this.foragingMilestones.forEach(milestone => {
        if (this.training.foraging.level >= milestone.levelRequired) {
          this.applyForagingMilestone(milestone)
        }
      })
    },

    applyForagingMilestone(milestone) {
      Object.keys(milestone.effect).forEach(effect => {
        if (effect === 'maxActiveForagingZones') {
          this.maxActiveForagingZones = milestone.effect[effect]
        }
      })
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

      training.xp += xp
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
      if (skill === Skill.Foraging) return this.training.foraging
      if (skill === Skill.Farming) return this.training.farming

      return undefined
    },
    getTrainingStateToSave() {
      return {
        activeTab: this.activeTab,

        training: this.training,
        activeTraining: this.activeTraining,
        activeResources: this.activeResources,
        activeCraftingRecipe: this.activeCraftingRecipe,
        activeForagingZones: this.activeForagingZones,
        resourcesCollected: this.resourcesCollected,
        craftedItems: this.craftedItems,
        foragedZones: this.foragedZones,
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
      }
    },
    loadTrainingState(state) {
      this.activeTab = state.activeTab ?? this.activeTab

      this.training = {
        ...this.training,
        ...state.training ?? {},
      }

      this.activeTraining = state.activeTraining ?? this.activeTraining
      this.activeResources = state.activeResources ?? this.activeResources
      this.activeCraftingRecipe = state.activeCraftingRecipe ?? this.activeCraftingRecipe
      this.resourcesCollected = state.resourcesCollected ?? this.resourcesCollected
      this.craftedItems = state.craftedItems ?? this.craftedItems
      this.activeForagingZones = state.activeForagingZones ?? this.activeForagingZones
      this.foragedZones = state.foragedZones ?? this.foragedZones
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

      this.addMilestones()
      this.applyModifiers()
      this.applyForagingModifiers()
      this.applyMiningMilestoneBonusses()
      this.checkMiningMilestones()
      this.checkForagingMilestones()
      this.resetAllOreNodes()
    },
    resetAllOreNodes() {
      this.miningResources.forEach(resource => {
        this.resetOreNode(resource)
      })
    },
    addMilestones() {
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
      const crafterItems = this.craftedItems

      // Initialize the storageModifiers object
      const storageModifiers = this.resetStorageModifiers()

      // Loop through crafted items and apply modifiers
      for (const [key, amountOfUpgrade] of Object.entries(crafterItems)) {
        this.applyCraftingRecipeModifiers(key, amountOfUpgrade, storageModifiers)
      }

      // Apply the updated storage modifiers to the resourcesStore
      resourcesStore.applyStorageModifiers(storageModifiers)
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
    applyForagingModifiers() {
      const adventureStore = useAdventureStore()
      const modifiers = {
        dropChanceModifier: 1.0,
        dropAmountModifier: 1.0,
        xpModifier: 1.0,
        speedModifier: 1.0,
        spawnTimeModifier: 1.0,
        coolDownModifier: 1.0,
      }

      const foragedZones = this.foragedZones
      Object.keys(foragedZones).forEach(zone => {
        const amountForaged = foragedZones[zone]
        const foragingResource = this.foragingResources.find(res => res.name === zone)
        if (!foragingResource) return

        foragingResource.milestones.forEach(milestone => {
          if (amountForaged >= milestone.amountForaged) {
            Object.keys(modifiers).forEach(modifier => {
              modifiers[modifier] += milestone[modifier] ?? 0
            })
          }
        })

        adventureStore.setAreaModifiers(modifiers, zone)
      })
    },
  },
})
