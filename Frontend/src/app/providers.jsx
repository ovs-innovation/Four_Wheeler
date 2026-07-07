'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from '@/lib/mock-auth'
import React, { useState, useEffect, createContext, useContext } from 'react'

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const ThemeContext = createContext(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export function Providers({ children }) {
  const [theme, setTheme] = useState('light') // Default light mode

  useEffect(() => {
    // Keep it strictly light-themed for the Indian Portal styling
    setTheme('light')
    document.documentElement.classList.remove('dark')
  }, [])

  const toggleTheme = () => {
    // Statically disabled dark-mode toggling to keep portal colors active
  }

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
