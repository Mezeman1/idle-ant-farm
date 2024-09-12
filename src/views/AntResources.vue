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
      Data before the 13th of September 2024 will/has been reset. Sorry for the inconvenience. <br>
      If your game is bugged, try hard resetting the game in settings.
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
              Count: {{ formatNumber(gameStore.resources.seeds) }}/{{ formatNumber(gameStore.storage.maxSeeds) }}
              ({{ formatNumber(gameStore.seedsPerSecond) }} /s)
            </p>
            <div
              class="w-full flex gap-2"
            >
              <button
                :disabled="gameStore.resources.seeds < gameStore.upgradeCosts.seedStorageUpgradeCost"
                class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.upgradeSeedStorage"
              >
                Upgrade storage ({{ formatNumber(gameStore.upgradeCosts.seedStorageUpgradeCost) }} seeds)
              </button>
              <button
                :disabled="gameStore.resources.seeds < gameStore.upgradeCosts.seedStorageUpgradeCost"
                class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="gameStore.upgradeMaxSeedStorage"
              >
                Max
              </button>
            </div>

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
      <ResourceCard
        resource-name="Larvae"
        description="Larvae are the main resource used to create ants."
        :current-amount="gameStore.resources.larvae"
        :max-amount="gameStore.storage.maxLarvae"
        :seed-cost="gameStore.resourceCosts.seedCostPerLarva"
        :ant-cost="0"
        :can-buy="gameStore.resources.seeds >= gameStore.resourceCosts.seedCostPerLarva"
        :buy-action="gameStore.createLarvae"
        :buy-max-action="gameStore.createMaxLarvae"
        buy-icon=""
        :auto-creation="false"
        :auto-creation-unlocked="prestigeStore.upgradePurchased('autoLarvae')"
        :auto-creation-model-value="prestigeStore.autoLarvaeCreation"
        :has-storage-upgrade="true"
        :storage-upgrade-cost="gameStore.upgradeCosts.larvaeStorageUpgradeCost"
        :can-upgrade-storage="gameStore.resources.seeds >= gameStore.upgradeCosts.larvaeStorageUpgradeCost"
        :upgrade-storage="gameStore.upgradeLarvaeStorage"
        :upgrade-max-storage="gameStore.upgradeMaxLarvaeStorage"
        @update:autoCreationModelValue="value => prestigeStore.autoLarvaeCreation = value"
      />

      <!-- Ant Section -->
      <ResourceCard
        resource-name="Ants"
        description="Ants collect seeds and fight bugs."
        :current-amount="gameStore.resources.ants"
        :max-amount="gameStore.storage.maxAnts"
        :seed-cost="gameStore.resourceCosts.seedCostPerAnt"
        :ant-cost="gameStore.resourceCosts.larvaCostPerAnt"
        :can-buy="gameStore.resources.larvae >= gameStore.resourceCosts.larvaCostPerAnt && gameStore.resources.seeds >= gameStore.resourceCosts.seedCostPerAnt"
        :buy-action="gameStore.createAnts"
        :buy-max-action="gameStore.createMaxAnts"
        buy-icon=""
        :auto-creation="true"
        :auto-creation-unlocked="prestigeStore.upgradePurchased('autoAnts')"
        :auto-creation-model-value="prestigeStore.autoAntCreation"
        @update:autoCreationModelValue="value => prestigeStore.autoAntCreation = value"
      />

      <!-- Elite Ant Section -->
      <ResourceCard
        resource-name="Elite Ants"
        description="Elite Ants help the ants to collect resources faster."
        :current-amount="gameStore.resources.eliteAnts"
        :max-amount="gameStore.storage.maxEliteAnts"
        :seed-cost="gameStore.resourceCosts.seedCostPerEliteAnt"
        :ant-cost="gameStore.resourceCosts.larvaCostPerEliteAnt"
        :can-buy="gameStore.resources.larvae >= gameStore.resourceCosts.larvaCostPerEliteAnt && gameStore.resources.seeds >= gameStore.resourceCosts.seedCostPerEliteAnt"
        :buy-action="gameStore.createEliteAnts"
        :buy-max-action="gameStore.createEliteMaxAnts"
        :unlocked="gameStore.eliteAntsUnlocked"
        :locked-tooltip="'Maybe it has something to do with how many times we\'ve prestiged?'"
        :auto-creation="true"
        :auto-creation-unlocked="prestigeStore.upgradePurchased('autoEliteAntsCreation')"
        :auto-creation-model-value="prestigeStore.autoEliteAntsCreation"
        @update:autoCreationModelValue="value => prestigeStore.autoEliteAntsCreation = value"
      />

      <!-- Queens Section -->
      <ResourceCard
        resource-name="Queens"
        description="Queens are the main producers of larvae."
        :current-amount="gameStore.resources.queens"
        :max-amount="gameStore.storage.maxQueens"
        :seed-cost="gameStore.resourceCosts.seedCostPerQueen"
        :ant-cost="gameStore.resourceCosts.antCostPerQueen"
        :can-buy="gameStore.resources.ants >= 100 && gameStore.resources.seeds >= 250"
        :buy-action="gameStore.buyQueen"
        :buy-max-action="gameStore.buyMaxQueens"
        buy-icon="👑"
        :auto-creation="true"
        :auto-creation-unlocked="true"
        :auto-creation-model-value="prestigeStore.autoQueenCreation"
        @update:autoCreationModelValue="prestigeStore.autoQueenCreation = $event"
      />

      <!-- Royal Jelly Section -->
      <ResourceCard
        :resource-name="'Royal Jelly'"
        :description="'Royal Jelly is a special resource used to upgrade ants. (Coming soon). Queens have a chance to produce Royal Jelly.'"
        :current-amount="gameStore.resources.royalJelly ?? 0"
        :can-buy="false"
        :unlocked="gameStore.royalJellyUnlocked"
        :has-buy-action="false"
        :locked-tooltip="'Maybe it has something to do with how many times we\'ve prestiged?'"
      />

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
import PrestigeShop from './PrestigeShop.vue'
import {usePrestigeStore} from '../stores/prestigeStore'
import ResourceCard from '@/components/ResourceCard.vue'

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
