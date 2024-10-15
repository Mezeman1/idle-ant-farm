<template>
  <div class="flex flex-col overflow-y-auto p-4 space-y-4">
    <!-- Modal Components -->
    <Modal
      v-if="isModalVisible"
      title="HARD RESET!"
      message="Are you sure you want to reset the game?"
      :visible="isModalVisible"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <Modal
      v-if="isDeleteModalVisible"
      title="DELETE ALL DATA!"
      message="Are you sure you want to delete all your data?"
      :visible="isDeleteModalVisible"
      @confirm="handleDeleteConfirm"
      @cancel="handleDeleteCancel"
    />

    <div class="bg-white shadow-md rounded-md p-4 space-y-4">
      <p class="text-xs md:text-sm font-bold leading-relaxed">
        Please note, this game is in early development and may have bugs or balance issues. I will be adding more features and balancing the game over time. Also, any progress made may be reset at any time during the current development stage.
      </p>
      <p class="text-right">
        Version: {{ version }}
      </p>
    </div>

    <div class="bg-white shadow-md rounded-md p-4">
      <p class="text-lg md:text-2xl font-bold mb-4">
        Settings
      </p>

      <!-- Collapsible Group: Notifications -->
      <div class="space-y-2">
        <details class="group bg-gray-100 rounded-md p-4">
          <summary class="cursor-pointer text-lg font-semibold group-open:underline">
            Notifications
          </summary>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <label>Show prestige warning</label>
              <input
                v-model="settingsStore.showPrestigeWarning"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>

            <div class="flex items-center">
              <label>Loot notifications</label>
              <input
                v-model="settingsStore.notifications.loot"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>

            <div class="flex items-center">
              <label>Load game notifications</label>
              <input
                v-model="settingsStore.notifications.load"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>

            <div class="flex items-center">
              <label>Save game notifications</label>
              <input
                v-model="settingsStore.notifications.save"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>

            <div class="flex items-center">
              <label>Achievement notifications</label>
              <input
                v-model="settingsStore.notifications.achievements"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>

            <div class="flex items-center">
              <label>Royal Jelly notifications</label>
              <input
                v-model="settingsStore.notifications.royalJelly"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>
            
            <div class="flex items-center">
              <label>Mature crop notifications</label>
              <input
                v-model="settingsStore.notifications.matureCrops"
                type="checkbox"
                class="ml-auto form-checkbox"
              >
            </div>
          </div>
        </details>

        <!-- Collapsible Group: Threshold Settings -->
        <details class="group bg-gray-100 rounded-md p-4">
          <summary class="cursor-pointer text-lg font-semibold group-open:underline">
            Auto Buy Thresholds
          </summary>
          <div class="mt-4 space-y-4">
            <!-- Auto Buy Seed Storage Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy seed storage threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoSeedStorageUpgrade"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoSeedStorageUpgrade }}%</span>
              </div>
            </div>

            <!-- Auto Buy Larvae Storage Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy larvae storage threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoLarvaeStorageUpgrade"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoLarvaeStorageUpgrade }}%</span>
              </div>
            </div>

            <!-- Auto Buy Elite Ants Creation Seeds Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy elite ants creation seeds threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoEliteAntsCreationSeeds"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoEliteAntsCreationSeeds }}%</span>
              </div>
            </div>

            <!-- Auto Buy Elite Ants Creation Larvae Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy elite ants creation larvae threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoEliteAntsCreationLarvae"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoEliteAntsCreationLarvae }}%</span>
              </div>
            </div>

            <!-- Auto Buy Ant Creation Seeds Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy ant creation seeds threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoAntCreationSeeds"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoAntCreationSeeds }}%</span>
              </div>
            </div>

            <!-- Auto Buy Ant Creation Larvae Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy ant creation larvae threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoAntCreationLarvae"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoAntCreationLarvae }}%</span>
              </div>
            </div>

            <!-- Auto Buy Queen Creation Seeds Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy queen creation seeds threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoQueenCreationSeeds"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoQueenCreationSeeds }}%</span>
              </div>
            </div>

            <!-- Auto Buy Queen Creation Ants Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy queen creation ants threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoQueenCreationAnts"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoQueenCreationAnts }}%</span>
              </div>
            </div>

            <!-- Auto Buy Housing Threshold -->
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <label class="w-full md:w-1/2">Auto buy housing threshold</label>
              <div class="w-full md:w-1/2 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                  v-model="settingsStore.autoThresholds.autoCreateHousing"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  class="form-range w-full"
                >
                <span class="w-16 text-right">{{ settingsStore.autoThresholds.autoCreateHousing }}%</span>
              </div>
            </div>
          </div>
        </details>


        <!-- Collapsible Group: Visual Settings -->
        <details class="group bg-gray-100 rounded-md p-4">
          <summary class="cursor-pointer text-lg font-semibold group-open:underline">
            Visual Settings
          </summary>
          <div class="mt-4 flex flex-col md:flex-row gap-4">
            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md w-full md:w-auto"
              @click="toggleBackground"
            >
              {{ settingsStore.showBackground ? 'Hide Background' : 'Show Background' }}
            </button>

            <button
              class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md w-full md:w-auto"
              @click="toggleAnimation"
            >
              {{ settingsStore.showAnimation ? 'Hide Animation' : 'Show Animation' }}
            </button>
          </div>
        </details>
      </div>
    </div>

    <!-- Reset and Delete buttons -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow-md"
        @click="confirmReset"
      >
        Hard Reset Game
      </button>

      <button
        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md shadow-md"
        @click="confirmDelete"
      >
        Delete all my data
      </button>
    </div>

    <!-- Export/Import Data -->
    <div class="bg-white shadow-md rounded-md p-4">
      <textarea
        v-model="importString"
        class="w-full h-32 p-2 rounded-md shadow border"
        placeholder="Paste your exported data here"
      />
      <div class="flex gap-2 mt-4">
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow w-full md:w-auto"
          @click="exportGame()"
        >
          Export data
        </button>
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md shadow w-full md:w-auto"
          @click="gameStore.importData(importString)"
        >
          Import data
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Modal from '../components/ModalComponent.vue'
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useResourcesStore } from '@/stores/resourcesStore'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const isModalVisible = ref(false)
const importString = ref('')

const version = import.meta.env.PACKAGE_VERSION
const confirmReset = () => {
  isModalVisible.value = true
}

const handleConfirm = () => {
  gameStore.resetGameState(true)
  isModalVisible.value = false
}

const handleCancel = () => {
  isModalVisible.value = false
}

const isDeleteModalVisible = ref(false)
const confirmDelete = () => {
  isDeleteModalVisible.value = true
}

const handleDeleteConfirm = () => {
  gameStore.deleteAllData()
  isDeleteModalVisible.value = false
}

const handleDeleteCancel = () => {
  isDeleteModalVisible.value = false
}

const exportGame = async () => {
  const data = await gameStore.exportData()
  importString.value = data
}

const toggleBackground = () => {
  settingsStore.showBackground = !settingsStore.showBackground
}

const toggleAnimation = () => {
  settingsStore.showAnimation = !settingsStore.showAnimation
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
