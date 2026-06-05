import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, Gamepad2, Search, User, Bell, ChevronDown, LogOut, X } from 'lucide-react'
import ThemeSwitcher from '../ThemeSwitcher'
import { useUser } from '../../lib/UserContext'

/**
 * 导航栏组件 - Steam风格
 * 用于在网站顶部显示导航菜单、搜索框和用户选项
 * 
 * @param {string} searchTerm - 当前搜索词
 * @param {Function} setSearchTerm - 设置搜索词的函数
 * @param {Function} handleSearch - 处理搜索的函数
 * @param {Array} searchHistory - 搜索历史记录数组
 * @param {Function} setSearchHistory - 设置搜索历史记录的函数
 * @returns {JSX.Element} 导航栏组件
 */
const Navbar = ({ searchTerm, setSearchTerm, handleSearch, searchHistory, setSearchHistory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false)
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications')
      return savedNotifications ? JSON.parse(savedNotifications) : []
    } catch {
      return []
    }
  })
  const { user, isLoggedIn, isAdmin, logout } = useUser()

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // 通知操作
  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === id) {
        return { ...notification, read: true }
      }
      return notification
    }))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // 处理登出
  const handleLogout = () => {
    logout()
    setIsUserDropdownOpen(false)
  }

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  // 从搜索历史中删除项
  const removeSearchHistoryItem = (term) => {
    setSearchHistory(prev => prev.filter(item => item !== term))
  }

  return (
    <nav className="bg-[#171a21] border-b border-[#2e3136] py-2 px-4 md:px-6" aria-label="主导航">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* 左侧导航 */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-brand rounded-md flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#0F172A]" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <span className="text-white font-bold text-lg">游戏世界</span>
          </Link>

          {/* 商店下拉菜单 - 仅在中屏幕及以上显示 */}
          <div className="relative hidden md:block">
            <button 
              className="flex items-center space-x-1 text-white hover:text-brand transition-colors px-3 py-2"
              onClick={() => {
                setIsStoreDropdownOpen(!isStoreDropdownOpen)
                // 如果商店下拉菜单要打开，就关闭社区下拉菜单
                if (!isStoreDropdownOpen) {
                  setIsCommunityDropdownOpen(false)
                }
              }}
              aria-expanded={isStoreDropdownOpen}
              aria-controls="store-dropdown"
            >
              <span>商店</span>
              <ChevronDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            {isStoreDropdownOpen && (
              <div id="store-dropdown" className="absolute top-full left-0 mt-1 bg-[#2a2d31] border border-[#444] rounded-md shadow-lg z-50 w-48">
                <div className="py-2">
                  <Link href="/" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">首页</Link>
                  <Link href="/games" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">浏览游戏</Link>
                  <Link href="/ranking" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">热销商品</Link>
                </div>
              </div>
            )}
          </div>

          {/* 社区下拉菜单 - 仅在中屏幕及以上显示 */}
          <div className="relative hidden md:block">
            <button 
              className="flex items-center space-x-1 text-white hover:text-brand transition-colors px-3 py-2"
              onClick={() => {
                setIsCommunityDropdownOpen(!isCommunityDropdownOpen)
                // 如果社区下拉菜单要打开，就关闭商店下拉菜单
                if (!isCommunityDropdownOpen) {
                  setIsStoreDropdownOpen(false)
                }
              }}
              aria-expanded={isCommunityDropdownOpen}
              aria-controls="community-dropdown"
            >
              <span>社区</span>
              <ChevronDown className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            {isCommunityDropdownOpen && (
              <div id="community-dropdown" className="absolute top-full left-0 mt-1 bg-[#2a2d31] border border-[#444] rounded-md shadow-lg z-50 w-48">
                <div className="py-2">
                  <Link href="/ranking" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">排行榜</Link>
                  <Link href="/community" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">讨论区</Link>
                </div>
              </div>
            )}
          </div>

          {/* 我的库 - 仅在中屏幕及以上显示 */}
          <Link href="/library" className="hidden md:block text-white hover:text-brand transition-colors px-3 py-2">我的库</Link>
        </div>

        {/* 右侧导航 */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* 搜索框 - 仅在中屏幕及以上显示 */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="搜索游戏..."
              className="bg-[#2a2d31] border border-[#444] rounded px-3 py-1.5 text-sm text-white placeholder-gray-400 w-48 focus:outline-none focus:border-brand"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              aria-label="搜索游戏"
            />
          </div>

          {/* 通知 */}
          <div className="relative">
            <button 
              className="text-white hover:text-brand transition-colors p-2"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-expanded={isNotificationsOpen}
              aria-controls="notifications-dropdown"
            >
              <Bell className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div id="notifications-dropdown" className="absolute top-full right-0 mt-1 bg-[#2a2d31] border border-[#444] rounded-md shadow-lg z-50 w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-[#444]">
                  <h3 className="text-white font-semibold">通知</h3>
                  {notifications.length > 0 && (
                    <button 
                      className="text-white/60 hover:text-white text-xs"
                      onClick={clearNotifications}
                    >
                      清除全部
                    </button>
                  )}
                </div>
                {notifications.length > 0 ? (
                  <div className="py-2">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-[#444] cursor-pointer transition-colors ${notification.read ? 'hover:bg-[#36393e]' : 'bg-[#36393e]'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-white font-medium">{notification.title}</h4>
                          <span className="text-white/40 text-xs">{notification.time}</span>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60">没有通知</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 用户菜单 */}
          <div className="relative">
            <button 
              className="flex items-center space-x-1 text-white hover:text-brand transition-colors px-3 py-2"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              aria-expanded={isUserDropdownOpen}
              aria-controls="user-dropdown"
            >
              <User className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
              <span className="hidden md:inline">{isLoggedIn ? user?.name || '用户' : '登录'}</span>
              <ChevronDown className="w-4 h-4 hidden md:block" strokeWidth={1.5} aria-hidden="true" />
            </button>
            {isUserDropdownOpen && (
              <div id="user-dropdown" className="absolute top-full right-0 mt-1 bg-[#2a2d31] border border-[#444] rounded-md shadow-lg z-50 w-48">
                {isLoggedIn ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-white/60 border-b border-[#444]">
                      {user?.email || user?.name}
                    </div>
                    <Link href="/settings" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">账户设置</Link>
                    {isAdmin && (
                      <Link href="/admin" className="block px-4 py-2 text-brand hover:bg-[#36393e] transition-colors font-semibold">管理后台</Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white hover:bg-[#36393e] transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>登出</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-2">
                    <Link href="/auth/login" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">登录</Link>
                    <Link href="/auth/register" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">注册</Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden p-2 text-white hover:text-brand transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="切换菜单"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden mt-2 space-y-4 py-4 bg-[#1b2838] border-t border-[#2e3136]">
          <div className="px-4">
            <input
              type="text"
              placeholder="搜索游戏..."
              className="w-full bg-[#2a2d31] border border-[#444] rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              aria-label="搜索游戏"
            />
          </div>
          <div className="flex flex-col space-y-2 px-4">
            <Link href="/" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">首页</Link>
            <Link href="/games" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">游戏库</Link>
            <Link href="/ranking" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">排行榜</Link>
            <Link href="/library" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">我的库</Link>
            <Link href="/community" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">社区</Link>
            {isLoggedIn ? (
              <>
                <Link href="/settings" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">设置</Link>
                {isAdmin && (
                  <Link href="/admin" className="block px-4 py-2 text-brand hover:bg-[#2a475e] transition-colors font-semibold">管理后台</Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-[#2a475e] transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">登录</Link>
                <Link href="/auth/register" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">注册</Link>
                <Link href="/settings" className="block px-4 py-2 text-white hover:bg-[#2a475e] transition-colors">设置</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar