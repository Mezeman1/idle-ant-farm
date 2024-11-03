<template>
  <div 
    class="bg-white rounded-lg shadow-md border border-gray-200 text-sm text-gray-800 p-4 transition-all duration-200 mb-2"
  >
    <div class="flex items-center justify-between mb-1">
      <h3 class="font-semibold text-gray-700 flex items-center gap-2">
        Resources
      </h3>
      <button 
        class="text-gray-500 hover:text-gray-700 transition-colors"
        :title="collapsed ? 'Expand' : 'Collapse'"
        @click="collapsed = !collapsed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="collapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'"
          />
        </svg>
      </button>
    </div>
    
    <div 
      v-show="!collapsed"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2"
    >
      <div 
        v-for="(quantity, resource) in collectedResources"
        :key="resource"
        class="flex items-center gap-2 bg-gray-50 rounded p-2"
      >
        <span class="text-gray-600">{{ resource }}:</span>
        <span class="font-semibold">{{ formatNumber(quantity, 0) }}</span>
      </div>
    </div>
    
    <div
      v-show="collapsed"
      class="flex flex-wrap gap-2"
    >
      <span 
        v-for="(quantity, resource) in collectedResources"
        :key="resource"
        class="text-xs"
      >
        {{ resource }}: {{ formatNumber(quantity, 0) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import { useGameStore } from '@/stores/gameStore'

const trainingStore = useTrainingStore()
const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const collapsed = ref(true)
const collectedResources = computed(() => trainingStore.resourcesCollected)
</script>
