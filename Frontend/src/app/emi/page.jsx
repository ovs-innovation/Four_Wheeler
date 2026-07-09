'use client'

import React, { useState, useEffect } from 'react'
import { INITIAL_VEHICLES } from '@/lib/mock-data'
import EmiCalculator from '@/components/vehicle/EmiCalculator'
import { Calculator } from 'lucide-react'

export default function EmiCalculatorPage() {
  const [vehicles, setVehicles] = useState([])
  const [selectedCarId, setSelectedCarId] = useState('')
  const [customPrice, setCustomPrice] = useState(2500000)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiBase}/cars?limit=1000`)
        const data = await response.json()
        if (data.success && data.data?.cars) {
          setVehicles(data.data.cars)
        } else {
          loadFallback()
        }
      } catch (err) {
        console.error('Failed to load cars in EMI page, using fallback:', err.message)
        loadFallback()
      }
    }

    const loadFallback = () => {
      const stored = localStorage.getItem('cj_vehicles')
      setVehicles(stored ? JSON.parse(stored) : INITIAL_VEHICLES)
    }

    fetchCars()
  }, [])

  const selectedCar = vehicles.find((v) => v.id === selectedCarId)
  const activePrice = selectedCar ? selectedCar.price : customPrice

  const formatPrice = (val) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore`
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh`
    }
    return `₹ ${val.toLocaleString()}`
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-left">
        <span className="text-xs font-semibold text-accent tracking-widest uppercase">FINANCE CENTER</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">Car Loan EMI Calculator</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Select a car model or specify a budget threshold to compute monthly interest repayments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Controls Column */}
        <div className="md:col-span-1 bg-white border border-border p-6 rounded-2xl shadow-sm space-y-6 text-left">
          
          {/* Select car */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Choose Car</label>
            <select
              value={selectedCarId}
              onChange={(e) => {
                setSelectedCarId(e.target.value)
                if (e.target.value === '') {
                  setCustomPrice(2500000)
                }
              }}
              className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-3 text-xs text-foreground focus:outline-none focus:border-accent font-bold"
            >
              <option value="">-- Custom Price (INR) --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({formatPrice(v.price)})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Price input (if not selected) */}
          {!selectedCarId && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Enter Custom Price (₹)</label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-3 text-xs text-foreground focus:outline-none focus:border-accent font-bold"
              />
            </div>
          )}

          {/* Static helpful guides */}
          <div className="bg-slate-50 p-4.5 rounded-xl border border-border text-[11px] text-slate-500 font-semibold leading-relaxed space-y-2">
            <h4 className="font-extrabold text-xs text-primary flex items-center gap-1.5"><Calculator className="h-4 w-4 text-accent" /> Loan Eligibility</h4>
            <p>Most commercial banks in India finance up to 80% on used cars and up to 90% on new luxury sedans / SUVs.</p>
          </div>

        </div>

        {/* Calculator display Column */}
        <div className="md:col-span-2">
          <EmiCalculator vehiclePrice={activePrice} />
        </div>

      </div>

    </div>
  )
}
