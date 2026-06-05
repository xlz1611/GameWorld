'use client'

import { useState, useEffect, useCallback } from 'react'
import { Users, Search, Shield, Trash2, Edit, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { useUser } from '../../lib/UserContext'
import AdminGuard from '../../components/admin/AdminGuard'
import AdminSidebar from '../../components/admin/AdminSidebar'

const UsersManagementContent = () => {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [roleTarget, setRoleTarget] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isOperating, setIsOperating] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user: currentUser, getAuthHeaders } = useUser()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const headers = getAuthHeaders()
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchTerm)}`, { headers })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
        setTotal(data.total)
      }
    } catch (error) {
      console.error('获取用户列表失败:', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, getAuthHeaders])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchUsers()
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  const adminCount = users.filter(u => u.role === 'admin').length
  const userCount = users.filter(u => u.role === 'user').length

  const handleRoleChange = (targetUser) => {
    setRoleTarget(targetUser)
    setShowRoleModal(true)
  }

  const confirmRoleChange = async () => {
    if (!roleTarget) return
    try {
      setIsOperating(true)
      const newRole = roleTarget.role === 'admin' ? 'user' : 'admin'
      const res = await fetch(`/api/admin/users/${roleTarget.id}/role`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      })
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === roleTarget.id ? { ...u, role: newRole } : u))
        setShowRoleModal(false)
        setRoleTarget(null)
      } else {
        const data = await res.json()
        alert(data.error || '修改角色失败')
      }
    } catch (error) {
      alert('网络错误，请检查连接后重试')
    } finally {
      setIsOperating(false)
    }
  }

  const handleDelete = (targetUser) => {
    setDeleteTarget(targetUser)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsOperating(true)
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== deleteTarget.id))
        setTotal(prev => prev - 1)
        setShowDeleteModal(false)
        setDeleteTarget(null)
      } else {
        const data = await res.json()
        alert(data.error || '删除用户失败')
      }
    } catch (error) {
      alert('网络错误，请检查连接后重试')
    } finally {
      setIsOperating(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#334155]">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-brand" />
                <h1 className="text-xl font-bold text-white">用户管理</h1>
              </div>
            </div>
            <div className="text-white/60 text-sm">共 {total} 位用户</div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              </div>
            </form>
          </div>

          <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0F172A] border-b border-[#334155]">
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">用户</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">邮箱</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">角色</th>
                      <th className="text-left py-4 px-6 text-white/80 font-semibold">注册时间</th>
                      <th className="text-right py-4 px-6 text-white/80 font-semibold">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length > 0 ? (
                      currentUsers.map((u) => (
                        <tr key={u.id} className="border-b border-[#334155] hover:bg-[#0F172A] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#334155] flex items-center justify-center overflow-hidden flex-shrink-0">
                                {u.avatar ? (
                                  <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-white/80 font-semibold text-sm">{u.name?.charAt(0)?.toUpperCase()}</span>
                                )}
                              </div>
                              <span className="text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-white/60">{u.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${u.role === 'admin' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {u.role === 'admin' ? '管理员' : '用户'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-white/60">{formatDate(u.createdAt)}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 text-white/60 hover:text-brand transition-colors"
                                title="修改角色"
                                onClick={() => handleRoleChange(u)}
                              >
                                <Shield className="w-5 h-5" />
                              </button>
                              {u.id !== currentUser?.id && u.role !== 'admin' && (
                                <button
                                  className="p-2 text-white/60 hover:text-red-400 transition-colors"
                                  title="删除用户"
                                  onClick={() => handleDelete(u)}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-white/60" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">暂无用户</h3>
                          <p className="text-white/60">
                            {searchTerm ? `没有找到与"${searchTerm}"相关的用户` : '还没有注册用户'}
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t border-[#334155]">
                <div className="text-white/60 text-sm">
                  显示 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, users.length)} 共 {users.length} 位用户
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">总用户数</h3>
                <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-brand" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">{users.length}</span>
            </div>
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">管理员</h3>
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">{adminCount}</span>
            </div>
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">普通用户</h3>
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <span className="text-3xl font-bold text-white">{userCount}</span>
            </div>
          </div>
        </div>
      </div>

      {showRoleModal && roleTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-[#334155]">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand" />
                </div>
                修改角色
              </h2>
              <button
                onClick={() => { setShowRoleModal(false); setRoleTarget(null) }}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-[#334155] rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit className="w-10 h-10 text-brand" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  确定将「{roleTarget.name}」的角色从
                  <span className={roleTarget.role === 'admin' ? 'text-green-400' : 'text-blue-400'}>
                    {roleTarget.role === 'admin' ? '管理员' : '用户'}
                  </span>
                  更改为
                  <span className={roleTarget.role === 'admin' ? 'text-blue-400' : 'text-green-400'}>
                    {roleTarget.role === 'admin' ? '用户' : '管理员'}
                  </span>
                  吗？
                </h3>
                <p className="text-white/60 mb-8 leading-relaxed">修改角色后将立即生效，请谨慎操作。</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowRoleModal(false); setRoleTarget(null) }}
                  className="flex-1 px-6 py-3 bg-[#334155] text-white rounded-xl font-semibold hover:bg-[#475569] transition-all"
                  disabled={isOperating}
                >
                  取消
                </button>
                <button
                  onClick={confirmRoleChange}
                  className="flex-1 px-6 py-3 bg-brand text-[#0F172A] rounded-xl font-semibold hover:bg-brand-hover transition-all flex items-center justify-center gap-2"
                  disabled={isOperating}
                >
                  {isOperating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      处理中...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      确认修改
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && deleteTarget && (
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
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }}
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
                <h3 className="text-xl font-bold text-white mb-3">确定要删除用户「{deleteTarget.name}」吗？</h3>
                <p className="text-white/60 mb-8 leading-relaxed">此操作不可撤销，该用户的所有数据将被永久删除。请谨慎操作。</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteTarget(null) }}
                  className="flex-1 px-6 py-3 bg-[#334155] text-white rounded-xl font-semibold hover:bg-[#475569] transition-all"
                  disabled={isOperating}
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                  disabled={isOperating}
                >
                  {isOperating ? (
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

const UsersManagementPage = () => {
  return (
    <AdminGuard>
      <UsersManagementContent />
    </AdminGuard>
  )
}

export default UsersManagementPage
