<template>
  <div class="max-h-screen-3/4 overflow-y-auto p-4 md:p-6">
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
      <div class="col-span-3">
        <p class="text-xs md:text-sm font-bold leading-relaxed">
          Please note, this game is in early development and may have bugs or balance issues.
          I will be adding more features and balancing the game over time.
          Also, any progress made may be reset at any time during the current development stage.
        </p>
      </div>

      <div class="col-span-3">
        <p class="text-lg md:text-2xl font-bold">
          Settings
        </p>
      </div>

      <div class="flex items-center justify-between">
        <label class="text-sm md:text-base font-medium">Show prestige warning</label>
        <input
          v-model="settingsStore.showPrestigeWarning"
          type="checkbox"
          class="form-checkbox"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy seed storage threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoSeedStorageUpgrade"
          type="number"
          :max="useResourcesStore().storage.maxSeeds"
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy larvae storage threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoLarvaeStorageUpgrade"
          type="number"
          :max="useResourcesStore().storage.maxSeeds"
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy elite ants creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoEliteAntsCreationSeeds"
          type="number"
          :max="useResourcesStore().storage.maxSeeds"
          class="form-input"
        >

        <label>Auto buy elite ants creation larvae threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoEliteAntsCreationLarvae"
          type="number"
          :max="useResourcesStore().storage.maxLarvae"
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy ant creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoAntCreationSeeds"
          type="number"
          :max="useResourcesStore().storage.maxSeeds"
          class="form-input"
        >

        <label>Auto buy ant creation larvae threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoAntCreationLarvae"
          type="number"
          :max="useResourcesStore().storage.maxLarvae"
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-2">
        <label>Auto buy queen creation seeds threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoQueenCreationSeeds"
          type="number"
          :max="useResourcesStore().storage.maxSeeds"
          class="form-input"
        >

        <label>Auto buy queen creation ants threshold</label>
        <input
          v-model="settingsStore.autoThresholds.autoQueenCreationAnts"
          type="number"
          :max="useResourcesStore().maxAnts"
          class="form-input"
        >
      </div>

      <div class="flex flex-col gap-4 col-span-1">
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
      <div class="flex flex-col gap-4 col-span-2">
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
</script>

<style scoped>
label {
  @apply font-bold text-sm;
}

textarea {
  resize: none;
}

.form-input {
  @apply w-full p-2 rounded shadow border;
}
</style>
