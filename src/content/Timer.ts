import { computed, ComputedRef, Ref, ref, watch, WatchStopHandle } from "vue";
declare const RefSymbol: unique symbol;

export class Timer extends EventTarget {
    public seconds: number;
    private endTime: number = Date.now();
    private static now = ref(Date.now());
    private static readonly interval = setInterval(() => {
        this.now.value = Date.now();
    }, 100)
    public started: Ref<boolean> = ref(false);
    public timeLeft: ComputedRef<number> = computed(() => (this.endTime - Timer.now.value) < 0 ? 0 : (this.endTime - Timer.now.value));
    private stopHandler?: WatchStopHandle

    constructor(seconds: number, callback: EventListenerOrEventListenerObject) {
        super();

        this.seconds = seconds;
        this.addEventListener("end", callback);
    }

    public Start(): void {
        this.started.value = true;
        this.endTime = Timer.now.value + this.seconds * 1000;
        this.dispatchEvent(new Event("start"));

        this.stopHandler = watch(Timer.now, () => {
            if (this.endTime <= Timer.now.value) {
                this.Stop();
                this.dispatchEvent(new Event("end"));
            }
        });
    }

    public Stop(): void {
        this.started.value = false;
        this.stopHandler?.();
    }
}