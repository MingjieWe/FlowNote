'use client'

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SkeletonBaseProps {
  className?: string
  style?: React.CSSProperties
}

function SkeletonBase({ className, style }: SkeletonBaseProps) {
  return (
    <motion.div
      className={cn("rounded-md bg-muted", className)}
      style={style}
      animate={{
        opacity: [0.4, 0.8, 0.4],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Card skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-[32px] border border-border bg-card/95 p-5", className)}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <SkeletonBase className="h-6 w-2/3" />
        <SkeletonBase className="h-4 w-16" />
      </div>
      <SkeletonBase className="h-16 w-full mb-4" />
      <div className="flex gap-2">
        <SkeletonBase className="h-6 w-16 rounded-full" />
        <SkeletonBase className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

// Ideas page skeleton
export function IdeasSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-10 w-64" />
          <SkeletonBase className="h-4 w-96" />
        </div>
        <SkeletonBase className="h-11 w-32 rounded-lg" />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBase key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Journal page skeleton
export function JournalSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-10 w-64" />
          <SkeletonBase className="h-4 w-96" />
        </div>
        <SkeletonBase className="h-11 w-28 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <div className="rounded-[24px] border border-border bg-card/95 p-4">
            <SkeletonBase className="h-8 w-full mb-4" />
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <SkeletonBase key={i} className="h-8 w-8 rounded-lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="lg:col-span-3 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[24px] border border-border bg-card/95 p-5">
              <div className="flex items-center gap-3 mb-3">
                <SkeletonBase className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <SkeletonBase className="h-4 w-32" />
                  <SkeletonBase className="h-3 w-20" />
                </div>
              </div>
              <SkeletonBase className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Finance page skeleton
export function FinanceSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <SkeletonBase className="h-4 w-20" />
          <SkeletonBase className="h-10 w-64" />
          <SkeletonBase className="h-4 w-96" />
        </div>
        <SkeletonBase className="h-11 w-40 rounded-lg" />
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between gap-4 rounded-[24px] border border-border bg-card/95 p-4">
        <SkeletonBase className="h-10 w-10 rounded-lg" />
        <SkeletonBase className="h-6 w-40" />
        <SkeletonBase className="h-10 w-10 rounded-lg" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[24px] border border-border bg-card/95 p-6">
            <SkeletonBase className="h-4 w-20 mb-2" />
            <SkeletonBase className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBase key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>

      {/* Transactions */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between rounded-[20px] border border-border bg-card/95 p-4">
            <div className="flex items-center gap-4">
              <SkeletonBase className="h-12 w-12 rounded-lg" />
              <div className="space-y-1">
                <SkeletonBase className="h-4 w-24" />
                <SkeletonBase className="h-3 w-16" />
              </div>
            </div>
            <SkeletonBase className="h-6 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

export { SkeletonBase as Skeleton }
