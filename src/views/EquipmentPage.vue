<!-- MainComponent.vue -->
<template>
  <div class="p-4 bg-white bg-opacity-75 rounded-lg shadow-lg relative flex flex-col h-full overflow-y-auto">
    <h2 class="text-xl font-bold mb-2 text-center">
      Equip Your Ant Army
    </h2>

    <!-- Desktop Layout -->
    <div
      v-if="isDesktop"
      class="flex space-x-2"
    >
      <!-- Equipment Section -->
      <div class="flex-1">
        <EquipmentSectionComponent />
      </div>

      <!-- Armor Effects Section -->
      <div class="flex-1">
        <ArmorEffectsComponent />

        <div class="mt-4">
          <LoadoutSwapper />
        </div>
      </div>
    </div>

    <!-- Mobile Layout -->
    <div
      v-else
    >
      <!-- Equipment Section -->
      <EquipmentSectionComponent />

      <!-- Collapsible Armor Effects Section -->
      <div class="mt-4">
        <button
          class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-between"
          @click="toggleArmorEffects"
        >
          <span>Armor Effects</span>
          <span v-if="showArmorEffects">▲</span>
          <span v-else>▼</span>
        </button>
        <div
          v-if="showArmorEffects"
          class="mt-2"
        >
          <ArmorEffectsComponent />
        </div>
      </div>

      <div class="mt-4">
        <LoadoutSwapper />
      </div>
    </div>

    <AvailableEquipment class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import EquipmentSectionComponent from '../components/EquipmentSectionComponent.vue'
import ArmorEffectsComponent from '../components/ArmorEffectsComponent.vue'
import {useWindowSize} from '@vueuse/core'
import {useInventoryStore} from '../stores/inventoryStore'
import LoadoutSwapper from '@/components/LoadoutSwapper.vue'
import AvailableEquipment from '@/components/AvailableEquipment.vue'

const inventoryStore = useInventoryStore()

// Get window width using @vueuse/core
const {width} = useWindowSize()

// Define a breakpoint for mobile devices (e.g., 640px)
const mobileBreakpoint = 640

// Determine if the device is mobile based on window width
const isMobile = computed(() => width.value < mobileBreakpoint)
const isDesktop = computed(() => !isMobile.value)

// State to control the visibility of the armor effects on mobile
const showArmorEffects = ref(false)

const toggleArmorEffects = () => {
  showArmorEffects.value = !showArmorEffects.value
}

</script>
