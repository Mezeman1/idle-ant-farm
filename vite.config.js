import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

/** @type {import('vite').UserConfig} */
export default {
  plugins: [
    vue(),
    VitePWA({
      mode: 'development',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Idle Ant Farm',
        short_name: 'IdleAntFarm',
        description: 'Idle Ant Farm idle incremental',
        theme_color: '#ffffff',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/idle-ant-farm/',
}
