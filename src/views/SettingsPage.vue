<template>
  <div>
    <!-- Modal Component -->
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

    <div class="flex flex-col gap-2">
      <p class="text-2xs font-bold">
        Please note, this game is in early development and may have bugs or balance issues.
        <br>
        I will be adding more features and balancing the game over time.
        <br>
        Also, any progress made may be reset at any time during current development stage.
        <br>
        Since I'm updating the game frequently, I recommend refreshing the page to get the latest version.
        <br>
        Resetting the game is also a good idea on updates to get the latest balance changes.
      </p>

      <div class="flex flex-col gap-2">
        <p class="text-xl font-bold">
          Settings
        </p>
        <div class="flex gap-2 items-center">
          <label>
            Show prestige warning
          </label>
          <input
            v-model="settingsStore.showPrestigeWarning"
            type="checkbox"
          >
        </div>
      </div>

      <button
        v-tooltip="'This will reset your game and give you a fresh start. Added for demo purposes.'"
        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow"
        @click="confirmReset"
      >
        Hard Reset Game
      </button>

      <button
        v-tooltip="'This will delete all your data from firebase.'"
        class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded shadow"
        @click="confirmDelete"
      >
        Delete all my data
      </button>

      <div class="flex flex-col gap-2">
        <textarea
          v-model="importString"
          class="w-full h-32 p-2 rounded shadow"
          placeholder="Paste your exported data here"
        />

        <div class="flex gap-1">
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow"
            @click="exportGame()"
          >
            Export
          </button>

          <button
            class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow"
            @click="gameStore.importData(importString)"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Modal from '../components/Modal.vue'
import {ref} from 'vue'
import {useGameStore} from '../stores/gameStore'
import {useSettingsStore} from '@/stores/settingsStore'

const gameStore = useGameStore()
const settingsStore = useSettingsStore()

const isModalVisible = ref(false)
const importString = ref('')
// Show the modal when clicking the prestige button
const confirmReset = () => {
  isModalVisible.value = true
}

// Handle the confirm action from the modal
const handleConfirm = () => {
  gameStore.resetGameState(true)
  isModalVisible.value = false
}

// Handle the cancel action from the modal
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

</style>
