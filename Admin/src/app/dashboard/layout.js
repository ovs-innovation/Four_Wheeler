'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  LayoutDashboard,
  Car,
  Award,
  Newspaper,
  BookOpen,
  MessageSquare,
  Users,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { admin, isAuthenticated, loading, logout } = useAdminAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Manage Cars',
      href: '/dashboard/cars',
      icon: Car,
    },
    {
      label: 'Manage Brands',
      href: '/dashboard/brands',
      icon: Award,
    },
    {
      label: 'Manage News',
      href: '/dashboard/news',
      icon: Newspaper,
    },
    {
      label: 'Manage Blogs',
      href: '/dashboard/blogs',
      icon: BookOpen,
    },
    {
      label: 'Customer Enquiries',
      href: '/dashboard/enquiries',
      icon: MessageSquare,
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#0B0B0B] text-white">

      {/* Sidebar */}

      <aside className="w-72 bg-[#111111] border-r border-[#2A2A2A] flex flex-col">

        {/* Logo */}

        <div className="h-20 flex items-center px-7 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <img src="/logo-light.png" alt="4Pahia Logo" className="h-10 w-auto object-contain" />
            <span className="text-[10px] text-[#6B7280] uppercase tracking-widest font-bold border-l border-[#2A2A2A] pl-3 py-1">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 p-5 space-y-3">

          {navItems.map((item) => {

            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-[16px] px-4 py-3.5 transition-all duration-300 group ${active
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black shadow-md shadow-[0_0_15px_rgba(212,175,55,0.15)] font-bold'
                    : 'text-[#9CA3AF] hover:bg-[#1E1E1E] hover:text-white hover:translate-x-1'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={`transition-colors duration-300 ${active ? 'text-black' : 'text-[#6B7280] group-hover:text-[#D4AF37]'}`} />
                  <span className="font-semibold text-sm">
                    {item.label}
                  </span>
                </div>

                <ChevronRight
                  size={15}
                  className={`transition-colors duration-300 ${active
                      ? 'opacity-100 text-black'
                      : 'opacity-0 group-hover:opacity-100 text-[#D4AF37]'
                    }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Profile */}

        <div className="border-t border-[#2A2A2A] bg-[#171717]/20 p-5">

          <div className="flex items-center gap-3 mb-5">

            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F4B400] p-[2px] shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center font-black text-sm text-[#D4AF37]">
                  {admin?.name?.charAt(0)}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22C55E] border border-[#111111] rounded-full shadow-[0_0_4px_#22C55E]"></div>
            </div>

            <div>

              <h4 className="font-bold text-sm text-white tracking-tight">
                {admin?.name}
              </h4>

              <p className="text-[10px] text-[#9CA3AF] font-bold tracking-wider uppercase">
                {admin?.role}
              </p>

            </div>

          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full rounded-[14px] bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444] hover:text-white py-2.5 text-xs font-bold transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut size={14} />
              Sign Out
            </div>
          </button>

        </div>

      </aside>

      {/* Main */}

      <div className="flex-1 flex flex-col">

        {/* Header */}

        <header className="h-20 bg-[#131313] border-b border-[#2A2A2A] flex items-center justify-between px-8 shadow-sm">

          <div>

            <h1 className="text-3xl font-extrabold text-white tracking-tight capitalize font-sans">
              {pathname === '/dashboard'
                ? 'Dashboard'
                : pathname.split('/').pop()}
            </h1>

            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Welcome back, {admin?.name}
            </p>

          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">

            <div className="h-2 w-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-pulse"></div>

            <span className="text-[#22C55E] text-[10px] font-bold tracking-wider uppercase font-sans">
              System Online
            </span>

          </div>

        </header>

        {/* Content */}

        <main className="flex-1 bg-[#0B0B0B] p-8 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}