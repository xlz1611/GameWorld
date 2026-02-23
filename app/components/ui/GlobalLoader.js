'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 300)
    }

    window.addEventListener('routeChangeStart', handleStart)
    window.addEventListener('routeChangeComplete', handleComplete)
    window.addEventListener('routeChangeError', handleComplete)

    return () => {
      window.removeEventListener('routeChangeStart', handleStart)
      window.removeEventListener('routeChangeComplete', handleComplete)
      window.removeEventListener('routeChangeError', handleComplete)
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-[#0F172A]">
        <div
          className="h-full bg-brand transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg">
        <Loader2 className="w-4 h-4 text-brand animate-spin" />
        <span className="text-sm text-white">加载中...</span>
      </div>
    </div>
  )
}
