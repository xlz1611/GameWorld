'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, CheckCircle, Gamepad2, Package, Calendar, Shield, Upload } from 'lucide-react'

const EditGame = ({ params }) => {
  const { id } = params
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    packageName: '',
    description: '',
    category: '',
    version: '',
    fileSize: ''
  })

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/admin/games/${id}`)
        if (res.ok) {
          const data = await res.json()
          setGame(data)
          setFormData({
            name: data.name,
            packageName: data.packageName,
            description: data.description,
            category: data.category,
            version: data.version,
            fileSize: data.fileSize
          })
        } else {
          setError('获取游戏信息失败')
        }
      } catch (error) {
        console.error('获取游戏信息失败:', error)
        setError('获取游戏信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/admin/games/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess('游戏信息更新成功！')
        // 清除成功消息
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('更新失败，请重试')
      }
    } catch (error) {
      console.error('更新失败:', error)
      setError('更新失败，请重试')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="text-center py-24">
        <AlertCircle className="w-24 h-24 mx-auto mb-6 text-red-500/30" />
        <p className="text-foreground/60 text-2xl font-semibold mb-3">获取游戏信息失败</p>
        <p className="text-foreground/40 text-lg mb-8">{error || '游戏不存在'}</p>
        <Link href="/admin" className="btn btn-primary inline-flex items-center space-x-3">
          <ArrowLeft className="h-5 w-5" />
          <span>返回仪表盘</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative z-10">
      <Link href="/admin" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-10 font-semibold text-lg group">
        <ArrowLeft className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform" />
        返回仪表盘
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-3xl mb-8 glow">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-4 text-gradient">编辑游戏</h2>
          <p className="text-foreground/60 text-xl">修改游戏信息</p>
        </div>

        {success && (
          <div className="card mb-8 text-center border-green-500/30 bg-green-500/10">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <p className="text-green-500 font-semibold">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="card mb-8 text-center border-red-500/30 bg-red-500/10">
            <div className="flex items-center justify-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <p className="text-red-500 font-semibold">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏名称</label>
              <div className="relative group">
                <Gamepad2 className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="name"
                  className="input w-full pl-14"
                  placeholder="请输入游戏名称"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">包名</label>
              <div className="relative group">
                <Package className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="packageName"
                  className="input w-full pl-14"
                  placeholder="例如: com.example.game"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏描述</label>
              <div className="relative group">
                <Upload className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <textarea
                  name="description"
                  rows={5}
                  className="input w-full pl-14 resize-none"
                  placeholder="请输入游戏描述..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">分类</label>
              <input
                type="text"
                name="category"
                className="input w-full"
                placeholder="例如: 动作游戏"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">版本号</label>
              <div className="relative group">
                <Calendar className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="version"
                  className="input w-full pl-14"
                  placeholder="例如: 1.0.0"
                  value={formData.version}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">文件大小</label>
              <div className="relative group">
                <Shield className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  name="fileSize"
                  className="input w-full pl-14"
                  placeholder="例如: 100MB"
                  value={formData.fileSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex space-x-6">
            <Link href="/admin" className="btn btn-secondary">
              取消
            </Link>
            <button type="submit" className="btn btn-primary flex items-center space-x-3 glow">
              <Save className="h-6 w-6" />
              <span>保存修改</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditGame