<template>
  <div class="flex-grow overflow-y-auto">
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
              Count: {{ formatNumber(resourcesStore.resources.seeds) }}/{{ formatNumber(resourcesStore.storage.maxSeeds) }}
              ({{ formatNumber(resourcesStore.seedsPerSecond) }} /s)
            </p>
            <p class="text-sm">
              Total bonus: {{ formatNumber(resourcesStore.productionRates.collectionRateModifier * 100, 2) }}%
            </p>
            <StorageButtons
              :cost-string="seedStorageCostString"
              :disabled="resourcesStore.resources.seeds < resourcesStore.upgradeCosts.seedStorageUpgradeCost"
              @upgrade="resourcesStore.upgradeSeedStorage(false)"
              @upgradeMax="resourcesStore.upgradeMaxSeedStorage"
            />
            <p
              v-if="resourcesStore.storage.maxSeeds < resourcesStore.upgradeCosts.seedStorageUpgradeCost"
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
              Count: {{ formatNumber(resourcesStore.resources.larvae, 0) }}/{{
                formatNumber(resourcesStore.storage.maxLarvae, 0)
              }}
              ({{ formatNumber(resourcesStore.larvaePerMinute) }} /min)
            </p>
            <p class="text-sm">
              Total bonus: {{ formatNumber(resourcesStore.productionRates.larvaeProductionModifier * 100, 2) }}%
            </p>
            <StorageButtons
              :cost-string="larvaeStorageCostString"
              :disabled="resourcesStore.resources.seeds < resourcesStore.upgradeCosts.larvaeStorageUpgradeCost"
              @upgrade="resourcesStore.upgradeLarvaeStorage(false)"
              @upgradeMax="resourcesStore.upgradeMaxLarvaeStorage"
            />
            <p
              v-if="resourcesStore.storage.maxSeeds < resourcesStore.upgradeCosts.larvaeStorageUpgradeCost"
              class="text-xs"
            >
              If only there was a way to increase your seed storage...
            </p>
          </div>

          <div class="w-full flex gap-2">
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createLarvae"
            >
              Create Larvae ({{ formatNumber(resourcesStore.resourceCosts.seedCostPerLarva) }} seeds)
            </button>
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createMaxLarvae"
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
              Count: {{ formatNumber(resourcesStore.resources.ants, 0) }}/{{ formatNumber(resourcesStore.maxAnts, 0) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              :disabled="resourcesStore.resources.seeds < resourcesStore.seedCostPerAntHousing"
              @click="resourcesStore.createAntHousing"
            >
              Create housing ({{ formatNumber(resourcesStore.seedCostPerAntHousing) }} seeds)
            </button>
            <button
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              :disabled="resourcesStore.resources.seeds < resourcesStore.seedCostPerAntHousing"
              @click="resourcesStore.createMaxAntHousing(false)"
            >
              Max
            </button>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="createAntDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createAnts"
            >
              Create Ant <br>({{ formatNumber(resourcesStore.resourceCosts.seedCostPerAnt) }} seeds, {{
                formatNumber(resourcesStore.resourceCosts.larvaCostPerAnt)
              }} larvae)
            </button>
            <button
              :disabled="createAntDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createMaxAnts(false)"
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
                formatNumber(resourcesStore.resources.eliteAnts, 0)
              }}/{{ formatNumber(resourcesStore.storage.maxEliteAnts, 0) }}
            </p>
          </div>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createEliteAnts"
            >
              Create Ant <br>({{ formatNumber(resourcesStore.resourceCosts.seedCostPerEliteAnt) }} seeds, {{
                formatNumber(resourcesStore.resourceCosts.larvaCostPerEliteAnt)
              }} larvae)
            </button>
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createEliteMaxAnts(false)"
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
              Count: {{ formatNumber(resourcesStore.resources.queens, 0) }}/{{
                formatNumber(resourcesStore.storage.maxQueens, 0)
              }}
            </p>
          </div>
          <div class="w-full md:w-auto flex flex-wrap justify-center gap-2">
            <button
              :disabled="createQueenDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.buyQueen"
            >
              Buy Queen 👑 ({{ formatNumber(resourcesStore.resourceCosts.seedCostPerQueen) }} seeds,
              {{ formatNumber(resourcesStore.resourceCosts.antCostPerQueen) }} ants)
            </button>
            <button
              :disabled="createQueenDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.buyMaxQueens(false)"
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
            Queens have a chance to produce Royal Jelly. <br>
            Currently, you have a {{ formatNumber(resourcesStore.royalJellyChance, 4) }}% chance to produce Royal Jelly.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(resourcesStore.resources.royalJelly ?? 0, 0) }}/∞
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <button
            :disabled="resourcesStore.resources.royalJelly < 1"
            class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="resourcesStore.upgradeAnt"
          >
            Upgrade Ant
          </button>
          <span>
            You currently have {{ formatNumber(resourcesStore.resources.royalJellyAnts ?? 0, 0) }} Royal Jelly Ants.
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span>
              Workers: {{ formatNumber(resourcesStore.resources.workers ?? 0, 0) }}/{{ formatNumber(resourcesStore.maxWorkers, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="resourcesStore.resources.workers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('workers')"
              >
                -
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('workers')"
              >
                +
              </button>
            </div>
          </div>

          <p class="text-2xs">
            Each worker ant produces 100x the resources of a normal ant.
          </p>

          <div class="flex items-center justify-between">
            <span>
              Soldiers: {{ formatNumber(resourcesStore.resources.soldiers ?? 0, 0) }}/{{ formatNumber(resourcesStore.maxSoldiers, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="resourcesStore.resources.workers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('soldiers')"
              >
                -
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('soldiers')"
              >
                +
              </button>
            </div>
          </div>
          <p class="text-2xs">
            Each soldier ant is 10x more effective at fighting bugs.
          </p>
          <p>
            More types of ants will be available in the future.
          </p>
          <div
            v-if="false"
            class="flex items-center justify-between"
          >
            <span>
              Soldiers: {{ formatNumber(resourcesStore.resources.soldiers ?? 0, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="resourcesStore.resources.soldiers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('soldiers')"
              >
                -
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('workers')"
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
            Used to upgrade the tunnels.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(resourcesStore.resources.mineralShards ?? 0, 0) }}
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
import {useResourcesStore} from '@/stores/resourcesStore'

const gameStore = useGameStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()

// Format numbers using the store's function
const formatNumber = gameStore.formatNumber

let collectingInterval: number | undefined = undefined
const collectingIntervalTime = 25

const startCollectingSeeds = () => {
  console.log('Start collecting seeds')
  resourcesStore.collectSeedsManually() // Initial collection on click

  // Start an interval for collecting seeds every 100ms while holding down
  collectingInterval = setInterval(() => {
    resourcesStore.collectSeedsManually()
  }, collectingIntervalTime)
}

const stopCollectingSeeds = () => {
  // Clear the interval when the mouse is released or leaves the button
  if (collectingInterval) {
    clearInterval(collectingInterval)
    collectingInterval = undefined
  }
}

const seedStorageCostString = computed(() => `${formatNumber(resourcesStore.upgradeCosts.seedStorageUpgradeCost)} seeds`)
const larvaeStorageCostString = computed(() => `${formatNumber(resourcesStore.upgradeCosts.larvaeStorageUpgradeCost)} seeds`)

const seedCollectingDisabled = computed(() => resourcesStore.resources.seeds >= resourcesStore.storage.maxSeeds)
const createLarvaeDisabled = computed(() => resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerLarva || resourcesStore.resources.larvae >= resourcesStore.storage.maxLarvae)
const createAntDisabled = computed(() => resourcesStore.resources.larvae < resourcesStore.resourceCosts.larvaCostPerAnt || resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerAnt || resourcesStore.resources.ants >= resourcesStore.maxAnts)
const createEliteAntDisabled = computed(() => resourcesStore.resources.larvae < resourcesStore.resourceCosts.larvaCostPerEliteAnt || resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerEliteAnt || resourcesStore.resources.eliteAnts >= resourcesStore.storage.maxEliteAnts)
const createQueenDisabled = computed(() => resourcesStore.resources.ants < 50 || resourcesStore.resources.seeds < 500 || resourcesStore.resources.queens >= resourcesStore.storage.maxQueens)
</script>

<style scoped>

</style>
