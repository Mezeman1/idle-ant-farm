<template>
  <div>
    <SkillDisplay
      skill-name="Mining"
      :level="miningLevel"
      :xp="miningXp"
      :xp-to-next-level="miningXpToNextLevel"
    />
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
      <!-- Mining Section (Dynamic Content) -->
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
        />

        <p class="text-gray-700">
          Level Required: {{ resource.levelRequired }}
        </p>
        <p class="text-gray-700">
          XP per Action: {{ resource.xpPerAction }}
        </p>
        <p class="text-gray-700">
          Time per Action: {{ resource.initialTimePerAction.toFixed(1) }}s - {{ resource.timeReduction.toFixed(1) }}s
        </p>
        <p class="text-gray-700">
          Respawn time: {{ resource.initialRespawnTime.toFixed(1) }}s - {{ resource.respawnReduction.toFixed(1) }}s
        </p>
        <p class="text-gray-700">
          Collecting: {{ resource.collectionMultiplier.toFixed(1) }}x
        </p>

        <!-- Mining Progress Bar -->
        <div
          v-if="!resource.isDepleted"
          class="mt-4"
        >
          <p class="text-gray-500">
            Mining Progress
          </p>
          <div class="relative mt-1 w-full h-6 bg-gray-200 rounded-lg">
            <div
              class="absolute top-0 left-0 h-full bg-green-500 rounded-lg"
              :style="{ width: `${(resource.timePerAction / (resource.initialTimePerAction - resource.timeReduction)) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-sm text-gray-800 leading-7">
              {{ resource.timePerAction.toFixed(1) }}s remaining
            </p>
          </div>
        </div>

        <!-- Respawn Progress Bar -->
        <div
          v-else
          class="mt-4"
        >
          <p class="text-gray-500">
            Respawn Progress
          </p>
          <div class="relative mt-1 w-full h-6 bg-red-200 rounded-lg">
            <div
              class="absolute top-0 left-0 h-full bg-red-500 rounded-lg"
              :style="{ width: `${(resource.respawnTime / (resource.initialRespawnTime - resource.respawnReduction)) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-sm text-gray-800 leading-7">
              {{ resource.respawnTime.toFixed(1) }}s remaining
            </p>
          </div>
        </div>

        <!-- Start/Stop Mining Buttons -->
        <div class="mt-6 flex justify-between">
          <button
            v-if="!isMiningResource(resource) && !resource.isDepleted"
            :disabled="training.mining.level < resource.levelRequired"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            @click="startMining(resource)"
          >
            Start Mining
          </button>

          <button
            v-if="isMiningResource(resource) || resource.isDepleted"
            class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
            @click="stopMining"
          >
            Stop Mining
          </button>
        </div>

        <!-- Milestones Toggle Button -->
        <button
          class="bg-gray-300 text-gray-800 mt-4 px-4 py-2 rounded-lg font-bold w-full hover:bg-gray-400"
          @click="toggleMilestones(index)"
        >
          {{ showMilestones[index] ? 'Hide' : 'Show' }} Milestones
        </button>

        <!-- Milestones Section -->
        <div
          v-if="showMilestones[index]"
          nn
          class="mt-4 border-t border-gray-200 pt-4"
        >
          <h4 class="text-lg font-semibold text-gray-800">
            Milestones
          </h4>
          <ul class="mt-2 max-h-[200px] overflow-y-auto">
            <li
              v-for="milestone in resource.milestones"
              :key="milestone.level"
              class="flex justify-between items-center text-gray-700 py-2 border-b border-gray-200"
              :class="{'text-green-600 font-bold': resource.level >= milestone.level, 'text-gray-500': resource.level < milestone.level}"
            >
              <div class="flex-1">
                <strong>Level {{ milestone.level }}</strong>:
                <br>
                Collect x{{ milestone.collectionMultiplierBonus + 1 }} {{ milestone.timeReductionBonus > 0 ? 'and reduce time by ' + milestone.timeReductionBonus + 's' : '' }}
              </div>
              <div class="flex-1 flex items-center justify-center">
                <span
                  v-if="resource.level >= milestone.level"
                  class="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-sm"
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
function stopMining() {
  trainingStore.stopMining()
}

// Helper to check if a resource is currently being mined
function isMiningResource(resource: MiningResource) {
  return trainingStore.activeResource === resource.name && !resource.isDepleted
}


const showMilestones = ref<boolean[]>([])

function toggleMilestones(index: number) {
  showMilestones.value[index] = !showMilestones.value[index]
}
</script>

