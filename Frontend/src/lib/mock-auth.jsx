'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const MockAuthContext = createContext(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success && data.data) {
        setSession({
          user: {
            id: data.data._id || data.data.id,
            name: data.data.name,
            email: data.data.email,
            role: data.data.role || 'USER',
            image: data.data.profileImage || null
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      } else {
        logout()
      }
    } catch (err) {
      console.error('Session loading failed:', err)
      logout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('cj_user_token')
    if (token) {
      fetchProfile(token)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      })
      const data = await response.json()
      if (data.success && data.data) {
        localStorage.setItem('cj_user_token', data.data.token)
        setSession({
          user: {
            id: data.data.user._id || data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            role: data.data.user.role || 'USER',
            image: data.data.user.profileImage || null
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        return true
      }
      return false
    } catch (error) {
      console.error('Login action failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('cj_user_token')
    setSession(null)
  }

  return (
    <MockAuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </MockAuthContext.Provider>
  )
}

export function useSession() {
  const context = useContext(MockAuthContext)
  if (!context) {
    return { data: null, status: 'unauthenticated' }
  }
  return {
    data: context.session,
    status: context.loading 
      ? 'loading' 
      : context.session 
      ? 'authenticated' 
      : 'unauthenticated'
  }
}

export async function signIn(provider, options) {
  if (typeof window === 'undefined') return { error: null }
  
  const email = options?.email
  const password = options?.password
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (data.success && data.data) {
      localStorage.setItem('cj_user_token', data.data.token)
      if (options?.callbackUrl) {
        window.location.href = options.callbackUrl
      } else {
        window.location.reload()
      }
      return { error: null }
    } else {
      return { error: data.message || 'Invalid credentials' }
    }
  } catch (err) {
    return { error: 'Network connection failure' }
  }
}

export async function signOut(options) {
  if (typeof window === 'undefined') return
  localStorage.removeItem('cj_user_token')
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl
  } else {
    window.location.reload()
  }
}
