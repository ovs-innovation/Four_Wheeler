'use client'

import React, { useState, useEffect } from 'react'
import { INITIAL_BLOGS } from '@/lib/mock-data'
import { Calendar, ArrowLeft, ArrowRight, BookOpen, Clock } from 'lucide-react'
import Link from 'next/link'

export default function NewsHubPage() {
  const [blogs, setBlogs] = useState([])
  const [selectedBlogId, setSelectedBlogId] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiBase}/blogs?limit=100`)
        const data = await response.json()
        if (data.success && data.data) {
          const blogArray = Array.isArray(data.data) ? data.data : (data.data.blogs || [])
          setBlogs(blogArray.map(b => ({ ...b, id: b.id || b._id })))
        } else {
          loadFallback()
        }
      } catch (err) {
        console.error('Failed to load articles from backend, using fallback:', err.message)
        loadFallback()
      }
    }

    const loadFallback = () => {
      const stored = localStorage.getItem('cj_blogs')
      setBlogs(stored ? JSON.parse(stored) : INITIAL_BLOGS)
    }

    fetchBlogs()
  }, [])

  const selectedBlog = blogs.find((b) => b.id === selectedBlogId)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back button (if reading full article) */}
      {selectedBlogId && (
        <div className="text-left">
          <button
            onClick={() => setSelectedBlogId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:text-secondary uppercase cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Back to News Feed
          </button>
        </div>
      )}

      {/* Title */}
      {!selectedBlogId ? (
        <div className="text-left">
          <span className="text-xs font-semibold text-accent tracking-widest uppercase">AUTOMOBILE HUB</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mt-2">News & Vehicle Updates</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Stay updated with premium launches, reviews, and market statistics</p>
        </div>
      ) : (
        <div className="text-left space-y-3">
          <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-primary leading-tight tracking-tight">
            {selectedBlog.title}
          </h1>
          <div className="h-1 w-16 bg-accent mt-2" />
        </div>
      )}

      {/* Grid details or Reader view */}
      {!selectedBlogId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white border border-border p-6 rounded-2xl flex flex-col sm:flex-row gap-6 hover:border-accent hover:shadow-md transition-all text-left"
            >
              <div className="sm:w-1/3 aspect-video sm:aspect-square overflow-hidden bg-slate-100 rounded-xl shrink-0">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <h3 className="font-extrabold text-base text-primary line-clamp-2 hover:text-accent">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                    {blog.content}
                  </p>
                </div>
                
                <div>
                  <button
                    onClick={() => setSelectedBlogId(blog.id)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary hover:text-secondary uppercase cursor-pointer"
                  >
                    Read Full Story <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          
          {/* Main Story content */}
          <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-border">
            <div className="aspect-video w-full overflow-hidden bg-slate-100 rounded-xl border border-border">
              <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
            </div>
            
            <p className="text-sm text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
              {selectedBlog.content}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Disclaimer: The viewpoints expressed in this analysis represent editorial evaluations for informational purposes. Product configurations, pricing options, and technical specifications are subject to brand verification checkpoints.
            </p>
          </div>

          {/* Sidebar recommendations */}
          <div className="space-y-6">
            <div className="bg-white border border-border p-6 rounded-2xl space-y-4 shadow-sm">
              <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-1.5"><BookOpen className="h-4.5 w-4.5 text-accent" /> Other Stories</h4>
              
              <div className="divide-y divide-slate-100">
                {blogs.filter(b => b.id !== selectedBlogId).map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBlogId(b.id)}
                    className="w-full text-left py-3 block hover:text-accent font-extrabold text-xs text-primary transition-colors cursor-pointer line-clamp-2"
                  >
                    {b.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-primary text-white p-6 rounded-2xl space-y-4 border border-primary/20">
              <h4 className="font-black text-xs uppercase tracking-wider text-accent flex items-center gap-1.5"><Clock className="h-4.5 w-4.5" /> Market Inquiries</h4>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Looking to buy or sell a premium vehicle? Browse our catalog for verified listings.
              </p>
              <Link
                href="/vehicles"
                className="bg-primary hover:bg-secondary text-white font-extrabold text-xs px-4 py-2.5 rounded-lg transition-colors block text-center uppercase tracking-wider shadow-sm"
              >
                Browse Catalog
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}
