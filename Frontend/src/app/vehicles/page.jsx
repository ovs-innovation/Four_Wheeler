'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Gauge, Compass, Fuel, ShieldCheck, Search, X, SlidersHorizontal } from 'lucide-react'
import { INITIAL_VEHICLES } from '@/lib/mock-data'

function VehiclesCatalogContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [vehicles, setVehicles] = useState([])
  const [searchVal, setSearchVal] = useState('')

  // Extract parameters
  const brandFilter = searchParams.get('brand') || ''
  const conditionFilter = searchParams.get('condition') || ''
  const fuelFilter = searchParams.get('fuelType') || ''
  const transFilter = searchParams.get('transmission') || ''
  const bodyFilter = searchParams.get('bodyType') || ''
  const maxPriceFilter = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null
  const sortOption = searchParams.get('sort') || 'newest'
  const querySearch = searchParams.get('search') || ''

  useEffect(() => {
    setSearchVal(querySearch)

    const fetchCars = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const params = new URLSearchParams()
        if (querySearch) params.append('search', querySearch)
        if (brandFilter) params.append('brand', brandFilter)
        if (conditionFilter) params.append('condition', conditionFilter)
        if (fuelFilter) params.append('fuelType', fuelFilter)
        if (transFilter) params.append('transmission', transFilter)
        if (bodyFilter) params.append('bodyType', bodyFilter)
        if (maxPriceFilter) params.append('maxPrice', maxPriceFilter)
        if (sortOption) params.append('sort', sortOption)

        const response = await fetch(`${apiBase}/cars?${params.toString()}`)
        const data = await response.json()
        if (data.success && data.data?.cars) {
          setVehicles(data.data.cars)
        } else {
          loadFallback()
        }
      } catch (err) {
        console.error('Failed to load cars from backend, using fallback:', err.message)
        loadFallback()
      }
    }

    const loadFallback = () => {
      const stored = localStorage.getItem('cj_vehicles')
      if (stored) {
        setVehicles(JSON.parse(stored))
      } else {
        localStorage.setItem('cj_vehicles', JSON.stringify(INITIAL_VEHICLES))
        setVehicles(INITIAL_VEHICLES)
      }
    }

    fetchCars()
  }, [querySearch, brandFilter, conditionFilter, fuelFilter, transFilter, bodyFilter, maxPriceFilter, sortOption])

  // Filter & Sort
  let filtered = [...vehicles]

  // If filtered locally (due to fallback or redundant safety check)
  if (vehicles.length === INITIAL_VEHICLES.length) {
    filtered = filtered.filter(v => v.status === 'APPROVED' && !v.isDeleted)

    if (brandFilter) {
      filtered = filtered.filter(
        v => v.brandId === brandFilter || v.brandName?.toLowerCase() === brandFilter.toLowerCase()
      )
    }
    if (conditionFilter) {
      filtered = filtered.filter(v => v.condition === conditionFilter)
    }
    if (fuelFilter) {
      filtered = filtered.filter(v => v.fuelType === fuelFilter)
    }
    if (transFilter) {
      filtered = filtered.filter(v => v.transmission === transFilter)
    }
    if (bodyFilter) {
      filtered = filtered.filter(v => v.bodyType === bodyFilter)
    }
    if (maxPriceFilter) {
      filtered = filtered.filter(v => v.price <= maxPriceFilter)
    }
    if (querySearch) {
      const q = querySearch.toLowerCase()
      if (!isNaN(q)) {
        filtered = filtered.filter(v => v.power >= Number(q) - 50 && v.power <= Number(q) + 50)
      } else {
        filtered = filtered.filter(
          v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.sellerCity?.toLowerCase().includes(q)
        )
      }
    }

    // Sort
    if (sortOption === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortOption === 'mileage_asc') {
      filtered.sort((a, b) => a.mileage - b.mileage)
    } else {
      filtered.sort((a, b) => b.year - a.year)
    }
  }

  const formatPrice = (val) => {
    if (val >= 10000000) {
      return `₹ ${(val / 10000000).toFixed(2)} Crore*`
    } else if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh*`
    }
    return `₹ ${val.toLocaleString()}`
  }

  const getFilterUrl = (updatedParams) => {
    const current = {}
    searchParams.forEach((val, key) => {
      current[key] = val
    })
    
    const combined = { ...current, ...updatedParams }
    const parts = []
    
    for (const [key, value] of Object.entries(combined)) {
      if (value) parts.push(`${key}=${value}`)
    }
    
    return `/vehicles${parts.length > 0 ? '?' + parts.join('&') : ''}`
  }

  const handleSelectChange = (paramName, value) => {
    router.push(getFilterUrl({ [paramName]: value }))
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    router.push(getFilterUrl({ search: searchVal }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="mb-10 text-left">
        <span className="text-xs font-semibold text-accent tracking-widest uppercase">SEARCH DIRECTORY</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">Find Your Perfect Car</h1>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-1.5 text-primary">
                <SlidersHorizontal className="h-4.5 w-4.5 text-accent" /> Filters
              </span>
              {(brandFilter || conditionFilter || fuelFilter || transFilter || bodyFilter || maxPriceFilter || querySearch) && (
                <Link
                  href="/vehicles"
                  className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear All
                </Link>
              )}
            </div>

            {/* Keyword Search */}
            <form onSubmit={handleSearchSubmit} className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Search Query</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="e.g. Porsche, 500 HP"
                  className="w-full bg-slate-50 border border-border rounded-lg pl-3 pr-8 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent">
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* Brand Filter */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Brand</label>
              <select
                onChange={(e) => handleSelectChange('brand', e.target.value)}
                value={brandFilter}
                className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
              >
                <option value="">All Brands</option>
                <option value="porsche">Porsche</option>
                <option value="tesla">Tesla</option>
                <option value="bmw">BMW</option>
                <option value="mercedes">Mercedes-Benz</option>
                <option value="mahindra">Mahindra</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Condition</label>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'New Car', value: 'NEW' },
                  { label: 'Used Car', value: 'USED' },
                  { label: 'Certified Car', value: 'CERTIFIED_PRE_OWNED' }
                ].map((item) => (
                  <Link
                    key={item.value}
                    href={getFilterUrl({ condition: conditionFilter === item.value ? '' : item.value })}
                    className={`text-xs p-2.5 rounded-lg border text-left font-bold transition-all ${
                      conditionFilter === item.value
                        ? 'bg-accent/10 border-accent text-accent font-bold'
                        : 'border-border bg-slate-50 hover:border-slate-400 text-slate-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Max Budget */}
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Max Price</label>
              <select
                onChange={(e) => handleSelectChange('maxPrice', e.target.value)}
                value={maxPriceFilter || ''}
                className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
              >
                <option value="">No Limit</option>
                <option value="1500000">₹15 Lakhs</option>
                <option value="3000000">₹30 Lakhs</option>
                <option value="7500000">₹75 Lakhs</option>
                <option value="15000000">₹1.5 Crore</option>
                <option value="30000000">₹3 Crore</option>
              </select>
            </div>

          </div>
        </aside>

        {/* Right Side: Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Stats Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-xs font-semibold text-slate-500">
              Showing <span className="text-primary font-black">{filtered.length}</span> matching machines
            </span>

            {/* Sort Selection */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Sort By</label>
              <select
                onChange={(e) => handleSelectChange('sort', e.target.value)}
                value={sortOption}
                className="bg-white border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="mileage_asc">Lowest KM Odometer</option>
              </select>
            </div>
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((v) => {
              const cover = v.images.split(',')[0]
              return (
                <div
                  key={v.id}
                  className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Photo */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={cover}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <span className="absolute left-3 top-3 text-[9px] font-black uppercase tracking-wider bg-green-600 text-white border border-green-500 px-2.5 py-1 rounded">
                        {v.condition === 'CERTIFIED_PRE_OWNED' ? 'Certified' : v.condition}
                      </span>
                    </div>

                    {/* Content */}
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

                      {/* Specs widgets */}
                      <div className="grid grid-cols-3 gap-2 border-y border-border py-2.5 text-xs font-semibold text-slate-700">
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

                  {/* Pricing Footer */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100 mt-auto">
                    <div className="text-left">
                      <div className="text-[9px] text-slate-400 font-bold uppercase block">Price</div>
                      <div className="text-base font-black text-accent">{formatPrice(v.price)}</div>
                    </div>
                    <Link
                      href={`/vehicles/${v.slug}`}
                      className="bg-primary hover:bg-secondary text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                    >
                      View Car
                    </Link>
                  </div>

                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-500 text-xs font-bold bg-white border border-border rounded-xl">
                No matching cars found. Try clearing filters or search query terms.
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

export default function VehiclesSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <Gauge className="h-6 w-6 animate-spin text-accent" />
      </div>
    }>
      <VehiclesCatalogContent />
    </Suspense>
  )
}
