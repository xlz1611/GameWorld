'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}) {
  useEffect(() => {
    console.error('页面错误:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="glow-card p-8 text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            出错了
          </h1>
          
          <p className="text-muted mb-6">
            抱歉，页面加载时出现了问题。请稍后重试。
          </p>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full download-btn flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>重试</span>
            </button>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-muted cursor-pointer hover:text-brand transition-colors">
                查看错误详情
              </summary>
              <pre className="mt-2 p-4 bg-[#0F172A] rounded-lg text-xs text-red-400 overflow-auto max-h-48">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
