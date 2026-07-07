'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession, signOut } from '@/lib/mock-auth'
import { 
  Menu, 
  X, 
  ChevronDown, 
  User, 
  Search, 
  PlusCircle, 
  LogOut, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  // Navigation Links
  const navLinks = [
    { label: 'BUY CARS', href: '/vehicles' },
    { label: 'COMPARE', href: '/compare' },
    { label: 'EMI CALCULATOR', href: '/emi' },
    { label: 'NEWS & UPDATES', href: '/news' }
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {/* Red Car Logo Icon */}
            <svg 
              className="h-10 w-10 text-accent fill-current" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5zM7.5 13c-.83 0-1.5.67-1.5 1.5S6.67 16 7.5 16s1.5-.67 1.5-1.5S8.33 13 7.5 13zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-primary leading-none">CAR</span>
              <span className="text-sm font-extrabold tracking-wider text-accent leading-none">JUNCTION</span>
            </div>
          </Link>

          {/* Central Search Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (searchVal) window.location.href = `/vehicles?search=${searchVal}`
            }} 
            className="hidden md:flex items-center flex-grow max-w-md relative"
          >
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search premium cars (e.g. Porsche, BMW)..."
              className="w-full bg-muted border border-border rounded-lg pl-3 pr-10 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary font-semibold"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-black tracking-wider text-primary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {/* SELL Button (Red Portal highlight) */}
            <Link
              href={session?.user?.role === 'DEALER' || session?.user?.role === 'INDIVIDUAL_SELLER' ? '/dealer' : '/register'}
              className="bg-accent hover:bg-secondary text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
            >
              <PlusCircle className="h-4 w-4" /> SELL
            </Link>

            {/* User Session menu */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-1.5 bg-muted border border-border px-3 py-2 rounded-lg text-xs font-bold text-primary hover:bg-secondary/40 shrink-0 cursor-pointer"
                >
                  <User className="h-4 w-4 text-accent" />
                  <span className="hidden sm:inline max-w-[100px] truncate">{session.user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-border rounded-xl shadow-lg py-1.5 text-xs font-semibold z-50">
                    <Link
                      href={session.user.role === 'DEALER' || session.user.role === 'INDIVIDUAL_SELLER' ? '/dealer' : '/profile'}
                      onClick={() => setShowProfileDropdown(false)}
                      className="block px-4 py-2.5 text-foreground hover:bg-muted hover:text-accent"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false)
                        signOut({ callbackUrl: '/' })
                      }}
                      className="w-full text-left block px-4 py-2.5 text-destructive hover:bg-destructive/5 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="border border-primary text-primary hover:bg-primary hover:text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-all shrink-0 cursor-pointer"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-primary hover:bg-muted rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white px-4 py-4 space-y-3 shadow-inner">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              if (searchVal) {
                window.location.href = `/vehicles?search=${searchVal}`
                setMobileMenuOpen(false)
              }
            }} 
            className="flex items-center relative"
          >
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Search premium cars..."
              className="w-full bg-muted border border-border rounded-lg pl-3 pr-10 py-2.5 text-xs text-foreground focus:outline-none"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-black tracking-wider text-primary hover:text-accent py-2 block border-b border-border/10"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
