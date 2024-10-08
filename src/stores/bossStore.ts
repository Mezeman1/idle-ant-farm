import {defineStore} from 'pinia'

interface State {
  boss: string
}


const useBossStore = defineStore({
  id: 'Boss',
  state: () => ({
    currentBoss: '',

  }),
  actions: {
    setBoss(newBoss: string) {
      this.boss = newBoss
    },
  },
})
