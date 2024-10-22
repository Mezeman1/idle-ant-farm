<template>
  <div class="flex flex-col overflow-y-auto p-2">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">
      Bestiary
    </h2>
    <!-- Search Bar -->
    <div class="mb-4">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search enemies..."
          class="border border-gray-300 rounded-full p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-white"
        >
        <svg
          class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M12.9 14.32a8 8 0 111.414-1.414l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
    <!-- Main Content -->
    <div class="flex flex-col sm:flex-row flex-1 overflow-hidden space-y-2">
      <!-- Enemy List -->
      <div class="w-full sm:w-1/2 h-[300px] sm:h-full overflow-y-auto border-r border-gray-300 p-2">
        <ul class="space-y-2">
          <li
            v-for="enemy in filteredEnemies"
            :key="enemy.name"
            :class="[
              'cursor-pointer p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex items-center',
              selectedEnemy?.name === enemy.name ? 'ring-2 ring-blue-500' : '',
            ]"
            @click="selectEnemy(enemy)"
          >
            <img
              v-if="enemy.image"
              :src="enemy.image"
              :alt="enemy.name"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            >
            <div>
              <div class="font-semibold text-gray-800">
                {{ enemy.name }}
              </div>
              <div class="text-sm text-gray-600">
                {{ enemy.area }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!-- Enemy Details -->
      <div class="w-full sm:w-1/2 overflow-y-auto flex-2">
        <div
          v-if="selectedEnemy"
          class="bg-white rounded-lg shadow p-2"
        >
          <h3 class="text-2xl font-bold mb-2 text-gray-800">
            {{ selectedEnemy.name }}
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Area: {{ selectedEnemy.area }}
          </p>
          <img
            v-if="selectedEnemy.image"
            :src="selectedEnemy.image"
            :alt="selectedEnemy.name"
            class="mb-4 w-full h-64 object-cover rounded-lg"
          >
          <p class="text-gray-700 mb-4">
            {{ selectedEnemy.description || 'No description available.' }}
          </p>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div class="text-gray-600">
                Health
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ selectedEnemy.health }}
              </div>
            </div>
            <div>
              <div class="text-gray-600">
                Attack
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ selectedEnemy.attack }}
              </div>
            </div>
            <div>
              <div class="text-gray-600">
                Defense
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ selectedEnemy.defense }}
              </div>
            </div>
            <div>
              <div class="text-gray-600">
                Regen
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ selectedEnemy.regen }}
              </div>
            </div>
            <div>
              <div class="text-gray-600">
                Boss
              </div>
              <div class="text-lg font-semibold text-gray-800">
                {{ selectedEnemy.isBoss ? 'Yes' : 'No' }}
              </div>
            </div>
          </div>
          <h4 class="text-xl font-bold mb-2 text-gray-800">
            Drop Options
          </h4>
          <ul class="space-y-2">
            <li
              v-for="(drop, index) in selectedEnemy.dropOptions"
              :key="index"
              class="flex justify-between items-center bg-gray-50 p-2 rounded"
            >
              <div v-if="drop.unlockedWhen()">
                <div class="text-gray-700 flex flex-col">
                  {{ drop.name }} {{ inventoryStore.getItemById(drop.name) || drop.name === 'Seeds' ? '' : '| (Not Implemented)' }}
                  <span class="text-2xs">
                    {{ inventoryStore.getItemById(drop.name)?.type }}
                  </span>
                  <span class="text-2xs">
                    {{ inventoryStore.getItemById(drop.name)?.description }}
                  </span>
                </div>
                <div class="text-sm text-gray-600 flex flex-col">
                  <span>
                    Chance: {{ (drop.chance * 100).toFixed(1) }}%
                  </span>
                  <span>
                    Amount between: {{ drop.amountBetween[0] }} - {{ drop.amountBetween[1] }}
                  </span>
                  <span v-if="drop.unlockText">
                    {{ drop.unlockText }}
                  </span>
                </div>
              </div>
              <div
                v-else
              >
                <div
                  class="text-gray-400"
                >
                  Locked ({{ drop.unlockText }})
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div
          v-else
          class="py-4"
        >
          <p class="text-gray-700">
            Select an enemy from the list to view details.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useAdventureStore} from '@/stores/adventureStore'
import {Enemy} from '@/types/AdventureEnemyWaves'
import {useInventoryStore} from '@/stores/inventoryStore'

const searchQuery = ref('')
const selectedEnemy = ref<Enemy | null>(null)
const adventureStore = useAdventureStore()
const inventoryStore = useInventoryStore()

// Flatten enemies and add area (wave name)
const allEnemies = computed(() => adventureStore.enemyWaves.flatMap((wave) =>
  wave.enemies.map((enemy) => ({
    ...enemy,
    area: wave.name,
  })),
))

const filteredEnemies = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return allEnemies.value.filter(
    (enemy) =>
      enemy.name.toLowerCase().includes(query) ||
      enemy.area.toLowerCase().includes(query),
  )
})

const selectEnemy = (enemy: Enemy) => {
  selectedEnemy.value = enemy
}
</script>
