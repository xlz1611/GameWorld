import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Gamepad2, Search, Trophy, User, LogOut } from 'lucide-react'
import { useUser } from '../../lib/UserContext'

/**
 * 移动端底部导航栏组件
 * 用于在移动端设备上显示底部导航栏，包含首页、游戏库、排行榜和设置的快捷访问
 * 
 * @returns {JSX.Element} 移动端底部导航栏组件
 */
const MobileNav = () => {
  const pathname = usePathname()

  const getInitialTab = () => {
    if (pathname === '/' || pathname === '') return 'home'
    if (pathname === '/games') return 'games'
    if (pathname === '/ranking') return 'ranking'
    if (pathname === '/library' || pathname === '/settings') return 'profile'
    return 'home'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, isLoggedIn, isAdmin, logout } = useUser()

  useEffect(() => {
    setActiveTab(getInitialTab())
  }, [pathname])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* 移动端底部导航栏 */}
      <div className="md:hidden mobile-fab">
        <div className="flex flex-row justify-around items-center w-full">
          <Link 
            href="/" 
            className={`flex flex-col items-center transition-colors w-1/4 ${activeTab === 'home' ? 'text-brand' : 'text-muted hover:text-brand'}`}
            onClick={() => setActiveTab('home')}
          >
            <Gamepad2 className="w-5 h-5 mb-1" strokeWidth={1.5} />
            <span className="text-xs font-medium">首页</span>
          </Link>
          <Link 
            href="/games" 
            className={`flex flex-col items-center transition-colors w-1/4 ${activeTab === 'games' ? 'text-brand' : 'text-muted hover:text-brand'}`}
            onClick={() => setActiveTab('games')}
          >
            <Search className="w-5 h-5 mb-1" strokeWidth={1.5} />
            <span className="text-xs font-medium">游戏库</span>
          </Link>
          <Link 
            href="/ranking" 
            className={`flex flex-col items-center transition-colors w-1/4 ${activeTab === 'ranking' ? 'text-brand' : 'text-muted hover:text-brand'}`}
            onClick={() => setActiveTab('ranking')}
          >
            <Trophy className="w-5 h-5 mb-1" strokeWidth={1.5} />
            <span className="text-xs font-medium">排行榜</span>
          </Link>
          <div className="relative w-1/4">
            <button 
              className="flex flex-col items-center text-muted hover:text-brand transition-colors w-full"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User className="w-5 h-5 mb-1" strokeWidth={1.5} />
              <span className="text-xs font-medium">我的</span>
            </button>
            {isUserMenuOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-[#2a2d31] border border-[#444] rounded-md shadow-lg z-50 w-48">
                {isLoggedIn ? (
                  <div className="py-2">
                    <div className="px-4 py-2 text-sm text-white/60 border-b border-[#444]">
                      {user?.email || user?.name}
                    </div>
                    <Link href="/library" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">我的库</Link>
                    <Link href="/community" className="block px-4 py-2 text-white hover:bg-[#36393e] transition-colors">讨论区</Link>
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
        </div>
      </div>
    </>
  )
}

export default MobileNav