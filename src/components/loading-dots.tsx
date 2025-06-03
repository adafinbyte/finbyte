"use client"

import { cn } from "@/utils/common"
import { motion } from "framer-motion"

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "secondary" | "accent" | "white"
  className?: string
}

export function LoadingDots({ size = "md", color = "primary", className }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  }

  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    accent: "bg-blue-500",
    white: "bg-white",
  }

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -5 },
  }

  const dotTransition = {
    duration: 0.4,
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "reverse" as const,
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2 my-8", className)} aria-label="Loading">
      <motion.div
        className={cn("rounded-full", sizeClasses[size], colorClasses[color])}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        className={cn("rounded-full", sizeClasses[size], colorClasses[color])}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
      <motion.div
        className={cn("rounded-full", sizeClasses[size], colorClasses[color])}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
      />
    </div>
  )
}
