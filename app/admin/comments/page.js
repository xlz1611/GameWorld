'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { MessageSquare, Search, Trash2, Star, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useUser } from '../../lib/UserContext'
import AdminGuard from '../../components/admin/AdminGuard'

const CommentsManagementContent = () => {
  const [comments, setComments] = useState([])
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCommentId, setDeletingCommentId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
  const [todayCount, setTodayCount] = useState(0)
  const { getAuthHeaders } = useUser()

  const fetchComments = useCallback(async (search = '') => {
    try {
      const url = search ? `/api/admin/comments?search=${encodeURIComponent(search)}` : '/api/admin/comments'
      const res = await fetch(url, { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
        setTotal(data.total || 0)

        if (data.comments && data.comments.length > 0) {
          const avg = data.comments.reduce((sum, c) => sum + (c.rating || 0), 0) / data.comments.length
          setAvgRating(isNaN(avg) ? '0.0' : avg.toFixed(1))

          const today = new Date().toISOString().split('T')[0]
          setTodayCount(data.comments.filter(c => c.createdAt.startsWith(today)).length)
        } else {
          setAvgRating(0)
          setTodayCount(0)
        }
      }
    } catch (error) {
      console.error('获取评论列表失败:', error)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchComments(searchTerm)
  }, [fetchComments, searchTerm])

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(comments.length / itemsPerPage)

  const handleDelete = (id) => {
    setDeletingCommentId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/admin/comments/${deletingCommentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })

      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== deletingCommentId))
        setTotal(prev => prev - 1)
        setShowDeleteModal(false)
        setDeletingCommentId(null)
      } else {
        const errorData = await res.json()
        alert(`删除评论失败: ${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      alert('网络错误，请检查连接后重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ))
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/admin" className="inline-flex items-center text-brand hover:text-brand-hover transition-colors mb-8 font-semibold text-lg group">
          <ArrowLeft className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform" />
          返回仪表盘
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">评论管理</h1>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索评论内容或用户名..."
              className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* 评论列表 */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#334155]">
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">用户名</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">评论内容</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">所属游戏</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">评分</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">评论时间</th>
                  <th className="text-right py-4 px-6 text-white/80 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentComments.length > 0 ? (
                  currentComments.map((comment) => (
                    <tr key={comment.id} className="border-b border-[#334155] hover:bg-[#0F172A] transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {comment.user?.avatar && (
                            <img src={comment.user.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                          )}
                          <span className="text-white font-medium">{comment.user?.name || '未知用户'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/70 max-w-xs truncate">{comment.content}</td>
                      <td className="py-4 px-6 text-white/60">{comment.game?.name || '未知游戏'}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          {renderStars(comment.rating)}
                          <span className="ml-1 text-white/50 text-sm">{comment.rating}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white/60 whitespace-nowrap">{formatTime(comment.createdAt)}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          className="p-2 text-white/60 hover:text-red-400 transition-colors"
                          title="删除评论"
                          onClick={() => handleDelete(comment.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-8 h-8 text-white/60" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">暂无评论</h3>
                      <p className="text-white/60">
                        {searchTerm ? `没有找到与"${searchTerm}"相关的评论` : '还没有用户发表评论'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-[#334155]">
              <div className="text-white/60 text-sm">
                显示 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, comments.length)} 共 {comments.length} 条评论
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

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总评论数</h3>
              <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-brand" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">{total}</span>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">平均评分</h3>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">{avgRating}</span>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">今日新增</h3>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">{todayCount}</span>
          </div>
        </div>

        {/* 删除确认弹窗 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">确定要删除这条评论吗？</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">此操作不可撤销，评论数据将被永久删除。请谨慎操作。</p>
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
    </div>
  )
}

const CommentsManagementPage = () => {
  return (
    <AdminGuard>
      <CommentsManagementContent />
    </AdminGuard>
  )
}

export default CommentsManagementPage
