import vue from '@vitejs/plugin-vue'

/** @type {import('vite').UserConfig} */
export default {
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/idle-ant-farm/',
}
