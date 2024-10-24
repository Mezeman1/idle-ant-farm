<template>
  <div class="flex flex-col p-4">
    <div :class="isLargeScreen ? 'grid grid-cols-3 gap-6' : 'flex flex-col space-y-6'">
      <!-- Left Column: Wave Selector and Area Info -->
      <div class="space-y-4">
        <WaveSelector
          :selected-wave="selectedWave"
          :can-go-next="canGoNext"
          :can-go-previous="canGoPrevious"
          @previousWave="previousWave"
          @nextWave="nextWave"
        />

        <!-- Area Modifiers Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">
            Area Modifiers
          </h2>
          <div
            v-if="currentAreaModifiers"
            class="space-y-2"
          >
            <ModifierItem
              v-for="(value, key) in currentAreaModifiers"
              :key="key"
              :name="formatModifierName(key)"
              :value="toPercentage(value, 1)"
            />
          </div>
          <p
            v-else
            class="text-gray-500"
          >
            No modifiers for this area
          </p>
          <p class="text-gray-600 mt-4 font-semibold">
            Kill Count: {{ formatNumber(adventureStore.killCountsForCurrentArea) }}
          </p>
          <AreaModifiersMilestones class="mt-4" />

          <h2 class="text-gray-600 mt-4 font-semibold flex items-center">
            Global Drop Chance Modifier: 
            <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {{ toPercentageFormatted(adventureStore.globalDropChanceModifier) }}%
            </span>
          </h2>
        </div>

        <!-- New Armor Modifiers Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">
            Modifiers
          </h2>
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                Training Modifiers
              </h3>
              <div class="space-y-2">
                <ModifierItem
                  v-for="(value, key) in trainingStore.modifiers.army"
                  :key="key"
                  :name="formatModifierName(key) + ' from Training'"
                  :value="toPercentageFormatted(value, 1)"
                />
              </div>
            </div>
            <hr class="border-gray-200">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                Item Modifiers
              </h3>
              <div class="space-y-2">
                <ModifierItem
                  name="Attack from Items"
                  :value="toPercentageFormatted(adventureStore.armyAttackModifier, 1)"
                />
                <ModifierItem
                  name="Defense from Items"
                  :value="toPercentageFormatted(adventureStore.armyDefenseModifier, 1)"
                />
                <ModifierItem
                  name="Health from Items"
                  :value="toPercentageFormatted(adventureStore.armyMaxHealthModifier, 1)"
                />
                <ModifierItem
                  name="Regen from Items"
                  :value="toPercentageFormatted(adventureStore.armyRegenModifier, 1)"
                />
              </div>
            </div>
            <hr class="border-gray-200 my-4">
            <div v-if="trainingStore.farmingModifiers.defense > 1">
              <h3 class="text-lg font-semibold text-gray-700 mb-2">
                Farming Modifiers
              </h3>
              <div class="space-y-2">
                <ModifierItem
                  name="Defense from Farming"
                  :value="toPercentageFormatted(trainingStore.farmingModifiers.defense, 1)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Column: Battle Arena -->
      <div class="space-y-4">
        <!-- Ant Army and Enemy Bug Display -->
        <div class="grid grid-cols-2 gap-4">
          <BattleCard
            title="Ant Army"
            :image="ArmyImage"
            :health="adventureStore.armyHealth"
            :max-health="adventureStore.armyMaxHealth"
            :attack="adventureStore.armyAttack"
            :defense="adventureStore.armyDefense"
            :regen="adventureStore.armyRegen * (trainingStore.farmingModifiers.regenerationRate ?? 1)"
            :active-effects="adventureStore.armyActiveEffects"
          />
          <BattleCard
            v-if="adventureStore.currentEnemy"
            :title="adventureStore.currentEnemy.name"
            :image="adventureStore.currentEnemy.image"
            :health="adventureStore.bugHealth"
            :max-health="adventureStore.bugMaxHealth"
            :attack="adventureStore.bugAttack"
            :defense="adventureStore.bugDefense"
            :regen="adventureStore.bugRegen"
            :active-effects="adventureStore.bugActiveEffects"
            :is-boss="adventureStore.currentEnemy.isBoss"
            :cooldown-progress="cooldownProgress"
          />
          <div
            v-else
            class="bg-white rounded-lg shadow-md flex items-center justify-center h-64"
          >
            <p class="text-gray-500 text-lg">
              You're safe for now
            </p>
          </div>
        </div>

        <!-- Battle Style Buttons -->
        <div class="grid grid-cols-3 gap-4">
          <BattleStyleButton
            style-name="Attack"
            :is-active="battleStyle === 'attack'"
            @click="setBattleStyle('Attack')"
          />
          <BattleStyleButton
            style-name="Block"
            :is-active="battleStyle === 'defense'"
            @click="setBattleStyle('Defense')"
          />
          <BattleStyleButton
            style-name="Endure"
            :is-active="battleStyle === 'hitpoints'"
            @click="setBattleStyle('Hitpoints')"
          />
        </div>

        <!-- Status Effect Chances -->
        <div class="grid grid-cols-2 gap-4">
          <StatusEffectCard
            title="Your Army's Effects"
            :poison-chance="poisonChance"
            :bleed-chance="bleedChance"
          />
          <StatusEffectCard
            title="Enemy's Effects"
            :poison-chance="bugPoisonChance"
            :bleed-chance="bugBleedChance"
          />
        </div>

        <TrainingCombat />

        <!-- New Active Buffs Section -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">
            Active Buffs
          </h2>
          <div class="overflow-y-auto max-h-60 pr-2">
            <div
              v-if="groupedActiveBuffs.length > 0"
              class="space-y-2"
            >
              <div
                v-for="buff in groupedActiveBuffs"
                :key="buff.name"
                class="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span class="font-medium text-gray-700">
                  {{ buff.name }}
                  <span
                    v-if="buff.count > 1"
                    class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    x{{ buff.count }}
                  </span>
                </span>
                <span class="text-sm text-gray-500">{{ formatBuffDuration(buff.longestDuration) }}</span>
              </div>
            </div>
            <p
              v-else
              class="text-gray-500"
            >
              No active buffs
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Inventory -->
      <div class="flex-shrink-0">
        <Inventory only-consumables />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAdventureStore} from '../stores/adventureStore'
import {useGameStore} from '../stores/gameStore'
import {computed, onMounted, ref, watch} from 'vue'
import {onClickOutside, useWindowSize} from '@vueuse/core'
import ArmyImage from '../assets/army.webp'
import Inventory from '@/views/InventoryPage.vue'
import WaveSelector from '@/components/WaveSelector.vue'
import StatusEffectCard from '@/components/StatusEffectCard.vue'
import BattleCard from '@/components/BattleCard.vue'
import BattleStyleButton from '@/components/BattleStyleButton.vue'
import ModifierItem from '@/components/ModifierItem.vue'

import {Skill} from '@/types/trainingTypes'
import {toPercentage, toPercentageFormatted, formatTime} from '@/utils/index'
import {useTrainingStore} from '@/stores/trainingStore'
import TrainingCombat from '@/views/Training/TrainingCombat.vue'
import AreaModifiersMilestones from '@/components/AreaModifiersMilestones.vue'
import {useEquipmentStore} from '@/stores/equipmentStore'
import {setBonuses} from '@/types/items/itemRegistry'

const formatNumber = useGameStore().formatNumber
const adventureStore = useAdventureStore()
const equipmentStore = useEquipmentStore()
const {width} = useWindowSize()
const poisonChance = computed(() => formatNumber(adventureStore.poisonChance * 100), 0)
const bugPoisonChance = computed(() => formatNumber((adventureStore.currentEnemy?.effectChances?.find(effect => effect.effect === 'poison')?.chance ?? 0) * 100), 0)

const bleedChance = computed(() => formatNumber(adventureStore.bleedChance * 100), 0)
const bugBleedChance = computed(() => formatNumber((adventureStore.currentEnemy?.effectChances?.find(effect => effect.effect === 'bleed')?.chance ?? 0) * 100), 0)

// Set a breakpoint for large screens
const isLargeScreen = computed(() => width.value >= 1024)
const battleStyle = computed(() => adventureStore.battleStyle)
const trainingStore = useTrainingStore()

onMounted(() => {
  selectedWaveIndex.value = adventureStore.enemyWaves.findIndex(wave => wave.name === adventureStore.currentArea)
  updateCurrentAreaByIndex(selectedWaveIndex.value)

  adventureStore.handleAdventureMilestones()
})

watch(() => adventureStore.currentArea, () => {
  selectedWaveIndex.value = adventureStore.enemyWaves.findIndex(wave => wave.name === adventureStore.currentArea)
  adventureStore.handleAdventureMilestones()
})

const updateCurrentAreaByIndex = (index) => {
  if (index < 0 || index >= adventureStore.enemyWaves.length) return
  if (getAreaByIndex(index)?.unlockedWhen()) {
    adventureStore.currentArea = getAreaByIndex(index)?.name ?? 'Safe Zone'
  }
}

const getAreaByIndex = (index) => {
  if (index < 0 || index >= adventureStore.enemyWaves.length) return null

  return adventureStore.enemyWaves[index]
}

const selectedWaveIndex = ref(0)
const selectedWave = computed(() => {
  return adventureStore.enemyWaves[selectedWaveIndex.value]
})

const canGoPrevious = computed(() => selectedWaveIndex.value > 0)
const canGoNext = computed(() => selectedWaveIndex.value + 1 < adventureStore.enemyWaves.length && getAreaByIndex(selectedWaveIndex.value + 1)?.unlockedWhen())

const previousWave = () => {
  if (canGoPrevious.value) {
    selectedWaveIndex.value--
    updateCurrentAreaByIndex(selectedWaveIndex.value)
  }
}

const nextWave = () => {
  if (canGoNext.value) {
    selectedWaveIndex.value++
    updateCurrentAreaByIndex(selectedWaveIndex.value)
  }
}

const dropdownOpen = ref(false)

const target = ref(null)

onClickOutside(target, event => {
  dropdownOpen.value = false
})

const cooldownProgress = computed(() => {
  const totalCooldown = adventureStore.initialSpawnCooldownTime // Total cooldown time
  const remainingCooldown = adventureStore.enemySpawnCooldownTime // Remaining cooldown time

  return Math.max(0, (remainingCooldown / totalCooldown) * 100) // Calculate progress percentage
})

function setBattleStyle(style: 'Attack' | 'Defense' | 'Hitpoints') {
  if (style === 'Attack') {
    adventureStore.battleStyle = Skill.Attack
  } else if (style === 'Defense') {
    adventureStore.battleStyle = Skill.Defense
  } else if (style === 'Hitpoints') {
    adventureStore.battleStyle = Skill.Hitpoints
  }
}

const currentAreaModifiers = computed(() => {
  const areaName = adventureStore.currentArea
  return adventureStore.areaModifiers[areaName] || null
})

const showMilestoneRewards = ref(false)

// New helper function
const formatModifierName = (key: string) => {
  return key.split(/(?=[A-Z])/).join(' ')
}

// New helper function to format buff duration
const formatBuffDuration = (duration: number) => {
  return formatTime(duration * 1000, true) // Convert seconds to milliseconds and hide zeros
}

// New computed property to group buffs
const groupedActiveBuffs = computed(() => {
  const groupedBuffs = adventureStore.activeBuffs.reduce((acc, buff) => {
    const existingBuff = acc.find(b => b.name === buff.name)
    if (existingBuff) {
      existingBuff.count++
      existingBuff.longestDuration = Math.max(existingBuff.longestDuration, buff.duration)
    } else {
      acc.push({ ...buff, count: 1, longestDuration: buff.duration })
    }
    return acc
  }, [] as Array<{ name: string; count: number; longestDuration: number }>)

  return groupedBuffs.sort((a, b) => b.longestDuration - a.longestDuration)
})

const getSetBonusExplanation = () => {
  const activeSetBonus = equipmentStore.activeSetBonus
  if (activeSetBonus && setBonuses[activeSetBonus]) {
    const explanation = setBonuses[activeSetBonus].explanation
    return typeof explanation === 'function' ? explanation() : explanation
  }
  return ''
}
</script>

<style scoped>
/* Progress bar container */
.progress-container {
  width: 100%;
  height: 16px;
  background-color: #f3f4f6; /* Light gray background */
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

/* Progress bar */
.progress-bar {
  height: 100%;
  background-color: #34d399; /* Green progress fill */
  transition: width 0.1s ease; /* Smooth transition for progress changes */
}

/* Custom scrollbar for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
