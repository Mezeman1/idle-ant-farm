<template>
  <div class="max-w-md mx-auto p-4">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-3">
      <!-- Head Slot -->
      <SlotComponent
        :item="headSlot"
        slot-type="head"
        :is-desktop="isDesktop"
        :is-mobile="isMobile"
        class="md:col-start-2"
        @click="openModal('head')"
      />
      
      <!-- Weapon Slot -->
      <SlotComponent
        :item="weaponSlot"
        slot-type="weapon"
        :is-desktop="isDesktop"
        :is-mobile="isMobile"
        class="md:col-start-3"
        @click="openModal('weapon')"
      />
      
      <!-- Body Slot -->
      <SlotComponent
        :item="bodySlot"
        slot-type="body"
        :is-desktop="isDesktop"
        :is-mobile="isMobile"
        class="md:col-start-2 md:row-start-2"
        @click="openModal('body')"
      />
      
      <!-- Legs Slot -->
      <SlotComponent
        :item="legSlot"
        slot-type="legs"
        :is-desktop="isDesktop"
        :is-mobile="isMobile"
        class="md:col-start-2 md:row-start-3"
        @click="openModal('legs')"
      />
      
      <!-- Accessory Slots -->
      <SlotComponent
        v-for="index in accessorySlotCount"
        :key="index - 1"
        :item="accessorySlots[index - 1]"
        slot-type="accessory"
        :is-desktop="isDesktop"
        :is-mobile="isMobile"
        :class="{
          'md:col-start-1': index <= 3,
          'md:col-start-4': index > 3,
          'md:row-start-1': index === 1 || index === 4,
          'md:row-start-2': index === 2 || index === 5,
          'md:row-start-3': index === 3 || index === 6
        }"
        @click="openModal('accessory', index - 1)"
      />
    </div>

    <!-- Modal to select items for a specific slot -->
    <ItemSelectionModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :slot-type="selectedSlotType"
      :slot-index="selectedSlotIndex"
      :items="availableItemsForSlot"
      @select-item="equipItem"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SlotComponent from './SlotComponent.vue'
import ItemSelectionModal from './ItemSelectionModal.vue' // Renamed import
import { useEquipmentStore } from '@/stores/equipmentStore'
import { useWindowSize } from '@vueuse/core'
import {Item} from '@/types/items/itemRegistry'
import {useInventoryStore} from '@/stores/inventoryStore'

const equipmentStore = useEquipmentStore()
const inventoryStore = useInventoryStore()
const { width } = useWindowSize()
const mobileBreakpoint = 640
const isMobile = computed(() => width.value < mobileBreakpoint)
const isDesktop = computed(() => !isMobile.value)

// Slots data
const headSlot = computed(() => equipmentStore.equippedItems.head)
const bodySlot = computed(() => equipmentStore.equippedItems.body)
const legSlot = computed(() => equipmentStore.equippedItems.legs)
const weaponSlot = computed(() => equipmentStore.equippedItems.weapon)
const accessorySlots = computed(() => equipmentStore.equippedItems.accessories)
const accessorySlotCount = computed(() => equipmentStore.maxAccessories)

// Calculate number of columns needed based on accessory count
const accessoryColumns = computed(() => {
  return Math.ceil(accessorySlotCount.value / 3) // Ensure there are always 3 rows
})

// Modal state
const isModalOpen = ref(false)
const selectedSlotType = ref('')
const selectedSlotIndex = ref(null)
const availableItemsForSlot = ref([])

// Open modal function
const openModal = (slotType: string, index: number | null = null) => {
  selectedSlotType.value = slotType
  selectedSlotIndex.value = index
  availableItemsForSlot.value = equipmentStore.getAvailableItemsForSlot(slotType) // Fetch unlocked items
  isModalOpen.value = true
}

// Close modal function
const closeModal = () => {
  isModalOpen.value = false
}

// Equip item function
const equipItem = async (item?: Item) => {
  if (!item) {
    await equipmentStore.unequipItem(selectedSlotType.value, selectedSlotIndex.value)
    closeModal()
    return
  }

  await equipmentStore.equipItem(item, selectedSlotType.value, selectedSlotIndex.value)
  closeModal()
}
</script>

<style scoped>
.slot {
  @apply aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center bg-black bg-opacity-10;
}
</style>
