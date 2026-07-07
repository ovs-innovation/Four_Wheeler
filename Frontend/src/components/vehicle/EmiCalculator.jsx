'use client'

import React, { useState } from 'react'
import { Coins, HelpCircle } from 'lucide-react'

export default function EmiCalculator({ vehiclePrice }) {
  // Initial states: Downpayment default to 20%, interest 9.5%, tenure 3 years
  const defaultDownpayment = Math.round(vehiclePrice * 0.2)
  const [downpayment, setDownpayment] = useState(defaultDownpayment)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenureYears, setTenureYears] = useState(3)

  const loanAmount = vehiclePrice - downpayment

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const r = interestRate / 12 / 100
  const n = tenureYears * 12
  const emi = loanAmount > 0 
    ? Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
    : 0

  const formatPrice = (val) => {
    return `₹ ${val.toLocaleString()}`
  }

  return (
    <div className="glass p-6 sm:p-8 rounded-2xl border border-border/80 space-y-6 text-left">
      <div>
        <h4 className="font-extrabold text-base text-primary mb-1 flex items-center gap-2">
          <Coins className="h-5 w-5 text-accent" /> Loan EMI Estimator
        </h4>
        <p className="text-xs text-slate-500 font-semibold">Estimate monthly interest rates & repayments</p>
      </div>

      <div className="space-y-4">
        {/* Loan Amount display */}
        <div className="flex justify-between items-center text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-lg border border-border">
          <span>Car Value</span>
          <span>{formatPrice(vehiclePrice)}</span>
        </div>

        {/* Downpayment Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Downpayment</span>
            <span className="text-primary font-black">{formatPrice(downpayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={vehiclePrice}
            step={10000}
            value={downpayment}
            onChange={(e) => setDownpayment(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Interest Rate (p.a.)</span>
            <span className="text-primary font-black">{interestRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={20}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-500">Loan Tenure</span>
            <span className="text-primary font-black">{tenureYears} Years</span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Dynamic monthly output */}
        <div className="bg-primary text-white p-4.5 rounded-xl border border-primary/20 text-center space-y-1">
          <span className="text-[10px] text-slate-300 font-extrabold uppercase tracking-widest block">Estimated Monthly EMI</span>
          <span className="text-2xl font-black text-accent">{formatPrice(emi)}</span>
          <span className="text-[9px] text-slate-400 block pt-0.5">*Based on primary bank estimations. Subject to terms.</span>
        </div>
      </div>
    </div>
  )
}
