import {defineStore} from 'pinia'
import {useResourcesStore} from '@/stores/resourcesStore'

export const useTunnelStore = defineStore('tunnelStore', {
  state: () => ({
    antsInTunnel: 0, // Current ants in tunnel
    initialAntsInTunnel: 0, // Ants at the start of exploration
    tunnelDepth: 0,
    tunnelProgress: 0, // Progress towards next depth point
    depthBoost: 0, // Boost for initial depth scaling
    resourcesFound: {
      seeds: 0,
      mineralShards: 0, // New resource for tunnel upgrades
      queens: 0,
    },
    trapsEncountered: 0,
    lootFound: [], // Loot added to the player's inventory
    autoTunnelActive: false, // Whether the tunnel exploration is auto-running
    animationFrameId: 0, // ID for managing animation frame

    activeUpgrades: [], // Tunnel-related upgrades
    tunnelUpgrades: [
      {
        id: 'tunnelSpeed',
        name: 'Increase Tunnel Speed',
        description: 'Increase the speed of tunnel exploration by 5%',
        cost: 500, // Increased base cost in mineral shards
        costMultiplier: 1.5, // Multiplies cost by 1.5 per purchase
        applyOnPrestige: true,
        effect: () => {
          useTunnelStore().tunnelSpeedMultiplier *= 1.05 // Increase tunnel speed
        },
      },
      {
        id: 'trapReduction',
        name: 'Trap Avoidance',
        description: 'Reduce the chance of encountering traps by 1%',
        cost: 750, // Increased cost
        costMultiplier: 1.5,
        maxPurchases: 25, // Limit the number of purchases
        effect: () => {
          useTunnelStore().trapReductionMultiplier *= 0.99 // Reduce trap chance
        },
      },
      {
        id: 'resourceBoost',
        name: 'Increase Resource Discovery',
        description: 'Increase the amount of resources found by 1%',
        cost: 1000,
        costMultiplier: 1.5,
        effect: () => {
          useTunnelStore().resourceMultiplier *= 1.01 // Boost resource gain
        },
      },
    ],
    tunnelSpeedMultiplier: 1, // Affects speed of digging
    resourceMultiplier: 1, // Multiplier for resources found
    trapReductionMultiplier: 1, // Multiplier for trap chance reduction
  }),

  getters: {
    progressToNextDepth(state) {
      return Math.min(state.tunnelProgress / 100, 1)
    },
    getAvailableAnts() {
      const resourcesStore = useResourcesStore()
      return resourcesStore.resources.ants
    },
    isUpgradeMaxed(state) {
      return (upgradeId: string) => {
        const upgrade = state.tunnelUpgrades.find(up => up.id === upgradeId)
        if (!upgrade) return false
      }
    },
  },

  actions: {
    purchaseUpgrade(upgradeId) {
      const upgrade = this.tunnelUpgrades.find(up => up.id === upgradeId)
      if (!upgrade) return // If the upgrade doesn't exist, do nothing

      const resourcesStore = useResourcesStore()

      if (upgrade.maxPurchases && this.amountOfUpgrades(upgradeId) >= upgrade.maxPurchases) {
        console.log('Maximum purchases reached for this upgrade.')
        return // Prevent purchasing more than max allowed
      }

      if (resourcesStore.resources.mineralShards >= upgrade.cost) {
        resourcesStore.resources.mineralShards -= upgrade.cost // Deduct mineral shards
        upgrade.effect() // Apply the upgrade effect
        upgrade.cost *= upgrade.costMultiplier // Increase cost after each purchase
        this.activeUpgrades.push(upgrade.id) // Store the upgrade as active
      }
    },

    amountOfUpgrades(upgradeId: string) {
      return this.activeUpgrades.filter(up => up === upgradeId).length
    },

    // Start the tunnel exploration
    startTunnelExploration(antsToSend: number) {
      if (this.antsInTunnel > 0) return // Prevent sending more ants if the tunnel is active
      const gameStore = useResourcesStore()
      const availableAnts = gameStore.resources.ants
      if (antsToSend > availableAnts) return // Prevent sending more ants than available

      this.antsInTunnel = antsToSend
      this.initialAntsInTunnel = antsToSend // Store the starting number of ants
      gameStore.resources.ants -= antsToSend // Deduct the sent ants from the player's resources

      // **New Calculation**: Linear-Logarithmic scaling for initial depth
      const linearFactor = this.initialAntsInTunnel * 0.02 // Linear term with a 0.02 multiplier
      const logFactor = 9 * Math.log10(this.initialAntsInTunnel + 1) // Logarithmic term with a 9 multiplier
      this.depthBoost = 1 + linearFactor + logFactor // Combine linear and log scaling with a base value of 1

      this.tunnelDepth = 0
      this.tunnelProgress = 0
      this.autoTunnelActive = true // Set auto mode

      // For each key in resourcesFound, set the value to 0
      for (const key in this.resourcesFound) {
        this.resourcesFound[key] = 0
      }

      this.trapsEncountered = 0
      this.lootFound = []
    },

    handleTunnel(timestamp: number) {
      if (this.antsInTunnel > 0) {
        this.runTunnelLoop(timestamp)
      } else if (this.autoTunnelActive) {
        this.stopTunnelExploration()
      }
    },

    // Main tunnel loop to run exploration and events
    runTunnelLoop(timestamp: number) {
      if (this.antsInTunnel <= 0 || !this.autoTunnelActive) return

      // Time-based progression (calculate deltaTime)
      const currentTime = performance.now()
      const deltaTime = (currentTime - timestamp) / 1000 // Convert ms to seconds

      // Apply constant progress per second, adjusted by tunnel speed multiplier
      const progressGain = this.tunnelSpeedMultiplier * deltaTime * 50 // Tunable progress per second
      this.tunnelProgress += progressGain

      // Check if we've reached the next depth point
      if (this.tunnelProgress >= 100) {
        this.tunnelDepth += 1
        this.tunnelProgress = 0

        // Handle events (find resources, encounter traps, etc.)
        this.triggerTunnelEvent()
      }
    },

    // Stop the tunnel exploration
    stopTunnelExploration() {
      this.autoTunnelActive = false
      cancelAnimationFrame(this.animationFrameId)
      this.antsInTunnel = 0

      // Add found resources, traps, and loot to the player's inventory
      const gameStore = useResourcesStore()
      gameStore.collectSeedsManually(this.resourcesFound.seeds)
      gameStore.addQueen(this.resourcesFound.queens)
      gameStore.resources.mineralShards += this.resourcesFound.mineralShards
    },

    // Handle random events (resources, traps, loot)
    triggerTunnelEvent() {
      const eventChance = Math.random()

      // Adjust depth multiplier to scale logarithmically for better control at higher depths
      const depthMultiplier = Math.log2(this.tunnelDepth + 2) * 1.2 // Logarithmic scaling

      // Scale rewards based on the number of ants sent
      const antMultiplier = Math.pow(this.initialAntsInTunnel, 0.7) // Ant-based scaling

      // Define possible events with corresponding chance ranges
      const events = [
        {chance: 0.5, handler: this.handleResourceEvent}, // 50% chance for resources
        {chance: this.getTrapChance(), handler: this.handleTrapEvent}, // Trap event based on tunnel depth
        {chance: 0.01, handler: this.handleQueenFound}, // 1% chance to find a queen
        // {chance: 0.1, handler: this.handleLootEvent}, // Optional loot event
      ]

      // Determine which event should occur
      let cumulativeChance = 0
      for (const event of events) {
        cumulativeChance += event.chance
        if (eventChance < cumulativeChance) {
          event.handler(depthMultiplier, antMultiplier) // Call the handler function for the selected event
          break
        }
      }
    },

    handleQueenFound(depthMultiplier, antMultiplier) {
      this.resourcesFound.queens += 1
    },

    // Handler for resource event (seeds and mineral shards)
    handleResourceEvent(depthMultiplier, antMultiplier) {
      const seedsFound = Math.floor((Math.random() * 50 + 10) * depthMultiplier * antMultiplier * this.resourceMultiplier)
      const shardsFound = Math.floor((Math.random() * 5 + 1) * depthMultiplier * antMultiplier * this.resourceMultiplier)

      this.resourcesFound.seeds += seedsFound
      this.resourcesFound.mineralShards += shardsFound
    },

    // Handler for trap event (losing ants)
    handleTrapEvent(depthMultiplier, antMultiplier) {
      if (this.tunnelDepth < this.depthBoost) return // Prevent traps early on

      const baseLossPercentage = 0.05 // Base 5% loss
      const maxLossPercentage = 0.2 // Max 20% loss at deeper levels
      const depthFactor = Math.log2(this.tunnelDepth + 2) / 10 // Logarithmic scaling
      const percentageLost = Math.min(baseLossPercentage + depthFactor, maxLossPercentage) * this.trapReductionMultiplier // Scale loss based on depth and reduction

      const antsLost = Math.floor(this.initialAntsInTunnel * percentageLost)
      this.antsInTunnel = Math.max(0, this.antsInTunnel - antsLost)
      this.trapsEncountered += 1
    },

    // Function to calculate the chance of encountering a trap based on depth
    getTrapChance() {
      return Math.min(0.15 + this.tunnelDepth * 0.01, 0.5) * this.trapReductionMultiplier // Max at 50%, reduced by multiplier
    },

    // Reset tunnel data
    resetTunnel() {
      this.antsInTunnel = 0
      this.initialAntsInTunnel = 0
      this.tunnelDepth = 0
      this.tunnelProgress = 0
      this.depthBoost = 0
      this.resourcesFound = {seeds: 0, mineralShards: 0, queens: 0}
      this.trapsEncountered = 0
      this.lootFound = []
      this.autoTunnelActive = false
      cancelAnimationFrame(this.animationFrameId)
      this.activeUpgrades = []
      this.resetCosts() // Reset costs for upgrades
      this.tunnelSpeedMultiplier = 1 // Reset speed multiplier
      this.resourceMultiplier = 1 // Reset resource multiplier
      this.trapReductionMultiplier = 1 // Reset trap reduction multiplier
    },

    getTunnelState() {
      return {
        activeUpgrades: [
          ...this.activeUpgrades,
        ],
        antsInTunnel: this.antsInTunnel,
        initialAntsInTunnel: this.initialAntsInTunnel,
        tunnelDepth: this.tunnelDepth,
        tunnelProgress: this.tunnelProgress,
        depthBoost: this.depthBoost,
        resourcesFound: this.resourcesFound,
        trapsEncountered: this.trapsEncountered,
        lootFound: this.lootFound,
        autoTunnelActive: this.autoTunnelActive,
        animationFrameId: this.animationFrameId,
      }
    },

    loadTunnelState(state) {
      this.activeUpgrades = state.activeUpgrades ?? []
      this.antsInTunnel = state.antsInTunnel ?? 0
      this.initialAntsInTunnel = state.initialAntsInTunnel ?? 0
      this.tunnelDepth = state.tunnelDepth ?? 0
      this.tunnelProgress = state.tunnelProgress ?? 0
      this.depthBoost = state.depthBoost ?? 0
      this.resourcesFound = state.resourcesFound ?? {seeds: 0, mineralShards: 0, queens: 0}
      this.trapsEncountered = state.trapsEncountered ?? 0
      this.lootFound = state.lootFound ?? []
      this.autoTunnelActive = state.autoTunnelActive ?? false
      this.animationFrameId = state.animationFrameId ?? 0

      this.applyActiveUpgrades()
      this.resetCosts() // Reset costs for upgrades based on the current state

      if (this.autoTunnelActive) {
        this.runTunnelLoop(performance.now())
      }
    },
    applyActiveUpgrades() {
      this.activeUpgrades.forEach(upgradeId => {
        const upgrade = this.tunnelUpgrades.find(up => up.id === upgradeId)
        if (upgrade) {
          upgrade.effect()
        }
      })
    },
    resetCosts() {
      this.tunnelUpgrades = this.tunnelUpgrades.map(upgrade => {
        switch (upgrade.id) {
          case 'tunnelSpeed':
            upgrade.cost = 500
            break
          case 'trapReduction':
            upgrade.cost = 750
            break
          case 'resourceBoost':
            upgrade.cost = 1000
            break
        }

        return upgrade
      })

      this.tunnelUpgrades.forEach(upgrade => {
        upgrade.cost = this.amountOfUpgrades(upgrade.id) > 0 ? upgrade.cost * Math.pow(upgrade.costMultiplier, this.amountOfUpgrades(upgrade.id)) : upgrade.cost
      })
    },
  },
})
