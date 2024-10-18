import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    showPrestigeWarning: true,
    showBackground: true,
    showAnimation: true,
    autoThresholds: {
      // Thresholds for auto-creation of resources
      autoSeedStorageUpgrade: 0,
      autoLarvaeStorageUpgrade: 0,
      autoEliteAntsCreationSeeds: 0,
      autoEliteAntsCreationLarvae: 0,
      autoAntCreationLarvae: 0,
      autoAntCreationSeeds: 0,
      autoQueenCreationSeeds: 0,
      autoQueenCreationAnts: 0,
      autoCreateHousing: 0,
    },
    notifications: {
      loot: true,
      achievements: false,
      save: false,
      load: false,
      royalJelly: true,
      matureCrops: true,
    },
    notation: 'scientific',
  }),
  getters: {
    getNotificationSetting(): (key: string) => boolean {
      return (key) => this.notifications[key]
    },
  },
  actions: {
    getSettingsState() {
      return {
        settings: this.$state,
      }
    },
    loadSettingsState(state) {
      this.$state = {
        ...state.settings,
      }

      this.setDefaults()
    },
    setDefaults() {
      this.showPrestigeWarning = this.showPrestigeWarning ?? true
      this.showBackground = this.showBackground ?? true
      this.showAnimation = this.showAnimation ?? true
      this.autoThresholds = {
          autoSeedStorageUpgrade: this.autoThresholds.autoSeedStorageUpgrade ?? 100,
          autoLarvaeStorageUpgrade: this.autoThresholds.autoLarvaeStorageUpgrade ?? 100,
          autoEliteAntsCreationSeeds: this.autoThresholds.autoEliteAntsCreationSeeds ?? 0,
          autoEliteAntsCreationLarvae: this.autoThresholds.autoEliteAntsCreationLarvae ?? 0,
          autoAntCreationLarvae: this.autoThresholds.autoAntCreationLarvae ?? 0,
          autoAntCreationSeeds: this.autoThresholds.autoAntCreationSeeds ?? 0,
          autoQueenCreationSeeds: this.autoThresholds.autoQueenCreationSeeds ?? 0,
          autoQueenCreationAnts: this.autoThresholds.autoQueenCreationAnts ?? 0,
          autoCreateHousing: this.autoThresholds.autoCreateHousing ?? 100,
      }

      this.notifications = {
        loot: this.notifications.lo,
        achievements: this.notifications.achievements,
        save: this.notifications.save,
        load: this.notifications.load,
        royalJelly: this.notifications.royalJelly,
        matureCrops: this.notifications.matureCrops,
      }
    },
  },
})
