'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Lock, Mail, Key, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-8 shadow-2xl space-y-6">
        
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-[#F4B400] to-[#D4AF37] rounded-[10px] flex items-center justify-center text-black shadow-md shadow-amber-500/10">
            <Lock size={20} />
          </div>
          <h1 className="font-sans font-extrabold text-xl text-white tracking-tight uppercase">
            Four Wheeler Admin Portal
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            Enter credentials to access system directories.
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <Mail size={16} />
              </div>
              <input
                type="email"
                placeholder="admin@fourwheeler.com"
                className={`block w-full pl-10 pr-3 py-2.5 bg-[#151515] border rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:ring-1 transition-all ${
                  errors.email ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#303030] focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]'
                }`}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
              />
            </div>
            {errors.email && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6B7280]">
                <Key size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`block w-full pl-10 pr-10 py-2.5 bg-[#151515] border rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:ring-1 transition-all ${
                  errors.password ? 'border-[#EF4444] focus:ring-[#EF4444]/20' : 'border-[#303030] focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Must be at least 6 characters' }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B7280] hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black font-extrabold text-xs rounded-[14px] shadow-lg shadow-amber-500/10 hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer disabled:bg-[#1E1E1E] disabled:text-[#6B7280] disabled:shadow-none flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:translate-y-0"
          >
            {submitting ? (
              <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Sign In As Admin</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="http://localhost:3000" className="text-[10px] text-[#D4AF37] hover:text-[#F4B400] hover:underline transition-all">
            Back to Public Marketplace Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}

// Inline Link wrapper since next/link might not be fully cached
function Link({ href, children, className }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
