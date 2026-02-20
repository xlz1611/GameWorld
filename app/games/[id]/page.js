'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Star, Gamepad2, Package, Calendar, Shield } from 'lucide-react'
import Link from 'next/link'

const GameDetail = ({ params }) => {
  const { id } = params
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${id}`)
        if (res.ok) {
          const data = await res.json()
          setGame(data)
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-20">
        <Gamepad2 className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
        <p className="text-foreground/60 text-xl mb-2">游戏不存在</p>
        <p className="text-foreground/40">请检查链接是否正确</p>
      </div>
    )
  }

  return (
    <div>
      <Link href="/" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-8 font-medium">
        <ArrowLeft className="h-5 w-5 mr-2" />
        返回首页
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted-hover flex items-center justify-center">
                <img 
                  src={game.iconUrl} 
                  alt={game.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-white">{game.category}</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-4">{game.name}</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span className="font-semibold">4.5</span>
              </div>
              <span className="text-sm text-foreground/60">1.2万次下载</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3 text-sm">
                <Package className="w-5 h-5 text-primary" />
                <span className="text-foreground/60">包名:</span>
                <span className="font-medium">{game.packageName}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-foreground/60">版本:</span>
                <span className="font-medium">{game.version}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-foreground/60">大小:</span>
                <span className="font-medium">{game.fileSize}</span>
              </div>
            </div>

            <a 
              href={game.apkUrl} 
              download
              className="btn btn-primary w-full flex items-center justify-center space-x-2 glow"
            >
              <Download className="h-6 w-6" />
              <span>立即下载</span>
            </a>

            <p className="text-center text-xs text-foreground/40 mt-4">
              安全无毒 · 官方正版 · 高速下载
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span>游戏介绍</span>
            </h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{game.description}</p>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">游戏特色</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4">
                <div className="text-primary font-semibold mb-2">高清画质</div>
                <p className="text-sm text-foreground/60">精美游戏画面，沉浸式体验</p>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-primary font-semibold mb-2">流畅操作</div>
                <p className="text-sm text-foreground/60">优化的操作手感，畅快游戏</p>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-primary font-semibold mb-2">丰富内容</div>
                <p className="text-sm text-foreground/60">海量游戏内容，持续更新</p>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-primary font-semibold mb-2">社交互动</div>
                <p className="text-sm text-foreground/60">好友互动，组队开黑</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameDetail
