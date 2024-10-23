<template>
  <div class="flex justify-between items-center">
    <span class="font-semibold text-gray-700">{{ capitalize(name) }}:</span>
    <span class="text-blue-600">{{ value }}%</span>
  </div>
</template>

<script setup lang="ts">
import { capitalize } from '@/utils/index'

defineProps<{
  name: string
  value: string
}>()
</script>
