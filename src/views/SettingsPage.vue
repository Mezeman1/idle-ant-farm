<template>
  <div class="flex flex-col overflow-y-auto p-2">
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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-3">
        <p class="text-xs md:text-sm font-bold leading-relaxed">
          Please note, this game is in early development and may have bugs or balance issues.
          I will be adding more features and balancing the game over time.
          Also, any progress made may be reset at any time during the current development stage.
        </p>
      </div>

      <div class="md:col-span-3">
        <p class="text-lg md:text-2xl font-bold">
          Settings
        </p>
      </div>

      <div class="flex flex-col gap-2">
        <label>Show prestige warning</label>
        <input
          v-model="settingsStore.showPrestigeWarning"
          type="checkbox"
          class="form-checkbox"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Number notation</label>
        <select
          v-model="settingsStore.notation"
          class="form-select"
        >
          <option value="scientific">
            Scientific
          </option>
          <option value="longText">
            Letters
          </option>
        </select>
      </div>

      <!-- Slider for auto buy seed storage threshold -->
      <div class="flex flex-col gap-2">
        <label>Auto buy seed storage threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoSeedStorageUpgrade"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoSeedStorageUpgrade }}%</span>
      </div>

      <!-- Slider for auto buy larvae storage threshold -->
      <div class="flex flex-col gap-2">
        <label>Auto buy larvae storage threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoLarvaeStorageUpgrade"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoLarvaeStorageUpgrade }}%</span>
      </div>

      <!-- Slider for auto buy elite ants creation seeds threshold -->
      <div class="flex flex-col gap-2">
        <label>Auto buy elite ants creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoEliteAntsCreationSeeds"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoEliteAntsCreationSeeds }}%</span>

        <label>Auto buy elite ants creation larvae threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoEliteAntsCreationLarvae"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoEliteAntsCreationLarvae }}%</span>
      </div>

      <!-- Slider for auto buy ant creation seeds threshold -->
      <div class="flex flex-col gap-2">
        <label>Auto buy ant creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoAntCreationSeeds"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoAntCreationSeeds }}%</span>

        <label>Auto buy ant creation larvae threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoAntCreationLarvae"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoAntCreationLarvae }}%</span>
      </div>

      <!-- Slider for auto buy queen creation thresholds -->
      <div class="flex flex-col gap-2">
        <label>Auto buy queen creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoQueenCreationSeeds"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoQueenCreationSeeds }}%</span>

        <label>Auto buy queen creation ants threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoQueenCreationAnts"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoQueenCreationAnts }}%</span>
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy housing threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoCreateHousing"
          type="range"
          min="0"
          max="100"
          step="1"
          class="form-range"
        >
        <span>{{ settingsStore.autoThresholds.autoCreateHousing }}%</span>
      </div>

      <!-- New buttons for background and animation -->
      <div class="flex flex-col gap-4 md:col-span-1">
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow"
          @click="toggleBackground"
        >
          {{ settingsStore.showBackground ? 'Hide Background' : 'Show Background' }}
        </button>

        <button
          class="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded shadow"
          @click="toggleAnimation"
        >
          {{ settingsStore.showAnimation ? 'Hide Animation' : 'Show Animation' }}
        </button>
      </div>

      <!-- Reset and Delete buttons -->
      <div class="flex flex-col gap-4 md:col-span-1">
        <button
          v-tooltip="'This will reset your game and give you a fresh start.'"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded shadow"
          @click="confirmReset"
        >
          Hard Reset Game
        </button>

        <button
          v-tooltip="'This will delete all your data from firebase.'"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded shadow"
          @click="confirmDelete"
        >
          Delete all my data
        </button>
      </div>

      <!-- Export/Import Data -->
      <div class="flex flex-col gap-4 md:col-span-2">
        <textarea
          v-model="importString"
          class="w-full h-32 p-2 rounded shadow border"
          placeholder="Paste your exported data here"
        />

        <div class="flex gap-2">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded shadow w-full md:w-auto"
            @click="exportGame()"
          >
            Export data
          </button>

          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded shadow w-full md:w-auto"
            @click="gameStore.importData(importString)"
          >
            Import data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from '../components/Modal.vue'
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useResourcesStore } from '@/stores/resourcesStore'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const isModalVisible = ref(false)
const importString = ref('')

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
label {
  @apply font-bold text-sm;
}

.form-range {
  @apply w-full;
}

textarea {
  resize: none;
}
</style>
