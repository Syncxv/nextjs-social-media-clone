import { useRef, useEffect, MutableRefObject } from 'react'

export const useObserver = ({
    callback,
    ref
}: {
    callback: (e: ResizeObserverEntry[]) => void
    ref: MutableRefObject<HTMLDivElement | null>
}) => {
    const current = ref && ref.current

    const observer = useRef<ResizeObserver | null>(null)

    useEffect(() => {
        // if we are already observing old element
        if (observer && observer.current && current) {
            observer.current.unobserve(current)
        }
        const resizeObserverOrPolyfill = ResizeObserver
        observer.current = new resizeObserverOrPolyfill(callback)
        observe()

        return () => {
            if (observer && observer.current && ref && ref.current) {
                observer.current.unobserve(ref.current)
            }
        }
    }, [current])

    const observe = () => {
        if (ref && ref.current && observer.current) {
            observer.current.observe(ref.current)
        }
    }
}
