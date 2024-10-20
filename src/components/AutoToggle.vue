<!-- AutoToggle.vue -->
<template>
  <div class="w-full flex">
    <label
      v-if="isUnlocked"
      class="flex items-center cursor-pointer"
    >
      <span class="mr-3 text-xs text-gray-600">{{ label }}</span>
      <div class="relative">
        <!-- Hidden checkbox for v-model binding -->
        <input
          v-model="internalValue"
          type="checkbox"
          class="sr-only"
        >
        <!-- Toggle background color (green for on, red for off) -->
        <div
          :class="internalValue ? 'bg-green-500' : 'bg-red-500'"
          class="block w-10 h-6 rounded-full shadow-inner transition-colors"
        />
        <!-- Dot inside the toggle switch -->
        <div
          :class="internalValue ? 'translate-x-full' : 'translate-x-0'"
          class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps, defineEmits } from 'vue'

// Define the props and emits
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  isUnlocked: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// Use a computed property to avoid direct mutation of props
const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>
