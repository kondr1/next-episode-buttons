import { Component, createApp, defineCustomElement } from "vue";
import ContentRoot from "./ContentRoot.vue";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGear, faArrowRight, faCaretRight } from '@fortawesome/free-solid-svg-icons'
import VideoControlRoot from "./VideoControlRoot.vue";
import { PageObserver } from './pageObserver'
import indexCss from '../index.css?inline'
import { get } from './settingsBase'


const css = get('style-css')
if (css) {
    const style = document.createElement("style")
    style.id = 'web-ext-style'
    style.innerHTML = css
    document.body.insertBefore(style, document.body.firstChild);
}

library.add(faGear)
library.add(faArrowRight)
library.add(faCaretRight)

function mountComponent(component: Component, parent: Element, id: string, style?: string): void {
    parent.ownerDocument.querySelector(`#${id}`)?.remove()
    
    const mountPoint = parent.ownerDocument.createElement("div")

    const root = parent.ownerDocument.createElement("div")
    if (style) root.setAttribute('style', style)
    root.id = id
    const styleTag = parent.ownerDocument.createElement("style")
    styleTag.innerHTML = indexCss

    const shadow = root.attachShadow({ mode: 'open' })
    shadow.appendChild(styleTag)
    shadow.appendChild(mountPoint)
    
    parent.appendChild(root)
    createApp(component).mount(mountPoint)
}

const mountButton = (e: Event)  =>
    mountComponent(VideoControlRoot, (e as CustomEvent).detail.node, 'web-ext-control', 'position: absolute; z-index:10; right: 5mm; top: 5mm;')

const mountRoot = () =>
    mountComponent(ContentRoot, document.body, 'web-ext-root')

mountRoot()

PageObserver.addEventListener('videoCaptured', mountButton)
