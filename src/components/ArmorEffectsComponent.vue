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
          <span v-if="itemMultiplier(item)">
            Bonus: {{ (itemMultiplier(item) * 100 - 100).toFixed(2) }}%
          </span>
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

// Access the active set bonus from the equipment store
const activeSetBonus = computed(() => equipmentStore.activeSetBonus)

// Define descriptions for each set bonus
const setBonusDescriptions: Record<string, string> = {
  'Worker Set': 'Increases resource gathering by an additional 15%.',
  'Soldier Set': 'Increases army attack and defense by an additional 15%.',
  'Royal Set': 'Increases larvae production rate by an additional 20%.',
}

// Define multipliers for each set bonus
const setBonusMultipliers: Record<string, number> = {
  'Worker Set': 1.15,
  'Soldier Set': 1.15,
  'Royal Set': 1.20,
}

// Get the description of the active set bonus
const setBonusDescription = computed(() => {
  if (activeSetBonus.value) {
    return setBonusDescriptions[activeSetBonus.value] || ''
  }
  return ''
})

// Get the multiplier of the active set bonus
const setBonusMultiplier = computed(() => {
  if (activeSetBonus.value) {
    return setBonusMultipliers[activeSetBonus.value] || 1
  }
  return 1
})

// List of set names
const setNames = ['Worker Set', 'Soldier Set', 'Royal Set']

// Set sizes (number of items in each set)
const setSizes: Record<string, number> = {
  'Worker Set': 4,
  'Soldier Set': 5,
  'Royal Set': 5,
}

// Compute the count of equipped items per set
const equippedSetCounts = computed(() => {
  const counts: Record<string, number> = {}
  setNames.forEach((set) => (counts[set] = 0))

  equippedItemsList.value.forEach((item) => {
    if (item.set && setNames.includes(item.set)) {
      counts[item.set] += 1
    }
  })

  return counts
})

// Function to compute the item multiplier
const itemMultiplier = (item) => {
  if (item.type === 'equipment' && item.level) {
    // Calculate the multiplier based on the item's effect per level
    // Adjust the base percentage per level according to your game design
    let basePercentage = 0
    switch (item.id) {
      // Worker Set items
      case 'worker-helm':
      case 'worker-legs':
        basePercentage = 0.02 // 2% per level
        break
      case 'worker-body':
      case 'worker-gloves':
        basePercentage = 0.025 // 2.5% per level
        break
      // Soldier Set items
      case 'soldier-helm':
      case 'soldier-body':
      case 'soldier-shield':
        basePercentage = 0.03 // 3% per level
        break
      case 'soldier-legs':
      case 'soldier-sword':
        basePercentage = 0.035 // 3.5% per level
        break
      // Royal Set items
      case 'royal-crown':
      case 'royal-legs':
        basePercentage = 0.02 // 2% per level
        break
      case 'royal-robe':
      case 'royal-scepter':
        basePercentage = 0.025 // 2.5% per level
        break
      case 'royal-ring':
        basePercentage = 0.03 // 3% per level
        break
      default:
        return 1
    }
    return 1 + basePercentage * item.level
  }
  return 1
}
</script>

<style scoped>
/* Add any necessary styles here */
</style>
