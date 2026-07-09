'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../context/AdminAuthContext';
import { Users, Trash2, Ban, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UsersDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user accounts:', err);
      toast.error('Failed to fetch user accounts directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const msg = `Are you sure you want to ${newStatus === 'blocked' ? 'BLOCK' : 'UNBLOCK'} this user?`;
    if (window.confirm(msg)) {
      try {
        const res = await adminApi.patch(`/users/${id}/status`, { status: newStatus });
        if (res.data && res.data.success) {
          setUsers(users.map(u => u._id === id ? { ...u, status: newStatus } : u));
          toast.success(`User successfully ${newStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update user status.');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this customer account? This cannot be undone.')) {
      try {
        const res = await adminApi.delete(`/users/${id}`);
        if (res.data && res.data.success) {
          setUsers(users.filter(u => u._id !== id));
          toast.success('Customer account deleted successfully.');
        }
      } catch (err) {
        toast.error('Failed to delete customer account.');
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
      <div>
        <h1 className="text-xl font-sans font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
          <Users className="text-[#D4AF37]" /> User Directory
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">Manage customer account access, block abusers, and review registered user details.</p>
      </div>

      {/* Main Table */}
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider bg-[#111111]/50">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Location (City, State)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {users.length > 0 ? (
                users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[10px] bg-[#111111] text-white border border-[#2A2A2A] flex items-center justify-center font-bold text-xs">
                          {userItem.name[0]}
                        </div>
                        <div className="font-bold text-white">{userItem.name}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium flex-shrink-0">
                      <span className="flex items-center gap-1"><Mail size={12} className="text-[#6B7280]" /> {userItem.email}</span>
                    </td>
                    <td className="p-4 font-semibold text-[#9CA3AF]">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-[#6B7280]" /> {userItem.phone || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-[#9CA3AF]">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-[#6B7280]" />
                        {userItem.city || 'N/A'}, {userItem.state || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        userItem.status === 'active'
                          ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                          : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                      }`}>
                        {userItem.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(userItem._id, userItem.status)}
                        className={`p-2 rounded-[14px] transition-colors cursor-pointer ${
                          userItem.status === 'active'
                            ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black'
                            : 'text-[#22C55E] bg-[#22C55E]/10 hover:bg-[#22C55E] hover:text-white'
                        }`}
                        title={userItem.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        <Ban size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userItem._id)}
                        className="p-2 text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444] rounded-[14px] transition-colors cursor-pointer"
                        title="Delete User Account"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#6B7280] font-semibold">
                    No registered user accounts found in directory database.
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
