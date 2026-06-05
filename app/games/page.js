'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useDebounce } from '../lib/useDebounce'

const Navbar = dynamic(() => import('../components/layout/Navbar'), { ssr: false })
const GameCard = dynamic(() => import('../components/ui/GameCard'), { ssr: false })
const GameCardSkeleton = dynamic(() => import('../components/ui/GameCardSkeleton'), { ssr: false })

const categories = ['全部', '动作游戏', '角色扮演', '休闲益智', '策略游戏', '体育竞技', '模拟经营', '冒险解谜']

const sortOptions = [
  { key: 'latest', label: '最新' },
  { key: 'popular', label: '最热' },
  { key: 'rating', label: '评分最高' },
]

const GamesPage = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [sortBy, setSortBy] = useState('latest')
  const [favorites, setFavorites] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedCategory && selectedCategory !== '全部') {
          params.set('category', selectedCategory)
        }
        if (debouncedSearch && debouncedSearch.trim() !== '') {
          params.set('search', debouncedSearch)
        }
        const res = await fetch(`/api/games?${params.toString()}`)
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
  }, [selectedCategory, debouncedSearch])

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {}
    }
    const savedDownloads = localStorage.getItem('downloadHistory')
    if (savedDownloads) {
      try {
        setDownloadHistory(JSON.parse(savedDownloads))
      } catch (e) {}
    }
  }, [])

  const sortedGames = useMemo(() => {
    let filtered = games

    if (debouncedSearch) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'popular':
        return [...filtered].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      case 'rating':
        return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'latest':
      default:
        return [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    }
  }, [games, sortBy, debouncedSearch])

  const isFavorite = (gameId) => favorites.includes(gameId)

  const toggleFavorite = (gameId) => {
    setFavorites(prev => {
      const updated = prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
      localStorage.setItem('favorites', JSON.stringify(updated))
      return updated
    })
  }

  const addToDownloadHistory = (game) => {
    setDownloadHistory(prev => {
      if (prev.includes(game.id)) return prev
      const updated = [game.id, ...prev]
      localStorage.setItem('downloadHistory', JSON.stringify(updated))
      return updated
    })
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

      <section className="relative overflow-hidden py-20 pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-6">游戏库</h1>
          <p className="text-white text-lg max-w-2xl">
            探索我们的游戏库，找到最适合你的游戏。所有游戏都经过精心挑选，确保最佳体验。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="category-pills mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <p className="text-white/60 text-sm">
              共 {sortedGames.length} 款游戏
              {selectedCategory !== '全部' && ` · ${selectedCategory}`}
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-white/50" />
              {sortOptions.map(option => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                    sortBy === option.key
                      ? 'bg-brand text-[#0F172A] font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="game-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <GameCardSkeleton key={index} />
              ))}
            </div>
          ) : sortedGames.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">未找到游戏</h3>
              <p className="text-white">
                {searchTerm ? `没有找到与"${searchTerm}"相关的游戏` : '游戏库暂时为空'}
              </p>
            </div>
          ) : (
            <div className="game-grid">
              {sortedGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={index}
                  isFavorite={isFavorite}
                  toggleFavorite={toggleFavorite}
                  addToDownloadHistory={addToDownloadHistory}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default GamesPage
