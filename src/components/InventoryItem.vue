<template>
  <button
    v-tooltip="itemFromRegistry?.description"
    class="p-2 flex flex-col h-full cursor-pointer"
    @click="useInventoryStore().useItem(item.id)"
  >
    <div class="w-full text-right">
      {{ formatNumber(item.amount) }}
    </div>
    <div class="text-3xs text-center break-words">
      {{ item.name }}
    </div>
  </button>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {useInventoryStore} from '../stores/inventoryStore'
import {computed} from 'vue'

const props = defineProps<{
  item: {
    id: number;
    name: string;
    amount: number;
  };
}>()

const formatNumber = useGameStore().formatNumber
const itemFromRegistry = computed(() => useInventoryStore().getItemById(props.item.id))
</script>

<style scoped>
/* Optional extra styles for items if necessary */
</style>
