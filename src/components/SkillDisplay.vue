<template>
  <div
    :class="{
      'bg-white shadow-lg rounded-lg mb-6 p-4' : withStyling,
    }"
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

    <!-- Milestones -->
    <div class="mt-2">
      <div
        v-for="(milestone, index) in milestones"
        :key="index + milestone.description"
      >
        <div
          class="flex justify-between items-center mt-2"
          :class="{
            'border-t border-gray-200 pt-2' : index !== 0,
            'text-green-500' : level >= milestone.levelRequired,
            'text-gray-400' : level < milestone.levelRequired,
          }"
        >
          <p>
            {{ milestone.description }}
          </p>
          <p>
            Level: {{ milestone.levelRequired }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '@/stores/gameStore'
interface Milestone {
  description: string
  levelRequired: number
}

withDefaults(defineProps<{
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
</script>

<style scoped>
/* Add any specific styles for the skill display if needed */
</style>
