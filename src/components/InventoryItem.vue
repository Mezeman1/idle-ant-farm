<template>
  <div
    v-tooltip="'We will be giving more information about this item later.'"
    class="p-2 flex flex-col h-full"
  >
    <div class="w-full text-right">
      {{ formatNumber(item.amount) }}
    </div>
    <div class="text-3xs text-center break-words">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'

const props = defineProps<{
  item: {
    id: number;
    name: string;
    amount: number;
  };
}>()

const formatNumber = useGameStore().formatNumber
</script>

<style scoped>
/* Optional extra styles for items if necessary */
</style>
