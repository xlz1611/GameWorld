import Link from 'next/link'
import { Gamepad2, ArrowLeft, Search } from 'lucide-react'

export default function GameNotFound() {
  return (
    <div className="min-h-screen">
      <nav className="glass-navbar px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-[#0F172A]" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-bold">GameHub</span>
          </div>
        </div>
      </nav>

      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="glow-card p-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Gamepad2 className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              游戏不存在
            </h1>
            
            <p className="text-white mb-8">
              抱歉，您要找的游戏不存在或已被下架。
            </p>

            <div className="space-y-3">
              <Link
                href="/"
                className="w-full download-btn flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>返回首页</span>
              </Link>
              
              <Link
                href="/games"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>浏览其他游戏</span>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-[#334155]">
              <p className="text-sm text-white mb-4">推荐游戏</p>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-[#0F172A] rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
