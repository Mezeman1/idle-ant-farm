import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'
import {toast} from 'vue3-toastify'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useSettingsStore} from '@/stores/settingsStore'
import {useTrainingStore} from '@/stores/trainingStore'
import {useAchievementStore} from '@/stores/achievementStore'
import BigNumber from 'bignumber.js'

const MAX_SAFE_VALUE = Number.MAX_VALUE
type AntTypes = 'workers' | 'soldiers' | 'royalQueens'
export const useResourcesStore = defineStore('resources', {
  state: () => ({
    resources: {
      larvae: new BigNumber(0),
      ants: new BigNumber(0), 
      antHousing: new BigNumber(0),
      eliteAnts: new BigNumber(0),
      seeds: new BigNumber(10),
      queens: new BigNumber(1),
      royalJelly: new BigNumber(0),

      // Evolved resources, bought using royal jelly
      royalJellyAnts: new BigNumber(0),
      workers: new BigNumber(0),
      soldiers: new BigNumber(0),
      royalQueens: new BigNumber(0),
    },

    antsPerHousing: 1,

    storage: {
      maxSeeds: new BigNumber(1000), // Initial seed storage capacity
      maxLarvae: new BigNumber(10), // Initial larvae storage capacity
      maxAnts: new BigNumber(500), // Initial ant storage capacity
      maxQueens: new BigNumber(10), // Initial queen storage capacity
      maxEliteAnts: new BigNumber(1),
    },

    storageModifiers: {
      seed: 1,
      larvae: 1,
      ant: 1,
      queen: 1,
      eliteAnt: 1,
    },

    achievementModifiers: {
      storage: {
        seed: 1,
        larvae: 1,
        ant: 1,
        queen: 1,
      },

      // Production is set directly in productionRates, since the storageModifiers are set on each upgrade.
    },

    upgrades: {
      maxSeedStorage: new BigNumber(0),
      maxLarvaeStorage: new BigNumber(0),
    },

    initialCaps: {
      maxSeeds: new BigNumber(1000),
      maxLarvae: new BigNumber(10),
      maxAnts: new BigNumber(500),
      maxQueens: new BigNumber(10),
      maxEliteAnts: new BigNumber(1),
    },

    productionRates: {
      antsGenerationRate: new BigNumber(0),
      larvaeProductionRate: new BigNumber(2.5), // Larvae produced per queen per minute
      collectionRatePerAnt: new BigNumber(60), // Seeds collected per ant per minute

      collectionRatePerWorker: new BigNumber(6000), // Seeds collected per worker per minute
      collectionRateModifier: new BigNumber(1.0), // Multiplicative modifier for seed collection rate
      larvaeProductionModifier: new BigNumber(1.0), // Multiplicative modifier for larvae production
    },

    resourceCosts: {
      seedCostPerLarva: new BigNumber(100), // Cost in seeds to create one larva
      seedCostPerAnt: new BigNumber(50), // Cost in seeds to create one ant
      seedCostPerEliteAnt: new BigNumber(100),
      larvaCostPerAnt: new BigNumber(1), // Cost in larvae to create one ant
      larvaCostPerEliteAnt: new BigNumber(5),
      antCostPerQueen: new BigNumber(50), // Ants required to buy one queen
      seedCostPerQueen: new BigNumber(500), // Seeds required to buy one queen

      // Costs for evolved resources
      royalJellyCostPerUpgrade: new BigNumber(1),
    },

    upgradeCosts: {
      seedStorageUpgradeCost: new BigNumber(500), // Initial cost to upgrade seed storage
      larvaeStorageUpgradeCost: new BigNumber(100), // Initial cost to upgrade larvae storage
    },

    accumulators: {
      larvaeAccumulator: new BigNumber(0), // To accumulate fractional larvae production
      seedAccumulator: new BigNumber(0), // To accumulate fractional seed production
      antAccumulator: new BigNumber(0), // To accumulate fractional ant production
    },

    royalJellyCollectionChance: 0.001, // 0.1% chance to collect royal jelly when queen produces larvae
    royalJellyCollectionModifier: 1.0, // Multiplicative modifier for royal jelly collection chance

    // Balancing factors
    storageUpgradeFactor: new BigNumber(1.4), // How much each upgrade increases storage by (20%)
    upgradeCostFactor: new BigNumber(1.5), // How much each upgrade increases the cost by (30%)
    multiplierPerEliteAnt: new BigNumber(1.5),

    manualCollection: new BigNumber(10),
    manualCollectionMultiplier: new BigNumber(1),

    royalQueenMultiplier: new BigNumber(1000),
  }),
  getters: {
    antsPerSecond: (state) => {
      const farmingSpawnRate = useTrainingStore().farmingModifiers.spawnRate ?? 1
      return state.productionRates.antsGenerationRate.multipliedBy(farmingSpawnRate)
    },
    larvaePerMinute: (state) => {
      const larvaePerQueen = state.resources.queens.multipliedBy(state.productionRates.larvaeProductionRate).multipliedBy(state.productionRates.larvaeProductionModifier)

      if (state.resources.royalQueens.gt(0)) {
        const larvaePerRoyalQueen = state.royalQueenMultiplier.multipliedBy(state.resources.royalQueens).multipliedBy(state.productionRates.larvaeProductionRate).multipliedBy(state.productionRates.larvaeProductionModifier)
        return larvaePerQueen.plus(larvaePerRoyalQueen)
      }

      return larvaePerQueen
    },
    // Calculate larvae production per second for real-time updates
    larvaePerSecond: (state) => {
      const larvaeFromQueens = state.productionRates.larvaeProductionRate.multipliedBy(state.resources.queens).multipliedBy(state.productionRates.larvaeProductionModifier).dividedBy(60)

      if (state.resources.royalQueens.gt(0)) {
        const larvaeFromRoyalQueens = state.productionRates.larvaeProductionRate.multipliedBy(state.royalQueenMultiplier).multipliedBy(state.resources.royalQueens).multipliedBy(state.productionRates.larvaeProductionModifier).dividedBy(60)

        return larvaeFromQueens.plus(larvaeFromRoyalQueens)
      }

      return larvaeFromQueens
    },
    // Calculate seed production per second based on ants
    seedsPerSecond: (state) => {
      const eliteMultiplier = state.resources.eliteAnts.gt(0) ? state.resources.eliteAnts.multipliedBy(state.multiplierPerEliteAnt) : new BigNumber(1)
      const seedsFromAnts = state.productionRates.collectionRatePerAnt.multipliedBy(state.resources.ants).multipliedBy(eliteMultiplier).dividedBy(60).multipliedBy(state.productionRates.collectionRateModifier)
      if (state.resources.workers.gt(0)) {
        const seedsFromWorkers = state.productionRates.collectionRatePerWorker.multipliedBy(state.resources.workers).multipliedBy(eliteMultiplier).dividedBy(60)
        return seedsFromAnts.plus(seedsFromWorkers)
      }

      return seedsFromAnts
    },
    maxAnts: (state) => {
      if (state.resources.antHousing.isZero()) {
        return state.storage.maxAnts.multipliedBy(state.storageModifiers.ant).multipliedBy(state.achievementModifiers.storage.ant)
      }

      return state.storage.maxAnts.plus(state.resources.antHousing.multipliedBy(state.antsPerHousing).multipliedBy(state.storageModifiers.ant).multipliedBy(state.achievementModifiers.storage.ant))
    },
    maxSeeds: (state) => {
      return state.storage.maxSeeds.multipliedBy(state.storageModifiers.seed).multipliedBy(state.achievementModifiers.storage.seed)
    },
    maxLarvae: (state) => {
      return state.storage.maxLarvae.multipliedBy(state.storageModifiers.larvae).multipliedBy(state.achievementModifiers.storage.larvae)
    },
    maxQueens: (state) => {
      return state.storage.maxQueens.multipliedBy(state.storageModifiers.queen).multipliedBy(state.achievementModifiers.storage.queen)
    },
    maxWorkers: (state) => {
      return state.storage.maxAnts.multipliedBy(0.01)
    },
    maxSoldiers: (state) => {
      return state.storage.maxAnts.multipliedBy(0.01)
    },
    maxRoyalQueens: (state) => {
      return state.storage.maxQueens.multipliedBy(0.25)
    },
    seedCostPerAntHousing: (state) => {
      if (state.resources.antHousing.isZero()) {
        return 1
      }

      return state.resources.antHousing.plus(1)
    },
    royalJellyChance: (state) => {
      return state.royalJellyCollectionChance * state.royalJellyCollectionModifier
    },
  },
  actions: {
    addAnts(amount: BigNumber) {
      this.productionRates.antsGenerationRate = new BigNumber(this.productionRates.antsGenerationRate).plus(amount)
    },
    applyStorageModifiers(storageModifiers: any) {
      this.storageModifiers = storageModifiers
    },
    upgradeAnt() {
      if (useGameStore().royalJellyUnlocked && this.resources.royalJelly.gte(this.resourceCosts.royalJellyCostPerUpgrade)) {
        this.resources.royalJelly = this.resources.royalJelly.minus(this.resourceCosts.royalJellyCostPerUpgrade)
        this.resources.royalJellyAnts = this.resources.royalJellyAnts.plus(1)
      }
    },
    maxUpgradeAnt() {
      if (useGameStore().royalJellyUnlocked && this.resourceCosts.royalJellyCostPerUpgrade.gt(0)) {
        const count = this.resources.royalJelly.dividedBy(this.resourceCosts.royalJellyCostPerUpgrade).floor()
        this.resources.royalJelly = this.resources.royalJelly.minus(this.resourceCosts.royalJellyCostPerUpgrade.multipliedBy(count))
        this.resources.royalJellyAnts = this.resources.royalJellyAnts.plus(count)
      }
    },
    upgradeAntTo(antType: AntTypes) {
      if (this.resources.royalJellyAnts.gt(0)) {
        if (antType === 'workers' && this.resources.workers.gte(this.maxWorkers)) {
          return
        }

        if (antType === 'soldiers' && this.resources.soldiers >= this.maxSoldiers) {
          return
        }

        if (antType === 'royalQueens' && this.resources.royalQueens >= this.maxRoyalQueens) {
          return
        }

        this.resources.royalJellyAnts = this.resources.royalJellyAnts.minus(1)
        this.resources[antType] = this.resources[antType].plus(1)
      }
    },
    maxUpgradeAntTo(antType: AntTypes) {
      while (this.resources.royalJellyAnts.gt(0)) {
        if (antType === 'workers' && this.resources.workers.gte(this.maxWorkers)) {
          return
        }

        if (antType === 'soldiers' && this.resources.soldiers >= this.maxSoldiers) {
          return
        }

        if (antType === 'royalQueens' && this.resources.royalQueens >= this.maxRoyalQueens) {
          return
        }

        this.resources.royalJellyAnts = this.resources.royalJellyAnts.minus(1)
        this.resources[antType] = this.resources[antType].plus(1)
      }
    },
    downgradeAntFrom(antType: AntTypes) {
      if (this.resources[antType].gt(0)) {
        this.resources[antType] = this.resources[antType].minus(1)
        this.resources.royalJellyAnts = this.resources.royalJellyAnts.plus(1)
      }
    },
    maxDowngradeAntFrom(antType: AntTypes) {
      while (this.resources[antType].gt(0)) {
        this.resources[antType] = this.resources[antType].minus(1)
        this.resources.royalJellyAnts = this.resources.royalJellyAnts.plus(1)
      }
    },
    // Function to create larvae using seeds, respecting the larvae cap
    createLarvae() {
      if (this.resources.seeds.gte(this.resourceCosts.seedCostPerLarva) && this.resources.larvae.lt(this.maxLarvae)) {
        this.resources.larvae = this.resources.larvae.plus(1)
        this.resources.seeds = this.resources.seeds.minus(this.resourceCosts.seedCostPerLarva)
        return true
      }

      return false
    },
    // Create max larvae based on available seeds and larvae cap
    createMaxLarvae() {
      const availableLarvaeSpace = this.maxLarvae.minus(this.resources.larvae)
      const maxCreatableLarvae = this.resources.seeds.dividedBy(this.resourceCosts.seedCostPerLarva)

      // Calculate how many larvae can actually be created
      const larvaeToCreate = availableLarvaeSpace.comparedTo(maxCreatableLarvae) < 0 ? availableLarvaeSpace : maxCreatableLarvae

      // If there is space and enough seeds to create larvae
      if (larvaeToCreate.gt(0)) {
        this.resources.larvae = this.resources.larvae.plus(larvaeToCreate)
        this.resources.seeds = this.resources.seeds.minus(larvaeToCreate.multipliedBy(this.resourceCosts.seedCostPerLarva))
      }
    },

    // Function to create ants using larvae and seeds
    createAnts() {
      if (this.resources.larvae.gte(this.resourceCosts.larvaCostPerAnt) && this.resources.seeds.gte(this.resourceCosts.seedCostPerAnt) && this.resources.ants.lt(this.maxAnts)) {
        this.resources.ants = this.resources.ants.plus(1)
        useAchievementStore().addToTotal('ants', 1)
        this.resources.larvae = this.resources.larvae.minus(this.resourceCosts.larvaCostPerAnt)
        this.resources.seeds = this.resources.seeds.minus(this.resourceCosts.seedCostPerAnt)
        return true
      }

      return false
    },
    createMaxAnts(fromPrestige = false) {
      if (fromPrestige) {
        const larvaeThreshold = new BigNumber(useSettingsStore().autoThresholds.autoAntCreationLarvae).dividedBy(100)
        const seedsThreshold = new BigNumber(useSettingsStore().autoThresholds.autoAntCreationSeeds).dividedBy(100)

        if (
          this.resources.larvae.lt(this.maxLarvae.multipliedBy(larvaeThreshold)) ||
          this.resources.seeds.lt(this.maxSeeds.multipliedBy(seedsThreshold))
        ) {
          return
        }
      }

      const availableAntSpace = this.maxAnts.minus(this.resources.ants)
      const maxCreatableAntsByLarvae = this.resources.larvae.dividedBy(this.resourceCosts.larvaCostPerAnt)
      const maxCreatableAntsBySeeds = this.resources.seeds.dividedBy(this.resourceCosts.seedCostPerAnt)

      // Calculate how many ants can actually be created based on both larvae and seeds
      let antsToCreate = availableAntSpace.comparedTo(maxCreatableAntsByLarvae) < 0 ? availableAntSpace : maxCreatableAntsByLarvae
      antsToCreate = antsToCreate.comparedTo(maxCreatableAntsBySeeds) < 0 ? antsToCreate : maxCreatableAntsBySeeds

      // If there is space and enough larvae and seeds to create ants
      if (antsToCreate.gt(0)) {
        this.resources.ants = this.resources.ants.plus(antsToCreate)
        this.resources.larvae = this.resources.larvae.minus(antsToCreate.multipliedBy(this.resourceCosts.larvaCostPerAnt))
        this.resources.seeds = this.resources.seeds.minus(antsToCreate.multipliedBy(this.resourceCosts.seedCostPerAnt))

        useAchievementStore().addToTotal('ants', antsToCreate)
      }
    },

    createAntHousing() {
      const seedCost = this.seedCostPerAntHousing
      if (this.resources.seeds < seedCost) {
        return
      }

      this.resources.seeds = this.resources.seeds.minus(seedCost)
      this.resources.antHousing = this.resources.antHousing.plus(1)
    },
    createMaxAntHousing(fromPrestige = false) {
      const threshold = new BigNumber(useSettingsStore().autoThresholds.autoCreateHousing / 100)
      const currentAnts = this.resources.ants
      const maxAnts = this.maxAnts

      if (fromPrestige && currentAnts.lt(threshold.multipliedBy(maxAnts))) {
        return
      }

      const seeds = this.resources.seeds
      const antHousing = this.resources.antHousing

      // Using a power function to calculate how many ant housings can be purchased in one go
      const initialCost = antHousing.plus(1)

      // Calculate discriminant using BigNumber
      const discriminant = initialCost.multipliedBy(initialCost).plus(seeds.multipliedBy(2))
      
      // Calculate number of purchases using BigNumber
      const numberOfPurchases = discriminant.sqrt().minus(initialCost)

      // Calculate total cost using BigNumber
      const n = new BigNumber(numberOfPurchases)
      const totalCost = n.multipliedBy(
        initialCost.plus(
          initialCost.plus(n.minus(1)),
        ),
      ).dividedBy(2)

      // Deduct seeds and increase ant housing in bulk
      this.resources.seeds = this.resources.seeds.minus(totalCost)
      this.resources.antHousing = this.resources.antHousing.plus(numberOfPurchases)
    },
    // Function to create ants using larvae and seeds
    createEliteAnts() {
      if (this.resources.larvae.gte(this.resourceCosts.larvaCostPerEliteAnt) && this.resources.seeds.gte(this.resourceCosts.seedCostPerEliteAnt) && this.resources.eliteAnts.lt(this.storage.maxEliteAnts)) {
        this.resources.eliteAnts = this.resources.eliteAnts.plus(1)
        this.resources.larvae = this.resources.larvae.minus(this.resourceCosts.larvaCostPerEliteAnt)
        this.resources.seeds = this.resources.seeds.minus(this.resourceCosts.seedCostPerEliteAnt)

        this.resourceCosts.larvaCostPerEliteAnt = this.resourceCosts.larvaCostPerEliteAnt.multipliedBy(5)
        this.resourceCosts.seedCostPerEliteAnt = this.resourceCosts.seedCostPerEliteAnt.multipliedBy(5)

        return true
      }

      return false
    },
    createEliteMaxAnts(fromPrestige = false) {
      if (
        fromPrestige
        && this.resources.larvae.lt(new BigNumber(useSettingsStore().autoThresholds.autoEliteAntsCreationLarvae / 100).multipliedBy(this.maxLarvae))
        || fromPrestige
        && this.resources.seeds.lt(new BigNumber(useSettingsStore().autoThresholds.autoEliteAntsCreationSeeds / 100).multipliedBy(this.maxSeeds))
      ) {
        return
      }

      const availableEliteAntSpace = this.storage.maxEliteAnts.minus(this.resources.eliteAnts)
      const maxCreatableEliteAntsByLarvae = this.resources.larvae.dividedBy(this.resourceCosts.larvaCostPerEliteAnt)
      const maxCreatableEliteAntsBySeeds = this.resources.seeds.dividedBy(this.resourceCosts.seedCostPerEliteAnt)

      // Calculate how many elite ants can actually be created based on both larvae and seeds
      let eliteAntsToCreate = availableEliteAntSpace.comparedTo(maxCreatableEliteAntsByLarvae) < 0 ? availableEliteAntSpace : maxCreatableEliteAntsByLarvae
      eliteAntsToCreate = eliteAntsToCreate.comparedTo(maxCreatableEliteAntsBySeeds) < 0 ? eliteAntsToCreate : maxCreatableEliteAntsBySeeds

      // If there is space and enough larvae and seeds to create elite ants
      if (eliteAntsToCreate.gt(0)) {
        for (let i = new BigNumber(0); i.lt(eliteAntsToCreate); i = i.plus(1)) {
          this.createEliteAnts()
        }
      }
    },
    // Function to buy more queens
    buyQueen() {
      if (this.resources.ants.gte(this.resourceCosts.antCostPerQueen) && this.resources.seeds.gte(this.resourceCosts.seedCostPerQueen) && this.resources.queens.lt(this.maxQueens)) {
        this.resources.queens = this.resources.queens.plus(1)
        this.resources.ants = this.resources.ants.minus(this.resourceCosts.antCostPerQueen)
        this.resources.seeds = this.resources.seeds.minus(this.resourceCosts.seedCostPerQueen)

        useAchievementStore().addToTotal('queens', 1)
        return true
      }

      return false
    },
    addQueen(amount = 1) {
      this.resources.queens = this.resources.queens.plus(amount).comparedTo(this.maxQueens) < 0 ? this.resources.queens.plus(amount) : this.maxQueens

      useAchievementStore().addToTotal('queens', amount)
    },
    // Buy max queens based on available ants and seeds
    buyMaxQueens(fromPrestige = false) {
      if (
        fromPrestige
        && this.resources.ants.lt(new BigNumber(useSettingsStore().autoThresholds.autoQueenCreationAnts / 100).multipliedBy(this.storage.maxAnts))
        || fromPrestige
        && this.resources.seeds.lt(new BigNumber(useSettingsStore().autoThresholds.autoQueenCreationSeeds / 100).multipliedBy(this.maxSeeds))
      ) {
        return
      }

      const availableQueenSpace = this.maxQueens.minus(this.resources.queens)
      const maxPurchasableQueensByAnts = this.resources.ants.dividedBy(this.resourceCosts.antCostPerQueen)
      const maxPurchasableQueensBySeeds = this.resources.seeds.dividedBy(this.resourceCosts.seedCostPerQueen)

      // Calculate how many queens can actually be bought based on both ants and seeds
      let queensToBuy = availableQueenSpace.comparedTo(maxPurchasableQueensByAnts) < 0 ? availableQueenSpace : maxPurchasableQueensByAnts
      queensToBuy = queensToBuy.comparedTo(maxPurchasableQueensBySeeds) < 0 ? queensToBuy : maxPurchasableQueensBySeeds

      // If there is space and enough ants and seeds to buy queens
      if (queensToBuy.gt(0)) {
        this.resources.queens = this.resources.queens.plus(queensToBuy)
        this.resources.ants = this.resources.ants.minus(queensToBuy.multipliedBy(this.resourceCosts.antCostPerQueen))
        this.resources.seeds = this.resources.seeds.minus(queensToBuy.multipliedBy(this.resourceCosts.seedCostPerQueen))

        useAchievementStore().addToTotal('queens', queensToBuy)
      }
    },
    // Collect seeds manually, but respect the seed cap
    collectSeedsManually(amount = new BigNumber(1)) {
      const manualSeedCollectionRate = this.manualCollection.multipliedBy(this.manualCollectionMultiplier) // Number of seeds collected per click
      const seedsToAdd = manualSeedCollectionRate.comparedTo(this.maxSeeds.minus(this.resources.seeds)) < 0 ? manualSeedCollectionRate : this.maxSeeds.minus(this.resources.seeds)
      if (amount.gt(0) && this.resources.seeds.plus(seedsToAdd).lte(this.maxSeeds)) {
        this.resources.seeds = this.resources.seeds.plus(amount)
        return
      }

      this.resources.seeds = this.resources.seeds.plus(seedsToAdd)
    },
    upgradeSeedStorage() {
      if (this.resources.seeds.gte(this.upgradeCosts.seedStorageUpgradeCost)) {
        this.resources.seeds = this.resources.seeds.minus(this.upgradeCosts.seedStorageUpgradeCost)

        this.upgradeSeedStorageEffect(this.upgrades.maxSeedStorage)

        this.upgrades.maxSeedStorage = this.upgrades.maxSeedStorage.plus(1)

        // Increase the upgrade cost by 30%, but prevent it from exceeding MAX_SAFE_VALUE
        this.upgradeCosts.seedStorageUpgradeCost = this.upgradeCosts.seedStorageUpgradeCost.multipliedBy(this.upgradeCostFactor)
      }
    },
    upgradeMaxSeedStorage(fromPrestige = false) {
      if (fromPrestige && this.resources.seeds.lt(new BigNumber(useSettingsStore().autoThresholds.autoSeedStorageUpgrade / 100).multipliedBy(this.maxSeeds))) {
        return
      }

      let affordableUpgrades = new BigNumber(0)
      let totalCost = new BigNumber(0)
      let nextUpgradeCost = this.upgradeCosts.seedStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds.gte(totalCost.plus(nextUpgradeCost))) {
        affordableUpgrades = affordableUpgrades.plus(1)
        totalCost = totalCost.plus(nextUpgradeCost)
        nextUpgradeCost = nextUpgradeCost.multipliedBy(this.upgradeCostFactor)
      }

      // If there are any affordable upgrades
      if (affordableUpgrades.gt(0)) {
        // Deduct the total cost
        this.resources.seeds = this.resources.seeds.minus(totalCost)

        for (let i = new BigNumber(0); i.lt(affordableUpgrades); i = i.plus(1)) {
          this.upgradeSeedStorageEffect(this.upgrades.maxSeedStorage.plus(i))
        }

        // Update the upgrade cost
        this.upgradeCosts.seedStorageUpgradeCost = nextUpgradeCost

        // Apply the total number of upgrades
        this.upgrades.maxSeedStorage = this.upgrades.maxSeedStorage.plus(affordableUpgrades)
      }
    },
    upgradeSeedStorageEffect(amount = new BigNumber(1)) {
      const diminishingFactor = new BigNumber(1).dividedBy(new BigNumber(1).plus(amount.dividedBy(250)))
      const multiplier = BigNumber.maximum(this.storageUpgradeFactor.multipliedBy(diminishingFactor), new BigNumber(1.01))
      const nextUpgrade = this.storage.maxSeeds.multipliedBy(multiplier)

      this.storage.maxSeeds = nextUpgrade
    },
    upgradeLarvaeStorageEffect(amount = new BigNumber(1)) {
      const diminishingFactor = new BigNumber(1).dividedBy(new BigNumber(1).plus(amount.dividedBy(65)))
      const multiplier = BigNumber.maximum(this.storageUpgradeFactor.multipliedBy(diminishingFactor), new BigNumber(1.01))
      const nextUpgrade = this.storage.maxLarvae.multipliedBy(multiplier)

      this.storage.maxLarvae = nextUpgrade
    },
    // Function to upgrade larvae storage
    upgradeLarvaeStorage() {
      if (this.resources.seeds.gte(this.upgradeCosts.larvaeStorageUpgradeCost)) {
        this.resources.seeds = this.resources.seeds.minus(this.upgradeCosts.larvaeStorageUpgradeCost)

        // Increase storage by 20% of the current max
        this.upgradeLarvaeStorageEffect(this.upgrades.maxLarvaeStorage)

        // Increase the upgrade cost by 30%
        this.upgradeCosts.larvaeStorageUpgradeCost = this.upgradeCosts.larvaeStorageUpgradeCost.multipliedBy(this.upgradeCostFactor)

        this.upgrades.maxLarvaeStorage = this.upgrades.maxLarvaeStorage.plus(1)
      }
    },
    upgradeMaxLarvaeStorage(fromPrestige = false) {
      if (fromPrestige && this.resources.larvae.lt(new BigNumber(useSettingsStore().autoThresholds.autoLarvaeStorageUpgrade / 100).multipliedBy(this.maxLarvae))) {
        return
      }

      let affordableUpgrades = new BigNumber(0)
      let totalCost = new BigNumber(0)
      let nextUpgradeCost = this.upgradeCosts.larvaeStorageUpgradeCost

      // Calculate how many upgrades can be afforded in one go
      while (this.resources.seeds.gte(totalCost.plus(nextUpgradeCost))) {
        affordableUpgrades = affordableUpgrades.plus(1)
        totalCost = totalCost.plus(nextUpgradeCost)
        nextUpgradeCost = nextUpgradeCost.multipliedBy(this.upgradeCostFactor)
      }

      // If there are any affordable upgrades
      if (affordableUpgrades.gt(0)) {
        // Deduct the total cost
        this.resources.seeds = this.resources.seeds.minus(totalCost)

        // Apply all upgrades at once
        for (let i = new BigNumber(0); i.lt(affordableUpgrades); i = i.plus(1)) {
          this.upgradeLarvaeStorageEffect(this.upgrades.maxLarvaeStorage.plus(i))
        }

        // Update the upgrade cost
        this.upgradeCosts.larvaeStorageUpgradeCost = nextUpgradeCost

        this.upgrades.maxLarvaeStorage = this.upgrades.maxLarvaeStorage.plus(affordableUpgrades)
      }
    },
    updateResources(deltaTime: number) {
      // Update larvae, but only if there are queens
      if (this.resources.queens.gt(0) && this.resources.larvae.plus(1).lt(this.maxLarvae)) {
        const larvaePerSecond = this.larvaePerSecond // Use the larvaePerSecond calculation

        // Calculate how many larvae to add based on deltaTime
        const larvaeToAdd = larvaePerSecond.multipliedBy(deltaTime)
        this.accumulators.larvaeAccumulator = new BigNumber(this.accumulators.larvaeAccumulator).plus(larvaeToAdd)

        // Only add full larvae units when the accumulator reaches or exceeds 1
        const wholeLarvae = this.accumulators.larvaeAccumulator
        if (wholeLarvae.gt(0)) {
          const newLarvae = this.resources.larvae.plus(wholeLarvae)
          this.resources.larvae = BigNumber.minimum(newLarvae, this.maxLarvae)
          this.accumulators.larvaeAccumulator = this.accumulators.larvaeAccumulator.minus(wholeLarvae)
          useAchievementStore().addToTotal('larvae', wholeLarvae.toNumber())

          this.tryCollectJelly()
        }
      }

      // Update seeds, but only if there are ants
      if (this.resources.ants.gt(0) && this.resources.seeds.plus(1).lt(this.maxSeeds)) {
        const seedsPerSecond = this.seedsPerSecond // Use the seedsPerSecond calculation

        // Calculate how many seeds to add based on deltaTime
        const seedsToAdd = seedsPerSecond.multipliedBy(deltaTime)
        this.accumulators.seedAccumulator = new BigNumber(this.accumulators.seedAccumulator).plus(seedsToAdd)

        // Only add full seed units when the accumulator reaches or exceeds 1
        const wholeSeeds = this.accumulators.seedAccumulator
        if (wholeSeeds.gt(0)) {
          const newSeeds = this.resources.seeds.plus(wholeSeeds)
          this.resources.seeds = BigNumber.minimum(newSeeds, this.maxSeeds)
          this.accumulators.seedAccumulator = this.accumulators.seedAccumulator.minus(wholeSeeds)

          useAchievementStore().addToTotal('seeds', wholeSeeds.toNumber())
        }
      }

      if (this.resources.ants.plus(1).lt(this.maxAnts)) {
        const antsPerSecond = this.antsPerSecond
        const antsToAdd = antsPerSecond.multipliedBy(deltaTime)
        this.accumulators.antAccumulator = new BigNumber(this.accumulators.antAccumulator).plus(antsToAdd)

        const wholeAnts = this.accumulators.antAccumulator
        if (wholeAnts.gt(0)) {
          const newAnts = this.resources.ants.plus(wholeAnts)
          this.resources.ants = BigNumber.minimum(newAnts, this.maxAnts)
          this.accumulators.antAccumulator = this.accumulators.antAccumulator.minus(wholeAnts)

          useAchievementStore().addToTotal('ants', wholeAnts.toNumber())
        }
      }
    },

    setStorageToMax() {
      this.resources.seeds = BigNumber.minimum(this.resources.seeds, this.maxSeeds)
      this.resources.larvae = BigNumber.minimum(this.resources.larvae, this.maxLarvae)
      this.resources.ants = BigNumber.minimum(this.resources.ants, this.maxAnts)
      this.resources.queens = BigNumber.minimum(this.resources.queens, this.maxQueens)
      this.resources.eliteAnts = BigNumber.minimum(this.resources.eliteAnts, this.storage.maxEliteAnts)
    },

    tryCollectJelly() {
      if (useGameStore().royalJellyUnlocked && !useGameStore().simulatingOfflineProgress) {
        const royalJellyChance = this.royalJellyCollectionChance * this.royalJellyCollectionModifier
        const random = Math.random()
        if (random < royalJellyChance) {
          this.resources.royalJelly = this.resources.royalJelly.plus(1)
          if (useSettingsStore().getNotificationSetting('royalJelly')) {
            toast.info('Royal jelly collected!', {
              position: 'top-left',
            })
          }
        }
      }
    },

    handleAutoCreations() {
      const prestigeStore = usePrestigeStore()

      const autoActions = [
        {enabled: prestigeStore.autoSeedStorageUpgrade, action: this.upgradeMaxSeedStorage},
        {enabled: prestigeStore.autoLarvaeStorageUpgrade, action: this.upgradeMaxLarvaeStorage},
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

      this.setStorageToMax()
    },

    getResourcesState() {
      const castResources = Object.entries(this.resources).reduce((acc, [key, value]) => {
        acc[key] = value.toExponential()
        return acc
      }, {} as Record<string, string>)

      const castUpgrades = Object.entries(this.upgrades).reduce((acc, [key, value]) => {
        acc[key] = value.toExponential()
        return acc
      }, {} as Record<string, string>)

      const castUpgradeCosts = Object.entries(this.upgradeCosts).reduce((acc, [key, value]) => {
        acc[key] = value.toExponential()
        return acc
      }, {} as Record<string, string>)

      return {
        resources: castResources,
        upgrades: castUpgrades,
        upgradeCosts: castUpgradeCosts,
        resourceCosts: {
          seedCostPerEliteAnt: this.resourceCosts.seedCostPerEliteAnt.toExponential(),
          larvaCostPerEliteAnt: this.resourceCosts.larvaCostPerEliteAnt.toExponential(),
        },

        productionRates: {
          larvaeProductionRate: this.productionRates.larvaeProductionRate.toExponential(),
          collectionRatePerAnt: this.productionRates.collectionRatePerAnt.toExponential(), 
          collectionRatePerWorker: this.productionRates.collectionRatePerWorker.toExponential(),
        },
      }
    },
    loadResourcesState(savedState: any) {
      // Cast all resources to BigNumber
      this.resources = {
        ...this.resources,
        ...Object.entries(savedState.resources).reduce((acc, [key, value]) => {
          acc[key] = new BigNumber(value)
          return acc
        }, {} as Record<string, BigNumber>),
      }

      // Cast all upgrade costs to BigNumber
      this.upgradeCosts = savedState.upgradeCosts ? 
        Object.entries(savedState.upgradeCosts).reduce((acc, [key, value]) => {
          acc[key] = new BigNumber(value)
          return acc
        }, {} as Record<string, BigNumber>) :
        this.upgradeCosts

      // Cast all upgrades to BigNumber  
      this.upgrades = savedState.upgrades ?
        Object.entries(savedState.upgrades).reduce((acc, [key, value]) => {
          acc[key] = new BigNumber(value)
          return acc
        }, {} as Record<string, BigNumber>) :
        this.upgrades

      // Cast all resource costs to BigNumber
      this.resourceCosts = {
        ...this.resourceCosts,
        ...Object.entries(savedState.resourceCosts || {}).reduce((acc, [key, value]) => {
          acc[key] = new BigNumber(value)
          return acc
        }, {} as Record<string, BigNumber>),
      }

      // Cast all production rates to BigNumber
      this.productionRates = {
        ...this.productionRates,
        ...Object.entries(savedState.productionRates || {}).reduce((acc, [key, value]) => {
          acc[key] = new BigNumber(value) 
          return acc
        }, {} as Record<string, BigNumber>),
      }
    },

    applyUpgrades() {
      for (let i = new BigNumber(0); i.lt(this.upgrades.maxSeedStorage); i = i.plus(1)) {
        this.upgradeSeedStorageEffect(i)
      }

      for (let i = new BigNumber(0); i.lt(this.upgrades.maxLarvaeStorage); i = i.plus(1)) {
        this.upgradeLarvaeStorageEffect(i)
      }

      this.resources.seeds = BigNumber.minimum(this.resources.seeds, this.maxSeeds)
      this.resources.larvae = BigNumber.minimum(this.resources.larvae, this.maxLarvae)
    },

    resetResourcesState(isDebug = false) {
      this.resources = {
        larvae: new BigNumber(0),
        ants: new BigNumber(0),
        antHousing: new BigNumber(0),
        eliteAnts: new BigNumber(0),
        seeds: this.initialCaps.maxSeeds,
        queens: new BigNumber(1),
        royalJelly: isDebug ? new BigNumber(0) : this.resources.royalJelly ?? new BigNumber(0),

        royalJellyAnts: isDebug ? new BigNumber(0) : this.resources.royalJellyAnts,
        workers: isDebug ? new BigNumber(0) : this.resources.workers,
        soldiers: isDebug ? new BigNumber(0) : this.resources.soldiers,
        royalQueens: isDebug ? new BigNumber(0) : this.resources.royalQueens,
      }

      // Reset production rates
      this.productionRates = {
        antsGenerationRate: new BigNumber(0),
        larvaeProductionRate: new BigNumber(1),
        collectionRatePerAnt: new BigNumber(60),

        collectionRatePerWorker: new BigNumber(6000),
        collectionRateModifier: new BigNumber(1),
        larvaeProductionModifier: new BigNumber(1),
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
        maxSeedStorage: new BigNumber(0),
        maxLarvaeStorage: new BigNumber(0),
      }

      // Reset upgrade costs
      this.upgradeCosts = {
        seedStorageUpgradeCost: new BigNumber(500),
        larvaeStorageUpgradeCost: new BigNumber(100),
      }

      this.resourceCosts.larvaCostPerEliteAnt = new BigNumber(5)
      this.resourceCosts.seedCostPerEliteAnt = new BigNumber(100)
    },
  },
})
