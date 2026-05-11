import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // In React 18 Strict Mode, effects run twice. Use requestAnimationFrame
    // to defer the initial state check until after the component is fully mounted,
    // preventing the "state update before mount" warning.
    let cancelled = false

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const update = () => {
      if (!cancelled) {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }

    // Defer the initial check to the next animation frame
    const rafId = requestAnimationFrame(update)

    mql.addEventListener("change", update)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      mql.removeEventListener("change", update)
    }
  }, [])

  return isMobile
}
