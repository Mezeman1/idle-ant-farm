<template>
  <router-view />
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useToast} from 'vue-toast-notification'


onMounted(() => {
  if (document.fullscreenElement === null && isMobile) {
    const toast = useToast()
    toast.info('You are not in fullscreen mode. You need to be fullscreen to see the entire UI.', {
      position: 'top',
    })
    document.documentElement.requestFullscreen()
  }
})


const isMobile = window.innerWidth < 640
</script>
