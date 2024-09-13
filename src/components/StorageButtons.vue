<template>
  <div class="w-full flex gap-2">
    <button
      :disabled="disabled"
      class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
      @click="$emit('upgrade')"
    >
      Upgrade storage ({{ costString }})
    </button>
    <button
      :disabled="disabled"
      class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
      @click="$emit('upgradeMax')"
    >
      Max
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled: boolean
  costString: string
}

defineProps<Props>()

defineEmits([
  'upgrade',
  'upgradeMax',
])
</script>

<style scoped>

</style>
