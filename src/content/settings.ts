import { Ref, ref, watch } from 'vue'
import negative from './customStyles/negative.css?inline'
import SettingsBase from './settingsBase'
import { remove, set, get } from './settingsBase'

export class Theme {
    constructor(name: string, author: string, url: string, css?: string) {
        this.name = name
        this.author = author
        this.url = url
        this.css = css
    }
    name: string
    author: string
    url: string
    css?: string
    use() {
        let style = document.querySelector("#web-ext-style")
        Settings.instance.currentTheme.value = this.name
        if (!style) style = document.createElement("style");
        if (!this.css){
            style.remove()
            remove('style-css')
            return
        } 
        style.id = 'web-ext-style'
        style.innerHTML = this.css
        set('style-css', this.css)
        document.body.insertBefore(style, document.body.firstChild);
    }
}

const themes: Theme[] = [
    new Theme("Default", "anime365", "https://smotret-anime.com/"),
    new Theme("Colorfull Negative", "kondr1", "https://github.com/kondr1/", negative)
]

export class Settings extends SettingsBase {
    public static readonly instance = new Settings(themes)
    constructor(themes: Theme[]) {
        super()
        this.themes = themes
        if (this.#timeLeftLimit === 0)
            this.timeLeftLimit.value = 120 // 2 min
        if (this.#continueTimer === 0)
            this.continueTimer.value = 15 // 15 sec
        watch(this.currentTheme, (value) => this.themes.find(x => x.name === value)?.use())
        this.watchAndSyncStr("currentTheme", this.currentTheme)
        this.watchAndSyncNum("timeLeftLimit", this.timeLeftLimit)
        this.watchAndSyncNum("continueTimer", this.continueTimer)
        this.watchAndSyncBool("continueAfterEnd", this.continueAfterEnd)
    }

    themes: Theme[]
    currentTheme: Ref<string> = ref(this.#currentTheme)
    timeLeftLimit: Ref<number> = ref(this.#timeLeftLimit)
    continueTimer: Ref<number> = ref(this.#continueTimer)
    continueAfterEnd: Ref<boolean> = ref(this.#continueAfterEnd)

    get #currentTheme() {
        return get("currentTheme") ?? "Default"
    };
    get #timeLeftLimit() {
        return Number(get("timeLeftLimit") ?? 0)
    };
    get #continueTimer() {
        return Number(get("continueTimer") ?? 0)
    };
    get #continueAfterEnd() {
        return Boolean(get("continueAfterEnd") ?? true)
    };
}

export default Settings.instance
