'use client'

import { ElementType, ReactNode, Ref, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface StoryRevealProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  delayMs?: number
}

export function StoryReveal({
  children,
  className,
  as = 'div',
  delayMs = 0
}: StoryRevealProps) {
  const Component = as as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersReduced = media.matches
    setReduceMotion(prefersReduced)

    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const revealClasses = reduceMotion
    ? 'opacity-100 translate-y-0'
    : isVisible
      ? 'opacity-100 translate-y-0 transition-all duration-200 ease-out'
      : 'opacity-0 translate-y-3 transition-all duration-200 ease-out'

  return (
    <Component
      ref={ref as Ref<HTMLElement>}
      className={cn('transform-gpu', revealClasses, className)}
      style={
        reduceMotion
          ? undefined
          : {
              transitionDelay: `${delayMs}ms`
            }
      }
    >
      {children}
    </Component>
  )
}
