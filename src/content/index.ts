import { App, Component, createApp, defineCustomElement } from "vue";
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

const apps: Record<string, App> = {}

function mountComponent(component: Component, parent: Element, id: string, style?: string) {
    parent.ownerDocument.querySelector(`#${id}`)?.remove()
    apps[id]?.unmount()
    apps[id] = createApp(component)

    const mountPoint = parent.ownerDocument.createElement("div")

    const root = parent.ownerDocument.createElement("div")
    root.id = id
    
    style && root.setAttribute('style', style)
    
    const styleTag = parent.ownerDocument.createElement("style")
    styleTag.innerHTML = indexCss

    const shadow = root.attachShadow({ mode: 'open' })
    shadow.appendChild(styleTag)
    shadow.appendChild(mountPoint)
    
    parent.appendChild(root)
    apps[id].mount(mountPoint)
    
    return apps[id]
}

function mountButton(e: Event) {
    const buttonsId = 'web-ext-control'
    const app = mountComponent(VideoControlRoot, (e as CustomEvent).detail.node, buttonsId, 'position: absolute; z-index:10; right: 5mm; top: 5mm;');
    function unmount() {
        app.unmount();
        PageObserver.removeEventListener(PageObserver.PageUpdate, unmount);
    }
    PageObserver.addEventListener(PageObserver.PageUpdate, unmount);
}

const mountRoot = () =>
    mountComponent(ContentRoot, document.body, 'web-ext-root')

mountRoot()

PageObserver.addEventListener(PageObserver.VideoCaptured, mountButton)