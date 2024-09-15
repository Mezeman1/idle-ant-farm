import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'

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
    activeUpgrades: [], // Tunnel-related upgrades
    autoTunnelActive: false, // Whether the tunnel exploration is auto-running
    tunnelSpeedMultiplier: 1, // Affects speed of digging
    animationFrameId: 0, // ID for managing animation frames
  }),

  getters: {
    progressToNextDepth(state) {
      return Math.min(state.tunnelProgress / 100, 1)
    },
    getAvailableAnts() {
      const gameStore = useGameStore()
      return gameStore.resources.ants
    },
  },

  actions: {
    // Start the tunnel exploration
    startTunnelExploration(antsToSend: number) {
      if (this.antsInTunnel > 0) return // Prevent sending more ants if the tunnel is active
      const gameStore = useGameStore()
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

      this.runTunnelLoop(performance.now()) // Start the loop
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

      // Continue the loop using requestAnimationFrame
      if (this.antsInTunnel > 0) {
        this.animationFrameId = requestAnimationFrame((time) => this.runTunnelLoop(currentTime))
      } else {
        console.log('Tunnel exploration complete.')
        this.stopTunnelExploration() // Stop if no ants remain
      }
    },

    // Stop the tunnel exploration
    stopTunnelExploration() {
      this.autoTunnelActive = false
      cancelAnimationFrame(this.animationFrameId)
      this.antsInTunnel = 0

      // Add found resources, traps, and loot to the player's inventory
      const gameStore = useGameStore()
      gameStore.collectSeedsManually(this.resourcesFound.seeds)
      gameStore.addQueen(this.resourcesFound.queens)
      gameStore.resources.mineralShards += this.resourcesFound.mineralShards

      console.log('Tunnel exploration stopped. Resources added.')
    },

    // Handle random events (resources, traps, loot)
    triggerTunnelEvent() {
      const eventChance = Math.random()

      // Adjust depth multiplier to scale logarithmically for better control at higher depths
      const depthMultiplier = Math.log2(this.tunnelDepth + 2) * 1.2// Logarithmic scaling

      // Scale rewards based on the number of ants sent
      const antMultiplier = Math.pow(this.initialAntsInTunnel, 0.7) // Ant-based scaling

      // Define possible events with corresponding chance ranges
      const events = [
        {chance: 0.5, handler: this.handleResourceEvent}, // 30% chance for resources
        {chance: this.getTrapChance(), handler: this.handleTrapEvent}, // Trap event based on tunnel depth
        {chance: 0.01, handler: this.handleQueenFound}, // Trap event based on tunnel depth
        // {chance: 0.1, handler: this.handleLootEvent}, // Remaining chance for loot
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
      const seedsFound = Math.floor((Math.random() * 50 + 10) * depthMultiplier * antMultiplier)
      const shardsFound = Math.floor((Math.random() * 5 + 1) * depthMultiplier * antMultiplier)

      this.resourcesFound.seeds += seedsFound
      this.resourcesFound.mineralShards += shardsFound
    },

    // Handler for trap event (losing ants)
    handleTrapEvent(depthMultiplier, antMultiplier) {
      if (this.tunnelDepth < this.depthBoost) return // Prevent traps early on

      const baseLossPercentage = 0.05 // Base 5% loss
      const maxLossPercentage = 0.2 // Max 30% loss at deeper levels
      const depthFactor = Math.log2(this.tunnelDepth + 2) / 10 // Logarithmic scaling
      const percentageLost = Math.min(baseLossPercentage + depthFactor, maxLossPercentage) // Scale loss based on depth

      const antsLost = Math.floor(this.initialAntsInTunnel * percentageLost)
      this.antsInTunnel = Math.max(0, this.antsInTunnel - antsLost)
      this.trapsEncountered += 1

      console.log(`Encountered a trap! Lost ${antsLost} ants.`)
    },

    // Handler for loot event (finding rare items)
    handleLootEvent(depthMultiplier, antMultiplier) {
      const lootValue = Math.floor((Math.random() * 100 + 50) * depthMultiplier * antMultiplier)
      const loot = {name: 'Rare Artifact', value: lootValue}

      this.lootFound.push(loot)
      console.log(`Found loot: ${loot.name} worth ${loot.value}!`)
    },

    // Function to calculate the chance of encountering a trap based on depth
    getTrapChance() {
      return Math.min(0.15 + this.tunnelDepth * 0.01, 0.5) // Max at 50% trap chance
    },


    // Reset tunnel data
    resetTunnel() {
      this.antsInTunnel = 0
      this.initialAntsInTunnel = 0 // Reset the initial ants as well
      this.tunnelDepth = 0
      this.tunnelProgress = 0
      this.resourcesFound = {seeds: 0, mineralShards: 0}
      this.trapsEncountered = 0
      this.lootFound = []
      this.autoTunnelActive = false
      cancelAnimationFrame(this.animationFrameId)
      console.log('Tunnel progress reset.')
    },
  },
})
