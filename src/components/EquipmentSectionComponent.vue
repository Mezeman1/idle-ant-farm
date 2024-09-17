<!-- EquipmentSectionComponent.vue -->
<template>
  <div class="max-w-screen-lg mx-auto">
    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
      <!-- Accessory Slots -->
      <div class="space-y-2">
        <SlotComponent
          :item="accessorySlots[0]"
          slot-type="accessory"
          :index="0"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
        <SlotComponent
          :item="accessorySlots[1]"
          slot-type="accessory"
          :index="1"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
      </div>
      <!-- Head, Body, Legs Slots -->
      <div class="space-y-2">
        <SlotComponent
          :item="headSlot"
          slot-type="head"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
        <SlotComponent
          :item="bodySlot"
          slot-type="body"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
        <SlotComponent
          :item="legSlot"
          slot-type="legs"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
      </div>
      <!-- Weapon Slot -->
      <div class="space-y-2">
        <SlotComponent
          :item="weaponSlot"
          slot-type="weapon"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          @start-drag-from-slot="startDragFromSlot"
          @drag-end="onDragEnd"
          @handle-drop="handleDrop"
          @double-click-unequip="handleDoubleClickUnequip"
          @show-context-menu="showContextMenu"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SlotComponent from './SlotComponent.vue'
import { useEquipmentStore } from '../stores/equipmentStore'
import { useWindowSize } from '@vueuse/core'

const equipmentStore = useEquipmentStore()
const emit = defineEmits([
  'start-drag-from-slot',
  'drag-end',
  'handle-drop',
  'double-click-unequip',
  'show-context-menu',
])

const { width } = useWindowSize()
const mobileBreakpoint = 640
const isMobile = computed(() => width.value < mobileBreakpoint)
const isDesktop = computed(() => !isMobile.value)

const headSlot = computed(() => equipmentStore.equippedItems.head)
const bodySlot = computed(() => equipmentStore.equippedItems.body)
const legSlot = computed(() => equipmentStore.equippedItems.legs)
const weaponSlot = computed(() => equipmentStore.equippedItems.weapon)
const accessorySlots = computed(() => equipmentStore.equippedItems.accessories)

const startDragFromSlot = (item: any, slotType: string, index: number | null, event: DragEvent) => {
  emit('start-drag-from-slot', item, slotType, index, event)
}

const onDragEnd = () => {
  emit('drag-end')
}

const handleDrop = (slotType: string, index: number | null, event: DragEvent) => {
  emit('handle-drop', slotType, index, event)
}

const handleDoubleClickUnequip = (item: any, slotType: string, index: number | null) => {
  emit('double-click-unequip', item, slotType, index)
}

const showContextMenu = (item: any, slotType: string, index: number | null, event: MouseEvent) => {
  emit('show-context-menu', item, slotType, index, event)
}
</script>
