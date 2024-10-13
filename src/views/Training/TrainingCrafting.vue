<template>
  <div>
    <!-- Crafting Skill Overview -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <h2 class="text-xl font-semibold">
        Crafting Skill
      </h2>
      <div class="flex justify-between items-center">
        <p class="text-lg">
          Level: {{ craftingLevel }}
        </p>
        <p class="text-lg">
          {{ formatNumber(craftingXp) }} / {{ formatNumber(craftingXpToNextLevel) }} XP
        </p>
      </div>
      <!-- XP Progress Bar -->
      <div class="relative mt-2 w-full h-3 bg-gray-200 rounded">
        <div
          class="absolute top-0 left-0 h-full bg-green-500 rounded"
          :style="{ width: `${(craftingXp / craftingXpToNextLevel) * 100}%` }"
        />
      </div>
    </div>

    <!-- Dynamic Crafting Recipes -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
      <div
        v-for="(recipe,) in craftingRecipes"
        :key="recipe.name"
        class="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        <h2 class="text-xl font-semibold mb-2">
          {{ recipe.name }} {{ trainingStore.amountCraftedItems(recipe.name) > 0 ? `(${formatNumber(trainingStore.amountCraftedItems(recipe.name), 0)})` : '' }}
        </h2>
        <p>
          {{ recipe.description }}
        </p>
        <p class="text-gray-700">
          Level Required: {{ recipe.levelRequired }}
        </p>
        <p class="text-gray-700">
          XP per Action: {{ formatNumber(recipe.xpPerAction) }}
        </p>
        <p class="text-gray-700">
          Time per Action: {{ formatNumber(recipe.initialTimePerAction, 1) }}s
        </p>
        <p
          class="text-gray-700"
        >
          Costs: {{ formattedCosts(recipe) }}
        </p>

        <div
          class="my-4"
        >
          <p class="text-gray-500">
            Crafting Progress
          </p>
          <div class="relative mt-1 w-full h-6 bg-gray-200 rounded-lg">
            <div
              class="absolute top-0 left-0 h-full bg-green-500 rounded-lg"
              :style="{ width: `${(recipe.timePerAction / recipe.initialTimePerAction) * 100}%` }"
            />
            <p class="absolute inset-0 text-center text-sm text-gray-800 leading-7">
              {{ formatNumber(recipe.timePerAction, 1) }}s remaining
            </p>
          </div>
        </div>


        <button
          v-if="trainingStore.activeCraftingRecipe !== recipe.name"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!trainingStore.canCraft(recipe)"
          @click="startCrafting(recipe.name)"
        >
          Craft {{ recipe.name }}
        </button>

        <button
          v-if="trainingStore.activeCraftingRecipe === recipe.name"
          class="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600"
          @click="trainingStore.stopCrafting"
        >
          Stop Crafting
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrainingStore } from '@/stores/trainingStore'
import { useGameStore } from '@/stores/gameStore'

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

// Start crafting action
function startCrafting(recipeName: string) {
  trainingStore.startCrafting(recipeName)
}
</script>

<style scoped>
/* Add your styles here if needed */
</style>
