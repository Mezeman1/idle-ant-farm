<!-- SlotComponent.vue -->
<template>
  <div
    v-tooltip="tooltipText"
    class="slot bg-white bg-opacity-50 rounded-lg shadow-md flex items-center justify-center p-1"
    :class="slotClasses"
    :draggable="isDraggable"
    @drop="onDrop"
    @dragover.prevent
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dblclick="onDoubleClick"
    @click="onClick"
  >
    <p class="font-bold text-center text-xs break-words">
      <span v-if="item">
        {{ item.name }}
        <span v-if="item.level"> (Level {{ item.level }})</span>
      </span>
      <span v-else>{{ defaultText }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'

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
    'bg-gray-700 text-white': props.isInventorySlot,
    'cursor-pointer': props.isMobile && props.item,
    'cursor-move': props.isDesktop && props.item,
  }
})

const tooltipText = computed(() => {
  if (props.isDesktop && props.item) {
    let text = ''
    if (props.item.level) {
      text += `Level ${props.item.level}\n`
    }
    if (props.item.description) {
      text += props.item.description
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
</script>

<style scoped>
.slot {
  @apply w-16 h-16;
}

@media (min-width: 640px) {
  .slot {
    @apply w-20 h-20;
  }
}

@media (min-width: 1024px) {
  .slot {
    @apply w-24 h-24;
  }
}
</style>
