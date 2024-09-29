<template>
  <div class="p-6 bg-gray-900 text-white rounded-lg shadow-lg space-y-8 flex flex-col h-full overflow-y-auto">
    <!-- Title and Tunnel Info -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-yellow-400 mb-2">
        Ant Tunnel Exploration
      </h1>
      <p class="text-sm text-gray-300">
        Send your ants deep into the tunnels to discover resources, loot, and dangers!
      </p>
    </div>

    <!-- Ants sent and progress section -->
    <div class="flex flex-col items-center justify-between space-y-4 md:space-y-0 md:space-x-8">
      <div class="flex items-center space-x-4">
        <p class="text-base font-semibold text-yellow-400">
          Ants in Tunnels: <strong>{{ formatNumber(antsInTunnel, 0) }}</strong>
        </p>
        <button
          v-if="antsInTunnel > 0"
          class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md text-sm font-medium transition"
          @click="stopTunnelExploration"
        >
          Stop Exploration
        </button>
      </div>

      <div class="w-full md:w-1/2">
        <div class="relative w-full bg-gray-700 rounded-full h-4 shadow-inner">
          <div
            class="absolute top-0 left-0 bg-green-500 h-full rounded-full"
            :style="{ width: (progressToNextDepth * 100) + '%' }"
          />
        </div>
        <p class="text-sm text-gray-300 mt-2 text-center md:text-left">
          Depth: <span class="font-semibold text-green-400">{{ tunnelDepth }}</span>
        </p>
      </div>
    </div>

    <!-- Slider for selecting ants to send -->
    <div class="flex flex-col items-center space-y-4">
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
        class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        :disabled="antsInTunnel > 0"
      >
      <p class="text-sm text-gray-300">
        Ants to send: <strong class="text-yellow-400">{{ formatNumber(selectedAnts, 0) }}</strong>
      </p>
    </div>

    <!-- Send button -->
    <div class="flex justify-center">
      <button
        class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-md shadow-md font-medium transition disabled:bg-gray-500 disabled:cursor-not-allowed"
        :disabled="selectedAnts > availableAnts || antsInTunnel > 0"
        @click="startTunnelExploration(selectedAnts)"
      >
        Start Digging
      </button>
    </div>

    <!-- Events section -->
    <div class="space-y-4 flex-grow overflow-auto">
      <h2 class="text-xl font-bold text-yellow-400">
        Events
      </h2>
      <p
        v-if="antsInTunnel <= 0"
        class="text-sm text-gray-400"
      >
        No ants in tunnels. Start exploration to find resources and face traps.
      </p>
      <div class="max-h-40 overflow-y-auto bg-gray-800 bg-opacity-50 rounded-lg p-4 space-y-2">
        <ul class="space-y-2">
          <li
            v-if="resourcesFound.queens > 0"
            class="text-sm text-yellow-400 flex items-center"
          >
            <i class="fa-solid fa-crown text-yellow-400 mr-2" />
            Found {{ formatNumber(resourcesFound.queens) }} queens
          </li>
          <li
            v-if="resourcesFound.seeds > 0"
            class="text-sm text-green-400 flex items-center"
          >
            <i class="fa-solid fa-seedling text-green-400 mr-2" />
            Found {{ formatNumber(resourcesFound.seeds) }} seeds
          </li>
          <li
            v-if="resourcesFound.mineralShards > 0"
            class="text-sm text-blue-400 flex items-center"
          >
            <i class="fa-solid fa-gem text-blue-400 mr-2" />
            Found {{ formatNumber(resourcesFound.mineralShards) }} mineral shards
          </li>
          <li
            v-if="trapsEncountered > 0"
            class="text-sm text-red-400 flex items-center"
          >
            <i class="fa-solid fa-exclamation-triangle text-red-400 mr-2" />
            Encountered {{ trapsEncountered }} traps
          </li>
          <li
            v-for="(loot, index) in lootFound"
            :key="index"
            class="text-sm text-purple-400 flex items-center"
          >
            <i class="fa-solid fa-box-open text-purple-400 mr-2" />
            Found loot: {{ loot.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tunnel Upgrades Section -->
    <div class="space-y-6">
      <h2 class="text-xl font-bold text-yellow-400">
        Tunnel Upgrades
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="upgrade in tunnelUpgrades"
          :key="upgrade.id"
          class="bg-gray-800 rounded-lg p-6 shadow-md flex flex-col justify-between"
        >
          <div>
            <h3 class="text-lg font-semibold text-yellow-400 mb-2">
              {{ upgrade.name }}
            </h3>
            <p class="text-sm text-gray-300">
              {{ upgrade.description }}
            </p>
          </div>
          <div class="mt-4">
            <p class="text-sm text-blue-400">
              Cost: {{ formatNumber(upgrade.cost) }} Mineral Shards
            </p>
            <button
              v-if="!isUpgradeMaxed(upgrade.id)"
              class="mt-2 w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-medium transition disabled:bg-gray-500 disabled:cursor-not-allowed"
              :disabled="resourcesStore.resources.mineralShards < upgrade.cost"
              @click="purchaseUpgrade(upgrade.id)"
            >
              Buy Upgrade
            </button>
            <span
              v-else
              class="text-red-500 text-sm font-semibold"
            >
              Maxed Out
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTunnelStore } from '@/stores/tunnelStore'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useResourcesStore } from '@/stores/resourcesStore'

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

const {
  startTunnelExploration,
  stopTunnelExploration,
  purchaseUpgrade,
  isUpgradeMaxed,
} = tunnelStore

// Slider for selecting ants to send
const selectedAnts = ref(10)
const availableAnts = computed(() => tunnelStore.getAvailableAnts)// Ensure this is a function returning a value
const getSteps = computed(() => (availableAnts.value > 100 ? 10 : 1))
</script>
