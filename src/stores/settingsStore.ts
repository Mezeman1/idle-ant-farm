import {defineStore} from 'pinia'
import {useGameStore} from '@/stores/gameStore'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    showPrestigeWarning: true,
  }),
  actions: {
    getSettingsState() {
      return {
        settings: this.$state,
      }
    },
    loadSettingsState(state) {
      Object.assign(this.$state, state.settings || {})
    },
  },
})
