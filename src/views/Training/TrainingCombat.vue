<template>
  <div class="bg-white rounded-lg shadow-md p-4 mb-2 border border-gray-200">
    <!-- Display each skill using the SkillDisplay component -->
    <SkillDisplay
      skill-name="Attack"
      :level="attackLevel"
      :xp="attackXp"
      :xp-to-next-level="attackXpToNextLevel"
      :milestones="trainingStore.combatMilestones.filter(milestone => milestone.type === 'attack')"
      :with-styling="false"
    />

    <SkillDisplay
      skill-name="Defense"
      :level="defenceLevel"
      :xp="defenceXp"
      :xp-to-next-level="defenceXpToNextLevel"
      :milestones="trainingStore.combatMilestones.filter(milestone => milestone.type === 'defense')"
      :with-styling="false"
    />

    <SkillDisplay
      skill-name="Hitpoints"
      :level="hitpointsLevel"
      :xp="hitpointsXp"
      :xp-to-next-level="hitpointsXpToNextLevel"
      :milestones="trainingStore.combatMilestones.filter(milestone => milestone.type === 'hitpoints')"
      :with-styling="false"
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
