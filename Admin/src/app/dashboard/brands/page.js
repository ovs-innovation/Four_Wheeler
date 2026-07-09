'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../context/AdminAuthContext';
import { Award, Plus, Trash2, Edit, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function BrandsManager() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/brands');
      if (res.data && res.data.success) {
        setBrands(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
      toast.error('Failed to fetch manufacturer brands.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const openAddModal = () => {
    setEditBrand(null);
    reset({
      name: '',
      slug: '',
      logo: '🏍️',
      origin: 'India',
      founded: '',
      isPopular: false,
      isElectricOnly: false
    });
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditBrand(brand);
    reset({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      origin: brand.origin,
      founded: brand.founded || '',
      isPopular: brand.isPopular || false,
      isElectricOnly: brand.isElectricOnly || false
    });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      if (editBrand) {
        // Edit Brand
        const res = await adminApi.put(`/brands/${editBrand._id}`, data);
        if (res.data && res.data.success) {
          setBrands(brands.map(b => b._id === editBrand._id ? res.data.data : b));
          toast.success('Brand details updated successfully.');
          setModalOpen(false);
        }
      } else {
        // Add Brand
        const res = await adminApi.post('/brands', data);
        if (res.data && res.data.success) {
          setBrands([...brands, res.data.data]);
          toast.success('New manufacturer brand cataloged successfully.');
          setModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this brand and all its linked vehicles?')) {
      try {
        const res = await adminApi.delete(`/brands/${id}`);
        if (res.data && res.data.success) {
          setBrands(brands.filter(b => b._id !== id));
          toast.success('Brand deleted successfully.');
        }
      } catch (err) {
        toast.error('Failed to delete brand.');
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
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-sans font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
            <Award className="text-[#D4AF37]" /> Manage Brands
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">Add, update, or remove manufacturer directory entries from the catalog.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black font-extrabold text-xs py-2.5 px-4 rounded-[14px] shadow-lg hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> Add Manufacturer
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider bg-[#111111]/50">
                <th className="p-4">Logo</th>
                <th className="p-4">Brand Name</th>
                <th className="p-4">Slug Identifier</th>
                <th className="p-4">Origin Country</th>
                <th className="p-4">Founded Year</th>
                <th className="p-4">Popular</th>
                <th className="p-4">Electric-Only</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {brands.length > 0 ? (
                brands.map((brandItem) => (
                  <tr key={brandItem._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                    <td className="p-4 text-2xl">{brandItem.logo || '🏍️'}</td>
                    <td className="p-4 font-bold text-white">{brandItem.name}</td>
                    <td className="p-4 font-mono text-[#6B7280]">{brandItem.slug}</td>
                    <td className="p-4 text-[#9CA3AF] font-semibold">{brandItem.origin}</td>
                    <td className="p-4 text-[#9CA3AF]">{brandItem.founded || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${brandItem.isPopular ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#2A2A2A]'}`}></span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${brandItem.isElectricOnly ? 'bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-[#2A2A2A]'}`}></span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(brandItem)}
                        className="p-2 text-[#D4AF37] hover:text-black bg-[#D4AF37]/10 hover:bg-[#D4AF37] rounded-[14px] transition-colors cursor-pointer"
                        title="Edit Brand"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brandItem._id)}
                        className="p-2 text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444] rounded-[14px] transition-colors cursor-pointer"
                        title="Delete Brand"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-[#6B7280] font-semibold">
                    No manufacturer brands registered on the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                {editBrand ? 'Edit Manufacturer Details' : 'Add New Manufacturer'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={16} /></button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.name.message}</span>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Slug URL Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. royal-enfield"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('slug', { required: 'Slug is required' })}
                  />
                  {errors.slug && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.slug.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Logo (Emoji / Symbol)</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white text-center focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('logo', { required: 'Logo is required' })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Origin Country</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('origin', { required: 'Origin is required' })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Founded Year</label>
                  <input
                    type="number"
                    placeholder="e.g. 1901"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('founded')}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isPopular')}
                  />
                  <span>Popular Manufacturer</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isElectricOnly')}
                  />
                  <span>Electric-Only Brand</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#2A2A2A] hover:bg-[#1E1E1E] rounded-[14px] text-xs font-bold text-[#6B7280] hover:text-white transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black font-extrabold text-xs rounded-[14px] shadow-lg hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 cursor-pointer flex items-center gap-1"
                >
                  <Save size={13} /> {editBrand ? 'Save Changes' : 'Create Manufacturer'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
