<template>
  <div class="grid grid-cols-1 gap-4 p-4 max-h-half-screen overflow-y-auto">
    <!-- Seeds Section -->
    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <div>
        <p class="font-bold text-lg">
          Seeds
        </p>
        <p class="text-2xs">
          You have a species of ants that collect seeds.
        </p>
      </div>

      <div class="flex flex-wrap items-start justify-between w-full space-y-2 md:space-y-0">
        <!-- Left Column: Seed Count and Upgrade -->
        <div class="flex flex-col gap-2 w-full md:w-auto">
          <p class="text-sm">
            Count: {{ formatNumber(gameStore.seeds) }}/{{ formatNumber(gameStore.maxSeeds) }}
            ({{ formatNumber(gameStore.seedsPerSecond) }} /s)
          </p>
          <button
            :disabled="gameStore.seeds < gameStore.seedStorageUpgradeCost"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.upgradeSeedStorage"
          >
            Upgrade storage ({{ formatNumber(gameStore.seedStorageUpgradeCost) }} seeds)
          </button>
          <p
            v-if="gameStore.maxSeeds < gameStore.seedStorageUpgradeCost"
            class="text-xs"
          >
            If only there was a way to increase your seed storage...
          </p>
        </div>

        <!-- Right Column: Collect Button -->
        <div class="w-full md:w-auto md:ml-4">
          <button
            class="bg-yellow-500 hover:bg-yellow-600 text-white w-full md:w-auto px-3 py-1 rounded shadow text-xs"
            @click="gameStore.collectSeedsManually"
          >
            Collect 🌱
          </button>
        </div>
      </div>
    </div>

    <!-- Larvae Section -->
    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <div>
        <p class="font-bold text-lg">
          Larvae
        </p>
        <p class="text-2xs">
          Larvae are the main resource used to create ants.
        </p>
      </div>

      <div class="flex flex-wrap items-start justify-between w-full space-y-2 md:space-y-0">
        <div class="flex flex-col gap-2 w-full md:w-auto">
          <p class="text-sm">
            Count: {{ formatNumber(gameStore.larvae) }}/{{ formatNumber(gameStore.maxLarvae) }}
            ({{ formatNumber(gameStore.larvaePerMinute) }} /min)
          </p>
          <button
            :disabled="gameStore.seeds < gameStore.larvaeStorageUpgradeCost"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.upgradeLarvaeStorage"
          >
            Upgrade storage ({{ formatNumber(gameStore.larvaeStorageUpgradeCost) }} seeds)
          </button>
          <p
            v-if="gameStore.maxSeeds < gameStore.larvaeStorageUpgradeCost"
            class="text-xs"
          >
            If only there was a way to increase your seed storage...
          </p>
        </div>
        <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
          <button
            :disabled="gameStore.seeds < gameStore.seedCostPerLarva"
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createLarvae"
          >
            Create Larvae ({{ formatNumber(gameStore.seedCostPerLarva) }} seeds)
          </button>
          <button
            :disabled="gameStore.seeds < gameStore.seedCostPerLarva"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createMaxLarvae"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- Ant Section -->
    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <div>
        <p class="font-bold text-lg">
          Ants
        </p>
        <p class="text-2xs">
          Ants collect seeds and fight bugs.
        </p>
      </div>
      <div class="flex flex-wrap items-start justify-between w-full space-y-2 md:space-y-0">
        <div class="flex flex-col gap-2 w-full md:w-auto">
          <p class="text-sm">
            Count: {{ formatNumber(gameStore.ants) }}
          </p>
        </div>
        <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
          <button
            :disabled="gameStore.larvae < 1 || gameStore.seeds < 50"
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.createAnts"
          >
            Create Ant ({{ formatNumber(gameStore.seedCostPerAnt) }} seeds, {{
              formatNumber(gameStore.larvaCostPerAnt)
            }} larvae)
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
    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <div>
        <p class="font-bold text-lg">
          Queens
        </p>
        <p class="text-2xs">
          Queens are the main producers of larvae.
        </p>
      </div>
      <div class="flex flex-wrap items-start justify-between w-full space-y-2 md:space-y-0">
        <div class="flex flex-col gap-2 w-full md:w-auto">
          <p class="text-sm">
            Count: {{ formatNumber(gameStore.queens) }}
          </p>
        </div>
        <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
          <button
            :disabled="gameStore.ants < 100 || gameStore.seeds < 250"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.buyQueen"
          >
            Buy Queen 👑 ({{ formatNumber(gameStore.seedCostPerQueen) }} seeds,
            {{ formatNumber(gameStore.antCostPerQueen) }} ants)
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

    <!-- Prestige Section -->
    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <p class="font-bold text-lg">
        Prestige
      </p>
      <div class="flex items-center justify-between w-full">
        <p>Prestige Points: {{ formatNumber(gameStore.prestigePoints) }}</p>
        <button
          :disabled="gameStore.calculatePrestigePoints() < 1"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="gameStore.prestige"
        >
          Prestige for {{ formatNumber(gameStore.calculatePrestigePoints()) }} Points
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
              Buy for {{ formatNumber(upgrade.cost) }} Points
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
