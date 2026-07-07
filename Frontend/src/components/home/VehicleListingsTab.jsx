'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Fuel, Compass, Gauge } from 'lucide-react'

export default function VehicleListingsTab({ initialVehicles }) {
  const [activeTab, setActiveTab] = useState('ALL') // ALL, HP_UNDER_350, HP_ABOVE_350

  const formatPrice = (val) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore*`
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh*`
    }
    return `₹ ${val.toLocaleString()}`
  }

  // Filter listings
  const filtered = initialVehicles.filter((v) => {
    if (activeTab === 'HP_UNDER_350') return v.power <= 350
    if (activeTab === 'HP_ABOVE_350') return v.power > 350
    return true
  })

  return (
    <section className="py-16 bg-slate-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <div className="text-left">
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Buy Used Cars</h2>
            <div className="h-1 w-12 bg-accent mt-2" />
          </div>

          {/* Quick tab controls */}
          <div className="flex bg-white border border-border p-1 rounded-lg gap-1">
            {[
              { id: 'ALL', label: 'Popular' },
              { id: 'HP_UNDER_350', label: 'Under 350 HP' },
              { id: 'HP_ABOVE_350', label: '350 HP & Above' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`text-xs font-black px-4 py-2 rounded-md transition-all cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-accent text-white'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => {
            const cover = v.images.split(',')[0]
            return (
              <div 
                key={v.id} 
                className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img 
                      src={cover} 
                      alt={v.title} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute left-3 top-3 text-[9px] font-black uppercase tracking-wider bg-green-600 text-white border border-green-500 px-2.5 py-1 rounded">
                      Certified
                    </span>
                  </div>

                  {/* Body Specs */}
                  <div className="p-5 text-left space-y-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">
                        {v.year} model • {v.power} HP Output
                      </div>
                      <h4 className="font-extrabold text-base text-primary line-clamp-1 group-hover:text-accent transition-colors">
                        <Link href={`/vehicles/${v.slug}`}>{v.title}</Link>
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{v.sellerCity}, {v.year}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 border-y border-border py-2 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-1">
                        <Gauge className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{v.mileage.toLocaleString()} km</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate capitalize">{v.power} HP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Fuel className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate capitalize text-[10px]">{v.engineSize.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Book buttons */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="text-left">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block">Used Price</span>
                    <span className="text-base font-black text-accent">{formatPrice(v.price)}</span>
                  </div>
                  <Link
                    href={`/vehicles/${v.slug}`}
                    className="bg-primary hover:bg-secondary text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    View Car
                  </Link>
                </div>

              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center text-xs font-black uppercase border border-accent hover:bg-accent hover:text-white text-accent px-6 py-2.5 rounded-lg transition-all"
          >
            View All Used Cars
          </Link>
        </div>

      </div>
    </section>
  )
}
