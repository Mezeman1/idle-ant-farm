<template>
  <div
    v-if="gameStore.showOfflineSummary && offlineTime >= 5000"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 class="text-2xl font-bold mb-4">
        Offline Gains Summary
      </h2>
      <p class="mb-4">
        Time offline: {{ formatTime(offlineTime) }}
      </p>
      <div class="space-y-2">
        <p>Seeds: {{ formatNumber(gameStore.offlineGains.seeds) }}</p>
        <p>Larvae: {{ formatNumber(gameStore.offlineGains.larvae) }}</p>
        <p>Ants: {{ formatNumber(gameStore.offlineGains.ants) }}</p>
        <p>Elite Ants: {{ formatNumber(gameStore.offlineGains.eliteAnts) }}</p>
        
        <h3 class="text-xl font-semibold mt-4">
          Storage Increases:
        </h3>
        <p>Seeds: {{ formatNumber(gameStore.offlineGains.storage.seeds) }}</p>
        <p>Larvae: {{ formatNumber(gameStore.offlineGains.storage.larvae) }}</p>
        <p>Ants: {{ formatNumber(gameStore.offlineGains.storage.ants) }}</p>
        
        <h3 class="text-xl font-semibold mt-4">
          XP Gains:
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <p
            v-for="(xp, skill) in gameStore.offlineGains.xp"
            :key="skill"
          >
            {{ capitalize(skill) }}: {{ formatNumber(xp) }}
          </p>
        </div>
      </div>
      <button
        class="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="closeOfflineSummary"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { formatTime, formatNumber, capitalize } from '@/utils'
import { computed } from 'vue'

const gameStore = useGameStore()

const offlineTime = computed(() => {
  return Date.now() - gameStore.previousSaveTime
})

function closeOfflineSummary() {
  gameStore.showOfflineSummary = false
}
</script>
