"use client"

import { useState, useEffect } from "react"

export function useCountUp(
  end: number,
  options: {
    duration?: number
    start?: number
    decimals?: number
    prefix?: string
    suffix?: string
  } = {},
) {
  const { duration = 2000, start = 0, decimals = 0, prefix = "", suffix = "" } = options

  const [count, setCount] = useState(start)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    let startTimestamp: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      const currentCount = progress * (end - start) + start

      setCount(currentCount)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(end)
        setIsAnimating(false)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [start, end, duration])

  const formattedValue = () => {
    const value = isAnimating ? count : end
    const formatted = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString()

    // Add commas for thousands
    const parts = formatted.toString().split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    return `${prefix}${parts.join(".")}${suffix}`
  }

  return formattedValue()
}
