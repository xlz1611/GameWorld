'use client'

import { useState, useEffect, useCallback } from 'react'
import { Settings, Save, Mail, Upload, Globe, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useUser } from '../../lib/UserContext'
import AdminGuard from '../../components/admin/AdminGuard'

const SETTINGS_CONFIG = {
  basic: {
    title: '基本设置',
    icon: Globe,
    fields: [
      { key: 'site_name', label: '站点名称', type: 'text', placeholder: '请输入站点名称' },
      { key: 'site_description', label: '站点描述', type: 'textarea', placeholder: '请输入站点描述' },
      { key: 'site_keywords', label: '站点关键词', type: 'text', placeholder: '多个关键词用逗号分隔' }
    ]
  },
  upload: {
    title: '上传设置',
    icon: Upload,
    fields: [
      { key: 'max_file_size', label: '最大文件大小 (MB)', type: 'number', placeholder: '例如: 100' },
      { key: 'allowed_file_types', label: '允许的文件类型', type: 'text', placeholder: '例如: .apk,.zip,.ipa' }
    ]
  },
  mail: {
    title: '邮件设置',
    icon: Mail,
    readonly: true,
    fields: [
      { key: 'mail_host', label: 'SMTP主机', type: 'text' },
      { key: 'mail_port', label: 'SMTP端口', type: 'text' },
      { key: 'mail_user', label: '发件人邮箱', type: 'text' }
    ]
  },
  seo: {
    title: 'SEO设置',
    icon: Settings,
    fields: [
      { key: 'enable_seo', label: '是否开启SEO', type: 'toggle' },
      { key: 'enable_analytics', label: '是否开启分析', type: 'toggle' }
    ]
  }
}

const SettingsContent = () => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const { getAuthHeaders } = useUser()

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: getAuthHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || {})
      }
    } catch (error) {
      console.error('获取设置失败:', error)
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ settings })
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({ type: 'success', text: '设置保存成功' })
      } else {
        setMessage({ type: 'error', text: data.error || '保存失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请稍后重试' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">加载设置中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand" />
            <h1 className="text-3xl font-bold text-white">系统设置</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(SETTINGS_CONFIG).map(([groupKey, group]) => {
            const Icon = group.icon
            return (
              <div key={groupKey} className="bg-[#1E293B] border border-[#334155] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-brand/20 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{group.title}</h2>
                    {group.readonly && (
                      <p className="text-white/40 text-sm mt-0.5">敏感信息，仅展示不可修改</p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {group.fields.map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        {field.label}
                      </label>

                      {field.type === 'toggle' ? (
                        <button
                          type="button"
                          disabled={group.readonly}
                          onClick={() => !group.readonly && handleChange(field.key, settings[field.key] === 'true' ? 'false' : 'true')}
                          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                            settings[field.key] === 'true' ? 'bg-brand' : 'bg-[#334155]'
                          } ${group.readonly ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                              settings[field.key] === 'true' ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : field.type === 'textarea' ? (
                        <textarea
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          readOnly={group.readonly}
                          placeholder={field.placeholder}
                          rows={3}
                          className={`w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand transition-colors resize-none ${
                            group.readonly ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={settings[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          readOnly={group.readonly}
                          placeholder={field.placeholder}
                          className={`w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand transition-colors ${
                            group.readonly ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-brand text-[#0F172A] rounded-lg font-semibold hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </div>
  )
}

const AdminSettings = () => {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
  )
}

export default AdminSettings
