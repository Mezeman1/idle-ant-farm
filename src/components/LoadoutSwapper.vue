<template>
  <div class="p-4 bg-gray-700 rounded-lg shadow-md text-white">
    <h2 class="text-xl font-bold mb-2 text-center">
      Manage Your Loadouts
    </h2>

    <p class="text-center">
      You can create a maximum of {{ equipmentStore.maxLoadOuts }} loadouts. Each loadout saves the current equipment configuration.
    </p>

    <!-- Save Current Loadout -->
    <div class="mb-2">
      <input
        v-model="loadOutName"
        type="text"
        class="border rounded px-2 py-1 mb-2 w-full text-gray-800 bg-white"
        placeholder="Enter loadout name"
      >
      <button
        class="bg-green-500 text-white px-4 py-2 rounded-lg w-full"
        @click="saveLoadOut"
      >
        Save Loadout
      </button>
    </div>

    <!-- List of Loadouts -->
    <div class="mb-2">
      <h3 class="text-lg font-semibold mb-2">
        Saved Loadouts
      </h3>
      <ul class="space-y-2">
        <li
          v-for="loadOut in loadOuts"
          :key="loadOut.name"
          class="flex items-center justify-between bg-gray-500 p-2 rounded-lg shadow"
        >
          <span>{{ loadOut.name }}</span>
          <div class="space-x-2">
            <!-- Load Button -->
            <button
              class="bg-blue-500 text-white px-3 py-1 rounded-lg"
              @click="loadLoadOut(loadOut)"
            >
              Load
            </button>

            <!-- Delete Button -->
            <button
              class="bg-red-500 text-white px-3 py-1 rounded-lg"
              @click="deleteLoadOut(loadOut.name)"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { useEquipmentStore } from '@/stores/equipmentStore'
import { toast } from 'vue3-toastify'

// Access the equipment store
const equipmentStore = useEquipmentStore()

// Local state to store the name for new loadouts
const loadOutName = ref('')

// Computed property to access loadouts from the store
const loadOuts = computed(() => equipmentStore.loadOuts)

// Function to save the current loadout
const saveLoadOut = () => {
  if (loadOutName.value.trim() === '') {
    toast.error('Please enter a name for the loadout')
    return
  }
  equipmentStore.saveLoadOut(loadOutName.value.trim())
  loadOutName.value = ''
}

// Function to load a loadout
const loadLoadOut = (loadOut) => {
  console.log('Loading loadout', loadOut)
  equipmentStore.loadLoadOut(loadOut)
}

// Function to delete a loadout
const deleteLoadOut = (name) => {
  equipmentStore.deleteLoadOut(name)
}
</script>
