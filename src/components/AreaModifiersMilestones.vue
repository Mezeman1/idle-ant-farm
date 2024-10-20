<template>
  <div>
    <!-- Milestone Rewards Button -->
    <button
      class="text-blue-600 underline hover:text-blue-800 font-semibold focus:outline-none"
      @click="showMilestoneRewards = !showMilestoneRewards"
    >
      Milestone Rewards
    </button>

    <!-- Milestone Rewards List -->
    <div
      v-if="showMilestoneRewards"
      class="mt-4 overflow-y-auto"
      :style="{ maxHeight: '400px' }"
    >
      <ul class="divide-y divide-gray-200">
        <li
          v-for="milestone in adventureStore.milestones"
          :key="milestone.kills"
          class="py-2"
        >
          <div class="flex items-center space-x-2">
            <!-- Milestone Icon -->
            <span v-if="killCountsForCurrentArea >= milestone.kills">
              <!-- Unlocked Emoji -->
              ✅
            </span>
            <span v-else>
              <!-- Locked Emoji -->
              🔒
            </span>
            <!-- Milestone Title -->
            <div class="text-sm font-medium text-gray-800">
              {{ milestone.kills.toLocaleString() }} Kills
            </div>
          </div>
          <!-- Milestone Details -->
          <div class="mt-2 pl-6 text-sm text-gray-600">
            <!-- Milestone Modifiers -->
            <ul class="space-y-1">
              <li
                v-for="(value, modifier) in milestone.modifiers"
                :key="modifier"
                class="flex items-center"
              >
                <!-- Modifier Emoji -->
                <span class="mr-2">{{ modifierEmoji(modifier) }}</span>
                <!-- Modifier Text -->
                <span>
                  <span class="capitalize mr-1">{{ formatModifierName(modifier) }}:</span>
                  <span>{{ value }}</span>
                </span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAdventureStore } from '@/stores/adventureStore'

const adventureStore = useAdventureStore()

const showMilestoneRewards = ref(false)

const killCountsForCurrentArea = computed(() => {
  return adventureStore.killCountsForCurrentArea
})

// Format modifier names to be more readable
const formatModifierName = (modifier) => {
  return modifier
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
}

// Map modifiers to emojis
const modifierEmoji = (modifier) => {
  const emojiMap = {
    xpModifier: '✨',
    dropChanceModifier: '🎯',
    dropAmountModifier: '💰',
    speedModifier: '⚡',
    spawnTimeModifier: '⏳',
    coolDownModifier: '🔥',
  }
  return emojiMap[modifier] || '❓'
}
</script>

<style scoped>
/* Add custom styles if needed */
</style>
