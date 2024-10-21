<template>
  <div>
    <div class="flex justify-between items-center mb-1">
      <span
        class="text-sm font-medium"
        :class="`text-${color}-600`"
      >{{ name }}</span>
      <span class="text-sm font-medium text-gray-600">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="h-2.5 rounded-full"
        :class="`bg-${color}-600`"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name: string
  percentage: string
  color: string
}>()
</script>
