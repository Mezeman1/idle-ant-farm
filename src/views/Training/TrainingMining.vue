<template>
  <div>
    <SkillDisplay
      skill-name="Mining"
      :level="miningLevel"
      :xp="miningXp"
      :xp-to-next-level="miningXpToNextLevel"
      :milestones="trainingStore.miningMilestones"
      class="mb-8"
    />

    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
      <p class="text-lg font-semibold mb-4 text-gray-800">
        Active Mining Resources: {{ trainingStore.activeResources.length }} / {{ trainingStore.maxActiveResources }}
      </p>

      <!-- Add this new section to display the mining double chance -->
      <div class="flex items-center">
        <span class="text-lg font-semibold text-gray-800 mr-2">Double Loot Chance:</span>
        <span class="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
          {{ toPercentageFormatted(trainingStore.miningDoubleChance) }}%
        </span>
      </div>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
      <div
        v-for="(resource, index) in miningResources"
        :key="resource.name"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        <SkillDisplay
          :with-styling="false"
          :skill-name="resource.name"
          :level="resource.level"
          :xp="resource.xp"
          :xp-to-next-level="resource.xpToNextLevel"
          class="mb-4"
        />

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Level Required
            </p>
            <p>{{ resource.levelRequired }}</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              XP per Action
            </p>
            <p>{{ resource.xpPerAction }}</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Time per Action
            </p>
            <p>{{ resource.initialTimePerAction.toFixed(1) }}s - {{ resource.timeReduction.toFixed(1) }}s</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Respawn Time
            </p>
            <p>{{ resource.initialRespawnTime.toFixed(1) }}s - {{ resource.respawnReduction.toFixed(1) }}s</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Collecting
            </p>
            <p>{{ resource.collectionMultiplier.toFixed(1) }}x</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Collected
            </p>
            <p>{{ formatNumber(trainingStore.resourcesCollected[resource.name] || 0, 0) }}</p>
          </div>
        </div>

        <!-- Mining Progress Bar -->
        <div
          v-if="!resource.isDepleted"
          class="mb-4"
        >
          <p class="text-sm font-semibold text-gray-700 mb-1">
            Mining Progress
          </p>
          <div class="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              :style="{ width: `${(resource.timePerAction / (resource.initialTimePerAction - resource.timeReduction)) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-xs text-white font-semibold leading-4">
              {{ resource.timePerAction.toFixed(1) }}s
            </p>
          </div>
        </div>

        <!-- Respawn Progress Bar -->
        <div
          v-else
          class="mb-4"
        >
          <p class="text-sm font-semibold text-gray-700 mb-1">
            Respawn Progress
          </p>
          <div class="relative w-full h-4 bg-red-200 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-red-500 rounded-full"
              :style="{ width: `${(resource.respawnTime / (resource.initialRespawnTime - resource.respawnReduction)) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-xs text-white font-semibold leading-4">
              {{ resource.respawnTime.toFixed(1) }}s
            </p>
          </div>
        </div>

        <!-- Start/Stop Mining Buttons -->
        <div class="flex justify-between mb-4">
          <button
            v-if="!isMiningResource(resource) && !resource.isDepleted"
            :disabled="training.mining.level < resource.levelRequired"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            @click="startMining(resource)"
          >
            Start Mining
          </button>

          <button
            v-if="isMiningResource(resource) || resource.isDepleted"
            class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors duration-200"
            @click="stopMining(resource)"
          >
            Stop Mining
          </button>
        </div>

        <!-- Milestones Toggle Button -->
        <button
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold w-full hover:bg-gray-300 transition-colors duration-200"
          @click="toggleMilestones(index)"
        >
          {{ showMilestones[index] ? 'Hide' : 'Show' }} Milestones
        </button>

        <!-- Milestones Section -->
        <div
          v-if="showMilestones[index]"
          class="mt-4 border-t border-gray-200 pt-4"
        >
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Milestones
          </h4>
          <ul class="max-h-[200px] overflow-y-auto">
            <li
              v-for="milestone in resource.milestones"
              :key="milestone.level"
              class="flex justify-between items-center text-sm py-2 border-b border-gray-200 last:border-b-0"
              :class="{'text-green-600 font-semibold': resource.level >= milestone.level, 'text-gray-600': resource.level < milestone.level}"
            >
              <div class="flex-1">
                <strong>Level {{ milestone.level }}</strong>:
                Collect x{{ milestone.collectionMultiplierBonus + 1 }}
                {{ milestone.timeReductionBonus > 0 ? `and reduce time by ${milestone.timeReductionBonus}s` : '' }}
                {{ milestone.respawnReductionBonus > 0 ? `and reduce respawn time by ${milestone.respawnReductionBonus}s` : '' }}
              </div>
              <div class="flex-shrink-0 ml-2">
                <span
                  v-if="resource.level >= milestone.level"
                  class="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold"
                >
                  Unlocked
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {useTrainingStore} from '@/stores/trainingStore'
import {computed, ref} from 'vue'
import SkillDisplay from '@/components/SkillDisplay.vue'
import {MiningResource} from '@/types/trainingTypes'
import { toPercentageFormatted, formatNumber } from '@/utils'

const trainingStore = useTrainingStore()

// Computed properties for mining skill
const miningLevel = computed(() => trainingStore.training.mining.level)
const miningXp = computed(() => trainingStore.training.mining.xp)
const miningXpToNextLevel = computed(() => trainingStore.training.mining.xpToNextLevel)

// Computed properties for resources
const miningResources = computed(() => trainingStore.miningResources)
const training = computed(() => trainingStore.training)

// Start mining action
function startMining(resource: MiningResource) {
  trainingStore.startMining(resource)
}

// Stop mining action
function stopMining(resource: MiningResource) {
  trainingStore.stopMining(resource.name)
}

// Helper to check if a resource is currently being mined
function isMiningResource(resource: MiningResource) {
  return trainingStore.activeResources.includes(resource.name) && !resource.isDepleted
}


const showMilestones = ref<boolean[]>([])

function toggleMilestones(index: number) {
  showMilestones.value[index] = !showMilestones.value[index]
}
</script>

