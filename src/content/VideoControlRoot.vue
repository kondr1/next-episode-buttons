<template>
    <div class="inline-flex">
        <Button :text="stopButtonText" @click="stopTimer" v-show="showControls" />
        <Button :text="`▶| Следующая серия ${Math.round(timer.timeLeft.value/1000)}`" :href="nextEpisodeURL()" v-show="showControls" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import Button from './components/Button.vue';
import { timeLeft, nextEpisodeLink, PageObserver, nextEpisodeElement } from './pageObserver'
import { Timer } from './Timer';
import Settings from './settings';

const { continueTimer, timeLeftLimit } = Settings

function nextEpisodeURL() { return nextEpisodeLink() }
function stopTimer() { showControls.value = false; userStop.value = true; }

const userStop = ref(false)
const showControls = ref(false);

let timer = new Timer(continueTimer.value, () => {
    nextEpisodeElement()?.click();
    showControls.value = false;
})

const stopButtonText = computed(() => {
    if (timeLeft.value > 0) {
        return `Смотреть титры`
    }
    return `Не открывать следующее видео`
})

watch(timeLeft, () => {
    if (timeLeft.value < timeLeftLimit.value && !userStop.value){
        showControls.value = true
    }
    if (timeLeft.value > timeLeftLimit.value && userStop.value){
        userStop.value = false
    }
    if (timeLeft.value === 0){
        showControls.value = true
    }
})

watch(showControls, () => {
    if(showControls.value) {
        if (timer.seconds !== continueTimer.value)
            timer.seconds = continueTimer.value
        timer.Start();
    } else {
        timer.Stop();
    }
})
</script>
