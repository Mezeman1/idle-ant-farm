<template>
  <div class="p-6 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg shadow-lg space-y-6 flex flex-col overflow-y-auto">
    <!-- Title and Tunnel Info -->
    <div class="text-center">
      <h1 class="text-2xl font-bold text-yellow-300 mb-1">
        Ant Tunnel Exploration
      </h1>
      <p class="text-sm text-gray-300">
        Send your ants deep into the tunnels to discover resources, loot, and dangers!
      </p>
    </div>

    <!-- Ants sent and progress section -->
    <div class="flex flex-col items-center space-y-4">
      <div class="flex items-center space-x-4">
        <p class="text-base font-semibold text-yellow-400">
          Ants in Tunnels: <strong>{{ formatNumber(antsInTunnel, 0) }}</strong>
        </p>
        <button
          v-if="antsInTunnel > 0"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300"
          @click="stopTunnelExploration"
        >
          Stop Exploration
        </button>
      </div>

      <div class="relative w-full bg-gray-700 rounded-full h-4 shadow-inner">
        <div
          class="absolute top-0 left-0 bg-green-500 h-full rounded-full"
          :style="{ width: (progressToNextDepth * 100) + '%' }"
        />
      </div>
      <p class="text-sm text-gray-300">
        Depth: <span class="font-semibold text-green-400">{{ tunnelDepth }}</span>
      </p>
    </div>

    <!-- Slider for selecting ants to send -->
    <div class="flex flex-col items-center space-y-2">
      <label
        for="ants-slider"
        class="text-base font-semibold text-gray-300"
      >Select the number of ants to send:</label>
      <input
        id="ants-slider"
        v-model="selectedAnts"
        type="range"
        :min="10"
        :max="availableAnts"
        :step="getSteps"
        class="w-full slider"
        :disabled="antsInTunnel > 0"
      >
      <p class="text-sm text-gray-300">
        Ants to send: <strong class="text-yellow-400">{{ formatNumber(selectedAnts, 0) }}</strong>
      </p>
    </div>


    <!-- Send button -->
    <div class="flex justify-center">
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md font-medium transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        :disabled="selectedAnts > availableAnts"
        @click="startTunnelExploration(selectedAnts)"
      >
        Start Digging
      </button>
    </div>

    <!-- Events section with scrollable box -->
    <div class="space-y-2">
      <h2 class="text-lg font-bold text-yellow-400">
        Events
      </h2>
      <p
        v-if="antsInTunnel <= 0"
        class="text-xs text-gray-400"
      >
        No ants in tunnels. Start exploration to find resources and face traps.
      </p>
      <div class="max-h-40 overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-3 space-y-2">
        <ul class="list-disc list-inside text-sm text-gray-300">
          <li
            v-if="resourcesFound.queens > 0"
            class="text-yellow-400"
          >
            Found {{ formatNumber(resourcesFound.queens) }} queens
          </li>
          <li
            v-if="resourcesFound.seeds > 0"
            class="text-green-400"
          >
            Found {{ formatNumber(resourcesFound.seeds) }} seeds
          </li>
          <li
            v-if="resourcesFound.mineralShards > 0"
            class="text-blue-400"
          >
            Found {{ formatNumber(resourcesFound.mineralShards) }} mineral shards
          </li>
          <li
            v-if="trapsEncountered > 0"
            class="text-red-400"
          >
            Encountered {{ trapsEncountered }} traps
          </li>
          <li
            v-for="(loot, index) in lootFound"
            :key="index"
            class="text-purple-400"
          >
            Found loot: {{ loot.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-bold text-yellow-400">
        Tunnel Upgrades
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="upgrade in tunnelUpgrades"
          :key="upgrade.id"
          class="bg-gray-800 rounded-lg p-4 shadow"
        >
          <h3 class="text-lg font-semibold text-yellow-400">
            {{ upgrade.name }}
          </h3>
          <p class="text-sm text-gray-300">
            {{ upgrade.description }}
          </p>
          <p class="text-sm text-blue-400">
            Cost: {{ formatNumber(upgrade.cost) }} Mineral Shards
          </p>
          <button
            v-if="upgrade.maxPurchases && tunnelStore.amountOfUpgrades(upgrade.id) >= upgrade.maxPurchases === false || !upgrade.maxPurchases"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="resourcesStore.resources.mineralShards < upgrade.cost"
            @click="purchaseUpgrade(upgrade.id)"
          >
            Buy Upgrade
          </button>
          <span
            v-if="upgrade.maxPurchases && tunnelStore.amountOfUpgrades(upgrade.id) >= upgrade.maxPurchases"
            class="text-red-500 text-sm"
          >
            Maxed
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTunnelStore} from '@/stores/tunnelStore'
import {storeToRefs} from 'pinia'
import {computed, ref} from 'vue'
import {useGameStore} from '@/stores/gameStore'
import {useResourcesStore} from '@/stores/resourcesStore'

const tunnelStore = useTunnelStore()
const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber
const resourcesStore = useResourcesStore()

// Destructure state and actions
const {
  antsInTunnel,
  tunnelDepth,
  progressToNextDepth,
  resourcesFound,
  trapsEncountered,
  lootFound,
  tunnelUpgrades,
} = storeToRefs(tunnelStore)

const {startTunnelExploration, stopTunnelExploration, purchaseUpgrade} = tunnelStore

// Slider for selecting ants to send
const selectedAnts = ref(10)
const availableAnts = computed(() => tunnelStore.getAvailableAnts) // Assume there's a method that returns available ants
const getSteps = computed(() => (availableAnts.value > 100 ? 10 : 1))
</script>

<style scoped>
/* Add slider styling */
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 8px;
  background: #374151;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #2563eb;
  cursor: pointer;
}
</style>
