<template>
  <div class="max-h-half-screen overflow-y-auto">
    <p class="text-sm">
      Here we'll show the bonuses and effects of the items in the inventory.
    </p>
    <section
      ref="gridContainer"
      class="grid-stack"
    >
      <!-- Loop through all slots, including empty slots -->
      <div
        v-for="(slot, index) in gridSlots"
        :key="'component'+index"
        :gs-id="index"
        class="grid-stack-item"
        :gs-x="slot.gridPosition.x"
        :gs-y="slot.gridPosition.y"
        :gs-h="slot.gridPosition.h"
        :gs-w="slot.gridPosition.w"
        gs-auto-position="true"
      >
        <div
          v-if="slot.component"
          class="grid-stack-item-content bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 border border-gray-300"
        >
          <component
            :is="slot.component.name"
            v-bind="{ ...slot.component.props }"
          />
        </div>
        <div
          v-else
          class="grid-stack-item-content empty-slot border border-gray-300"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import 'gridstack/dist/gridstack.min.css'
import {GridStack} from 'gridstack'
import {computed, onMounted, ref, watch} from 'vue'
import InventoryItem from '../components/InventoryItem.vue'
import {useWindowSize} from '@vueuse/core'
import {useInventoryStore} from '../stores/inventoryStore'

const {width, height} = useWindowSize() // Get the window size
const inventoryStore = useInventoryStore() // Use the inventory store to get the items
const totalSlots = computed(() => inventoryStore.maxInventory) // Total slots in the grid

// Determine the number of columns based on screen size (responsive)
const amountOfColumns = computed(() => width.value > 768 ? 10 : 5) // Use 12 columns for large screens, 6 for smaller ones

// Compute the grid slots (items + empty slots)
const gridSlots = computed(() => {
  const slots = []
  for (let i = 0; i < totalSlots.value; i++) {
    const item = inventoryStore.inventory[i]
    const x = i % amountOfColumns.value // Calculate column
    const y = Math.floor(i / amountOfColumns.value) // Calculate row
    slots.push({
      component: item ? {
        name: InventoryItem,
        props: {
          item,
        },
      } : null,
      gridPosition: {x, y, w: 1, h: 1},
    })
  }
  return slots
})

// GridStack Initialization
const gridContainer = ref(null) // Reference to the scrollable grid container
const grid = ref<any>(null)

onMounted(() => {
  grid.value = GridStack.init({
    column: amountOfColumns.value,
    disableResize: true,
    disableDrag: true,
    float: false,
    scrollContainer: gridContainer.value, // Set the scroll container to the grid section
  })

  grid.value.on('added removed change', () => {
      grid.value.compact()
  })
})

// Watch to update grid when window size changes
watch([amountOfColumns], () => {
  grid.value.column(amountOfColumns.value, 'list')
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
</style>
