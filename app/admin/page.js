'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Upload, ToggleRight, ToggleLeft, Gamepad2, Plus, Zap, Shield, TrendingUp } from 'lucide-react'

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
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-bold mb-3 text-gradient">管理仪表盘</h2>
          <p className="text-foreground/60 text-lg">管理您的游戏资源和内容</p>
        </div>
        <Link href="/admin/upload" className="btn btn-primary flex items-center space-x-3 glow">
          <Plus className="h-6 w-6" />
          <span>上传游戏</span>
        </Link>
      </div>

      {games.length === 0 ? (
        <div className="card">
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-muted to-muted-hover rounded-3xl flex items-center justify-center">
                <Gamepad2 className="w-20 h-20 text-foreground/20" />
              </div>
            </div>
            <p className="text-foreground/60 text-2xl font-semibold mb-3">暂无游戏</p>
            <p className="text-foreground/40 text-lg mb-8">开始上传您的第一个游戏吧</p>
            <Link href="/admin/upload" className="btn btn-primary inline-flex items-center space-x-3 glow">
              <Upload className="h-6 w-6" />
              <span>立即上传</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center glow">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">+12%</span>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-gradient">{games.length}</div>
              <div className="text-foreground/60">总游戏数</div>
            </div>
            
            <div className="card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-purple-600 rounded-2xl flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">+8%</span>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-gradient-purple">{games.filter(g => g.isPublished).length}</div>
              <div className="text-foreground/60">已上架游戏</div>
            </div>
            
            <div className="card group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center gap-2 text-blue-500">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-semibold">+5%</span>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-gradient-blue">{games.filter(g => !g.isPublished).length}</div>
              <div className="text-foreground/60">待审核游戏</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <span>游戏列表</span>
              </h3>
              <span className="badge-purple px-4 py-2">共 {games.length} 个游戏</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">ID</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">游戏名称</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">分类</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">版本</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">大小</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">状态</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground/80">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-5 px-6">
                        <span className="badge-blue">#{game.id}</span>
                      </td>
                      <td className="py-5 px-6 font-semibold">{game.name}</td>
                      <td className="py-5 px-6">
                        <span className="badge">{game.category}</span>
                      </td>
                      <td className="py-5 px-6 text-foreground/60">{game.version}</td>
                      <td className="py-5 px-6 text-foreground/60">{game.fileSize}</td>
                      <td className="py-5 px-6">
                        <button
                          onClick={() => handleTogglePublish(game.id, game.isPublished)}
                          className={`p-3 rounded-xl transition-all ${game.isPublished ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30 hover:scale-110' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30 hover:scale-110'}`}
                        >
                          {game.isPublished ? (
                            <ToggleRight className="h-6 w-6" />
                          ) : (
                            <ToggleLeft className="h-6 w-6" />
                          )}
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex space-x-3">
                          <Link
                            href={`/admin/edit/${game.id}`}
                            className="p-3 text-blue-500 hover:bg-blue-500/20 rounded-xl transition-all hover:scale-110"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="p-3 text-red-500 hover:bg-red-500/20 rounded-xl transition-all hover:scale-110"
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
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
