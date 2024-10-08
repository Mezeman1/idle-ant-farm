<template>
  <button
    :class="[
      'p-2 flex flex-col items-center h-full w-full cursor-pointer relative overflow-hidden rounded-lg transition-all duration-200 shadow-md hover:shadow-lg',
      itemFromRegistry?.image ? 'text-white' : rarityColorClass(itemFromRegistry?.rarity)
    ]"
    :style="{
      backgroundImage: itemFromRegistry?.image ? `url(${itemFromRegistry.image})` : '',
      backgroundSize: itemFromRegistry?.image ? 'cover' : '',
      backgroundPosition: itemFromRegistry?.image ? 'center' : '',
    }"
    @click="$emit('setActiveItem', item)"
  >
    <!-- Amount badge in the top-right corner -->
    <div
      v-if="itemFromRegistry?.type !== 'passive'"
      class="absolute text-3xs sm:text-2xs md:text-xs lg:text-sm top-1 right-1 bg-gray-200 text-gray-900 rounded-full z-10 py-1 px-2 shadow"
    >
      {{ formatNumber(item.amount, 0) }}
    </div>

    <!-- Overlay to darken the background for better text readability -->
    <div
      v-if="itemFromRegistry?.image"
      class="absolute inset-0 bg-black bg-opacity-50 rounded-lg"
    />

    <!-- Item name -->
    <div
      class="text-3xs sm:text-2xs md:text-xs lg:text-sm text-center break-words relative z-10"
      :class="{
        'mt-6': itemFromRegistry?.type !== 'passive',
      }"
    >
      {{ item.name }}
    </div>

    <!-- Item type -->
    <span class="text-3xs sm:text-2xs md:text-xs lg:text-sm mt-1 relative z-10">
      {{ itemFromRegistry?.type }}
    </span>
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

const rarityColorClass = (rarity) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-100 text-gray-900 border border-gray-200'
    case 'uncommon':
      return 'bg-green-100 text-green-900 border border-green-200'
    case 'rare':
      return 'bg-blue-100 text-blue-900 border border-blue-200'
    case 'legendary':
      return 'bg-yellow-100 text-yellow-900 border border-yellow-200'
    default:
      return 'bg-white text-gray-900 border border-gray-200'
  }
}

const formatNumber = useGameStore().formatNumber
const itemFromRegistry = computed(() => useInventoryStore().getItemById(props.item.id))
defineEmits(['setActiveItem'])
</script>

<style scoped>
/* Optional extra styles for items if necessary */
</style>
