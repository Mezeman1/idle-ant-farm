<template>
  <div>
    <div class="flex flex-col my-2">
      <p class="text-xs">
        <strong>Note:</strong> Offline progress has been implemented 09/10/2024.
      </p>
      <label
        for="area"
        class="text-md font-semibold"
      >Select Area:</label>
      <div class="relative inline-block w-full">
        <button
          ref="target"
          class="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
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
          class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg"
        >
          <div
            v-for="wave in adventureStore.enemyWaves"
            :key="wave.name"
            :class="[
              'cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-200',
              !wave.unlockedWhen(useGameStore()) && 'text-gray-400 cursor-not-allowed',
            ]"
            @click="selectWave(wave)"
          >
            <span v-if="wave.unlockedWhen(useGameStore())">{{ wave.name }}</span>
            <span v-else>
              {{ wave.name }} 🔒 ({{ wave.unlockText }})
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Ant Army Side -->
      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <img
          :src="ArmyImage"
          alt="Ant Army"
          class="rounded max-w-[300px] w-full"
        >
        <div class="w-full mt-2 text-center">
          <p class="text-lg font-bold">
            Ant Army
          </p>
          <p>Health: <br>{{ formatNumber(adventureStore.armyHealth) }} / {{ formatNumber(adventureStore.armyMaxHealth) }}</p>
          <div class="progress-container">
            <div
              class="progress-bar"
              :style="{ width: (adventureStore.armyHealth / adventureStore.armyMaxHealth) * 100 + '%' }"
            />
          </div>
        </div>
        <div class="mt-4 text-center space-y-1">
          <p><span class="font-semibold">⚔️ Attack:</span> {{ formatNumber(adventureStore.armyAttack) }}</p>
          <p><span class="font-semibold">🛡️ Defense:</span> {{ formatNumber(adventureStore.armyDefense) }}</p>
          <p><span class="font-semibold">❤️ HP Regen:</span> {{ formatNumber(adventureStore.armyRegen) }}</p>
        </div>
      </div>

      <!-- Enemy Bug Side -->
      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <img
          :src="adventureStore.currentEnemy?.image ?? 'https://via.placeholder.com/150'"
          alt="Enemy Bug"
          class="rounded max-w-[300px] w-full"
        >
        <div class="w-full mt-2 text-center">
          <p class="text-lg font-bold">
            {{ adventureStore.currentEnemy?.name ?? 'Start battle to spawn' }} {{ adventureStore.currentEnemy?.isBoss ? '👑' : '' }}
          </p>
          <p>Health: <br>{{ formatNumber(adventureStore.bugHealth) }} / {{ formatNumber(adventureStore.bugMaxHealth) }}</p>
          <div class="progress-container">
            <div
              class="progress-bar"
              :style="{ width: (adventureStore.bugHealth / adventureStore.bugMaxHealth) * 100 + '%' }"
            />
          </div>
        </div>
        <div class="mt-4 text-center space-y-1">
          <p><span class="font-semibold">⚔️ Attack:</span> {{ formatNumber(adventureStore.bugAttack) }}</p>
          <p><span class="font-semibold">🛡️ Defense:</span> {{ formatNumber(adventureStore.bugDefense) }}</p>
          <p><span class="font-semibold">❤️ HP Regen:</span> {{ formatNumber(adventureStore.bugRegen) }}</p>
        </div>
      </div>
    </div>

    <!-- Adventure Mode UI -->
    <div class="flex justify-center">
      <button
        :class="adventureStore.isFighting || adventureStore.battleCooldown ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
        class="text-white px-6 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
        :disabled="!adventureStore.currentArea"
        @click="adventureStore.toggleBattle()"
      >
        {{ adventureStore.isFighting || adventureStore.battleCooldown ? 'Stop Battle' : 'Start Battle' }}
      </button>
    </div>

    <Inventory />
  </div>
</template>

<script setup lang="ts">
import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'
import {onMounted, ref, watch} from 'vue'
import {onClickOutside} from '@vueuse/core'
import ArmyImage from '../assets/army.webp'
import Inventory from '@/views/Inventory.vue'
const formatNumber = useGameStore().formatNumber
const adventureStore = useAdventureStore()

watch(() => adventureStore.currentArea, () => {
  selectedWave.value = adventureStore.enemyWaves.find(wave => wave.name === adventureStore.currentArea)
  adventureStore.battleCooldown = false
  adventureStore.spawnRandomEnemy()
})

onMounted(() => {
  selectedWave.value = adventureStore.enemyWaves.find(wave => wave.name === adventureStore.currentArea)
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
