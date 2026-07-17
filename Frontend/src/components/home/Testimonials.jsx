'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Suresh Kumar",
      role: "Buyer, New Delhi",
      quote: "Bought a certified pre-owned Porsche 911 GT3 RS through 4Pahia. The mechanical evaluation logs were 100% accurate, and the customer assistance during ownership transfer was extremely swift.",
      rating: 5
    },
    {
      id: 2,
      name: "Satnam Singh",
      role: "Dealer Manager, Apex Motors, Mumbai",
      quote: "Listing our premium inventory on 4Pahia has increased our buyer inquiries significantly. The lead management and call log triggers work flawlessly.",
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-slate-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-16">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Verified Buyer Testimonials</h3>
          <div className="h-1 w-16 bg-accent mx-auto mt-3" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((r) => (
            <div 
              key={r.id} 
              className="bg-white border border-border p-6 rounded-2xl shadow-sm space-y-4 text-left relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed italic font-semibold">
                  "{r.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                <div>
                  <h4 className="text-sm font-black text-primary">{r.name}</h4>
                  <p className="text-[10px] text-muted-foreground font-bold">{r.role}</p>
                </div>
                <Quote className="h-8 w-8 text-slate-100 shrink-0" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
