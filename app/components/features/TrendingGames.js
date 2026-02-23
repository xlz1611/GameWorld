import Link from 'next/link'
import Image from 'next/image'
import { Flame, Star, Download, Gamepad2 } from 'lucide-react'
import OptimizedImage from '../ui/OptimizedImage'

/**
 * 热门游戏排行榜组件
 * 用于在首页侧边栏显示热门游戏排行榜，按下载量排序
 * 
 * @param {Array} games - 游戏数据数组
 * @param {boolean} isLoading - 是否正在加载数据
 * @returns {JSX.Element} 热门游戏排行榜组件
 */
const TrendingGames = ({ games, isLoading }) => {
  // 确保games是数组
  const safeGames = Array.isArray(games) ? games : []

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Flame className="w-5 h-5 text-brand" />
        热门排行榜
      </h3>
      
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-[#1E293B] animate-pulse">
              <div className="relative">
                <div className="w-16 h-16 bg-[#0F172A] rounded-xl animate-pulse"></div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-brand text-[#0F172A] rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-[#0F172A] animate-pulse rounded mb-1 w-3/4"></div>
                <div className="h-3 bg-[#0F172A] animate-pulse rounded w-1/2"></div>
              </div>
              <div className="w-5 h-5 bg-[#0F172A] rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : safeGames.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-[#1E293B]">
          <Gamepad2 className="w-12 h-12 text-muted mx-auto mb-4" />
          <p className="text-muted text-sm">暂无热门游戏</p>
        </div>
      ) : (
        <div className="space-y-4">
          {safeGames.map((game, index) => {
            // 确保游戏数据完整
            if (!game || typeof game !== 'object' || !game.id) {
              return null
            }

            const { id, name = '未知游戏', iconUrl = '', category = '其他' } = game

            return (
              <Link 
                key={id} 
                href={`/games/${id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#0F172A] transition-colors group"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-[#0F172A] rounded-xl relative overflow-hidden">
                    {iconUrl ? (
                      <OptimizedImage 
                        src={iconUrl} 
                        alt={name} 
                        fill
                        loading={index < 2 ? "eager" : "lazy"}
                        priority={index < 2}
                        sizes="(max-width: 640px) 60px, (max-width: 1024px) 64px, 64px"
                        quality={80}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1E293B] flex items-center justify-center">
                        <Gamepad2 className="w-8 h-8 text-muted" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-brand text-[#0F172A] rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-brand transition-colors">
                    {name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-brand fill-brand" strokeWidth={1.5} />
                      <span>4.5</span>
                    </div>
                    <span>•</span>
                    <span>{category}</span>
                  </div>
                </div>

                <Download className="w-5 h-5 text-muted group-hover:text-brand transition-colors" strokeWidth={1.5} />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TrendingGames