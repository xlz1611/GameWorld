import Link from 'next/link'
import { Gamepad2, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="glow-card p-8">
          <div className="w-24 h-24 bg-brand/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="w-12 h-12 text-brand" />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            页面未找到
          </h2>
          
          <p className="text-white mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="w-full download-btn flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            
            <Link
              href="/games"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white hover:bg-[#0F172A] transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>浏览游戏库</span>
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-[#334155]">
            <p className="text-sm text-white mb-4">热门分类</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['动作游戏', '角色扮演', '休闲益智', '策略游戏'].map((category) => (
                <Link
                  key={category}
                  href={`/?category=${encodeURIComponent(category)}`}
                  className="px-4 py-2 rounded-full bg-[#1E293B] border border-[#334155] text-sm text-white hover:border-brand hover:text-brand transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
