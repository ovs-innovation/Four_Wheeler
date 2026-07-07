import Hero from '@/components/home/Hero'
import FeaturedBrands from '@/components/home/FeaturedBrands'
import VehicleListingsTab from '@/components/home/VehicleListingsTab'
import FAQSection from '@/components/home/FAQSection'
import Testimonials from '@/components/home/Testimonials'
import Link from 'next/link'
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react'
import { INITIAL_VEHICLES, INITIAL_BLOGS } from '@/lib/mock-data'

export default async function HomePage() {
  const vehicles = INITIAL_VEHICLES.slice(0, 6)
  const blogs = INITIAL_BLOGS

  const budgetRanges = [
    { label: 'Below 15 Lakh', query: 'maxPrice=1500000' },
    { label: '15 Lakh - 30 Lakh', query: 'maxPrice=3000000' },
    { label: '30 Lakh - 75 Lakh', query: 'maxPrice=7500000' },
    { label: '75 Lakh - 1.5 Crore', query: 'maxPrice=15000000' },
    { label: 'Above 1.5 Crore', query: '' }
  ]

  const hpCategories = [
    { label: 'Under 150 HP', hp: '130' },
    { label: '151 - 250 HP', hp: '200' },
    { label: '251 - 350 HP', hp: '326' },
    { label: '351 - 500 HP', hp: '450' },
    { label: 'Above 500 HP', hp: '518' }
  ]

  const indianStates = [
    { name: 'Maharashtra', code: 'MH' },
    { name: 'Delhi NCR', code: 'DL' },
    { name: 'Karnataka', code: 'KA' },
    { name: 'Tamil Nadu', code: 'TN' },
    { name: 'Haryana', code: 'HR' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Telangana', code: 'TS' },
    { name: 'Gujarat', code: 'GJ' },
    { name: 'Rajasthan', code: 'RJ' },
    { name: 'Uttar Pradesh', code: 'UA' },
    { name: 'West Bengal', code: 'WB' },
    { name: 'Kerala', code: 'KL' }
  ]

  return (
    <div className="relative bg-background">
      {/* 1. Hero Search Card */}
      <Hero />

      {/* 2. Popular Brands */}
      <FeaturedBrands />

      {/* 3. Used Cars list */}
      <VehicleListingsTab initialVehicles={vehicles} />

      {/* 4. Get Used Cars in States */}
      <section className="py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-10 text-left">
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Get Used Cars in States</h2>
            <div className="h-1 w-12 bg-accent mt-2" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
            {indianStates.map((state) => (
              <Link
                key={state.code}
                href={`/vehicles?search=${state.name}`}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-border/80 rounded-xl hover:border-accent hover:bg-white transition-all group"
              >
                {/* Round icon representing state map placeholder */}
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs mb-2.5 group-hover:bg-accent group-hover:text-white transition-colors">
                  {state.code}
                </div>
                <span className="text-xs font-extrabold text-slate-700 group-hover:text-accent transition-colors">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Cars by Budget & HP Category */}
      <section className="py-16 bg-slate-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* Left: Budget */}
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-black text-primary uppercase tracking-tight">Cars by Budget</h3>
                <div className="h-1 w-8 bg-accent mt-2" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {budgetRanges.map((range) => (
                  <Link
                    key={range.label}
                    href={`/vehicles?${range.query}`}
                    className="flex items-center justify-between p-4 bg-white border border-border rounded-xl font-extrabold text-xs text-slate-700 hover:border-accent hover:text-accent transition-all"
                  >
                    <span>{range.label}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: HP categories */}
            <div className="space-y-6 text-left">
              <div>
                <h3 className="text-lg font-black text-primary uppercase tracking-tight">Cars by HP Range</h3>
                <div className="h-1 w-8 bg-accent mt-2" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hpCategories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={`/vehicles?search=${cat.hp}`}
                    className="p-3 bg-white border border-border rounded-lg font-extrabold text-xs text-slate-700 text-center hover:border-accent hover:text-accent transition-all block"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Car Junction Certification Protection */}
      <section className="py-16 bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex p-3.5 rounded-full bg-accent/10 text-accent mb-2">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h3 className="text-2xl font-black text-primary tracking-tight">Car Junction Certified Protection</h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-2xl mx-auto">
            Get complete peace of mind with our 120-point mechanical evaluation. We check engine compression values, brake responsiveness, suspension wear, and onboard diagnostics logs so you buy with total confidence.
          </p>
        </div>
      </section>

      {/* 7. Automobile News / Car Updates */}
      <section id="news" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <h2 className="text-xl font-black text-primary uppercase tracking-tight">Automobile News / Car Updates</h2>
            <div className="h-1 w-12 bg-accent mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                className="bg-white border border-border p-5 rounded-xl flex flex-col sm:flex-row gap-5 hover:border-accent/40 transition-colors text-left"
              >
                <div className="sm:w-1/3 aspect-video sm:aspect-square overflow-hidden bg-slate-100 rounded-lg shrink-0">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <h4 className="font-extrabold text-sm text-primary line-clamp-2 hover:text-accent">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold leading-normal line-clamp-2">
                      {blog.content}
                    </p>
                  </div>
                  <div>
                    <Link 
                      href={`/vehicles`} 
                      className="inline-flex items-center gap-1 text-[10px] font-black text-primary hover:text-secondary uppercase"
                    >
                      Read Full Article <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials & FAQS */}
      <Testimonials />
      <FAQSection />
    </div>
  )
}
