<template>
  <div>
    <!-- Modal Component -->
    <Modal
      v-if="isModalVisible"
      title="Prestige!"
      message="Are you sure you want to prestige?"
      :visible="isModalVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <div class="bg-white bg-opacity-50 p-4 rounded-lg shadow-md flex flex-col space-y-4">
      <p class="font-bold text-lg">
        Prestige
      </p>
      <div class="bg-gray-800 text-white p-4 rounded-lg shadow-md max-w-sm mx-auto">
        <h2 class="text-base font-semibold mb-2 text-center">
          Prestige Point Calculation
        </h2>
        <ul class="space-y-2 text-xs">
          <li>
            <strong>Seeds:</strong> Prestige points start at 2000 seeds. After that, points increase slowly on a logarithmic scale.
          </li>
          <li>
            <strong>Ants:</strong> For every 50 ants (excluding those bought via the Prestige Shop), you earn 1 prestige point.
          </li>
          <li>
            <strong>Queens:</strong> After the first queen, every additional queen gives 2 prestige points.
          </li>
        </ul>
      </div>
      <div class="flex items-center justify-between w-full">
        <p>Prestige Points: {{ formatNumber(gameStore.prestigePoints) }}</p>
        <button
          :disabled="gameStore.calculatePrestigePoints() < 1"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="confirmPrestige()"
        >
          Prestige for {{ formatNumber(gameStore.calculatePrestigePoints()) }} Points
        </button>
      </div>

      <!-- Collapsible Upgrade Sections -->
      <div
        v-for="category in categorizedUpgrades"
        :key="category.name"
        class="category-section"
      >
        <button
          class="w-full flex items-center justify-between bg-gray-200 hover:bg-gray-300 p-2 rounded"
          @click="toggleCategory(category.name)"
        >
          <span class="font-bold">{{ category.name }}</span>
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
            class="flex items-center justify-between bg-white p-2 rounded shadow"
          >
            <div>
              <p>
                {{ upgrade.name }} {{
                  !upgrade.oneTimePurchase && gameStore.amountOfUpgrade(upgrade.id) > 0 ? `(${gameStore.amountOfUpgrade(upgrade.id)})` : ''
                }}
              </p>
              <p class="text-xs text-gray-500">
                <span v-html="upgrade.description" />
              </p>
              <p
                v-if="upgrade.oneTimePurchase && gameStore.upgradePurchased(upgrade.id)"
                class="text-xs text-blue-600"
              >
                Purchased
              </p>
            </div>
            <button
              v-if="!upgrade.oneTimePurchase || !gameStore.upgradePurchased(upgrade.id)"
              :disabled="gameStore.prestigePoints < upgrade.cost"
              class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
              @click="gameStore.buyUpgrade(upgrade.id)"
            >
              Buy for {{ formatNumber(upgrade.cost) }} Points
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

import {useGameStore} from '../stores/gameStore'
import Modal from '../components/Modal.vue'

const gameStore = useGameStore()
const formatNumber = gameStore.formatNumber

const categories = [
  {
    name: 'Storage Upgrades',
    upgrades: gameStore.prestigeShop.filter(upgrade => upgrade.category === 'storage'),
  },
  {
    name: 'Production Upgrades',
    upgrades: gameStore.prestigeShop.filter(upgrade => upgrade.category === 'production'),
  },
  {
    name: 'Auto Features',
    upgrades: gameStore.prestigeShop.filter(upgrade => upgrade.category === 'auto'),
  },
  {
    name: 'Combat Upgrades',
    upgrades: gameStore.prestigeShop.filter(upgrade => upgrade.category === 'combat'),
  },
  {
    name: 'Expansion Upgrades',
    upgrades: gameStore.prestigeShop.filter(upgrade => upgrade.category === 'expansion'),
  },
]

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
// Show the modal when clicking the prestige button
const confirmPrestige = () => {
  isModalVisible.value = true
}

// Handle the confirm action from the modal
const handleConfirm = () => {
  gameStore.prestige()
  isModalVisible.value = false
}

// Handle the cancel action from the modal
const handleCancel = () => {
  isModalVisible.value = false
}
</script>

<style scoped>

</style>
