'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Upload, ToggleRight, ToggleLeft, Gamepad2, Plus } from 'lucide-react'

const AdminDashboard = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/admin/games')
        if (res.ok) {
          const data = await res.json()
          setGames(data)
        }
      } catch (error) {
        console.error('获取游戏列表失败:', error)
      }
    }

    fetchGames()
  }, [])

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/games/${id}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })

      if (res.ok) {
        setGames(games.map(game => 
          game.id === id ? { ...game, isPublished: !currentStatus } : game
        ))
      }
    } catch (error) {
      console.error('更新游戏状态失败:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('确定要删除这个游戏吗？')) {
      try {
        const res = await fetch(`/api/admin/games/${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          setGames(games.filter(game => game.id !== id))
        }
      } catch (error) {
        console.error('删除游戏失败:', error)
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-2 text-gradient">管理仪表盘</h2>
          <p className="text-foreground/60">管理您的游戏资源和内容</p>
        </div>
        <Link href="/admin/upload" className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>上传游戏</span>
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="card">
          <div className="text-center py-20">
            <Gamepad2 className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <p className="text-foreground/60 text-xl mb-2">暂无游戏</p>
            <p className="text-foreground/40 mb-6">开始上传您的第一个游戏吧</p>
            <Link href="/admin/upload" className="btn btn-primary inline-flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>立即上传</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center space-x-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              <span>游戏列表</span>
            </h3>
            <span className="text-sm text-foreground/60">共 {games.length} 个游戏</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">游戏名称</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">分类</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">版本</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">大小</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">状态</th>
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">操作</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 text-foreground/60">#{game.id}</td>
                    <td className="py-4 px-4 font-medium">{game.name}</td>
                    <td className="py-4 px-4">
                      <span className="glass px-3 py-1 rounded-full text-xs font-medium">{game.category}</span>
                    </td>
                    <td className="py-4 px-4 text-foreground/60">{game.version}</td>
                    <td className="py-4 px-4 text-foreground/60">{game.fileSize}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleTogglePublish(game.id, game.isPublished)}
                        className={`p-2 rounded-lg transition-all ${game.isPublished ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                      >
                        {game.isPublished ? (
                          <ToggleRight className="h-5 w-5" />
                        ) : (
                          <ToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/edit/${game.id}`}
                          className="p-2 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(game.id)}
                          className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
