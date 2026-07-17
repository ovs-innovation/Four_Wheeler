'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Check } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      localStorage.setItem('subscribed_email', email)
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-primary text-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/logo-light.png" alt="4Pahia Logo" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed">
              India's leading marketplace to buy, sell, and compare premium four-wheelers and performance cars. Empowering drivers since 2018.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-accent border-b border-white/10 pb-2">Brands</h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-semibold">
              <li><Link href="/vehicles?brand=porsche" className="hover:text-accent">Porsche Cars</Link></li>
              <li><Link href="/vehicles?brand=tesla" className="hover:text-accent">Tesla Cars</Link></li>
              <li><Link href="/vehicles?brand=bmw" className="hover:text-accent">BMW Cars</Link></li>
              <li><Link href="/vehicles?brand=mercedes" className="hover:text-accent">Mercedes-Benz</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-accent border-b border-white/10 pb-2">Support</h4>
            <ul className="space-y-3 text-xs text-slate-300 font-semibold">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent shrink-0" /> Mumbai, Maharashtra, India</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent shrink-0" /> +91 1800 123 4567</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent shrink-0" /> support@4pahia.com</li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-accent border-b border-white/10 pb-2">Join Newsletter</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive updates on car launches, performance reviews, and automotive tips directly to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-accent/10 border border-accent/20 text-accent p-3 rounded-lg flex items-center gap-2 text-xs font-bold">
                <Check className="h-4 w-4" /> Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-accent w-full"
                />
                <button type="submit" className="bg-secondary hover:opacity-90 text-white font-extrabold text-xs px-4 py-2 rounded-lg cursor-pointer">
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-slate-400 font-semibold">
          &copy; {new Date().getFullYear()} 4Pahia. Developed for Indian Drivers. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
