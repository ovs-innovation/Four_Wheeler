'use client'

import Link from 'next/link'

export default function FeaturedBrands() {
  const brands = [
    { name: 'Porsche', slug: 'porsche', color: '#1a1a1a' },
    { name: 'Tesla', slug: 'tesla', color: '#cc0000' },
    { name: 'BMW', slug: 'bmw', color: '#1c69d4' },
    { name: 'Mercedes-Benz', slug: 'mercedes', color: '#0d0d0d' },
    { name: 'Mahindra', slug: 'mahindra', color: '#dd1a1a' },
    { name: 'Audi', slug: 'audi', color: '#262626' },
    { name: 'Land Rover', slug: 'landrover', color: '#0b3c24' },
    { name: 'Lamborghini', slug: 'lamborghini', color: '#bfa15f' },
    { name: 'Lexus', slug: 'lexus', color: '#112244' }
  ]

  return (
    <section className="py-16 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title */}
        <div className="mb-12 text-left">
          <h2 className="text-xl font-black text-primary uppercase tracking-tight">Cars By Brands</h2>
          <div className="h-1 w-12 bg-accent mt-2" />
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/vehicles?brand=${brand.slug}`}
              className="flex flex-col items-center justify-between p-4 border border-border/80 rounded-xl hover:border-accent hover:shadow-md transition-all group"
            >
              {/* Logo block */}
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-inner mb-3 uppercase"
                style={{ backgroundColor: brand.color }}
              >
                {brand.name.substring(0, 2)}
              </div>
              <span className="text-xs font-extrabold text-slate-700 group-hover:text-accent transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center justify-center text-xs font-black uppercase border border-accent hover:bg-accent hover:text-white text-accent px-6 py-2.5 rounded-lg transition-all"
          >
            View All Car Brands
          </Link>
        </div>

      </div>
    </section>
  )
}
