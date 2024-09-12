<template>
  <div
    v-if="gameStore.loaded && gameStore.loggedIn"
    class="relative h-screen w-screen overflow-hidden"
  >
    <AntSimulation
      v-if="gameStore.loaded && showBackground"
      :ant-count="gameStore.resources.ants"
      :queen-count="gameStore.resources.queens"
      :larvae-count="gameStore.resources.larvae"
    />

    <div class="top-0 left-0 absolute h-screen w-screen overflow-hidden text-xs">
      <!-- Minimize/Maximize Button -->
      <button
        class="bg-green-500 hover:bg-green-600 text-white font-bold rounded m-1 shadow text-xs small py-1 px-2"
        @click="isMinimized = !isMinimized"
      >
        {{ isMinimized ? 'Show UI' : 'Hide UI' }}
      </button>

      <button
        class="bg-green-500 hover:bg-green-600 text-white font-bold rounded m-1 shadow text-xs small py-1 px-2"
        @click="showBackground = !showBackground"
      >
        {{ showBackground ? 'Hide Background' : 'Show Background' }}
      </button>

      <button
        :disabled="!canSave"
        class="ml-auto text-white rounded shadow text-xs small py-1 px-2"
        :class="{
          'bg-gray-300 cursor-not-allowed': !canSave,
          'bg-blue-500': canSave
        }"
        @click="saveGameWithCooldown"
      >
        <span v-if="canSave">Save Game</span>
        <span v-else>Wait {{ timeLeft }}s</span>
      </button>

      <button
        class="bg-red-500 hover:bg-red-600 text-white font-bold rounded m-1 shadow text-xs small py-1 px-2"
        @click="gameStore.logout()"
      >
        Log out
      </button>


      <div
        v-show="!isMinimized"
        class="bg-white p-4 rounded shadow-lg flex flex-col space-y-2 m-2 bg-opacity-30"
      >
        <!--        Navigation       -->
        <div
          class="text-sm md:text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-x-auto overflow-y-hidden"
        >
          <ul class="flex flex-nowrap -mb-px justify-start space-x-4">
            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'resources' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-2xs md:text-sm"
                @click.prevent="setActiveTab('resources')"
              >
                Resources
              </button>
            </li>

            <li
              class="flex-shrink-0"
            >
              <button
                :class="activeTab === 'adventure' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 disabled:cursor-not-allowed text-2xs md:text-sm"
                @click.prevent="setActiveTab('adventure')"
              >
                Adventure
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'inventory' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-2xs md:text-sm"
                @click.prevent="setActiveTab('inventory')"
              >
                Inventory
              </button>
            </li>

            <li
              v-if="debugMode"
              class="flex-shrink-0"
            >
              <button
                :class="activeTab === 'debugger' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-2xs md:text-sm"
                @click.prevent="setActiveTab('debugger')"
              >
                Debugger
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'settings' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-2xs md:text-sm"
                @click.prevent="setActiveTab('settings')"
              >
                Settings
              </button>
            </li>
          </ul>
        </div>

        <div class="max-h-screen-3/4 overflow-y-auto">
          <AntResources v-show="activeTab === 'resources'" />
          <Adventure v-show="activeTab === 'adventure'" />
          <Inventory v-show="activeTab === 'inventory'" />
          <Debugger v-show="activeTab === 'debugger'" />
          <Settings v-show="activeTab === 'settings'" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div
      v-if="gameStore.loggedIn"
      class="flex flex-col items-center justify-center h-screen p-4"
    >
      <div class="w-full bg-gray-800 rounded-full h-6 overflow-hidden shadow-inner">
        <div
          class="bg-green-500 h-6 rounded-full shadow"
          :style="{ width: progress + '%' }"
        />
      </div>
      <p class="text-center mt-2 text-gray-800 font-bold">
        {{ progress.toFixed(0) }}% Complete
      </p>
    </div>
    <div v-else>
      <AntSimulation
        :queen-count="5"
        :ant-count="250"
        :larvae-count="200"
      />
      <div class="top-0 left-0 absolute h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
        <div class="flex flex-col bg-white bg-opacity-50 p-4 shadow-lg rounded-lg">
          <p>
            Welcome to your Idle Ant Farm! 🐜
          </p>
          <button
            v-if="!gameStore.loggedIn"
            v-tooltip="'Will save your progress and allow you to play on multiple devices.'"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2"
            @click="gameStore.loginUsingGoogle()"
          >
            Login using google
          </button>
          <p class="w-64">
            I disabled play as guest since it sometimes causes saving issues.
          </p>
          <!--          <button-->
          <!--            v-if="!gameStore.loggedIn"-->
          <!--            v-tooltip="'Will save progress for current session only, progress may be lost.'"-->
          <!--            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2"-->
          <!--            @click="gameStore.loginAsGuest()"-->
          <!--          >-->
          <!--            Play as guest-->
          <!--          </button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useGameStore} from '../stores/gameStore'
import AntSimulation from '../components/AntSimulation.vue'
import {storeToRefs} from 'pinia'
import AntResources from './AntResources.vue'
import Adventure from './Adventure.vue'
import Debugger from './Debugger.vue'
import Inventory from './Inventory.vue'
import firebase from 'firebase/compat'
import Settings from './Settings.vue'
import {useAdventureStore} from '../stores/adventureStore'

const gameStore = useGameStore()
const adventureStore = useAdventureStore()
const isMinimized = ref(false) // Minimized state
const showBackground = ref(true) // Show background state
const activeTab = ref('resources')
const progress = computed(() => {
  const gameProgress = gameStore.loaded ? 50 : (gameStore.progress / 2) // Half for game progress
  const adventureProgress = adventureStore.loaded ? 50 : (adventureStore.progress / 2) // Half for adventure progress
  return gameProgress + adventureProgress
})

// Classes for active and default tabs
const activeTabClasses = 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500'
const defaultTabClasses = 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
// Function to set the active tab
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const canSave = ref(true)
const timeLeft = ref(10) // Time left for the cooldown in seconds
let interval: number | null = null // To store the cooldown interval
let saveInterval: number | null = null // To store the auto-save interval

// Function to handle the cooldown on the save button
const saveGameWithCooldown = async () => {
  if (canSave.value) {
    canSave.value = false // Disable the button
    timeLeft.value = 10 // Set the countdown time

    await gameStore.saveGameState()

    // Start the countdown timer
    interval = setInterval(() => {
      timeLeft.value--

      // Re-enable the button when the countdown reaches 0
      if (timeLeft.value <= 0) {
        canSave.value = true
        clearInterval(interval as number) // Stop the timer
      }
    }, 1000) // Update every second
  }
}

const debugMode = import.meta.env.MODE === 'localhost'
const loggedInUser = computed(() => gameStore.loggedIn)

onMounted(() => {
  // Handle authentication state and game loading
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      console.log('User logged in')
      await gameStore.loadGameState() // Load game state and calculate offline progress
      gameStore.startGameLoop() // Start the game loop

      // Ensure only one interval is set
      if (!saveInterval) {
        // Save game state every 5 minutes (fallback for regular saves)
        saveInterval = window.setInterval(() => {
          gameStore.saveGameState()
        }, 60000 * 5)
      }

      // Add event listeners for window close (desktop) and visibility change (desktop + mobile)
      window.addEventListener('beforeunload', handleBeforeUnload) // Primarily for desktop
      document.addEventListener('visibilitychange', handleVisibilityChange) // Works for both desktop and mobile
    }
  })
})

onBeforeUnmount(async () => {
  if (!loggedInUser.value) return

  // Save game state and stop game loop before leaving
  await gameStore.saveGameState()
  gameStore.stopGameLoop()

  // Cleanup event listeners and intervals
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  // Clear intervals
  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
  }

  if (interval) {
    clearInterval(interval)
    interval = null
  }
})

// Function to handle visibility change (works on mobile)
function handleVisibilityChange() {
  if (document.hidden) {
    // Save game state when the tab goes into the background (or app is swiped away on mobile)
    console.log('Tab is hidden (backgrounded), saving game state...')
    gameStore.stopGameLoop()
    gameStore.saveGameState()
  } else {
    // Reload the game state when tab becomes visible again (optional, if needed)
    console.log('Tab is visible again, reloading game state...')
    gameStore.loadGameState()
    gameStore.startGameLoop()
  }
}

// Function to handle saving the game state before unloading the window (works on desktop only)
function handleBeforeUnload() {
  // Save game state
  gameStore.saveGameState()
}

watch(() => gameStore.resources.ants, () => {
  gameStore.setupAdventureStats()
}, {
  immediate: true,
})
</script>


<style lang="scss">
button {
  min-height: 50px;
  user-select: none;

  // Apply smaller styles only to buttons with the .small class
  &.small {
    min-height: 30px; // Smaller height for small buttons
  }

  // Apply general styles to buttons that are not .small
  &:not(.small) {
    min-height: 50px; // Default height for normal buttons
  }
}
</style>
