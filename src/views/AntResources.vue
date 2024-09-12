<template>
  <div>
    <p class="text-2xs font-bold">
      Please note, this game is in early development and may have bugs or balance issues.
      <br>
      I will be adding more features and balancing the game over time.
      <br>
      Also, any progress made may be reset at any time during current development stage.
    </p>
    <p class="text-2xs font-bold text-red-500">
      Data before the 12th of September 2024 has been reset. Sorry for the inconvenience.
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
              Hold to collect 🌱
            </button>
          </div>

          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoSeedStorageUpgrade')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto upgrade storage</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoSeedStorageUpgrade"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoSeedStorageUpgrade,
                    'bg-red-500': !prestigeStore.autoSeedStorageUpgrade
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoSeedStorageUpgrade,
                    'translate-x-0': !prestigeStore.autoSeedStorageUpgrade,
                  }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                />
              </div>
            </label>
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
              Count: {{ formatNumber(gameStore.larvae, 0) }}/{{ formatNumber(gameStore.maxLarvae, 0) }}
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

          <!--          Hidden to try out the removal of this feature. -->
          <div
            v-if="false"
            class="w-full flex"
          >
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
              Count: {{ formatNumber(gameStore.ants, 0) }}/{{ formatNumber(gameStore.maxAnts, 0) }}
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

      <!-- Elite Ant Section -->
      <div
        v-if="gameStore.eliteAntsUnlocked"
        class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2"
      >
        <div>
          <p class="font-bold text-lg">
            Elite Ants
          </p>
          <p class="text-2xs">
            Elite Ants help the ants to collect resources faster.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(gameStore.eliteAnts, 0) }}/{{ formatNumber(gameStore.maxEliteAnts, 0) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="gameStore.larvae < gameStore.larvaCostPerEliteAnt || gameStore.seeds < gameStore.seedCostPerEliteAnt"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createEliteAnts"
            >
              Create Ant <br>({{ formatNumber(gameStore.seedCostPerEliteAnt) }} seeds, {{
                formatNumber(gameStore.larvaCostPerEliteAnt)
              }} larvae)
            </button>
            <button
              :disabled="gameStore.larvae < gameStore.larvaCostPerEliteAnt || gameStore.seeds < gameStore.seedCostPerEliteAnt"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createEliteMaxAnts()"
            >
              Max
            </button>
          </div>
        </div>
      </div>
      <div
        v-else
        v-tooltip="'Maybe it has something to do with how many times we\'ve prestiged?'"
        class="bg-gray-300 bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col justify-center items-center select-none"
      >
        <h2>
          LOCKED
        </h2>
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
              Count: {{ formatNumber(gameStore.queens, 0) }}/{{ formatNumber(gameStore.maxQueens, 0) }}
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

      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <h2>Found an issue or have a suggestion?</h2>
        <p>
          Please report it on the <a
            href="https://github.com/Mezeman1/idle-ant-farm/issues/new"
            target="_blank"
            class="text-blue-500"
          >GitHub issues page</a>.
        </p>
      </div>

      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <h2>Want to help support the game?</h2>
        <p>
          Consider <a
            href="https://buymeacoffee.com/idleantfarm"
            target="_blank"
            class="text-blue-500"
          >buying me a coffee</a> ☕️.
        </p>
      </div>
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
const collectingIntervalTime = 25

const startCollectingSeeds = () => {
  console.log('Start collecting seeds')
  gameStore.collectSeedsManually() // Initial collection on click

  // Start an interval for collecting seeds every 100ms while holding down
  collectingInterval = setInterval(() => {
    gameStore.collectSeedsManually()
  }, collectingIntervalTime)
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
