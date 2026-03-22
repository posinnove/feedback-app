import { type RefObject, useLayoutEffect } from 'react'
import gsap from 'gsap'

type MotionOptions = {
  duration?: number
  delay?: number
  ease?: string
  x?: number
  y?: number
  stagger?: number
  enabled?: boolean
}

function shouldReduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useGsapReveal(
  ref: RefObject<HTMLElement | null>,
  deps: ReadonlyArray<unknown>,
  options: MotionOptions = {}
) {
  useLayoutEffect(() => {
    if (!ref.current || options.enabled === false || shouldReduceMotion()) {
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          autoAlpha: 0,
          x: options.x ?? 0,
          y: options.y ?? 10,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: options.duration ?? 0.35,
          delay: options.delay ?? 0,
          ease: options.ease ?? 'power2.out',
        }
      )
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export function useGsapStagger(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  deps: ReadonlyArray<unknown>,
  options: MotionOptions = {}
) {
  useLayoutEffect(() => {
    if (!containerRef.current || options.enabled === false || shouldReduceMotion()) {
      return
    }

    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll(selector)
      if (!targets || targets.length === 0) {
        return
      }

      gsap.fromTo(
        targets,
        {
          autoAlpha: 0,
          x: options.x ?? 0,
          y: options.y ?? 10,
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: options.duration ?? 0.35,
          delay: options.delay ?? 0,
          stagger: options.stagger ?? 0.05,
          ease: options.ease ?? 'power2.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
