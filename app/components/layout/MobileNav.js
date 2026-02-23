import Link from 'next/link'
import { Gamepad2, Search, Trophy, Settings } from 'lucide-react'

/**
 * 移动端底部导航栏组件
 * 用于在移动端设备上显示底部导航栏，包含首页、游戏库、排行榜和设置的快捷访问
 * 
 * @returns {JSX.Element} 移动端底部导航栏组件
 */
const MobileNav = () => {
  return (
    <div className="md:hidden mobile-fab">
      <div className="flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center text-brand">
          <Gamepad2 className="w-5 h-5 mb-1" strokeWidth={1.5} />
          <span className="text-xs font-medium">首页</span>
        </Link>
        <Link href="/games" className="flex flex-col items-center text-muted hover:text-brand transition-colors">
          <Search className="w-5 h-5 mb-1" strokeWidth={1.5} />
          <span className="text-xs font-medium">游戏库</span>
        </Link>
        <Link href="/ranking" className="flex flex-col items-center text-muted hover:text-brand transition-colors">
          <Trophy className="w-5 h-5 mb-1" strokeWidth={1.5} />
          <span className="text-xs font-medium">排行榜</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-muted hover:text-brand transition-colors">
          <Settings className="w-5 h-5 mb-1" strokeWidth={1.5} />
          <span className="text-xs font-medium">设置</span>
        </Link>
      </div>
    </div>
  )
}

export default MobileNav