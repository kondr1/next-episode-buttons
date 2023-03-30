import { Ref, ref } from "vue";

export class Timer extends EventTarget {
    public seconds: Ref<number>;
    public startTime: number = 0
    public lastTick: number = 0
    public started: Ref<boolean> = ref(false);
    public timeLeft: Ref<number> = ref(0)
    private eventHandlers = new Map<string, EventListenerOrEventListenerObject[]>();
    public ID: string
    #dispose = false

    constructor(seconds: Ref<number>, callback: EventListenerOrEventListenerObject) {
        super();

        this.seconds = seconds;
        this.addEventListener("fire", callback);
        this.eventHandlers.set("fire", [callback])
        this.ID = crypto.randomUUID()
    }

    public Tick(_: DOMHighResTimeStamp) {
        if (!this.started.value || this.#dispose) return
        const now = Date.now()
        const delta = now - this.lastTick
        this.lastTick = now
        this.timeLeft.value = this.timeLeft.value - delta
        // console.log(`[${this.ID}][TICK ]`, this.timeLeft.value)
        if (this.timeLeft.value <= 0) {
            this.timeLeft.value = 0
            this.dispatchEvent(new Event("fire"));
            return this.Stop()
        }
        requestAnimationFrame(t => this.Tick(t));
    }

    public Start(): void {
        if (this.started.value || this.#dispose) return
        this.started.value = true;
        this.startTime = this.lastTick = Date.now()
        this.timeLeft.value = this.seconds.value * 1000
        // console.log(`[${this.ID}][START]`, this.timeLeft.value)
        this.dispatchEvent(new Event("start"));
        this.Tick(0)
    }

    public Stop(): void {
        if (!this.started.value || this.#dispose) return
        this.started.value = false;
        // console.log(`[${this.ID}][STOP ]`, this.timeLeft.value)
        this.dispatchEvent(new Event("stop"));
    }
    
    public Dispose() {
        if (this.#dispose) return
        this.Stop()
        this.#dispose = true
        this.removeAllEventListeners()
    }

    public addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        if (this.#dispose) return
        super.addEventListener(type, listener)
        const arr = this.eventHandlers.get(type) ?? [listener];
        this.eventHandlers.set(type, arr)
    }
    public removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        super.removeEventListener(type, listener)
        const arr = this.eventHandlers.get(type) ?? []
        this.eventHandlers.set(type, arr.filter(x => x !== listener))
    }

    public removeAllEventListeners() {
        this.eventHandlers.forEach((arr, eventName) => {
            arr.forEach(x => this.removeEventListener(eventName, x))
        })
    }
}
