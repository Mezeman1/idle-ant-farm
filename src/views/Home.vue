<template>
  <div
    v-if="gameStore.loaded"
    class="relative h-screen w-screen overflow-hidden"
  >
    <AntSimulation
      :ant-count="gameStore.ants"
      :queen-count="gameStore.queens"
      :larvae-count="gameStore.larvae"
    />

    <div class="top-0 left-0 absolute h-screen w-screen overflow-hidden text-xs">
      <!-- Minimize/Maximize Button -->
      <button
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded m-2 border-2"
        @click="isMinimized = !isMinimized"
      >
        {{ isMinimized ? 'Show UI' : 'Hide UI' }}
      </button>

      <button
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2"
        @click="gameStore.saveGameState()"
      >
        Save
      </button>
      <div
        v-show="!isMinimized"
        class="bg-white p-4 rounded shadow-lg flex flex-col space-y-2 m-2 bg-opacity-30"
      >
        <!--        Navigation       -->
        <div
          class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
        >
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <button
                :class="activeTab === 'resources' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                @click.prevent="setActiveTab('resources')"
              >
                Resources
              </button>
            </li>

            <li
              v-tooltip="gameStore.ants < 10 ? 'You need at least 10 ants to start an adventure.' : ''"
              class="me-2"
            >
              <button
                :disabled="gameStore.ants < 10"
                :class="activeTab === 'adventure' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 disabled:cursor-not-allowed"
                @click.prevent="setActiveTab('adventure')"
              >
                Adventure
              </button>
            </li>
            <li class="me-2">
              <button
                :class="activeTab === 'inventory' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                @click.prevent="setActiveTab('inventory')"
              >
                Inventory
              </button>
            </li>
            <li
              v-if="debugMode"
              class="me-2"
            >
              <button
                :class="activeTab === 'debugger' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 disabled:cursor-not-allowed"
                @click.prevent="setActiveTab('debugger')"
              >
                Debugger
              </button>
            </li>
          </ul>
        </div>
        <div>
          <AntResources v-show="activeTab === 'resources'" />
          <Adventure v-show="activeTab === 'adventure'" />
          <Inventory v-show="activeTab === 'inventory'" />
          <Debugger v-show="activeTab === 'debugger'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useGameStore} from '../stores/gameStore'
import AntSimulation from '../components/AntSimulation.vue'
import {storeToRefs} from 'pinia'
import AntResources from './AntResources.vue'
import Adventure from './Adventure.vue'
import Debugger from './Debugger.vue'
import {useAdventureStore} from '../stores/adventureStore'
import {useToast} from 'vue-toast-notification'
import Inventory from './Inventory.vue'

const gameStore = useGameStore()
const adventureStore = useAdventureStore()
const isMinimized = ref(false) // Minimized state
const activeTab = ref('resources')

// Classes for active and default tabs
const activeTabClasses = 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500'
const defaultTabClasses = 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
// Function to set the active tab
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const debugMode = import.meta.env.MODE === 'localhost'

// Function to handle game state saving before window unload
const handleBeforeUnload = () => {
  gameStore.saveGameState() // Save game state before leaving
}

onMounted(() => {
  gameStore.loadGameState() // Load game state and calculate offline progress
  gameStore.startGameLoop() // Start the game loop

  // Add event listeners for window close
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  gameStore.saveGameState() // Save game state before leaving
  gameStore.stopGameLoop() // Stop the game loop

  // Remove event listeners for window close
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const {
  ants,
} = storeToRefs(gameStore)

watch(ants, () => {
  gameStore.setupAdventureStats() // Setup adventure stats
  if (gameStore.ants > 10 && !adventureStore.isFighting) {
    adventureStore.toggleBattle(
      true,
    ) // Start the game loop

    const $toast = useToast()
    $toast.info('Adventure started! Check the Adventure tab for more details.', {
      duration: 5000,
    })
  }
}, {
  immediate: true,
})
</script>


<style scoped>
canvas {
  display: block;
}

div {
  z-index: 10;
}
</style>
