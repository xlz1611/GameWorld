import { Search, Gamepad2, Zap, Trophy, Flame } from 'lucide-react'

/**
 * 英雄区域组件
 * 用于在网站首页显示顶部的英雄区域，包含网站标题、搜索框和特色功能介绍
 * 
 * @param {string} searchTerm - 当前搜索词
 * @param {Function} setSearchTerm - 设置搜索词的函数
 * @param {Function} handleSearch - 处理搜索的函数
 * @returns {JSX.Element} 英雄区域组件
 */
const Hero = ({ searchTerm, setSearchTerm, handleSearch }) => {
  return (
    <section className="hero-section">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand rounded-2xl mb-6 shadow-lg">
            <Gamepad2 className="w-12 h-12 text-[#0F172A]" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            探索超过 <span className="text-brand">10,000</span> 款精品安卓游戏
          </h1>
          <p className="text-muted text-xl">发现、下载、畅玩 - 您的专属游戏天堂</p>
        </div>

        <div className="hero-search">
          <input
            type="text"
            placeholder="搜索您喜欢的游戏..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
          />
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-brand" strokeWidth={1.5} />
        </div>

        <div className="flex justify-center gap-8 mt-8">
          <div className="flex items-center gap-2 text-muted">
            <Zap className="w-5 h-5 text-brand" strokeWidth={1.5} />
            <span className="text-sm font-medium">极速下载</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Trophy className="w-5 h-5 text-brand" />
            <span className="text-sm font-medium">官方正版</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <Flame className="w-5 h-5 text-brand" strokeWidth={1.5} />
            <span className="text-sm font-medium">热门推荐</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero