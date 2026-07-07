'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/mock-auth'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  BarChart3, 
  Car, 
  MessageSquare, 
  PlusCircle, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Coins,
  ShieldCheck,
  UserCheck
} from 'lucide-react'
import Link from 'next/link'
import { INITIAL_VEHICLES } from '@/lib/mock-data'

// Validation Schema for Listings
const listingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  price: z.number().positive('Price must be greater than zero'),
  condition: z.enum(['NEW', 'USED', 'CERTIFIED_PRE_OWNED']),
  mileage: z.number().nonnegative('KM must be positive'),
  transmission: z.enum(['MANUAL', 'AUTOMATIC']),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  bodyType: z.string().min(2, 'Enter body style (e.g. Coupe, SUV)'),
  engineSize: z.string().min(1, 'Enter engine size (e.g. 4.0L Flat-6)'),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 2),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.string().min(5, 'Please provide at least one image URL'),
  brandId: z.string().min(1, 'Select brand'),
  modelId: z.string().min(1, 'Select model'),
})

const DEFAULT_LEADS = [
  { id: 'l1', name: 'Rohan Gupta', email: 'buyer@carjunction.com', phone: '+91 96666 66666', vehicle: '2024 Porsche 911 GT3 RS', status: 'NEW', date: '2026-07-04', sellerId: 'dealer_apex', message: 'Hi, is this car still available? Would like to schedule a test drive session.' }
]

export default function DealerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('METRICS')
  const [formSuccess, setFormSuccess] = useState(null)
  const [formError, setFormError] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [vehicles, setVehicles] = useState([])
  const [leads, setLeads] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/dealer')
      return
    }

    if (session?.user) {
      const storedV = localStorage.getItem('cj_vehicles')
      let listV = []
      if (storedV) {
        listV = JSON.parse(storedV)
      } else {
        listV = INITIAL_VEHICLES
        localStorage.setItem('cj_vehicles', JSON.stringify(INITIAL_VEHICLES))
      }

      const sellerId = session.user.id
      const filteredVehicles = listV.filter(
        (v) => v.sellerId === sellerId || (sellerId === 'dealer_apex' && (v.sellerId === 'dealer_apex' || !v.sellerId))
      )
      setVehicles(filteredVehicles)

      const storedL = localStorage.getItem('cj_leads')
      let listL = []
      if (storedL) {
        listL = JSON.parse(storedL)
      } else {
        listL = DEFAULT_LEADS
        localStorage.setItem('cj_leads', JSON.stringify(DEFAULT_LEADS))
      }

      const filteredLeads = listL.filter(
        (l) => l.sellerId === sellerId || (sellerId === 'dealer_apex' && (l.sellerId === 'dealer_apex' || !l.sellerId))
      )
      setLeads(filteredLeads)
    }
  }, [session, status, router])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      price: 0,
      condition: 'USED',
      mileage: 0,
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      bodyType: 'Coupe',
      engineSize: '4.0L Flat-6',
      year: 2024,
      description: '',
      images: '',
      brandId: 'brand_porsche',
      modelId: 'model_911',
    }
  })

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!session) return null

  if (session?.user?.role === 'USER') {
    return (
      <div className="max-w-md mx-auto my-24 p-8 bg-white border border-border rounded-2xl text-center space-y-4 shadow-md">
        <AlertCircle className="h-10 w-10 text-accent mx-auto animate-bounce" />
        <h2 className="text-xl font-bold text-primary">Upgrade to Seller</h2>
        <p className="text-xs text-slate-500 font-semibold">Standard buyer profiles do not have access to dealer dashboard panels. Please create a seller or dealer account.</p>
        <button onClick={() => router.push('/')} className="bg-accent text-white font-extrabold px-6 py-2.5 rounded-lg text-xs cursor-pointer">
          Return Home
        </button>
      </div>
    )
  }

  const handleListingSubmit = async (data) => {
    setFormLoading(true)
    setFormError(null)
    setFormSuccess(null)

    setTimeout(() => {
      try {
        const storedV = localStorage.getItem('cj_vehicles')
        const currentVehicles = storedV ? JSON.parse(storedV) : []

        const timestamp = Date.now().toString().slice(-4)
        const slug = `${data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')}-${timestamp}`

        const brandMap = {
          brand_porsche: 'Porsche',
          brand_tesla: 'Tesla',
          brand_bmw: 'BMW',
          brand_mercedes: 'Mercedes-Benz',
          brand_mahindra: 'Mahindra'
        }
        const modelMap = {
          model_911: '911 GT3 RS',
          model_s: 'Model S Plaid',
          model_i7: 'i7 xDrive60',
          model_gclass: 'G-Class G 400d',
          model_thar: 'Thar LX'
        }

        const newCar = {
          id: 'c_' + Date.now(),
          title: data.title,
          slug,
          price: data.price,
          condition: data.condition,
          mileage: data.mileage,
          transmission: data.transmission,
          fuelType: data.fuelType,
          bodyType: data.bodyType,
          engineSize: data.engineSize,
          year: data.year,
          description: data.description,
          images: data.images,
          colorOptions: 'Factory Default',
          status: 'APPROVED',
          featured: false,
          sellerId: session.user.id,
          brandId: data.brandId,
          modelId: data.modelId,
          brandName: brandMap[data.brandId] || 'Custom Make',
          modelName: modelMap[data.modelId] || 'Custom Model',
          sellerName: session.user.name || 'Verified Dealer',
          sellerPhone: '+91 98888 88888',
          sellerCity: 'Mumbai',
          sellerRole: session.user.role,
          power: data.brandId === 'brand_porsche' ? 518 : 300,
          torque: 400,
          groundClearance: 140,
          safetyRating: 5
        }

        currentVehicles.unshift(newCar)
        localStorage.setItem('cj_vehicles', JSON.stringify(currentVehicles))
        setVehicles(prev => [newCar, ...prev])

        setFormSuccess('Car listing published successfully! It is active in the search catalog.')
        reset()
        setTimeout(() => {
          setActiveTab('VEHICLES')
          setFormSuccess(null)
        }, 1200)
      } catch (err) {
        setFormError('Failed to publish listing locally.')
        console.error(err)
      } finally {
        setFormLoading(false)
      }
    }, 600)
  }

  const handleRemoveVehicle = (vehicleId) => {
    if (!confirm('Are you sure you want to remove this car listing?')) return
    
    try {
      const stored = localStorage.getItem('cj_vehicles')
      if (stored) {
        const list = JSON.parse(stored)
        const updated = list.filter((v) => v.id !== vehicleId)
        localStorage.setItem('cj_vehicles', JSON.stringify(updated))
        setVehicles(prev => prev.filter(v => v.id !== vehicleId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleLeadStatusChange = (leadId, newStatus) => {
    try {
      const stored = localStorage.getItem('cj_leads')
      if (stored) {
        const list = JSON.parse(stored)
        const updated = list.map((l) => l.id === leadId ? { ...l, status: newStatus } : l)
        localStorage.setItem('cj_leads', JSON.stringify(updated))
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
      }
    } catch (e) {
      console.error(e)
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

  // Quick statistics
  const totalListings = vehicles.length
  const totalLeads = leads.length
  const pendingLeads = leads.filter(l => l.status === 'NEW').length
  const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-8 text-left">
        <div>
          <span className="text-xs font-semibold text-accent uppercase tracking-widest flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5" /> Seller Dashboard
          </span>
          <h1 className="text-3xl font-extrabold text-primary mt-2">Welcome Back, {session.user?.name}</h1>
        </div>
        
        <button
          onClick={() => setActiveTab('ADD_LISTING')}
          className="bg-primary hover:bg-secondary text-white font-extrabold text-xs px-5 py-3 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <PlusCircle className="h-4.5 w-4.5" /> Publish Car
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border border-border p-1 rounded-xl max-w-full overflow-x-auto gap-1 shadow-sm">
        {[
          { id: 'METRICS', label: 'Summary', icon: BarChart3 },
          { id: 'VEHICLES', label: 'Active Listings', icon: Car },
          { id: 'LEADS', label: 'Inquiries / Leads', icon: MessageSquare },
          { id: 'ADD_LISTING', label: 'Add Car', icon: PlusCircle }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-extrabold px-5 py-3 rounded-lg transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-white font-black'
                  : 'text-slate-500 hover:text-primary hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* TAB 1: METRICS PANEL */}
      {activeTab === 'METRICS' && (
        <div className="space-y-8 animate-in fade-in duration-200 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Active Inventory</span>
                <Car className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary">{totalListings}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Total listings available in directory</p>
              </div>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Book Value</span>
                <Coins className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary">{formatPrice(totalInventoryValue)}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Aggregated value of active machinery</p>
              </div>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Total Leads</span>
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary">{totalLeads}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Total inquiries received</p>
              </div>
            </div>

            <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Unresolved Queries</span>
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-primary">{pendingLeads}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Leads waiting to be replied</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-primary">Inquiries Traffic Flow</h3>
              <div className="flex items-end justify-between h-40 pt-4 border-b border-slate-100">
                {[30, 45, 60, 25, 70, 95, totalLeads * 10 || 15].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 w-[10%]">
                    <div 
                      style={{ height: `${val}%` }} 
                      className="w-full bg-accent rounded-t-md hover:opacity-80 transition-all"
                    />
                    <span className="text-[9px] text-slate-400 font-bold uppercase">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white border border-border p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-extrabold text-sm text-primary mb-2">Dealership Standing</h3>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Every listed car is verified via our 120-point checklist. 100% of your uploaded vehicles are verified and listed directly into search directory feeds.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-border mt-4">
                <CheckCircle className="h-8 w-8 text-green-500 shrink-0" />
                <div>
                  <span className="text-xs font-extrabold text-primary block">Car Junction Certified</span>
                  <span className="text-[10px] text-slate-400">Excellent seller verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE LISTINGS TABLE */}
      {activeTab === 'VEHICLES' && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="p-6 border-b border-slate-100 text-left">
            <h3 className="font-extrabold text-sm text-primary">Active Catalog Listings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4.5">Car Model</th>
                  <th className="p-4.5">Year</th>
                  <th className="p-4.5">Condition</th>
                  <th className="p-4.5">Odometer</th>
                  <th className="p-4.5">Price</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4.5 font-bold text-primary">
                      <Link href={`/vehicles/${vehicle.slug}`} className="hover:underline hover:text-accent">
                        {vehicle.title}
                      </Link>
                    </td>
                    <td className="p-4.5">{vehicle.year}</td>
                    <td className="p-4.5 uppercase tracking-wide text-[10px]">{vehicle.condition.replace(/_/g, ' ')}</td>
                    <td className="p-4.5">{vehicle.mileage.toLocaleString()} km</td>
                    <td className="p-4.5 font-bold text-primary">{formatPrice(vehicle.price)}</td>
                    <td className="p-4.5">
                      <span className="px-2.5 py-1 rounded-md text-[9px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 uppercase tracking-wider">
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="p-4.5 text-right">
                      <button 
                        onClick={() => handleRemoveVehicle(vehicle.id)}
                        className="text-[10px] font-bold text-destructive hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {vehicles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No active listings. Click "Publish Car" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LEADS */}
      {activeTab === 'LEADS' && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="p-6 border-b border-slate-100 text-left">
            <h3 className="font-extrabold text-sm text-primary">Incoming Inquiries</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4.5">Buyer Name</th>
                  <th className="p-4.5">Contact Detail</th>
                  <th className="p-4.5">Inquired Car</th>
                  <th className="p-4.5">Message Notes</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4.5 font-bold text-primary">{lead.name}</td>
                    <td className="p-4.5">
                      <div>{lead.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{lead.phone}</div>
                    </td>
                    <td className="p-4.5">{lead.vehicle}</td>
                    <td className="p-4.5 text-slate-500 max-w-xs truncate">{lead.message || 'Hi, interested in details.'}</td>
                    <td className="p-4.5">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold border uppercase tracking-wider ${
                        lead.status === 'NEW'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : lead.status === 'CONTACTED'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-green-500/10 text-green-600 border-green-500/20'
                      }`}>
                        {lead.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4.5 text-right flex justify-end gap-2.5 mt-2">
                      <a href={`mailto:${lead.email}`} className="text-[10px] font-bold text-accent hover:underline">Reply</a>
                      
                      {lead.status === 'NEW' && (
                        <button 
                          onClick={() => handleLeadStatusChange(lead.id, 'CONTACTED')}
                          className="text-[10px] font-bold text-slate-400 hover:text-primary hover:underline cursor-pointer"
                        >
                          Contacted
                        </button>
                      )}

                      {lead.status === 'CONTACTED' && (
                        <button 
                          onClick={() => handleLeadStatusChange(lead.id, 'CLOSED_WON')}
                          className="text-[10px] font-bold text-green-600 hover:underline cursor-pointer"
                        >
                          Close Won
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No incoming queries yet. Leads show up when buyers book test drives.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ADD LISTING FORM */}
      {activeTab === 'ADD_LISTING' && (
        <div className="bg-white border border-border p-6 sm:p-8 rounded-2xl shadow-md space-y-8 max-w-3xl mx-auto animate-in fade-in duration-200">
          <div className="text-left">
            <h3 className="text-xl font-black text-primary mb-2">Publish Car Listing</h3>
            <p className="text-xs text-slate-500 font-semibold font-sans">Publish car details directly to the search catalog</p>
          </div>

          <form onSubmit={handleSubmit(handleListingSubmit)} className="space-y-6 text-left">
            {formSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 p-4 rounded-xl flex items-center gap-2 text-xs font-bold animate-pulse">
                <CheckCircle className="h-5 w-5" /> {formSuccess}
              </div>
            )}

            {formError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl flex items-center gap-2 text-xs font-bold">
                <AlertCircle className="h-5 w-5" /> {formError}
              </div>
            )}

            {/* Title & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Car Name</label>
                <input
                  type="text"
                  placeholder="e.g. 2024 Porsche 911 GT3 RS"
                  {...register('title')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.title && <span className="text-[10px] text-destructive">{errors.title.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Price (INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 27500000"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.price && <span className="text-[10px] text-destructive">{errors.price.message}</span>}
              </div>
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Manufacturer Brand</label>
                <select
                  {...register('brandId')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                >
                  <option value="brand_porsche">Porsche</option>
                  <option value="brand_tesla">Tesla</option>
                  <option value="brand_bmw">BMW</option>
                  <option value="brand_mercedes">Mercedes-Benz</option>
                  <option value="brand_mahindra">Mahindra</option>
                </select>
                {errors.brandId && <span className="text-[10px] text-destructive">{errors.brandId.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Model Selection</label>
                <select
                  {...register('modelId')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                >
                  <option value="model_911">911 GT3 RS</option>
                  <option value="model_s">Model S Plaid</option>
                  <option value="model_i7">i7 xDrive60</option>
                  <option value="model_gclass">G-Class G 400d</option>
                  <option value="model_thar">Thar LX</option>
                </select>
                {errors.modelId && <span className="text-[10px] text-destructive">{errors.modelId.message}</span>}
              </div>
            </div>

            {/* Mileage & Year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Manufacture Year</label>
                <input
                  type="number"
                  placeholder="2024"
                  {...register('year', { valueAsNumber: true })}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.year && <span className="text-[10px] text-destructive">{errors.year.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Odometer (KM)</label>
                <input
                  type="number"
                  placeholder="0"
                  {...register('mileage', { valueAsNumber: true })}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.mileage && <span className="text-[10px] text-destructive">{errors.mileage.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Condition</label>
                <select
                  {...register('condition')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                >
                  <option value="NEW">New (Unregistered)</option>
                  <option value="USED">Used (Pre-Owned)</option>
                  <option value="CERTIFIED_PRE_OWNED">Certified Used</option>
                </select>
                {errors.condition && <span className="text-[10px] text-destructive">{errors.condition.message}</span>}
              </div>
            </div>

            {/* Transmission & Fuel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Gearbox Type</label>
                <select
                  {...register('transmission')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                >
                  <option value="AUTOMATIC">Automatic</option>
                  <option value="MANUAL">Manual</option>
                </select>
                {errors.transmission && <span className="text-[10px] text-destructive">{errors.transmission.message}</span>}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Fuel Type</label>
                <select
                  {...register('fuelType')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
                {errors.fuelType && <span className="text-[10px] text-destructive">{errors.fuelType.message}</span>}
              </div>
            </div>

            {/* Body Type & Engine Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Body Style</label>
                <input
                  type="text"
                  placeholder="e.g. Coupe, Sedan, SUV"
                  {...register('bodyType')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.bodyType && <span className="text-[10px] text-destructive">{errors.bodyType.message}</span>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Engine Capacity</label>
                <input
                  type="text"
                  placeholder="e.g. 4.0L Flat-6"
                  {...register('engineSize')}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
                />
                {errors.engineSize && <span className="text-[10px] text-destructive">{errors.engineSize.message}</span>}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Cover Image URL</label>
              <input
                type="text"
                placeholder="e.g. https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e..."
                {...register('images')}
                className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold"
              />
              {errors.images && <span className="text-[10px] text-destructive">{errors.images.message}</span>}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Car Details Description</label>
              <textarea
                rows={4}
                placeholder="Describe key specs, trim levels, acceleration profiles, previous owner records..."
                {...register('description')}
                className="w-full bg-slate-50 border border-border rounded-lg px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent text-foreground font-bold font-sans"
              />
              {errors.description && <span className="text-[10px] text-destructive">{errors.description.message}</span>}
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary hover:bg-secondary text-white font-extrabold py-3.5 rounded-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none text-xs uppercase tracking-wider"
            >
              {formLoading ? (
                <Loader2 className="h-4.5 w-4.5 animate-spin text-white" />
              ) : (
                <>
                  Publish Car <ShieldCheck className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
