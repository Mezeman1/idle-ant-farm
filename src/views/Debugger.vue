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
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.collectSeedsManually(1000)"
      >
        Add 1000 Seeds
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.larvae += 1000"
      >
        Add 1000 Larvae
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.ants += 100"
      >
        Add 100 Ants
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.ants += 1000"
      >
        Add 1000 Ants
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.ants += 1000000"
      >
        Add 1000000 Ants
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="gameStore.queens += 10"
      >
        Add 10 Queens
      </button>
      <button
        class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        @click="prestigeStore.prestigePoints += 1000"
      >
        Add 1000 prestige points
      </button>

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
          id: 'butterfly-wing',
          name: 'Butterfly Wing',
          amount: 1,
        })"
      >
        Give butterfly wings
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useInventoryStore} from '@/stores/inventoryStore'

const gameStore = useGameStore()
const prestigeStore = usePrestigeStore()

const inventoryStore = useInventoryStore()
</script>

<style scoped>

</style>
