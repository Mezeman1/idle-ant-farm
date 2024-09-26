<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import {useToast} from 'vue-toast-notification'

onMounted(() => {
  if (document.fullscreenElement === null) {
    const toast = useToast()
    toast.info('You are not in fullscreen mode. You need to be fullscreen to see the entire UI.')
    document.documentElement.requestFullscreen()
  }
})
</script>
