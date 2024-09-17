<!-- ArmorEffectsComponent.vue -->
<template>
  <div class="p-4 bg-gray-700 rounded-lg shadow-md text-white">
    <h3 class="text-lg font-bold mb-2 text-yellow-300">
      Armor Effects
    </h3>
    <ul>
      <li
        v-for="(item, index) in equippedItemsList"
        :key="index"
      >
        <strong>{{ item.name }}</strong>: {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEquipmentStore } from '../stores/equipmentStore'

// Access the equipment store
const equipmentStore = useEquipmentStore()

// Compute the list of equipped items
const equippedItemsList = computed(() => {
  const equippedItems = equipmentStore.equippedItems
  const allEquipped = [
    equippedItems.head,
    equippedItems.body,
    equippedItems.legs,
    equippedItems.weapon,
    ...equippedItems.accessories,
  ]

  // Filter out null values and return the list
  return allEquipped.filter((item) => item !== null)
})
</script>

<style scoped>
/* Add any necessary styles here */
</style>
