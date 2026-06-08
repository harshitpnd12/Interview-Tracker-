import React, { useEffect, useState, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [isMobile, setIsMobile] = useState(true)

  // Jelly motion state variables
  const [jellyScaleX, setJellyScaleX] = useState(1)
  const [jellyScaleY, setJellyScaleY] = useState(1)
  const [jellyRotation, setJellyRotation] = useState(0)

  const lastMousePos = useRef({ x: 0, y: 0, time: Date.now() })
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Springs for smooth trailing
  const springConfig = { damping: 40, stiffness: 380, mass: 0.4 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Check if device supports fine cursor interactions (pointing device)
    const mediaQuery = window.matchMedia("(pointer: fine)")
    setIsMobile(!mediaQuery.matches)

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(!e.matches)
    }

    mediaQuery.addEventListener("change", handleMediaChange)

    if (!mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener("change", handleMediaChange)
      }
    }

    let stopTimeout: any = null

    const moveCursor = (e: MouseEvent) => {
      const now = Date.now()
      const dt = Math.max(now - lastMousePos.current.time, 1)

      const dx = e.clientX - lastMousePos.current.x
      const dy = e.clientY - lastMousePos.current.y

      // Calculate travel velocity
      const speed = Math.sqrt(dx * dx + dy * dy) / dt
      const maxSpeed = 4
      const mappedSpeed = Math.min(speed, maxSpeed)

      // Calculate rotation angle matching direction of travel
      if (speed > 0.05) {
        const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI)
        setJellyRotation(angleDeg)
      }

      // Stretch circle in movement direction, squash in perpendicular direction
      const stretch = mappedSpeed * 0.16
      setJellyScaleX(1 + stretch)
      setJellyScaleY(1 - stretch)

      lastMousePos.current = { x: e.clientX, y: e.clientY, time: now }

      cursorX.set(e.clientX)
      cursorY.set(e.clientY)

      if (!isVisible) setIsVisible(true)

      // Reset jelly shape to circular when cursor stops moving
      if (stopTimeout) clearTimeout(stopTimeout)
      stopTimeout = setTimeout(() => {
        setJellyScaleX(1)
        setJellyScaleY(1)
      }, 80)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    // Setup interactive hover classes listeners
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, input[type="checkbox"]'
      )
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => setIsHovered(true))
        el.addEventListener("mouseleave", () => setIsHovered(false))
      })
    }

    addHoverListeners()
    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      mediaQuery.removeEventListener("change", handleMediaChange)
      if (stopTimeout) clearTimeout(stopTimeout)
      observer.disconnect()
    }
  }, [cursorX, cursorY, isVisible])

  if (isMobile || !isVisible) return null

  return (
    <>
      {/* Small Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      {/* Velocity-Stretching Outer Jelly Circle */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 border-primary/45 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          transformOrigin: "center center",
        }}
        animate={{
          scale: isClicked ? 0.72 : isHovered ? 1.55 : 1,
          scaleX: jellyScaleX,
          scaleY: jellyScaleY,
          rotate: jellyRotation,
          backgroundColor: isHovered ? "rgba(99, 102, 241, 0.12)" : "rgba(99, 102, 241, 0)",
          borderColor: isHovered ? "rgba(99, 102, 241, 0.85)" : "rgba(99, 102, 241, 0.42)",
          boxShadow: isHovered 
            ? "0 0 14px rgba(99, 102, 241, 0.4)" 
            : "0 0 0px rgba(0, 0, 0, 0)"
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.16 }}
      />
    </>
  )
}
export default CustomCursor
