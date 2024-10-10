<template>
  <div class="flex-grow overflow-y-auto p-4">
    <div class="grid sm:grid-cols-2 grid-cols-1 gap-4">
      <!-- Boss Stats Section -->
      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <div>
          <p class="font-bold text-lg">
            {{ currentBoss.name }}
          </p>
          <p class="text-sm">
            HP: {{ formatNumber(currentBoss.health) }} / {{ formatNumber(currentBoss.maxHealth) }}
          </p>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="bg-gray-300 rounded-full h-6 w-full">
            <div
              :class="{
                'bg-green-500': bossHealthPercentage > 50,
                'bg-yellow-500': bossHealthPercentage <= 50 && bossHealthPercentage > 20,
                'bg-red-500': bossHealthPercentage <= 20
              }"
              class="h-full rounded-full"
              :style="{ width: bossHealthPercentage + '%' }"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <div>
              <p class="text-gray-600">
                Attack
              </p>
              <p class="font-semibold">
                {{ formatNumber(currentBoss.damage) }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">
                Defense
              </p>
              <p class="font-semibold">
                {{ formatNumber(currentBoss.defense) }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">
                Regen
              </p>
              <p class="font-semibold">
                {{ formatNumber(currentBoss.regen) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Army Stats Section -->
      <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2">
        <div>
          <p class="font-bold text-lg">
            Army
          </p>
          <p class="text-sm">
            HP: {{ formatNumber(armyStats.health) }} / {{ formatNumber(armyStats.maxHealth) }}
          </p>
        </div>
        <div class="flex flex-col space-y-2">
          <div class="bg-gray-300 rounded-full h-6 w-full">
            <div
              :class="{
                'bg-green-500': armyHealthPercentage > 50,
                'bg-yellow-500': armyHealthPercentage <= 50 && armyHealthPercentage > 20,
                'bg-red-500': armyHealthPercentage <= 20
              }"
              class="h-full rounded-full"
              :style="{ width: armyHealthPercentage + '%' }"
            />
          </div>
          <div class="flex flex-col space-y-2">
            <div>
              <p class="text-gray-600">
                Attack
              </p>
              <p class="font-semibold">
                {{ formatNumber(armyStats.damage) }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">
                Defense
              </p>
              <p class="font-semibold">
                {{ formatNumber(armyStats.defense) }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">
                Regen
              </p>
              <p class="font-semibold">
                {{ formatNumber(armyStats.regen) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col space-y-4 p-4">
      <button
        v-if="bossStore.battleState === 'idle'"
        class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded shadow-md w-full"
        @click="bossStore.setBattleState('fighting')"
      >
        Attack
      </button>
      <button
        v-else
        class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded shadow-md w-full"
        @click="bossStore.setBattleState('idle')"
      >
        Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBossStore } from '@/stores/bossStore'
import { useGameStore } from '@/stores/gameStore'

const bossStore = useBossStore()
const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const currentBoss = computed(() => bossStore.currentBossData)
const { armyStats } = storeToRefs(bossStore)

const bossHealthPercentage = computed(() => {
  return (currentBoss.value.health / currentBoss.value.maxHealth) * 100
})

const armyHealthPercentage = computed(() => {
  return (armyStats.value.health / armyStats.value.maxHealth) * 100
})
</script>

<style scoped>
/* Custom styles for consistency */
</style>
