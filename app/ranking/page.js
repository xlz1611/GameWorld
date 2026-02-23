'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Download, Trophy } from 'lucide-react'
import ThemeSwitcher from '../components/ThemeSwitcher'

const RankingPage = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          // 按下载量排序（这里模拟，实际应从数据库获取）
          const sortedGames = data
            .filter(game => game.isPublished)
            .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
          setGames(sortedGames)
        }
      } catch (error) {
        console.error('Failed to fetch games:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGames()
  }, [])

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navigation */}
      <nav className="glass border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-[#0F172A]" />
                </div>
                <span className="text-xl font-bold">GameHub</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-white hover:text-brand transition-colors font-medium">首页</Link>
                <Link href="/games" className="text-white hover:text-brand transition-colors font-medium">游戏库</Link>
                <Link href="/ranking" className="text-brand font-medium border-b-2 border-brand pb-1">排行榜</Link>
                <Link href="/settings" className="text-white hover:text-brand transition-colors font-medium">设置</Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSwitcher isDropdown={true} />
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索游戏..."
                  className="search-expand bg-[#1E293B] border-2 border-[#334155] rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand text-white placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-brand" />
            <h1 className="text-4xl font-bold text-white">游戏排行榜</h1>
          </div>
          <p className="text-muted text-lg max-w-2xl">
            查看最受欢迎的游戏排行榜，发现大家都在玩什么。
          </p>
        </div>
      </section>

      {/* Ranking List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex gap-6 p-6 bg-[#1E293B] rounded-xl animate-pulse">
                  <div className="w-12 h-12 bg-[#0F172A] rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-[#0F172A] rounded"></div>
                    <div className="h-4 bg-[#0F172A] rounded w-2/3"></div>
                  </div>
                  <div className="w-24 space-y-2">
                    <div className="h-4 bg-[#0F172A] rounded"></div>
                    <div className="h-8 bg-[#0F172A] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">暂无排行数据</h3>
              <p className="text-muted">
                {searchTerm ? `没有找到与"${searchTerm}"相关的游戏` : '游戏库暂时为空'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGames.map((game, index) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="flex gap-6 p-6 bg-[#1E293B] rounded-xl hover:bg-[#0F172A] transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-lg font-bold text-white border-2 border-[#334155] group-hover:border-brand transition-colors duration-300">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors duration-300">
                      {game.name}
                    </h3>
                    <p className="text-muted text-sm mb-3 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="inline-block bg-brand/20 text-brand text-xs font-bold px-3 py-1 rounded-full">
                        {game.category}
                      </span>
                      <span className="text-sm text-muted">v{game.version}</span>
                      <span className="text-sm text-muted">{game.fileSize}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm text-muted mb-2">
                      {game.downloadCount || 0} 下载
                    </span>
                    <button className="group/btn flex items-center gap-2 text-sm font-medium text-white hover:text-brand transition-colors duration-300">
                      查看详情
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RankingPage