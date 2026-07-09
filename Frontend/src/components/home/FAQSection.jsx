'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null)

  const faqs = [
    {
      q: "What is the process to get the registration number for luxury cars in India?",
      a: "Luxury car registration is processed through local state RTOs. High-security registration plates (HSRP), temporary TC configurations, and state road tax computations must be cleared through dealer invoicing before driving public roads."
    },
    {
      q: "How does Four Wheeler verify used car listings?",
      a: "Every certified pre-owned car listed goes through a comprehensive 120-point checklist checking engine health, suspension alignment, onboard electronics diagnostic logs, paint thickness parameters (to verify accidents), and previous service record logs."
    },
    {
      q: "Can I get a bank loan for buying a used luxury car?",
      a: "Yes! Major nationalized and private banks offer second-hand car loan plans up to 80% of valuation sheets depending on the car model year, odometer mileage, and borrower credit history profile."
    },
    {
      q: "What documents are required to transfer used car ownership at RTO?",
      a: "You will need the original Registration Certificate (RC), signed Form 29 and 30, NOC certificate (if moving across states), valid comprehensive car insurance copy, pollution under control (PUC) certificate, and ID proof records of both buyer and seller."
    }
  ]

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="py-20 bg-white border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">Frequently Asked Questions</h3>
          <div className="h-1 w-16 bg-accent mx-auto mt-3" />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div 
                key={idx} 
                className="border border-border rounded-xl bg-slate-50 overflow-hidden text-left"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-sm font-bold text-primary focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-2"><HelpCircle className="h-4.5 w-4.5 text-accent shrink-0" /> {faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 transition-transform text-slate-400 ${isOpen ? 'rotate-180 text-accent' : ''}`} />
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-semibold border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
