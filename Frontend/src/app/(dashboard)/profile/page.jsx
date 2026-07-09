'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/mock-auth'
import { useRouter } from 'next/navigation'
import { User, Mail, Calendar, Heart, Search, Loader2, Bookmark, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_WISHLIST = [
  { id: 'c1', title: '2024 Porsche 911 GT3 RS', price: 27500000, slug: '2024-porsche-911-gt3-rs', image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=250' }
]

const DEFAULT_SEARCHES = [
  { id: 's1', name: 'Porsche Models', criteria: 'Brand: Porsche' },
  { id: 's2', name: 'High Power Cars', criteria: 'HP: Above 350 HP' }
]

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('WISHLIST')

  const [bookings, setBookings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [searches, setSearches] = useState([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/profile')
      return
    }

    if (session?.user) {
      const token = localStorage.getItem('cj_user_token')
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      // 1. Get Bookings / Enquiries
      const fetchBookings = async () => {
        try {
          const response = await fetch(`${apiBase}/enquiries`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await response.json()
          if (data.success && data.data) {
            setBookings(data.data)
          }
        } catch (err) {
          console.error('Failed to load enquiries:', err)
        }
      }

      // 2. Get Wishlist
      const fetchWishlist = async () => {
        try {
          const response = await fetch(`${apiBase}/auth/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          const data = await response.json()
          if (data.success && data.data) {
            // Map car image field for the frontend layout compatibility
            const mappedWishlist = data.data.map(car => ({
              ...car,
              image: car.image || car.thumbnail || (car.images && car.images.split(',')[0]) || 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e'
            }))
            setWishlist(mappedWishlist)
          }
        } catch (err) {
          console.error('Failed to load wishlist:', err)
        }
      }

      fetchBookings()
      fetchWishlist()

      // 3. Saved Searches (keep local)
      const storedSearches = localStorage.getItem('cj_searches')
      if (storedSearches) {
        setSearches(JSON.parse(storedSearches))
      } else {
        localStorage.setItem('cj_searches', JSON.stringify(DEFAULT_SEARCHES))
        setSearches(DEFAULT_SEARCHES)
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!session) return null

  const formatPrice = (val) => {
    if (val >= 100000) {
      return `₹ ${(val / 100000).toFixed(2)} Lakh*`
    }
    return `₹ ${val.toLocaleString()}`
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this test drive session?')) return

    try {
      const token = localStorage.getItem('cj_user_token')
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${apiBase}/enquiries/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setBookings(prev => prev.filter(b => b._id !== bookingId && b.id !== bookingId))
        toast?.success?.('Test drive cancelled successfully!') || alert('Test drive cancelled successfully!')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveWishlist = async (itemId) => {
    try {
      const token = localStorage.getItem('cj_user_token')
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

      const response = await fetch(`${apiBase}/auth/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bikeId: itemId }) // support both numeric and ObjectId
      })
      const data = await response.json()
      if (data.success) {
        setWishlist(prev => prev.filter((i) => i.id !== itemId && i._id !== itemId))
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

      {/* User Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-border flex flex-col sm:flex-row items-center gap-6 justify-between animate-in fade-in duration-300 shadow-sm text-left">
        <div className="flex items-center gap-4.5">
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xl font-bold font-sans">
            {session.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-primary">{session.user?.name}</h1>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-accent" /> {session.user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-border text-primary">
            Account Role: Client / Buyer
          </span>
        </div>
      </div>

      {/* Tabs navigation list */}
      <div className="flex bg-white border border-border p-1 rounded-xl gap-1 max-w-full overflow-x-auto shadow-sm">
        {[
          { id: 'WISHLIST', label: 'My Garage Wishlist', icon: Heart },
          { id: 'BOOKINGS', label: 'Scheduled Test Drives', icon: Calendar },
          { id: 'SEARCHES', label: 'Saved Queries', icon: Search }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 text-xs font-extrabold px-5 py-3 rounded-lg transition-all shrink-0 cursor-pointer ${activeTab === tab.id
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

      {/* TAB 1: WISHLIST */}
      {activeTab === 'WISHLIST' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200 text-left">
          {wishlist.map((car) => (
            <div key={car.id} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                <img src={car.image} alt={car.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h4 className="font-extrabold text-base text-primary">{car.title}</h4>
                  <span className="text-sm font-bold text-accent block mt-1">{formatPrice(car.price)}</span>
                </div>
                <div className="flex gap-2.5">
                  <Link href={`/vehicles/${car.slug}`} className="flex-1 bg-slate-50 text-slate-700 text-center font-bold text-xs py-2.5 rounded-lg border border-border hover:bg-slate-100 block">
                    View Specs
                  </Link>
                  <button onClick={() => handleRemoveWishlist(car.id)} className="p-2.5 rounded-lg border border-border text-slate-400 hover:text-accent hover:border-accent/40 cursor-pointer">
                    <Heart className="h-4 w-4 fill-current text-accent" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {wishlist.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs font-bold bg-white border border-border rounded-xl flex flex-col items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-accent animate-pulse" />
              Your garage wishlist is empty. Tap the heart icon on car cards to save them.
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in duration-200">
          <div className="p-6 border-b border-slate-100 text-left">
            <h3 className="font-extrabold text-sm text-primary">Active Test Drive Appointments</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4.5">Car Model</th>
                  <th className="p-4.5">Scheduled Date & Time</th>
                  <th className="p-4.5">Service Type</th>
                  <th className="p-4.5">Notes</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4.5 font-bold text-primary">{booking.vehicleTitle || 'Car'}</td>
                    <td className="p-4.5">
                      <span className="flex items-center gap-1.5 font-bold text-slate-600">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                        {booking.date}
                      </span>
                    </td>
                    <td className="p-4.5 uppercase tracking-wide text-[10px]">Dealer Test Drive</td>
                    <td className="p-4.5 text-slate-500 truncate max-w-xs">{booking.message || 'N/A'}</td>
                    <td className="p-4.5">
                      <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold border uppercase tracking-wider ${booking.status === 'Pending'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : booking.status === 'Cancelled'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-green-500/10 text-green-600 border-green-500/20'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4.5 text-right">
                      {booking.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-[10px] font-bold text-destructive hover:underline cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No demonstrations scheduled yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SEARCHES */}
      {activeTab === 'SEARCHES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200 text-left">
          {searches.map((search) => (
            <div key={search.id} className="bg-white border border-border p-5 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-primary flex items-center gap-1.5"><Bookmark className="h-4 w-4 text-accent" /> {search.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{search.criteria}</p>
              </div>
              <button
                onClick={() => {
                  const query = search.criteria.includes('Mahindra') ? 'brand=mahindra' : 'search=45'
                  router.push(`/vehicles?${query}`)
                }}
                className="bg-slate-50 hover:bg-accent hover:text-white font-extrabold text-[10px] px-3.5 py-2 rounded-lg border border-border transition-all cursor-pointer text-slate-700"
              >
                Run Search
              </button>
            </div>
          ))}

          {searches.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-500 text-xs font-bold bg-white border border-border rounded-xl flex flex-col items-center justify-center gap-2">
              <Search className="h-8 w-8 text-accent animate-pulse" />
              You have no saved search queries.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
