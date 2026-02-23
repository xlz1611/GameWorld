'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Star, Gamepad2, Package, Calendar, Shield, Zap, Users, TrendingUp, Smartphone, Palette } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import ThemeSwitcher from '../../components/ThemeSwitcher'
import GameReviews from '../../components/features/GameReviews'
import OptimizedImage from '../../components/ui/OptimizedImage'

const GameDetail = ({ params }) => {
  const { id } = params
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadStatus, setDownloadStatus] = useState('idle')

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${id}`)
        if (res.ok) {
          const data = await res.json()
          setGame(data)
          
          if (typeof window !== 'undefined') {
            document.title = `${data.name} | GameHub`
          }
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id])

  const handleDownload = async () => {
    setDownloadStatus('loading')
    
    try {
      await fetch(`/api/games/${id}/download`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('更新下载计数失败:', error)
    }
    
    setTimeout(() => {
      window.location.href = game.apkUrl
      setDownloadStatus('idle')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-brand border-t-transparent"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="w-32 h-32 bg-[#1E293B] rounded-3xl flex items-center justify-center">
            <Gamepad2 className="w-20 h-20 text-muted" />
          </div>
        </div>
        <p className="text-muted text-2xl font-semibold mb-3">游戏不存在</p>
        <p className="text-muted/60 text-lg">请检查链接是否正确</p>
      </div>
    )
  }

  return (
    <div className="relative z-10">
      <nav className="glass-navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-[#0F172A]" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold">GameHub</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-brand font-semibold">首页</Link>
            <Link href="/games" className="text-white hover:text-brand transition-colors">游戏库</Link>
            <Link href="/ranking" className="text-white hover:text-brand transition-colors">排行榜</Link>
            <Link href="/settings" className="text-white hover:text-brand transition-colors">设置</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeSwitcher isDropdown={true} />
          </div>

          <button 
            className="md:hidden"
            onClick={() => {}}
          >
            <Palette className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1a2332] to-[#0F172A]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-[#0F172A]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <OptimizedImage 
            src={game.iconUrl} 
            alt={game.name} 
            fill
            className="object-cover opacity-20 blur-3xl scale-110"
            priority={true}
            sizes="100vw"
            quality={60}
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link href="/" className="inline-flex items-center text-brand hover:text-brand-hover transition-colors font-semibold text-lg group">
            <ArrowLeft className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            返回首页
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glow-card p-6">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <div className="aspect-square bg-[#0F172A] relative">
                  <OptimizedImage 
                    src={game.iconUrl} 
                    alt={game.name} 
                    fill
                    priority={true}
                    sizes="(max-width: 640px) 300px, (max-width: 1024px) 350px, 400px"
                    quality={90}
                  />
                </div>
                <div className="absolute top-3 right-3 bg-brand text-[#0F172A] px-3 py-1 rounded-full text-xs font-bold">
                  {game.category}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-6 text-white">{game.name}</h1>

              <div className="flex items-center justify-between mb-6 p-4 bg-[#0F172A] rounded-xl">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-brand fill-brand" strokeWidth={1.5} />
                  <span className="font-bold text-xl text-white">4.5</span>
                </div>
                <div className="flex items-center space-x-2 text-muted">
                  <Users className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">1.2万次下载</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Package className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-muted text-xs mb-1">包名</div>
                    <div className="font-semibold text-white">{game.packageName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Calendar className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-muted text-xs mb-1">版本</div>
                    <div className="font-semibold text-white">{game.version}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Shield className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-muted text-xs mb-1">大小</div>
                    <div className="font-semibold text-white">{game.fileSize}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Smartphone className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-muted text-xs mb-1">系统要求</div>
                    <div className="font-semibold text-white">Android 8.0+</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDownload}
                className={`download-btn w-full flex items-center justify-center space-x-3 text-lg ${downloadStatus === 'loading' ? 'loading' : ''}`}
              >
                <Download className="w-6 h-6" strokeWidth={1.5} />
                <span>{downloadStatus === 'loading' ? '正在获取地址...' : '立即下载'}</span>
              </button>

              <div className="flex justify-center gap-6 mt-6 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>安全无毒</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>高速下载</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>官方正版</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">游戏介绍</h2>
              <p className="text-muted leading-relaxed whitespace-pre-wrap text-lg">{game.description}</p>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">游戏特色</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0F172A] rounded-xl p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="text-brand font-bold text-xl mb-3">高清画质</div>
                  <p className="text-sm text-muted">精美游戏画面，沉浸式体验</p>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="text-brand font-bold text-xl mb-3">流畅操作</div>
                  <p className="text-sm text-muted">优化的操作手感，畅快游戏</p>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="text-brand font-bold text-xl mb-3">丰富内容</div>
                  <p className="text-sm text-muted">海量游戏内容，持续更新</p>
                </div>
                <div className="bg-[#0F172A] rounded-xl p-6 group hover:scale-105 transition-transform duration-300">
                  <div className="text-brand font-bold text-xl mb-3">社交互动</div>
                  <p className="text-sm text-muted">好友互动，组队开黑</p>
                </div>
              </div>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">下载统计</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">12,458</div>
                  <div className="text-sm text-muted">总下载量</div>
                </div>
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">4.5</div>
                  <div className="text-sm text-muted">用户评分</div>
                </div>
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">1,234</div>
                  <div className="text-sm text-muted">今日下载</div>
                </div>
              </div>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">用户评论</h2>
              <GameReviews gameId={id} />
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-fab lg:hidden">
        <button 
          onClick={handleDownload}
          className={`download-btn w-full flex items-center justify-center space-x-3 ${downloadStatus === 'loading' ? 'loading' : ''}`}
        >
          <Download className="w-5 h-5" />
          <span>{downloadStatus === 'loading' ? '正在获取地址...' : '立即下载'}</span>
        </button>
      </div>
    </div>
  )
}

export default GameDetail