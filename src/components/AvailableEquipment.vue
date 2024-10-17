<template>
  <div class="container mx-auto p-4">
    <!-- Legend Section -->
    <div class="mb-4 p-4 bg-gray-100 rounded-lg border-2">
      <h2 class="text-lg font-semibold mb-2">
        Legend
      </h2>
      <ul class="space-y-2">
        <li class="flex items-center">
          <span class="inline-block w-4 h-4 bg-green-500 border-4 border-green-500 mr-2" />
          <span>Equipped Item</span>
        </li>
        <li class="flex items-center">
          <span class="inline-block w-4 h-4 bg-blue-500 border-4 border-blue-500 mr-2" />
          <span>Owned Item</span>
        </li>
        <li class="flex items-center">
          <span class="inline-block w-4 h-4 bg-gray-300 border-2 border-gray-300 opacity-50 mr-2" />
          <span>Locked Item</span>
        </li>
      </ul>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center my-4">
      <button
        :disabled="currentPage === 1"
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        @click="prevPage"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        @click="nextPage"
      >
        Next
      </button>
    </div>

    <!-- Equipment Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in paginatedEquipment"
        :key="item.id"
        :class="[
          'bg-white rounded-lg shadow-lg p-4 flex flex-col items-center',
          hasItemEquipped(item.id) ? 'border-green-500 border-4' :
          hasItem(item.id) ? 'border-4 border-blue-500' : 'border-2 border-gray-300 opacity-50',

        ]"
      >
        <img
          :src="item.image || defaultImage"
          alt="Item Image"
          class="w-16 h-16 mb-2 object-cover rounded"
          :class="{'opacity-75': !hasItem(item.id)}"
        >
        <h2
          class="text-lg font-semibold text-center"
          :class="{'text-gray-300': !hasItem(item.id)}"
        >
          {{ item.name }}
        </h2>
        <p
          class="text-gray-500 text-center"
          :class="{'text-gray-400': !hasItem(item.id)}"
        >
          {{ capitalize(item.rarity) }} {{ item.equipmentType }}
        </p>
        <p
          class="text-sm text-gray-600 mt-2 text-center"
          :class="{'text-gray-400': !hasItem(item.id)}"
        >
          {{ item.description }}
        </p>

        <!-- List of enemies that drop the item -->
        <div class="mt-4 w-full">
          <h3 class="text-md font-medium mb-2">
            Enemies That Drop This Item:
          </h3>
          <ul class="space-y-3">
            <li
              v-for="enemy in getEnemiesThatDropItem(item.id)"
              :key="enemy.name"
              class="border-t pt-2"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold">{{ enemy.name }}</span>
                <span class="text-sm">{{ enemy.wave }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { equipmentSets } from '@/types/items/itemRegistry'
import { capitalize } from '../utils'
import { useEquipmentStore } from '@/stores/equipmentStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useAdventureStore } from '@/stores/adventureStore'
import defaultImage from '@/assets/items/default.webp'
const availableEquipment = computed(() => equipmentSets)
const equipmentStore = useEquipmentStore()
const inventoryStore = useInventoryStore()

const hasItem = (itemId: string) => {
  return inventoryStore.hasItem(itemId)
}

const hasItemEquipped = (itemId: string) => {
  return equipmentStore.hasItemEquipped(itemId)
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 12
const totalPages = computed(() => Math.ceil(availableEquipment.value.length / itemsPerPage))
const paginatedEquipment = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return availableEquipment.value.slice(start, end)
})
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Function to get enemies that drop the item
const getEnemiesThatDropItem = (itemId: string) => {
  return useAdventureStore().getEnemiesThatDropItem(itemId)
}
</script>

<style scoped>
/* Optional: Style adjustments for better mobile responsiveness */
@media (max-width: 640px) {
  .container {
    padding: 1rem;
  }
}
</style>
