<!-- EquipmentSectionComponent.vue -->
<template>
  <div class="max-w-screen-lg mx-auto">
    <div class="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
      <!-- Accessory Slots -->
      <div class="space-y-2">
        <div @click="openModal('accessory', 0)">
          <SlotComponent
            :item="accessorySlots[0]"
            slot-type="accessory"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
        <div @click="openModal('accessory', 1)">
          <SlotComponent
            :item="accessorySlots[1]"
            slot-type="accessory"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
      </div>
      <!-- Head, Body, Legs Slots -->
      <div class="space-y-2">
        <div @click="openModal('head')">
          <SlotComponent
            :item="headSlot"
            slot-type="head"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
        <div @click="openModal('body')">
          <SlotComponent
            :item="bodySlot"
            slot-type="body"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
        <div @click="openModal('legs')">
          <SlotComponent
            :item="legSlot"
            slot-type="legs"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
      </div>
      <!-- Weapon Slot -->
      <div class="space-y-2">
        <div @click="openModal('weapon')">
          <SlotComponent
            :item="weaponSlot"
            slot-type="weapon"
            :is-desktop="isDesktop"
            :is-mobile="isMobile"
          />
        </div>
      </div>
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
    const unequippedItem = await equipmentStore.unequipItem(selectedSlotType.value, selectedSlotIndex.value)
    if (unequippedItem) {
      await inventoryStore.addItemToInventory({
        id: unequippedItem.id,
        amount: 1,
      })
    }

    closeModal()
    return
  }

  const success = await equipmentStore.equipItem(item, selectedSlotType.value, selectedSlotIndex.value)
  if (success) {
    await inventoryStore.removeItemFromInventory(item.id)

    closeModal()
  }
}
</script>
