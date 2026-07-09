'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../context/AdminAuthContext';
import { Settings, Plus, Trash2, Edit, X, Save, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function CarsManager() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const loadData = async () => {
    try {
      setLoading(true);
      const [resCars, resBrands] = await Promise.all([
        adminApi.get('/cars?limit=1000'),
        adminApi.get('/brands')
      ]);
      if (resCars.data?.success) {
        setCars(resCars.data.data.cars || resCars.data.data.bikes || []);
      }
      if (resBrands.data?.success) setBrands(resBrands.data.data);
    } catch (err) {
      console.error('Failed to load cars/brands data:', err);
      toast.error('Failed to load catalog directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditCar(null);
    setUploadedImages([]);
    reset({
      name: '',
      brand: '',
      price: '',
      engineDisplacement: '',
      maxPower: '',
      mileage: '',
      curbWeight: '',
      fuelCapacity: '',
      bodyType: 'SUV',
      transmission: 'AUTOMATIC',
      fuelType: 'PETROL',
      isElectric: false,
      isPopular: false,
      isLatest: false,
      isUpcoming: false
    });
    setModalOpen(true);
  };

  const openEditModal = (car) => {
    setEditCar(car);
    // Support either array or string gallery
    let gallery = [];
    if (Array.isArray(car.galleryImages) && car.galleryImages.length > 0) {
      gallery = car.galleryImages;
    } else if (car.images && typeof car.images === 'string') {
      gallery = car.images.split(',').filter(Boolean);
    } else if (car.thumbnail) {
      gallery = [car.thumbnail];
    }
    setUploadedImages(gallery);

    reset({
      name: car.modelName || car.name || '',
      brand: car.brand || '',
      price: car.price || '',
      engineDisplacement: car.engineCC || car.engine || '',
      maxPower: car.power || '',
      mileage: car.mileage || '',
      curbWeight: car.kerbWeight || '',
      fuelCapacity: car.fuelTank || '',
      bodyType: car.bodyType || 'SUV',
      transmission: car.transmission || 'AUTOMATIC',
      fuelType: car.fuelType || 'PETROL',
      isElectric: car.isElectric || car.fuelType === 'ELECTRIC' || false,
      isPopular: car.isPopular || false,
      isLatest: car.isLatest || false,
      isUpcoming: car.isUpcoming || false
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await adminApi.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data?.success) {
        setUploadedImages([...uploadedImages, res.data.data.url]);
        toast.success('Image file uploaded successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, idx) => idx !== index));
  };

  const onSubmit = async (data) => {
    if (uploadedImages.length === 0) {
      toast.error('Please upload at least one vehicle image.');
      return;
    }

    const matchedBrand = brands.find(b => b.name === data.brand);
    const brandSlug = matchedBrand ? matchedBrand.slug : data.brand.toLowerCase().replace(/ /g, '-');
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const carPayload = {
      modelName: data.name,
      brand: data.brand,
      brandSlug,
      slug,
      category: 'car',
      isElectric: !!data.isElectric || data.fuelType === 'ELECTRIC',
      isPopular: !!data.isPopular,
      isLatest: !!data.isLatest,
      isUpcoming: !!data.isUpcoming,
      price: Number(data.price),
      mileage: Number(data.mileage),
      engineCC: Number(data.engineDisplacement) || 0,
      engineSize: data.engineDisplacement ? `${data.engineDisplacement} cc` : '',
      power: Number(data.maxPower) || 0,
      transmission: data.transmission,
      bodyType: data.bodyType,
      fuelType: data.isElectric ? 'ELECTRIC' : data.fuelType,
      thumbnail: uploadedImages[0],
      galleryImages: uploadedImages,
      images: uploadedImages.join(','),
      kerbWeight: Number(data.curbWeight) || 0,
      fuelTank: Number(data.fuelCapacity) || 0
    };

    try {
      if (editCar) {
        // Edit Car
        const res = await adminApi.put(`/cars/${editCar._id}`, carPayload);
        if (res.data?.success) {
          setCars(cars.map(c => c._id === editCar._id ? res.data.data : c));
          toast.success('Car specs updated successfully!');
          setModalOpen(false);
        }
      } else {
        // Add Car
        const res = await adminApi.post('/cars', carPayload);
        if (res.data?.success) {
          setCars([...cars, res.data.data]);
          toast.success('New vehicle added to catalog successfully!');
          setModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this vehicle from the catalog?')) {
      try {
        const res = await adminApi.delete(`/cars/${id}`);
        if (res.data?.success) {
          setCars(cars.filter(c => c._id !== id));
          toast.success('Vehicle deleted successfully.');
        }
      } catch (err) {
        toast.error('Failed to delete vehicle.');
      }
    }
  };

  // Filter logic
  const filteredCars = cars.filter(c => {
    const modelStr = c.modelName || c.name || '';
    const brandStr = c.brand || '';
    const nameMatch = modelStr.toLowerCase().includes(searchQuery.toLowerCase()) || brandStr.toLowerCase().includes(searchQuery.toLowerCase());
    const brandMatch = brandFilter === '' || brandStr === brandFilter;
    return nameMatch && brandMatch;
  });

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-sans font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
            <Settings className="text-[#D4AF37]" /> Manage Cars
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">Review specifications, modify price listings, toggle statuses, and edit images.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black font-extrabold text-xs py-2.5 px-4 rounded-[14px] shadow-lg hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={14} /> Add Four-Wheeler
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-[#171717] border border-[#2A2A2A] p-4 rounded-[22px] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Search by model or manufacturer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-xs pl-3 pr-3 py-2.5 border border-[#303030] bg-[#151515] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
        />

        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="w-full sm:max-w-xs px-3 py-2.5 border border-[#303030] bg-[#151515] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
        >
          <option value="">Filter by Manufacturer (All)</option>
          {brands.map(b => (
            <option key={b._id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider bg-[#111111]/50">
                <th className="p-4">Model Details</th>
                <th className="p-4">Body Class</th>
                <th className="p-4">Ex-Showroom Price</th>
                <th className="p-4">Engine Specs</th>
                <th className="p-4">Mileage</th>
                <th className="p-4">Badges (Pop/Lat/Upc)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {filteredCars.length > 0 ? (
                filteredCars.map((carItem) => {
                  const firstImg = (Array.isArray(carItem.galleryImages) && carItem.galleryImages[0]) || 
                                   (carItem.images && typeof carItem.images === 'string' && carItem.images.split(',')[0]) || 
                                   carItem.thumbnail || 
                                   'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e';
                  const isCarElectric = carItem.isElectric || carItem.fuelType === 'ELECTRIC';
                  return (
                    <tr key={carItem._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={firstImg}
                            alt={carItem.modelName || carItem.name}
                            className="w-14 h-10 object-cover rounded-[10px] border border-[#2A2A2A] flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white">{carItem.modelName || carItem.name}</div>
                            <div className="text-[10px] text-[#6B7280]">{carItem.brand} • ID: {carItem.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#111111] border border-[#2A2A2A] text-[#9CA3AF] px-2.5 py-1 rounded-full text-[9px] font-bold uppercase">
                          {carItem.bodyType}
                        </span>
                      </td>
                      <td className="p-4 text-[#D4AF37] font-extrabold text-sm">
                        ₹ {(carItem.price / 100000).toFixed(2)} Lakh
                      </td>
                      <td className="p-4 text-[#9CA3AF]">
                        {isCarElectric ? (
                          <span className="text-[#22C55E] font-bold uppercase text-[9px]">Electric Drive</span>
                        ) : (
                          <span>{carItem.engineCC || carItem.engine || 0} cc • {carItem.power || 0} hp</span>
                        )}
                      </td>
                      <td className="p-4 text-[#9CA3AF] font-semibold">{carItem.mileage} kmpl</td>
                      <td className="p-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {carItem.isPopular && <span className="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Popular</span>}
                          {carItem.isLatest && <span className="bg-[#F4B400]/10 text-[#F4B400] border border-[#F4B400]/20 text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Latest</span>}
                          {carItem.isUpcoming && <span className="bg-[#6B7280]/15 text-[#9CA3AF] border border-[#2A2A2A] text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Upcoming</span>}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(carItem)}
                          className="p-2 text-[#D4AF37] hover:text-black bg-[#D4AF37]/10 hover:bg-[#D4AF37] rounded-[14px] transition-colors cursor-pointer"
                          title="Edit Specs"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCar(carItem._id)}
                          className="p-2 text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444] rounded-[14px] transition-colors cursor-pointer"
                          title="Delete Vehicle"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#6B7280] font-semibold">
                    No matching vehicles found in catalog database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto px-4 py-8">
          <div className="w-full max-w-2xl bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow-2xl space-y-6 my-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                {editCar ? 'Edit Vehicle Specifications' : 'Add New Four-Wheeler'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={16} /></button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Model Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Creta SX"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.name.message}</span>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Brand / Manufacturer</label>
                  <select
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
                    {...register('brand', { required: 'Brand is required' })}
                  >
                    <option value="">Select Brand</option>
                    {brands.map(b => (
                      <option key={b._id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                  {errors.brand && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.brand.message}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Ex-Showroom Price (INR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1550000"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('price', { required: 'Price is required' })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Mileage (kmpl)</label>
                  <input
                    type="number"
                    placeholder="e.g. 18"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('mileage', { required: 'Mileage is required' })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Body Class Type</label>
                  <select
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
                    {...register('bodyType')}
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Transmission</label>
                  <select
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
                    {...register('transmission')}
                  >
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Fuel Type</label>
                  <select
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
                    {...register('fuelType')}
                  >
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Engine Size (cc)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1497"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('engineDisplacement')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Peak Power (hp)</label>
                  <input
                    type="number"
                    placeholder="e.g. 113"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('maxPower')}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Kerb Weight (kg)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1250"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('curbWeight')}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Fuel Tank (Litres)</label>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('fuelCapacity')}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-[#2A2A2A]">
                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isElectric')}
                  />
                  <span>Electric (EV)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isPopular')}
                  />
                  <span>Popular Vehicle</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isLatest')}
                  />
                  <span>Latest Launch</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-[#9CA3AF] cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-[#303030] bg-[#151515] text-[#D4AF37] focus:ring-[#D4AF37]/20 w-4 h-4 cursor-pointer"
                    {...register('isUpcoming')}
                  />
                  <span>Upcoming Launch</span>
                </label>
              </div>

              {/* Image Manager */}
              <div className="space-y-3 pt-4 border-t border-[#2A2A2A]">
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Vehicle Images Gallery</label>
                
                {/* Upload Action */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-[#171717] border border-[#2A2A2A] rounded-[14px] text-xs font-bold text-[#D4AF37] hover:text-white hover:bg-[#1E1E1E] transition-all cursor-pointer">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading File...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-[#6B7280] font-medium">Accepts PNG, JPG, JPEG files.</span>
                </div>

                {/* Display list of current URLs */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-[14px] border border-[#2A2A2A] overflow-hidden bg-[#0B0B0B] group">
                        <img src={url} alt="Vehicle display" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1.5 right-1.5 p-1 bg-[#EF4444] hover:bg-red-700 text-white rounded-full transition-colors cursor-pointer"
                          title="Remove Image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  <Save size={13} /> {editCar ? 'Save Specifications' : 'Publish Four-Wheeler'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
