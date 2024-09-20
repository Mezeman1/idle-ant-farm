<template>
  <div
    v-if="gameStore.loaded && gameStore.loggedIn"
    class="relative h-screen w-screen overflow-hidden"
  >
    <AntSimulation
      v-if="gameStore.loaded && settingsStore.showBackground"
      :show-animation="settingsStore.showAnimation"
      :ant-count="resourcesStore.resources.ants"
      :queen-count="resourcesStore.resources.queens"
      :larvae-count="resourcesStore.resources.larvae"
      :elite-count="resourcesStore.resources.eliteAnts"
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
        class="bg-white p-4 rounded shadow-lg flex flex-col space-y-2 m-2 bg-opacity-50"
      >
        <!--        Navigation       -->
        <div
          class="text-sm md:text-sm font-medium text-center text-gray-700 border-b border-gray-300 dark:text-gray-200 dark:border-gray-600 overflow-x-auto overflow-y-hidden"
        >
          <ul class="flex flex-nowrap -mb-px justify-start space-x-4 overflow-x-auto px-2 py-1">
            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'resources' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('resources')"
              >
                Resources
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'prestige' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('prestige')"
              >
                Prestige
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'adventure' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm disabled:cursor-not-allowed transition ease-in-out duration-150"
                @click.prevent="setActiveTab('adventure')"
              >
                Adventure
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'equipment' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('equipment')"
              >
                Equipment
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'achievements' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('achievements')"
              >
                Achievements
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'tunnels' ? activeTabClasses : defaultTabClasses"
                :disabled="!usePrestigeStore().upgradePurchased('tunnels')"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm disabled:cursor-not-allowed transition ease-in-out duration-150"
                @click.prevent="setActiveTab('tunnels')"
              >
                Tunnels
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'passives' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm disabled:cursor-not-allowed transition ease-in-out duration-150"
                @click.prevent="setActiveTab('passives')"
              >
                Passives
              </button>
            </li>

            <li
              v-if="debugMode"
              class="flex-shrink-0"
            >
              <button
                :class="activeTab === 'debugger' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('debugger')"
              >
                Debugger
              </button>
            </li>

            <li class="flex-shrink-0">
              <button
                :class="activeTab === 'settings' ? activeTabClasses : defaultTabClasses"
                class="inline-block p-1 md:p-2 w-auto border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 text-xs md:text-sm transition ease-in-out duration-150"
                @click.prevent="setActiveTab('settings')"
              >
                Settings
              </button>
            </li>
          </ul>
        </div>

        <div class="max-h-screen-4/5 overflow-hidden flex flex-col">
          <AntResources v-show="activeTab === 'resources'" />
          <PrestigeShop v-show="activeTab === 'prestige'" />
          <Adventure v-show="activeTab === 'adventure'" />
          <EquipmentPage v-show="activeTab === 'equipment'" />
          <Inventory
            v-if="activeTab === 'passives'"
            only-passive
          />
          <Tunnels v-show="activeTab === 'tunnels'" />
          <AchievementPage v-if="activeTab === 'achievements'" />
          <Debugger v-show="activeTab === 'debugger'" />
          <Settings v-show="activeTab === 'settings'" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <PrivacyModal
      :visible="privacyModalVisible"
      @cancel="privacyModalVisible = false"
    />
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
          <div class="flex flex-col gap-1">
            <input
              v-model="gameStore.email"
              type="email"
              placeholder="Email"
              class="p-2 m-2 border-2 rounded"
            >
            <input
              v-model="gameStore.password"
              type="password"
              placeholder="Password"
              class="p-2 m-2 border-2 rounded"
            >
            <input
              v-if="registerActive"
              v-model="gameStore.passwordConfirm"
              type="password"
              placeholder="Confirm Password"
              class="p-2 m-2 border-2 rounded"
            >

            <button
              v-if="registerActive === false"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2"
              @click="gameStore.login()"
            >
              Login
            </button>
            <div
              v-tooltip="gameStore.privacyAgreement === false ? 'Agree with the privacy policy before registering.' : ''"
              class="w-full flex"
            >
              <button
                v-if="registerActive"
                :disabled="gameStore.privacyAgreement === false"
                class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2 disabled:cursor-not-allowed"
                @click="gameStore.register()"
              >
                Register
              </button>
            </div>

            <p v-if="gameStore.error">
              <span class="text-red-500">{{ gameStore.error }}</span>
            </p>
          </div>
          <div
            v-tooltip="gameStore.privacyAgreement === false ? 'Agree with the privacy policy before logging in.' : ''"
            class="w-full flex flex-col"
          >
            <button
              v-if="!gameStore.loggedIn"
              v-tooltip="'Will save your progress and allow you to play on multiple devices.'"
              :disabled="gameStore.privacyAgreement === false"
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2 disabled:cursor-not-allowed"
              @click="gameStore.loginUsingGoogle()"
            >
              Login using google
            </button>
            <button
              v-if="!gameStore.loggedIn"
              v-tooltip="'Will save progress for current session only, progress may be lost.'"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded m-2 border-2"
              @click="gameStore.loginAsGuest()"
            >
              Play as guest
            </button>
            <p class="text-xs text-red-500">
              <strong>Note:</strong> can't guarantee progress will be saved. There's an option to export your progress
              in the settings.
            </p>
          </div>
          <p v-if="registerActive === false">
            Don't have an account?
            <button
              class="text-blue-500 hover:text-blue-600"
              @click="registerActive = !registerActive"
            >
              Sign up
            </button>
          </p>
          <p v-else>
            Already have an account?
            <button
              class="text-blue-500 hover:text-blue-600"
              @click="registerActive = !registerActive"
            >
              Log in
            </button>
          </p>

          <p class="flex text-2xs items-center">
            <input
              v-model="gameStore.privacyAgreement"
              type="checkbox"
              class="m-2"
            >
            I have read and agree to the <a
              href="#"
              class="ml-1 text-blue-500 hover:text-blue-600"
              @click="privacyModalVisible = true"
            > Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useGameStore} from '../stores/gameStore'
import AntSimulation from '../components/AntSimulation.vue'
import AntResources from './AntResources.vue'
import Adventure from './AdventurePage.vue'
import Debugger from './DebuggerPage.vue'
import Inventory from './InventoryPage.vue'
import firebase from 'firebase/compat'
import Settings from './SettingsPage.vue'
import {useAdventureStore} from '../stores/adventureStore'
import {useDebounceFn} from '@vueuse/core'
import Tunnels from '@/views/TunnelsPage.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'
import PrivacyModal from '@/components/PrivacyModal.vue'
import PrestigeShop from '@/views/PrestigeShop.vue'
import EquipmentPage from '@/views/EquipmentPage.vue'
import AchievementPage from '@/views/AchievementPage.vue'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useSettingsStore} from '@/stores/settingsStore'

const gameStore = useGameStore()
const adventureStore = useAdventureStore()
const resourcesStore = useResourcesStore()
const isMinimized = ref(false) // Minimized state
const settingsStore = useSettingsStore()
const activeTab = ref('resources')
const progress = computed(() => {
  const gameProgress = gameStore.loaded ? 50 : (gameStore.progress / 2) // Half for game progress
  const adventureProgress = adventureStore.loaded ? 50 : (adventureStore.progress / 2) // Half for adventure progress
  return gameProgress + adventureProgress
})

const registerActive = ref(false)
const privacyModalVisible = ref(false)

// Classes for active and default tabs
const activeTabClasses = 'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500'
const defaultTabClasses = 'inline-block p-4 text-gray-800 border-b-2 border-transparent rounded-t-lg hover:text-blue-600 hover:border-blue-500 dark:hover:text-blue-600 disabled:cursor-not-allowed disabled:text-gray-800 disabled:border-gray-400 disabled:opacity-50'
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
        }, 60000)
      }

      // Add event listeners for window close (desktop) and visibility change (desktop + mobile)
      window.addEventListener('beforeunload', handleBeforeUnload) // Primarily for desktop
      document.addEventListener('visibilitychange', handleVisibilityChange) // Works for both desktop and mobile
      window.addEventListener('pagehide', handlePageHide)
      window.addEventListener('freeze', handleFreeze)
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
async function handleVisibilityChange() {
  if (document.hidden) {
    // Save game state when the tab goes into the background (or app is swiped away on mobile)
    console.log('Tab is hidden (backgrounded), saving game state...')
    await gameStore.saveGameState()
  } else {
    // Reload the game state when tab becomes visible again (optional, if needed)
    console.log('Tab is visible again, reloading game state...')
    await gameStore.loadGameState()
    gameStore.startGameLoop()
  }
}

function handlePageHide(event: PageTransitionEvent) {
  // Save game state when the page is hidden (e.g., when navigating to another page)
  console.log('Page is hidden, saving game state...')
  gameStore.saveGameState()
}

function handleFreeze() {
  // Save game state when the page is frozen (e.g., when the app is sent to the background on mobile)
  console.log('Page is frozen, saving game state...')
  gameStore.saveGameState()
}

// Function to handle saving the game state before unloading the window (works on desktop only)
function handleBeforeUnload() {
  // Save game state
  gameStore.saveGameState()
}

watch(() => resourcesStore.resources.ants, useDebounceFn(() => {
  gameStore.setupAdventureStats()
}, 300), {immediate: true})
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

.v-toast__item {
  font-size: 0.8rem;
}

/* For Webkit browsers (Chrome, Safari) */
::-webkit-scrollbar {
  width: 8px; /* Adjust the width of the scrollbar */
  height: 8px; /* Adjust the height of the horizontal scrollbar */
}

::-webkit-scrollbar-track {
  background: #f1f1f1; /* Background of the scrollbar track */
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar color */
  border-radius: 10px; /* Roundness of the scrollbar */
  border: 2px solid #f1f1f1; /* Adds padding between thumb and track */
}

::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Hover color */
}

/* For Firefox */
* {
  scrollbar-width: thin; /* Make the scrollbar thin */
  scrollbar-color: #888 #f1f1f1; /* Thumb color and track color */
}

</style>
