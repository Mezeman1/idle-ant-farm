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

    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-4 flex-grow">
      <p class="font-bold text-lg">
        Prestige
      </p>

      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-md max-w-sm mx-auto">
        <h2 class="text-base font-semibold mb-2 text-center">
          Prestige Point Calculation
        </h2>
        <ul class="space-y-2 text-xs text-center">
          <li>
            Calculated based on amount of ants and time since last prestige.
          </li>
          <li>
            Time since last prestige: {{ timeSinceLastPrestige }}
          </li>
        </ul>
      </div>

      <div class="flex flex-col items-center justify-between space-y-2 w-full">
        <p class="text-center">
          Prestige Points: {{ formatNumber(prestigeStore.prestigePoints) }} <br>Prestige Times:
          {{ formatNumber(prestigeStore.timesPrestiged) }}
        </p>
        <button
          :disabled="prestigeStore.calculatePrestigePoints() < 1 || waitTime > 0"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="confirmPrestige()"
        >
          Prestige for {{ formatNumber(prestigeStore.calculatePrestigePoints()) }} Points
        </button>
        <p v-if="waitTime > 0">
          You can prestige in {{ waitTime }} seconds
        </p>
      </div>

      <div class="flex w-full justify-end gap-2">
        <button
          class="small bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow"
          @click="toggleAll(false)"
        >
          Collapse All
        </button>
        <button
          class="small bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow"
          @click="toggleAll(true)"
        >
          Expand All
        </button>
      </div>

      <!-- This section is scrollable -->
      <div class="flex-grow overflow-y-auto flex flex-col gap-2">
        <!-- Collapsible Upgrade Sections -->
        <div
          v-for="category in categorizedUpgrades"
          :key="category.name"
          class="category-section"
        >
          <button
            class="w-full flex items-center justify-between bg-blue-500 hover:bg-blue-600 p-2 rounded font-bold text-white"
            @click="toggleCategory(category.name)"
          >
            <span>{{ category.name }}</span>
            <span v-if="!category.expanded">+</span>
            <span v-if="category.expanded">-</span>
          </button>

          <!-- Upgrade List (shown when expanded) -->
          <ul
            v-if="category.expanded"
            class="space-y-2 mt-2"
          >
            <li
              v-for="upgrade in category.upgrades"
              :key="upgrade.id"
            >
              <div
                class="flex flex-col bg-white p-2 rounded shadow mx-1"
              >
                <p>{{ upgrade.name }} {{ getUpgradeCount(upgrade) }} {{ !isUpgradeUnlocked(upgrade) ? '(Locked)' : '' }}</p>
                <p
                  v-if="!isUpgradeUnlocked(upgrade)"
                  class="text-xs text-gray-500"
                >
                  Unlocked by:
                  {{ typeof upgrade.unlockedWhenDescription === 'function'
                    ? upgrade.unlockedWhenDescription()
                    : upgrade.unlockedWhenDescription
                  }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ upgrade.description }}
                </p>
                <p
                  v-if="isUpgradeMaxed(upgrade)"
                  class="text-xs text-blue-600"
                >
                  Purchased
                </p>
                <div
                  v-else
                  class="flex justify-between items-center"
                >
                  <button
                    :disabled="prestigeStore.prestigePoints < upgrade.cost || isUpgradeUnlocked(upgrade) === false"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                    @click="prestigeStore.buyUpgrade(upgrade.id)"
                  >
                    Buy for {{ formatNumber(upgrade.cost) }} Points
                  </button>
                  <button
                    v-if="!upgrade.oneTimePurchase"
                    :disabled="prestigeStore.prestigePoints < upgrade.cost || isUpgradeUnlocked(upgrade) === false"
                    class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                    @click="prestigeStore.buyMaxUpgrade(upgrade.id)"
                  >
                    Buy max
                  </button>
                </div>
              </div>
            </li>
          </ul>
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


const categories = [
  {
    name: 'Auto Features',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'auto'),
  },
  {
    name: 'Storage Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'storage'),
  },
  {
    name: 'Production Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'production'),
  },
  {
    name: 'Combat Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'combat'),
  },
  {
    name: 'Adventure Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'adventure'),
  },
  {
    name: 'Expansion Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'expansion'),
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

// Function to check if an upgrade is maxed out
const isUpgradeMaxed = (upgrade) => {
  if (upgrade.oneTimePurchase && prestigeStore.upgradePurchased(upgrade.id)) return true

  // Check if the upgrade has a max purchase limit and if it's been reached
  return upgrade.maxPurchases !== undefined && prestigeStore.amountOfUpgrade(upgrade.id) >= upgrade.maxPurchases
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

</style>
