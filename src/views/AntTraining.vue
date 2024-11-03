<template>
  <div class="bg-white rounded shadow-lg flex flex-col sm:flex-row space-y-2 bg-opacity-50 h-[calc(100vh-123px)] sm:h-[calc(100vh-65px)]">
    <!-- Content Section -->
    <div class="flex flex-col flex-1 overflow-y-auto p-2">
      <TrainingResources />

      <!-- Add this section to show the XP multiplier -->
      <div
        v-if="xpMultiplier > 1"
        class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-2"
      >
        <p class="font-bold">
          XP Boost Active!
        </p>
        <p>All training XP gains are multiplied by {{ xpMultiplier }}x</p>
      </div>

      <TrainingMining v-if="activeTab === 'mining'" />
      <TrainingCrafting v-if="activeTab === 'crafting'" />
      <TrainingCombat v-if="activeTab === 'combat'" />
      <TrainingFarming v-if="activeTab === 'farming'" />
    </div>

    <!-- Tab Navigation -->
    <nav class="bg-gray-800 text-white">
      <div class="flex items-center justify-between px-2 py-1 overflow-x-auto">
        <!-- Left Side Tabs -->
        <div class="flex flex-row sm:flex-col gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            :disabled="tab.disabled"
            :class="[
              activeTab === tab.name
                ? 'bg-blue-600 hover:bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600',
              'px-3 py-2 rounded text-sm font-medium flex justify-between items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50'
            ]"
            @click.prevent="setActiveTab(tab.name)"
          >
            <i
              class="ml-1"
              :class="tab.icon ?? ''"
            />
            {{ tab.label }}
            <span 
              v-if="!isTrainingActive(tab.name)" 
              class="text-xs bg-yellow-500 text-gray-800 px-1 py-0.5 rounded-full"
            >
              Inactive
            </span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import TrainingResources from '@/views/Training/TrainingResources.vue'
import TrainingMining from '@/views/Training/TrainingMining.vue'
import TrainingCrafting from '@/views/Training/TrainingCrafting.vue'
import { storeToRefs } from 'pinia'
import TrainingCombat from '@/views/Training/TrainingCombat.vue'
import TrainingFarming from '@/views/Training/TrainingFarming.vue'
import { Skill } from '@/types/trainingTypes'

// Get the training store
const trainingStore = useTrainingStore()

// Tabs management
const tabs = ref([
  { name: 'mining', label: 'Mining', icon: 'fas fa-pickaxe', disabled: false },
  { name: 'crafting', label: 'Crafting', icon: 'fas fa-hammer', disabled: false },
  { name: 'combat', label: 'Combat', icon: 'fas fa-swords', disabled: false },
  { name: 'farming', label: 'Farming', icon: 'fas fa-seedling', disabled: false },
])

const {
  activeTab,
  xpMultiplier,
} = storeToRefs(trainingStore)

// Set the active tab
function setActiveTab(tabName: string) {
  activeTab.value = tabName
}

// Check if training is active for a given tab
const isTrainingActive = computed(() => (tabName: string) => {
  switch (tabName) {
    case 'mining':
      return trainingStore.activeTrainings.includes(Skill.Mining)
    case 'crafting':
      return trainingStore.activeTrainings.includes(Skill.Crafting)
    case 'combat':
    case 'farming':
      return true
    default:
      return false
  }
})
</script>
