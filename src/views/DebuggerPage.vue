<template>
  <div class="grid grid-cols-1 gap-4 p-4 overflow-y-auto">
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
        @click="useEvolveStore().evolve()"
      >
        Evolve
      </button>
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        @click="maxAllResources()"
      >
        Max all resources
      </button>

      <button
        class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        @click="maxAllEquipped()"
      >
        Max all equipped
      </button>

      <div class="flex flex-col gap-2">
        <div
          v-for="(value, key) in resourcesStore.resources"
          :key="key + '-' + value"
          class="flex flex-col gap-1"
        >
          <label>{{ key }}</label>
          <input
            v-model="resourcesStore.resources[key]"
            class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            type="number"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label>
            Prestige Points
          </label>
          <input
            v-model="prestigeStore.prestigePoints"
            class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            type="number"
          >
        </div>

        <div class="flex flex-col gap-2">
          <label>
            Prestige Times
          </label>
          <input
            v-model="prestigeStore.timesPrestiged"
            class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            type="number"
          >
        </div>
      </div>

      <!-- Add item to inventory -->
      <div class="flex flex-col gap-2">
        <label>Select Item to Add:</label>
        <select
          v-model="selectedItem"
          class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          <option
            v-for="(item, index) in availableItems"
            :key="index"
            :value="item.id"
          >
            {{ getItemName(item) }}
          </option>
        </select>

        <label>Amount:</label>
        <input
          v-model="selectedAmount"
          class="bg-gray-100 px-4 py-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          type="number"
          min="1"
        >
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          @click="addItemToInventory"
        >
          Add to Inventory
        </button>
      </div>

      <!-- Example buttons for specific items (if needed) -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {useGameStore} from '../stores/gameStore'
import {usePrestigeStore} from '../stores/prestigeStore'
import {useInventoryStore} from '../stores/inventoryStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useEvolveStore} from '@/stores/evolveStore'
import {getItemName, itemRegistry} from '@/types/items/itemRegistry'
import {ref} from 'vue'
import { useEquipmentStore } from '@/stores/equipmentStore'

const gameStore = useGameStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()
const inventoryStore = useInventoryStore()
const availableItems = itemRegistry

// Variables for selected item and amount
const selectedItem = ref(availableItems[0].id)
const selectedAmount = ref(1)

// Function to add selected item to the inventory
const addItemToInventory = () => {
  const item = availableItems.find(i => i.id === selectedItem.value)
  if (item) {
    inventoryStore.addItemToInventory({
      id: item.id,
      name: item.name,
      amount: Number(selectedAmount.value),
    })
  }
}

// Function to max all resources
const maxAllResources = () => {
  resourcesStore.resources.seeds = resourcesStore.maxSeeds
  resourcesStore.resources.larvae = resourcesStore.maxLarvae
  resourcesStore.resources.ants = resourcesStore.maxAnts
  resourcesStore.resources.queens = resourcesStore.maxQueens
  if (gameStore.eliteAntsUnlocked) {
    resourcesStore.resources.eliteAnts = resourcesStore.storage.maxEliteAnts
  }
}

const maxAllEquipped = () => {
  const equipmentStore = useEquipmentStore()
  equipmentStore.maxAllEquipped()

}
</script>
