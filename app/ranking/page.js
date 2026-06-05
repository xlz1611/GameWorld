'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Download, Trophy, Star, Clock, Gamepad2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('../components/layout/Navbar'), { ssr: false })

const TABS = [
  { key: 'download', label: '下载榜', icon: Download },
  { key: 'rating', label: '评分榜', icon: Star },
  { key: 'latest', label: '最新上架', icon: Clock },
]

const RankingPage = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('download')

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          const published = data.filter(game => game.isPublished)
          setGames(published)
        }
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [])

  const sortedGames = useMemo(() => {
    let filtered = games.filter(game =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    switch (activeTab) {
      case 'download':
        return [...filtered].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      case 'rating':
        return [...filtered]
          .filter(game => (game.rating || 0) > 0)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'latest':
        return [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      default:
        return filtered
    }
  }, [games, searchTerm, activeTab])

  const getRankBadge = (index) => {
    if (index === 0) return { bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600', text: 'TOP 1' }
    if (index === 1) return { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'TOP 2' }
    if (index === 2) return { bg: 'bg-gradient-to-r from-amber-600 to-amber-800', text: 'TOP 3' }
    return null
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0)
    const hasHalf = (rating || 0) - fullStars >= 0.5
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />)
      } else if (i === fullStars && hasHalf) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500 opacity-50" />)
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-white/20" />)
      }
    }
    return stars
  }

  const getTabExtraInfo = (game) => {
    switch (activeTab) {
      case 'download':
        return (
          <span className="text-sm text-white/70 flex items-center gap-1">
            <Download className="w-3 h-3" />
            {game.downloadCount || 0} 次下载
          </span>
        )
      case 'rating':
        return (
          <span className="text-sm text-white/70 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {game.rating ? game.rating.toFixed(1) : '暂无'} 评分
          </span>
        )
      case 'latest':
        return (
          <span className="text-sm text-white/70 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {game.createdAt ? new Date(game.createdAt).toLocaleDateString('zh-CN') : '未知'}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={(term) => setSearchTerm(term)}
        searchHistory={[]}
        setSearchHistory={() => {}}
      />

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-brand" />
            <h1 className="text-4xl font-bold text-white">游戏排行榜</h1>
          </div>
          <p className="text-white text-lg max-w-2xl">
            实时追踪游戏热度，发现最受欢迎的游戏。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-8 bg-[#1E293B] rounded-xl p-1.5 w-fit">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-brand text-[#0F172A] shadow-lg shadow-brand/25'
                      : 'text-white/70 hover:text-white hover:bg-[#334155]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#334155] rounded-lg"></div>
                  <div className="w-24 h-16 bg-[#334155] rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#334155] rounded w-1/3"></div>
                    <div className="h-3 bg-[#334155] rounded w-1/4"></div>
                  </div>
                  <div className="h-8 bg-[#334155] rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : sortedGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">暂无排行数据</h3>
              <p className="text-white">
                {searchTerm ? `没有找到与"${searchTerm}"相关的游戏` : '游戏库暂时为空'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedGames.map((game, index) => {
                const badge = getRankBadge(index)
                return (
                  <Link
                    key={game.id}
                    href={`/games/${game.id}`}
                    className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 flex items-center gap-4 hover:border-brand transition-colors duration-300 group"
                  >
                    <div className="w-10 flex-shrink-0 flex items-center justify-center">
                      {badge ? (
                        <span className={`${badge.bg} text-[#0F172A] px-2.5 py-1 rounded-lg text-xs font-bold`}>
                          {badge.text}
                        </span>
                      ) : (
                        <span className="text-white/50 text-lg font-bold">{index + 1}</span>
                      )}
                    </div>

                    <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#334155]">
                      {game.iconUrl ? (
                        <img
                          src={game.iconUrl}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="w-6 h-6 text-white/30" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold group-hover:text-brand transition-colors duration-300 truncate">
                        {game.name}
                      </h3>
                      <p className="text-white/50 text-sm truncate">{game.category || '其他'}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {getTabExtraInfo(game)}
                      <div className="flex items-center gap-0.5">
                        {renderStars(game.rating)}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RankingPage
