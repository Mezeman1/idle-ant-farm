<template>
  <button
    class="p-2 flex flex-col items-center h-full w-full cursor-pointer"
    @click="$emit('setActiveItem', item)"
  >
    <div class="w-full text-right">
      {{ formatNumber(item.amount) }}
    </div>
    <div class="text-3xs text-center break-words">
      {{ item.name }}
    </div>
    <span class="text-3xs">
      {{ itemFromRegistry.type }}
    </span>
  </button>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {useInventoryStore} from '../stores/inventoryStore'
import {computed} from 'vue'
import {useToast} from 'vue-toast-notification'

const props = defineProps<{
  item: {
    id: number;
    name: string;
    amount: number;
  };
}>()

const formatNumber = useGameStore().formatNumber
const itemFromRegistry = computed(() => useInventoryStore().getItemById(props.item.id))
defineEmits(['setActiveItem'])
</script>

<style scoped>
/* Optional extra styles for items if necessary */
</style>
