'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Gamepad2, Clock, Download, Heart, Trash2, Search, X } from 'lucide-react'

const Navbar = dynamic(() => import('../components/layout/Navbar'), { ssr: false })

const LibraryPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('downloads')

  useEffect(() => {
    const loadLibraryData = async () => {
      try {
        const downloadIds = JSON.parse(localStorage.getItem('downloadHistory') || '[]')
        const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]')

        if (downloadIds.length === 0 && favoriteIds.length === 0) {
          setGames([])
          return
        }

        const res = await fetch('/api/games')
        if (res.ok) {
          const allGames = await res.json()
          const downloadSet = new Set(downloadIds)
          const favoriteSet = new Set(favoriteIds)

          const libraryGames = allGames
            .filter(g => downloadSet.has(g.id) || favoriteSet.has(g.id))
            .map(g => ({
              ...g,
              isDownloaded: downloadSet.has(g.id),
              isFavorite: favoriteSet.has(g.id)
            }))

          setGames(libraryGames)
        }
      } catch (error) {
        console.error('加载游戏库数据失败:', error)
        setGames([])
      } finally {
        setIsLoading(false)
      }
    }

    loadLibraryData()
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.category && game.category.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (activeTab === 'downloads') return matchesSearch && game.isDownloaded
    if (activeTab === 'favorites') return matchesSearch && game.isFavorite
    return matchesSearch
  })

  const clearDownloads = () => {
    localStorage.removeItem('downloadHistory')
    setGames(prev => prev.filter(g => g.isFavorite).map(g => ({ ...g, isDownloaded: false })))
  }

  const clearFavorites = () => {
    localStorage.removeItem('favorites')
    setGames(prev => prev.filter(g => g.isDownloaded).map(g => ({ ...g, isFavorite: false })))
  }

  const removeGame = (gameId, type) => {
    if (type === 'download') {
      const ids = JSON.parse(localStorage.getItem('downloadHistory') || '[]').filter(id => id !== gameId)
      if (ids.length > 0) {
        localStorage.setItem('downloadHistory', JSON.stringify(ids))
      } else {
        localStorage.removeItem('downloadHistory')
      }
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, isDownloaded: false } : g).filter(g => g.isDownloaded || g.isFavorite))
    } else {
      const ids = JSON.parse(localStorage.getItem('favorites') || '[]').filter(id => id !== gameId)
      if (ids.length > 0) {
        localStorage.setItem('favorites', JSON.stringify(ids))
      } else {
        localStorage.removeItem('favorites')
      }
      setGames(prev => prev.map(g => g.id === gameId ? { ...g, isFavorite: false } : g).filter(g => g.isDownloaded || g.isFavorite))
    }
  }

  const downloadCount = games.filter(g => g.isDownloaded).length
  const favoriteCount = games.filter(g => g.isFavorite).length

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
      />

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Gamepad2 className="w-8 h-8 text-brand" />
            <h1 className="text-4xl font-bold text-white">我的游戏库</h1>
          </div>
          <p className="text-white text-lg max-w-2xl">
            查看和管理您下载或收藏的游戏
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索游戏..."
                className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'downloads' ? 'bg-brand text-[#0F172A]' : 'bg-[#1E293B] border border-[#334155] text-white hover:border-brand'}`}
            >
              <Download className="w-4 h-4 inline mr-2" />
              下载 ({downloadCount})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === 'favorites' ? 'bg-brand text-[#0F172A]' : 'bg-[#1E293B] border border-[#334155] text-white hover:border-brand'}`}
            >
              <Heart className="w-4 h-4 inline mr-2" />
              收藏 ({favoriteCount})
            </button>
            {activeTab === 'downloads' && downloadCount > 0 && (
              <button onClick={clearDownloads} className="ml-auto px-4 py-2 text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                清空下载记录
              </button>
            )}
            {activeTab === 'favorites' && favoriteCount > 0 && (
              <button onClick={clearFavorites} className="ml-auto px-4 py-2 text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                清空收藏
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden animate-pulse">
                  <div className="w-full aspect-video bg-[#334155]"></div>
                  <div className="p-4">
                    <div className="h-4 bg-[#334155] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[#334155] rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Gamepad2 className="w-12 h-12 text-white/40" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeTab === 'downloads' ? '暂无下载记录' : '暂无收藏'}
              </h3>
              <p className="text-white/60 mb-6">
                {activeTab === 'downloads' ? '去游戏库下载您喜欢的游戏吧' : '收藏您喜欢的游戏，方便以后查找'}
              </p>
              <Link
                href="/games"
                className="px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors"
              >
                浏览游戏库
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden hover:border-brand transition-colors relative group"
                >
                  <Link href={`/games/${game.id}`}>
                    <div className="aspect-video bg-[#0F172A] relative">
                      {game.iconUrl ? (
                        <img
                          src={game.iconUrl}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Gamepad2 className="w-12 h-12 text-white/20" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-[#0F172A] text-white px-2 py-1 rounded text-xs font-semibold">
                        {game.category || '其他'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2 line-clamp-1">{game.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        {game.fileSize && <span>{game.fileSize}</span>}
                        {game.isDownloaded && (
                          <span className="flex items-center gap-1 text-brand">
                            <Download className="w-3 h-3" />
                          </span>
                        )}
                        {game.isFavorite && (
                          <span className="flex items-center gap-1 text-red-400">
                            <Heart className="w-3 h-3 fill-current" />
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {activeTab === 'downloads' && game.isDownloaded && (
                    <button
                      onClick={(e) => { e.preventDefault(); removeGame(game.id, 'download') }}
                      className="absolute top-2 left-2 w-7 h-7 bg-[#0F172A]/80 rounded-full flex items-center justify-center text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {activeTab === 'favorites' && game.isFavorite && (
                    <button
                      onClick={(e) => { e.preventDefault(); removeGame(game.id, 'favorite') }}
                      className="absolute top-2 left-2 w-7 h-7 bg-[#0F172A]/80 rounded-full flex items-center justify-center text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default LibraryPage
