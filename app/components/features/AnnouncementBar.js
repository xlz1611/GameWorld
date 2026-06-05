'use client'

import { useState, useEffect } from 'react'
import { Megaphone, X } from 'lucide-react'

const TYPE_STYLES = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400'
}

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          const latest = data[0]
          const closed = localStorage.getItem(`announcement_closed_${latest.id}`)
          if (!closed) {
            setAnnouncement(latest)
            setVisible(true)
          }
        }
      })
      .catch(() => {})
  }, [])

  const handleClose = () => {
    if (announcement) {
      localStorage.setItem(`announcement_closed_${announcement.id}`, 'true')
    }
    setVisible(false)
  }

  if (!visible || !announcement) return null

  const style = TYPE_STYLES[announcement.type] || TYPE_STYLES.info

  return (
    <div className={`w-full border-b px-4 py-2.5 ${style}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Megaphone className="w-4 h-4 shrink-0" />
          <span className="font-medium truncate">{announcement.title}</span>
          {announcement.content && (
            <span className="opacity-70 truncate hidden sm:inline">— {announcement.content}</span>
          )}
        </div>
        <button onClick={handleClose} className="shrink-0 hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
