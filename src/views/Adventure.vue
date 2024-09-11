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
      <select
        v-model="adventureStore.currentArea"
        class="flex-1 bg-white border border-gray-300 rounded-lg shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        <option
          v-for="wave in adventureStore.enemyWaves"
          :key="wave.name"
          :disabled="!wave?.unlockedWhen(useGameStore())"
        >
          {{ wave.name }}
        </option>
      </select>
    </div>
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Ant Army Side -->
      <div class="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
        <img
          src=""
          alt="Ant Army"
          class="w-24 h-24"
        >
        <div class="w-full mt-2 text-center">
          <p class="text-lg font-bold">
            Ant Army
          </p>
          <p>Health: {{ formatNumber(adventureStore.armyHealth) }} / {{ formatNumber(adventureStore.armyMaxHealth) }}</p>
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
          src=""
          alt="Enemy Bug"
          class="w-24 h-24"
        >
        <div class="w-full mt-2 text-center">
          <p class="text-lg font-bold">
            {{ adventureStore.currentEnemy?.name ?? 'Start battle to spawn' }} {{ adventureStore.currentEnemy?.isBoss ? '👑' : '' }}
          </p>
          <p>Health: {{ formatNumber(adventureStore.bugHealth) }} / {{ formatNumber(adventureStore.bugMaxHealth) }}</p>
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
        @click="adventureStore.toggleBattle()"
      >
        {{ adventureStore.isFighting || adventureStore.battleCooldown ? 'Stop Battle' : 'Start Battle' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'
import {watch} from 'vue'

const formatNumber = useGameStore().formatNumber
const adventureStore = useAdventureStore()

watch(() => adventureStore.currentArea, () => {
  adventureStore.battleCooldown = false
  adventureStore.spawnRandomEnemy()
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
  transition: width 0.5s ease; /* Smooth transition for progress changes */
}
</style>
