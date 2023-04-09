import { createStore, createEvent, sample, combine } from 'effector'

const currentTimeChanged = createEvent<number>()
const durationChanged = createEvent<number>()
export const $currentTime = createStore(0)
export const $duration = createStore(0)
export const $timeLeftVideo = combine($duration, $currentTime, (duration, currentTime) => duration - currentTime)
sample({
    clock: currentTimeChanged,
    target: $currentTime,
})
sample({
    clock: durationChanged,
    target: $duration,
})

export const nextEpisodeElement = () => (document.querySelector('.m-select-sibling-episode a:last-child') as HTMLAnchorElement | null)
export const nextEpisodeLink = () => nextEpisodeElement()?.href || ""

export function getFrameDoc(): Document | null {
    return (document.querySelector('.video-container iframe') as HTMLIFrameElement)?.contentDocument
}
function frameLog(msg: string): void {
    return console.log(`[${getFrameDoc()?.URL} | ${getFrameDoc()?.readyState}] ${msg}`)
}
const observerOpt: MutationObserverInit = { 
    childList: true,
    attributes: true,
    attributeFilter: ['src'],
    attributeOldValue: true
}

export class PageObserver extends EventTarget {
    
    capture(): void {
        const video = getFrameDoc()?.querySelector('video')
        
        currentTimeChanged(video?.currentTime ?? 0)
        durationChanged(video?.duration ?? 0)
        
        const updateTime = () => currentTimeChanged(video!.currentTime) 
        const updateDuration = () => durationChanged(video!.duration)
        
        video?.removeEventListener('timeupdate', updateTime);
        video?.removeEventListener('durationchange', updateDuration);
        
        video?.addEventListener('timeupdate', updateTime);
        video?.addEventListener('durationchange', updateDuration);

        if (video) {
            frameLog(`video duration was captured!`)
            const event = new CustomEvent(PageObserver.VideoCaptured, { detail: { node: video.parentElement } })
            currentTimeChanged(video.currentTime)
            durationChanged(video.duration)
            PageObserver.dispatchEvent(event)
        }
        else frameLog(`page have no video =(`)
    }
    static updateFrameStateListener(): number | undefined {
        return PageObserver.instance.updateFrameStateListener()
    }
    updateFrameStateListener(): number | undefined {
        currentTimeChanged(0)
        durationChanged(0)
        
        if (!getFrameDoc()) return
        
        // TODO: fix this shit
        // i dont know why, but sometimes that just hapened =(
        if (getFrameDoc()?.URL === "about:blank") 
            return setTimeout(this.updateFrameStateListener.bind(this), 10)
        
        if (getFrameDoc()?.readyState === 'complete') this.capture()
        else getFrameDoc()?.addEventListener('readystatechange', () => this.capture.apply(this))
    }
    
    iframeUpdateCallback (mutations: MutationRecord[], _: MutationObserver): void {
        console.log('mutation!')
        for(var mutation of mutations) {
            // @ts-ignore: ts(2488) Type must have a '[Symbol.iterator]()' method that returns an iterator.
            let ok = [...mutation.addedNodes]
                .some((n: Node) => (n as Element)
                    .classList.contains('body-container'))
            
            if (ok) {
                this.updateFrameStateListener()
                this.dispatchEvent(new Event(PageObserver.PageUpdate))
            }
        }
    }

    static PageUpdate = 'pageUpdate'
    static VideoCaptured = 'videoCaptured'
    static instance = new PageObserver()
    observer: MutationObserver = null!
    
    constructor() {
        super()
        if (PageObserver.instance)
            return PageObserver.instance
        // console.log('Observer constructor')
        this.observer = new MutationObserver(this.iframeUpdateCallback.bind(this))
        this.observer.observe(document.body as Node, observerOpt)
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
