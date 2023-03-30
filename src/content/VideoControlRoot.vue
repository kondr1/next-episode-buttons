<template>
    <div class="inline-flex">
        <Button :text="stopButtonText" @click="stopTimer" v-show="started" />
        <Button :text="`▶| Следующая серия ${nextEpisodeTimer}`" @click="nextEpisodeClick" v-show="started" />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
import Button from './components/Button.vue';
import { duration, currentTime, nextEpisodeElement } from './pageObserver'
import { Timer } from './Timer';
import Settings from './settings';
const timeLeft = computed(() => duration.value - currentTime.value)
const { continueTimer, timeLeftLimit, continueAfterEnd } = Settings

function stopTimer() { timer.Stop(); manualStop.value = true; }
function nextEpisodeClick() { nextEpisodeElement()?.click() }
const manualStop = ref(false)

const timer = new Timer(continueTimer, nextEpisodeClick)

const nextEpisodeTimer = computed(() => Math.round(timer.timeLeft.value/1000))
const { started } = timer

const stopButtonText = computed(() => {
    if (timeLeft.value > 0) return `Смотреть титры`
    return `Не открывать следующее видео`
})

watch(timeLeft, () => {
    if (timeLeft.value < timeLeftLimit.value && !manualStop.value)
        timer.Start();
    if (timeLeft.value > timeLeftLimit.value && timer.started.value)
        timer.Stop();
    if (timeLeft.value > timeLeftLimit.value && manualStop.value)
        manualStop.value = false
    if (timeLeft.value === 0 && continueAfterEnd.value)
        timer.Start();
})

onBeforeUnmount(() => timer.Dispose() )
onUnmounted(() => timer.Dispose() )
</script>
