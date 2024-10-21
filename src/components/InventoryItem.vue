<template>
  <div
    class="relative flex flex-col items-center justify-center p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden aspect-square border-2"
    :class="[
      itemFromRegistry?.image ? 'text-white' : rarityColorClass,
      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    ]"
    :style="backgroundStyle"
    @click="$emit('click', item)"
  >
    <!-- Overlay for better text readability when there's a background image -->
    <div
      v-if="itemFromRegistry?.image"
      class="absolute inset-0 bg-black bg-opacity-40"
    />

    <!-- Amount badge -->
    <div
      v-if="itemFromRegistry?.type !== 'passive'"
      class="absolute top-1 right-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-full z-10 font-semibold"
    >
      {{ formatNumber(item.amount, 0) }}
    </div>

    <!-- Item icon (if available) -->
    <div
      v-if="itemFromRegistry?.icon"
      class="text-4xl mb-2 relative z-10"
      v-html="itemFromRegistry.icon"
    />

    <!-- Item name -->
    <div class="text-center text-xs sm:text-sm font-medium mb-1 relative z-10 px-1 line-clamp-2">
      {{ getItemName(item) }}
    </div>

    <!-- Item type -->
    <div class="text-2xs sm:text-xs opacity-75 relative z-10 bg-black bg-opacity-50 px-2 py-1 rounded-full truncate max-w-full">
      {{ itemFromRegistry?.type }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { getItemName } from '@/types/items/itemRegistry'

const props = defineProps<{
  item: {
    id: number;
    name: string;
    amount: number;
  };
  isSelected: boolean;
}>()

const rarityColorClass = computed(() => {
  const rarity = itemFromRegistry.value?.rarity
  switch (rarity) {
    case 'common': return 'bg-gray-100 text-gray-900 border-gray-300'
    case 'uncommon': return 'bg-green-100 text-green-900 border-green-300'
    case 'rare': return 'bg-blue-100 text-blue-900 border-blue-300'
    case 'legendary': return 'bg-yellow-100 text-yellow-900 border-yellow-300'
    default: return 'bg-white text-gray-900 border-gray-200'
  }
})

const backgroundStyle = computed(() => {
  if (itemFromRegistry.value?.image) {
    return {
      backgroundImage: `url(${itemFromRegistry.value.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
})

const formatNumber = useGameStore().formatNumber
const itemFromRegistry = computed(() => useInventoryStore().getItemById(props.item.id))

defineEmits(['click'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 640px) {
  .text-2xs {
    font-size: 0.625rem;
  }
}
</style>
