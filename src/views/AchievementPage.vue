<template>
  <div class="flex flex-col overflow-y-auto p-6 bg-gray-50 bg-opacity-50">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        :class="[
          'relative bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transform transition-transform duration-300 ease-in-out',
          achievement.isUnlocked
            ? 'border-2 border-green-500 hover:scale-105 hover:shadow-xl'
            : 'opacity-70',
        ]"
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
        <div class="w-20 h-20 mb-4">
          <img
            v-if="achievement.image"
            :src="achievement.image"
            alt="Achievement Icon"
            :class="[
              'w-full h-full object-cover rounded-full',
              achievement.isUnlocked ? '' : 'filter grayscale',
            ]"
          >
          <div
            v-else
            class="w-full h-full bg-gray-200 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <!-- Placeholder Icon -->
              <path d="M13 7H7v6h6V7z" />
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
          class="text-2xl font-semibold mb-2"
          :class="{
            'text-gray-800': achievement.isUnlocked,
            'text-gray-500': !achievement.isUnlocked,
          }"
        >
          {{ achievement.name }}
        </h3>
        <!-- Achievement Description -->
        <p class="text-gray-600 mb-4">
          {{ achievement.description }}
        </p>
        <!-- Progress Bar -->
        <div
          v-if="!achievement.isUnlocked"
          class="w-full mt-2"
        >
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              class="bg-blue-500 h-full"
              :style="{ width: Math.min(achievement.progress(), 1) * 100 + '%' }"
            />
          </div>
          <p class="text-xs text-gray-500 mt-1">
            Progress:
            {{
              Math.min(gameStore.formatNumber(achievement.progress() * 100), 100)
            }}
            %
          </p>
        </div>
        <!-- Achievement Reward -->
        <div
          v-if="achievement.reward"
          class="w-full mt-4"
        >
          <div
            v-if="achievement.isUnlocked"
            class="bg-green-100 text-green-600 p-3 rounded-lg"
          >
            <p class="text-sm font-medium">
              {{ achievement.reward.description }}
            </p>
          </div>
          <div
            v-else
            class="bg-gray-100 text-gray-600 p-3 rounded-lg"
          >
            <p class="text-sm">
              Reward on achieving: <br> {{ achievement.reward.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAchievementStore } from '@/stores/achievementStore'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const achievementStore = useAchievementStore()
const achievements = computed(() => {
  const achievementsFromStore = achievementStore.achievements

  return achievementsFromStore.sort(
    (a, b) => !a.isUnlocked - !b.isUnlocked,
  )
})

onMounted(() => {
  achievementStore.checkAchievements()
})
</script>

<style scoped>
/* No additional styles needed */
</style>
