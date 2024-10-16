<template>
  <button
    v-tooltip="tooltipText"
    class="slot rounded-lg shadow-md flex items-center justify-center p-1 relative"
    :class="[
      slotClasses,
    ]"
    tabindex="0"
    role="button"
    :style="{
      backgroundImage: item?.image ? `url(${item.image})` : '',
      backgroundSize: item?.image ? 'cover' : '',
      backgroundPosition: item?.image ? 'center' : '',
    }"
  >
    <p
      class="font-bold text-center break-words absolute z-10"
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
        <span>{{ item.set }} {{ currentEquippedItems }}/{{ setTotalItems }} equipped</span>
      </span>
    </p>

    <div
      v-if="item?.image"
      class="absolute inset-0 bg-opacity-50 rounded-lg"
      :class="slotClasses"
    />
  </button>
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

const slotClasses = computed(() => {
  return {
    'bg-gray-700 text-white': !props.item,
    'bg-green-500 text-white': props.item && (props.slotType === 'head' || props.item?.slotType === 'head'),
    'bg-blue-500 text-white': props.item && (props.slotType === 'body' || props.item?.slotType === 'body'),
    'bg-purple-500 text-white': props.item && (props.slotType === 'legs' || props.item?.slotType === 'legs'),
    'bg-red-500 text-white': props.item && (props.slotType === 'weapon' || props.item?.slotType === 'weapon'),
    'bg-yellow-500 text-white': props.item && (props.slotType === 'accessory' || props.item?.slotType === 'accessory'),
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
