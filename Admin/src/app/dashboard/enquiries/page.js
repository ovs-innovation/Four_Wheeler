'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../context/AdminAuthContext';
import { MessageSquare, Trash2, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/enquiries');
      if (res.data && res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      toast.error('Failed to fetch enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await adminApi.patch(`/enquiries/${id}`, { status: newStatus });
      if (res.data && res.data.success) {
        setEnquiries(enquiries.map(enq => enq._id === id ? { ...enq, status: newStatus } : enq));
        toast.success(`Enquiry status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this customer enquiry?')) {
      try {
        const res = await adminApi.delete(`/enquiries/${id}`);
        if (res.data && res.data.success) {
          setEnquiries(enquiries.filter(enq => enq._id !== id));
          toast.success('Customer enquiry deleted successfully.');
        }
      } catch (err) {
        toast.error('Failed to delete enquiry.');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-sans font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
            <MessageSquare className="text-[#D4AF37]" /> Customer Enquiries
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">Review callbacks, EMI quote sheets, and test drive schedules submitted by users.</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider bg-[#111111]/50">
                <th className="p-4">Customer Details</th>
                <th className="p-4">Vehicle Requested</th>
                <th className="p-4">Submission Category</th>
                <th className="p-4">Message / Notes</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status Update</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[10px] bg-[#111111] text-white border border-[#2A2A2A] flex items-center justify-center font-bold text-xs">
                          {enquiry.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-white">{enquiry.name}</div>
                          <div className="text-[10px] text-[#6B7280] flex flex-col gap-0.5 mt-0.5">
                            <span className="flex items-center gap-0.5"><Phone size={10} /> {enquiry.phone}</span>
                            <span className="flex items-center gap-0.5"><Mail size={10} /> {enquiry.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{enquiry.bikeName}</div>
                      <div className="text-[10px] text-[#6B7280]">{enquiry.bikeBrand}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-[#111111] border border-[#2A2A2A] text-[#9CA3AF] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        {enquiry.type}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate" title={enquiry.message}>
                      <span className="italic text-[#6B7280]">{enquiry.message || 'No additional note.'}</span>
                    </td>
                    <td className="p-4 text-[#9CA3AF] font-semibold">{enquiry.date}</td>
                    <td className="p-4">
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleUpdateStatus(enquiry._id, e.target.value)}
                        className="py-1.5 px-3 rounded-full bg-[#151515] border border-[#303030] text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 cursor-pointer transition-all"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Contacted">Contacted</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteEnquiry(enquiry._id)}
                        className="p-2 text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444] rounded-[14px] transition-colors cursor-pointer"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#6B7280] font-semibold">
                    No client callback or enquiry requests registered on the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
