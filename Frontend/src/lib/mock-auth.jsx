'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_VEHICLES, INITIAL_BLOGS } from './mock-data'

const MockAuthContext = createContext(undefined)

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Initialize Mock Users in LocalStorage if not present
    const existingUsers = localStorage.getItem('cj_users')
    if (!existingUsers) {
      const defaultUsers = [
        { id: 'admin_1', name: 'Aditya Sharma', email: 'admin@carjunction.com', password: 'password123', role: 'ADMIN', city: 'New Delhi', phone: '+91 9999999999' },
        { id: 'dealer_apex', name: 'Apex Motors India', email: 'dealer@carjunction.com', password: 'password123', role: 'DEALER', city: 'Mumbai', phone: '+91 98888 88888' },
        { id: 'seller_vikram', name: 'Vikram Singh', email: 'seller@carjunction.com', password: 'password123', role: 'INDIVIDUAL_SELLER', city: 'Alwar', phone: '+91 97777 77777' },
        { id: 'buyer_rohan', name: 'Rohan Gupta', email: 'buyer@carjunction.com', password: 'password123', role: 'USER', city: 'Pune', phone: '+91 96666 66666' },
      ]
      localStorage.setItem('cj_users', JSON.stringify(defaultUsers))
    }

    // 2. Initialize Mock Listings in LocalStorage if not present
    const existingVehicles = localStorage.getItem('cj_vehicles')
    if (!existingVehicles) {
      localStorage.setItem('cj_vehicles', JSON.stringify(INITIAL_VEHICLES))
    }

    // 3. Initialize Mock Blogs in LocalStorage if not present
    const existingBlogs = localStorage.getItem('cj_blogs')
    if (!existingBlogs) {
      localStorage.setItem('cj_blogs', JSON.stringify(INITIAL_BLOGS))
    }

    // 4. Initialize Mock Bookings in LocalStorage if not present
    const existingBookings = localStorage.getItem('cj_bookings')
    if (!existingBookings) {
      const defaultBookings = [
        { 
          id: 'b1', 
          vehicleId: 'c1', 
          vehicleTitle: '2024 Porsche 911 GT3 RS', 
          userId: 'buyer_rohan', 
          name: 'Rohan Gupta', 
          email: 'buyer@carjunction.com', 
          phone: '+91 96666 66666', 
          dateTime: '2026-07-08T11:00', 
          notes: 'Morning slot request.', 
          status: 'PENDING', 
          type: 'TEST_DRIVE' 
        }
      ]
      localStorage.setItem('cj_bookings', JSON.stringify(defaultBookings))
    }

    // 5. Restore Active Session
    const activeSession = localStorage.getItem('cj_session')
    if (activeSession) {
      try {
        setSession(JSON.parse(activeSession))
      } catch (e) {
        localStorage.removeItem('cj_session')
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const usersStr = localStorage.getItem('cj_users')
    if (!usersStr) return false

    const users = JSON.parse(usersStr)
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    )

    if (!matchedUser) return false

    if (credentials.password && matchedUser.password !== credentials.password) {
      return false
    }

    const newSession = {
      user: {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        image: null
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    localStorage.setItem('cj_session', JSON.stringify(newSession))
    setSession(newSession)
    return true
  }

  const logout = () => {
    localStorage.removeItem('cj_session')
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
  
  const usersStr = localStorage.getItem('cj_users')
  if (!usersStr) return { error: 'No database' }
  
  const users = JSON.parse(usersStr)
  const matchedUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )

  if (!matchedUser) {
    return { error: 'Invalid credentials' }
  }

  const newSession = {
    user: {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      role: matchedUser.role,
      image: null
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }

  localStorage.setItem('cj_session', JSON.stringify(newSession))
  
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl
  } else {
    window.location.reload()
  }

  return { error: null }
}

export async function signOut(options) {
  if (typeof window === 'undefined') return
  localStorage.removeItem('cj_session')
  if (options?.callbackUrl) {
    window.location.href = options.callbackUrl
  } else {
    window.location.reload()
  }
}
