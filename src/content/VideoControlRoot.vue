<template>
    <div class="inline-flex">
        <Button :text="stopButtonText" @click="stopTimer" v-show="working" />
        <Button :text="`▶| Следующая серия ${left}`" @click="nextEpisodeClick" v-show="working" />
    </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onUnmounted, ref, watch } from 'vue';
import Button from './components/Button.vue';
import { $timeLeft, nextEpisodeElement } from './pageObserver'
import { startCountdown, abortCountdown, $left, $working } from './Timer';
import { $continueTimer, $timeLeftLimit, $continueAfterEnd }  from './settings';
import { useStore } from 'effector-vue/composition';

const timeLeft = useStore($timeLeft)
const continueTimer = useStore($continueTimer)
const timeLeftLimit = useStore($timeLeftLimit)
const continueAfterEnd = useStore($continueAfterEnd)
const left = useStore($left)
const working = useStore($working)

function stopTimer() { abortCountdown(); manualStop.value = true; }
function nextEpisodeClick() { nextEpisodeElement()?.click() }
const manualStop = ref(false)


const stopButtonText = computed(() => {
    if (timeLeft.value > 0) return `Смотреть титры`
    return `Не открывать следующее видео`
})

watch(timeLeft, (value) => {
    if (value < timeLeftLimit.value && !manualStop.value)
        startCountdown(continueTimer.value);
    if (value > timeLeftLimit.value && working.value)
        abortCountdown();
    if (value > timeLeftLimit.value && manualStop.value)
        manualStop.value = false
    if (value === 0 && continueAfterEnd.value)
        startCountdown(continueTimer.value);
})

onBeforeUnmount(() => abortCountdown() )
onUnmounted(() => abortCountdown() )
</script>
