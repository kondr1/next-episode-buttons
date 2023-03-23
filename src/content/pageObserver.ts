import { ref, computed } from 'vue'

export const currentTime = ref(0)
export const duration = ref(0)
export const timeLeft = computed(() => duration.value - currentTime.value)
export const nextEpisodeElement = () => (document.querySelector('.m-select-sibling-episode a:last-child') as HTMLAnchorElement | null)
export const nextEpisodeLink = () => nextEpisodeElement()?.href || ""

export function getFrameDoc(): Document | null {
    return (document.querySelector('.video-container iframe') as HTMLIFrameElement)?.contentDocument
}
function frameLog(msg: string): void {
    return console.log(`[${getFrameDoc()?.URL} | ${getFrameDoc()?.readyState}] ${msg}`)
}
const observerOpt: MutationObserverInit = { childList: true, attributes: true, attributeFilter: ['src'], attributeOldValue: true }

export class PageObserver extends EventTarget {
    
    static capture(): void {
        const video = getFrameDoc()?.querySelector('video')
        
        currentTime.value = video?.currentTime ?? 0
        duration.value = video?.duration ?? 0
        
        const updateTime =  () => { currentTime.value = video!.currentTime }
        const updateDuration =  () => { duration.value = video!.duration }
        
        video?.removeEventListener('timeupdate', updateTime);
        video?.removeEventListener('durationchange', updateDuration);
        
        video?.addEventListener('timeupdate', updateTime);
        video?.addEventListener('durationchange', updateDuration);

        if (video) {
            frameLog(`video duration was captured!`)
            const event = new CustomEvent('videoCaptured', { detail: { node: video.parentElement } })
            this.dispatchEvent(event)
        }
        else frameLog(`page have no video =(`)
    }

    static updateFrameStateListener (): number | undefined {
        currentTime.value = 0
        duration.value = 0
        if (!getFrameDoc()) return
        
        frameLog(`updateRef call`)
        // TODO: fix this shit
        // i dont know why, but sometimes that just hapened =(
        if (getFrameDoc()?.URL === "about:blank") 
            return setTimeout(this.updateFrameStateListener.bind(this), 10)
        
        if (getFrameDoc()?.readyState === 'complete') this.capture()
        else getFrameDoc()?.addEventListener('readystatechange', () => this.capture.apply(this))
    }
    
    static iframeUpdateCallback (mutations: MutationRecord[], _: MutationObserver): void {
        for(var mutation of mutations) {
            // @ts-ignore: ts(2488) Type must have a '[Symbol.iterator]()' method that returns an iterator.
            let ok = [...mutation.addedNodes]
                .some((n: Node) => (n as Element)
                    .classList.contains('body-container'))
            
            if (ok) {
                PageObserver.updateFrameStateListener()
                PageObserver.instance.dispatchEvent(new Event('pageUpdate'))
            }
        }
    }

    static instance = new PageObserver()
    static observer: MutationObserver = null!
    
    
    constructor(){
        super()
        if (PageObserver.instance)
            return PageObserver.instance
        PageObserver.observer = new MutationObserver(PageObserver.iframeUpdateCallback)
        PageObserver.observer.observe(document.body as Node, observerOpt)
    }
    static addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: AddEventListenerOptions | boolean): void {
        PageObserver.instance.addEventListener(type, callback, options)
    }
    static dispatchEvent(event: Event): boolean{
        return PageObserver.instance.dispatchEvent(event)
    }
    
    static removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void{
        PageObserver.instance.removeEventListener(type, callback, options)
    }
}

PageObserver.updateFrameStateListener()
