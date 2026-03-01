'use client'
import { useEffect } from 'react'

export function useRevealAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px',
      }
    )

    const observe = () => {
      document.querySelectorAll('.w-reveal:not(.is-visible)').forEach((el) => {
        observer.observe(el)
      })
    }

    observe()

    // Re-observe when new .w-reveal elements are added (e.g. filter changes)
    const mutationObserver = new MutationObserver(observe)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}
