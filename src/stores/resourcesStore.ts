import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'
import {toast} from 'vue3-toastify'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useSettingsStore} from '@/stores/settingsStore'

const MAX_SAFE_VALUE = Number.MAX_SAFE_INTEGER
export const useResourcesStore = defineStore('resources', {
  state: () => ({
    resources: {
      larvae: 0,
      ants: 0,
      antHousing: 0,
      eliteAnts: 0,
      seeds: 10,
      queens: 1,
      royalJelly: 0,
      mineralShards: 0, // New resource for tunnel upgrades

      // Evolved resources, bought using royal jelly
      royalJellyAnts: 0,
      workers: 0,
      soldiers: 0,
    },

    antsPerHousing: 1,

    storage: {
      maxSeeds: 1000, // Initial seed storage capacity
      maxLarvae: 10, // Initial larvae storage capacity
      maxAnts: 500, // Initial ant storage capacity
      maxQueens: 10, // Initial queen storage capacity
      maxEliteAnts: 1,
    },

    upgrades: {
      maxSeedStorage: 0,
      maxLarvaeStorage: 0,
    },

    initialCaps: {
      maxSeeds: 1000,
      maxLarvae: 10,
      maxAnts: 500,
      maxQueens: 10,
      maxEliteAnts: 1,
    },

    productionRates: {
      larvaeProductionRate: 1, // Larvae produced per queen per minute
      collectionRatePerAnt: 60, // Seeds collected per ant per minute

      collectionRatePerWorker: 6000, // Seeds collected per worker per minute
      collectionRateModifier: 1.0, // Multiplicative modifier for seed collection rate
      larvaeProductionModifier: 1.0, // Multiplicative modifier for larvae production
    },

    resourceCosts: {
      seedCostPerLarva: 100, // Cost in seeds to create one larva
      seedCostPerAnt: 50, // Cost in seeds to create one ant
      seedCostPerEliteAnt: 100,
      larvaCostPerAnt: 1, // Cost in larvae to create one ant
      larvaCostPerEliteAnt: 5,
      antCostPerQueen: 50, // Ants required to buy one queen
      seedCostPerQueen: 500, // Seeds required to buy one queen

      // Costs for evolved resources
      royalJellyCostPerUpgrade: 1,
    },

    upgradeCosts: {
      seedStorageUpgradeCost: 500, // Initial cost to upgrade seed storage
      larvaeStorageUpgradeCost: 100, // Initial cost to upgrade larvae storage
    },

    accumulators: {
      larvaeAccumulator: 0, // To accumulate fractional larvae production
      seedAccumulator: 0, // To accumulate fractional seed production
    },

    royalJellyCollectionChance: 0.001, // 0.1% chance to collect royal jelly when queen produces larvae
    royalJellyCollectionModifier: 1.0, // Multiplicative modifier for royal jelly collection chance

    // Balancing factors
    storageUpgradeFactor: 1.4, // How much each upgrade increases storage by (20%)
    upgradeCostFactor: 1.5, // How much each upgrade increases the cost by (30%)
    multiplierPerEliteAnt: 1.5,
  }),
  getters: {
    // Calculate larvae production per minute based on queens
    larvaePerMinute: (state) => state.resources.queens * state.productionRates.larvaeProductionRate * state.productionRates.larvaeProductionModifier,
    // Calculate larvae production per second for real-time updates
    larvaePerSecond: (state) => (state.resources.queens * state.productionRates.larvaeProductionRate * state.productionRates.larvaeProductionModifier) / 60,
    // Calculate seed production per second based on ants
    seedsPerSecond: (state) => {
      const eliteMultiplier = (state.resources.eliteAnts > 0 ? (state.resources.eliteAnts * state.multiplierPerEliteAnt) : 1) * state.productionRates.collectionRateModifier
      const seedsFromAnts = (state.productionRates.collectionRatePerAnt * state.resources.ants * eliteMultiplier) / 60 * state.productionRates.collectionRateModifier
      if (state.resources.workers > 0) {
        const seedsFromWorkers = (state.productionRates.collectionRatePerWorker * state.resources.workers * eliteMultiplier) / 60
        return seedsFromAnts + seedsFromWorkers
      }

      return seedsFromAnts
    },
    maxAnts: (state) => {
      if (state.resources.antHousing === 0) {
        return state.storage.maxAnts
      }

      return state.storage.maxAnts + state.resources.antHousing * state.antsPerHousing
    },
    maxWorkers: (state) => {
      return state.storage.maxAnts * 0.01
    },
    maxSoldiers: (state) => {
      return state.storage.maxAnts * 0.01
    },
    seedCostPerAntHousing: (state) => {
      if (state.resources.antHousing === 0) {
        return 1
      }

      return state.resources.antHousing + 1
    },
    royalJellyChance: (state) => {
      return state.royalJellyCollectionChance * state.royalJellyCollectionModifier
    },
  },
  actions: {
    upgradeAnt() {
      if (useGameStore().royalJellyUnlocked && this.resources.royalJelly >= this.resourceCosts.royalJellyCostPerUpgrade) {
        this.resources.royalJelly -= this.resourceCosts.royalJellyCostPerUpgrade
        this.resources.royalJellyAnts += 1
      }
    },
    upgradeAntTo(antType: 'workers' | 'soldiers') {
      if (this.resources.royalJellyAnts > 0) {
        if (antType === 'workers' && this.resources.workers >= this.maxWorkers) {
          return
        }

        if (antType === 'soldiers' && this.resources.soldiers >= this.maxSoldiers) {
          return
        }

        this.resources.royalJellyAnts -= 1
        this.resources[antType] += 1
      }
    },
    downgradeAntFrom(antType: 'workers' | 'soldiers') {
      if (this.resources[antType] > 0) {
        this.resources[antType] -= 1
        this.resources.royalJellyAnts += 1
      }
    },
    // Function to create larvae using seeds, respecting the larvae cap
    createLarvae() {
      if (this.resources.seeds >= this.resourceCosts.seedCostPerLarva && this.resources.larvae < Math.floor(this.storage.maxLarvae)) {
        this.resources.larvae += 1
        this.resources.seeds -= this.resourceCosts.seedCostPerLarva
        return true
      }

      return false
    },
    // Create max larvae based on available seeds and larvae cap
    createMaxLarvae() {
      const availableLarvaeSpace = Math.floor(this.storage.maxLarvae) - this.resources.larvae
      const maxCreatableLarvae = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerLarva)

      // Calculate how many larvae can actually be created
      const larvaeToCreate = Math.min(availableLarvaeSpace, maxCreatableLarvae)

      // If there is space and enough seeds to create larvae
      if (larvaeToCreate > 0) {
        this.resources.larvae += larvaeToCreate
        this.resources.seeds -= larvaeToCreate * this.resourceCosts.seedCostPerLarva
      }
    },

    // Function to create ants using larvae and seeds
    createAnts() {
      if (this.resources.larvae >= this.resourceCosts.larvaCostPerAnt && this.resources.seeds >= this.resourceCosts.seedCostPerAnt && this.resources.ants < Math.floor(this.maxAnts)) {
        this.resources.ants += 1
        this.resources.larvae -= this.resourceCosts.larvaCostPerAnt
        this.resources.seeds -= this.resourceCosts.seedCostPerAnt

        this.setAntsWithMax()
        return true
      }

      return false
    },
    createMaxAnts(fromPrestige = false) {
      if (
        fromPrestige
        && this.resources.larvae < useSettingsStore().autoThresholds.autoAntCreationLarvae / 100 * this.storage.maxLarvae
        || fromPrestige
        && this.resources.seeds < useSettingsStore().autoThresholds.autoAntCreationSeeds / 100 * this.storage.maxSeeds
      ) {
        return
      }

      const availableAntSpace = Math.floor(this.maxAnts) - this.resources.ants
      const maxCreatableAntsByLarvae = Math.floor(this.resources.larvae / this.resourceCosts.larvaCostPerAnt)
      const maxCreatableAntsBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerAnt)

      // Calculate how many ants can actually be created based on both larvae and seeds
      const antsToCreate = Math.min(availableAntSpace, maxCreatableAntsByLarvae, maxCreatableAntsBySeeds)

      // If there is space and enough larvae and seeds to create ants
      if (antsToCreate > 0) {
        this.resources.ants += antsToCreate
        this.setAntsWithMax()
        this.resources.larvae -= antsToCreate * this.resourceCosts.larvaCostPerAnt
        this.resources.seeds -= antsToCreate * this.resourceCosts.seedCostPerAnt
      }
    },

    setAntsWithMax() {
      this.resources.ants = Math.min(this.resources.ants, this.maxAnts)
    },

    createAntHousing() {
      const seedCost = this.seedCostPerAntHousing
      if (this.resources.seeds < seedCost) {
        return
      }

      this.resources.seeds -= seedCost
      this.resources.antHousing += 1
    },
    createMaxAntHousing(fromPrestige = false) {
      if (fromPrestige && this.resources.seeds < this.storage.maxSeeds * useSettingsStore().autoThresholds.autoCreateHousing / 100) {
        return
      }

      const seeds = this.resources.seeds
      const antHousing = this.resources.antHousing

      // Using a power function to calculate how many ant housings can be purchased in one go
      const initialCost = antHousing + 1

      // The total cost formula is S = n * (initialCost + (initialCost + (n-1))) / 2
      // Solving for n: n = (-initialCost + sqrt(initialCost^2 + 2 * seeds)) / 1
      const numberOfPurchases = Math.floor((-initialCost + Math.sqrt(initialCost * initialCost + 2 * seeds)))

      // Calculate the total cost based on number of purchases
      const totalCost = numberOfPurchases * (initialCost + (initialCost + (numberOfPurchases - 1))) / 2

      // Deduct seeds and increase ant housing in bulk
      this.resources.seeds -= totalCost
      this.resources.antHousing += numberOfPurchases
    },
    // Function to create ants using larvae and seeds
    createEliteAnts() {
      if (this.resources.larvae >= this.resourceCosts.larvaCostPerEliteAnt && this.resources.seeds >= this.resourceCosts.seedCostPerEliteAnt && this.resources.eliteAnts < Math.floor(this.storage.maxEliteAnts)) {
        this.resources.eliteAnts += 1
        this.resources.larvae -= this.resourceCosts.larvaCostPerEliteAnt
        this.resources.seeds -= this.resourceCosts.seedCostPerEliteAnt

        this.resourceCosts.larvaCostPerEliteAnt = Math.floor(this.resourceCosts.larvaCostPerEliteAnt * 5)
        this.resourceCosts.seedCostPerEliteAnt = Math.floor(this.resourceCosts.seedCostPerEliteAnt * 5)

        return true
      }

      return false
    },
    createEliteMaxAnts(fromPrestige = false) {
      if (
        fromPrestige
        && this.resources.larvae < useSettingsStore().autoThresholds.autoEliteAntsCreationLarvae / 100 * this.storage.maxLarvae
        || fromPrestige
        && this.resources.seeds < useSettingsStore().autoThresholds.autoEliteAntsCreationSeeds / 100 * this.storage.maxSeeds
      ) {
        return
      }

      const availableEliteAntSpace = Math.floor(this.storage.maxEliteAnts) - this.resources.eliteAnts
      const maxCreatableEliteAntsByLarvae = Math.floor(this.resources.larvae / this.resourceCosts.larvaCostPerEliteAnt)
      const maxCreatableEliteAntsBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerEliteAnt)

      // Calculate how many elite ants can actually be created based on both larvae and seeds
      const eliteAntsToCreate = Math.min(availableEliteAntSpace, maxCreatableEliteAntsByLarvae, maxCreatableEliteAntsBySeeds)

      // If there is space and enough larvae and seeds to create elite ants
      if (eliteAntsToCreate > 0) {
        for (let i = 0; i < eliteAntsToCreate; i++) {
          this.createEliteAnts()
        }
      }
    },
    // Function to buy more queens
    buyQueen() {
      if (this.resources.ants >= this.resourceCosts.antCostPerQueen && this.resources.seeds >= this.resourceCosts.seedCostPerQueen && this.resources.queens < Math.floor(this.storage.maxQueens)) {
        this.resources.queens += 1
        this.resources.ants -= this.resourceCosts.antCostPerQueen
        this.resources.seeds -= this.resourceCosts.seedCostPerQueen
        return true
      }

      return false
    },
    addQueen(amount = 1) {
      this.resources.queens = Math.min(this.resources.queens + amount, this.storage.maxQueens)
    },
    // Buy max queens based on available ants and seeds
    buyMaxQueens(fromPrestige = false) {
      if (
        fromPrestige
        && this.resources.ants < useSettingsStore().autoThresholds.autoQueenCreationAnts / 100 * this.storage.maxAnts
        || fromPrestige
        && this.resources.seeds < useSettingsStore().autoThresholds.autoQueenCreationSeeds / 100 * this.storage.maxSeeds
      ) {
        return
      }

      const availableQueenSpace = Math.floor(this.storage.maxQueens) - this.resources.queens
      const maxPurchasableQueensByAnts = Math.floor(this.resources.ants / this.resourceCosts.antCostPerQueen)
      const maxPurchasableQueensBySeeds = Math.floor(this.resources.seeds / this.resourceCosts.seedCostPerQueen)

      // Calculate how many queens can actually be bought based on both ants and seeds
      const queensToBuy = Math.min(availableQueenSpace, maxPurchasableQueensByAnts, maxPurchasableQueensBySeeds)

      // If there is space and enough ants and seeds to buy queens
      if (queensToBuy > 0) {
        this.resources.queens += queensToBuy
        this.resources.ants -= queensToBuy * this.resourceCosts.antCostPerQueen
        this.resources.seeds -= queensToBuy * this.resourceCosts.seedCostPerQueen
      }
    },
    // Collect seeds manually, but respect the seed cap
    collectSeedsManually(amount = 1) {
      const manualSeedCollectionRate = 10 // Number of seeds collected per click
      const seedsToAdd = Math.min(manualSeedCollectionRate, this.storage.maxSeeds - this.resources.seeds)
      if (amount > 0 && this.resources.seeds + seedsToAdd <= this.storage.maxSeeds) {
        this.resources.seeds += amount
        return
      }

      this.resources.seeds += seedsToAdd
    },
    upgradeSeedStorage(fromPrestige = false) {
      if (fromPrestige && this.resources.seeds < useSettingsStore().autoThresholds.autoSeedStorageUpgrade / 100 * this.storage.maxSeeds) {
        return
      }

      if (this.resources.seeds >= this.upgradeCosts.seedStorageUpgradeCost) {
        this.resources.seeds -= this.upgradeCosts.seedStorageUpgradeCost

        this.upgradeSeedStorageEffect(this.upgrades.maxSeedStorage)

        this.upgrades.maxSeedStorage += 1

        // Increase the upgrade cost by 30%, but prevent it from exceeding MAX_SAFE_VALUE
        this.upgradeCosts.seedStorageUpgradeCost = Math.min(
          Math.floor(this.upgradeCosts.seedStorageUpgradeCost * this.upgradeCostFactor),
          MAX_SAFE_VALUE,
        )
      }
    },
    upgradeMaxSeedStorage() {
      let affordableUpgrades = 0
      let totalCost = 0
      let nextUpgradeCost = this.upgradeCosts.seedStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds >= totalCost + nextUpgradeCost && nextUpgradeCost < MAX_SAFE_VALUE) {
        affordableUpgrades += 1
        totalCost += nextUpgradeCost
        nextUpgradeCost = Math.min(
          Math.floor(nextUpgradeCost * this.upgradeCostFactor),
          MAX_SAFE_VALUE,
        )
      }

      // If there are any affordable upgrades
      if (affordableUpgrades > 0) {
        // Deduct the total cost
        this.resources.seeds -= totalCost

        for (let i = 0; i < affordableUpgrades; i++) {
          this.upgradeSeedStorageEffect(this.upgrades.maxSeedStorage + i)
        }

        // Update the upgrade cost
        this.upgradeCosts.seedStorageUpgradeCost = nextUpgradeCost

        // Apply the total number of upgrades
        this.upgrades.maxSeedStorage += affordableUpgrades
      }
    },
    upgradeSeedStorageEffect(amount = 1) {
      const diminishingFactor = 1 / (1 + amount / 250)
      const multiplier = Math.max(this.storageUpgradeFactor * diminishingFactor, 1.01)
      const nextUpgrade = Math.floor(this.storage.maxSeeds * multiplier)

      this.storage.maxSeeds = Math.min(
        nextUpgrade,
        MAX_SAFE_VALUE,
      )
    },
    upgradeLarvaeStorageEffect(amount = 1) {
      const diminishingFactor = 1 / (1 + amount / 65)
      const multiplier = Math.max(this.storageUpgradeFactor * diminishingFactor, 1.01)
      const nextUpgrade = Math.floor(this.storage.maxLarvae * multiplier)

      this.storage.maxLarvae = Math.min(
        nextUpgrade,
        MAX_SAFE_VALUE,
      )
    },
    // Function to upgrade larvae storage
    upgradeLarvaeStorage(fromPrestige = false) {
      if (fromPrestige && this.resources.larvae < useSettingsStore().autoThresholds.autoLarvaeStorageUpgrade / 100 * this.storage.maxLarvae) {
        return
      }

      if (this.resources.seeds >= this.upgradeCosts.larvaeStorageUpgradeCost) {
        this.resources.seeds -= this.upgradeCosts.larvaeStorageUpgradeCost

        // Increase storage by 20% of the current max
        this.upgradeLarvaeStorageEffect(this.upgrades.maxLarvaeStorage)

        // Increase the upgrade cost by 30%
        this.upgradeCosts.larvaeStorageUpgradeCost = Math.floor(this.upgradeCosts.larvaeStorageUpgradeCost * this.upgradeCostFactor)

        this.upgrades.maxLarvaeStorage += 1
      }
    },
    upgradeMaxLarvaeStorage() {
      let affordableUpgrades = 0
      let totalCost = 0
      let nextUpgradeCost = this.upgradeCosts.larvaeStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds >= totalCost + nextUpgradeCost) {
        affordableUpgrades += 1
        totalCost += nextUpgradeCost
        nextUpgradeCost = Math.floor(nextUpgradeCost * this.upgradeCostFactor)
      }

      // If there are any affordable upgrades
      if (affordableUpgrades > 0) {
        // Deduct the total cost
        this.resources.seeds -= totalCost

        // Apply all upgrades at once
        for (let i = 0; i < affordableUpgrades; i++) {
          this.upgradeLarvaeStorageEffect(this.upgrades.maxLarvaeStorage + i)
        }

        // Update the upgrade cost
        this.upgradeCosts.larvaeStorageUpgradeCost = nextUpgradeCost

        this.upgrades.maxLarvaeStorage += affordableUpgrades

        console.log(`Upgraded larvae storage ${affordableUpgrades} times.`)
      }
    },
    updateResources(deltaTime: number) {
      // Update larvae, but only if there are queens
      if (this.resources.queens > 0) {
        const larvaePerSecond = this.larvaePerSecond // Use the larvaePerSecond calculation

        // Calculate how many larvae to add based on deltaTime
        const larvaeToAdd = larvaePerSecond * deltaTime
        this.accumulators.larvaeAccumulator += larvaeToAdd

        // Only add full larvae units when the accumulator reaches or exceeds 1
        const wholeLarvae = Math.floor(this.accumulators.larvaeAccumulator)
        if (wholeLarvae > 0) {
          this.resources.larvae = Math.min(this.resources.larvae + wholeLarvae, this.storage.maxLarvae)
          this.accumulators.larvaeAccumulator -= wholeLarvae // Subtract the whole units from the accumulator

          this.tryCollectJelly()
        }
      }

      // Update seeds, but only if there are ants
      if (this.resources.ants > 0) {
        const seedsPerSecond = this.seedsPerSecond // Use the seedsPerSecond calculation

        // Calculate how many seeds to add based on deltaTime
        const seedsToAdd = seedsPerSecond * deltaTime
        this.accumulators.seedAccumulator += seedsToAdd

        // Only add full seed units when the accumulator reaches or exceeds 1
        const wholeSeeds = Math.floor(this.accumulators.seedAccumulator)
        if (wholeSeeds > 0) {
          this.resources.seeds = Math.min(this.resources.seeds + wholeSeeds, this.storage.maxSeeds)
          this.accumulators.seedAccumulator -= wholeSeeds // Subtract the whole units from the accumulator
        }
      }
    },

    tryCollectJelly() {
      if (useGameStore().royalJellyUnlocked && !useGameStore().simulatingOfflineProgress) {
        const royalJellyChance = this.royalJellyCollectionChance * this.royalJellyCollectionModifier
        const random = Math.random()
        if (random < royalJellyChance) {
          this.resources.royalJelly += 1
          toast.info('Royal jelly collected!', {
            position: 'top-left',
          })
        }
      }
    },

    handleAutoCreations() {
      const prestigeStore = usePrestigeStore()

      const autoActions = [
        {enabled: prestigeStore.autoSeedStorageUpgrade, action: this.upgradeSeedStorage},
        {enabled: prestigeStore.autoLarvaeStorageUpgrade, action: this.upgradeLarvaeStorage},
        {enabled: prestigeStore.autoEliteAntsCreation, action: this.createEliteMaxAnts},
        {enabled: prestigeStore.autoAntCreation, action: this.createMaxAnts},
        {enabled: prestigeStore.autoQueenCreation, action: this.buyMaxQueens},
        {enabled: prestigeStore.autoCreateHousing, action: this.createMaxAntHousing},
      ]

      autoActions.forEach(autoAction => {
        if (autoAction.enabled) {
          autoAction.action(true)
        }
      })
    },

    getResourcesState() {
      return {
        resources: this.resources,
        upgrades: this.upgrades,
        upgradeCosts: this.upgradeCosts,
        resourceCosts: {
          seedCostPerEliteAnt: this.resourceCosts.seedCostPerEliteAnt,
          larvaCostPerEliteAnt: this.resourceCosts.larvaCostPerEliteAnt,
        },

        productionRates: {
          larvaeProductionRate: this.productionRates.larvaeProductionRate,
          collectionRatePerAnt: this.productionRates.collectionRatePerAnt,
          collectionRatePerWorker: this.productionRates.collectionRatePerWorker,
        },
      }
    },
    loadResourcesState(savedState: any) {
      this.resources = {
        ...this.resources,
        ...savedState.resources,
      }

      this.upgradeCosts = savedState.upgradeCosts ?? this.upgradeCosts

      this.upgrades = savedState.upgrades ?? this.upgrades

      this.resourceCosts = {
        ...this.resourceCosts,
        ...savedState.resourceCosts,
      }

      this.productionRates = {
        ...this.productionRates,
        ...savedState.productionRates,
      }
    },

    applyUpgrades() {
        for (let i = 0; i < this.upgrades.maxSeedStorage; i++) {
          this.upgradeSeedStorageEffect(i)
        }

        for (let i = 0; i < this.upgrades.maxLarvaeStorage; i++) {
          this.upgradeLarvaeStorageEffect(i)
        }

        this.resources.seeds = Math.min(this.resources.seeds, this.storage.maxSeeds)
        this.resources.larvae = Math.min(this.resources.larvae, this.storage.maxLarvae)
    },

    resetResourcesState(isDebug = false) {
      this.resources = {
        larvae: 0,
        ants: 0,
        antHousing: 0,
        eliteAnts: 0,
        seeds: this.initialCaps.maxSeeds,
        queens: 1,
        mineralShards: isDebug ? 0 : this.resources.mineralShards ?? 0,
        royalJelly: isDebug ? 0 : this.resources.royalJelly ?? 0,

        royalJellyAnts: isDebug ? 0 : this.resources.royalJellyAnts,
        workers: isDebug ? 0 : this.resources.workers,
        soldiers: isDebug ? 0 : this.resources.soldiers,
      }

      // Reset production rates
      this.productionRates = {
        larvaeProductionRate: 1,
        collectionRatePerAnt: 60,

        collectionRatePerWorker: 6000,
        collectionRateModifier: 1,
        larvaeProductionModifier: 1,
      }

      this.royalJellyCollectionChance = 0.001
      this.royalJellyCollectionModifier = 1.0
      this.antsPerHousing = 1

      // Reset storage to initial caps
      this.storage = {
        maxSeeds: this.initialCaps.maxSeeds,
        maxLarvae: this.initialCaps.maxLarvae,
        maxAnts: this.initialCaps.maxAnts,
        maxQueens: this.initialCaps.maxQueens,
        maxEliteAnts: this.initialCaps.maxEliteAnts,
      }

      this.upgrades = {
        maxSeedStorage: 0,
        maxLarvaeStorage: 0,
      }

      // Reset upgrade costs
      this.upgradeCosts = {
        seedStorageUpgradeCost: 500,
        larvaeStorageUpgradeCost: 100,
      }

      this.resourceCosts.larvaCostPerEliteAnt = 5
      this.resourceCosts.seedCostPerEliteAnt = 100
    },
  },
})
