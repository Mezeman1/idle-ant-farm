<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Active Item Display -->
    <div
      v-if="activeItem"
      ref="activeItemBox"
      class="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-300 rounded-lg mb-2 bg-white"
    >
      <div>
        <h3 class="font-bold text-lg md:text-xl">
          {{ getItemName(activeItem) }}
        </h3>
        <p class="text-sm md:text-base mt-2">
          {{ activeItem.description }}
        </p>
      </div>

      <div
        v-if="activeItem.type === 'consumable'"
        class="flex gap-2 mt-4 md:mt-0"
      >
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          @click="useItem(activeItem.id)"
        >
          Use
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          @click="useItem(activeItem.id, 10)"
        >
          Use 10
        </button>
      </div>
    </div>

    <!-- Inventory Grid -->
    <div 
      ref="gridContainer"
      class="grid gap-3 p-4 overflow-y-auto"
      :class="gridClass"
    >
      <InventoryItem
        v-for="item in filteredInventory"
        :key="item.id"
        :item="item"
        :is-selected="activeItem?.id === item.id"
        @click="selectItem(item)"
      />
      <div
        v-for="emptySlot in emptySlots"
        :key="'empty-' + emptySlot"
        class="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 aspect-square flex items-center justify-center"
      >
        <span class="text-gray-400 text-2xl">+</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useInventoryStore } from '../stores/inventoryStore'
import { toast } from 'vue3-toastify'
import { getItemName } from '@/types/items/itemRegistry'
import InventoryItem from '../components/InventoryItem.vue'

const gridContainer = ref<HTMLElement | null>(null)
const { width } = useElementSize(gridContainer)
const inventoryStore = useInventoryStore()

const activeItem = ref(null)
const activeItemBox = ref(null)

const selectItem = (item) => {
  activeItem.value = item === activeItem.value ? null : item
  if (activeItem.value) {
    nextTick(() => {
      activeItemBox.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

const gridColumns = computed(() => {
  if (width.value > 1200) return 10
  if (width.value > 800) return 6
  if (width.value > 600) return 4
  return 3
})

const gridClass = computed(() => {
  return `grid-cols-${gridColumns.value}`
})

const filteredInventory = computed(() => {
  return inventoryStore.inventory.filter(item => {
    if (props.onlyConsumables && item.type !== 'consumable') return false
    if (props.onlyPassive && item.type !== 'passive') return false
    return true
  })
})

const emptySlots = computed(() => {
  const emptyCount = inventoryStore.maxInventory - filteredInventory.value.length
  return emptyCount > 0 ? Array(emptyCount).fill(null) : []
})

const useItem = (itemId: string, amount = 1) => {
  if (inventoryStore.useItem(itemId, amount)) {
    toast.success('Item used successfully', {
      position: 'top-left',
      toastId: 'use-item-toast',
    })
  } else {
    toast.error('Failed to use item', {
      position: 'top-left',
      toastId: 'use-item-toast',
    })
  }

  if (!inventoryStore.hasItem(itemId)) {
    activeItem.value = null
  }
}

const props = withDefaults(defineProps<{
  onlyConsumables?: boolean
  onlyPassive?: boolean
}>(), {
  onlyConsumables: false,
  onlyPassive: false,
})
</script>

<style scoped lang="scss">
.grid-stack {
  border-style: dashed;
  padding: 10px;
  grid-gap: 10px; /* Add space between slots */
}

.grid-stack-item {
  padding: 4px;

  @media (min-width: 768px) {
    padding: 8px; /* Larger padding for larger screens */
  }
}

.grid-stack-item-content {
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb; /* Default border color for slots */

}

.gs-id-0 > .grid-stack-item > .grid-stack-item-content {
  inset: 2px;
}

.grid-stack-item-content.empty-slot {
  background-color: rgba(245, 245, 245, 0.5); /* Light background for empty slots */
}

.grid-stack-item-content:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

$columns: 3;
@function fixed($float) {
  @return round($float * 1000) / 1000; // total 2+3 digits being %
}

.gs-#{$columns} > .grid-stack-item {

  width: fixed(100% / $columns);

  @for $i from 1 through $columns - 1 {
    &[gs-x='#{$i}'] {
      left: fixed((100% / $columns) * $i);
    }
    &[gs-w='#{$i+1}'] {
      width: fixed((100% / $columns) * ($i+1));
    }
  }
}

$columns: 5;
@function fixed($float) {
  @return round($float * 1000) / 1000; // total 2+3 digits being %
}

.gs-#{$columns} > .grid-stack-item {

  width: fixed(100% / $columns);

  @for $i from 1 through $columns - 1 {
    &[gs-x='#{$i}'] {
      left: fixed((100% / $columns) * $i);
    }
    &[gs-w='#{$i+1}'] {
      width: fixed((100% / $columns) * ($i+1));
    }
  }
}

$columns: 10;
@function fixed($float) {
  @return round($float * 1000) / 1000; // total 2+3 digits being %
}

.gs-#{$columns} > .grid-stack-item {

  width: fixed(100% / $columns);

  @for $i from 1 through $columns - 1 {
    &[gs-x='#{$i}'] {
      left: fixed((100% / $columns) * $i);
    }
    &[gs-w='#{$i+1}'] {
      width: fixed((100% / $columns) * ($i+1));
    }
  }
}

.grid {
  grid-auto-rows: 1fr;
}

.grid::before {
  content: '';
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.grid > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

@media (max-width: 640px) {
  .grid {
    gap: 0.5rem;
  }
}
</style>
