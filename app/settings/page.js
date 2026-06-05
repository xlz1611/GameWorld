'use client'

import { useTheme } from '../lib/ThemeContext'
import { useUser } from '../lib/UserContext'
import { Palette, Check, ArrowLeft, Settings as SettingsIcon, Heart, History, Trash2, User, Camera, Save, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Settings = () => {
  const { currentTheme, themes, changeTheme } = useTheme()
  const { user, isLoggedIn, updateUser } = useUser()
  const [games, setGames] = useState([])
  const [favorites, setFavorites] = useState([])
  const [downloadHistory, setDownloadHistory] = useState([])
  const [userName, setUserName] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')

  // 预设头像
  const presetAvatars = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%201&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%202&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%203&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%204&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%205&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20profile%20picture%206&image_size=square'
  ]

  // 选择预设头像
  const selectPresetAvatar = (avatarUrl) => {
    setAvatar(avatarUrl)
  }

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
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch {
        localStorage.removeItem('favorites')
      }
    }

    const savedDownloadHistory = localStorage.getItem('downloadHistory')
    if (savedDownloadHistory) {
      try {
        setDownloadHistory(JSON.parse(savedDownloadHistory))
      } catch {
        localStorage.removeItem('downloadHistory')
      }
    }
  }, [])

  // 当用户信息变化时更新状态
  useEffect(() => {
    if (user) {
      setUserName(user.name || '')
      setAvatar(user.avatar || null)
    }
  }, [user])

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

  // 处理头像上传
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // 这里可以添加文件类型和大小验证
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatar(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // 保存用户信息
  const saveUserInfo = async () => {
    if (!userName.trim()) {
      setMessage('用户名不能为空')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setMessage('登录已过期，请重新登录')
        return
      }

      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: userName,
          avatar: avatar
        })
      })

      const data = await res.json()

      if (res.ok) {
        const updatedUser = {
          ...user,
          name: data.name,
          avatar: data.avatar
        }

        if (updateUser) {
          updateUser(updatedUser)
        }

        setIsEditing(false)
        setMessage('个人信息更新成功')
      } else {
        setMessage(data.error || '更新失败，请稍后重试')
      }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      setMessage('网络错误，请稍后重试')
    }

    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  // 取消编辑
  const cancelEdit = () => {
    setUserName(user?.name || '')
    setAvatar(user?.avatar || null)
    setIsEditing(false)
    setMessage('')
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
        {/* 用户个人信息设置 */}
        <div className="glow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#0F172A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">个人信息</h1>
              <p className="text-white text-sm">修改您的用户名和头像</p>
            </div>
          </div>

          {isLoggedIn ? (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* 头像部分 */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#334155]">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt="用户头像" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1E293B] flex items-center justify-center">
                        <User className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-brand rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-hover transition-colors">
                      <Camera className="w-5 h-5 text-[#0F172A]" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>
                {isEditing && (
                  <div className="w-full">
                    <p className="text-sm text-white/60 text-center mb-4">选择头像</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {presetAvatars.map((presetAvatar, index) => (
                        <div 
                          key={index} 
                          className={`w-12 h-12 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${avatar === presetAvatar ? 'border-brand scale-110' : 'border-[#334155] hover:border-brand'}`}
                          onClick={() => selectPresetAvatar(presetAvatar)}
                        >
                          <img 
                            src={presetAvatar} 
                            alt={`预设头像 ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-white/60 text-center mt-4">或点击上方上传自定义头像</p>
                  </div>
                )}
              </div>

              {/* 个人信息部分 */}
              <div className="flex-1 w-full">
                {message && (
                  <div className={`mb-4 p-3 rounded-lg ${message.includes('成功') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {message}
                  </div>
                )}
                
                {/* 编辑按钮 */}
                {!isEditing && (
                  <div className="mb-6 flex justify-end">
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>编辑个人信息</span>
                    </button>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">用户名</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-[#1E293B] border-2 border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                        placeholder="请输入用户名"
                      />
                    ) : (
                      <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-lg">
                        <span className="text-white">{user?.name || '未设置'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white">邮箱</label>
                    <div className="p-4 bg-[#1E293B] border border-[#334155] rounded-lg">
                      <span className="text-white">{user?.email || '未设置'}</span>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex space-x-4 pt-4">
                      <button 
                        onClick={saveUserInfo}
                        className="flex-1 px-4 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>保存</span>
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="flex-1 px-4 py-3 bg-[#1E293B] border border-[#334155] text-white rounded-lg font-semibold hover:bg-[#0F172A] transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        <span>取消</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-24 h-24 bg-[#1E293B] rounded-3xl flex items-center justify-center">
                  <User className="w-12 h-12 text-white/50" />
                </div>
              </div>
              <p className="text-white text-lg font-semibold mb-4">请先登录</p>
              <p className="text-white/60 text-sm mb-6">登录后可以修改个人信息</p>
              <Link 
                href="/auth/login"
                className="px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors"
              >
                去登录
              </Link>
            </div>
          )}
        </div>

        <div className="glow-card p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center">
                      <SettingsIcon className="w-6 h-6 text-[#0F172A]" />
                    </div>
            <div>
              <h1 className="text-2xl font-bold text-white">主题设置</h1>
              <p className="text-white text-sm">选择您喜欢的颜色主题</p>
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
                    <div className="flex items-center gap-2 text-xs text-white mb-3">
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
                    
                    <div className="flex items-center gap-2 text-xs text-white">
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
                  <Heart className="w-12 h-12 text-white" />
                </div>
              </div>
              <p className="text-white text-lg font-semibold mb-2">暂无收藏</p>
              <p className="text-white/60 text-sm">浏览游戏时点击收藏按钮添加</p>
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