<template>
  <div class="grid grid-cols-1 gap-4 p-4 max-h-half-screen overflow-y-auto">
    <!-- Seeds Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-start space-y-2">
      <p class="font-bold text-lg">
        Seeds
      </p>
      <div class="flex items-center justify-between w-full">
        <p class="text-sm">
          Count: {{ formatNumber(gameStore.seeds) }} ({{ formatNumber(gameStore.seedsPerSecond) }} /s)
        </p>
        <button
          class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow text-xs"
          @click="gameStore.collectSeedsManually"
        >
          🌱 Collect
        </button>
      </div>
    </div>

    <!-- Larvae Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-start space-y-2">
      <p class="font-bold text-lg">
        Larvae
      </p>
      <div class="flex items-center justify-between w-full">
        <p class="text-sm">
          Count: {{ formatNumber(gameStore.larvae) }} ({{ formatNumber(gameStore.larvaePerMinute) }} /min)
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="gameStore.seeds < 10"
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createLarvae"
          >
            ➕ Create
          </button>
          <button
            :disabled="gameStore.seeds < 10"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createMaxLarvae"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- Ant Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-start space-y-2">
      <p class="font-bold text-lg">
        Ants
      </p>
      <div class="flex items-center justify-between w-full">
        <p class="text-sm">
          Count: {{ formatNumber(gameStore.ants) }}
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="gameStore.larvae < 1 || gameStore.seeds < 50"
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createAnts"
          >
            ➕ Create
          </button>
          <button
            :disabled="gameStore.larvae < 1 || gameStore.seeds < 50"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createMaxAnts"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- Queen Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col items-start space-y-2">
      <p class="font-bold text-lg">
        Queens
      </p>
      <div class="flex items-center justify-between w-full">
        <p class="text-sm">
          Count: {{ formatNumber(gameStore.queens) }}
        </p>
        <div class="flex space-x-2">
          <button
            :disabled="gameStore.ants < 100 || gameStore.seeds < 250"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.buyQueen"
          >
            👑 Buy
          </button>
          <button
            :disabled="gameStore.ants < 100 || gameStore.seeds < 250"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.buyMaxQueens"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- Storage Upgrade Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <p class="font-bold text-lg">
        Storage
      </p>
      <div class="flex items-center justify-between w-full">
        <p>Max Seeds: {{ gameStore.maxSeeds }}</p>
        <button
          :disabled="gameStore.seeds < gameStore.seedStorageUpgradeCost"
          class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
          @click="gameStore.upgradeSeedStorage"
        >
          Upgrade ({{ formatNumber(gameStore.seedStorageUpgradeCost) }} seeds)
        </button>
      </div>
      <div class="flex items-center justify-between w-full">
        <p>Max Larvae: {{ gameStore.maxLarvae }}</p>
        <button
          :disabled="gameStore.seeds < gameStore.larvaeStorageUpgradeCost"
          class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
          @click="gameStore.upgradeLarvaeStorage"
        >
          Upgrade ({{ formatNumber(gameStore.larvaeStorageUpgradeCost) }} seeds)
        </button>
      </div>
    </div>

    <!-- Prestige Section -->
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <p class="font-bold text-lg">
        Prestige
      </p>
      <div class="flex items-center justify-between w-full">
        <p>Prestige Points: {{ gameStore.prestigePoints }}</p>
        <button
          :disabled="gameStore.calculatePrestigePoints() < 1"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="gameStore.prestige"
        >
          Prestige for {{ gameStore.calculatePrestigePoints() }} Points
        </button>
      </div>
      <div class="prestige-shop">
        <ul class="space-y-2">
          <li
            v-for="upgrade in gameStore.prestigeShop"
            :key="upgrade.id"
            class="flex items-center justify-between"
          >
            <div>
              <p>{{ upgrade.name }}</p>
              <p class="text-xs text-gray-500">
                {{ upgrade.description }}
              </p>
            </div>
            <button
              :disabled="gameStore.prestigePoints < upgrade.cost"
              class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
              @click="gameStore.buyUpgrade(upgrade.id)"
            >
              Buy for {{ upgrade.cost }} Points
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'

const gameStore = useGameStore()

// Format numbers using the store's function
const formatNumber = gameStore.formatNumber
</script>

<style scoped>

</style>
