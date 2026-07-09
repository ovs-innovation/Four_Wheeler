'use client'

import React, { useState, useEffect } from 'react'
import { INITIAL_VEHICLES } from '@/lib/mock-data'
import { ArrowLeftRight, Check, X, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

const getFirstImg = (car) => {
  if (!car) return '';
  if (Array.isArray(car.galleryImages) && car.galleryImages.length > 0) {
    return car.galleryImages[0];
  }
  if (typeof car.images === 'string' && car.images) {
    return car.images.split(',')[0];
  }
  if (car.thumbnail) {
    return car.thumbnail;
  }
  return 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e';
}

export default function ComparePage() {
  const [vehicles, setVehicles] = useState([])
  const [carAId, setCarAId] = useState('')
  const [carBId, setCarBId] = useState('')

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiBase}/cars?limit=1000`)
        const data = await response.json()
        if (data.success && data.data?.cars) {
          const carArray = data.data.cars || [];
          setVehicles(carArray.map(c => ({ ...c, id: String(c.id || c._id) })))
        } else {
          loadFallback()
        }
      } catch (err) {
        console.error('Failed to load cars in comparison selector, using fallback:', err.message)
        loadFallback()
      }
    }

    const loadFallback = () => {
      const stored = localStorage.getItem('cj_vehicles')
      const loaded = stored ? JSON.parse(stored) : INITIAL_VEHICLES
      setVehicles(loaded.map(c => ({ ...c, id: String(c.id || c._id) })))
    }

    fetchCars()
  }, [])

  const carA = vehicles.find((v) => v.id === carAId)
  const carB = vehicles.find((v) => v.id === carBId)

  const formatPrice = (val) => {
    if (!val) return 'N/A'
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore`
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh`
    }
    return `₹ ${val.toLocaleString()}`
  }

  const comparisonRows = [
    { label: 'Ex-Showroom Price', valueFn: (car) => formatPrice(car.price), highlightBetter: 'price' },
    { label: 'Manufacture Year', valueFn: (car) => car.year },
    { label: 'Power Output', valueFn: (car) => `${car.power} HP`, highlightBetter: 'power' },
    { label: 'Peak Torque', valueFn: (car) => `${car.torque} Nm`, highlightBetter: 'torque' },
    { label: 'Engine Capacity', valueFn: (car) => car.engineSize },
    { label: 'Ground Clearance', valueFn: (car) => `${car.groundClearance} mm`, highlightBetter: 'clearance' },
    { label: 'Fuel Type', valueFn: (car) => car.fuelType },
    { label: 'Gearbox Type', valueFn: (car) => car.transmission },
    { key: 'safety', label: 'Safety NCAP Rating', valueFn: (car) => `${car.safetyRating} Star`, highlightBetter: 'safety' }
  ]

  const getBetterCar = (rowType) => {
    if (!carA || !carB) return null
    if (rowType === 'price') {
      return carA.price < carB.price ? 'A' : 'B' // Cheaper is better
    }
    if (rowType === 'power') {
      return carA.power > carB.power ? 'A' : 'B'
    }
    if (rowType === 'torque') {
      return carA.torque > carB.torque ? 'A' : 'B'
    }
    if (rowType === 'clearance') {
      return carA.groundClearance > carB.groundClearance ? 'A' : 'B'
    }
    if (rowType === 'safety') {
      return carA.safetyRating > carB.safetyRating ? 'A' : 'B'
    }
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="text-left">
        <span className="text-xs font-semibold text-accent tracking-widest uppercase">COMPARISON PANEL</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">Compare Four-Wheelers</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Select and compare technical specifications side-by-side</p>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-border p-6 rounded-2xl shadow-sm text-left">
        
        {/* Car A Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Choose Vehicle A</label>
          <select
            value={carAId}
            onChange={(e) => setCarAId(e.target.value)}
            className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-3 text-xs text-foreground focus:outline-none focus:border-accent font-bold"
          >
            <option value="">-- Select Car --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title} ({formatPrice(v.price)})
              </option>
            ))}
          </select>
        </div>

        {/* Car B Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Choose Vehicle B</label>
          <select
            value={carBId}
            onChange={(e) => setCarBId(e.target.value)}
            className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-3 text-xs text-foreground focus:outline-none focus:border-accent font-bold"
          >
            <option value="">-- Select Car --</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title} ({formatPrice(v.price)})
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Comparison Grid display */}
      {carA && carB ? (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-300">
          
          {/* Photos row */}
          <div className="grid grid-cols-3 border-b border-border bg-slate-50 items-center text-center">
            <div className="p-4 font-bold text-xs text-slate-500 uppercase tracking-wider text-left pl-6">Specs Checklist</div>
            
            {/* Car A Cover */}
            <div className="p-6 space-y-3 border-x border-border text-left">
              <div className="aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden border border-border">
                <img src={getFirstImg(carA)} alt={carA.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-extrabold text-sm text-primary line-clamp-1">
                <Link href={`/vehicles/${carA.slug}`} className="hover:underline hover:text-accent">{carA.title}</Link>
              </h4>
            </div>

            {/* Car B Cover */}
            <div className="p-6 space-y-3 text-left">
              <div className="aspect-[16/10] bg-slate-100 rounded-lg overflow-hidden border border-border">
                <img src={getFirstImg(carB)} alt={carB.title} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-extrabold text-sm text-primary line-clamp-1">
                <Link href={`/vehicles/${carB.slug}`} className="hover:underline hover:text-accent">{carB.title}</Link>
              </h4>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100 text-left text-xs font-semibold">
            {comparisonRows.map((row, idx) => {
              const betterCar = row.highlightBetter ? getBetterCar(row.highlightBetter) : null
              const valA = row.valueFn(carA)
              const valB = row.valueFn(carB)

              return (
                <div key={idx} className="grid grid-cols-3 items-center min-h-[56px] hover:bg-slate-50/40 transition-colors">
                  <div className="p-4 text-slate-500 pl-6 uppercase tracking-wider text-[10px] font-bold">{row.label}</div>
                  
                  {/* Car A Value */}
                  <div className={`p-4 border-x border-border min-h-[56px] flex items-center ${
                    betterCar === 'A' ? 'bg-green-500/5 text-green-700 font-extrabold' : 'text-slate-800'
                  }`}>
                    <span className="flex items-center gap-1.5 truncate">
                      {betterCar === 'A' && <Check className="h-4 w-4 shrink-0 text-green-600" />}
                      {valA}
                    </span>
                  </div>

                  {/* Car B Value */}
                  <div className={`p-4 min-h-[56px] flex items-center ${
                    betterCar === 'B' ? 'bg-green-500/5 text-green-700 font-extrabold' : 'text-slate-800'
                  }`}>
                    <span className="flex items-center gap-1.5 truncate">
                      {betterCar === 'B' && <Check className="h-4 w-4 shrink-0 text-green-600" />}
                      {valB}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      ) : (
        <div className="py-24 text-center bg-white border border-border rounded-2xl flex flex-col items-center justify-center gap-3">
          <ArrowLeftRight className="h-10 w-10 text-accent animate-pulse" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Select two cars above to compare technical parameters</p>
        </div>
      )}

    </div>
  )
}
