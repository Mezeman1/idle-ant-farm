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

    <div class="flex flex-col items-center justify-center gap-1">
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
    </div>
    <p
      class="text-center text-sm text-gray-500 mt-4"
    >
      More settings will be added here in the future.
    </p>
  </div>
</template>

<script setup lang="ts">
import Modal from '../components/Modal.vue'
import {ref} from 'vue'
import {useGameStore} from '../stores/gameStore'

const gameStore = useGameStore()

const isModalVisible = ref(false)
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

</script>

<style scoped>

</style>
