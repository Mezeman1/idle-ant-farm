<template>
  <div>
    <SkillDisplay
      skill-name="Crafting"
      :level="craftingLevel"
      :xp="craftingXp"
      :xp-to-next-level="craftingXpToNextLevel"
      :milestones="trainingStore.craftingMilestones"
      class="mb-8"
    />

    <p class="text-lg font-semibold mb-6 text-gray-800">
      Active Crafting Recipes: {{ trainingStore.activeCraftingRecipes.length }} / {{ trainingStore.maxActiveCraftingRecipes }}
    </p>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
      <div
        v-for="recipe in craftingRecipes"
        :key="recipe.name"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ recipe.name }} {{ trainingStore.amountCraftedItems(recipe.name) > 0 ? `(${formatNumber(trainingStore.amountCraftedItems(recipe.name), 0)})` : '' }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          {{ recipe.description }}
        </p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Level Required
            </p>
            <p>{{ recipe.levelRequired }}</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              XP per Action
            </p>
            <p>{{ formatNumber(recipe.xpPerAction) }}</p>
          </div>
          <div class="text-sm">
            <p class="font-semibold text-gray-700">
              Time per Action
            </p>
            <p>{{ formatNumber(recipe.initialTimePerAction, 1) }}s</p>
          </div>
          <div class="text-sm col-span-2">
            <p class="font-semibold text-gray-700">
              Costs
            </p>
            <p>{{ formattedCosts(recipe) }}</p>
          </div>
          <div class="text-sm col-span-2">
            <p class="font-semibold text-gray-700">
              Amount Stored
            </p>
            <p>{{ formattedAmountStoredFromCosts(recipe) }}</p>
          </div>
        </div>

        <!-- Crafting Progress Bar -->
        <div
          v-if="isRecipeActive(recipe.name)"
          class="mb-4"
        >
          <p class="text-sm font-semibold text-gray-700 mb-1">
            Crafting Progress
          </p>
          <div class="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="absolute top-0 left-0 h-full bg-green-500 rounded-ful"
              :style="{ width: `${(1 - recipe.timePerAction / recipe.initialTimePerAction) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-xs text-white font-semibold leading-4">
              {{ formatNumber(recipe.timePerAction, 1) }}s remaining
            </p>
          </div>
        </div>

        <!-- Start/Stop Crafting Buttons -->
        <div class="flex justify-between">
          <button
            v-if="!isRecipeActive(recipe.name)"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            :disabled="!trainingStore.canCraft(recipe)"
            @click="startCrafting(recipe.name)"
          >
            Craft {{ recipe.name }}
          </button>

          <button
            v-if="isRecipeActive(recipe.name)"
            class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors duration-200"
            @click="stopCrafting(recipe.name)"
          >
            Stop Crafting
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import { useGameStore } from '@/stores/gameStore'
import SkillDisplay from '@/components/SkillDisplay.vue'

// Get the store
const trainingStore = useTrainingStore()
const gameStore = useGameStore()

const formatNumber = gameStore.formatNumber

// Computed properties for crafting
const craftingLevel = computed(() => trainingStore.training.crafting.level)
const craftingXp = computed(() => trainingStore.training.crafting.xp)
const craftingXpToNextLevel = computed(() => trainingStore.training.crafting.xpToNextLevel)
const craftingRecipes = computed(() => trainingStore.craftingRecipes)

const formattedCosts = (recipe) => {
  return Object.entries(recipe.cost).map(([resource, amount]) => `${formatNumber(amount, 0)} ${resource}`)
    .join(', ')
}

const formattedAmountStoredFromCosts = (recipe) => {
  return Object.entries(recipe.cost).map(([resource, amount]) => {
    const stored = trainingStore.resourcesCollected[resource] || 0
    return `${formatNumber(stored, 0)} ${resource}`
  }).join(', ')
}

// Check if a recipe is currently being crafted
const isRecipeActive = (recipeName: string) => {
  return trainingStore.activeCraftingRecipes.includes(recipeName)
}

// Start crafting action
function startCrafting(recipeName: string) {
  trainingStore.startCrafting(recipeName)
}

// Stop crafting action
function stopCrafting(recipeName: string) {
  trainingStore.stopCrafting(recipeName)
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
