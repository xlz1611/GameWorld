'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, Bell } from 'lucide-react'
import AdminGuard from '../components/admin/AdminGuard'
import AdminSidebar from '../components/admin/AdminSidebar'
import { useUser } from '../lib/UserContext'

const pageTitles = {
  '/admin': '仪表盘',
  '/admin/games': '游戏管理',
  '/admin/upload': '上传游戏',
  '/admin/users': '用户管理',
  '/admin/comments': '评论管理',
  '/admin/announcements': '公告管理',
  '/admin/settings': '系统设置',
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()

  const pageTitle = pageTitles[pathname] || '管理后台'

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0F172A]">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64">
          <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 lg:px-8 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-[#1E293B] transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative text-white/60 hover:text-white p-2 rounded-lg hover:bg-[#1E293B] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-brand">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="hidden sm:block text-sm text-white/80">
                  {user?.name || '管理员'}
                </span>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
