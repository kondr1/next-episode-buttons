
<template>
  <div>
    <a @click="ok = !ok" class="text-black w-10 h-10 opacity-60 text-center align-middle fixed rounded-full left-5 bottom-5 bg-white">
      <font-awesome-icon icon="fa-solid fa-gear" size="2xl" class="text-center align-middle pt-1"/>
    </a>
    <div v-show="ok" @click="ok = !ok" class="overflow-hidden bg-opacity-50 bg-black fixed top-0 left-0 w-screen h-screen z-10" ></div>
    <Settings v-show="ok" class="fixed top-1/3 left-1/3 w-max h-max z-20" />
  </div>
</template>

<script lang="ts" setup>
import Settings from './Settings.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watch } from 'vue'
import { PageObserver } from './pageObserver';

const ok = ref(false)
watch(ok, ok => {
  if (ok) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})

PageObserver.addEventListener(PageObserver.VideoCaptured, (e) => {
  const player = (e as CustomEvent).detail.node as HTMLDivElement
  const playControl = (player.querySelector('.vjs-play-control.vjs-control') as HTMLDivElement)
  if (playControl) playControl.click()
})

</script>
