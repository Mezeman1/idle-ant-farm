<!-- ArmorEffectsComponent.vue -->
<template>
  <div class="p-4 bg-gray-700 rounded-lg shadow-md text-white">
    <h3 class="text-lg font-bold mb-2 text-yellow-300">
      Armor Effects
    </h3>
    <div class="max-h-[200px] overflow-y-auto">
      <ul class="flex flex-col gap-2 ">
        <li
          v-for="(item, index) in equippedItemsList"
          :key="index"
          class="flex flex-col gap-1"
        >
          <strong>{{ item.name }} (Level {{ item.level }})</strong>
          {{ item.description }}
          <strong>Total bonus: {{ formatNumber(item.level * item.multiplier * 100) }}%</strong>
        </li>
      </ul>
      <!-- Display the active set bonus -->
      <div v-if="activeSetBonus">
        <h4 class="text-md font-bold mt-4 text-green-300">
          Set Bonus: {{ activeSetBonus }}
        </h4>
        <p>
          {{ setBonusDescription }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEquipmentStore } from '../stores/equipmentStore'
import { useGameStore } from '@/stores/gameStore'

// Access the equipment store
const equipmentStore = useEquipmentStore()
const gameStore = useGameStore()

const formatNumber = gameStore.formatNumber

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

// Access the active set bonus from the equipment store
const activeSetBonus = computed(() => equipmentStore.activeSetBonus)

// Define descriptions for each set bonus
const setBonusDescriptions: Record<string, string> = {
  'Worker Set': 'Increases resource gathering by an additional 15%.',
  'Soldier Set': 'Increases army attack and defense by an additional 15%.',
  'Royal Set': 'Increases larvae production rate by an additional 20%.',
}

// Get the description of the active set bonus
const setBonusDescription = computed(() => {
  if (activeSetBonus.value) {
    return setBonusDescriptions[activeSetBonus.value] || ''
  }
  return ''
})

const getTotalBonus = computed(() => {
  const equippedItems = equipmentStore.equippedItems
  const allEquipped = [
    equippedItems.head,
    equippedItems.body,
    equippedItems.legs,
    equippedItems.weapon,
    ...equippedItems.accessories,
  ]

  // Calculate the total bonus based on equipped items
  return allEquipped.reduce((total, item) => {
    if (item) {
      return total + item.level * item.multiplier
    }

    return total
  }, 0) * 100
})

</script>

<style scoped>
/* Add any necessary styles here */
</style>
