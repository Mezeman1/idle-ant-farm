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
        <p>Prestige Points: {{ formatNumber(prestigeStore.prestigePoints) }}</p>
        <button
          :disabled="prestigeStore.calculatePrestigePoints() < 1"
          class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="confirmPrestige()"
        >
          Prestige for {{ formatNumber(prestigeStore.calculatePrestigePoints()) }} Points
        </button>
      </div>

      <!-- Collapsible Upgrade Sections -->
      <div
        v-for="category in categorizedUpgrades"
        :key="category.name"
        class="category-section"
      >
        <div
          v-if="!allUpgradesInCategoryPurchaseableForOneTimePurchase(category.name)"
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
              class="flex flex-col bg-white p-2 rounded shadow"
            >
              <div>
                <p>
                  {{ upgrade.name }} {{
                    !upgrade.oneTimePurchase && prestigeStore.amountOfUpgrade(upgrade.id) > 0 ? `(${prestigeStore.amountOfUpgrade(upgrade.id)})` : ''
                  }}
                </p>
                <p class="text-xs text-gray-500">
                  <span v-html="upgrade.description" />
                </p>
                <p
                  v-if="upgrade.oneTimePurchase && prestigeStore.upgradePurchased(upgrade.id)"
                  class="text-xs text-blue-600"
                >
                  Purchased
                </p>
              </div>
              <div class="flex justify-between items-center">
                <button
                  v-if="!upgrade.oneTimePurchase || !prestigeStore.upgradePurchased(upgrade.id)"
                  :disabled="prestigeStore.prestigePoints < upgrade.cost"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                  @click="prestigeStore.buyUpgrade(upgrade.id)"
                >
                  Buy for {{ formatNumber(upgrade.cost) }} Points
                </button>
                <button
                  v-if="!upgrade.oneTimePurchase && !prestigeStore.upgradePurchased(upgrade.id)"
                  :disabled="prestigeStore.prestigePoints < upgrade.cost"
                  class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow disabled:bg-gray-400 disabled:cursor-not-allowed"
                  @click="prestigeStore.buyMaxUpgrade(upgrade.id)"
                >
                  Buy max
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

import {useGameStore} from '../stores/gameStore'
import Modal from '../components/Modal.vue'
import {usePrestigeStore} from '@/stores/prestigeStore'

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
    name: 'Expansion Upgrades',
    upgrades: prestigeStore.prestigeShop.filter(upgrade => upgrade.category === 'expansion'),
  },
]

const allUpgradesInCategoryPurchaseableForOneTimePurchase = (categoryName) => {
  const category = categories.find(cat => cat.name === categoryName)

  if (!category) {
    return false
  }

  return category.upgrades.every(upgrade => upgrade.oneTimePurchase && prestigeStore.upgradePurchased(upgrade.id))
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
// Show the modal when clicking the prestige button
const confirmPrestige = () => {
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
</script>

<style scoped>

</style>
