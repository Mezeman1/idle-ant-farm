import {defineStore} from 'pinia'
import {useResourcesStore} from '@/stores/resourcesStore'
import {
  BASE_XP,
  CraftingRecipe,
  CraftingRecipeType,
  ForagingArea,
  MiningResource,
  ResourceType,
  Skill,
  TrainingState,
  TrainingStoreState,
  XP_MULTIPLIER,
} from '@/types/trainingTypes'
import {miningResources} from '@/types/miningResources'

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
    },

    activeResource: ResourceType.None,
    miningResources: miningResources,

    resourcesCollected: {
      [ResourceType.Dirt]: 0,
      [ResourceType.Clay]: 0,
      [ResourceType.Sand]: 0,
      [ResourceType.Leaf]: 0,
    },

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


    activeForagingZone: ResourceType.None,
    foragingResources: [
      {
        name: ForagingArea.Grasslands,
        xpPerAction: 15,
        levelRequired: 1,
        timePerAction: 5,
        resourceType: 'Seeds',
        cost: {ants: 10},
        initialTimePerAction: 5,
        timePerAction: 5,
        productionIncrease: {
          seed: 0.001,
        },
      },
    ],

    foragedZones: {
      [ForagingArea.Grasslands]: 0,
    },

  }),

  getters: {
    amountCraftedItems: (state) => (recipeName: string) => {
      return state.craftedItems[recipeName] ?? 0
    },
    amountForagedZones: (state) => (zone: ForagingArea) => {
      return state.foragedZones[zone] ?? 0
    },
  },

  actions: {
    processCombat(skill: Skill, amount = 4) {
      this.addXp(skill, amount)
      this.addXp(Skill.Hitpoints, amount / 1.5)
    },

    processTraining(deltaTime: number) {
      if (this.activeTraining === Skill.None) return
      if (this.activeTraining === Skill.Mining) this.processMining(deltaTime)
      if (this.activeTraining === Skill.Crafting) this.processCrafting(deltaTime)
      if (this.activeTraining === Skill.Foraging) this.processForaging(deltaTime)
    },

    processForaging(deltaTime: number) {
      const activeResource = this.foragingResources.find(res => res.name === this.activeForagingZone)
      if (!activeResource) return

      if (this.training.foraging.level < activeResource.levelRequired) return

      if (!this.canForage(activeResource.name)) {
        this.stopForaging()
        return
      }

      this.handleForaging(activeResource, deltaTime)
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
      const activeResource = this.miningResources.find(res => res.name === this.activeResource)
      if (!activeResource) return
      if (this.training.mining.level < activeResource.levelRequired) return

      if (activeResource.isDepleted) {
        this.handleRespawn(activeResource, deltaTime)
        return
      }

      this.handleMining(activeResource, deltaTime)
    },

    processCrafting(deltaTime: number) {
      const activeRecipe = this.craftingRecipes.find(recipe => recipe.name === this.activeCraftingRecipe)
      if (!activeRecipe) return

      if (this.training.crafting.level < activeRecipe.levelRequired) return

      if (!this.canCraft(activeRecipe)) {
        this.stopCrafting()
        return
      }

      activeRecipe.timePerAction -= deltaTime

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
    },

    startForaging(zone: ForagingArea) {
      this.setActiveTraining(Skill.Foraging)
      this.setactiveForagingZone(zone)
    },

    setactiveForagingZone(resource: ForagingArea) {
      this.activeForagingZone = resource
    },

    stopMining() {
      const activeResource = this.miningResources.find(res => res.name === this.activeResource)
      if (activeResource) {
        this.resetOreNode(activeResource)
      }
      this.setActiveResource(ResourceType.None)
      this.setActiveTraining(Skill.None)
    },

    stopForaging() {
      const activeResource = this.foragingResources.find(res => res.name === this.activeForagingZone)
      if (activeResource) {
        activeResource.timePerAction = activeResource.initialTimePerAction
      }
      this.setactiveForagingZone(ForagingArea.None)
      this.setActiveTraining(Skill.None)
    },

    resetOreNode(resource: MiningResource) {
      resource.timePerAction = resource.initialTimePerAction - resource.timeReduction
      resource.respawnTime = resource.initialRespawnTime - resource.respawnReduction
      resource.isDepleted = false
    },

    setActiveTraining(skill: Skill) {
      if (skill !== Skill.None) this.stopEverything()
      this.activeTraining = skill
    },

    stopEverything() {
      this.stopMining()
      this.stopCrafting()
    },

    setActiveResource(resource: ResourceType) {
      this.activeResource = resource
    },

    addLevel(skill: Skill) {
      const training = this.getTrainingState(skill)
      if (!training) return

      training.level++
      training.xp = 0
      training.xpToNextLevel = this.getXpToNextLevel(training.level)
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

      return undefined
    },
    getTrainingStateToSave() {
      return {
        activeTab: this.activeTab,

        training: this.training,
        activeTraining: this.activeTraining,
        activeResource: this.activeResource,
        activeCraftingRecipe: this.activeCraftingRecipe,
        activeForagingZone: this.activeForagingZone,
        resourcesCollected: this.resourcesCollected,
        craftedItems: this.craftedItems,
        foragedZones: this.foragedZones,

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
      this.activeResource = state.activeResource ?? this.activeResource
      this.activeCraftingRecipe = state.activeCraftingRecipe ?? this.activeCraftingRecipe
      this.resourcesCollected = state.resourcesCollected ?? this.resourcesCollected
      this.craftedItems = state.craftedItems ?? this.craftedItems
      this.activeForagingZone = state.activeForagingZone ?? this.activeForagingZone
      this.foragedZones = state.foragedZones ?? this.foragedZones

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
      this.applyMiningMilstoneBonusses()
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
    applyMiningMilstoneBonusses() {
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
      const resourcesStore = useResourcesStore()
      const foragedZones = this.foragedZones

      const foragingModifiers = {
        seed: 1,
        larvae: 1,
        ant: 1,
        queen: 1,
        eliteAnt: 1,
      }

      for (const [key, amountOfUpgrade] of Object.entries(foragedZones)) {
        const foragingResource = this.foragingResources.find(resource => resource.name === key)
        if (!foragingResource) continue

        for (const [resource, modifier] of Object.entries(foragingResource.productionIncrease)) {
          if (foragingModifiers[resource] !== undefined) {
            foragingModifiers[resource] += amountOfUpgrade * modifier
          }
        }
      }
    },
  },
})
