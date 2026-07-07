'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function Hero() {
  const router = useRouter()
  const [tab, setTab] = useState('NEW') // NEW or USED
  const [selectedHp, setSelectedHp] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')

  const handleSearch = () => {
    let query = `condition=${tab === 'NEW' ? 'NEW' : 'USED'}`
    if (selectedHp) {
      query += `&search=${selectedHp}`
    }
    if (selectedBrand) {
      query += `&brand=${selectedBrand}`
    }
    router.push(`/vehicles?${query}`)
  }

  return (
    <div className="relative bg-primary overflow-hidden min-h-[500px] flex items-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-overlay"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1600')` 
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Header titles */}
          <div className="space-y-6 text-left">
            <span className="bg-accent/15 border border-accent/30 text-accent font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              India's Premier Automobile Portal
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Find Your Trusted <br />
              Premium Four-Wheeler
            </h1>
            <p className="text-slate-200 text-sm max-w-lg leading-relaxed font-medium">
              Check latest car prices, compare specifications, calculate EMIs, and connect with verified local dealers.
            </p>
          </div>

          {/* Clean "Find Your Right Car" Search Box widget */}
          <div className="bg-white border border-border shadow-2xl rounded-2xl p-6 sm:p-8 max-w-md w-full ml-auto">
            <h3 className="text-lg font-black text-primary border-b border-border pb-3 text-left">Find Your Right Car</h3>
            
            {/* Condition Selector Tabs */}
            <div className="flex border-b border-border mb-6 mt-4">
              <button
                onClick={() => setTab('NEW')}
                className={`flex-1 pb-2.5 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors ${
                  tab === 'NEW' 
                    ? 'border-b-2 border-accent text-accent font-black' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                New Car
              </button>
              <button
                onClick={() => setTab('USED')}
                className={`flex-1 pb-2.5 text-xs font-black uppercase tracking-wider text-center cursor-pointer transition-colors ${
                  tab === 'USED' 
                    ? 'border-b-2 border-accent text-accent font-black' 
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Used Car
              </button>
            </div>

            {/* Selector dropdown fields */}
            <div className="space-y-4">
              {/* HP Selection */}
              <div className="text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Power (HP)</label>
                <select
                  value={selectedHp}
                  onChange={(e) => setSelectedHp(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
                >
                  <option value="">Choose HP Range</option>
                  <option value="130">Under 150 HP</option>
                  <option value="326">150 - 350 HP</option>
                  <option value="518">350 - 550 HP</option>
                  <option value="1020">Above 550 HP</option>
                </select>
              </div>

              {/* Brand Selection */}
              <div className="text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Select Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-border rounded-lg px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-accent font-semibold"
                >
                  <option value="">Choose Manufacturer</option>
                  <option value="porsche">Porsche</option>
                  <option value="tesla">Tesla</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes-Benz</option>
                  <option value="mahindra">Mahindra</option>
                </select>
              </div>

              {/* Submit Search */}
              <button
                onClick={handleSearch}
                className="w-full bg-primary hover:bg-slate-900 text-white font-extrabold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md mt-6 cursor-pointer text-xs uppercase tracking-wider"
              >
                <Search className="h-4.5 w-4.5" /> Search Cars
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}
