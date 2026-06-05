'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Gamepad2,
  Upload,
  Users,
  MessageSquare,
  Megaphone,
  Settings,
  ArrowLeft,
  X,
  Menu
} from 'lucide-react'

const navItems = [
  { label: '仪表盘', icon: LayoutDashboard, href: '/admin' },
  { label: '游戏管理', icon: Gamepad2, href: '/admin/games' },
  { label: '上传游戏', icon: Upload, href: '/admin/upload' },
  { label: '用户管理', icon: Users, href: '/admin/users' },
  { label: '评论管理', icon: MessageSquare, href: '/admin/comments' },
  { label: '公告管理', icon: Megaphone, href: '/admin/announcements' },
  { label: '系统设置', icon: Settings, href: '/admin/settings' },
]

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname()

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-[#334155]">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <Gamepad2 className="w-5 h-5 text-[#0F172A]" />
        </div>
        <span className="text-lg font-bold text-white">GameHub Admin</span>
        <button
          onClick={onClose}
          className="ml-auto lg:hidden text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand/10 text-brand'
                  : 'text-white/60 hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#334155]">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 flex-shrink-0" />
          <span>返回前台</span>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-[#0F172A] border-r border-[#334155] z-30">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-[#0F172A] border-r border-[#334155] z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
