<template>
  <div class="flex flex-col max-h-screen-3/4 overflow-hidden">
    <h2 class="text-2xl font-bold text-center mb-4">
      Achievements
    </h2>
    <p class="text-center mb-4">
      Don't worry, these will eventually give you things.
    </p>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-box flex flex-col items-center justify-center p-4 rounded-lg border"
        :class="{
          'bg-green-500 border-green-600': achievement.isUnlocked,
          'bg-gray-200 border-gray-300': !achievement.isUnlocked
        }"
      >
        <span class="achievement-name text-lg font-bold mb-2">
          {{ achievement.name }}
        </span>
        <span
          v-if="!achievement.isUnlocked"
          class="text-sm text-red-500 italic"
        >
          Locked
        </span>
        <p class="text-sm text-center">
          {{ achievement.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted} from 'vue'
import {useAchievementStore} from '@/stores/achievementStore'

const achievementStore = useAchievementStore()
const achievements = computed(() => achievementStore.achievements)

onMounted(() => {
  achievementStore.checkAchievements()
})
</script>

<style scoped>
.achievement-box {
  @apply w-full h-36 sm:h-40 lg:h-44 shadow-md transition-all;
}
</style>
