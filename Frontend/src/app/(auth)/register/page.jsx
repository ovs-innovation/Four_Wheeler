'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'DEALER', 'INDIVIDUAL_SELLER']),
})

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      try {
        const storedUsers = localStorage.getItem('cj_users')
        const usersList = storedUsers ? JSON.parse(storedUsers) : []

        const exists = usersList.find((u) => u.email.toLowerCase() === data.email.toLowerCase())
        if (exists) {
          setError('A user with this email address already exists.')
          setLoading(false)
          return
        }

        const newUser = {
          id: 'u_' + Date.now(),
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          city: 'Jaipur',
          phone: '+91 99999 99999'
        }

        usersList.push(newUser)
        localStorage.setItem('cj_users', JSON.stringify(usersList))

        router.push('/login?registered=true')
      } catch (err) {
        setError('An error occurred during local registration.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border p-8 rounded-2xl shadow-md space-y-8 glass">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-accent/10 p-2.5 rounded-xl text-accent font-bold mb-2">
            <svg className="h-6 w-6 text-accent fill-current" viewBox="0 0 24 24">
              <path d="M4 17c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm13-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM1 12h13v3h-1.5c-1.32 0-2.44-.88-2.82-2.09A3.87 3.87 0 0 0 4.5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.66 0 3 1.34 3 3" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-primary">Create Account</h2>
          <p className="text-xs text-slate-500 font-semibold">Join India's premier car marketplace</p>
        </div>

        {/* Error Callout */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><User className="h-4 w-4" /></span>
              <input
                type="text"
                placeholder="Rohan Gupta"
                {...register('name')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.name && (
              <span className="text-[10px] text-destructive font-semibold">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mail className="h-4 w-4" /></span>
              <input
                type="email"
                placeholder="rohan@example.com"
                {...register('email')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-destructive font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Lock className="h-4 w-4" /></span>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-destructive font-semibold">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Register As</label>
            <select
              {...register('role')}
              className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-3 text-sm focus:outline-none focus:border-accent text-foreground font-semibold"
            >
              <option value="USER">Client / Buyer (Standard Account)</option>
              <option value="DEALER">Dealer (Dealership Listing Plan)</option>
              <option value="INDIVIDUAL_SELLER">Private Seller (Car Owner)</option>
            </select>
            {errors.role && (
              <span className="text-[10px] text-destructive font-semibold">{errors.role.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-extrabold py-3 rounded-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-6 text-xs uppercase tracking-wider"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                Register Account <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs pt-4 border-t border-slate-100">
          <span className="text-slate-500 font-semibold">Already have an account? </span>
          <Link href="/login" className="font-extrabold text-accent hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
