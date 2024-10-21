<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import {onMounted} from 'vue'
import {toast} from 'vue3-toastify'


onMounted(() => {
  if (document.fullscreenElement === null && isMobile) {
    toast.info('You are not in fullscreen mode. You need to be fullscreen to see the entire UI.', {
      position: toast.POSITION.TOP_CENTER,
    })
    document.documentElement.requestFullscreen()
  }
})

const isMobile = window.innerWidth < 640
</script>
