<template>
  <div
    :class="{
      'bg-white shadow-lg rounded-lg mb-2 p-4': withStyling,
    }"
    class="text-gray-800"
  >
    <h3 class="text-xl font-semibold">
      {{ skillName }}
    </h3>

    <p class="text-gray-700">
      {{ description }}
    </p>

    <div class="flex justify-between items-center">
      <p class="text-lg">
        Level: {{ formatNumber(level, 0) }}
      </p>
      <p class="text-lg">
        {{ formatNumber(xp, 0) }} / {{ formatNumber(xpToNextLevel, 0) }} XP
      </p>
    </div>

    <!-- XP Progress Bar -->
    <div class="relative mt-2 w-full h-3 bg-gray-200 rounded">
      <div
        class="absolute top-0 left-0 h-full bg-blue-500 rounded"
        :style="{ width: `${(xp / xpToNextLevel) * 100}%` }"
      />
    </div>

    <!-- Toggle Milestones Button -->
    <div
      v-if="milestones.length > 0"
      class="mt-2"
    >
      <button
        class="text-blue-600 hover:underline"
        @click="showMilestones = !showMilestones"
      >
        {{ showMilestones ? 'Hide Milestones' : 'Show Milestones' }}
      </button>
    </div>

    <!-- Milestones -->
    <div
      v-if="showMilestones"
      class="mt-2"
    >
      <div
        v-for="(milestone, index) in sortedMilestones"
        :key="index + milestone.description"
      >
        <div
          class="flex justify-between items-center mt-2"
          :class="{
            'border-t border-gray-200 pt-2': index !== 0,
            'text-green-500': level >= milestone.levelRequired,
            'text-gray-400': level < milestone.levelRequired,
          }"
        >
          <div class="flex items-center">
            <p>
              {{ milestone.description }}
            </p>
            <span
              v-if="milestone.multiplyModifier"
              class="ml-2 text-xs font-semibold bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
            >
              Multiplier
            </span>
          </div>
          <p>
            Level: {{ milestone.levelRequired }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { useGameStore } from '@/stores/gameStore'

interface Milestone {
  description: string
  levelRequired: number
  multiplyModifier?: boolean
}

const props = withDefaults(defineProps<{
  skillName: string
  description?: string
  level: number
  xp: number
  xpToNextLevel: number,
  milestones?: Milestone[],
  withStyling?: boolean
}>(), {
  skillName: 'Skill',
  description: '',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  milestones: () => [] as Milestone[],
  withStyling: true,
})

const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

// Toggle for showing milestones, default is hidden
const showMilestones = ref(false)

const sortedMilestones = computed(() => {
  const milestones = props.milestones
  return milestones.sort((a, b) => a.levelRequired - b.levelRequired)
})
</script>

<style scoped>
/* Add any specific styles for the skill display if needed */
</style>
