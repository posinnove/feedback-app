import { type RefObject, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
        { autoAlpha: 0, x: options.x ?? 0, y: options.y ?? 10 },
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
      if (!targets || targets.length === 0) return

      gsap.fromTo(
        targets,
        { autoAlpha: 0, x: options.x ?? 0, y: options.y ?? 10 },
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

export function useGsapScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  options: MotionOptions & { scrollerRef?: RefObject<HTMLElement | null> } = {}
) {
  useLayoutEffect(() => {
    if (!containerRef.current || shouldReduceMotion()) return

    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll(selector)
      if (!targets || targets.length === 0) return

      targets.forEach((target) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: options.y ?? 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: options.duration ?? 0.6,
            ease: options.ease ?? 'power2.out',
            scrollTrigger: {
              trigger: target,
              scroller: options.scrollerRef?.current ?? undefined,
              start: 'top 90%',
              end: 'top 60%',
              scrub: 0.8,
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useGsapParallax(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  options: { speed?: number; scrollerRef?: RefObject<HTMLElement | null> } = {}
) {
  useLayoutEffect(() => {
    if (!containerRef.current || shouldReduceMotion()) return

    const ctx = gsap.context(() => {
      const targets = containerRef.current?.querySelectorAll(selector)
      if (!targets || targets.length === 0) return

      targets.forEach((target) => {
        gsap.to(target, {
          y: `${(options.speed ?? 0.3) * 100}%`,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            scroller: options.scrollerRef?.current ?? undefined,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
