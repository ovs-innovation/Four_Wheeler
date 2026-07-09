'use client'

import React, { useState } from 'react'
import { useSession } from '@/lib/mock-auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Phone, Mail, User, Info, Loader2 } from 'lucide-react'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  dateTime: z.string().min(1, 'Please select a date and time'),
  notes: z.string().optional(),
})

export default function BookTestDriveForm({ vehicleId, vehicleTitle }) {
  const { data: session } = useSession()
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      dateTime: '',
      notes: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setErrorMsg(null)
    setSuccessMsg(null)

    try {
      const token = localStorage.getItem('cj_user_token')
      const headers = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${apiBase}/enquiries`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          bikeName: vehicleTitle,
          vehicleTitle: vehicleTitle,
          bikeBrand: 'Four Wheeler',
          type: 'TEST_DRIVE',
          message: data.notes || 'Interested in booking a demonstration session.'
        })
      })

      const resData = await response.json()
      if (resData.success) {
        setSuccessMsg('Your booking request has been registered! The dealer will contact you shortly.')
        reset()
      } else {
        setErrorMsg(resData.errors?.[0] || resData.message || 'Booking submission failed.')
      }
    } catch (err) {
      setErrorMsg('Failed to process booking on backend. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6 text-left">
      <div>
        <h4 className="font-extrabold text-base text-primary mb-1">Book a Test Drive</h4>
        <p className="text-xs text-slate-500 font-semibold">Schedule a physical test drive session at your convenience</p>
      </div>

      {successMsg ? (
        <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl text-center space-y-2">
          <Info className="h-6 w-6 mx-auto text-green-500" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold p-3 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Contact Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><User className="h-4 w-4" /></span>
              <input
                type="text"
                placeholder="Rohan Gupta"
                {...register('name')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.name && (
              <span className="text-[10px] text-destructive font-semibold">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Mail className="h-4 w-4" /></span>
              <input
                type="email"
                placeholder="rohan@example.com"
                {...register('email')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-destructive font-semibold">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Phone className="h-4 w-4" /></span>
              <input
                type="tel"
                placeholder="98888 88888"
                {...register('phone')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-semibold"
              />
            </div>
            {errors.phone && (
              <span className="text-[10px] text-destructive font-semibold">{errors.phone.message}</span>
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Preferred Date & Time</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Calendar className="h-4 w-4" /></span>
              <input
                type="datetime-local"
                {...register('dateTime')}
                className="w-full bg-slate-50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground cursor-pointer font-semibold"
              />
            </div>
            {errors.dateTime && (
              <span className="text-[10px] text-destructive font-semibold">{errors.dateTime.message}</span>
            )}
          </div>

          {/* Message Notes */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Additional Message (Optional)</label>
            <textarea
              rows={2}
              placeholder="Driving request or queries for the dealer..."
              {...register('notes')}
              className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-accent text-foreground font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-extrabold py-3.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-4 text-xs tracking-wider uppercase"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              'Book Test Drive'
            )}
          </button>
        </form>
      )}
    </div>
  )
}
