'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Gamepad2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const Navbar = dynamic(() => import('./components/layout/Navbar'), { ssr: false })
const Hero = dynamic(() => import('./components/layout/Hero'), { ssr: false })
const MobileNav = dynamic(() => import('./components/layout/MobileNav'), { ssr: false })
const GameCard = dynamic(() => import('./components/ui/GameCard'), { ssr: false })
const GameCardSkeleton = dynamic(() => import('./components/ui/GameCardSkeleton'), { ssr: false })
const Pagination = dynamic(() => import('./components/ui/Pagination'), { ssr: false })
const TrendingGames = dynamic(() => import('./components/features/TrendingGames'), { ssr: false })

const CATEGORIES = ['全部', '动作游戏', '角色扮演', '休闲益智', '策略游戏', '体育竞技', '模拟经营', '冒险解谜']

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]))
}

const Home = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [gamesPerPage] = useState(10)
  const [searchHistory, setSearchHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const loadGames = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setError(null)
    try {
      let cachedGames = null
      let cacheExpiry = null
      const now = Date.now()
      const cacheTime = 5 * 60 * 1000

      try {
        cachedGames = localStorage.getItem('cachedGames')
        cacheExpiry = localStorage.getItem('cacheExpiry')
      } catch (storageError) {}

      if (cachedGames && cacheExpiry && now < parseInt(cacheExpiry)) {
        try {
          const data = JSON.parse(cachedGames)
          setGames(data)
        } catch (parseError) {}
      }

      const res = await fetch('/api/games', { signal: controller.signal })
      if (res.ok) {
        const data = await res.json()
        setGames(Array.isArray(data) ? data : [])
        try {
          localStorage.setItem('cachedGames', JSON.stringify(data))
          localStorage.setItem('cacheExpiry', (now + cacheTime).toString())
        } catch (storageError) {}
      } else {
        throw new Error(`API请求失败: ${res.status}`)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('获取游戏列表失败:', error)
        setError('获取游戏列表失败，请稍后重试')
        setGames([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGames()
    return () => {
      if (abortRef.current) abortRef.current.abort()
    }
  }, [loadGames])

  const handleSearch = useCallback((term) => {
    const sanitizedTerm = sanitizeInput(term)
    setSearchTerm(sanitizedTerm)
    
    // 添加到搜索历史
    if (sanitizedTerm && sanitizedTerm.trim() !== '') {
      setSearchHistory(prev => {
        const trimmedTerm = sanitizedTerm.trim()
        const newHistory = [trimmedTerm, ...prev.filter(item => item !== trimmedTerm)]
        return newHistory.slice(0, 5) // 限制历史记录数量为5个
      })
    }
  }, [])

  // 加载收藏和下载历史
  useEffect(() => {
    // 加载收藏
    try {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites)
        }
      }

      // 加载下载历史
      const savedDownloadHistory = localStorage.getItem('downloadHistory')
      if (savedDownloadHistory) {
        const parsedHistory = JSON.parse(savedDownloadHistory)
        if (Array.isArray(parsedHistory)) {
          setDownloadHistory(parsedHistory)
        }
      }
    } catch (error) {
      console.warn('加载本地存储数据失败:', error)
    }
  }, [])

  // 收藏/取消收藏游戏
  const toggleFavorite = useCallback((gameId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
      try {
        localStorage.setItem('favorites', JSON.stringify(newFavorites))
      } catch (error) {
        console.warn('保存收藏数据失败:', error)
      }
      return newFavorites
    })
  }, [])

  // 记录下载历史
  const addToDownloadHistory = useCallback((game) => {
    if (!game || !game.id) return
    
    setDownloadHistory(prev => {
      // 移除已存在的相同游戏，添加到最前面
      const newHistory = [
        game.id,
        ...prev.filter(id => id !== game.id)
      ].slice(0, 10) // 限制下载历史数量为10个
      try {
        localStorage.setItem('downloadHistory', JSON.stringify(newHistory))
      } catch (error) {
        console.warn('保存下载历史失败:', error)
      }
      return newHistory
    })
  }, [])

  // 检查游戏是否已收藏
  const isFavorite = useCallback((gameId) => {
    return favorites.includes(gameId)
  }, [favorites])

  // 计算过滤后的游戏（使用useMemo优化）
  const filteredGamesMemo = useMemo(() => {
    let filtered = games

    // 过滤已发布的游戏
    filtered = filtered.filter(game => game.isPublished)

    // 搜索过滤
    if (searchTerm && searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(game => 
        game.name.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.category.toLowerCase().includes(searchLower)
      )
    }

    // 分类过滤
    if (selectedCategory !== '全部') {
      // 正常的类别过滤
      filtered = filtered.filter(game => game.category === selectedCategory)
    }

    return filtered
  }, [searchTerm, selectedCategory, games])

  // 重置到第一页当搜索或分类改变时
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  // 计算当前页的游戏（使用useMemo优化）
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(filteredGamesMemo.length / gamesPerPage)
    const indexOfLastGame = currentPage * gamesPerPage
    const indexOfFirstGame = indexOfLastGame - gamesPerPage
    const currentGames = filteredGamesMemo.slice(indexOfFirstGame, indexOfLastGame)

    return {
      totalPages,
      currentGames
    }
  }, [filteredGamesMemo, currentPage, gamesPerPage])

  const { totalPages, currentGames } = paginationInfo

  // 热门游戏：过滤已发布并按下载量排序（使用useMemo优化）
  const trendingGames = useMemo(() => {
    return [...games]
      .filter(game => game.isPublished)
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 5)
  }, [games])

  return (
    <div className="relative z-10">
      {/* 导航栏 */}
      <Navbar 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        searchHistory={searchHistory}
        setSearchHistory={setSearchHistory}
      />

      {/* 英雄区域 */}
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-400 flex items-center justify-between error-message">
            <span className="text-sm sm:text-base">{error}</span>
            <button 
              onClick={loadGames}
              className="text-red-300 hover:text-red-200 transition-colors btn px-3 py-1"
            >
              重试
            </button>
          </div>
        )}

        {/* 分类选择 */}
        <div className="category-pills mb-8">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 游戏列表 */}
          <div className="flex-1">
            {isLoading ? (
              <div className="game-grid">
                {Array.from({ length: 6 }).map((_, index) => (
                  <GameCardSkeleton key={index} />
                ))}
              </div>
            ) : filteredGamesMemo.length === 0 ? (
              <div className="text-center py-16 sm:py-24">
                <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
                  <div className="w-24 sm:w-32 h-24 sm:h-32 bg-[#1E293B] rounded-3xl flex items-center justify-center">
                    <Gamepad2 className="w-12 sm:w-20 h-12 sm:h-20 text-muted" />
                  </div>
                </div>
                <p className="text-muted text-xl sm:text-2xl font-semibold mb-3">暂无游戏</p>
                <p className="text-muted/60 text-sm sm:text-lg">{searchTerm ? '没有找到匹配的游戏' : '敬请期待更多精彩游戏'}</p>
                {searchTerm && (
                  <button 
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('全部')
                    }}
                    className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand/90 transition-colors"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="game-grid">
                  {currentGames.map((game, index) => (
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
                
                {/* 分页控件 */}
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>

          {/* 热门排行榜 */}
          <aside className="sidebar w-full lg:w-80 shrink-0 order-first lg:order-last">
            <TrendingGames 
              games={trendingGames}
              isLoading={isLoading}
            />
          </aside>
        </div>
      </section>

      {/* 移动端底部导航栏 */}
      <MobileNav />
    </div>
  )
}

export default Home