<template>
  <div class="relative w-full h-screen flex flex-col gap-3 rounded-lg p-6 bg-white">
    <!-- Boss Section -->
    <section
      v-if="currentBoss"
      class="text-center mb-10"
    >
      <h2 class="text-3xl font-bold mb-4">
        {{ currentBoss.name }}
      </h2>

      <!-- Boss Health Bar -->
      <div class="w-full max-w-3xl h-8 bg-gray-700 rounded-lg mx-auto relative">
        <div
          class="h-full bg-red-500 rounded-lg"
          :style="{ width: bossHealthPercentage + '%' }"
        />
      </div>

      <div class="mt-2 text-lg">
        <p>{{ formatNumber(currentBoss.health) }} / {{ formatNumber(currentBoss.maxHealth) }} HP</p>
        <div class="grid grid-cols-3 gap-4 mt-4">
          <div>
            <div class="text-gray-600">
              Attack
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(currentBoss.damage) }}
            </div>
          </div>
          <div>
            <div class="text-gray-600">
              Defense
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(currentBoss.defense) }}
            </div>
          </div>
          <div>
            <div class="text-gray-600">
              Regen
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(currentBoss.regen) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Army Section -->
    <section
      v-if="armyStats"
      class="text-center mb-10"
    >
      <h2 class="text-3xl font-bold mb-4">
        Army
      </h2>

      <!-- Army Health Bar -->
      <div class="w-full max-w-3xl h-8 bg-gray-700 rounded-lg mx-auto relative">
        <div
          class="h-full bg-green-500 rounded-lg"
          :style="{ width: armyHealthPercentage + '%' }"
        />
      </div>

      <div class="mt-2 text-lg">
        <p>{{ formatNumber(armyStats.health) }} / {{ formatNumber(armyStats.maxHealth) }} HP</p>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <div class="text-gray-600">
              Attack
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(armyStats.damage) }}
            </div>
          </div>
          <div>
            <div class="text-gray-600">
              Defense
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(armyStats.defense) }}
            </div>
          </div>
          <div>
            <div class="text-gray-600">
              Regen
            </div>
            <div class="text-lg font-semibold text-gray-800">
              {{ formatNumber(armyStats.regen) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Action Buttons -->
    <section class="flex justify-center">
      <button
        v-if="bossStore.battleState === 'idle'"
        class="bg-blue-500 text-white rounded-lg px-4 py-2"
        @click="bossStore.setBattleState('fighting')"
      >
        Attack
      </button>
      <button
        v-else
        class="bg-red-500 text-white rounded-lg px-4 py-2"
        @click="bossStore.setBattleState('idle')"
      >
        Stop
      </button>
    </section>
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
/* Add any additional custom styles here if you need to customize further */
</style>
