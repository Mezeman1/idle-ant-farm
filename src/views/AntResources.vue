<template>
  <div class="flex-grow overflow-y-auto">
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 p-4">
      <ResourceCard
        :title="evolveStore.currentEvolutionData.resources.seeds.name"
        :description="evolveStore.currentEvolutionData.resources.seeds.description"

        :count="resourcesStore.resources.seeds"
        :max-count="resourcesStore.maxSeeds"
        :rate="resourcesStore.seedsPerSecond"
        :bonus="resourcesStore.productionRates.collectionRateModifier"
        :storage-multiplier="resourcesStore.storageModifiers.seed * resourcesStore.achievementModifiers.storage.seed"
      >
        <template #actions>
          <StorageButtons
            :cost-string="seedStorageCostString"
            :disabled="resourcesStore.resources.seeds < resourcesStore.upgradeCosts.seedStorageUpgradeCost"
            @upgrade="resourcesStore.upgradeSeedStorage()"
            @upgrade-max="resourcesStore.upgradeMaxSeedStorage"
          />

          <p
            v-if="resourcesStore.maxSeeds < resourcesStore.upgradeCosts.seedStorageUpgradeCost"
            class="text-xs"
          >
            If only there was a way to increase your {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }} storage...
          </p>

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
              Hold to collect {{ evolveStore.currentEvolutionData.resources.seeds.emoji }}
            </button>
          </div>
          <AutoToggle
            v-model="prestigeStore.autoSeedStorageUpgrade"
            :is-unlocked="prestigeStore.upgradePurchased('autoSeedStorageUpgrade')"
            label="Auto upgrade storage"
          />
        </template>
      </ResourceCard>

      <ResourceCard
        :title="evolveStore.currentEvolutionData.resources.larvae.name"
        :description="evolveStore.currentEvolutionData.resources.larvae.description"

        :count="resourcesStore.resources.larvae"
        :max-count="resourcesStore.maxLarvae"
        :rate="resourcesStore.larvaePerMinute"
        :rate-per="'/m'"
        :bonus="resourcesStore.productionRates.larvaeProductionModifier"
        :storage-multiplier="resourcesStore.storageModifiers.larvae * resourcesStore.achievementModifiers.storage.larvae"
      >
        <template #actions>
          <StorageButtons
            :cost-string="larvaeStorageCostString"
            :disabled="resourcesStore.resources.seeds < resourcesStore.upgradeCosts.larvaeStorageUpgradeCost"
            @upgrade="resourcesStore.upgradeLarvaeStorage()"
            @upgrade-max="resourcesStore.upgradeMaxLarvaeStorage"
          />
          <p
            v-if="resourcesStore.maxSeeds < resourcesStore.upgradeCosts.larvaeStorageUpgradeCost"
            class="text-xs"
          >
            If only there was a way to increase your {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }} storage...
          </p>
          <div class="w-full flex gap-2">
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createLarvae"
            >
              Create Larvae ({{ formatNumber(resourcesStore.resourceCosts.seedCostPerLarva, 0) }} {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }})
            </button>
            <button
              :disabled="createLarvaeDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createMaxLarvae"
            >
              Max
            </button>
          </div>
          <AutoToggle
            v-model="prestigeStore.autoLarvaeStorageUpgrade"
            :is-unlocked="prestigeStore.upgradePurchased('autoLarvaeStorageUpgrade')"
            label="Auto upgrade storage"
          />
        </template>
      </ResourceCard>

      <ResourceCard
        :title="evolveStore.currentEvolutionData.resources.ants.name"
        :description="evolveStore.currentEvolutionData.resources.ants.description"

        :count="resourcesStore.resources.ants"
        :max-count="resourcesStore.maxAnts"
        :rate="resourcesStore.antsPerSecond"
        :storage-multiplier="resourcesStore.storageModifiers.ant * resourcesStore.achievementModifiers.storage.ant"
      >
        <template #actions>
          <div class="w-full flex flex-wrap gap-2">
            <button
              class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              :disabled="resourcesStore.resources.seeds < resourcesStore.seedCostPerAntHousing"
              @click="resourcesStore.createAntHousing"
            >
              Create housing ({{ formatNumber(resourcesStore.seedCostPerAntHousing, 0) }} {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }})
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
              Create Ant <br>({{ formatNumber(resourcesStore.resourceCosts.seedCostPerAnt, 0) }} {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }}, {{
                formatNumber(resourcesStore.resourceCosts.larvaCostPerAnt, 0)
              }} {{ evolveStore.currentEvolutionData.resources.larvae.lowerName }})
            </button>
            <button
              :disabled="createAntDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createMaxAnts(false)"
            >
              Max
            </button>
          </div>

          <AutoToggle
            v-model="prestigeStore.autoAntCreation"
            :is-unlocked="prestigeStore.upgradePurchased('autoAnts')"
            label="Auto create ants"
          />

          <AutoToggle
            v-model="prestigeStore.autoCreateHousing"
            :is-unlocked="prestigeStore.upgradePurchased('autoCreateHousing')"
            label="Auto create housing"
          />
        </template>
      </ResourceCard>

      <ResourceCard
        title="Elite Ants"
        description="Elite Ants help the ants to collect resources faster."
        :count="resourcesStore.resources.eliteAnts"
        :max-count="resourcesStore.storage.maxEliteAnts"
        :unlocked="prestigeStore.upgradePurchased('eliteAnts')"
      >
        <template #actions>
          <div class="w-full flex flex-wrap gap-2">
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createEliteAnts"
            >
              Create Ant <br>({{ formatNumber(resourcesStore.resourceCosts.seedCostPerEliteAnt, 0) }} {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }}, {{
                formatNumber(resourcesStore.resourceCosts.larvaCostPerEliteAnt, 0)
              }} {{ evolveStore.currentEvolutionData.resources.larvae.lowerName }})
            </button>
            <button
              :disabled="createEliteAntDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.createEliteMaxAnts(false)"
            >
              Max
            </button>
          </div>
          <AutoToggle
            v-model="prestigeStore.autoEliteAntsCreation"
            :is-unlocked="prestigeStore.upgradePurchased('autoEliteAntsCreation')"
            label="Auto creating"
          />
        </template>
      </ResourceCard>

      <ResourceCard
        :title="evolveStore.currentEvolutionData.resources.queens.name"
        :description="evolveStore.currentEvolutionData.resources.queens.description"

        :count="resourcesStore.resources.queens"
        :max-count="resourcesStore.maxQueens"
        :storage-multiplier="resourcesStore.storageModifiers.queen * resourcesStore.achievementModifiers.storage.queen"
      >
        <template #actions>
          <div class="flex flex-wrap gap-2">
            <button
              :disabled="createQueenDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.buyQueen"
            >
              Buy Queen 👑 ({{ formatNumber(resourcesStore.resourceCosts.seedCostPerQueen, 0) }} {{ evolveStore.currentEvolutionData.resources.seeds.lowerName }},
              {{ formatNumber(resourcesStore.resourceCosts.antCostPerQueen, 0) }} {{ evolveStore.currentEvolutionData.resources.ants.lowerName }})
            </button>
            <button
              :disabled="createQueenDisabled"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.buyMaxQueens(false)"
            >
              Max
            </button>
          </div>

          <AutoToggle
            v-model="prestigeStore.autoQueenCreation"
            :is-unlocked="prestigeStore.upgradePurchased('autoQueens')"
            label="Auto creating"
          />
        </template>
      </ResourceCard>

      <!-- Royal Jelly Section -->
      <div
        v-if="gameStore.royalJellyUnlocked"
        class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2 text-gray-800"
      >
        <div>
          <p class="font-bold text-lg">
            Royal Jelly
          </p>
          <p class="text-2xs">
            Royal Jelly is a special resource used to upgrade ants.
            <br>
            These ants are more efficient at collecting resources and do not reset on prestige.
          </p>
          <p class="text-2xs">
            Queens have a chance to produce Royal Jelly.
            <br>
            Currently, you have a {{ formatNumber(resourcesStore.royalJellyChance, 4) }}% chance to produce Royal Jelly.
          </p>
        </div>
        <div class="flex flex-wrap items-start justify-between w-full space-y-2">
          <div class="flex flex-col gap-2 w-full">
            <p class="text-sm">
              Count: {{ formatNumber(resourcesStore.resources.royalJelly ?? 0, 1) }}/∞
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <div class="w-full flex gap-2">
            <button
              :disabled="resourcesStore.resources.royalJelly < resourcesStore.resourceCosts.royalJellyCostPerUpgrade"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.upgradeAnt"
            >
              Upgrade Ant ({{ formatNumber(resourcesStore.resourceCosts.royalJellyCostPerUpgrade, 1) }} Royal Jelly)
            </button>
            <button
              :disabled="resourcesStore.resources.royalJelly < resourcesStore.resourceCosts.royalJellyCostPerUpgrade"
              class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              @click="resourcesStore.maxUpgradeAnt"
            >
              Max
            </button>
          </div>
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
                @click="resourcesStore.maxDowngradeAntFrom('workers')"
              >
                -Max
              </button>
              <button
                :disabled="resourcesStore.resources.workers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('workers')"
              >
                -1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.workers ?? 0) >= resourcesStore.maxWorkers"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('workers')"
              >
                +1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.workers ?? 0) >= resourcesStore.maxWorkers"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.maxUpgradeAntTo('workers')"
              >
                +Max
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
                :disabled="resourcesStore.resources.soldiers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.maxDowngradeAntFrom('soldiers')"
              >
                -Max
              </button>
              <button
                :disabled="resourcesStore.resources.soldiers < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('soldiers')"
              >
                -1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.soldiers ?? 0) >= resourcesStore.maxSoldiers"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('soldiers')"
              >
                +1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.soldiers ?? 0) >= resourcesStore.maxSoldiers"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.maxUpgradeAntTo('soldiers')"
              >
                +Max
              </button>
            </div>
          </div>

          <p class="text-2xs">
            Each soldier ant is 10x more effective at fighting bugs.
          </p>

          <div class="flex items-center justify-between">
            <span>
              Royal queens: {{ formatNumber(resourcesStore.resources.royalQueens ?? 0, 0) }}/{{ formatNumber(resourcesStore.maxRoyalQueens, 0) }}
            </span>
            <div class="flex gap-1">
              <button
                :disabled="resourcesStore.resources.royalQueens < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.maxDowngradeAntFrom('royalQueens')"
              >
                -Max
              </button>
              <button
                :disabled="resourcesStore.resources.royalQueens < 1"
                class="small bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.downgradeAntFrom('royalQueens')"
              >
                -1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.royalQueens ?? 0) >= resourcesStore.maxRoyalQueens"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.upgradeAntTo('royalQueens')"
              >
                +1
              </button>
              <button
                :disabled="resourcesStore.resources.royalJellyAnts < 1 || (resourcesStore.resources.royalQueens ?? 0) >= resourcesStore.maxRoyalQueens"
                class="small bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                @click="resourcesStore.maxUpgradeAntTo('royalQueens')"
              >
                +Max
              </button>
            </div>
          </div>
          <p class="text-2xs">
            Each royal queen produces {{ resourcesStore.royalQueenMultiplier }}x the resources of a normal queen.
          </p>
        </div>
      </div>
      <div
        v-else
        class="bg-gray-300 p-4 rounded-lg shadow-md flex flex-col justify-center items-center select-none"
      >
        <h2>
          LOCKED (Unlocked through prestige shop)
        </h2>
      </div>

      <div class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2 text-gray-800">
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
import {usePrestigeStore} from '../stores/prestigeStore'
import StorageButtons from '@/components/StorageButtons.vue'
import {computed} from 'vue'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useEvolveStore} from '@/stores/evolveStore'
import ResourceCard from '@/components/ResourceCard.vue'
import AutoToggle from '@/components/AutoToggle.vue'

const gameStore = useGameStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()
const evolveStore = useEvolveStore()

// Format numbers using the store's function
const formatNumber = gameStore.formatNumber

let collectingIntervalId: number | undefined = undefined
const collectingIntervalTime = 25

const startCollectingSeeds = () => {
  resourcesStore.collectSeedsManually() // Initial collection on click

  // Start an interval for collecting seeds every 100ms while holding down
  collectingIntervalId = setInterval(() => {
    resourcesStore.collectSeedsManually()
  }, collectingIntervalTime)
}

const stopCollectingSeeds = () => {
  // Clear the interval when the mouse is released or leaves the button
  if (collectingIntervalId) {
    clearInterval(collectingIntervalId)
    collectingIntervalId = undefined
  }
}

const seedStorageCostString = computed(() => `${formatNumber(resourcesStore.upgradeCosts.seedStorageUpgradeCost, 0)} ${evolveStore.currentEvolutionData.resources.seeds.lowerName}`)
const larvaeStorageCostString = computed(() => `${formatNumber(resourcesStore.upgradeCosts.larvaeStorageUpgradeCost, 0)} ${evolveStore.currentEvolutionData.resources.seeds.lowerName}`)

const seedCollectingDisabled = computed(() => resourcesStore.resources.seeds >= resourcesStore.maxSeeds)
const createLarvaeDisabled = computed(() => resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerLarva || resourcesStore.resources.larvae >= resourcesStore.maxLarvae)
const createAntDisabled = computed(() => resourcesStore.resources.larvae < resourcesStore.resourceCosts.larvaCostPerAnt || resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerAnt || resourcesStore.resources.ants >= resourcesStore.maxAnts)
const createEliteAntDisabled = computed(() => resourcesStore.resources.larvae < resourcesStore.resourceCosts.larvaCostPerEliteAnt || resourcesStore.resources.seeds < resourcesStore.resourceCosts.seedCostPerEliteAnt || resourcesStore.resources.eliteAnts >= resourcesStore.storage.maxEliteAnts)
const createQueenDisabled = computed(() => resourcesStore.resources.ants < 50 || resourcesStore.resources.seeds < 500 || resourcesStore.resources.queens >= resourcesStore.maxQueens)
</script>

<style scoped>

</style>

