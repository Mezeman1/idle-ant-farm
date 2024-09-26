<template>
  <div class="flex flex-col overflow-y-auto p-4">
    <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">
      Achievements
    </h2>
    <p class="text-center mb-8 text-gray-600">
      Unlock achievements to gain rewards!
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="relative bg-white rounded-lg shadow-md hover:shadow-lg p-6 flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300 ease-in-out"
      >
        <!-- Lock/Unlock Icon -->
        <div class="absolute top-4 right-4">
          <svg
            v-if="achievement.isUnlocked"
            class="w-6 h-6 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <!-- Unlocked Icon -->
            <path
              fill-rule="evenodd"
              d="M10 2a4 4 0 00-4 4v3H4a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 7V6a2 2 0 114 0v3H8z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <!-- Locked Icon -->
            <path
              fill-rule="evenodd"
              d="M5 8V6a5 5 0 0110 0v2h1a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2h1zm2 0h6V6a3 3 0 00-6 0v2z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <!-- Achievement Icon -->
        <div class="w-16 h-16 mb-4">
          <img
            v-if="achievement.image"
            :src="achievement.image"
            alt="Achievement Icon"
            class="w-full h-full object-cover rounded-full"
          >
          <div
            v-else
            class="w-full h-full bg-gray-200 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <!-- Placeholder Icon -->
              <path
                d="M13 7H7v6h6V7z"
              />
              <path
                fill-rule="evenodd"
                d="M5 3a2 2 0 00-2 2v2h14V5a2 2 0 00-2-2H5zM3 9v6a2 2 0 002 2h10a2 2 0 002-2V9H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        <!-- Achievement Name -->
        <h3
          class="text-xl font-semibold mb-2"
          :class="{ 'text-gray-800': achievement.isUnlocked, 'text-gray-500': !achievement.isUnlocked }"
        >
          {{ achievement.name }}
        </h3>
        <!-- Achievement Description -->
        <p class="text-gray-600">
          {{ achievement.description }}
        </p>
        <!-- Progress Bar -->
        <div
          v-if="!achievement.isUnlocked"
          class="w-full mt-4"
        >
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full"
              :style="{ width: achievement.progress() * 100 + '%' }"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Progress: {{ gameStore.formatNumber(achievement.progress() * 100) }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAchievementStore } from '@/stores/achievementStore'
import {useGameStore} from '@/stores/gameStore'
const gameStore = useGameStore()

const achievementStore = useAchievementStore()
const achievements = computed(() => achievementStore.achievements)

onMounted(() => {
  achievementStore.checkAchievements()
})
</script>

<style scoped>
/* No additional styles needed */
</style>
