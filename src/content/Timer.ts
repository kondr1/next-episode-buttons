import { createStore, createEvent, sample, Event, createEffect } from 'effector'

/// https://next.effector.dev/en/recipes/common/countdown/

type Params = {start: Event<number>; abort: Event<void>, timeout?: number}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

export function createCountdown(
    name: string,
    { start, abort = createEvent(`${name}Reset`), timeout = 1000 }: Params
) {
    const $working = createStore(true, { name: `${name}Working` })
    const $left = createStore(0, { name: `${name}Left` })
    const tick = createEvent<number>(`${name}Tick`)
    const timer = createEffect<number, void>(() => wait(timeout))
    const timerFinished = createEvent()

    $working.on(abort, () => false)

    sample({
        source: start,
        filter: timer.pending.map(is => !is),
        target: tick,
    })

    sample({
        clock: tick,
        target: timer,
    })

    const willTick = sample({
        source: timer.done.map(({ params }) => params - 1),
        filter: seconds => seconds >= 0,
    })

    sample({
        source: willTick,
        filter: $working,
        target: tick,
    })

    sample({
        clock: tick,
        filter: (t) => t === 0,
        target: timerFinished
    })

    sample({
        clock: tick,
        target: $left,
    })

    return { tick, $left, $working, timerFinished }
}




