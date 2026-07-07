'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/mock-auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Car, Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError(null)
    
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md bg-white border border-border p-8 rounded-2xl shadow-md space-y-8 glass">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-accent/10 p-2.5 rounded-xl text-accent font-bold mb-2">
            <svg className="h-6 w-6 text-accent fill-current" viewBox="0 0 24 24">
              <path d="M4 17c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zm13-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM1 12h13v3h-1.5c-1.32 0-2.44-.88-2.82-2.09A3.87 3.87 0 0 0 4.5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.66 0 3 1.34 3 3" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-primary">Welcome Back</h2>
          <p className="text-xs text-slate-500 font-semibold">Sign in to your premium Car Junction account</p>
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mail className="h-4 w-4" /></span>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-destructive font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Password</label>
              <a href="#" className="text-[10px] font-bold text-accent hover:underline">Forgot password?</a>
            </div>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-extrabold py-3 rounded-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-6 text-xs uppercase tracking-wider"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs pt-4 border-t border-slate-100">
          <span className="text-slate-500 font-semibold">Don't have an account? </span>
          <Link href="/register" className="font-extrabold text-accent hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
