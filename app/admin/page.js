'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Gamepad2, Download, Users, Eye, Upload, ChevronRight, Trash2, Edit, Star, Server, Database, HardDrive, X, Shield, UserCog } from 'lucide-react'
import { useUser } from '../lib/UserContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalDownloads: 0,
    totalUsers: 0,
    publishedGames: 0
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentComments, setRecentComments] = useState([])
  const [recentGames, setRecentGames] = useState([])
  const [systemStatus, setSystemStatus] = useState({
    server: 'running',
    database: 'connected',
    storage: { bytes: 0, formatted: '0 B' }
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingGameId, setDeletingGameId] = useState(null)
  const { getAuthHeaders } = useUser()

  const fetchAllData = useCallback(async () => {
    try {
      const headers = getAuthHeaders()
      const [statsRes, usersRes, commentsRes, gamesRes, statusRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users?search=', { headers }),
        fetch('/api/admin/comments?search=', { headers }),
        fetch('/api/admin/games', { headers }),
        fetch('/api/admin/system-status', { headers })
      ])

      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }
      if (usersRes.ok) {
        const data = await usersRes.json()
        setRecentUsers(data.users?.slice(0, 5) || [])
      }
      if (commentsRes.ok) {
        const data = await commentsRes.json()
        setRecentComments(data.comments?.slice(0, 5) || [])
      }
      if (gamesRes.ok) {
        const games = await gamesRes.json()
        const sorted = [...games].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
        setRecentGames(sorted)
      }
      if (statusRes.ok) {
        const data = await statusRes.json()
        setSystemStatus(data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleEdit = (game) => {
    setEditingGame(game)
    setShowEditModal(true)
  }

  const handleUpdateGame = async (updatedGame) => {
    try {
      const res = await fetch(`/api/admin/games/${updatedGame.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: updatedGame.name,
          description: updatedGame.description || '',
          category: updatedGame.category,
          version: updatedGame.version || '',
          fileSize: updatedGame.fileSize || '',
          isPublished: updatedGame.isPublished || false
        })
      })

      if (res.ok) {
        const data = await res.json()
        setRecentGames(prev => prev.map(g => g.id === updatedGame.id ? data : g))
        setShowEditModal(false)
        fetchAllData()
      } else {
        const err = await res.json()
        alert(`更新游戏失败: ${err.error || '未知错误'}`)
      }
    } catch {
      alert('网络错误，请检查连接后重试')
    }
  }

  const handleDelete = (id) => {
    setDeletingGameId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/admin/games/${deletingGameId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (res.ok) {
        setRecentGames(prev => prev.filter(g => g.id !== deletingGameId))
        setShowDeleteModal(false)
        setDeletingGameId(null)
        fetchAllData()
      } else {
        const err = await res.json()
        alert(`删除游戏失败: ${err.error || '未知错误'}`)
      }
    } catch {
      alert('网络错误，请检查连接后重试')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('zh-CN')
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleString('zh-CN')
  }

  const truncateText = (text, len = 50) => {
    if (!text) return '-'
    return text.length > len ? text.slice(0, len) + '...' : text
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
        ))}
      </div>
    )
  }

  const statCards = [
    { label: '总游戏数', value: stats.totalGames, icon: Gamepad2 },
    { label: '总下载量', value: stats.totalDownloads, icon: Download },
    { label: '总用户数', value: stats.totalUsers, icon: Users },
    { label: '已发布游戏', value: stats.publishedGames, icon: Eye },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-brand transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/70">{card.label}</h3>
              <div className="w-10 h-10 bg-brand/15 rounded-lg flex items-center justify-center">
                <card.icon className="w-5 h-5 text-brand" />
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{card.value.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href="/admin/upload" className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-brand hover:bg-[#162231] transition-all group">
          <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand/25 transition-colors">
            <Upload className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">上传游戏</h3>
          <p className="text-white/50 text-sm mb-3">添加新游戏到平台</p>
          <div className="flex items-center text-brand text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>开始上传</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link href="/admin/games" className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-brand hover:bg-[#162231] transition-all group">
          <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand/25 transition-colors">
            <Gamepad2 className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">游戏管理</h3>
          <p className="text-white/50 text-sm mb-3">查看和管理所有游戏</p>
          <div className="flex items-center text-brand text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>管理游戏</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        <Link href="/admin/users" className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 hover:border-brand hover:bg-[#162231] transition-all group">
          <div className="w-12 h-12 bg-brand/15 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand/25 transition-colors">
            <UserCog className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">用户管理</h3>
          <p className="text-white/50 text-sm mb-3">管理平台用户和权限</p>
          <div className="flex items-center text-brand text-sm font-medium group-hover:translate-x-1 transition-transform">
            <span>管理用户</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
            <h3 className="text-base font-semibold text-white">最近注册用户</h3>
            <Link href="/admin/users" className="text-brand text-sm hover:underline">查看全部</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">用户</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:table-cell">邮箱</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell">角色</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">注册时间</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#334155]/50 hover:bg-[#0F172A]/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-brand">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                          </div>
                        )}
                        <span className="text-white text-sm font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/60 text-sm hidden sm:table-cell">{user.email}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user.role === 'admin' ? '管理员' : '用户'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white/60 text-sm">{formatDate(user.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="py-10 text-center text-white/40 text-sm">暂无用户数据</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
            <h3 className="text-base font-semibold text-white">最近评论</h3>
            <Link href="/admin/comments" className="text-brand text-sm hover:underline">查看全部</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#334155]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">用户</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden lg:table-cell">评论内容</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell">游戏</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">评分</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:table-cell">时间</th>
                </tr>
              </thead>
              <tbody>
                {recentComments.length > 0 ? recentComments.map((comment) => (
                  <tr key={comment.id} className="border-b border-[#334155]/50 hover:bg-[#0F172A]/50 transition-colors">
                    <td className="py-3 px-4 text-white text-sm">{comment.user?.name || '-'}</td>
                    <td className="py-3 px-4 text-white/60 text-sm max-w-[200px] truncate hidden lg:table-cell">{truncateText(comment.content)}</td>
                    <td className="py-3 px-4 text-white/80 text-sm hidden md:table-cell">{comment.game?.name || '-'}</td>
                    <td className="py-3 px-4 text-center">{renderStars(comment.rating)}</td>
                    <td className="py-3 px-4 text-right text-white/60 text-sm hidden sm:table-cell">{formatDate(comment.createdAt)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="py-10 text-center text-white/40 text-sm">暂无评论数据</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155]">
          <h3 className="text-base font-semibold text-white">最近上传的游戏</h3>
          <Link href="/admin/games" className="text-brand text-sm hover:underline">查看全部</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">游戏名称</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:table-cell">分类</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden md:table-cell">下载量</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden lg:table-cell">状态</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:table-cell">上传日期</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-white/60 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {recentGames.length > 0 ? recentGames.map((game) => (
                <tr key={game.id} className="border-b border-[#334155]/50 hover:bg-[#0F172A]/50 transition-colors">
                  <td className="py-3 px-4 text-white text-sm font-medium">{game.name}</td>
                  <td className="py-3 px-4 text-white/60 text-sm hidden sm:table-cell">{game.category}</td>
                  <td className="py-3 px-4 text-white/80 text-sm hidden md:table-cell">{game.downloadCount || 0}</td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      game.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {game.isPublished ? '已发布' : '未发布'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/60 text-sm hidden sm:table-cell">{formatDate(game.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(game)}
                        className="p-1.5 text-white/60 hover:text-brand hover:bg-brand/10 rounded-md transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="p-1.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="py-10 text-center text-white/40 text-sm">暂无游戏数据</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
        <h3 className="text-base font-semibold text-white mb-4">系统状态</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0F172A] rounded-lg p-4 flex items-center gap-3">
            <Server className="w-5 h-5 text-green-500 shrink-0" />
            <div>
              <h4 className="text-xs font-medium text-white/60 mb-0.5">服务器状态</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">运行正常</span>
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] rounded-lg p-4 flex items-center gap-3">
            <Database className={`w-5 h-5 ${systemStatus.database === 'connected' ? 'text-green-500' : 'text-red-500'} shrink-0`} />
            <div>
              <h4 className="text-xs font-medium text-white/60 mb-0.5">数据库状态</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${systemStatus.database === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${systemStatus.database === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                  {systemStatus.database === 'connected' ? '连接正常' : '连接异常'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-[#0F172A] rounded-lg p-4 flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <h4 className="text-xs font-medium text-white/60 mb-0.5">存储使用</h4>
              <span className="text-sm text-blue-400 font-medium">{systemStatus.storage.formatted}</span>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && editingGame && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#334155] sticky top-0 bg-[#1E293B] z-10">
              <h2 className="text-lg font-bold text-white">编辑游戏</h2>
              <button onClick={() => setShowEditModal(false)} className="text-white/50 hover:text-white p-1.5 hover:bg-[#334155] rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.target)
              handleUpdateGame({
                ...editingGame,
                name: fd.get('name'),
                description: fd.get('description'),
                category: fd.get('category'),
                version: fd.get('version'),
                fileSize: fd.get('fileSize'),
                isPublished: fd.get('isPublished') === 'true'
              })
            }} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">游戏名称</label>
                  <input name="name" defaultValue={editingGame.name} required
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">分类</label>
                  <select name="category" defaultValue={editingGame.category} required
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-brand transition-colors text-sm">
                    <option value="动作游戏">动作游戏</option>
                    <option value="角色扮演">角色扮演</option>
                    <option value="休闲益智">休闲益智</option>
                    <option value="策略游戏">策略游戏</option>
                    <option value="体育竞技">体育竞技</option>
                    <option value="模拟经营">模拟经营</option>
                    <option value="冒险解谜">冒险解谜</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-2">游戏描述</label>
                  <textarea name="description" rows={3} defaultValue={editingGame.description || ''}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors resize-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">版本号</label>
                  <input name="version" defaultValue={editingGame.version || ''} required
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">文件大小</label>
                  <input name="fileSize" defaultValue={editingGame.fileSize || ''} required
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand transition-colors text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white/80 mb-2">状态</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isPublished" value="true" defaultChecked={editingGame.isPublished === true}
                        className="accent-brand" />
                      <span className="text-sm text-white">已发布</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="isPublished" value="false" defaultChecked={editingGame.isPublished === false}
                        className="accent-brand" />
                      <span className="text-sm text-white">未发布</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2.5 bg-[#334155] text-white rounded-lg text-sm font-medium hover:bg-[#475569] transition-colors">
                  取消
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2.5 bg-brand text-[#0F172A] rounded-lg text-sm font-semibold hover:brightness-110 transition-colors">
                  保存更改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-red-500/15 rounded-full flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">确定要删除这个游戏吗？</h3>
                <p className="text-white/50 text-sm mb-6 leading-relaxed">此操作不可撤销，游戏数据将被永久删除。</p>
                <div className="flex gap-3 w-full">
                  <button onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2.5 bg-[#334155] text-white rounded-lg text-sm font-medium hover:bg-[#475569] transition-colors">
                    取消
                  </button>
                  <button onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />确认删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
