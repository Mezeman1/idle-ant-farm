<template>
  <div
    v-tooltip="tooltipText"
    class="slot bg-opacity-50 rounded-lg shadow-md flex items-center justify-center p-1"
    :class="slotClasses"
    :draggable="isDraggable"
    tabindex="0"
    role="button"
    :aria-label="getAriaLabel"
    @drop="onDrop"
    @dragover.prevent
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dblclick="onDoubleClick"
    @click="onClick"
    @keydown.space.prevent="onKeyDownSpace"
    @keydown.enter.prevent="onKeyDownSpace"
  >
    <p
      class="font-bold text-center break-words"
      :class="{'text-3xs': isMobile, 'text-xs': !isMobile }"
    >
      <span v-if="item">
        {{ item.name }}
        <span v-if="item.level"> (Level {{ item.level }})</span>
      </span>
      <span v-else>{{ defaultText }}</span>
      <span
        v-if="item && item.set"
        class="text-3xs sm:text-2xs"
      >
        <br>
        <span>{{ item.set }} {{ currentEquippedItems }}/{{ setTotalItems }}</span>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps} from 'vue'
import {useEquipmentStore} from '@/stores/equipmentStore'

const equipmentStore = useEquipmentStore()

const props = defineProps({
  item: Object,
  slotType: String,
  index: Number,
  isDesktop: Boolean,
  isMobile: Boolean,
  isInventorySlot: Boolean,
})

const emit = defineEmits([
  'start-drag',
  'start-drag-from-slot',
  'drag-end',
  'handle-drop',
  'double-click-equip',
  'double-click-unequip',
  'show-context-menu',
])

const currentEquippedItems = computed(() => {
  return equipmentStore.getEquipedSetSize(props.item?.set) || 0
})

const setTotalItems = computed(() => {
  return equipmentStore.getSetSize(props.item?.set) || 0
})

const defaultText = computed(() => {
  if (props.isInventorySlot) return 'Empty Slot'
  switch (props.slotType) {
    case 'head':
      return 'Head Slot'
    case 'body':
      return 'Body Slot'
    case 'legs':
      return 'Legs Slot'
    case 'weapon':
      return 'Weapon Slot'
    case 'accessory':
      return 'Accessory Slot'
    default:
      return 'Slot'
  }
})

const isDraggable = computed(() => {
  return !!props.item && props.isDesktop
})

const slotClasses = computed(() => {
  return {
    'bg-gray-700 text-white': !props.item,
    'bg-green-500 text-white': props.item && (props.slotType === 'head' || props.item?.slotType === 'head'),
    'bg-blue-500 text-white': props.item && (props.slotType === 'body' || props.item?.slotType === 'body'),
    'bg-purple-500 text-white': props.item && (props.slotType === 'legs' || props.item?.slotType === 'legs'),
    'bg-red-500 text-white': props.item && (props.slotType === 'weapon' || props.item?.slotType === 'weapon'),
    'bg-yellow-500 text-white': props.item && (props.slotType === 'accessory' || props.item?.slotType === 'accessory'),
    'cursor-pointer': props.isMobile && props.item,
    'cursor-move': props.isDesktop && props.item,
  }
})

const tooltipText = computed(() => {
  if (props.isDesktop && props.item) {
    let text = ''
    if (props.item.level) {
      text += `Level ${props.item.level}/${props.item.maxLevel}\n`
    }
    if (props.item.description) {
      text += props.item.description + '\n\n'
    }
    return text
  }
  return null
})

const onDragStart = (event: DragEvent) => {
  if (props.item) {
    if (props.isInventorySlot) {
      emit('start-drag', props.item, event)
    } else {
      emit('start-drag-from-slot', props.item, props.slotType, props.index, event)
    }
  }
}

const onDragEnd = () => {
  emit('drag-end')
}

const onDrop = (event: DragEvent) => {
  if (!props.isInventorySlot) {
    emit('handle-drop', props.slotType, props.index, event)
  }
}

const onDoubleClick = () => {
  if (props.item) {
    if (props.isInventorySlot) {
      emit('double-click-equip', props.item)
    } else {
      emit('double-click-unequip', props.item, props.slotType, props.index)
    }
  }
}

const onClick = (event: MouseEvent) => {
  if (props.isMobile && props.item) {
    emit('show-context-menu', props.item, props.slotType, props.index, event)
  }
}

// Accessibility: Handle Space key to equip/unequip item
const onKeyDownSpace = () => {
  if (props.item) {
    if (props.isInventorySlot) {
      emit('double-click-equip', props.item)
    } else {
      emit('double-click-unequip', props.item, props.slotType, props.index)
    }
  }
}

const getAriaLabel = () => {
  if (props.item) {
    return `Slot ${props.slotType}, press space to equip or unequip ${props.item?.name}`
  }

  return 'Empty Slot'
}
</script>

<style scoped>
.slot {
  @apply w-20 h-20;
}

@media (min-width: 640px) {
  .slot {
    @apply w-24 h-24;
  }
}

@media (min-width: 1024px) {
  .slot {
    @apply w-28 h-28;
  }
}
</style>
