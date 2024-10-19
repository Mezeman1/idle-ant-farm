<template>
  <div
    v-if="isOpen"
    ref="modalContainer"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    tabindex="-1"
  >
    <!-- Full-screen modal for mobile, with scrollable content -->
    <div
      class="bg-white flex flex-col max-w-full h-full w-full max-h-screen sm:max-w-lg sm:h-auto sm:rounded-md sm:my-8 overflow-hidden"
    >
      <h2 class="text-2xl font-semibold text-center p-6">
        {{ capitalize(slotType) }} Items
      </h2>
      <!-- Scrollable item list -->
      <div
        v-if="items.length > 0"
        class="flex-1 overflow-y-auto px-6 space-y-4 py-2 gap-1"
      >
        <button
          v-for="(item, index) in items"
          :key="index"
          class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 w-full shadow-md"
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
                {{ getItemName(item) }} <span class="text-sm text-gray-500">({{ item.rarity }})</span>
              </p>
              <p
                v-if="item.level"
                class="text-sm text-gray-600"
              >
                Level: {{ item.level }} / {{ getMaxItemLevel(item) }}
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

      <!-- Current Equipped Item -->
      <div
        v-if="currentEquippedItem"
        class="p-4 border-t-2 border-gray-200 mt-2"
      >
        <h3 class="text-lg font-bold mb-2">
          Currently Equipped
        </h3>
        <div class="flex items-center space-x-4">
          <img
            v-if="currentEquippedItem.image"
            :src="currentEquippedItem.image"
            alt="equipped-item-image"
            class="w-16 h-16 rounded-md"
          >
          <div>
            <p class="font-semibold text-lg">
              {{ currentEquippedItem.name }} <span class="text-sm text-gray-500">({{
                currentEquippedItem.rarity
              }})</span>
            </p>
            <p
              v-if="currentEquippedItem.level"
              class="text-sm text-gray-600"
            >
              Level: {{ currentEquippedItem.level }} / {{ getMaxItemLevel(currentEquippedItem) }}
            </p>
            <p class="text-sm text-gray-500">
              {{ currentEquippedItem.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Buttons fixed at the bottom of the modal on mobile -->
      <div class="p-6 bg-white flex justify-between items-center space-x-4 border-t-2 border-gray-200 mt-2">
        <!-- Close Button -->
        <button
          class="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition duration-200"
          @click="closeModal"
        >
          Close
        </button>

        <!-- Unequip Button -->
        <button
          v-if="currentEquippedItem"
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
import {capitalize} from '../utils'
import {getItemName, getMaxItemLevel, Item} from '@/types/items/itemRegistry'
import {useEquipmentStore} from '@/stores/equipmentStore'
import {computed, ref, watch} from 'vue'

const equipmentStore = useEquipmentStore()

const props = withDefaults(defineProps<{
  isOpen: boolean
  slotType: string
  items: Item[]
  slotIndex?: number
}>(), {
  isOpen: false,
  slotType: '',
  items: () => [],
  slotIndex: null,
})
// Get the current equipped item for the specific slot
const currentEquippedItem = computed(() => equipmentStore.getCurrentEquippedItemForSlot(props.slotType, props.slotIndex))

const emit = defineEmits(['select-item', 'close'])

const selectItem = (item?: Item) => {
  emit('select-item', item)
}

const closeModal = () => {
  emit('close')
}

const modalContainer = ref<HTMLElement | null>(null)

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (modalContainer.value) {
      modalContainer.value.focus()
    }
  }
})
</script>

<style scoped>
/* Optional styles for finer control */
</style>
