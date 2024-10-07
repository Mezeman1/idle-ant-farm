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
    <div
      v-else
      class="bg-blue-600 h-screen w-screen flex items-center justify-center"
    />

    <div class="top-0 left-0 absolute h-screen w-screen overflow-hidden text-xs">
      <div class="flex items-center justify-between bg-gray-800 p-2 text-white max-h-[65px] overflow-hidden">
        <!-- Left Side Buttons -->
        <div class="flex items-center space-x-2">
          <!-- Minimize/Maximize Button -->
          <button
            class="flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded"
            @click="isMinimized = !isMinimized"
          >
            {{ isMinimized ? 'Hide the AntFarm' : 'Show the AntFarm' }}
          </button>

          <!-- Save Game Button -->
          <button
            :disabled="!canSave"
            class="flex items-center bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded disabled:opacity-50"
            @click="saveGameWithCooldown"
          >
            <span v-if="canSave">Save Game</span>
            <span v-else>Wait {{ timeLeft }}s</span>
          </button>

          <div v-if="deferredPrompt">
            <button
              class="flex items-center bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
              @click="deferredPrompt.prompt()"
            >
              Install
            </button>
          </div>

          <div
            class="flex flex-col p-1 rounded text-3xs"
          >
            <span>
              Version: {{ version }}
            </span>
            <span>
              Last time saved: {{ new Date(gameStore.lastSavedTime).toLocaleString() }}
            </span>
          </div>
        </div>

        <!-- Right Side Button -->
        <button
          v-if="gameStore.currentUser && gameStore.currentUser.isAnonymous === false"
          class="flex items-center bg-red-600 hover:bg-red-500 px-3 py-2 rounded"
          @click="gameStore.logout()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <!-- Logout Icon -->
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7"
            />
          </svg>
          Log out
        </button>
        <button
          v-else
          class="flex items-center bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded"
          @click="gameStore.linkAnonymousAccountToGoogle()"
        >
          Link anonynous account to google
        </button>
      </div>
      <div
        v-show="!isMinimized"
        class="bg-white rounded shadow-lg flex flex-col sm:flex-row space-y-2 bg-opacity-50 h-[calc(100vh-65px)]"
      >
        <div class="flex flex-col flex-1 overflow-y-auto p-2">
          <AntResources v-if="activeTab === 'resources'" />
          <PrestigeShop v-show="activeTab === 'prestige'" />
          <Adventure v-if="activeTab === 'adventure'" />
          <EquipmentPage v-if="activeTab === 'equipment'" />
          <PassivePage
            v-if="activeTab === 'passives'"
          />
          <Tunnels v-if="activeTab === 'tunnels'" />
          <AchievementPage v-if="activeTab === 'achievements'" />
          <BestiaryPage v-if="activeTab === 'bestiary'" />
          <Debugger v-if="activeTab === 'debugger'" />
          <Settings v-if="activeTab === 'settings'" />
        </div>

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
              </button>
            </div>
          </div>
        </nav>
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
      <!-- Loading Progress Bar -->
      <div class="flex flex-col items-center justify-center bg-gray-50 p-3">
        <div class="w-3/4 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            class="bg-blue-600 h-full rounded-full"
            :style="{ width: progress + '%' }"
          />
        </div>
        <p class="mt-2 text-gray-700 font-semibold">
          Loading... {{ progress.toFixed(0) }}%
        </p>
      </div>
    </div>
    <div v-else>
      <AntSimulation
        show-animation
        :queen-count="5"
        :ant-count="250"
        :larvae-count="200"
      />
      <div class="top-0 left-0 absolute h-screen w-screen overflow-hidden flex flex-col items-center justify-center">
        <!-- Login/Register Card -->
        <div class="flex flex-col items-center justify-center bg-gray-50 rounded">
          <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">
              {{ registerActive ? 'Create an Account' : 'Welcome Back' }}
            </h2>
            <form @submit.prevent="registerActive ? gameStore.register() : gameStore.login()">
              <!-- Email Field -->
              <div class="relative mb-4">
                <input
                  v-model="gameStore.email"
                  type="email"
                  placeholder="Email"
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <!-- Email Icon -->
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v1l-8 5-8-5V5z" />
                    <path d="M2 8l8 5 8-5v5a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" />
                  </svg>
                </div>
              </div>
              <!-- Password Field -->
              <div class="relative mb-4">
                <input
                  v-model="gameStore.password"
                  type="password"
                  placeholder="Password"
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <!-- Lock Icon -->
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 8V6a5 5 0 1110 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <!-- Confirm Password Field -->
              <div
                v-if="registerActive"
                class="relative mb-4"
              >
                <input
                  v-model="gameStore.passwordConfirm"
                  type="password"
                  placeholder="Confirm Password"
                  class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <!-- Lock Icon -->
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 8V6a5 5 0 1110 0v2h1a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V6z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <!-- Privacy Agreement -->
              <div class="flex items-center mb-4">
                <input
                  v-model="gameStore.privacyAgreement"
                  type="checkbox"
                  class="mr-2"
                >
                <label class="text-sm text-gray-700">
                  I agree to the
                  <button
                    class="text-blue-500 hover:underline"
                    @click.prevent="privacyModalVisible = true"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
              <!-- Error Message -->
              <div
                v-if="gameStore.error"
                class="text-red-500 mb-4"
              >
                {{ gameStore.error }}
              </div>
              <!-- Submit Button -->
              <button
                :disabled="!gameStore.privacyAgreement"
                class="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
              >
                {{ registerActive ? 'Register' : 'Login' }}
              </button>
            </form>
            <!-- Or Divider -->
            <div class="flex items-center my-4">
              <hr class="flex-grow border-gray-300">
              <span class="mx-2 text-gray-500">OR</span>
              <hr class="flex-grow border-gray-300">
            </div>
            <!-- Login using Google Button -->
            <button
              v-if="!gameStore.loggedIn"
              :disabled="!gameStore.privacyAgreement"
              class="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center disabled:opacity-50"
              @click="gameStore.loginUsingGoogle()"
            >
              <!-- Google Icon -->
              <svg
                class="w-5 h-5 mr-2"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.94 0 6.63 1.69 8.15 3.09l5.98-5.98C34.4 3.68 29.68 1.5 24 1.5 14.62 1.5 6.75 6.76 2.99 14.26l7.07 5.5C11.69 15.38 17.24 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.09 24.5c0-1.74-.14-3.45-.41-5.09H24v9.64h12.46c-.54 2.9-2.2 5.38-4.69 7.05l7.22 5.56C43.54 37.32 46.09 31.28 46.09 24.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.06 28.64A14.48 14.48 0 019.5 24c0-1.62.28-3.19.77-4.64l-7.07-5.5A23.936 23.936 0 001 24c0 3.8.87 7.37 2.42 10.56l6.64-5.92z"
                />
                <path
                  fill="#34A853"
                  d="M24 46.5c6.48 0 11.94-2.14 15.92-5.84l-7.22-5.56C29.92 36.94 27.07 38 24 38c-6.75 0-12.3-5.88-12.95-13.24l-7.07 5.92C6.75 41.24 14.62 46.5 24 46.5z"
                />
                <path
                  fill="none"
                  d="M1.5 1.5h45v45h-45z"
                />
              </svg>
              Login with Google
            </button>
            <!-- Play as Guest Button -->
            <button
              v-if="!gameStore.loggedIn"
              class="mt-4 w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-lg"
              @click="gameStore.loginAsGuest()"
            >
              Play as Guest
            </button>
            <!-- Toggle Login/Register -->
            <div class="mt-4 text-center">
              <p class="text-gray-700">
                {{ registerActive ? 'Already have an account?' : "Don't have an account?" }}
                <button
                  class="text-blue-500 hover:underline"
                  @click="registerActive = !registerActive"
                >
                  {{ registerActive ? 'Log in' : 'Sign up' }}
                </button>
              </p>
            </div>
          </div>
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
import firebase from 'firebase/compat'
import Settings from './SettingsPage.vue'
import {useAdventureStore} from '../stores/adventureStore'
import {useThrottleFn} from '@vueuse/core'
import Tunnels from '@/views/TunnelsPage.vue'
import PrivacyModal from '@/components/PrivacyModal.vue'
import PrestigeShop from '@/views/PrestigeShop.vue'
import EquipmentPage from '@/views/EquipmentPage.vue'
import AchievementPage from '@/views/AchievementPage.vue'
import {useResourcesStore} from '@/stores/resourcesStore'
import {useSettingsStore} from '@/stores/settingsStore'
import BestiaryPage from '@/views/BestiaryPage.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'
import PassivePage from '@/views/PassivePage.vue'
import {toast} from 'vue3-toastify'

const deferredPrompt = ref(null)
const gameStore = useGameStore()
const adventureStore = useAdventureStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()
const isMinimized = ref(false) // Minimized state
const settingsStore = useSettingsStore()
const activeTab = ref('resources')
const progress = computed(() => {
  const gameProgress = gameStore.loaded ? 50 : (gameStore.progress / 2) // Half for game progress
  const adventureProgress = adventureStore.loaded ? 50 : (adventureStore.progress / 2) // Half for adventure progress
  return gameProgress + adventureProgress
})
const debugMode = import.meta.env.MODE === 'localhost'

const tabs = computed(() => [
  {
    name: 'resources',
    label: 'Resources',
    icon: 'fa-solid fa-chart-simple',
  },
  {
    name: 'prestige',
    label: 'Prestige',
    icon: 'fa-solid fa-code-fork',
  },
  {
    name: 'adventure',
    label: 'Adventure',
    icon: 'fa-solid fa-compass',
  },
  {
    name: 'equipment',
    label: 'Equipment',
    icon: 'fa-solid fa-shield',
  },
  {
    name: 'achievements',
    label: 'Achievements',
    icon: 'fa-solid fa-trophy',
  },
  {
    name: 'tunnels',
    label: 'Tunnels',
    icon: 'fa-solid fa-dungeon',
    disabled: usePrestigeStore().upgradePurchased('tunnels') === false,
  },
  {
    name: 'passives',
    label: 'Passives',
    icon: 'fa-solid fa-cogs',
  },
  {
    name: 'bestiary',
    label: 'Bestiary',
    icon: 'fa-solid fa-dragon',
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: 'fa-solid fa-cog',
  },
  // Add 'debugger' tab conditionally if in debug mode
  ...(debugMode ? [{
    name: 'debugger',
    label: 'Debugger',
    icon: 'fa-solid fa-bug',
  },
  ] : []),
])

const registerActive = ref(false)
const privacyModalVisible = ref(false)

// Function to set the active tab
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const canSave = ref(true)
const timeLeft = ref(10) // Time left for the cooldown in seconds
let interval: number | null = null // To store the cooldown interval
let saveInterval: number | null = null // To store the auto-save interval
const enableSaveInterval = ref(true)

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

const loggedInUser = computed(() => gameStore.loggedIn)

function saveIntervalFunction() {
  // Ensure only one interval is set
  if (!saveInterval && enableSaveInterval.value) {
    // Save game state every 5 minutes (fallback for regular saves)
    saveInterval = window.setInterval(() => {
      gameStore.saveGameState()
    }, 60000)
  }
}

onMounted(() => {
  enableSaveInterval.value = true
  // Handle authentication state and game loading
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      await gameStore.loadGameState() // Load game state and calculate offline progress
      gameStore.startGameLoop() // Start the game loop

      saveIntervalFunction()

      // Add event listeners for window close (desktop) and visibility change (desktop + mobile)
      window.addEventListener('beforeunload', handleBeforeUnload) // Primarily for desktop
      document.addEventListener('visibilitychange', handleVisibilityChange) // Works for both desktop and mobile
      window.addEventListener('pagehide', handlePageHide)
      window.addEventListener('freeze', handleFreeze)
    }
  })

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  })

  deferredPrompt.value?.prompt()
})

const stopInterval = () => {
  enableSaveInterval.value = false

  if (saveInterval) {
    clearInterval(saveInterval)
    saveInterval = null
  }
}
onBeforeUnmount(async () => {
  stopInterval()
  if (!loggedInUser.value) return

  // Save game state and stop game loop before leaving
  await gameStore.saveGameState({
    force: true,
  })
  gameStore.stopGameLoop()

  // Cleanup event listeners and intervals
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('pagehide', handlePageHide)
  window.removeEventListener('freeze', handleFreeze)

  // Remove beforeinstallprompt and appinstalled event listeners
  window.removeEventListener('beforeinstallprompt', deferredPrompt.value)
  window.removeEventListener('appinstalled', deferredPrompt.value)

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

function startSaveInterval() {
  enableSaveInterval.value = true
  if (!saveInterval) {
    saveIntervalFunction()
  }
}

// Function to handle visibility change (works on mobile)
async function handleVisibilityChange() {
  if (document.hidden) {
    stopInterval()
    await gameStore.saveGameState({
      force: true,
    })
  } else {
    startSaveInterval()
    await gameStore.loadGameState()
    gameStore.startGameLoop()
  }
}

function handlePageHide(event: PageTransitionEvent) {
  stopInterval()
  gameStore.saveGameState({
    force: true,
  })
}

function handleFreeze() {
  stopInterval()
  gameStore.saveGameState({
    force: true,
  })
}

// Function to handle saving the game state before unloading the window (works on desktop only)
function handleBeforeUnload() {
  stopInterval()
  // Save game state
  gameStore.saveGameState({
    force: true,
  })
}

watch(() => resourcesStore.resources.ants, useThrottleFn(() => {
  gameStore.setupAdventureStats()
  resourcesStore.setAntsWithMax()

  if (gameStore.simulatingOfflineProgress || adventureStore.isSimulatingOffline) return

  if (prestigeStore.upgradePurchased('autoAdventure') && resourcesStore.resources.ants >= 10) {
    if (adventureStore.currentArea === 'Safe Zone') {
      adventureStore.currentArea = 'Wasteland'

      toast.info('Starting battle automatically', {
        position: 'top-left',
      })
    }
  }
}, 1000), {
  immediate: true,
})
const version = import.meta.env.PACKAGE_VERSION

watch(() => adventureStore.currentArea, () => {
  adventureStore.battleStatus = 'fighting'
  adventureStore.spawnRandomEnemy()
  adventureStore.stopAllBattles()
  adventureStore.startBattle()
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

nav {
  margin-top: 0 !important;
}
</style>
