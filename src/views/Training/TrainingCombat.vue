<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
    <h2 class="text-xl font-semibold">
      Combat Skills
    </h2>

    <!-- Display each skill using the SkillDisplay component -->
    <SkillDisplay
      skill-name="Attack"
      :level="attackLevel"
      :xp="attackXp"
      :xp-to-next-level="attackXpToNextLevel"
    />

    <SkillDisplay
      skill-name="Defense"
      :level="defenceLevel"
      :xp="defenceXp"
      :xp-to-next-level="defenceXpToNextLevel"
    />

    <SkillDisplay
      skill-name="Hitpoints"
      :level="hitpointsLevel"
      :xp="hitpointsXp"
      :xp-to-next-level="hitpointsXpToNextLevel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import SkillDisplay from '@/components/SkillDisplay.vue' // Import the SkillDisplay component

// Get the store
const trainingStore = useTrainingStore()

// Computed properties for attack, defense, and hitpoints
const attackLevel = computed(() => trainingStore.training.attack.level)
const attackXp = computed(() => trainingStore.training.attack.xp)
const attackXpToNextLevel = computed(() => trainingStore.training.attack.xpToNextLevel)

const defenceLevel = computed(() => trainingStore.training.defense.level)
const defenceXp = computed(() => trainingStore.training.defense.xp)
const defenceXpToNextLevel = computed(() => trainingStore.training.defense.xpToNextLevel)

const hitpointsLevel = computed(() => trainingStore.training.hitpoints.level)
const hitpointsXp = computed(() => trainingStore.training.hitpoints.xp)
const hitpointsXpToNextLevel = computed(() => trainingStore.training.hitpoints.xpToNextLevel)
</script>

<style scoped>
/* Add your styles here if needed */
</style>
