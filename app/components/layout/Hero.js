'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Download, Search, Gamepad2, Users, Package } from 'lucide-react'

const DEFAULT_HERO = {
  name: '游戏世界 - 手机端的Steam',
  description: '发现、下载、畅玩 - 您的专属游戏天堂',
  iconUrl: null
}

const Hero = () => {
  const [games, setGames] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [stats, setStats] = useState({ totalGames: 0, totalDownloads: 0, totalUsers: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    const fetchTopGames = async () => {
      try {
        const res = await fetch('/api/games', { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          const topGames = Array.isArray(data)
            ? data
                .filter(g => g.isPublished)
                .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
                .slice(0, 5)
            : []
          setGames(topGames)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('获取热门游戏失败:', err)
        }
      }
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { signal: controller.signal })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('获取统计数据失败:', err)
        }
      }
    }

    fetchTopGames()
    fetchStats()

    return () => controller.abort()
  }, [])

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning])

  const nextSlide = useCallback(() => {
    const len = games.length || 1
    goToSlide((currentIndex + 1) % len)
  }, [currentIndex, games.length, goToSlide])

  const prevSlide = useCallback(() => {
    const len = games.length || 1
    goToSlide((currentIndex - 1 + len) % len)
  }, [currentIndex, games.length, goToSlide])

  useEffect(() => {
    if (isPaused || games.length <= 1) {
      clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      const len = games.length || 1
      setCurrentIndex(prev => (prev + 1) % len)
    }, 5000)

    return () => clearInterval(timerRef.current)
  }, [isPaused, games.length])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const formatNumber = (num) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
    return String(num)
  }

  const currentGame = games.length > 0 ? games[currentIndex] : null
  const displayData = currentGame || DEFAULT_HERO

  return (
    <section
      className="relative bg-[#1b2838] border-b border-[#2e3136] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {currentGame?.iconUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={currentGame.iconUrl}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b2838] via-[#1b2838]/80 to-[#1b2838]/60" />
        </div>
      )}

      {!currentGame?.iconUrl && (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-50" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 md:pt-20 pb-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          <div className="flex-1 min-h-[320px] md:min-h-[380px] flex flex-col justify-center">
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
              {currentGame ? (
                <>
                  <div className="flex items-start gap-6 mb-4">
                    {currentGame.iconUrl && (
                      <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg shadow-brand/20">
                        <img
                          src={currentGame.iconUrl}
                          alt={currentGame.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="inline-block bg-brand/20 text-brand px-3 py-1 rounded-full text-xs font-semibold mb-3">
                        🔥 热门推荐
                      </span>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight truncate">
                        {displayData.name}
                      </h2>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="bg-white/10 px-2 py-0.5 rounded">{displayData.category}</span>
                        {displayData.rating > 0 && (
                          <span className="text-yellow-400">★ {displayData.rating.toFixed(1)}</span>
                        )}
                        <span>{formatNumber(displayData.downloadCount || 0)}次下载</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-base md:text-lg mb-6 line-clamp-2 max-w-xl">
                    {displayData.description || '暂无描述'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/games/${currentGame.id}`}
                      className="bg-brand hover:bg-brand-hover text-[#0F172A] font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>立即下载</span>
                    </Link>
                    <Link
                      href={`/games/${currentGame.id}`}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-md transition-colors border border-white/20"
                    >
                      查看详情
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    {DEFAULT_HERO.name}
                  </h2>
                  <p className="text-gray-300 text-base md:text-lg mb-6 max-w-xl">
                    {DEFAULT_HERO.description}
                  </p>
                  <Link
                    href="/"
                    className="bg-brand hover:bg-brand-hover text-[#0F172A] font-bold py-3 px-6 rounded-md flex items-center gap-2 transition-colors w-fit"
                  >
                    <Gamepad2 className="w-5 h-5" />
                    <span>浏览游戏</span>
                  </Link>
                </>
              )}
            </div>

            {games.length > 1 && (
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="上一个游戏"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {games.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-8 bg-brand'
                          : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`切换到第 ${idx + 1} 个游戏`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
                  aria-label="下一个游戏"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="lg:w-72 shrink-0 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索游戏..."
                className="w-full bg-white/10 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
              />
            </form>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-brand" />
                平台数据
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-brand text-xl md:text-2xl font-bold">
                    {formatNumber(stats.totalGames)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">游戏</div>
                </div>
                <div className="text-center">
                  <div className="text-brand text-xl md:text-2xl font-bold">
                    {formatNumber(stats.totalDownloads)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">下载</div>
                </div>
                <div className="text-center">
                  <div className="text-brand text-xl md:text-2xl font-bold">
                    {formatNumber(stats.totalUsers)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">用户</div>
                </div>
              </div>
            </div>

            {games.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand" />
                  热门排行
                </h3>
                <div className="space-y-2">
                  {games.slice(0, 3).map((g, idx) => (
                    <Link
                      key={g.id}
                      href={`/games/${g.id}`}
                      className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                        idx === currentIndex ? 'bg-brand/10 border border-brand/30' : 'hover:bg-white/5'
                      }`}
                      onClick={() => goToSlide(idx)}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0 ? 'bg-yellow-500 text-black' :
                        idx === 1 ? 'bg-gray-300 text-black' :
                        'bg-amber-700 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      {g.iconUrl && (
                        <div className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-white/10">
                          <img src={g.iconUrl} alt={g.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-white text-sm truncate flex-1">{g.name}</span>
                      <span className="text-gray-400 text-xs shrink-0">
                        {formatNumber(g.downloadCount || 0)}次
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
