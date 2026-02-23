import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, Gamepad2, Search, Settings, Trophy, Heart, History } from 'lucide-react'
import ThemeSwitcher from '../ThemeSwitcher'

/**
 * 导航栏组件
 * 用于在网站顶部显示导航菜单、搜索框和主题切换器
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

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  // 从搜索历史中删除项
  const removeSearchHistoryItem = (term) => {
    setSearchHistory(prev => prev.filter(item => item !== term))
  }

  return (
    <nav className="glass-navbar px-6 py-4" aria-label="主导航">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-[#0F172A]" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <span className="text-xl font-bold" aria-label="GameHub">GameHub</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-brand font-semibold focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]" aria-current="page">首页</Link>
          <Link href="/games" className="text-white hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">游戏库</Link>
          <Link href="/ranking" className="text-white hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">排行榜</Link>
          <Link href="/settings" className="text-white hover:text-brand transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">设置</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeSwitcher isDropdown={true} />
          <div className="relative">
            <label htmlFor="search" className="sr-only">搜索游戏</label>
            <input
              id="search"
              type="text"
              placeholder="搜索游戏..."
              className="search-expand bg-[#1E293B] border-2 border-[#334155] rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
              aria-label="搜索游戏"
              aria-expanded={searchHistory.length > 0}
              aria-controls="search-history"
            />
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
              onClick={() => handleSearch(searchTerm)}
              aria-label="提交搜索"
            >
              <Search className="w-4 h-4 text-gray-400 hover:text-brand transition-colors" strokeWidth={1.5} aria-hidden="true" />
            </button>
            
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <div id="search-history" className="absolute top-full left-0 right-0 mt-2 bg-[#1E293B] border-2 border-[#334155] rounded-xl shadow-2xl z-50">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-white">搜索历史</h3>
                    <button 
                      className="text-xs text-muted hover:text-brand transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
                      onClick={clearSearchHistory}
                      aria-label="清除搜索历史"
                    >
                      清除
                    </button>
                  </div>
                  <div className="space-y-2">
                    {searchHistory.map((term, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-[#0F172A] rounded-lg transition-colors">
                        <button 
                          className="flex items-center gap-2 text-sm text-white hover:text-brand transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
                          onClick={() => handleSearch(term)}
                          aria-label={`搜索 ${term}`}
                        >
                          <Search className="w-4 h-4 text-muted" strokeWidth={1.5} aria-hidden="true" />
                          <span>{term}</span>
                        </button>
                        <button 
                          className="text-muted hover:text-brand transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
                          onClick={() => removeSearchHistoryItem(term)}
                          aria-label={`删除搜索历史项 ${term}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          className="md:hidden p-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="切换菜单"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <Menu className="w-6 h-6" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden mt-4 space-y-4 py-4">
          <label htmlFor="mobile-search" className="sr-only">搜索游戏</label>
          <input
            id="mobile-search"
            type="text"
            placeholder="搜索游戏..."
            className="w-full bg-[#1E293B] border-2 border-[#334155] rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A] text-white placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
            aria-label="搜索游戏"
          />
          <div className="flex flex-col space-y-4 px-4">
            <Link href="/" className="text-brand font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]" aria-current="page">首页</Link>
            <Link href="/games" className="text-white hover:text-brand transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">游戏库</Link>
            <Link href="/ranking" className="text-white hover:text-brand transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">排行榜</Link>
            <Link href="/settings" className="text-white hover:text-brand transition-colors py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]">设置</Link>
          </div>
          <div className="px-4">
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar