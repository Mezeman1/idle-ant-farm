<template>
  <div
    v-if="unlocked"
    class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-2"
  >
    <div>
      <p class="font-bold text-lg">
        {{ resourceName }}
      </p>
      <p class="text-2xs">
        {{ description }}
      </p>
    </div>

    <div class="flex flex-wrap items-start justify-between w-full space-y-2">
      <!-- Resource Count and Upgrade Section -->
      <div class="flex flex-col gap-2 w-full">
        <p class="text-sm">
          Count: {{ formatNumber(currentAmount, 0) }}{{ maxAmount ? `/${formatNumber(maxAmount, 0)}` : '' }}
          <span v-if="productionRate">({{ formatNumber(productionRate) }} /s)</span>
        </p>

        <!-- Storage Upgrade Buttons (if enabled) -->
        <div
          v-if="hasStorageUpgrade"
          class="w-full flex gap-2"
        >
          <button
            :disabled="!canUpgradeStorage"
            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="upgradeStorage"
          >
            Upgrade storage ({{ formatNumber(storageUpgradeCost) }} seeds)
          </button>
          <button
            :disabled="!canUpgradeStorage"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
            @click="upgradeMaxStorage"
          >
            Max
          </button>
        </div>
      </div>

      <!-- Resource Action Buttons -->
      <div
        v-if="hasBuyAction"
        class="w-full flex flex-wrap justify-center gap-2"
      >
        <button
          :disabled="!canBuy"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
          @click="buyAction"
        >
          Buy {{ resourceName }} {{ buyIcon }} ({{ costText }})
        </button>
        <button
          :disabled="!canBuy"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
          @click="buyMaxAction"
        >
          Max
        </button>
      </div>

      <!-- Auto Creation Toggle (if available) -->
      <div
        v-if="autoCreation"
        class="w-full flex"
      >
        <label
          v-if="autoCreationUnlocked"
          class="flex items-center cursor-pointer"
        >
          <span class="mr-3 text-xs text-gray-600">Auto creating</span>
          <div class="relative">
            <input
              type="checkbox"
              :checked="autoCreationComputed"
              class="sr-only"
              @change="updateAutoCreation"
            >
            <div
              :class="{
                'bg-green-500': autoCreationComputed,
                'bg-red-500': !autoCreationComputed
              }"
              class="block w-10 h-6 rounded-full shadow-inner transition-colors"
            />
            <div
              :class="{
                'translate-x-full': autoCreationComputed,
                'translate-x-0': !autoCreationComputed
              }"
              class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform"
            />
          </div>
        </label>
      </div>
    </div>
  </div>
  <div
    v-else
    v-tooltip="lockedTooltip"
    class="bg-gray-300 bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col justify-center items-center select-none"
  >
    <h2>LOCKED</h2>
  </div>
</template>

<script setup lang="ts">
import {computed, defineEmits, defineProps} from 'vue'
import {useGameStore} from '../stores/gameStore'

interface Props {
  resourceName: string;
  description: string;
  currentAmount: number;
  maxAmount?: number;
  seedCost?: number;
  antCost?: number;
  canBuy: boolean;
  buyAction?: () => void;
  buyMaxAction?: () => void;
  buyIcon?: string;
  autoCreation?: boolean;
  autoCreationUnlocked?: boolean;
  autoCreationModelValue?: boolean;
  productionRate?: number; // Optional: Add production rate if needed
  hasStorageUpgrade?: boolean; // New: Indicates whether the resource has a storage upgrade
  storageUpgradeCost?: number; // New: Cost to upgrade the storage
  canUpgradeStorage?: boolean; // New: Whether the storage can be upgraded
  upgradeStorage?: () => void; // New: Action for upgrading storage
  upgradeMaxStorage?: () => void; // New: Action for upgrading max storage
  lockedTooltip?: string;
  unlocked?: boolean;
  hasBuyAction?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  unlocked: true,
  hasBuyAction: true,
})
const emit = defineEmits(['update:autoCreationModelValue'])

// Computed property to manage v-model behavior
const autoCreationComputed = computed({
  get() {
    return props.autoCreationModelValue
  },
  set(value) {
    emit('update:autoCreationModelValue', value)
  },
})

// Method to handle auto-creation checkbox changes
const updateAutoCreation = (event: Event) => {
  autoCreationComputed.value = (event.target as HTMLInputElement).checked
}

const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const costText = computed(() => {
  if (props.seedCost && props.antCost) {
    return `${formatNumber(props.seedCost)} seeds, ${formatNumber(props.antCost)} ants`
  } else if (props.seedCost) {
    return `${formatNumber(props.seedCost)} seeds`
  } else if (props.antCost) {
    return `${formatNumber(props.antCost)} ants`
  }

  return ''
})
</script>

<style scoped>
/* Add scoped styles if needed */
</style>
