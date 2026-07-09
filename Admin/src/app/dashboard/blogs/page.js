'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../../../context/AdminAuthContext';
import { BookOpen, Plus, Trash2, Edit, X, Save, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function BlogsManager() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get('/blogs?limit=1000');
      if (res.data?.success) {
        setBlogs(res.data.data.blogs);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      toast.error('Failed to fetch blogs index.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setImageUrl('');
    reset({
      title: '',
      slug: '',
      category: 'Maintenance',
      description: '',
      content: '',
      readTime: '3 min read'
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setImageUrl(item.image || '');
    reset({
      title: item.title,
      slug: item.slug,
      category: item.category || 'Maintenance',
      description: item.description,
      content: item.content || '',
      readTime: item.readTime || '3 min read'
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setImageUrl(res.data.data.url);
        toast.success('Blog banner uploaded successfully!');
      }
    } catch (err) {
      toast.error('File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error('Please upload an article banner image.');
      return;
    }

    const payload = {
      ...data,
      image: imageUrl,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    try {
      if (editItem) {
        const res = await adminApi.put(`/blogs/${editItem._id}`, payload);
        if (res.data?.success) {
          setBlogs(blogs.map(b => b._id === editItem._id ? res.data.data : b));
          toast.success('Blog post specs saved.');
          setModalOpen(false);
        }
      } else {
        const res = await adminApi.post('/blogs', payload);
        if (res.data?.success) {
          setBlogs([res.data.data, ...blogs]);
          toast.success('Blog post published.');
          setModalOpen(false);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this blog post?')) {
      try {
        const res = await adminApi.delete(`/blogs/${id}`);
        if (res.data?.success) {
          setBlogs(blogs.filter(b => b._id !== id));
          toast.success('Blog post deleted successfully.');
        }
      } catch (err) {
        toast.error('Failed to delete blog post.');
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
            <BookOpen className="text-[#D4AF37]" /> Manage Riding Blogs
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">Publish expert advice, safety guides, riding tips, and routine maintenance checklists.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F4B400] text-black font-extrabold text-xs py-2.5 px-4 rounded-[14px] shadow-lg hover:brightness-110 hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={14} /> Write Blog Post
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-[22px] overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs text-[#9CA3AF]">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-[#6B7280] font-bold uppercase text-[9px] tracking-wider bg-[#111111]/50">
                <th className="p-4">Post Banner</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Read Duration</th>
                <th className="p-4">Published Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]/40">
              {blogs.length > 0 ? (
                blogs.map((item) => (
                  <tr key={item._id} className="hover:bg-[#202020] transition-colors duration-300 odd:bg-transparent even:bg-[#171717]/10">
                    <td className="p-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-10 object-cover rounded-[10px] border border-[#2A2A2A]"
                      />
                    </td>
                    <td className="p-4 font-bold text-white max-w-sm truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="p-4">
                      <span className="bg-[#111111] border border-[#2A2A2A] text-[#9CA3AF] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 text-[#9CA3AF] font-semibold">{item.readTime}</td>
                    <td className="p-4 text-[#9CA3AF]">{item.date}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-[#D4AF37] hover:text-black bg-[#D4AF37]/10 hover:bg-[#D4AF37] rounded-[14px] transition-colors cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-[#EF4444] hover:text-white bg-[#EF4444]/10 hover:bg-[#EF4444] rounded-[14px] transition-colors cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-[#6B7280] font-semibold">
                    No guides currently cataloged in the blog registry database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0D]/80 backdrop-blur-sm flex items-center justify-center overflow-y-auto px-4 py-8">
          <div className="w-full max-w-2xl bg-[#171717] border border-[#2A2A2A] rounded-[22px] p-6 shadow-2xl space-y-6 my-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-sans font-extrabold text-sm text-white uppercase tracking-wider">
                {editItem ? 'Edit Blog Post' : 'Publish New Post'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-[#6B7280] hover:text-white cursor-pointer"><X size={16} /></button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 font-sans">
              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Blog Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5 Maintenance Checks before long highway tours"
                  className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                  {...register('title', { required: 'Title is required' })}
                />
                {errors.title && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.title.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Slug URL Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. maintenance-checks-highway-tours"
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                    {...register('slug', { required: 'Slug is required' })}
                  />
                  {errors.slug && <span className="text-[10px] text-[#EF4444] mt-1 block">{errors.slug.message}</span>}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all cursor-pointer"
                    {...register('category')}
                  >
                    <option value="Helmet Guide">Helmet Guide</option>
                    <option value="Riding Tips">Riding Tips</option>
                    <option value="Maintenance">Maintenance Checklists</option>
                    <option value="Buying Advice">Buying Advice</option>
                    <option value="Electric Era">Electric Era</option>
                    <option value="Travelogues">Travelogues</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Estimated Read Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 5 min read"
                  className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                  {...register('readTime', { required: 'Read Time is required' })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Short Summary Description</label>
                <textarea
                  rows="2"
                  placeholder="Summarize the core theme of this riding post..."
                  className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                  {...register('description', { required: 'Summary description is required' })}
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1.5">Full Content Text (Markdown Allowed)</label>
                <textarea
                  rows="6"
                  placeholder="Write the full expert advice blog post context details..."
                  className="block w-full px-3 py-2.5 bg-[#151515] border border-[#303030] rounded-[14px] text-xs text-white placeholder-[#6B7280] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all font-mono"
                  {...register('content', { required: 'Full content is required' })}
                ></textarea>
              </div>

              {/* Banner Image Uploader */}
              <div className="space-y-3 pt-3 border-t border-[#2A2A2A]">
                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Banner Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-[#171717] border border-[#2A2A2A] text-[#D4AF37] hover:text-white rounded-[14px] hover:bg-[#1E1E1E] transition-all cursor-pointer text-xs font-bold">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload Banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {imageUrl && <span className="text-[10px] text-[#22C55E] font-bold truncate max-w-xs">{imageUrl}</span>}
                </div>
                {imageUrl && (
                  <div className="relative aspect-video max-w-xs rounded-[14px] border border-[#2A2A2A] overflow-hidden bg-[#0B0B0B]">
                    <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
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
                  <Save size={13} /> {editItem ? 'Save Post' : 'Publish Post'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
