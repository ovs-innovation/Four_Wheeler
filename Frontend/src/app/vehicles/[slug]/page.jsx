'use client'

import React, { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import DetailsImageGallery from '@/components/vehicle/DetailsImageGallery'
import EmiCalculator from '@/components/vehicle/EmiCalculator'
import BookTestDriveForm from '@/components/vehicle/BookTestDriveForm'
import { Gauge, Shield, ShieldCheck, Star, MessageSquare } from 'lucide-react'
import { INITIAL_VEHICLES } from '@/lib/mock-data'

export default function VehicleDetailPage({ params }) {
  const unwrappedParams = React.use(params)
  const slug = unwrappedParams.slug
  
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cj_vehicles')
    let list = []
    if (stored) {
      list = JSON.parse(stored)
    } else {
      list = INITIAL_VEHICLES
      localStorage.setItem('cj_vehicles', JSON.stringify(INITIAL_VEHICLES))
    }

    const matched = list.find((v) => v.slug === slug && !v.isDeleted)
    setVehicle(matched || null)
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Gauge className="h-6 w-6 animate-pulse text-accent" />
      </div>
    )
  }

  if (!vehicle) {
    notFound()
  }

  const formatPrice = (val) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore*`
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh*`
    }
    return `₹ ${val.toLocaleString()}`
  }

  const imagesArray = vehicle.images.split(',')

  // Specifications
  const specifications = [
    { key: 'Engine / Drivetrain', value: vehicle.engineSize || 'N/A' },
    { key: 'Power output', value: vehicle.power ? `${vehicle.power} HP` : 'N/A' },
    { key: 'Gearbox type', value: vehicle.transmission },
    { key: 'Maximum Torque', value: vehicle.torque ? `${vehicle.torque} Nm` : 'N/A' },
    { key: 'Ground Clearance', value: vehicle.groundClearance ? `${vehicle.groundClearance} mm` : 'N/A' },
    { key: 'NCAP Safety Rating', value: `${vehicle.safetyRating} Star` }
  ]

  const reviews = [
    { id: 'r1', rating: 5, comment: `Outstanding acceleration and handling dynamics. Exceeded all our expectations. Very smooth transaction through the dealer.`, user: { name: 'Suresh Kumar' } }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 text-left">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded bg-green-600 text-white border border-green-500">
              Certified Used Vehicle
            </span>
            {vehicle.featured && (
              <span className="text-[10px] font-black tracking-wider uppercase bg-primary text-accent border border-accent px-2.5 py-1 rounded flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Featured Listing
              </span>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            {vehicle.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
            <span>Year: <strong className="text-foreground">{vehicle.year}</strong></span>
            <span>Odometer: <strong className="text-foreground">{vehicle.mileage.toLocaleString()} km</strong></span>
            <span>Fuel: <strong className="text-foreground capitalize">{vehicle.fuelType.toLowerCase()}</strong></span>
            <span>Transmission: <strong className="text-foreground capitalize">{vehicle.transmission.toLowerCase()}</strong></span>
          </div>
        </div>

        {/* Price tag */}
        <div className="md:text-right shrink-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Pricing Guide</span>
          <span className="text-3xl sm:text-4xl font-black text-accent">{formatPrice(vehicle.price)}</span>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Gallery */}
          <DetailsImageGallery images={imagesArray} title={vehicle.title} />

          {/* Description */}
          <div className="space-y-4 text-left">
            <h3 className="font-extrabold text-lg text-primary border-b border-slate-200 pb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" /> Overview
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {vehicle.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="space-y-4 text-left">
            <h3 className="font-extrabold text-lg text-primary border-b border-slate-200 pb-3 flex items-center gap-2">
              <Gauge className="h-5 w-5 text-accent" /> Technical Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specifications.map((spec) => (
                <div
                  key={spec.key}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <span className="text-slate-500">{spec.key}</span>
                  <span className="text-primary font-black text-right ml-2">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-6 text-left">
            <h3 className="font-extrabold text-lg text-primary border-b border-slate-200 pb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent" /> Customer Reviews
            </h3>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="bg-slate-50 border border-slate-200 p-6 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-primary">{r.user?.name}</span>
                    <div className="flex gap-1.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic font-semibold">
                    "{r.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Seller Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border shadow-sm space-y-4 text-left">
            <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Seller Profile</span>
            <div>
              <h4 className="font-extrabold text-base text-primary">{vehicle.sellerName || 'Verified Dealer'}</h4>
              <p className="text-xs text-slate-500 font-semibold capitalize">
                {(vehicle.sellerRole || 'DEALER').toLowerCase().replace('_', ' ')} • {vehicle.sellerCity || 'Mumbai'}
              </p>
            </div>
            
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Location</span>
                <span className="text-primary font-black">{vehicle.sellerCity || 'Mumbai'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Phone</span>
                <span className="text-accent font-black">{vehicle.sellerPhone || '+91 98888 88888'}</span>
              </div>
            </div>
          </div>

          {/* Test Drive Form */}
          <BookTestDriveForm vehicleId={vehicle.id} vehicleTitle={vehicle.title} />

          {/* EMI Estimator */}
          <EmiCalculator vehiclePrice={vehicle.price} />
        </div>

      </div>
    </div>
  )
}
