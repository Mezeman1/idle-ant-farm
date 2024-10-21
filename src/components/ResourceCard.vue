<!-- ResourceCard.vue -->
<template>
  <div
    v-if="unlocked"
    :class="['p-4 sm:p-6 rounded-lg shadow-lg transition-all duration-300', cardClass]"
  >
    <div class="mb-3">
      <p class="font-bold text-lg sm:text-xl text-gray-800 mb-1">
        {{ title }}
      </p>
      <p class="text-sm sm:text-base text-gray-600">
        {{ description }}
      </p>
    </div>
    <div class="space-y-2">
      <p class="text-sm sm:text-base text-gray-700 flex items-center">
        <span class="font-semibold">Count:</span> 
        <span class="ml-1">{{ countFormatted }}/{{ maxCountFormatted }}</span>
        <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
          {{ percentage }}%
        </span>
      </p>
      <!-- Progress bar for count percentage -->
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          :style="{ width: percentage + '%' }"
        />
      </div>

      <p
        v-if="rate"
        class="text-xs sm:text-sm text-gray-600 flex items-center"
      >
        <span class="font-semibold">Rate:</span> 
        <span class="ml-1">{{ formatNumber(rate, 0) }}{{ ratePer }}</span>
        <span
          v-if="bonusPercentage"
          class="ml-2 inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full"
        >
          {{ bonusPercentage }}
        </span>
      </p>
      <p
        v-if="storageMultiplier"
        class="text-xs sm:text-sm text-gray-600 flex items-center"
      >
        <span class="font-semibold">Storage Multiplier:</span>
        <span
          class="ml-2 inline-block bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full"
        >
          {{ storageMultiplierFormatted }}
        </span>
      </p>
    </div>

    <div class="mt-4">
      <!-- Additional Info Slot -->
      <slot name="additional-info" />
    </div>

    <div class="mt-4 flex flex-col gap-2">
      <!-- Actions Slot -->
      <slot name="actions" />
    </div>
  </div>

  <div 
    v-else 
    class="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center"
  >
    <p class="text-gray-500 font-semibold">
      Locked (Unlocked through prestige shop)
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { toPercentage } from '@/utils'

const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const props = withDefaults(defineProps<{
  title: string
  description: string
  count: number
  maxCount: number
  rate?: number
  ratePer?: string
  bonus?: number
  storageMultiplier?: number
  cardClass?: string
  unlocked?: boolean
}>(), {
  ratePer: '/s',
  rate: undefined,
  bonus: undefined,
  storageMultiplier: undefined,
  cardClass: 'bg-white p-4 sm:p-6 rounded-lg shadow-lg',
  unlocked: true,
})

const percentage = computed(() => {
  return toPercentage(props.count, props.maxCount)
})

const countFormatted = computed(() => {
  return gameStore.formatNumber(props.count, 0)
})

const maxCountFormatted = computed(() => {
  return gameStore.formatNumber(props.maxCount, 0)
})

const bonusPercentage = computed(() => {
  return props.bonus ? `(+${toPercentage(props.bonus, 1)}%)` : ''
})

const storageMultiplierFormatted = computed(() => {
  return props.storageMultiplier ? `x${gameStore.formatNumber(props.storageMultiplier, 2)}` : ''
})
</script>

<style scoped>
/* Custom styles if needed */
</style>
