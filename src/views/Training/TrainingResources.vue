<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200 text-sm md:text-xl">
    <h2 class="font-semibold">
      Collected Resources
    </h2>
    <ul class="mt-4">
      <li
        v-for="(quantity, resource) in collectedResources"
        :key="resource"
        class="py-2 border-b last:border-none"
      >
        <p>
          {{ resource }}: <span class="font-semibold">{{ formatNumber(quantity, 0) }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useTrainingStore} from '@/stores/trainingStore'
import {useGameStore} from '@/stores/gameStore'
const trainingStore = useTrainingStore()
const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const collectedResources = computed(() => trainingStore.resourcesCollected)

</script>
