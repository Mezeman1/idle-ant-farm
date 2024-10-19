<template>
  <div class="p-6 bg-white bg-opacity-80 rounded-xl shadow-lg relative flex flex-col h-full overflow-y-auto">
    <!-- Passive Items Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="item in passiveComputed"
        :key="item.id"
        :class="[
          'border-2 p-5 rounded-xl flex flex-col items-center justify-center text-center shadow-md transition transform hover:scale-105',
          isCollected(item) ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50',
          !isCollected(item) && 'opacity-75'
        ]"
      >
        <img
          :src="item.image || defaultImage"
          :alt="item.name"
          class="w-20 h-20 mb-4 object-contain rounded-lg"
        >
        <h2 class="font-semibold text-lg text-gray-700">
          {{ getItemName(item) }}
        </h2>
        <p class="text-gray-600 mb-2">
          {{ item.description }}
        </p>
        <p
          v-if="isCollected(item)"
          class="text-sm text-green-600 font-medium"
        >
          Collected
        </p>
        <p
          v-else
          class="text-sm text-gray-500"
        >
          Not Collected
        </p>

        <EnemyDropItem :item="item" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {getItemName, Item} from '@/types/items/itemRegistry'
import { useInventoryStore } from '@/stores/inventoryStore'
import defaultImage from '@/assets/items/default-item.webp'
import {passiveItems} from '@/types/items/passiveItems'
import {useAdventureStore} from '@/stores/adventureStore'
import EnemyDropItem from '@/components/EnemyDropItem.vue'

const inventoryStore = useInventoryStore()

// All passive items in the game
const passiveComputed = computed(() => passiveItems)

// Check if an item has been collected
const isCollected = (item: Item) => {
  return inventoryStore.hasItem(item.id)
}
</script>
