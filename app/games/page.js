'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Download } from 'lucide-react'
import ThemeSwitcher from '../components/ThemeSwitcher'

const GamesPage = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          setGames(data.filter(game => game.isPublished))
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
                <Link href="/games" className="text-brand font-medium border-b-2 border-brand pb-1">游戏库</Link>
                <Link href="/ranking" className="text-white hover:text-brand transition-colors font-medium">排行榜</Link>
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
          <h1 className="text-4xl font-bold text-white mb-6">游戏库</h1>
          <p className="text-muted text-lg max-w-2xl">
            探索我们的游戏库，找到最适合你的游戏。所有游戏都经过精心挑选，确保最佳体验。
          </p>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="card skeleton animate-pulse">
                  <div className="aspect-[3/4] bg-[#1E293B] rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-6 bg-[#1E293B] rounded"></div>
                    <div className="h-4 bg-[#1E293B] rounded w-2/3"></div>
                    <div className="h-10 bg-[#1E293B] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-muted" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">未找到游戏</h3>
              <p className="text-muted">
                {searchTerm ? `没有找到与"${searchTerm}"相关的游戏` : '游戏库暂时为空'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="card group hover:translate-y-[-8px] transition-all duration-300"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-xl mb-4 relative group-hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={game.iconUrl}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 w-full">
                        <span className="inline-block bg-brand/90 text-[#0F172A] text-xs font-bold px-3 py-1 rounded-full">
                          {game.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand transition-colors duration-300">
                    {game.name}
                  </h3>
                  <p className="text-muted text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">v{game.version}</span>
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

export default GamesPage