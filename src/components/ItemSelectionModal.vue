<!-- ItemSelectionModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
  >
    <!-- Full-screen modal for mobile, with scrollable content -->
    <div class="bg-white flex flex-col max-w-full h-full w-full max-h-screen sm:max-w-lg sm:h-auto sm:rounded-md sm:my-8 overflow-hidden">
      <h2 class="text-2xl font-semibold text-center p-6">
        {{ capitalize(slotType) }} Items
      </h2>

      <!-- Scrollable item list -->
      <div
        v-if="items.length > 0"
        class="flex-1 overflow-y-auto px-6 space-y-4"
      >
        <button
          v-for="(item, index) in items"
          :key="index"
          class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 w-full"
          @click="selectItem(item)"
        >
          <div class="flex items-center space-x-4">
            <img
              v-if="item.image"
              :src="item.image"
              alt="item-image"
              class="w-16 h-16 rounded-md"
            >
            <div>
              <p class="font-bold text-lg">
                {{ item.name }} <span class="text-sm text-gray-500">({{ item.rarity }})</span>
              </p>
              <p
                v-if="item.level"
                class="text-sm text-gray-600"
              >
                Level: {{ item.level }} / {{ item.maxLevel }}
              </p>
              <p class="text-sm text-gray-500">
                {{ item.description }}
              </p>
            </div>
          </div>
        </button>
      </div>
      <!-- No Items Available -->
      <div
        v-else
        class="text-center text-gray-500 py-6"
      >
        No items available for this slot
      </div>

      <!-- Buttons fixed at the bottom of the modal on mobile -->
      <div class="p-6 bg-white flex justify-between items-center space-x-4">
        <!-- Close Button -->
        <button
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition duration-200"
          @click="closeModal"
        >
          Close
        </button>

        <!-- Unequip Button -->
        <button
          class="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition duration-200"
          @click="selectItem(null)"
        >
          Unequip
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { capitalize } from '../utils'
import { Item } from '@/types/itemRegistry'

const props = defineProps({
  isOpen: Boolean,
  slotType: String,
  items: Array,
})

const emit = defineEmits(['select-item', 'close'])

const selectItem = (item?: Item) => {
  emit('select-item', item)
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
/* Optional styles for finer control */
</style>
