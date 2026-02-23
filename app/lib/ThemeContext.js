'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { themes, defaultTheme } from './themes'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('theme', currentTheme)
      applyTheme(currentTheme)
    }
  }, [currentTheme, isLoaded])

  const applyTheme = (themeId) => {
    const theme = themes[themeId]
    if (!theme) return

    const root = document.documentElement
    root.style.setProperty('--brand', theme.colors.brand)
    root.style.setProperty('--brand-hover', theme.colors.brandHover)
    root.style.setProperty('--bg-main', theme.colors.bgMain)
    root.style.setProperty('--bg-card', theme.colors.bgCard)
    root.style.setProperty('--text-main', theme.colors.textMain)
    root.style.setProperty('--text-muted', theme.colors.textMuted)
    root.style.setProperty('--border-color', theme.colors.borderColor)
    root.style.setProperty('--radius-ui', theme.colors.radiusUi)
  }

  const changeTheme = (themeId) => {
    if (themes[themeId]) {
      setCurrentTheme(themeId)
    }
  }

  const value = {
    currentTheme,
    themes,
    changeTheme,
    currentThemeData: themes[currentTheme]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}