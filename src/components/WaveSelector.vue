<template>
  <div class="flex flex-col space-y-2">
    <div class="flex relative items-stretch w-full">
      <!-- Previous Arrow Button -->
      <button
        class="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-l focus:outline-none focus:border-blue-500 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="!canGoPrevious"
        @click="$emit('previousWave')"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- Display Selected Wave -->
      <div class="flex-grow flex items-center justify-center bg-white border-t border-b border-gray-300 text-sm text-gray-700 py-1 px-2 text-center select-none">
        {{ selectedWave ? selectedWave.name : 'Select a wave' }}
      </div>

      <!-- Next Arrow Button -->
      <button
        class="bg-white border border-gray-300 text-gray-700 py-1 px-2 rounded-r focus:outline-none focus:border-blue-500 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
        :disabled="!canGoNext"
        @click="$emit('nextWave')"
      >
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'
import {useResourcesStore} from '@/stores/resourcesStore'

// Props passed down from the parent component
const props = defineProps({
  selectedWave: Object,
  canGoPrevious: Boolean,
  canGoNext: Boolean,
})

// Emit events for navigation
const emit = defineEmits(['previousWave', 'nextWave'])
</script>
