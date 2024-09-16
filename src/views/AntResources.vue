<template>
  <div>
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
              Count: {{ formatNumber(gameStore.resources.seeds) }}/{{ formatNumber(gameStore.storage.maxSeeds) }}
              ({{ formatNumber(gameStore.seedsPerSecond) }} /s)
            </p>
            <StorageButtons
              :cost-string="seedStorageCostString"
              :disabled="gameStore.resources.seeds < gameStore.upgradeCosts.seedStorageUpgradeCost"
              @upgrade="gameStore.upgradeSeedStorage"
              @upgradeMax="gameStore.upgradeMaxSeedStorage"
            />
            <p
              v-if="gameStore.storage.maxSeeds < gameStore.upgradeCosts.seedStorageUpgradeCost"
              class="text-xs"
            >
              If only there was a way to increase your seed storage...
            </p>
          </div>

          <!-- Right Column: Collect Button -->
          <div class="w-full">
            <button
              :disabled="seedCollectingDisabled"
              class="bg-yellow-500 hover:bg-yellow-600 text-white w-full px-3 py-1 rounded shadow text-xs select-none disabled:bg-gray-400 disabled:cursor-not-allowed"
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
              Count: {{ formatNumber(gameStore.resources.larvae, 0) }}/{{
                formatNumber(gameStore.storage.maxLarvae, 0)
              }}
              ({{ formatNumber(gameStore.larvaePerMinute) }} /min)
            </p>
            <StorageButtons
              :cost-string="larvaeStorageCostString"
              :disabled="gameStore.resources.seeds < gameStore.upgradeCosts.larvaeStorageUpgradeCost"
              @upgrade="gameStore.upgradeLarvaeStorage"
              @upgradeMax="gameStore.upgradeMaxLarvaeStorage"
            />
            <p
              v-if="gameStore.storage.maxSeeds < gameStore.upgradeCosts.larvaeStorageUpgradeCost"
              class="text-xs"
            >
              If only there was a way to increase your seed storage...
            </p>
          </div>

          <div class="w-full flex gap-2">
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createLarvae"
            >
              Create Larvae ({{ formatNumber(gameStore.resourceCosts.seedCostPerLarva) }} seeds)
            </button>
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createMaxLarvae"
            >
              Max
            </button>
          </div>
          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoLarvaeStorageUpgrade')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto upgrade storage</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoLarvaeStorageUpgrade"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoLarvaeStorageUpgrade,
                    'bg-red-500': !prestigeStore.autoLarvaeStorageUpgrade
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoLarvaeStorageUpgrade,
                    'translate-x-0': !prestigeStore.autoLarvaeStorageUpgrade,
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
              Count: {{ formatNumber(gameStore.resources.ants, 0) }}/{{ formatNumber(gameStore.maxAnts, 0) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              :disabled="gameStore.resources.seeds < gameStore.seedCostPerAntHousing"
              @click="gameStore.createAntHousing"
            >
              Create housing ({{ formatNumber(gameStore.seedCostPerAntHousing) }} seeds)
            </button>
            <button
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              :disabled="gameStore.resources.seeds < gameStore.seedCostPerAntHousing"
              @click="gameStore.createMaxAntHousing"
            >
              Max
            </button>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="createAntDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createAnts"
            >
              Create Ant <br>({{ formatNumber(gameStore.resourceCosts.seedCostPerAnt) }} seeds, {{
                formatNumber(gameStore.resourceCosts.larvaCostPerAnt)
              }} larvae)
            </button>
            <button
              :disabled="createAntDisabled"
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
              <span class="mr-3 text-xs text-gray-600">Auto create ants</span>
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
          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoCreateHousing')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto create housing</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoCreateHousing"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoCreateHousing,
                    'bg-red-500': !prestigeStore.autoCreateHousing
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoCreateHousing,
                    'translate-x-0': !prestigeStore.autoCreateHousing,
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
              Count: {{
                formatNumber(gameStore.resources.eliteAnts, 0)
              }}/{{ formatNumber(gameStore.storage.maxEliteAnts, 0) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createEliteAnts"
            >
              Create Ant <br>({{ formatNumber(gameStore.resourceCosts.seedCostPerEliteAnt) }} seeds, {{
                formatNumber(gameStore.resourceCosts.larvaCostPerEliteAnt)
              }} larvae)
            </button>
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.createEliteMaxAnts()"
            >
              Max
            </button>
          </div>
          <div class="w-full flex">
            <label
              v-if="prestigeStore.upgradePurchased('autoEliteAntsCreation')"
              class="flex items-center cursor-pointer"
            >
              <span class="mr-3 text-xs text-gray-600">Auto creating</span>
              <div class="relative">
                <input
                  v-model="prestigeStore.autoEliteAntsCreation"
                  type="checkbox"
                  class="sr-only"
                >
                <div
                  :class="{
                    'bg-green-500': prestigeStore.autoEliteAntsCreation,
                    'bg-red-500': !prestigeStore.autoEliteAntsCreation,
                  }"
                  class="block w-10 h-6 rounded-full shadow-inner transition-colors"
                />
                <div
                  :class="{
                    'translate-x-full': prestigeStore.autoEliteAntsCreation,
                    'translate-x-0': !prestigeStore.autoEliteAntsCreation,
                  }"
                  class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
                />
              </div>
            </label>
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
              Count: {{ formatNumber(gameStore.resources.queens, 0) }}/{{
                formatNumber(gameStore.storage.maxQueens, 0)
              }}
            </p>
          </div>
          <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
            <button
              :disabled="createQueenDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="gameStore.buyQueen"
            >
              Buy Queen 👑 ({{ formatNumber(gameStore.resourceCosts.seedCostPerQueen) }} seeds,
              {{ formatNumber(gameStore.resourceCosts.antCostPerQueen) }} ants)
            </button>
            <button
              :disabled="createQueenDisabled"
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

      <!-- Royal Jelly Section -->
      <div
        v-if="gameStore.royalJellyUnlocked"
        class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2"
      >
        <div>
          <p class="font-bold text-lg">
            Royal Jelly
          </p>
          <p class="text-2xs">
            Royal Jelly is a special resource used to upgrade ants.
            <br>
            These ants are more efficient at collecting resources.
            <br>
            These ants do not reset on prestige.
          </p>
          <p class="text-2xs">
            Queens have a chance to produce Royal Jelly.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(gameStore.resources.royalJelly ?? 0, 0) }}
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <button
            :disabled="gameStore.resources.royalJelly < 1"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="gameStore.upgradeAnt"
          >
            Upgrade Ant
          </button>
          <span>
            You currently have {{ formatNumber(gameStore.resources.royalJellyAnts ?? 0, 0) }} Royal Jelly Ants.
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span>
              Workers: {{ formatNumber(gameStore.resources.workers ?? 0, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="gameStore.resources.workers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.downgradeAntFrom('workers')"
              >
                -
              </button>
              <button
                :disabled="gameStore.resources.royalJellyAnts < 1"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.upgradeAntTo('workers')"
              >
                +
              </button>
            </div>
          </div>
          <p>
            More types of ants will be available in the future.
          </p>
          <div
            v-if="false"
            class="flex items-center justify-between"
          >
            <span>
              Soldiers: {{ formatNumber(gameStore.resources.soldiers ?? 0, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="gameStore.resources.soldiers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.downgradeAntFrom('soldiers')"
              >
                -
              </button>
              <button
                :disabled="gameStore.resources.royalJellyAnts < 1"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.upgradeAntTo('workers')"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-gray-300 bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col justify-center items-center select-none"
      >
        <h2>
          LOCKED
        </h2>
      </div>

      <!-- Mineral Shards Section -->
      <div
        v-if="prestigeStore.upgradePurchased('tunnels')"
        class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2"
      >
        <div>
          <p class="font-bold text-lg">
            Mineral shards
          </p>
          <p
            class="text-2xs"
          >
            Used to upgrade the tunnels. (Coming soon)
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(gameStore.resources.mineralShards ?? 0, 0) }}
            </p>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-gray-300 bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col justify-center items-center select-none"
      >
        <h2>
          LOCKED
        </h2>
      </div>

      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <h2
          class="font-bold"
        >
          Found an issue or have a suggestion?
        </h2>
        <p>
          Please report it on the <a
            href="https://github.com/Mezeman1/idle-ant-farm/issues/new"
            target="_blank"
            class="text-blue-500"
          >GitHub issues page</a>.
        </p>

        <h2 class="font-bold">
          Want to keep up with development?
        </h2>
        <p>
          Join the <a
            href="https://discord.gg/cHyAFTx9kj"
            target="_blank"
            class="text-blue-500"
          >Discord server</a>.
        </p>

        <h2 class="font-bold">
          Want to help support the game?
        </h2>
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
import PrestigeShop from './PrestigeShop.vue'
import {usePrestigeStore} from '../stores/prestigeStore'
import StorageButtons from '@/components/StorageButtons.vue'
import {computed} from 'vue'

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

const seedStorageCostString = computed(() => `${formatNumber(gameStore.upgradeCosts.seedStorageUpgradeCost)} seeds`)
const larvaeStorageCostString = computed(() => `${formatNumber(gameStore.upgradeCosts.larvaeStorageUpgradeCost)} seeds`)

const seedCollectingDisabled = computed(() => gameStore.resources.seeds >= gameStore.storage.maxSeeds)
const createLarvaeDisabled = computed(() => gameStore.resources.seeds < gameStore.resourceCosts.seedCostPerLarva || gameStore.resources.larvae >= gameStore.storage.maxLarvae)
const createAntDisabled = computed(() => gameStore.resources.larvae < gameStore.resourceCosts.larvaCostPerAnt || gameStore.resources.seeds < gameStore.resourceCosts.seedCostPerAnt || gameStore.resources.ants >= gameStore.maxAnts)
const createEliteAntDisabled = computed(() => gameStore.resources.larvae < gameStore.resourceCosts.larvaCostPerEliteAnt || gameStore.resources.seeds < gameStore.resourceCosts.seedCostPerEliteAnt || gameStore.resources.eliteAnts >= gameStore.storage.maxEliteAnts)
const createQueenDisabled = computed(() => gameStore.resources.ants < 50 || gameStore.resources.seeds < 500 || gameStore.resources.queens >= gameStore.storage.maxQueens)
</script>

<style scoped>

</style>
