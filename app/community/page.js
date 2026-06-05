'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { MessageSquare, TrendingUp, Star, Clock, Search, Gamepad2, Tag, Download } from 'lucide-react'
import { useDebounce } from '../lib/useDebounce'

const Navbar = dynamic(() => import('../components/layout/Navbar'), { ssr: false })

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [topGames, setTopGames] = useState([])
  const [hotTags, setHotTags] = useState([])
  const debouncedSearch = useDebounce(searchTerm, 300)

  useEffect(() => {
    fetchComments()
    fetchTopGames()
  }, [])

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchComments(debouncedSearch.trim())
    } else {
      fetchComments()
    }
  }, [debouncedSearch])

  const fetchComments = async (search = '') => {
    setIsLoading(true)
    try {
      const url = search
        ? `/api/comments?search=${encodeURIComponent(search)}`
        : '/api/comments'
      const res = await fetch(url)
      const data = await res.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error('获取评论动态失败:', error)
      setComments([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTopGames = async () => {
    try {
      const res = await fetch('/api/games')
      if (res.ok) {
        const games = await res.json()
        const sorted = [...games].sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        setTopGames(sorted.slice(0, 5))

        const tagMap = {}
        games.forEach(game => {
          if (game.category) {
            tagMap[game.category] = (tagMap[game.category] || 0) + 1
          }
        })
        const tags = Object.entries(tagMap)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }))
        setHotTags(tags)
      } else {
        setTopGames([])
        setHotTags([])
      }
    } catch (error) {
      console.error('获取游戏数据失败:', error)
      setTopGames([])
      setHotTags([])
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term.trim()) {
      fetchComments(term.trim())
    } else {
      fetchComments()
    }
  }

  const handleLocalSearch = () => {
    handleSearch(searchTerm)
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 30) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    )
  }

  const filteredComments = debouncedSearch.trim()
    ? comments.filter(c =>
        c.content?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        c.game?.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : comments

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
            <MessageSquare className="w-8 h-8 text-brand" />
            <h1 className="text-4xl font-bold text-white">社区动态</h1>
          </div>
          <p className="text-white text-lg max-w-2xl">
            发现玩家们的真实评价，了解热门游戏动态，找到你的下一款心仪游戏。
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLocalSearch()}
                      placeholder="搜索评论内容或游戏名..."
                      className="w-full bg-[#1E293B] border border-[#334155] rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleLocalSearch}
                    className="px-6 py-3 bg-brand hover:bg-brand-hover text-[#0F172A] font-bold rounded-xl transition-colors"
                  >
                    搜索
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-[#334155] rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-[#334155] rounded w-1/3 mb-2" />
                          <div className="h-3 bg-[#334155] rounded w-1/4" />
                        </div>
                      </div>
                      <div className="h-4 bg-[#334155] rounded w-full mb-2" />
                      <div className="h-4 bg-[#334155] rounded w-3/4" />
                    </div>
                  ))
                ) : filteredComments.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-[#1E293B] rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-12 h-12 text-white/30" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">暂无评论动态</h3>
                    <p className="text-white/60">
                      {searchTerm ? `没有找到与"${searchTerm}"相关的评论` : '还没有玩家发表评论，去游戏详情页留下第一条评论吧'}
                    </p>
                    {searchTerm && (
                      <button
                        onClick={() => { setSearchTerm(''); fetchComments() }}
                        className="mt-4 px-4 py-2 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand/90 transition-colors"
                      >
                        清除搜索
                      </button>
                    )}
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div key={comment.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-brand/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={comment.user?.avatar || '/default-avatar.svg'}
                          alt={comment.user?.name || '用户'}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#334155] flex-shrink-0"
                          onError={(e) => { e.target.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect fill="%23334155" width="40" height="40"/><text x="20" y="26" text-anchor="middle" fill="%2394a3b8" font-size="16">' + (comment.user?.name?.[0] || '?') + '</text></svg>') }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-white">{comment.user?.name || '匿名用户'}</span>
                            <span className="text-white/40">评论了</span>
                            <Link
                              href={`/games/${comment.gameId}`}
                              className="text-brand hover:underline font-medium"
                            >
                              {comment.game?.name || '未知游戏'}
                            </Link>
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            {renderStars(comment.rating)}
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <Clock className="w-3 h-3" />
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>

                          <p className="text-white/80 mb-3 leading-relaxed">{comment.content}</p>

                          {comment.game?.category && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#334155] rounded-full text-xs text-white/60">
                              <Tag className="w-3 h-3" />
                              {comment.game.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {!isLoading && filteredComments.length > 0 && (
                <div className="mt-6 text-center text-white/40 text-sm">
                  共 {filteredComments.length} 条评论动态
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand" />
                  热门游戏
                </h2>
                {topGames.length === 0 ? (
                  <p className="text-white/40 text-sm">暂无数据</p>
                ) : (
                  <div className="space-y-3">
                    {topGames.map((game, index) => (
                      <Link
                        key={game.id}
                        href={`/games/${game.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#334155] transition-colors group"
                      >
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-300 text-black' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-[#334155] text-white/60'
                        }`}>
                          {index + 1}
                        </span>
                        <img
                          src={game.iconUrl}
                          alt={game.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate group-hover:text-brand transition-colors">{game.name}</p>
                          <div className="flex items-center gap-1 text-white/40 text-xs">
                            <Download className="w-3 h-3" />
                            {game.downloadCount || 0}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-brand" />
                  热门标签
                </h2>
                {hotTags.length === 0 ? (
                  <p className="text-white/40 text-sm">暂无标签</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {hotTags.map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/?category=${encodeURIComponent(tag.name)}`}
                        className="px-3 py-1.5 bg-[#334155] hover:bg-brand hover:text-[#0F172A] transition-colors rounded-full text-sm text-white flex items-center gap-1.5"
                      >
                        {tag.name}
                        <span className="text-xs opacity-60">({tag.count})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-brand" />
                  快捷入口
                </h2>
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="block p-3 hover:bg-[#334155] rounded-lg text-white transition-colors text-sm"
                  >
                    🎮 浏览全部游戏
                  </Link>
                  <Link
                    href="/library"
                    className="block p-3 hover:bg-[#334155] rounded-lg text-white transition-colors text-sm"
                  >
                    📚 我的游戏库
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CommunityPage
