'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Gamepad2, Search, Edit, Trash2, ChevronRight, ChevronLeft, Download, Eye, Heart } from 'lucide-react'
import { useUser } from '../../lib/UserContext'

const GamesManagementContent = () => {
  const [games, setGames] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingGame, setEditingGame] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingGameId, setDeletingGameId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { getAuthHeaders } = useUser()

  const fetchGames = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/games', { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setGames(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('获取游戏列表失败:', error)
    }
  }, [getAuthHeaders])
  
  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentGames = filteredGames.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage)

  const handleDelete = (id) => {
    setDeletingGameId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setIsDeleting(true)
      const res = await fetch(`/api/admin/games/${deletingGameId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      
      if (res.ok) {
        setGames(prev => prev.filter(game => game.id !== deletingGameId))
        setShowDeleteModal(false)
        setDeletingGameId(null)
      } else {
        const errorData = await res.json()
        alert(`删除游戏失败: ${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      alert('网络错误，请检查连接后重试')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEdit = (game) => {
    setEditingGame(game)
    setShowEditModal(true)
  }

  const handleUpdateGame = (updatedGame) => {
    // 强制更新状态，确保页面重新渲染
    setGames(prev => {
      const newGames = prev.map(game => game.id === updatedGame.id ? updatedGame : game);
      return [...newGames]; // 创建新数组以触发重新渲染
    });
    setShowEditModal(false);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">游戏管理</h1>
          </div>
          <Link 
            href="/admin/upload" 
            className="px-6 py-2 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            <span>上传新游戏</span>
          </Link>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索游戏名称或分类..."
              className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>
        </div>

        {/* 游戏列表 */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#334155]">
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">游戏名称</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">分类</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">版本</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">大小</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">下载量</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">状态</th>
                  <th className="text-left py-4 px-6 text-white/80 font-semibold">上传日期</th>
                  <th className="text-right py-4 px-6 text-white/80 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {currentGames.length > 0 ? (
                  currentGames.map((game) => (
                    <tr key={game.id} className="border-b border-[#334155] hover:bg-[#0F172A] transition-colors">
                      <td className="py-4 px-6 text-white font-medium">{game.name}</td>
                      <td className="py-4 px-6 text-white/60">{game.category}</td>
                      <td className="py-4 px-6 text-white/60">{game.version}</td>
                      <td className="py-4 px-6 text-white/60">{game.fileSize}</td>
                      <td className="py-4 px-6 text-white">{game.downloadCount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${game.isPublished ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {game.isPublished ? '已发布' : '未发布'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-white/60">{game.createdAt}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/games/${game.id}`}
                            target="_blank"
                            className="p-2 text-white/60 hover:text-brand transition-colors"
                            title="查看游戏"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <button className="p-2 text-white/60 hover:text-brand transition-colors" title="编辑游戏" onClick={() => handleEdit(game)}>
                            <Edit className="w-5 h-5" />
                          </button>
                          <button 
                            className="p-2 text-white/60 hover:text-red-400 transition-colors" 
                            title="删除游戏"
                            onClick={() => handleDelete(game.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gamepad2 className="w-8 h-8 text-white/60" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">暂无游戏</h3>
                      <p className="text-white/60">
                        {searchTerm ? `没有找到与"${searchTerm}"相关的游戏` : '还没有上传游戏'}
                      </p>
                      {!searchTerm && (
                        <Link 
                          href="/admin/upload"
                          className="mt-4 inline-block px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors"
                        >
                          上传游戏
                        </Link>
                      )}
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
                显示 {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredGames.length)} 共 {filteredGames.length} 个游戏
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
              <h3 className="text-lg font-semibold text-white">总游戏数</h3>
              <div className="w-12 h-12 bg-brand/20 rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-brand" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">{games.length}</span>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">已发布</h3>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">{games.filter(game => game.isPublished).length}</span>
          </div>
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总下载量</h3>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <span className="text-3xl font-bold text-white">
              {games.reduce((sum, game) => sum + game.downloadCount, 0)}
            </span>
          </div>
        </div>

        {/* 编辑游戏模态框 */}
        {showEditModal && editingGame && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] border border-[#334155] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* 模态框头部 */}
              <div className="flex items-center justify-between p-6 border-b border-[#334155]">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-6 h-6 text-brand" />
                  编辑游戏
                </h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 模态框内容 */}
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  
                  fetch(`/api/admin/games/${editingGame.id}`, {
                    method: 'PUT',
                    headers: {
                      ...getAuthHeaders(),
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      name: formData.get('name'),
                      description: formData.get('description'),
                      category: formData.get('category'),
                      version: formData.get('version'),
                      fileSize: formData.get('fileSize'),
                      isPublished: formData.get('isPublished') === 'true'
                    })
                  })
                  .then(response => response.json())
                  .then(data => {
                    if (data.error) {
                      alert(data.error);
                    } else {
                      const updatedGame = {
                        ...editingGame,
                        name: formData.get('name'),
                        description: formData.get('description'),
                        category: formData.get('category'),
                        version: formData.get('version'),
                        fileSize: formData.get('fileSize'),
                        isPublished: formData.get('isPublished') === 'true'
                      };
                      handleUpdateGame(updatedGame);
                    }
                  })
                  .catch(error => {
                    alert('更新游戏失败，请稍后重试');
                  });
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">游戏名称</label>
                      <input
                        type="text"
                        name="name"
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                        value={editingGame.name}
                        onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">分类</label>
                      <select
                        name="category"
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                        value={editingGame.category}
                        onChange={(e) => setEditingGame({ ...editingGame, category: e.target.value })}
                        required
                      >
                        <option value="动作游戏">动作游戏</option>
                        <option value="角色扮演">角色扮演</option>
                        <option value="休闲益智">休闲益智</option>
                        <option value="策略游戏">策略游戏</option>
                        <option value="体育竞技">体育竞技</option>
                        <option value="模拟经营">模拟经营</option>
                        <option value="冒险解谜">冒险解谜</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-3 text-white">游戏描述</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors resize-none"
                        value={editingGame.description || ''}
                        onChange={(e) => setEditingGame({ ...editingGame, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">版本号</label>
                      <input
                        type="text"
                        name="version"
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                        value={editingGame.version}
                        onChange={(e) => setEditingGame({ ...editingGame, version: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">文件大小</label>
                      <input
                        type="text"
                        name="fileSize"
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                        value={editingGame.fileSize}
                        onChange={(e) => setEditingGame({ ...editingGame, fileSize: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-3 text-white">上传新APK</label>
                      <input
                        type="file"
                        name="apk"
                        accept=".apk"
                        className="w-full bg-[#2A3447] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-brand transition-colors"
                      />
                      <p className="text-xs text-white/60 mt-2">如果需要更新游戏，可上传新的APK文件</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-3 text-white">状态</label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="radio"
                            name="isPublished"
                            value="true"
                            checked={editingGame.isPublished === true}
                            onChange={(e) => setEditingGame({ ...editingGame, isPublished: e.target.value === 'true' })}
                            className="text-brand focus:ring-brand"
                          />
                          <span>已发布</span>
                        </label>
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="radio"
                            name="isPublished"
                            value="false"
                            checked={editingGame.isPublished === false}
                            onChange={(e) => setEditingGame({ ...editingGame, isPublished: false })}
                            className="text-brand focus:ring-brand"
                          />
                          <span>未发布</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-3 bg-[#334155] text-white rounded-lg font-semibold hover:bg-[#475569] transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      保存更改
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 删除游戏模态框 */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-[#1E293B] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl transform transition-all">
              {/* 模态框头部 */}
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

              {/* 模态框内容 */}
              <div className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">确定要删除这个游戏吗？</h3>
                  <p className="text-white/60 mb-8 leading-relaxed">此操作不可撤销，游戏数据将被永久删除。请谨慎操作。</p>
                </div>

                {/* 操作按钮 */}
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

export default GamesManagementContent