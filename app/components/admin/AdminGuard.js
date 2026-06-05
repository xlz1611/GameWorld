'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '../../lib/UserContext'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'
import Link from 'next/link'

export default function AdminGuard({ children }) {
  const { isLoggedIn, isAdmin, isLoading, checkAdminAccess } = useUser()
  const [verifying, setVerifying] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      if (isLoading) return

      if (!isLoggedIn) {
        setVerifying(false)
        setHasAccess(false)
        return
      }

      const access = await checkAdminAccess()
      setHasAccess(access)
      setVerifying(false)
    }

    verify()
  }, [isLoggedIn, isLoading, checkAdminAccess])

  if (isLoading || verifying) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">验证权限中...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">需要登录</h2>
          <p className="text-white/60 mb-8">请先登录管理员账号才能访问后台</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors"
            >
              前往登录
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-[#334155] text-white rounded-lg font-semibold hover:bg-[#475569] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">权限不足</h2>
          <p className="text-white/60 mb-2">您的账号没有管理员权限</p>
          <p className="text-white/40 text-sm mb-8">如需访问后台，请联系管理员将您的账号设为管理员角色</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
