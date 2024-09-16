<template>
  <div class="grid grid-cols-1 gap-4 p-4 max-h-half-screen overflow-y-auto">
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        @click="gameStore.resetGameState(true)"
      >
        Reset Game
      </button>
    </div>
    <div class="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
      <label>
        Delta Multiplier: {{ gameStore.deltaMultiplier }}
      </label>
      <input
        v-model="gameStore.deltaMultiplier"
        class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        type="range"
        :min="0"
        :max="10"
      >
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        @click="maxAllResources()"
      >
        Max all resources
      </button>

      <div class="flex flex-col gap-2">
        <div
          v-for="(value, key) in gameStore.resources"
          :key="value"
          class="flex flex-col gap-1"
        >
          <label>{{ key }}</label>
          <input
            v-model="gameStore.resources[key]"
            class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            type="number"
          >
        </div>
      </div>

      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="inventoryStore.addItemToInventory({
          id: 'queen-crown',
          name: 'Queen Crown',
          amount: 1,
        })"
      >
        Give queen crown
      </button>

      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="inventoryStore.addItemToInventory({
          id: 'grasshopper-leg',
          name: 'Grasshopper Leg',
          amount: 1000,
        })"
      >
        Give 1000 Grasshopper legs
      </button>

      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="inventoryStore.addItemToInventory({
          id: 'ant-strength-potion',
          name: 'Ant Strength Potion',
          amount: 1000,
        })"
      >
        Give 1000 Ant Strength Potions
      </button>

      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="inventoryStore.addItemToInventory({
          id: 'butterfly-wing',
          name: 'Butterfly Wing',
          amount: 1,
        })"
      >
        Give butterfly wings
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="inventoryStore.addItemToInventory({
          id: 'underworld-crown',
          name: 'Underworld Crown',
          amount: 1,
        })"
      >
        Give underworld crown
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {usePrestigeStore} from '../stores/prestigeStore'
import {useInventoryStore} from '../stores/inventoryStore'

const gameStore = useGameStore()
const prestigeStore = usePrestigeStore()

const inventoryStore = useInventoryStore()

const maxAllResources = () => {
  gameStore.resources.seeds = gameStore.storage.maxSeeds
  gameStore.resources.larvae = gameStore.storage.maxLarvae
  gameStore.resources.ants = gameStore.storage.maxAnts
  gameStore.resources.queens = gameStore.storage.maxQueens
  if (gameStore.eliteAntsUnlocked) {
    gameStore.resources.eliteAnts = gameStore.storage.maxEliteAnts
  }
}
</script>

<style scoped>

</style>
