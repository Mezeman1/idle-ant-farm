import { defineStore } from 'pinia'
import { useGameStore } from '@/stores/gameStore'

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

      this.antsInTunnel = antsToSend
      this.initialAntsInTunnel = antsToSend // Store the starting number of ants

    // **New Calculation**: Linear-Logarithmic scaling for initial depth
      const linearFactor = this.initialAntsInTunnel * 0.00001 // Linear boost for every ant sent
      const logFactor = Math.log10(this.initialAntsInTunnel + 10) // Logarithmic component to maintain balance
      this.depthBoost = linearFactor + logFactor // Combine linear and log scaling
      this.tunnelDepth = 0
      this.tunnelProgress = 0
      this.autoTunnelActive = true // Set auto mode

      this.runTunnelLoop(performance.now()) // Start the loop
    },

    // Main tunnel loop to run exploration and events
    runTunnelLoop(timestamp: number) {
      if (this.antsInTunnel <= 0 || !this.autoTunnelActive) return

      // Process ants in batches for better performance
      const batchSize = Math.max(10, Math.min(1000, this.antsInTunnel)) // Process at least 10 ants or up to 1000
      const progressGain = Math.log(batchSize) * 0.2 * this.tunnelSpeedMultiplier // Logarithmic scaling for progress
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
        this.animationFrameId = requestAnimationFrame(this.runTunnelLoop)
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
      console.log('Tunnel exploration stopped.')
    },

    // Handle random events (resources, traps, loot)
    triggerTunnelEvent() {
      const eventChance = Math.random()

      // Adjust depth multiplier to scale logarithmically for better control at higher depths
      const depthMultiplier = Math.log2(this.tunnelDepth + 2) // Logarithmic scaling: log2(depth + 2)

      // Scale event rewards based on the initial number of ants sent
      const antMultiplier = Math.pow(this.initialAntsInTunnel, 0.25) // Use a 0.25 power scale for rewards and event intensity

      // Trap chance scaling slower, maxing at 50% but taking more depth to reach there
      const trapChance = Math.min(0.2 + this.tunnelDepth * 0.01, 0.5) // Max out at 0.5 but slower scaling per depth

      if (eventChance < 0.3) {
        // Find resources (seeds or mineral shards)
        const seedsFound = Math.floor((Math.random() * 50 + 10) * depthMultiplier * antMultiplier)
        const shardsFound = Math.floor((Math.random() * 5 + 1) * depthMultiplier * antMultiplier)

        this.resourcesFound.seeds += seedsFound
        this.resourcesFound.mineralShards += shardsFound
      } else if (eventChance < trapChance) {
        if (this.tunnelDepth < this.depthBoost) return // Prevent traps at the start (linear boost)

        // Calculate percentage loss based on depth
        const baseLossPercentage = 0.05 // Base 5% loss
        const maxLossPercentage = 0.3 // Max 30% loss at very deep levels
        const depthFactor = Math.log2(this.tunnelDepth + 2) / 10 // Scale the depth factor logarithmically
        const percentageLost = Math.min(baseLossPercentage + depthFactor, maxLossPercentage) // Ensure it doesn’t exceed max loss

        const antsLost = Math.floor(this.initialAntsInTunnel * percentageLost)

        this.antsInTunnel = Math.max(0, this.antsInTunnel - antsLost)
        this.trapsEncountered += 1
      } else {
        // Find better loot in deeper tunnels, loot value scaling with depth and ant group size
        const lootValue = Math.floor((Math.random() * 100 + 50) * depthMultiplier * antMultiplier)
        const loot = { name: 'Rare Artifact', value: lootValue }

        this.lootFound.push(loot)
      }
    },

    // Reset tunnel data
    resetTunnel() {
      this.antsInTunnel = 0
      this.initialAntsInTunnel = 0 // Reset the initial ants as well
      this.tunnelDepth = 0
      this.tunnelProgress = 0
      this.resourcesFound = { seeds: 0, mineralShards: 0 }
      this.trapsEncountered = 0
      this.lootFound = []
      this.autoTunnelActive = false
      cancelAnimationFrame(this.animationFrameId)
      console.log('Tunnel progress reset.')
    },
  },
})
