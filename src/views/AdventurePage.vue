<template>
  <div class="max-h-screen-3/4 flex flex-col overflow-hidden">
    <div :class="isLargeScreen ? 'grid grid-cols-2 gap-4' : 'flex flex-col'">
      <!-- Left Column: Adventure Mode -->
      <div class="space-y-4">
        <div class="flex flex-col space-y-2">
          <label
            for="area"
            class="text-sm font-semibold"
          >Select Area:</label>
          <div class="relative inline-block w-full">
            <button
              ref="target"
              class="block w-full bg-white border border-gray-300 text-sm text-gray-700 py-1 px-2 pr-8 rounded focus:outline-none focus:border-blue-500"
              @click="toggleDropdown"
            >
              {{ selectedWave ? selectedWave.name : 'Select a wave' }}
              <span class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  class="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.5 7l4.5 4.5L14.5 7z" />
                </svg>
              </span>
            </button>
            <div
              v-if="dropdownOpen"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg text-sm"
            >
              <div
                v-for="wave in adventureStore.enemyWaves"
                :key="wave.name"
                :class="[
                  'cursor-pointer px-2 py-1 text-gray-700 hover:bg-gray-200',
                  !wave.unlockedWhen(useGameStore()) && 'text-gray-400 cursor-not-allowed',
                ]"
                @click="selectWave(wave)"
              >
                <span v-if="wave.unlockedWhen(useGameStore())">{{ wave.name }}</span>
                <span v-else>{{ wave.name }} 🔒 ({{ wave.unlockText }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Ant Army and Enemy Bug Display -->
        <div class="grid grid-cols-2 gap-2">
          <!-- Ant Army Side -->
          <div class="bg-white rounded-lg shadow flex flex-col h-52 sm:h-64 md:h-96">
            <!-- Top Half: Background Image -->
            <div
              class="h-1/4 md:h-1/2 bg-cover bg-center rounded-t-lg"
              :style="{ backgroundImage: `url(${ArmyImage})` }"
            >
              <!-- The image here is used as a background -->
            </div>

            <!-- Bottom Half: Info and Progress Bar -->
            <div class="h-3/4 md:h-1/2 bg-white bg-opacity-80 p-2 rounded-b-lg text-center text-2xs md:text-sm">
              <p class="font-bold">
                Ant Army
              </p>
              <p>Health: <br>{{ formatNumber(adventureStore.armyHealth) }} / {{ formatNumber(adventureStore.armyMaxHealth) }}</p>
              <div class="progress-container h-1 bg-gray-300 rounded">
                <div
                  class="progress-bar bg-green-500 h-full rounded"
                  :style="{ width: (adventureStore.armyHealth / adventureStore.armyMaxHealth) * 100 + '%' }"
                />
              </div>
              <div class="mt-2 space-y-1 text-3xs md:text-xs">
                <p><span class="font-semibold">⚔️ Attack:</span> {{ formatNumber(adventureStore.armyAttack) }}</p>
                <p><span class="font-semibold">🛡️ Defense:</span> {{ formatNumber(adventureStore.armyDefense) }}</p>
                <p><span class="font-semibold">❤️ HP Regen:</span> {{ formatNumber(adventureStore.armyRegen) }}</p>
              </div>
            </div>
          </div>

          <!-- Enemy Bug Side -->
          <div class="bg-white rounded-lg shadow flex flex-col h-52 sm:h-64 md:h-96">
            <!-- Top Half: Background Image -->
            <div
              class="h-1/4 md:h-1/2 bg-cover bg-center rounded-t-lg"
              :style="{ backgroundImage: `url(${adventureStore.currentEnemy?.image ?? 'https://via.placeholder.com/150'})` }"
            >
              <!-- The image here is used as a background -->
            </div>

            <!-- Bottom Half: Info and Progress Bar -->
            <div class="h-3/4 md:h-1/2 bg-white bg-opacity-80 p-2 rounded-b-lg text-center text-2xs md:text-sm">
              <p class="font-bold">
                {{ adventureStore.currentEnemy?.name ?? 'Start battle to spawn' }} {{ adventureStore.currentEnemy?.isBoss ? '👑' : '' }}
              </p>
              <p>Health: <br>{{ formatNumber(adventureStore.bugHealth) }} / {{ formatNumber(adventureStore.bugMaxHealth) }}</p>
              <div class="progress-container h-1 bg-gray-300 rounded">
                <div
                  class="progress-bar bg-red-500 h-full rounded"
                  :style="{ width: (adventureStore.bugHealth / adventureStore.bugMaxHealth) * 100 + '%' }"
                />
              </div>
              <div class="mt-2 space-y-1 text-3xs md:text-xs">
                <p><span class="font-semibold">⚔️ Attack:</span> {{ formatNumber(adventureStore.bugAttack) }}</p>
                <p><span class="font-semibold">🛡️ Defense:</span> {{ formatNumber(adventureStore.bugDefense) }}</p>
                <p><span class="font-semibold">❤️ HP Regen:</span> {{ formatNumber(adventureStore.bugRegen) }}</p>
              </div>
            </div>
          </div>
        </div>


        <div class="flex justify-center">
          <button
            :class="adventureStore.isFighting || adventureStore.battleCooldown ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
            class="small text-white px-4 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm md:text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            :disabled="!adventureStore.currentArea"
            @click="adventureStore.toggleBattle()"
          >
            {{ adventureStore.isFighting || adventureStore.battleCooldown ? 'Stop Battle' : 'Start Battle' }}
          </button>
        </div>
      </div>

      <!-- Right Column: Inventory (on large screens) -->
      <div
        v-if="isLargeScreen"
        class="flex-shrink-0"
      >
        <Inventory only-consumables />
      </div>
    </div>

    <!-- Inventory below Adventure Mode for smaller screens -->
    <div
      v-if="isLargeScreen === false"
      class="overflow-y-auto"
    >
      <Inventory only-consumables />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'
import {computed, onMounted, ref, watch} from 'vue'
import {onClickOutside, useWindowSize, watchDebounced} from '@vueuse/core'
import ArmyImage from '../assets/army.webp'
import Inventory from '@/views/InventoryPage.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useToast} from 'vue-toast-notification'
import {useResourcesStore} from '@/stores/resourcesStore'

const formatNumber = useGameStore().formatNumber
const adventureStore = useAdventureStore()
const gameStore = useGameStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()
const $toast = useToast()

const {width} = useWindowSize()

// Set a breakpoint for large screens
const isLargeScreen = computed(() => width.value >= 1024)

watch(() => adventureStore.currentArea, () => {
  selectedWave.value = adventureStore.enemyWaves.find(wave => wave.name === adventureStore.currentArea)
  adventureStore.battleCooldown = false
  adventureStore.spawnRandomEnemy()
})

onMounted(() => {
  selectedWave.value = adventureStore.enemyWaves.find(wave => wave.name === adventureStore.currentArea)
})

watchDebounced(() => resourcesStore.resources.ants, () => {
  if (gameStore.simulatingOfflineProgress || adventureStore.isSimulatingOffline) return

  if (prestigeStore.upgradePurchased('autoAdventure') && !adventureStore.battleRunning && resourcesStore.resources.ants >= 15) {
    console.log('Starting battle automatically')
    $toast.info('Starting battle automatically')
    adventureStore.toggleBattle()
  }

  if (!selectedWave.value && resourcesStore.resources.ants >= 15) {
    adventureStore.currentArea = 'Wasteland'
  }
}, {
  debounce: 1000,
})


const dropdownOpen = ref(false)
const selectedWave = ref(null)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const selectWave = (wave) => {
  if (wave.unlockedWhen(useGameStore())) {
    selectedWave.value = wave
    dropdownOpen.value = false
    adventureStore.currentArea = wave.name
  }
}

const target = ref(null)

onClickOutside(target, event => {
  dropdownOpen.value = false
})
</script>

<style scoped>
/* Progress bar container */
.progress-container {
  width: 100%;
  height: 16px;
  background-color: #f3f4f6; /* Light gray background */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

/* Progress bar */
.progress-bar {
  height: 100%;
  background-color: #34d399; /* Green progress fill */
  transition: width 0.1s ease; /* Smooth transition for progress changes */
}
</style>
