'use client'

import { useState, useEffect, useCallback } from 'react'
import { Eye, EyeOff, ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../../components/layout/Navbar'), { ssr: false })

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleSendCode = useCallback(async () => {
    if (!email) {
      setError('请先输入邮箱地址')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('邮箱格式不正确')
      return
    }

    setError('')
    setIsSendingCode(true)

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.cooldown) {
          setCountdown(data.cooldown)
        }
        throw new Error(data.error || '发送验证码失败')
      }

      setCodeSent(true)
      setCountdown(60)

      if (data.dev && data.devCode) {
        setVerificationCode(data.devCode)
        setSuccess(`开发模式：验证码为 ${data.devCode}（邮件服务未配置，验证码已自动填充）`)
        setTimeout(() => setSuccess(''), 8000)
      } else {
        setSuccess('验证码已发送到您的邮箱，请查收')
        setTimeout(() => setSuccess(''), 5000)
      }
    } catch (err) {
      setError(err.message || '发送验证码失败')
    } finally {
      setIsSendingCode(false)
    }
  }, [email])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!verificationCode) {
      setError('请输入邮箱验证码')
      return
    }

    if (verificationCode.length !== 6) {
      setError('验证码为6位数字')
      return
    }

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少为6位')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, verificationCode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      setSuccess('注册成功！正在跳转到登录页面...')
      setTimeout(() => {
        window.location.href = '/auth/login'
      }, 2000)
    } catch (err) {
      let errorMessage = err.message || '注册失败，请稍后重试'
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
            <h1 className="text-3xl font-bold text-white mb-2">注册</h1>
            <p className="text-white/80">创建新账号以开始使用</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">用户名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">邮箱</label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setCodeSent(false) }}
                  required
                  className="flex-1 bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  placeholder="请输入邮箱"
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={isSendingCode || countdown > 0}
                  className="px-4 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSendingCode ? (
                    <span>发送中</span>
                  ) : countdown > 0 ? (
                    <span>{countdown}s</span>
                  ) : codeSent ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>重发</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>获取验证码</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">邮箱验证码</label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors tracking-[0.5em] text-center text-xl font-mono"
                  placeholder="请输入6位验证码"
                />
                {codeSent && verificationCode.length === 6 && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {codeSent && (
                <p className="text-white/40 text-xs mt-2 text-center">验证码已发送至 {email}，5分钟内有效</p>
              )}
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

            <div>
              <label className="block text-sm font-semibold mb-2 text-white">确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                placeholder="请再次输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full download-btn py-3 font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? '注册中...' : '注册'}
            </button>

            <div className="text-center">
              <span className="text-white/80 text-sm">已有账号？</span>
              <Link href="/auth/login" className="text-brand hover:text-brand-hover ml-1 text-sm font-semibold">立即登录</Link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  )
}
