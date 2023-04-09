import { createEvent, restore } from 'effector'
import { persist } from 'effector-storage/local'
import negative from './customStyles/negative.css?inline'

export const storageKey = "web-ext-"
export const key = (name: string) => storageKey + name
export const set = (name:string, val:any) => localStorage.setItem(key(name), val.toString())
export const get = (name:string) => localStorage.getItem(key(name))
export const remove = (name:string) => localStorage.removeItem(key(name))

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

export const themes: Theme[] = [
    new Theme("Default", "anime365", "https://smotret-anime.com/"),
    new Theme("Colorfull Negative", "kondr1", "https://github.com/kondr1/", negative)
]

export const currentThemeChanged = createEvent<string>()
export const $currentTheme = restore(currentThemeChanged, "Default")
persist({ store: $currentTheme, key: "web-ext-currentTheme" })
$currentTheme.watch((value) => themes.find(x => x.name === value)?.use())

export const timeLeftLimitChanged = createEvent<number>()
export const $timeLeftLimit = restore(timeLeftLimitChanged, 120)
persist({ store: $timeLeftLimit, key: "web-ext-timeLeftLimit" })

export const continueTimerChanged = createEvent<number>()
export const $continueTimer = restore(continueTimerChanged, 15)
persist({ store: $continueTimer, key: "web-ext-continueTimer" })

export const continueAfterEndChanged = createEvent<boolean>()
export const $continueAfterEnd = restore(continueAfterEndChanged, true)
persist({ store: $continueAfterEnd, key: "web-ext-continueAfterEnd" })
