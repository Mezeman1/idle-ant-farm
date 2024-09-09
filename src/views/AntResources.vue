<template>
  <div>
    <p class="text-2xs font-bold">
      Please note, this game is in early development and may have bugs or balance issues.
      <br>
      I will be adding more features and balancing the game over time.
      <br>
      Also, any progress made may be reset at any time.
    </p>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 p-4">
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

        <div class="flex flex-wrap items-start justify-between w-full space-y-2 ">
          <!-- Left Column: Seed Count and Upgrade -->
          <div class="flex flex-col gap-2 w-full">
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
          <div class="w-full">
            <button
              class="bg-yellow-500 hover:bg-yellow-600 text-white w-full px-3 py-1 rounded shadow text-xs select-none"
              @mousedown="startCollectingSeeds"
              @mouseup="stopCollectingSeeds"
              @mouseleave="stopCollectingSeeds"
              @touchstart="startCollectingSeeds"
              @touchend="stopCollectingSeeds"
              @contextmenu.prevent
            >
              Collect 🌱
            </button>
            <p>
              Hold to collect seeds faster.
            </p>
          </div>
        </div>
      </div>

      <!-- Larvae Section -->
      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <div class="flex items-center">
          <div>
            <p class="font-bold text-lg">
              Larvae
            </p>
            <p class="text-2xs">
              Larvae are the main resource used to create ants.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
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
          <div class="w-full flex gap-2">
            <button
              :disabled="gameStore.seeds < gameStore.seedCostPerLarva"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createLarvae"
            >
              Create Larvae ({{ formatNumber(gameStore.seedCostPerLarva) }} seeds)
            </button>
            <button
              :disabled="gameStore.seeds < gameStore.seedCostPerLarva"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createMaxLarvae"
            >
              Max
            </button>
          </div>

          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoLarvae')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto creating</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoLarvaeCreation"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoLarvaeCreation,
                    'bg-red-500': !prestigeStore.autoLarvaeCreation
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoLarvaeCreation,
                    'translate-x-0': !prestigeStore.autoLarvaeCreation
                  }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                />
              </div>
            </label>
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
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(gameStore.ants) }}/{{ formatNumber(gameStore.maxAnts) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="gameStore.larvae < 1 || gameStore.seeds < 50"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createAnts"
            >
              Create Ant <br>({{ formatNumber(gameStore.seedCostPerAnt) }} seeds, {{
                formatNumber(gameStore.larvaCostPerAnt)
              }} larvae)
            </button>
            <button
              :disabled="gameStore.larvae < 1 || gameStore.seeds < 50"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createMaxAnts"
            >
              Max
            </button>
          </div>
          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoAnts')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto creating</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoAntCreation"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoAntCreation,
                    'bg-red-500': !prestigeStore.autoAntCreation
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoAntCreation,
                    'translate-x-0': !prestigeStore.autoAntCreation
                  }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                />
              </div>
            </label>
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
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full ">
            <p class="text-sm">
              Count: {{ formatNumber(gameStore.queens) }}/{{ formatNumber(gameStore.maxQueens) }}
            </p>
          </div>
          <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
            <button
              :disabled="gameStore.ants < 100 || gameStore.seeds < 250"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.buyQueen"
            >
              Buy Queen 👑 ({{ formatNumber(gameStore.seedCostPerQueen) }} seeds,
              {{ formatNumber(gameStore.antCostPerQueen) }} ants)
            </button>
            <button
              :disabled="gameStore.ants < 100 || gameStore.seeds < 250"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.buyMaxQueens"
            >
              Max
            </button>
          </div>

          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoQueens')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto creating</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoQueenCreation"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoQueenCreation,
                    'bg-red-500': !prestigeStore.autoQueenCreation
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoQueenCreation,
                    'translate-x-0': !prestigeStore.autoQueenCreation
                  }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Prestige Section -->
      <PrestigeShop />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {ref} from 'vue'
import Modal from '../components/Modal.vue'
import PrestigeShop from './PrestigeShop.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'

const gameStore = useGameStore()
const prestigeStore = usePrestigeStore()

// Format numbers using the store's function
const formatNumber = gameStore.formatNumber

let collectingInterval: number | undefined = undefined

const startCollectingSeeds = () => {
  console.log('Start collecting seeds')
  gameStore.collectSeedsManually() // Initial collection on click

  // Start an interval for collecting seeds every 100ms while holding down
  collectingInterval = setInterval(() => {
    gameStore.collectSeedsManually()
  }, 50)
}

const stopCollectingSeeds = () => {
  // Clear the interval when the mouse is released or leaves the button
  if (collectingInterval) {
    clearInterval(collectingInterval)
    collectingInterval = undefined
  }
}

</script>

<style scoped>

</style>
