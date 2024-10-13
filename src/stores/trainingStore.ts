import { defineStore } from 'pinia'
import {useResourcesStore} from '@/stores/resourcesStore'

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
  Grasslands = 'Grasslands',
  Forest = 'Forest',
  Wasteland = 'Wasteland',
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
  LarvaeStorage = 'Larvae Storage',
  AntStorage = 'Ant Storage',
}

export interface TrainingState {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Resource {
  name: ResourceType;
  xpPerAction: number;
  levelRequired: number;

  initialTimePerAction: number; // Variable to reset timePerAction
  timePerAction: number; // Time in seconds to complete an action

  initialRespawnTime: number; // Variable to reset respawnTime
  respawnTime: number; // Time in seconds for the resource to respawn
  isDepleted: boolean; // Tracks if the resource is currently depleted
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
  miningResources: Resource[];
  resourcesCollected: ResourcesCollected;
  activeCraftingRecipe: string;
  craftingRecipes: CraftingRecipe[];
}

const BASE_XP = 90
const XP_MULTIPLIER = 1.1

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
    miningResources: [
      {
        name: ResourceType.Dirt,
        xpPerAction: 15,
        levelRequired: 1,
        initialTimePerAction: 3,
        timePerAction: 3,
        initialRespawnTime: 2,
        respawnTime: 2,
        isDepleted: false,
      },
      {
        name: ResourceType.Clay,
        xpPerAction: 20,
        levelRequired: 5,
        initialTimePerAction: 3.6,
        timePerAction: 3.6,
        initialRespawnTime: 2,
        respawnTime: 2,
        isDepleted: false,
      },
      {
        name: ResourceType.Sand,
        xpPerAction: 35,
        levelRequired: 10,
        initialTimePerAction: 4.2,
        timePerAction: 4.2,
        initialRespawnTime: 3,
        respawnTime: 3,
        isDepleted: false,
      },
      {
        name: ResourceType.Leaf,
        xpPerAction: 50,
        levelRequired: 20,
        initialTimePerAction: 4.8,
        timePerAction: 4.8,
        initialRespawnTime: 3.5,
        respawnTime: 3.5,
        isDepleted: false,
      },
      {
        name: ResourceType.Twig,
        xpPerAction: 65,
        levelRequired: 30,
        initialTimePerAction: 5.4,
        timePerAction: 5.4,
        initialRespawnTime: 4,
        respawnTime: 4,
        isDepleted: false,
      },
      {
        name: ResourceType.RockFragment,
        xpPerAction: 80,
        levelRequired: 40,
        initialTimePerAction: 6,
        timePerAction: 6,
        initialRespawnTime: 4.5,
        respawnTime: 4.5,
        isDepleted: false,
      },
      {
        name: ResourceType.RottenWood,
        xpPerAction: 100,
        levelRequired: 50,
        initialTimePerAction: 7.2,
        timePerAction: 7.2,
        initialRespawnTime: 5,
        respawnTime: 5,
        isDepleted: false,
      },
      {
        name: ResourceType.Fungus,
        xpPerAction: 120,
        levelRequired: 60,
        initialTimePerAction: 8.4,
        timePerAction: 8.4,
        initialRespawnTime: 5.5,
        respawnTime: 5.5,
        isDepleted: false,
      },
      {
        name: ResourceType.Pebble,
        xpPerAction: 150,
        levelRequired: 70,
        initialTimePerAction: 9.6,
        timePerAction: 9.6,
        initialRespawnTime: 6,
        respawnTime: 6,
        isDepleted: false,
      },
      {
        name: ResourceType.Resin,
        xpPerAction: 175,
        levelRequired: 75,
        initialTimePerAction: 10.8,
        timePerAction: 10.8,
        initialRespawnTime: 6.5,
        respawnTime: 6.5,
        isDepleted: false,
      },
      {
        name: ResourceType.Mushroom,
        xpPerAction: 200,
        levelRequired: 80,
        initialTimePerAction: 12,
        timePerAction: 12,
        initialRespawnTime: 7,
        respawnTime: 7,
        isDepleted: false,
      },
      {
        name: ResourceType.Sap,
        xpPerAction: 250,
        levelRequired: 85,
        initialTimePerAction: 13.2,
        timePerAction: 13.2,
        initialRespawnTime: 7.5,
        respawnTime: 7.5,
        isDepleted: false,
      },
      {
        name: ResourceType.Root,
        xpPerAction: 300,
        levelRequired: 90,
        initialTimePerAction: 14.4,
        timePerAction: 14.4,
        initialRespawnTime: 8,
        respawnTime: 8,
        isDepleted: false,
      },
      {
        name: ResourceType.CarapaceFragment,
        xpPerAction: 350,
        levelRequired: 92,
        initialTimePerAction: 15.6,
        timePerAction: 15.6,
        initialRespawnTime: 8.5,
        respawnTime: 8.5,
        isDepleted: false,
      },
      {
        name: ResourceType.AntLarvae,
        xpPerAction: 400,
        levelRequired: 95,
        initialTimePerAction: 16.8,
        timePerAction: 16.8,
        initialRespawnTime: 9,
        respawnTime: 9,
        isDepleted: false,
      },
      {
        name: ResourceType.AntPheromones,
        xpPerAction: 450,
        levelRequired: 97,
        initialTimePerAction: 18,
        timePerAction: 18,
        initialRespawnTime: 9.5,
        respawnTime: 9.5,
        isDepleted: false,
      },
      {
        name: ResourceType.RoyalJelly,
        xpPerAction: 500,
        levelRequired: 99,
        initialTimePerAction: 19.2,
        timePerAction: 19.2,
        initialRespawnTime: 10,
        respawnTime: 10,
        isDepleted: false,
      },
    ],

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
        cost: { [ResourceType.Dirt]: 5 },
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
        cost: { [ResourceType.Clay]: 5 },
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
        cost: { ants: 10 },
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
      for (const [resource, amount] of Object.entries(cost)) {
        this.resourcesCollected[resource] -= amount
      }
    },

    increaseStorage(recipeName: string) {
      if (!this.craftedItems[recipeName]) this.craftedItems[recipeName] = 0
      this.craftedItems[recipeName]++

      this.applyModifiers()
    },

    canCraft(recipe: CraftingRecipe): boolean {
      const currentResources = this.resourcesCollected

      for (const [resource, amount] of Object.entries(recipe.cost)) {
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

    handleMining(resource: Resource, deltaTime: number) {
      resource.timePerAction -= deltaTime

      if (resource.timePerAction > 0) return

      // Resource is depleted, add XP and increment resources collected
      this.addXp(Skill.Mining, resource.xpPerAction)
      if (!this.resourcesCollected[resource.name]) this.resourcesCollected[resource.name] = 0

      this.resourcesCollected[resource.name]++

      // Mark the resource as depleted and reset timePerAction
      resource.isDepleted = true
      resource.timePerAction = resource.initialTimePerAction
    },

    handleRespawn(resource: Resource, deltaTime: number) {
      resource.respawnTime -= deltaTime

      if (resource.respawnTime > 0) return

      // Resource has respawned, reset respawn time and make it available again
      resource.isDepleted = false
      resource.respawnTime = resource.initialRespawnTime
    },

    startMining(resource: Resource) {
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

    resetOreNode(resource: Resource) {
      resource.timePerAction = resource.initialTimePerAction
      resource.respawnTime = resource.initialRespawnTime
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

      this.applyModifiers()
      this.applyForagingModifiers()
    },
    applyModifiers() {
      const resourcesStore = useResourcesStore() // Access the resources store
      const crafterItems = this.craftedItems

      // Reset the storageModifiers to the default values
      const storageModifiers = {
        seed: 1,
        larvae: 1,
        ant: 1,
        queen: 1,
        eliteAnt: 1,
      }

      // Loop through each crafted item to calculate the modifier
      for (const [key, amountOfUpgrade] of Object.entries(crafterItems)) {
        // Find the corresponding crafting recipe
        const craftingRecipe = this.craftingRecipes.find(recipe => recipe.name === key)
        if (!craftingRecipe) continue

        // Apply the modifier for each storage increase from the crafting recipe
        for (const [resource, modifier] of Object.entries(craftingRecipe.storageIncrease)) {
          if (storageModifiers[resource] !== undefined) {
            // Calculate the modifier based on the amount of upgrades
            storageModifiers[resource] += amountOfUpgrade * modifier
          }
        }
      }

      // Apply the updated storage modifiers to the resourcesStore
      resourcesStore.applyStorageModifiers(storageModifiers)
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
