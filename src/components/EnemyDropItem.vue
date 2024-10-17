<template>
  <!-- List of enemies that drop the item -->
  <div class="mt-4 w-full">
    <h3
      v-if="getEnemiesThatDropItem(item.id).length > 0"
      class="text-md font-medium mb-2"
    >
      Enemies That Drop This Item:
    </h3>
    <p
      v-else
      class="text-gray-500 text-center"
    >
      No enemies drop this item. (Yet!)
    </p>
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
</template>

<script setup lang="ts">
import {useAdventureStore} from '@/stores/adventureStore'
import {Item} from '@/types/items/itemRegistry'

defineProps<{
  item: Item
}>()

const getEnemiesThatDropItem = (itemId: string) => {
  return useAdventureStore().getEnemiesThatDropItem(itemId)
}
</script>
