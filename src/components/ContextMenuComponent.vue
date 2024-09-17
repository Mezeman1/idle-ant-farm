<!-- ContextMenuComponent.vue -->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50"
  >
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black opacity-50 z-50"
      @click="closeContextMenu"
    />
    <!-- Context Menu -->
    <div
      class="absolute bg-white shadow-lg rounded-lg p-4 z-60"
      :class="positionClass"
      :style="styles"
    >
      <p class="font-bold mb-2 text-center">
        {{ item?.name }}
      </p>
      <p
        v-if="item?.description"
        class="text-sm mb-2 text-center"
      >
        {{ item.description }}
      </p>
      <button
        v-if="action === 'equip'"
        class="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-full"
        @click="handleEquip"
      >
        Equip
      </button>
      <button
        v-if="action === 'unequip'"
        class="bg-red-500 text-white px-4 py-2 rounded w-full"
        @click="handleUnequip"
      >
        Unequip
      </button>
      <button
        class="mt-2 text-gray-500 w-full"
        @click="closeContextMenu"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps} from 'vue'

const props = defineProps({
  visible: Boolean,
  item: Object,
  action: String,
  slotType: String,
  index: Number,
  isMobile: Boolean,
  x: Number,
  y: Number,
})

const emit = defineEmits(['close', 'equip', 'unequip'])

const closeContextMenu = () => {
  emit('close')
}

const handleEquip = () => {
  emit('equip', props.item)
}

const handleUnequip = () => {
  emit('unequip', props.slotType, props.index)
}

const positionClass = computed(() => {
  return props.isMobile ? 'left-0 right-0 bottom-0 w-full' : ''
})

const styles = computed(() => {
  if (props.isMobile) {
    return {
      top: 'auto',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100%',
    }
  } else {
    return {
      top: props.y + 'px',
      left: props.x + 'px',
    }
  }
})
</script>

<style scoped>
.z-60 {
  z-index: 60;
}

.z-50 {
  z-index: 50;
}

@media (max-width: 639px) {
  /* Mobile styles */
  .context-menu-mobile {
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    border-radius: 0.5rem 0.5rem 0 0;
  }
}
</style>
