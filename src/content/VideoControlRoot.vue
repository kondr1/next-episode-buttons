<template>
    <div class="inline-flex">
        <Button :text="stopButtonText" @click="abortCountdown" v-show="show > 0" />
        <Button :text="`▶| Следующая серия ${timerTime}`" @click="nextEpisodeClick" v-show="show > 0" />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
// @ts-expect-error huy
import Button from './components/Button.vue';
import { $timeLeftVideo, nextEpisodeElement } from './pageObserver'
import {$buttonTimerTimeLeft, abortCountdown, $isTimerStarted} from './nextEpisodeModel'
import { useStore } from 'effector-vue/composition';

const timeLeftVideo = useStore($timeLeftVideo)
const show = useStore($isTimerStarted)
const timerTime = useStore($buttonTimerTimeLeft)


// function stopTimer() { abortCountdown(); manualStop.value = true; }
function nextEpisodeClick() { nextEpisodeElement()?.click() }


const stopButtonText = computed(() => {
    if (timeLeftVideo.value > 0) return `Смотреть титры`
    return `Не открывать следующее видео`
})

// watch(timeLeftVideo, (value) => {
//     if (!isStarted.value && value < timeLeftLimit.value)
//         startCountdown(continueTimer.value);
//     if (value > timeLeftLimit.value && isStarted.value)
//         abortCountdown();
// })

// onBeforeUnmount(() => abortCountdown() )
// onUnmounted(() => abortCountdown() )
</script>
