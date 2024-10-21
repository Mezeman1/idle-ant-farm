<template>
  <button
    class="px-4 py-2 rounded-lg font-bold text-white transition duration-200"
    :class="buttonClass"
    @click="$emit('click')"
  >
    {{ styleName }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  styleName: string
  isActive: boolean
}>()

const buttonClass = computed(() => {
  const baseClass = props.isActive ? 'border-2' : 'hover:opacity-80'
  switch (props.styleName.toLowerCase()) {
    case 'attack':
      return `${baseClass} ${props.isActive ? 'bg-blue-700 border-blue-900' : 'bg-blue-500'}`
    case 'block':
      return `${baseClass} ${props.isActive ? 'bg-green-700 border-green-900' : 'bg-green-500'}`
    case 'endure':
      return `${baseClass} ${props.isActive ? 'bg-red-700 border-red-900' : 'bg-red-500'}`
    default:
      return `${baseClass} bg-gray-500`
  }
})
</script>
