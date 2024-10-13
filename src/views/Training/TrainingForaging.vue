
<template>
  <div>
    <SkillDisplay
      skill-name="Foraging"
      :level="foragingLevel"
      :xp="foragingXp"
      :xp-to-next-level="foragingXpToNextLevel"
    />

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
      <div
        v-for="resource in foragingResources"
        :key="resource.name"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-xl font-semibold mb-2">
          {{ resource.name }} {{ trainingStore.amountForagedZones(resource.name) > 0 ? `(${formatNumber(trainingStore.amountForagedZones(resource.name), 0)})` : '' }}
        </h2>
        <p class="text-gray-700">
          Level Required: {{ resource.levelRequired }}
        </p>
        <p class="text-gray-700">
          XP per Action: {{ resource.xpPerAction }}
        </p>
        <p class="text-gray-700">
          Time per Action: {{ resource.initialTimePerAction.toFixed(1) }}s
        </p>

        <p
          v-for="(amount, resourceCost) in resource.cost"
          :key="resourceCost"
          class="text-gray-700"
        >
          Costs {{ formatNumber(amount, 0) }} {{ resourceCost }}
        </p>

        <div
          class="mt-4"
        >
          <p class="text-gray-500">
            Foraging Progress
          </p>
          <div class="relative mt-1 w-full h-6 bg-gray-200 rounded-lg">
            <div
              class="absolute top-0 left-0 h-full bg-green-500 rounded-lg"
              :style="{ width: `${(resource.timePerAction / resource.initialTimePerAction) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-sm text-gray-800 leading-7">
              {{ resource.timePerAction.toFixed(1) }}s remaining
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            v-if="!isForagingZone(resource.name)"
            :disabled="training.foraging.level < resource.levelRequired || !trainingStore.canForage(resource.name)"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="startForaging(resource.name)"
          >
            Start Foraging
          </button>

          <button
            v-if="isForagingZone(resource.name)"
            class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
            @click="stopForaging"
          >
            Stop Foraging
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useTrainingStore} from '@/stores/trainingStore'
import {computed} from 'vue'
import SkillDisplay from '@/components/SkillDisplay.vue'
import {useGameStore} from '@/stores/gameStore'
import {MiningResource} from '@/types/trainingTypes'

const trainingStore = useTrainingStore()
const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const foragingLevel = computed(() => trainingStore.training.foraging.level)
const foragingXp = computed(() => trainingStore.training.foraging.xp)
const foragingXpToNextLevel = computed(() => trainingStore.training.foraging.xpToNextLevel)

const foragingResources = computed(() => trainingStore.foragingResources)
const training = trainingStore.training
function startForaging(zone) {
  trainingStore.startForaging(zone)
}

// Stop foraging in a zone
function stopForaging(zone) {
  trainingStore.stopForaging(zone)
}

function isForagingZone(zone) {
  return trainingStore.activeForagingZone === zone
}
</script>

