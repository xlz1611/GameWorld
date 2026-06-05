'use client'

import { useState } from 'react'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useUser } from '../../lib/UserContext'

const Navbar = dynamic(() => import('../../components/layout/Navbar'), { ssr: false })

export default function LoginPage() {
  const { login } = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // 调用后端登录 API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      login(data.user, data.token)

      if (rememberMe) {
        localStorage.setItem('token', data.token)
      } else {
        sessionStorage.setItem('token', data.token)
      }

      window.location.href = '/'
    } catch (err) {
      // 将英文错误提示改为中文
      let errorMessage = err.message || '登录失败，请检查邮箱和密码'
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = '网络连接失败，请检查网络设置后重试'
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* 导航栏 */}
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
      />

      <div className="flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md">
          <div className="glow-card p-8">
          <div className="flex items-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-brand hover:text-brand-hover transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>返回首页</span>
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">登录</h1>
            <p className="text-white/80">登录您的账号以访问完整功能</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="请输入邮箱"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors pr-10"
                  placeholder="请输入密码"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-[#334155] bg-[#1E293B] text-brand focus:ring-brand"
                />
                <label htmlFor="remember" className="text-sm text-white/80">记住我</label>
              </div>
              <span className="text-sm text-white/50">忘记密码？请联系管理员</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full download-btn py-3 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : '登录'}
            </button>

            <div className="text-center">
              <span className="text-white/80 text-sm">还没有账号？</span>
              <Link href="/auth/register" className="text-brand hover:text-brand-hover ml-1 text-sm font-semibold">立即注册</Link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}