'use client'

import { useTheme } from '../lib/ThemeContext'
import { Palette, Check } from 'lucide-react'

const ThemeSwitcher = ({ isDropdown = false }) => {
  const { currentTheme, themes, changeTheme } = useTheme()

  if (isDropdown) {
    return (
      <div className="relative group">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#1E293B] transition-colors">
          <Palette className="w-5 h-5" />
          <span className="text-sm">主题</span>
        </button>
        
        <div className="absolute right-0 top-full mt-2 w-64 bg-[#1E293B] border-2 border-[#334155] rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-white">选择主题</h3>
            <div className="space-y-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0F172A] transition-colors group/btn"
                >
                  <div 
                    className="w-8 h-8 rounded-lg border-2 border-[#334155]"
                    style={{ backgroundColor: theme.colors.brand }}
                  />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">{theme.name}</div>
                  </div>
                  {currentTheme === theme.id && (
                    <Check className="w-4 h-4 text-brand" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Palette className="w-5 h-5 text-muted" />
      <select
        value={currentTheme}
        onChange={(e) => changeTheme(e.target.value)}
        className="bg-[#1E293B] border-2 border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand"
      >
        {Object.values(themes).map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ThemeSwitcher