'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Download, Star, Gamepad2, Package, Calendar, Shield, Zap, Users, TrendingUp, Smartphone, Lock } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import GameReviews from '../../components/features/GameReviews'
import { useUser } from '../../lib/UserContext'

const Navbar = dynamic(() => import('../../components/layout/Navbar'), { ssr: false })

const formatDownloadCount = (count) => {
  if (!count) return '0'
  if (count >= 10000) return `${(count / 10000).toFixed(1)}万`
  return count.toLocaleString()
}

const getSystemRequirement = (fileSize) => {
  if (!fileSize) return 'Android 8.0+'
  const m = fileSize.match(/([\d.]+)\s*(MB|GB|KB|mb|gb|kb)/i)
  if (!m) return 'Android 8.0+'
  const v = parseFloat(m[1])
  const u = m[2].toUpperCase()
  const mb = u === 'GB' ? v * 1024 : u === 'KB' ? v / 1024 : v
  return mb < 100 ? 'Android 5.0+' : 'Android 8.0+'
}

const categoryFeatures = {
  '动作游戏': [
    { title: '极致操作', desc: '流畅的战斗操作体验', icon: '⚔️' },
    { title: '华丽特效', desc: '震撼的视觉战斗效果', icon: '✨' },
    { title: '多样武器', desc: '丰富的武器装备系统', icon: '🗡️' },
    { title: 'Boss挑战', desc: '史诗级Boss战斗体验', icon: '👹' }
  ],
  '角色扮演': [
    { title: '深度剧情', desc: '沉浸式故事体验', icon: '📖' },
    { title: '角色养成', desc: '自由的角色成长路线', icon: '🌟' },
    { title: '装备收集', desc: '海量装备自由搭配', icon: '💎' },
    { title: '开放世界', desc: '广阔的探索空间', icon: '🗺️' }
  ],
  '休闲益智': [
    { title: '轻松上手', desc: '简单易学的操作方式', icon: '🎯' },
    { title: '趣味关卡', desc: '精心设计的益智关卡', icon: '🧩' },
    { title: '休闲放松', desc: '适合碎片时间游玩', icon: '☕' },
    { title: '脑力挑战', desc: '锻炼逻辑思维能力', icon: '🧠' }
  ],
  '策略游戏': [
    { title: '策略深度', desc: '丰富的策略组合可能', icon: '♟️' },
    { title: '资源管理', desc: '精妙的资源调配系统', icon: '📊' },
    { title: '联盟对抗', desc: '多人联盟战争玩法', icon: '⚔️' },
    { title: '领土扩张', desc: '建设发展你的帝国', icon: '🏰' }
  ],
  '体育竞技': [
    { title: '真实竞技', desc: '拟真的体育竞技体验', icon: '🏆' },
    { title: '多人对战', desc: '实时在线竞技PK', icon: '🥊' },
    { title: '球员养成', desc: '打造你的梦之队', icon: '⭐' },
    { title: '赛季更新', desc: '持续更新的赛季内容', icon: '📅' }
  ],
  '模拟经营': [
    { title: '自由建造', desc: '打造你的梦想世界', icon: '🏗️' },
    { title: '经营策略', desc: '智慧的经营决策', icon: '💼' },
    { title: '社交互动', desc: '与其他玩家合作交流', icon: '🤝' },
    { title: '持续发展', desc: '不断扩张你的版图', icon: '📈' }
  ],
  '冒险解谜': [
    { title: '神秘剧情', desc: '扣人心弦的故事线', icon: '🔮' },
    { title: '烧脑谜题', desc: '层层递进的解谜挑战', icon: '🔍' },
    { title: '探索发现', desc: '隐藏的宝藏和秘密', icon: '🗝️' },
    { title: '氛围营造', desc: '沉浸式的游戏氛围', icon: '🌙' }
  ]
}

const defaultFeatures = [
  { title: '优质体验', desc: '精心打磨的游戏品质', icon: '✨' },
  { title: '丰富内容', desc: '海量游戏内容等你探索', icon: '🎮' },
  { title: '持续更新', desc: '定期更新保持新鲜感', icon: '🔄' },
  { title: '社区互动', desc: '活跃的玩家社区', icon: '💬' }
]

const GameDetail = ({ params }) => {
  const { id } = params
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloadStatus, setDownloadStatus] = useState('idle')
  const { isLoggedIn } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchHistory, setSearchHistory] = useState([])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${id}`)
        if (res.ok) {
          const data = await res.json()
          setGame(data)
          
          if (typeof window !== 'undefined') {
            document.title = `${data.name} | GameHub`
          }
        }
      } catch (error) {
        console.error('获取游戏详情失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id])

  const handleDownload = async () => {
    // 检查用户是否登录
    if (!isLoggedIn) {
      // 提示用户登录
      alert('请先登录后再下载游戏')
      // 跳转到登录页面
      window.location.href = '/auth/login'
      return
    }

    setDownloadStatus('loading')
    
    try {
      await fetch(`/api/games/${id}/download`, {
        method: 'POST'
      })
    } catch (error) {
      console.error('更新下载计数失败:', error)
    }
    
    setTimeout(() => {
      const downloadUrl = game.apkUrl.includes('blob.vercel-storage.com')
        ? `${game.apkUrl}?download=1`
        : game.apkUrl
      window.location.href = downloadUrl
      setDownloadStatus('idle')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-brand border-t-transparent"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="text-center py-24">
        <div className="inline-flex items-center justify-center mb-8">
          <div className="w-32 h-32 bg-[#1E293B] rounded-3xl flex items-center justify-center">
            <Gamepad2 className="w-20 h-20 text-muted" />
          </div>
        </div>
        <p className="text-muted text-2xl font-semibold mb-3">游戏不存在</p>
        <p className="text-muted/60 text-lg">请检查链接是否正确</p>
      </div>
    )
  }

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

      <div className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1a2332] to-[#0F172A]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0F172A]/50 to-[#0F172A]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          {game.iconUrl && (
            <img
              src={game.iconUrl}
              alt=""
              className="w-full h-full object-cover opacity-20 blur-3xl scale-110"
            />
          )}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <Link href="/" className="inline-flex items-center text-brand hover:text-brand-hover transition-colors font-semibold text-lg group">
            <ArrowLeft className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            返回首页
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glow-card p-6">
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <div className="aspect-square bg-[#0F172A] relative overflow-hidden">
                  {game.iconUrl ? (
                    <img
                      src={game.iconUrl}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gamepad2 className="w-16 h-16 text-muted" />
                    </div>
                  )}
                </div>
                <div className="absolute top-3 right-3 bg-brand text-[#0F172A] px-3 py-1 rounded-full text-xs font-bold">
                  {game.category}
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-6 text-white">{game.name}</h1>

              <div className="flex items-center justify-between mb-6 p-4 bg-[#0F172A] rounded-xl">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-brand fill-brand" strokeWidth={1.5} />
                  <span className="font-bold text-xl text-white">{game.rating || '暂无评分'}</span>
                </div>
                <div className="flex items-center space-x-2 text-white">
                  <Users className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-sm">{formatDownloadCount(game.downloadCount)}次下载</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Package className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-xs mb-1">包名</div>
                    <div className="font-semibold text-white">{game.packageName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Calendar className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-xs mb-1">版本</div>
                    <div className="font-semibold text-white">{game.version}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Shield className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-xs mb-1">大小</div>
                    <div className="font-semibold text-white">{game.fileSize}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm p-4 bg-[#0F172A] rounded-xl">
                  <Smartphone className="w-6 h-6 text-brand" strokeWidth={1.5} />
                  <div>
                    <div className="text-white text-xs mb-1">系统要求</div>
                    <div className="font-semibold text-white">{getSystemRequirement(game.fileSize)}</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleDownload}
                className={`w-full flex items-center justify-center space-x-3 text-lg py-4 px-6 rounded-xl transition-colors ${isLoggedIn ? `download-btn ${downloadStatus === 'loading' ? 'loading' : ''}` : 'bg-[#1E293B] border-2 border-[#334155] text-white hover:border-brand hover:text-brand'}`}
              >
                {isLoggedIn ? (
                  <>
                    <Download className="w-6 h-6" strokeWidth={1.5} />
                    <span>{downloadStatus === 'loading' ? '正在获取地址...' : '立即下载'}</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" strokeWidth={1.5} />
                    <span>登录后下载</span>
                  </>
                )}
              </button>

              <div className="flex justify-center gap-6 mt-6 text-xs text-muted">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>安全无毒</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>高速下载</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4 text-brand" strokeWidth={1.5} />
                  <span>官方正版</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">游戏介绍</h2>
              <p className="text-muted leading-relaxed whitespace-pre-wrap text-lg">{game.description}</p>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">游戏特色</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(categoryFeatures[game.category] || defaultFeatures).map((feature, index) => (
                  <div key={index} className="bg-[#0F172A] rounded-xl p-6 group hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <div className="text-brand font-bold text-xl mb-3">{feature.title}</div>
                    <p className="text-sm text-white">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">下载统计</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">{formatDownloadCount(game.downloadCount)}</div>
                  <div className="text-sm text-muted">总下载量</div>
                </div>
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">{game.rating || '暂无'}</div>
                  <div className="text-sm text-muted">用户评分</div>
                </div>
                <div className="text-center p-6 bg-[#0F172A] rounded-xl">
                  <div className="text-4xl font-bold text-brand mb-2">{game.fileSize || '未知'}</div>
                  <div className="text-sm text-muted">文件大小</div>
                </div>
              </div>
            </div>

            <div className="glow-card p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">用户评论</h2>
              <GameReviews gameId={id} />
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-fab lg:hidden">
        <button 
          onClick={handleDownload}
          className={`download-btn w-full flex items-center justify-center space-x-3 ${downloadStatus === 'loading' ? 'loading' : ''}`}
        >
          <Download className="w-5 h-5" />
          <span>{downloadStatus === 'loading' ? '正在获取地址...' : '立即下载'}</span>
        </button>
      </div>
    </div>
  )
}

export default GameDetail