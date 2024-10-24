<template>
  <div class="bg-white rounded-lg shadow-md flex flex-col">
    <div
      class="h-32 bg-cover bg-center rounded-t-lg relative"
      :style="{ backgroundImage: `url(${image})` }"
    >
      <div
        v-if="cooldownProgress !== undefined"
        class="absolute bottom-0 w-full h-1 bg-gray-300"
      >
        <div
          class="bg-blue-500 h-full"
          :style="{ width: `${cooldownProgress}%` }"
        />
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-lg mb-2">
          {{ title }} {{ isBoss ? '👑' : '' }}
        </h3>
        <p class="text-sm mb-1">
          Health: {{ formatNumber(health) }} / {{ formatNumber(maxHealth) }}
        </p>
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            class="bg-green-600 h-2.5 rounded-full"
            :style="{ width: `${(health / maxHealth) * 100}%` }"
          />
        </div>
      </div>
      <div class="text-sm space-y-1">
        <p><span class="font-semibold">⚔️ Attack:</span> {{ formatNumber(attack) }}</p>
        <p><span class="font-semibold">🛡️ Defense:</span> {{ formatNumber(defense) }}</p>
        <p><span class="font-semibold">❤️ HP Regen:</span> {{ formatNumber(regen) }}</p>
      </div>
      <div class="mt-2 text-xs">
        <p class="font-semibold">
          🧪 Active Effects:
        </p>
        <ul
          v-if="activeEffects.length > 0"
          class="list-disc list-inside"
        >
          <li
            v-for="effect in activeEffects"
            :key="effect.id"
          >
            {{ effect.name }} - {{ Math.round(effect.duration) }}s
            <span v-if="effect.damagePerSecond">(DPS: {{ formatNumber(effect.damagePerSecond) }})</span>
            <span v-if="effect.healingPerSecond">(HPS: {{ formatNumber(effect.healingPerSecond) }})</span>
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
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

const { formatNumber } = useGameStore()

defineProps<{
  title: string
  image?: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  regen: number
  activeEffects: any[]
  isBoss?: boolean
  cooldownProgress?: number
}>()
</script>
