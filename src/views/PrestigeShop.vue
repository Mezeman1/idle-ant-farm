<template>
  <div class="flex flex-col overflow-y-auto h-full">
    <!-- Modal Component -->
    <Modal
      v-if="isModalVisible"
      title="Prestige!"
      message="Are you sure you want to prestige?"
      :visible="isModalVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- Fixed prestige points display -->
    <div class="bg-purple-100 border-l-4 border-purple-500 text-purple-700 p-4 sticky top-0 z-10 shadow-md">
      <p class="font-bold">
        Prestige Points: {{ formatNumber(prestigeStore.prestigePoints) }}
      </p>
    </div>

    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-4 flex-grow">
      <div class="bg-blue-100 p-4 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-2 text-center text-blue-800">
          Prestige Point Calculation
        </h2>
        <p class="text-sm text-blue-700 mb-2">
          Calculated based on amount of ants and time since last prestige.
        </p>
        <p class="text-sm text-blue-700">
          Time since last prestige: {{ timeSinceLastPrestige }}
        </p>
        <div class="flex justify-between items-center mt-4">
          <p class="text-blue-800 font-medium">
            Prestige Points: {{ formatNumber(prestigeStore.prestigePoints) }}
          </p>
          <p class="text-blue-800 font-medium">
            Prestige Times: {{ formatNumber(prestigeStore.timesPrestiged) }}
          </p>
        </div>
      </div>

      <!-- Prestige Button -->
      <div class="flex flex-col items-center space-y-2">
        <button
          :disabled="prestigeStore.calculatePrestigePoints() < 1 || waitTime > 0"
          class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="confirmPrestige()"
        >
          Prestige for {{ formatNumber(prestigeStore.calculatePrestigePoints()) }} Points
        </button>
        <p
          v-if="waitTime > 0"
          class="text-sm text-gray-600"
        >
          You can prestige in {{ waitTime }} seconds
        </p>
      </div>

      <!-- Category Controls -->
      <div class="flex justify-end space-x-2">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm transition duration-300 ease-in-out"
          @click="toggleAll(false)"
        >
          Collapse All
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-md text-sm transition duration-300 ease-in-out"
          @click="toggleAll(true)"
        >
          Expand All
        </button>
      </div>

      <!-- Upgrade Categories -->
      <div class="flex-grow overflow-y-auto space-y-4">
        <div
          v-for="category in categorizedUpgrades"
          :key="category.name"
          class="bg-gray-100 rounded-lg shadow-md overflow-hidden"
        >
          <button
            class="w-full flex items-center justify-between bg-gray-200 p-3 font-bold text-gray-800 hover:bg-gray-300 transition duration-300 ease-in-out"
            @click="toggleCategory(category.name)"
          >
            <span>{{ category.name }}</span>
            <div class="flex items-center">
              <span
                v-if="category.allBought"
                class="text-green-600 text-sm mr-2"
              >✓ Complete</span>
              <span class="text-xl">{{ category.expanded ? '−' : '+' }}</span>
            </div>
          </button>

          <!-- Upgrade List -->
          <div
            v-if="category.expanded"
            class="p-3 space-y-3"
          >
            <div
              v-for="upgrade in category.upgrades"
              :key="upgrade.id"
              class="bg-white p-3 rounded-md shadow-sm"
            >
              <h3 class="font-semibold text-gray-800">
                {{ upgrade.name }} {{ getUpgradeCount(upgrade) }}
                <span
                  v-if="!isUpgradeUnlocked(upgrade)"
                  class="text-red-500 text-sm"
                >(Locked)</span>
              </h3>
              <p
                v-if="!isUpgradeUnlocked(upgrade)"
                class="text-sm text-gray-600 mt-1"
              >
                Unlocked by:
                {{ typeof upgrade.unlockedWhenDescription === 'function'
                  ? upgrade.unlockedWhenDescription()
                  : upgrade.unlockedWhenDescription
                }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ upgrade.description }}
              </p>
              <div
                v-if="isUpgradeMaxed(upgrade)"
                class="text-sm text-green-600 mt-2 font-medium flex items-center"
              >
                <span class="mr-1">✓</span> Purchased
              </div>
              <div
                v-else
                class="flex justify-between items-center mt-2 space-x-2"
              >
                <button
                  :disabled="prestigeStore.prestigePoints < upgrade.cost || isUpgradeUnlocked(upgrade) === false"
                  class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow-sm text-sm transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed flex-grow"
                  @click="prestigeStore.buyUpgrade(upgrade.id)"
                >
                  Buy for {{ formatNumber(upgrade.cost) }} Points
                </button>
                <button
                  v-if="!upgrade.oneTimePurchase"
                  :disabled="prestigeStore.prestigePoints < upgrade.cost || isUpgradeUnlocked(upgrade) === false"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow-sm text-sm transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                  @click="prestigeStore.buyMaxUpgrade(upgrade.id)"
                >
                  Buy max
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from 'vue'

import {useGameStore} from '../stores/gameStore'
import Modal from '../components/ModalComponent.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'
import {useSettingsStore} from '@/stores/settingsStore'

const gameStore = useGameStore()
const prestigeStore = usePrestigeStore()
const formatNumber = (num: number) => gameStore.formatNumber(num, 0)

// Function to check if an upgrade is maxed out
const isUpgradeMaxed = (upgrade) => {
  if (upgrade.oneTimePurchase && prestigeStore.upgradePurchased(upgrade.id)) return true

  // Check if the upgrade has a max purchase limit and if it's been reached
  return upgrade.maxPurchases !== undefined && prestigeStore.amountOfUpgrade(upgrade.id) >= upgrade.maxPurchases
}

const categories = [
  {
    name: 'Auto Features',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'auto'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'auto')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
  {
    name: 'Storage Upgrades', 
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'storage'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'storage')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
  {
    name: 'Production Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'production'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'production')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
  {
    name: 'Combat Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'combat'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'combat')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
  {
    name: 'Adventure Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'adventure'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'adventure')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
  {
    name: 'Expansion Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'expansion'),
    allBought: prestigeStore.prestigeShop
      .filter(upgrade => upgrade.category === 'expansion')
      .every(upgrade => isUpgradeMaxed(upgrade)),
  },
]

let intervalId = null
const timeSinceLastPrestige = ref(0)
const waitTime = ref(1)

onMounted(() => {
  // Set up an interval to update the time since last prestige every second
  intervalId = setInterval(() => {
    timeSinceLastPrestige.value = prestigeStore.timeSinceLastPrestigeFormatted()
    waitTime.value = formatNumber((60000 - (Date.now() - prestigeStore.lastPrestige) ) / 1000, 0)
  }, 1000)
})

onUnmounted(() => {
  // Clear the interval when the component is destroyed to prevent memory leaks
  if (intervalId) {
    clearInterval(intervalId)
  }
})



// Function to check if an upgrade is unlocked
const isUpgradeUnlocked = (upgrade) => {
  // If there's no unlock condition, it's unlocked by default
  if (!upgrade.unlockedWhen) return true
  // If there's an unlock condition, check if it returns true
  return typeof upgrade.unlockedWhen === 'function' && upgrade.unlockedWhen()
}

// Helper function to get the current upgrade count
const getUpgradeCount = (upgrade) => {
  if (upgrade.oneTimePurchase) return ''

  return !upgrade.oneTimePurchase
    ? `(${prestigeStore.amountOfUpgrade(upgrade.id)}${upgrade.maxPurchases ? `/${upgrade.maxPurchases}` : ''})`
    : ''
}

// Make the categories reactive and add an "expanded" property to control visibility
const categorizedUpgrades = ref(categories.map(category => ({
  ...category,
  expanded: false,
})))

const toggleCategory = (categoryName) => {
  const category = categorizedUpgrades.value.find(cat => cat.name === categoryName)
  if (category) {
    category.expanded = !category.expanded
  }
}

const isModalVisible = ref(false)
const settingsStore = useSettingsStore()
// Show the modal when clicking the prestige button
const confirmPrestige = () => {
  if (settingsStore.showPrestigeWarning === false) {
    handleConfirm()
    return
  }

  isModalVisible.value = true
}

// Handle the confirm action from the modal
const handleConfirm = () => {
  prestigeStore.prestige()
  isModalVisible.value = false
}

// Handle the cancel action from the modal
const handleCancel = () => {
  isModalVisible.value = false
}


const toggleAll = (value) => {
  categorizedUpgrades.value.forEach(category => {
    category.expanded = value
  })
}
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
