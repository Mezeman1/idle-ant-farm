<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h3 class="text-lg font-semibold mb-3">
      {{ title }}
    </h3>
    <div class="space-y-3">
      <StatusEffectBar
        name="Poison"
        :percentage="poisonChance"
        color="green"
      />
      <StatusEffectBar
        name="Bleed"
        :percentage="bleedChance"
        color="red"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusEffectBar from '@/components/StatusEffectBar.vue'

defineProps<{
  title: string
  poisonChance: string
  bleedChance: string
}>()
</script>
