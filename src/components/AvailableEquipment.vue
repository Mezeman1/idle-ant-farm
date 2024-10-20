<template>
  <div>
    <!-- Legend Section -->
    <div class="mb-4 p-4 bg-gray-100 rounded-lg border-2">
      <h2 class="text-lg font-semibold mb-2">
        Legend
      </h2>
      <div class="flex justify-between items-start">
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

        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
          @click="equipmentStore.unequipAllItems()"
        >
          Unequip All Items
        </button>
      </div>
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
      <button
        v-for="item in paginatedEquipment"
        :key="item.id"
        :class="[
          'bg-white rounded-lg shadow-lg p-4 flex flex-col items-center',
          hasItemEquipped(item.id) ? 'border-green-500 border-4' :
          hasItem(item.id) ? 'border-4 border-blue-500' : 'border-2 border-gray-300 opacity-50',
        ]"
        :disabled="!hasItem(item.id) && !hasItemEquipped(item.id)"
        @click="doAction(item)"
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
          {{ getItemName(item) }}
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

        <p>
          Level: {{ getLevel(item.id) }}/{{ getMaxItemLevel(item) }}
        </p>

        <EnemyDropItem :item="item" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {equipmentSets, getItemName, getMaxItemLevel, Item} from '@/types/items/itemRegistry'
import { capitalize } from '../utils'
import { useEquipmentStore } from '@/stores/equipmentStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useAdventureStore } from '@/stores/adventureStore'
import defaultImage from '@/assets/items/default.webp'
import EnemyDropItem from '@/components/EnemyDropItem.vue'
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

const doAction = (item: Item) => {
  if (hasItemEquipped(item.id)) {
    equipmentStore.unequipItem(item.slotType, undefined, item)
    return
  }

  if (hasItem(item.id)) {
    equipmentStore.equipItem(item, item.slotType)
  }
}

const getCurrentLevelFromInventory = (itemId: string) => {
  return inventoryStore.getItemFromInventory(itemId)?.level || 0
}

const getCurrentLevelFromEquipment = (itemId: string) => {
  return equipmentStore.getItemFromEquipment(itemId)?.level || 0
}

const getLevel = (itemId: string) => {
  return hasItemEquipped(itemId) ? getCurrentLevelFromEquipment(itemId) : getCurrentLevelFromInventory(itemId)
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
