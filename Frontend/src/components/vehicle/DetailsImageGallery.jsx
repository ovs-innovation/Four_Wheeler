'use client'

import React, { useState } from 'react'

export default function DetailsImageGallery({ images, title }) {
  const [activeIdx, setActiveIdx] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Primary Display Frame */}
      <div className="aspect-[16/10] bg-slate-100 rounded-2xl overflow-hidden border border-border">
        <img
          src={images[activeIdx]}
          alt={`${title} - View ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                activeIdx === idx 
                  ? 'border-accent scale-[0.98] shadow-sm' 
                  : 'border-border/60 hover:border-slate-400'
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
