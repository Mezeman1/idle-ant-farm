<template>
  <div>
    <SkillDisplay
      skill-name="Farming"
      :level="trainingStore.training.farming.level"
      :xp="trainingStore.training.farming.xp"
      :xp-to-next-level="trainingStore.training.farming.xpToNextLevel"
    />

    <div
      v-if="debugMode"
      class="flex flex-col gap-2 my-2"
    >
      <button
        v-for="resource in seeds"
        :key="resource.name"
        class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600"
        @click="addFungus(resource)"
      >
        Add Fungus {{ resource.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 class="text-lg font-semibold mb-4">
          Harvested Resources
        </h2>
        <ul>
          <li
            v-for="harvestedResource in harvestedResources"
            :key="harvestedResource.name"
            class="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 flex justify-between items-center gap-2"
          >
            <span>
              {{ harvestedResource.name }}: {{ harvestedResource.amount }}
              <br>
              {{ harvestedResource.description }}
            </span>

            <button
              class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600"
              @click="trainingStore.eatFungus(harvestedResource)"
            >
              Eat
            </button>
          </li>
          <li v-if="harvestedResources.length === 0">
            No resources harvested yet
          </li>
        </ul>
      </div>

      <div
        class="bg-white rounded-lg shadow-md p-4 mb-4"
      >
        <h2
          class="text-lg font-semibold"
        >
          Eaten Fungus
        </h2>
        <ul
          class="mt-4 flex flex-col gap-2"
        >
          <li
            v-for="fungus in trainingStore.eatenFungus"
            :key="fungus.name + 'modifier'"
            class="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-200 flex flex-col justify-between gap-2"
          >
            <span class="flex-1">
              <strong>{{ fungus.name }}:</strong> <br> {{ trainingStore.getSeedByName(fungus.name).description }}
              <br>
              {{ formatTime(fungus.duration * 1000, true) }} remaining
            </span>
            <span class="flex-1 flex justify-end">
              <button
                class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 small"
                @click="trainingStore.cancelEffect(fungus)"
              >
                Cancel Effect
              </button>
            </span>
          </li>

          <li v-if="trainingStore.eatenFungus.length === 0">
            No effects active
          </li>
        </ul>
      </div>
    </div>


    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <h2 class="text-lg font-semibold mb-4">
        Fungus Farming Grid
      </h2>

      <!-- Seed Selection -->
      <div class="mt-4">
        <h3 class="text-lg font-semibold mb-2">
          Select Seed
        </h3>
        <select
          v-model="selectedSeed"
          class="px-4 py-2 border rounded-lg w-full bg-gray-100"
        >
          <option
            disabled
            value=""
          >
            Select a seed
          </option>
          <option
            v-for="seed in availableSeeds"
            :key="seed.name"
            :value="seed"
            :disabled="!canPlantSeed(seed)"
          >
            {{ seed.name }} (Level {{ seed.levelRequired }}, Growth Time: {{ formatTime(seed.growthTime * 1000, true) }})
          </option>
        </select>
      </div>

      <!-- 3x3 Grid for Planting -->
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div
          v-for="(plot, index) in farmingGrid"
          :key="index"
          class="border border-green-500 h-24 flex flex-col justify-center items-center cursor-pointer"
          @click.prevent="plantOrHarvest(index)"
        >
          <span v-if="plot.seed">
            {{ plot.seed.name }} ({{ plot.growthStage }})
          </span>
          <span
            v-else
            class="text-gray-400"
          >Empty Plot</span>

          <!-- Timer for growth -->
          <div
            v-if="plot.seed"
            class="text-sm text-gray-600"
          >
            <span v-if="plot.growthStage !== 'Mature'">
              Time Left: {{ formatTimeRemaining(plot) }}
            </span>
            <span
              v-else
              class="text-green-500"
            >
              Mature!
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import SkillDisplay from '@/components/SkillDisplay.vue'
import {storeToRefs} from 'pinia'
import {formatTime} from '@/utils'
import {seeds} from '@/types/farmingSeeds'

// Get the store
const trainingStore = useTrainingStore()

// Get the farming grid from the trainingStore
const farmingGrid = computed(() => trainingStore.farmingPlots)

const {
  selectedSeed,
} = storeToRefs(trainingStore)

const harvestedResources = computed(() => {
  const resources = trainingStore.harvestedResources // Object with keys as resource names
  return Object.keys(resources).map(name => ({
    ...trainingStore.getSeedByName(name),
    amount: resources[name],
  }))
})
const plantOrHarvest = (index) => {
  if (farmingGrid.value[index].seed) {
    harvestPlant(index)
  } else {
    plantSeed(index)
  }
}

// Function to plant a seed in the selected plot
function plantSeed(index) {
  if (selectedSeed.value && !farmingGrid.value[index].seed) {
    trainingStore.plantSeed(index, selectedSeed.value)
  }
}

// Function to harvest a fully grown plant
function harvestPlant(index) {
  trainingStore.harvestPlant(index)
}

// Computed property to get available seeds based on farming level
const availableSeeds = computed(() => trainingStore.getAvailableSeeds)

// Check if a seed can be planted based on farming level
function canPlantSeed(seed) {
  return trainingStore.training.farming.level >= seed.levelRequired
}

// Format time remaining based on growth progress and growth time
function formatTimeRemaining(plot) {
  const totalTime = plot.seed.growthTime
  const remainingTime = Math.max(0, totalTime - plot.growthProgress) * 1000
 return formatTime(remainingTime, true)
}

const addFungus = (seed) => {
  if (trainingStore.harvestedResources[seed.name] === undefined) {
    trainingStore.harvestedResources[seed.name] = 0
  }

  trainingStore.harvestedResources[seed.name] += 1
}

const debugMode = import.meta.env.MODE === 'localhost'
</script>

<style scoped>
* {
  user-select: none;
}
</style>
