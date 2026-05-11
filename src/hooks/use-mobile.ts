import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const mountedRef = React.useRef(false)

  React.useEffect(() => {
    mountedRef.current = true
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      if (mountedRef.current) {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
    }
    mql.addEventListener("change", onChange)
    // Use setTimeout to ensure component is fully mounted before setState
    const timer = setTimeout(() => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }, 0)
    return () => {
      mountedRef.current = false
      mql.removeEventListener("change", onChange)
      clearTimeout(timer)
    }
  }, [])

  return !!isMobile
}
