import Link from 'next/link'
import Image from 'next/image'
import { Heart, HeartOff, Download, Star, Gamepad2 } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

/**
 * 游戏卡片组件
 * 用于在游戏列表中显示单个游戏的信息和操作按钮
 * 
 * @param {Object} game - 游戏数据对象
 * @param {string} game.id - 游戏ID
 * @param {string} game.name - 游戏名称
 * @param {string} game.iconUrl - 游戏图标URL
 * @param {string} game.category - 游戏分类
 * @param {string} game.version - 游戏版本
 * @param {string} game.fileSize - 游戏文件大小
 * @param {number} index - 游戏在列表中的索引，用于动画延迟
 * @param {Function} isFavorite - 检查游戏是否已收藏的函数
 * @param {Function} toggleFavorite - 切换游戏收藏状态的函数
 * @param {Function} addToDownloadHistory - 添加游戏到下载历史的函数
 * @returns {JSX.Element} 游戏卡片组件
 */
const GameCard = ({ game, index, isFavorite, toggleFavorite, addToDownloadHistory }) => {
  // 确保游戏数据完整
  if (!game || typeof game !== 'object') {
    return null
  }

  const showToast = (message, type = 'success') => {
    if (typeof window !== 'undefined' && window.showToast) {
      window.showToast(message, type)
    }
  }

  const handleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (toggleFavorite) {
      toggleFavorite(game.id)
      const isFav = isFavorite && isFavorite(game.id)
      showToast(isFav ? '已取消收藏' : '已添加到收藏', 'success')
    }
  }

  const handleDownload = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (addToDownloadHistory) {
      addToDownloadHistory(game)
      showToast('开始下载游戏', 'info')
    }
  }

  const { id, name = '未知游戏', iconUrl = '', category = '其他', version = '1.0.0', fileSize = '未知大小' } = game

  // 处理无效的游戏ID
  if (!id) {
    return null
  }

  return (
    <Link 
      key={id} 
      href={`/games/${id}`} 
      className="glow-card stagger-enter focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`查看游戏 ${name} 的详情`}
    >
      <div className="flex flex-col">
        <div className="relative mb-4 overflow-hidden rounded-xl">
          <div className="aspect-square bg-[#0F172A] relative">
            {iconUrl ? (
              <OptimizedImage 
                src={iconUrl} 
                alt={name} 
                fill
                loading={index < 3 ? "eager" : "lazy"}
                priority={index < 3}
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 120px, 150px"
                quality={80}
              />
            ) : (
              <div className="w-full h-full bg-[#1E293B] flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-muted" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-brand text-[#0F172A] px-3 py-1 rounded-full text-xs font-bold">
            {category}
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-2 text-white line-clamp-1">{name}</h3>
        
        <div className="flex items-center justify-between mb-3 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-brand fill-brand" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-semibold text-white">4.5</span>
          </div>
          <span className="text-muted text-xs">{version}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted mb-4">
          <span className="text-xs">{fileSize}</span>
          <span className="text-brand font-semibold text-xs">免费</span>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleFavorite}
            className={`flex-1 py-2 rounded-lg transition-colors ${isFavorite && isFavorite(id) ? 'bg-brand text-[#0F172A]' : 'bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A]'} focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]`}
            aria-label={isFavorite && isFavorite(id) ? `取消收藏游戏 ${name}` : `收藏游戏 ${name}`}
          >
            {isFavorite && isFavorite(id) ? (
              <>
                <Heart className="w-4 h-4 mr-2 fill-current" strokeWidth={1.5} aria-hidden="true" />
                <span>已收藏</span>
              </>
            ) : (
              <>
                <HeartOff className="w-4 h-4 mr-2" strokeWidth={1.5} aria-hidden="true" />
                <span>收藏</span>
              </>
            )}
          </button>
          <button 
            onClick={handleDownload}
            className="flex-1 download-btn flex items-center justify-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-[#0F172A]"
            aria-label={`下载游戏 ${name}`}
          >
            <Download className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            <span>下载</span>
          </button>
        </div>
      </div>
    </Link>
  )
}

export default GameCard