'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
        if (storedToken) {
          setToken(storedToken)
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const login = (userData, userToken) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData))
      if (userToken) {
        localStorage.setItem('token', userToken)
        setToken(userToken)
      }
      setUser(userData)
      return true
    } catch (error) {
      console.error('Error saving user to localStorage:', error)
      return false
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      setUser(null)
      setToken(null)
      return true
    } catch (error) {
      console.error('Error removing user from localStorage:', error)
      return false
    }
  }

  const updateUser = (updatedUserData) => {
    try {
      localStorage.setItem('user', JSON.stringify(updatedUserData))
      setUser(updatedUserData)
      return true
    } catch (error) {
      console.error('Error updating user in localStorage:', error)
      return false
    }
  }

  const getAuthHeaders = () => {
    const currentToken = token || localStorage.getItem('token') || sessionStorage.getItem('token')
    if (currentToken) {
      return { 'Authorization': `Bearer ${currentToken}` }
    }
    return {}
  }

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  const checkAdminAccess = async () => {
    if (!token) return false
    
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders()
      })
      if (res.ok) {
        const data = await res.json()
        if (data.role === 'admin') {
          if (user?.role !== 'admin') {
            updateUser({ ...user, role: data.role })
          }
          return true
        }
      }
      return false
    } catch {
      return false
    }
  }

  return (
    <UserContext.Provider value={{ user, token, isLoading, isLoggedIn, isAdmin, login, logout, updateUser, getAuthHeaders, checkAdminAccess }}>
      {children}
    </UserContext.Provider>
  )
}
