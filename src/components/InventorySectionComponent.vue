<!-- InventorySectionComponent.vue -->
<template>
  <div>
    <div
      class="mt-4"
      @drop="handleDropIntoInventory"
      @dragover.prevent
    >
      <div :class="gridClasses">
        <SlotComponent
          v-for="(slot, index) in displayInventorySlots"
          :key="index"
          :item="slot"
          slot-type="inventory"
          :index="index"
          :is-desktop="isDesktop"
          :is-mobile="isMobile"
          :is-inventory-slot="true"
          @start-drag="startDrag"
          @drag-end="onDragEnd"
          @double-click-equip="handleDoubleClickEquip"
          @show-context-menu="showContextMenu"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import SlotComponent from './SlotComponent.vue'
import {useInventoryStore} from '../stores/inventoryStore'
import {useWindowSize} from '@vueuse/core'

const inventoryStore = useInventoryStore()

const emit = defineEmits([
  'start-drag',
  'drag-end',
  'double-click-equip',
  'show-context-menu',
  'handle-drop-into-inventory',
])

const {width} = useWindowSize()
const mobileBreakpoint = 640
const isMobile = computed(() => width.value < mobileBreakpoint)
const isDesktop = computed(() => !isMobile.value)

const maxInventory = computed(() => inventoryStore.maxInventory)

const equipmentItems = computed(() =>
  inventoryStore.inventory.filter((item) => item.type === 'equipment') ?? [],
)

const emptySlots = computed(() => Math.max(maxInventory.value - equipmentItems.value.length, 1))

const displayInventorySlots = computed(() => {
  return [...equipmentItems.value, ...Array(emptySlots.value).fill(null)]
})

const gridClasses = computed(() => {
  return isDesktop.value ? 'grid grid-cols-4 md:grid-cols-8 gap-2' : 'grid grid-cols-3 sm:grid-cols-4 gap-2'
})

const startDrag = (item: any, event: DragEvent) => {
  emit('start-drag', item, event)
}

const onDragEnd = () => {
  emit('drag-end')
}

const handleDoubleClickEquip = (item: any) => {
  emit('double-click-equip', item)
}

const showContextMenu = (item: any, slotType: string, index: number | null, event: MouseEvent) => {
  emit('show-context-menu', item, slotType, index, event)
}

const handleDropIntoInventory = (event: DragEvent) => {
  emit('handle-drop-into-inventory', event)
}
</script>
