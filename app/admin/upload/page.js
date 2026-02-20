'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload as UploadIcon, Image, FileText, Package, Calendar, Shield, Gamepad2 } from 'lucide-react'

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

    if (!iconFile || !apkFile) {
      setMessage('请上传图标和APK文件')
      return
    }

    const form = new FormData()
    form.append('name', formData.name)
    form.append('packageName', formData.packageName)
    form.append('description', formData.description)
    form.append('category', formData.category)
    form.append('version', formData.version)
    form.append('fileSize', formData.fileSize)
    form.append('icon', iconFile)
    form.append('apk', apkFile)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form
      })

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
        setMessage('上传失败，请重试')
      }
    } catch (error) {
      console.error('上传失败:', error)
      setMessage('上传失败，请重试')
    }
  }

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center text-primary hover:text-primary-hover transition-colors mb-8 font-medium">
        <ArrowLeft className="h-5 w-5 mr-2" />
        返回仪表盘
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl mb-6 glow">
            <UploadIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gradient">上传游戏</h2>
          <p className="text-foreground/60 text-lg">填写游戏信息并上传文件</p>
        </div>

        {message && (
          <div className={`card mb-8 text-center ${message.includes('成功') ? 'border-green-500/30' : 'border-red-500/30'}`}>
            <p className={message.includes('成功') ? 'text-green-500' : 'text-red-500'}>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏名称</label>
              <div className="relative">
                <Gamepad2 className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  name="name"
                  className="input w-full pl-12"
                  placeholder="请输入游戏名称"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">包名</label>
              <div className="relative">
                <Package className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  name="packageName"
                  className="input w-full pl-12"
                  placeholder="例如: com.example.game"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏描述</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <textarea
                  name="description"
                  rows={5}
                  className="input w-full pl-12 resize-none"
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
              <div className="relative">
                <Calendar className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  name="version"
                  className="input w-full pl-12"
                  placeholder="例如: 1.0.0"
                  value={formData.version}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">文件大小</label>
              <div className="relative">
                <Shield className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="text"
                  name="fileSize"
                  className="input w-full pl-12"
                  placeholder="例如: 100MB"
                  value={formData.fileSize}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">游戏图标</label>
              <div className="relative">
                <Image className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="file"
                  accept="image/*"
                  className="input w-full pl-12"
                  onChange={(e) => handleFileChange(e, 'icon')}
                  required
                />
              </div>
              {iconFile && (
                <p className="text-sm text-primary mt-2">已选择: {iconFile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-foreground/80">APK文件</label>
              <div className="relative">
                <Package className="absolute left-4 top-4 h-5 w-5 text-foreground/40" />
                <input
                  type="file"
                  accept=".apk"
                  className="input w-full pl-12"
                  onChange={(e) => handleFileChange(e, 'apk')}
                  required
                />
              </div>
              {apkFile && (
                <p className="text-sm text-primary mt-2">已选择: {apkFile.name}</p>
              )}
            </div>
          </div>

          <div className="mt-10 flex space-x-4">
            <Link href="/admin" className="btn btn-secondary">
              取消
            </Link>
            <button type="submit" className="btn btn-primary flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>上传游戏</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPage
