'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../context/AdminAuthContext';
import {
  Settings,
  Award,
  MessageSquare,
  Users,
  TrendingUp,
  Zap,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function OverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/admin/stats');
        if (res.data && res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 p-6 rounded-[22px] flex items-center gap-3 text-[#EF4444]">
        <AlertTriangle size={20} />
        <span>Failed to load system dashboard statistics. Please ensure the backend is running.</span>
      </div>
    );
  }

  const { counts, recentEnquiries, recentUsers } = stats;

  // Prepare chart datasets (using Gold and Emerald)
  const donutData = {
    labels: ['Petrol / ICE Models', 'Electric Models (EV)'],
    datasets: [
      {
        data: [counts.cars - counts.electricCars, counts.electricCars],
        backgroundColor: ['#D4AF37', '#22C55E'],
        borderWidth: 1.5,
        borderColor: '#171717'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9CA3AF', font: { size: 10, family: 'sans-serif' } }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic metric summaries grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#171717] border border-[#2A2A2A] p-6 rounded-[22px] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
          <div>
            <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Cataloged Cars</div>
            <div className="text-3xl font-black text-white mt-1.5">{counts.cars}</div>
            <span className="text-[9px] font-semibold text-[#9CA3AF] mt-1 flex items-center gap-0.5">
              <Flame size={10} className="text-[#D4AF37]" /> {counts.popularCars} Popular Models
            </span>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#2A2A2A] text-[#D4AF37] rounded-full shadow-sm"><Settings size={20} /></div>
        </div>

        <div className="bg-[#171717] border border-[#2A2A2A] p-6 rounded-[22px] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
          <div>
            <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Total Brands</div>
            <div className="text-3xl font-black text-white mt-1.5">{counts.brands}</div>
            <span className="text-[9px] font-semibold text-[#9CA3AF] mt-1 flex items-center gap-0.5">
              <Zap size={10} className="text-[#22C55E]" /> Active Manufacturers
            </span>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#2A2A2A] text-[#D4AF37] rounded-full shadow-sm"><Award size={20} /></div>
        </div>

        <div className="bg-[#171717] border border-[#2A2A2A] p-6 rounded-[22px] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
          <div>
            <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">Active Enquiries</div>
            <div className="text-3xl font-black text-white mt-1.5">{counts.enquiries}</div>
            <span className="text-[9px] font-semibold text-[#9CA3AF] mt-1 flex items-center gap-0.5">
              <TrendingUp size={10} className="text-[#D4AF37]" /> Callbacks & Testrides
            </span>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#2A2A2A] text-[#D4AF37] rounded-full shadow-sm"><MessageSquare size={20} /></div>
        </div>

        <div className="bg-[#171717] border border-[#2A2A2A] p-6 rounded-[22px] flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:-translate-y-1.5 hover:border-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
          <div>
            <div className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest font-sans">Registered Users</div>
            <div className="text-3xl font-black text-white mt-1.5">{counts.users}</div>
            <span className="text-[9px] font-semibold text-[#9CA3AF] mt-1 flex items-center gap-0.5">
              <Users size={10} className="text-purple-400" /> Customer Accounts
            </span>
          </div>
          <div className="p-3.5 bg-[#111111] border border-[#2A2A2A] text-[#D4AF37] rounded-full shadow-sm"><Users size={20} /></div>
        </div>
      </div>

      {/* Visual Analytics Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Recent Enquiries Table */}
        <div className="lg:col-span-8 bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">Recent Customer Enquiries</h3>
            <a href="/dashboard/enquiries" className="text-[10px] font-bold text-[#D4AF37] hover:text-[#F4B400] hover:underline transition-colors duration-300">
              View All Enquiries →
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Vehicle Details</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]/40">
                {recentEnquiries.length > 0 ? (
                  recentEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                      <td className="py-3.5 pr-2">
                        <div className="font-bold text-white">{enquiry.name}</div>
                        <div className="text-[10px] text-[#6B7280]">{enquiry.phone}</div>
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-[#9CA3AF]">{enquiry.vehicleTitle}</div>
                        <div className="text-[10px] text-[#6B7280]">{enquiry.bikeBrand}</div>
                      </td>
                      <td className="py-3.5">
                        <span className="bg-[#111111] border border-[#2A2A2A] text-white px-2.5 py-1 rounded-full text-[9px] font-bold">
                          {enquiry.type}
                        </span>
                      </td>
                      <td className="py-3.5 text-[#9CA3AF] font-semibold">{enquiry.date}</td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${enquiry.status === 'Pending' ? 'bg-[#D4AF37]' : enquiry.status === 'Approved' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
                          }`}></span>
                        <span className="font-bold text-[10px] uppercase text-[#9CA3AF]">{enquiry.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-[#6B7280] font-semibold">
                      No active enquiry requests registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engine Distribution Chart */}
        <div className="lg:col-span-4 bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow flex flex-col justify-between space-y-4">
          <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">Power Source Distribution</h3>
          <div className="max-w-[190px] mx-auto py-4">
            <Doughnut data={donutData} options={chartOptions} />
          </div>
          <div className="border-t border-[#2A2A2A] pt-4 text-center text-[10px] text-[#6B7280] font-semibold">
            EV models represent <strong className="text-[#22C55E] font-bold">{((counts.electricCars / counts.cars) * 100).toFixed(1)}%</strong> of catalog.
          </div>
        </div>

      </div>

      {/* Users & Articles Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Registered Users */}
        <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">Recent Customer Signups</h3>
            <a href="/dashboard/users" className="text-[10px] font-bold text-[#D4AF37] hover:text-[#F4B400] hover:underline transition-all duration-300">
              Manage Users →
            </a>
          </div>

          <div className="divide-y divide-[#2A2A2A]/40">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user._id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-[#111111] text-white border border-[#2A2A2A] font-bold text-xs flex items-center justify-center uppercase">
                      {user.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{user.name}</h4>
                      <p className="text-[10px] text-[#6B7280]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-[#9CA3AF]">{user.city}, {user.state}</div>
                    <span className="text-[8px] bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20 px-2 py-0.5 rounded-full font-extrabold uppercase">
                      {user.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-[#6B7280] font-semibold">No registered users.</div>
            )}
          </div>
        </div>

        {/* Content Manager quick links */}
        <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">Marketplace Content Manager</h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Verify press releases and riding guides loaded onto the system directories. Ensure media sizes are standard for fast page loading.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dashboard/news"
              className="bg-[#171717] border border-[#2A2A2A] hover:bg-[#1E1E1E] p-4 rounded-[14px] flex items-center justify-between group transition-all duration-300 hover:border-[#D4AF37]"
            >
              <div>
                <div className="text-xs font-bold text-white">{counts.news} Articles</div>
                <div className="text-[9px] text-[#6B7280] font-bold uppercase mt-1">Manage News</div>
              </div>
              <TrendingUp size={16} className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>

            <a
              href="/dashboard/blogs"
              className="bg-[#171717] border border-[#2A2A2A] hover:bg-[#1E1E1E] p-4 rounded-[14px] flex items-center justify-between group transition-all duration-300 hover:border-[#D4AF37]"
            >
              <div>
                <div className="text-xs font-bold text-white">{counts.blogs} Guides</div>
                <div className="text-[9px] text-[#6B7280] font-bold uppercase mt-1">Manage Blogs</div>
              </div>
              <TrendingUp size={16} className="text-[#22C55E] group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
