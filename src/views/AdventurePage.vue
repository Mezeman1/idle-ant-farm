<template>
  <div class="flex flex-col">
    <div :class="isLargeScreen ? 'grid grid-cols-2 gap-4' : 'flex flex-col'">
      <!-- Left Column: Adventure Mode -->
      <div class="space-y-4 mb-4">
        <WaveSelector
          :selected-wave="selectedWave"
          :can-go-next="canGoNext"
          :can-go-previous="canGoPrevious"
          @previousWave="previousWave"
          @nextWave="nextWave"
        />

        <!-- Optional display for locked wave details -->
        <div
          v-if="!getAreaByIndex(selectedWaveIndex + 1)?.unlockedWhen()"
          class="text-xs text-gray-700"
        >
          Next Area: {{ getAreaByIndex(selectedWaveIndex + 1)?.unlockText }} 🔒
        </div>

        <!-- Ant Army and Enemy Bug Display -->
        <div class="grid grid-cols-2 gap-2">
          <!-- Ant Army Side -->
          <div class="bg-white rounded-lg shadow flex flex-col">
            <!-- Top Half: Background Image -->
            <div
              class="h-[100px] md:h-[200px] bg-cover bg-center rounded-t-lg"
              :style="{ backgroundImage: `url(${ArmyImage})` }"
            >
              <!-- The image here is used as a background -->
            </div>

            <!-- Bottom Half: Info and Progress Bar -->
            <div class="h-full bg-white bg-opacity-80 p-2 rounded-b-lg text-center text-2xs md:text-sm flex-1">
              <p class="font-bold">
                Ant Army
              </p>
              <p>
                Health: <br>{{ formatNumber(adventureStore.armyHealth) }} /
                {{ formatNumber(adventureStore.armyMaxHealth) }}
              </p>
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

              <!-- Active Effects for Army -->
              <div class="mt-2 text-3xs md:text-xs space-y-1">
                <p class="font-semibold">
                  🧪 Active Effects:
                </p>
                <ul v-if="adventureStore.armyActiveEffects.length > 0">
                  <li
                    v-for="effect in adventureStore.armyActiveEffects"
                    :key="effect.id"
                    class="text-3xs md:text-xs"
                  >
                    <span class="font-semibold">{{ effect.name }}</span> - {{ Math.round(effect.duration) }}s remaining
                    <!-- Display damage per second if it's a damaging effect -->
                    <span v-if="effect.damagePerSecond"> (DPS: {{ effect.damagePerSecond }})</span>
                    <!-- Display healing per second if it's a healing effect -->
                    <span v-if="effect.healingPerSecond"> (HPS: {{ effect.healingPerSecond }})</span>
                  </li>
                </ul>
                <p
                  v-else
                  class="text-gray-500"
                >
                  No active effects
                </p>
              </div>
            </div>
          </div>

          <!-- Enemy Bug Side -->
          <div
            v-if="adventureStore.currentEnemy"
            class="bg-white rounded-lg shadow flex flex-col relative"
          >
            <!-- Top Half: Background Image -->
            <div
              class="h-[100px] md:h-[200px] bg-cover bg-center rounded-t-lg relative"
              :style="{ backgroundImage: `url(${adventureStore.currentEnemy?.image ?? 'https://via.placeholder.com/150'})` }"
            >
              <!-- The image here is used as a background -->
              <div
                v-if="adventureStore.currentEnemy && adventureStore.enemySpawnCooldownTime > 0"
                class="absolute bottom-0 w-full h-[5px] bg-gray-300 rounded"
              >
                <!-- Green progress bar (dynamic width) -->
                <div
                  class="bg-blue-500 h-full rounded"
                  :style="{ width: cooldownProgress + '%' }"
                />
              </div>
            </div>

            <!-- Bottom Half: Info and Progress Bar -->
            <div class="h-full bg-white bg-opacity-80 p-2 rounded-b-lg text-center text-2xs md:text-sm flex-1">
              <!-- Gray background (full width) -->

              <p class="font-bold">
                {{ adventureStore.currentEnemy?.name ?? 'Start battle to spawn' }}
                {{ adventureStore.currentEnemy?.isBoss ? '👑' : '' }}
              </p>
              <p>
                Health: <br>{{ formatNumber(adventureStore.bugHealth) }} /
                {{ formatNumber(adventureStore.bugMaxHealth) }}
              </p>
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

              <!-- Active Effects for Bug -->
              <div class="mt-2 text-3xs md:text-xs space-y-1">
                <p class="font-semibold">
                  🧪 Active Effects:
                </p>
                <ul v-if="adventureStore.bugActiveEffects.length > 0">
                  <li
                    v-for="effect in adventureStore.bugActiveEffects"
                    :key="effect.id"
                    class="text-3xs md:text-xs"
                  >
                    <span class="font-semibold">{{ effect.name }}</span> - {{ Math.round(effect.duration) }}s remaining
                    <!-- Display damage per second if it's a damaging effect -->
                    <span v-if="effect.damagePerSecond"> (DPS: {{ effect.damagePerSecond }})</span>
                    <!-- Display healing per second if it's a healing effect -->
                    <span v-if="effect.healingPerSecond"> (HPS: {{ effect.healingPerSecond }})</span>
                  </li>
                </ul>
                <p
                  v-else
                  class="text-gray-500"
                >
                  No active effects
                </p>
              </div>
            </div>
          </div>

          <div v-else>
            <div class="bg-white rounded-lg shadow flex flex-col h-52 sm:h-64 md:h-96">
              <div class="h-1/4 md:h-1/2 bg-cover bg-center rounded-t-lg">
                <div class="flex items-center justify-center h-full text-sm text-gray-400">
                  You're safe for now
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Army effects chances         -->
          <div class="bg-white rounded-lg">
            <!-- Header for the Effects Chance -->
            <div class="bg-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-800">
                Status Effect Chances
              </h2>
              <p class="text-gray-600 text-sm">
                Your army's chances to apply different status effects.
              </p>
            </div>

            <!-- Body showing each effect and its chance -->
            <div class="px-6 py-4 space-y-4">
              <!-- Poison Chance -->
              <div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-green-600">Poison</span>
                  <span class="text-sm font-medium text-gray-600">{{ poisonChance }}%</span>
                </div>
                <div class="w-full bg-gray-200 h-2 rounded">
                  <div
                    class="bg-green-600 h-2 rounded"
                    :style="{ width: `${poisonChance}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Bug effects chances         -->
          <div class="bg-white rounded-lg">
            <!-- Header for the Effects Chance -->
            <div class="bg-gray-200 px-6 py-4">
              <h2 class="text-xl font-semibold text-gray-800">
                Status Effect Chances
              </h2>
              <p class="text-gray-600 text-sm">
                The bugs chances to apply different status effects.
              </p>
            </div>

            <!-- Body showing each effect and its chance -->
            <div class="px-6 py-4 space-y-4">
              <!-- Poison Chance -->
              <div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-green-600">Poison</span>
                  <span class="text-sm font-medium text-gray-600">{{ bugPoisonChance }}%</span>
                </div>
                <div class="w-full bg-gray-200 h-2 rounded">
                  <div
                    class="bg-green-600 h-2 rounded"
                    :style="{ width: `${bugPoisonChance}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
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
import {onClickOutside, useWindowSize} from '@vueuse/core'
import ArmyImage from '../assets/army.webp'
import Inventory from '@/views/InventoryPage.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useResourcesStore} from '@/stores/resourcesStore'
import WaveSelector from '@/components/WaveSelector.vue'

const formatNumber = useGameStore().formatNumber
const adventureStore = useAdventureStore()
const gameStore = useGameStore()
const resourcesStore = useResourcesStore()
const prestigeStore = usePrestigeStore()
const {width} = useWindowSize()
const poisonChance = computed(() => formatNumber(adventureStore.poisonChance * 100), 0)
const bugPoisonChance = computed(() => formatNumber((adventureStore.currentEnemy?.effectChances?.find(effect => effect.effect === 'poison')?.chance ?? 0) * 100), 0 )
// Set a breakpoint for large screens
const isLargeScreen = computed(() => width.value >= 1024)


onMounted(() => {
  selectedWaveIndex.value = adventureStore.enemyWaves.findIndex(wave => wave.name === adventureStore.currentArea)
  updateCurrentAreaByIndex(selectedWaveIndex.value)
})

watch(() => adventureStore.currentArea, () => {
  selectedWaveIndex.value = adventureStore.enemyWaves.findIndex(wave => wave.name === adventureStore.currentArea)
})

const updateCurrentAreaByIndex = (index) => {
  if (index < 0 || index >= adventureStore.enemyWaves.length) return
  if (getAreaByIndex(index)?.unlockedWhen()) {
    adventureStore.currentArea = getAreaByIndex(index)?.name ?? 'Safe Zone'
  }
}

const getAreaByIndex = (index) => {
  if (index < 0 || index >= adventureStore.enemyWaves.length) return null

  return adventureStore.enemyWaves[index]
}

const selectedWaveIndex = ref(0)
const selectedWave = computed(() => {
  return adventureStore.enemyWaves[selectedWaveIndex.value]
})

const canGoPrevious = computed(() => selectedWaveIndex.value > 0)
const canGoNext = computed(() => selectedWaveIndex.value + 1 < adventureStore.enemyWaves.length && getAreaByIndex(selectedWaveIndex.value + 1)?.unlockedWhen())

const previousWave = () => {
  if (canGoPrevious.value) {
    selectedWaveIndex.value--
    updateCurrentAreaByIndex(selectedWaveIndex.value)
  }
}

const nextWave = () => {
  if (canGoNext.value) {
    selectedWaveIndex.value++
    updateCurrentAreaByIndex(selectedWaveIndex.value)
  }
}

const dropdownOpen = ref(false)

const target = ref(null)

onClickOutside(target, event => {
  dropdownOpen.value = false
})

const cooldownProgress = computed(() => {
  const totalCooldown = adventureStore.initialSpawnCooldownTime // Total cooldown time
  const remainingCooldown = adventureStore.enemySpawnCooldownTime // Remaining cooldown time

  return Math.max(0, (remainingCooldown / totalCooldown) * 100) // Calculate progress percentage
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
