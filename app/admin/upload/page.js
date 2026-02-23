'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload as UploadIcon, Image, FileText, Package, Calendar, Shield, Gamepad2, Zap, CheckCircle, AlertCircle } from 'lucide-react'

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    packageName: '',
    description: '',
    category: '',
    version: '',
    fileSize: ''
  })

  const [iconFile, setIconFile] = useState(null)
  const [apkFile, setApkFile] = useState(null)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e, type) => {
    if (type === 'icon') {
      setIconFile(e.target.files[0])
    } else if (type === 'apk') {
      setApkFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!apkFile) {
      setMessage('请上传APK文件')
      return
    }

    if (!formData.name || !formData.packageName || !formData.description || 
        !formData.category || !formData.version || !formData.fileSize) {
      setMessage('请填写所有必填字段')
      return
    }

    const form = new FormData()
    form.append('name', formData.name)
    form.append('packageName', formData.packageName)
    form.append('description', formData.description)
    form.append('category', formData.category)
    form.append('version', formData.version)
    form.append('fileSize', formData.fileSize)
    if (iconFile) {
      form.append('icon', iconFile)
    }
    form.append('apk', apkFile)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form
      })

      const result = await res.json()

      if (res.ok) {
        setMessage('上传成功！')
        setFormData({
          name: '',
          packageName: '',
          description: '',
          category: '',
          version: '',
          fileSize: ''
        })
        setIconFile(null)
        setApkFile(null)
      } else {
        setMessage(result.error || '上传失败，请重试')
      }
    } catch (error) {
      console.error('上传失败:', error)
      setMessage('网络错误，请检查连接后重试')
    }
  }

  return (
    <div className="relative z-10">
      <Link href="/admin" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-10 font-semibold text-lg group">
        <ArrowLeft className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform" />
        返回仪表盘
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-hover rounded-3xl mb-8 glow floating">
            <UploadIcon className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold mb-4 text-gradient">上传游戏</h2>
          <p className="text-foreground/60 text-xl">填写游戏信息并上传文件</p>
        </div>

        {message && (
          <div className={`card mb-8 text-center ${message.includes('成功') ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
            <div className="flex items-center justify-center gap-3">
              {message.includes('成功') ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              <p className={message.includes('成功') ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>{message}</p>
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
                <FileText className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
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

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏图标</label>
              <div className="relative group">
                <Image className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="file"
                  accept="image/*"
                  className="input w-full pl-14"
                  onChange={(e) => handleFileChange(e, 'icon')}
                />
              </div>
              {iconFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span>已选择: {iconFile.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">APK文件</label>
              <div className="relative group">
                <Package className="absolute left-5 top-4 h-5 w-5 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input
                  type="file"
                  accept=".apk"
                  className="input w-full pl-14"
                  onChange={(e) => handleFileChange(e, 'apk')}
                  required
                />
              </div>
              {apkFile && (
                <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                  <CheckCircle className="w-4 h-4" />
                  <span>已选择: {apkFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex space-x-6">
            <Link href="/admin" className="btn btn-secondary">
              取消
            </Link>
            <button type="submit" className="btn btn-primary flex items-center space-x-3 glow">
              <UploadIcon className="h-6 w-6" />
              <span>上传游戏</span>
            </button>
          </div>
        </form>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">极速上传</h3>
            <p className="text-sm text-foreground/60">支持大文件快速上传</p>
          </div>
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">安全可靠</h3>
            <p className="text-sm text-foreground/60">文件加密传输保护</p>
          </div>
          <div className="card text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">自动审核</h3>
            <p className="text-sm text-foreground/60">智能内容审核系统</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UploadPage
