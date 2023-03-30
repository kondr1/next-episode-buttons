import { Ref, watch } from 'vue'

export const storageKey = "web-ext-"
export const key = (name: string) => storageKey + name
export const set = (name:string, val:any) => localStorage.setItem(key(name), val.toString())
export const get = (name:string) => localStorage.getItem(key(name))
export const remove = (name:string) => localStorage.removeItem(key(name))

export default class SettingsBase {
    constructor() {}
    protected watchAndSyncStr(name: string, ref: Ref<string>): void {
        this.watchAndSync(name, ref, (value) => ref.value = value ?? "")
    }
    protected watchAndSyncNum(name: string, ref: Ref<number>): void {
        this.watchAndSync(name, ref, (value) => ref.value = Number(value ?? 0))
    }
    protected watchAndSyncBool(name: string, ref: Ref<boolean>): void {
        this.watchAndSync(name, ref, (value) => ref.value = Boolean(value ?? 0))
    }
    protected watchAndSync(name: string, ref: Ref, cb: (arg0: string | null) => void): void {
        watch(ref, (value) => set(name, value))
        this.sync(name, cb)
    }
    protected sync(name: string, cb: (arg0: string | null) => void) {
        window.addEventListener("storage", (e) => {
            if (e.key === key(name))
                cb(e.newValue)
        });
    }
}
