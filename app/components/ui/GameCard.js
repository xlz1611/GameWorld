'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, HeartOff, Download, Star, Gamepad2 } from 'lucide-react'

const GameCard = ({ game, index, isFavorite, toggleFavorite, addToDownloadHistory }) => {
  const [tip, setTip] = useState('')

  if (!game || typeof game !== 'object') {
    return null
  }

  const { id, name = '未知游戏', iconUrl = '', category = '其他', version = '1.0.0', fileSize = '未知大小', rating = 0, downloadCount = 0 } = game

  if (!id) {
    return null
  }

  const showTip = (message) => {
    setTip(message)
    setTimeout(() => setTip(''), 2000)
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleFavorite) {
      const wasFavorite = isFavorite && isFavorite(id)
      toggleFavorite(id)
      showTip(wasFavorite ? '已取消收藏' : '已添加到收藏')
    }
  }

  const handleDownload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `/games/${id}`
  }

  const favorited = isFavorite && isFavorite(id)

  return (
    <Link
      key={id}
      href={`/games/${id}`}
      className="bg-[#2a2d31] border border-[#444] rounded-md overflow-hidden hover:border-brand transition-colors stagger-enter focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] relative"
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`查看游戏 ${name} 的详情`}
    >
      {tip && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap animate-fade-in pointer-events-none">
          {tip}
        </div>
      )}

      <div className="aspect-video bg-[#171a21] relative overflow-hidden">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={name}
            className="w-full h-full object-cover"
            loading={index < 3 ? "eager" : "lazy"}
          />
        ) : (
          <div className="w-full h-full bg-[#171a21] flex items-center justify-center">
            <Gamepad2 className="w-12 h-12 text-muted" aria-hidden="true" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-[#171a21] text-white px-2 py-1 rounded text-xs font-semibold">
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-1">{name}</h3>

        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${rating > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-white text-sm font-semibold">{rating > 0 ? rating.toFixed(1) : '暂无'}</span>
          </div>
          <span className="text-gray-400 text-xs">{fileSize}</span>
          {downloadCount > 0 && (
            <span className="text-gray-400 text-xs">{downloadCount >= 10000 ? `${(downloadCount / 10000).toFixed(1)}万` : downloadCount}次下载</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleFavorite}
            className={`flex-1 py-2 rounded-md transition-colors ${favorited ? 'bg-brand text-[#0F172A]' : 'bg-[#171a21] border border-[#444] text-white hover:bg-[#2a475e]'} focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] text-sm`}
            aria-label={favorited ? `取消收藏游戏 ${name}` : `收藏游戏 ${name}`}
          >
            {favorited ? (
              <>
                <Heart className="w-4 h-4 mr-1 fill-current" strokeWidth={1.5} aria-hidden="true" />
                <span>已收藏</span>
              </>
            ) : (
              <>
                <HeartOff className="w-4 h-4 mr-1" strokeWidth={1.5} aria-hidden="true" />
                <span>收藏</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 bg-brand hover:bg-brand-hover text-[#0F172A] font-semibold py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] text-sm"
            aria-label={`查看游戏 ${name} 详情`}
          >
            <Download className="w-4 h-4 mr-1 inline" strokeWidth={1.5} aria-hidden="true" />
            <span>下载</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default GameCard
