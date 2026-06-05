'use client'

import { useState, useEffect, useCallback } from 'react'
import { Megaphone, Search, Plus, Edit, Trash2, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useUser } from '../../lib/UserContext'
import AdminGuard from '../../components/admin/AdminGuard'

const TYPE_CONFIG = {
  info: { label: '通知', color: 'bg-blue-500/20 text-blue-400' },
  warning: { label: '警告', color: 'bg-yellow-500/20 text-yellow-400' },
  success: { label: '成功', color: 'bg-green-500/20 text-green-400' },
  error: { label: '错误', color: 'bg-red-500/20 text-red-400' }
}

const AnnouncementsContent = () => {
  const [announcements, setAnnouncements] = useState([])
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({ title: '', content: '', type: 'info', isActive: true })
  const { getAuthHeaders } = useUser()

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/announcements', { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data.announcements || [])
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('获取公告列表失败:', error)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const filteredAnnouncements = announcements.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage)

  const handleToggleActive = async (announcement) => {
    try {
      const res = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !announcement.isActive })
      })
      if (res.ok) {
        const updated = await res.json()
        setAnnouncements(prev => prev.map(a => a.id === updated.id ? updated : a))
      }
    } catch (error) {
      console.error('切换状态失败:', error)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        await fetchAnnouncements()
        setShowCreateModal(false)
        setFormData({ title: '', content: '', type: 'info', isActive: true })
      } else {
        const data = await res.json()
        alert(data.error || '创建失败')
      }
    } catch (error) {
      alert('网络错误，请稍后重试')
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingAnnouncement.title,
          content: editingAnnouncement.content,
          type: editingAnnouncement.type,
          isActive: editingAnnouncement.isActive
        })
      })
      if (res.ok) {
        const updated = await res.json()
        setAnnouncements(prev => prev.map(a => a.id === updated.id ? updated : a))
        setShowEditModal(false)
        setEditingAnnouncement(null)
      } else {
        const data = await res.json()
        alert(data.error || '更新失败')
      }
    } catch (error) {
      alert('网络错误，请稍后重试')
    }
  }

  const handleDelete = (id) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/admin/announcements/${deletingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (res.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== deletingId))
        setShowDeleteModal(false)
        setDeletingId(null)
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch (error) {
      alert('网络错误，请稍后重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditModal = (announcement) => {
    setEditingAnnouncement({ ...announcement })
    setShowEditModal(true)
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">公告管理</h1>
          </div>
          <button
            onClick={() => {
              setFormData({ title: '', content: '', type: 'info', isActive: true })
              setShowCreateModal(true)
            }}
            className="px-6 py-2 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>创建公告</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索公告标题或内容..."
              className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#334155]">
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">标题</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">类型</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">状态</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">创建时间</th>
                  <th className="text-right py-4 px-6 text-white/80 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((announcement) => (
                    <tr key={announcement.id} className="border-b border-[#334155] hover:bg-[#0F172A] transition-colors">
                      <td className="py-4 px-6 text-white font-medium max-w-[300px] truncate">{announcement.title}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${TYPE_CONFIG[announcement.type]?.color || TYPE_CONFIG.info.color}`}>
                          {TYPE_CONFIG[announcement.type]?.label || '通知'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleActive(announcement)}
                          className="flex items-center gap-2 group"
                          title={announcement.isActive ? '点击禁用' : '点击启用'}
                        >
                          {announcement.isActive ? (
                            <ToggleRight className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors" />
                          )}
                          <span className={`text-sm ${announcement.isActive ? 'text-green-400' : 'text-white/40'}`}>
                            {announcement.isActive ? '启用' : '禁用'}
                          </span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-white/60">{formatDate(announcement.createdAt)}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-white/60 hover:text-brand transition-colors"
                            title="编辑公告"
                            onClick={() => openEditModal(announcement)}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 text-white/60 hover:text-red-400 transition-colors"
                            title="删除公告"
                            onClick={() => handleDelete(announcement.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone className="w-8 h-8 text-white/60" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">暂无公告</h3>
                      <p className="text-white/60">
                        {searchTerm ? `没有找到与"${searchTerm}"相关的公告` : '还没有创建公告'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-[#334155]">
              <div className="text-white/60 text-sm">
                显示 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAnnouncements.length)} 共 {filteredAnnouncements.length} 条公告
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#334155] text-white/60 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${currentPage === page ? 'bg-brand text-[#0F172A] font-semibold' : 'border border-[#334155] text-white/60 hover:border-brand hover:text-brand'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#334155] text-white/60 hover:border-brand hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#334155]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Plus className="w-6 h-6 text-brand" />
                创建公告
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告标题</label>
                <input
                  type="text"
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                  placeholder="输入公告标题"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告内容</label>
                <textarea
                  rows={5}
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="输入公告内容"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告类型</label>
                <select
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="info">通知 (蓝色)</option>
                  <option value="warning">警告 (黄色)</option>
                  <option value="success">成功 (绿色)</option>
                  <option value="error">错误 (红色)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">是否启用</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className="flex items-center gap-3"
                >
                  {formData.isActive ? (
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-white/40" />
                  )}
                  <span className={`text-sm ${formData.isActive ? 'text-green-400' : 'text-white/40'}`}>
                    {formData.isActive ? '启用' : '禁用'}
                  </span>
                </button>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 bg-[#334155] text-white rounded-lg font-semibold hover:bg-[#475569] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!formData.title || !formData.content}
                  className="flex-1 px-4 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  创建公告
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingAnnouncement && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-[#334155]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Edit className="w-6 h-6 text-brand" />
                编辑公告
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告标题</label>
                <input
                  type="text"
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告内容</label>
                <textarea
                  rows={5}
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors resize-none"
                  value={editingAnnouncement.content}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">公告类型</label>
                <select
                  className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand transition-colors"
                  value={editingAnnouncement.type}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, type: e.target.value })}
                >
                  <option value="info">通知 (蓝色)</option>
                  <option value="warning">警告 (黄色)</option>
                  <option value="success">成功 (绿色)</option>
                  <option value="error">错误 (红色)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 text-white">是否启用</label>
                <button
                  type="button"
                  onClick={() => setEditingAnnouncement({ ...editingAnnouncement, isActive: !editingAnnouncement.isActive })}
                  className="flex items-center gap-3"
                >
                  {editingAnnouncement.isActive ? (
                    <ToggleRight className="w-8 h-8 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-white/40" />
                  )}
                  <span className={`text-sm ${editingAnnouncement.isActive ? 'text-green-400' : 'text-white/40'}`}>
                    {editingAnnouncement.isActive ? '启用' : '禁用'}
                  </span>
                </button>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-[#334155] text-white rounded-lg font-semibold hover:bg-[#475569] transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!editingAnnouncement.title || !editingAnnouncement.content}
                  className="flex-1 px-4 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  保存更改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#334155]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </div>
                确认删除
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-[#334155] rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">确定要删除这条公告吗？</h3>
                <p className="text-white/60 mb-8 leading-relaxed">此操作不可撤销，公告数据将被永久删除。请谨慎操作。</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-[#334155] text-white rounded-xl font-semibold hover:bg-[#475569] transition-all hover:scale-[1.02]"
                  disabled={isDeleting}
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      删除中...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      确认删除
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const AnnouncementsPage = () => {
  return (
    <AdminGuard>
      <AnnouncementsContent />
    </AdminGuard>
  )
}

export default AnnouncementsPage
