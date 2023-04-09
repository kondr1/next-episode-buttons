import { createStore, createEvent, sample } from 'effector'
import { createCountdown } from './Timer'
import { $timeLeftLimit as $timeWhenStart, $nextEpButtonTimer, $continueAfterEnd } from './settings'
import { $timeLeftVideo, nextEpisodeElement } from './pageObserver'

const startCountdown = createEvent<number>()
export const abortCountdown = createEvent()

const {$left, timerFinished, tick} = createCountdown('example', {
    start: startCountdown,
    abort: abortCountdown
})

export const $isTimerStarted = createStore(false)
$isTimerStarted.on(startCountdown, () => true)
$isTimerStarted.on(abortCountdown, () => false)
$isTimerStarted.on(timerFinished, () => false)

export const $buttonTimerTimeLeft = $left

timerFinished.watch(() => {
  console.log('timer finished')
  console.log('next ep el clicked')
  nextEpisodeElement()?.click()
})



sample({
  clock: $timeLeftVideo,
  source: {
    timeWhenStart: $timeWhenStart,
    startTimerTimeout: $nextEpButtonTimer,
    isTimerStarted: $isTimerStarted
  },
  filter({timeWhenStart, isTimerStarted}, videoTime) {
      return !isTimerStarted && videoTime < timeWhenStart
  },
  fn: ({startTimerTimeout}) => startTimerTimeout,
  target: startCountdown
})

sample({
  clock: $timeLeftVideo,
  source: {
    timeWhenStart: $timeWhenStart,
    isTimerStarted: $isTimerStarted
  },
  filter: ({isTimerStarted, timeWhenStart}, videoTime ) => isTimerStarted && videoTime > timeWhenStart,
  target: abortCountdown
})


startCountdown.watch(v => console.log('started, ', v))
abortCountdown.watch(v => console.log('ended, ', v))
tick.watch(v => console.log('tick, ', v))