<template>
  <div class="bg-white shadow-lg rounded-lg mb-6 p-4">
    <h3 class="text-xl font-semibold">
      {{ skillName }}
    </h3>

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
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '@/stores/gameStore'

defineProps({
  skillName: String,
  level: Number,
  xp: Number,
  xpToNextLevel: Number,
})

const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber
</script>

<style scoped>
/* Add any specific styles for the skill display if needed */
</style>
