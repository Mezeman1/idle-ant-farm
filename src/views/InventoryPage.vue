<template>
  <div class="flex flex-col overflow-y-auto">
    <!-- Show the current selected item and action buttons -->
    <div
      v-if="activeItem"
      class="flex flex-col md:flex-row md:items-center md:justify-between p-4 border border-gray-300 rounded-lg mb-4 bg-white"
    >
      <div>
        <h3 class="font-bold text-lg md:text-xl">
          {{ activeItem.name }}
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
    <section
      ref="gridContainer"
      class="grid-stack overflow-y-auto"
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
            v-on="{ ...slot.component.on }"
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
import {useElementSize} from '@vueuse/core'
import {useInventoryStore} from '../stores/inventoryStore'
import {toast} from 'vue3-toastify'
import {v4 as uuidv4} from 'uuid'

const gridContainer = ref<HTMLElement>(null) // Reference to the scrollable grid container
const {width} = useElementSize(gridContainer)
const inventoryStore = useInventoryStore() // Use the inventory store to get the items
const totalSlots = computed(() => inventoryStore.maxInventory) // Total slots in the grid

// Determine the number of columns based on screen size (responsive)
// Determine the number of columns based on screen size (responsive)
const amountOfColumns = computed(() => {
  if (width.value > 1200) {
    return 10 // Large screens (desktops and larger)
  } else if (width.value > 800) {
    return 5 // Medium screens (tablets, smaller laptops)
  } else {
    return 3 // Small screens (mobile devices)
  }
})

const activeItem = ref(null) // Reference to the active item

const selectItem = (item) => {
  activeItem.value = item
}

const gridSlots = computed(() => {
  const slots = []
  const inventory = inventoryStore.inventory.filter(item => {
    if (props.onlyConsumables && item.type !== 'consumable') {
      return false
    }

    if (props.onlyPassive && item.type !== 'passive') {
      return false
    }

    return true
  })

  for (let i = 0; i < totalSlots.value; i++) {
    const item = inventory[i]
    const x = i % amountOfColumns.value // Calculate column
    const y = Math.floor(i / amountOfColumns.value) // Calculate row
    slots.push({
      component: item ? {
        name: InventoryItem,
        props: {
          item,
        },
        on: {
          setActiveItem: (item) => {
            selectItem(item)
          },
        },
      } : null,
      gridPosition: {x, y, w: 1, h: 1},
      uuid: uuidv4(),
    })
  }

  return slots
})

// GridStack Initialization
const grid = ref<any>(null)

onMounted(() => {
  grid.value = GridStack.addGrid(gridContainer.value, {
    column: amountOfColumns.value,
    disableResize: true,
    disableDrag: true,
    float: false,
    staticGrid: true,
    auto: true,
  })
})


// Watch to update grid when window size changes
watch([amountOfColumns], () => {
  grid.value.column(amountOfColumns.value, 'list')
})

const useItem = (itemId: string, amount = 1) => {
  if (useInventoryStore().useItem(itemId, amount)) {
    toast.success('Item used successfully', {
      position: 'top-left',
    })
  } else {
    toast.error('Failed to use item', {
      position: 'top-left',
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
</style>
