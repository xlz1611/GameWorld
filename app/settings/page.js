'use client'

import { useTheme } from '../lib/ThemeContext'
import { Palette, Check, ArrowLeft, Settings as SettingsIcon, Heart, History, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Settings = () => {
  const { currentTheme, themes, changeTheme } = useTheme()
  const [games, setGames] = useState([])
  const [favorites, setFavorites] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])

  // 获取游戏数据
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/games')
        if (res.ok) {
          const data = await res.json()
          setGames(data)
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error)
      }
    }

    fetchGames()

    // 加载收藏
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // 加载下载历史
    const savedDownloadHistory = localStorage.getItem('downloadHistory')
    if (savedDownloadHistory) {
      setDownloadHistory(JSON.parse(savedDownloadHistory))
    }
  }, [])

  // 清除收藏
  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem('favorites')
  }

  // 清除下载历史
  const clearDownloadHistory = () => {
    setDownloadHistory([])
    localStorage.removeItem('downloadHistory')
  }

  // 从收藏中移除
  const removeFromFavorites = (gameId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== gameId)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  // 从下载历史中移除
  const removeFromDownloadHistory = (gameId) => {
    setDownloadHistory(prev => {
      const newHistory = prev.filter(id => id !== gameId)
      localStorage.setItem('downloadHistory', JSON.stringify(newHistory))
      return newHistory
    })
  }

  // 获取收藏的游戏
  const favoriteGames = games.filter(game => favorites.includes(game.id))

  // 获取下载历史中的游戏
  const historyGames = games.filter(game => downloadHistory.includes(game.id))

  return (
    <div className="relative z-10">
      <nav className="glass-navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-6 h-6 text-[#0F172A]" />
                    </div>
            <span className="text-xl font-bold">设置</span>
          </div>

          <Link href="/" className="inline-flex items-center text-brand hover:text-brand-hover transition-colors font-semibold text-lg group">
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            返回首页
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-6 h-6 text-[#0F172A]" />
                    </div>
            <div>
              <h1 className="text-2xl font-bold text-white">主题设置</h1>
              <p className="text-muted text-sm">选择您喜欢的颜色主题</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-300 group ${
                  currentTheme === theme.id
                    ? 'border-brand bg-[#0F172A]'
                    : 'border-[#334155] bg-[#1E293B] hover:border-brand/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl shadow-lg"
                    style={{ 
                      backgroundColor: theme.colors.brand,
                      borderRadius: theme.colors.radiusUi
                    }}
                  />
                  
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-bold text-white mb-1">{theme.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted mb-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.bgMain }}
                      />
                      <span>背景</span>
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: theme.colors.bgCard }}
                      />
                      <span>卡片</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <span>圆角:</span>
                      <span className="text-white">{theme.colors.radiusUi}</span>
                    </div>
                  </div>

                  {currentTheme === theme.id && (
                    <div className="absolute top-4 right-4 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-[#0F172A]" />
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-[#334155]">
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.brand }}
                      title="主色"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.bgMain }}
                      title="背景"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.bgCard }}
                      title="卡片"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg"
                      style={{ backgroundColor: theme.colors.borderColor }}
                      title="边框"
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glow-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">当前主题预览</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: themes[currentTheme].colors.bgCard, border: `2px solid ${themes[currentTheme].colors.borderColor}` }}>
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-lg"
                  style={{ backgroundColor: themes[currentTheme].colors.brand }}
                />
                <div>
                  <div className="font-bold" style={{ color: themes[currentTheme].colors.textMain }}>示例标题</div>
                  <div className="text-sm" style={{ color: themes[currentTheme].colors.textMuted }}>示例描述文本</div>
                </div>
              </div>
              <button 
                className="px-6 py-2 rounded-lg font-bold text-sm"
                style={{ 
                  backgroundColor: themes[currentTheme].colors.brand,
                  color: themes[currentTheme].colors.bgMain,
                  borderRadius: themes[currentTheme].colors.radiusUi
                }}
              >
                示例按钮
              </button>
            </div>
          </div>
        </div>

        {/* 收藏管理 */}
        <div className="glow-card p-8 mb-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#0F172A]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">我的收藏</h1>
                <p className="text-muted text-sm">管理您收藏的游戏</p>
              </div>
            </div>
            {favorites.length > 0 && (
              <button 
                onClick={clearFavorites}
                className="text-sm text-muted hover:text-brand transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>清空收藏</span>
              </button>
            )}
          </div>

          {favoriteGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-[#1E293B] rounded-3xl flex items-center justify-center">
                  <Heart className="w-12 h-12 text-muted" />
                </div>
              </div>
              <p className="text-muted text-lg font-semibold mb-2">暂无收藏</p>
              <p className="text-muted/60 text-sm">浏览游戏时点击收藏按钮添加</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#1E293B] rounded-xl overflow-hidden">
                      <img 
                        src={game.iconUrl} 
                        alt={game.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">
                        {game.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{game.category}</span>
                        <span>•</span>
                        <span>{game.version}</span>
                        <span>•</span>
                        <span>{game.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/games/${game.id}`}
                      className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors text-sm"
                    >
                      查看
                    </Link>
                    <button 
                      onClick={() => removeFromFavorites(game.id)}
                      className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors text-sm"
                    >
                      移除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 下载历史 */}
        <div className="glow-card p-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
                <History className="w-6 h-6 text-[#0F172A]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">下载历史</h1>
                <p className="text-muted text-sm">查看您的下载记录</p>
              </div>
            </div>
            {downloadHistory.length > 0 && (
              <button 
                onClick={clearDownloadHistory}
                className="text-sm text-muted hover:text-brand transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>清空历史</span>
              </button>
            )}
          </div>

          {historyGames.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-[#1E293B] rounded-3xl flex items-center justify-center">
                  <History className="w-12 h-12 text-muted" />
                </div>
              </div>
              <p className="text-muted text-lg font-semibold mb-2">暂无下载记录</p>
              <p className="text-muted/60 text-sm">下载游戏后会显示在这里</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyGames.map((game) => (
                <div key={game.id} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#1E293B] rounded-xl overflow-hidden">
                      <img 
                        src={game.iconUrl} 
                        alt={game.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-sm mb-1 truncate">
                        {game.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{game.category}</span>
                        <span>•</span>
                        <span>{game.version}</span>
                        <span>•</span>
                        <span>{game.fileSize}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/games/${game.id}`}
                      className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors text-sm"
                    >
                      查看
                    </Link>
                    <button 
                      onClick={() => removeFromDownloadHistory(game.id)}
                      className="px-4 py-2 rounded-lg bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors text-sm"
                    >
                      移除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings