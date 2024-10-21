<!-- ResourceCard.vue -->
<template>
  <div
    v-if="unlocked"
    :class="cardClass"
  >
    <div>
      <p class="font-bold text-lg sm:text-xl text-gray-800">
        {{ title }}
      </p>
      <p class="text-sm sm:text-base text-gray-600">
        {{ description }}
      </p>
    </div>
    <div class="mt-2">
      <p class="text-sm sm:text-base text-gray-700">
        <i class="fas fa-cubes" /> Count: {{ countFormatted }}/{{ maxCountFormatted }} ({{ percentage }}%)
      </p>
      <!-- Progress bar for count percentage -->
      <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          class="bg-blue-500 h-2.5 rounded-full"
          :style="{ width: percentage + '%' }"
        />
      </div>

      <p
        v-if="rate"
        class="text-xs sm:text-sm text-gray-500 mt-2"
      >
        <i class="fas fa-tachometer-alt" /> Rate: {{ formatNumber(rate, 0) }}{{ ratePer }}
        <span
          v-if="bonusPercentage"
          class="ml-2 inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full"
        >
          {{ bonusPercentage }}
        </span>
      </p>
    </div>

    <div class="mt-4">
      <!-- Additional Info Slot -->
      <slot name="additional-info" />
    </div>

    <div class="mt-4 flex flex-col gap-1">
      <!-- Actions Slot -->
      <slot name="actions" />
    </div>
  </div>

  <div v-else>
    <p class="text-gray-400">
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
  cardClass?: string
  unlocked?: boolean
}>(), {
  ratePer: '/s',
  rate: undefined,
  bonus: undefined,
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
</script>

<style scoped>
/* Custom styles if needed */
</style>
