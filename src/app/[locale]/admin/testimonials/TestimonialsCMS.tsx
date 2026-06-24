'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { upsertTestimonial, deleteTestimonial } from '@/app/actions/testimonial';
import { uploadFile } from '@/app/actions/upload';
import { Plus, Edit3, Trash2, Save, X, Loader2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestimonialItem {
  id: string;
  name: string;
  company: string;
  position: string;
  review_en: string;
  review_ar: string;
  avatar: string;
}

interface TestimonialsCMSProps {
  initialTestimonials: TestimonialItem[];
}

export default function TestimonialsCMS({ initialTestimonials }: TestimonialsCMSProps) {
  const t = useTranslations('Admin.testimonials');
  const tp = useTranslations('Admin.projects'); // Re-use saving and save keys
  
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const startEdit = (test: TestimonialItem) => {
    setEditingTestimonial(test);
    setAvatarUrl(test.avatar || '');
    
    reset({
      name: test.name,
      company: test.company,
      position: test.position,
      review_en: test.review_en,
      review_ar: test.review_ar
    });
  };

  const handleCancel = () => {
    setEditingTestimonial(null);
    setAvatarUrl('');
    reset({
      name: '',
      company: '',
      position: '',
      review_en: '',
      review_ar: ''
    });
  };

  // Avatar Upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadFile(formData);
    setUploadingAvatar(false);

    if (res.success && res.url) {
      setAvatarUrl(res.url);
    } else {
      alert('Upload failed: ' + res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    const res = await deleteTestimonial(id);
    if (res.success) {
      setProjects((prev) => prev.filter((t) => t.id !== id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert('Delete failed: ' + res.error);
    }
  };

  // Keep state sync safe helper
  const setProjects = (updater: (prev: TestimonialItem[]) => TestimonialItem[]) => {
    setTestimonials(updater);
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const payload = {
      id: editingTestimonial?.id,
      ...data,
      avatar: avatarUrl
    };

    const res = await upsertTestimonial(payload);
    setSaving(false);

    if (res.success && res.testimonial) {
      const savedTest = res.testimonial as TestimonialItem;
      if (editingTestimonial) {
        setTestimonials((prev) => prev.map((t) => (t.id === savedTest.id ? savedTest : t)));
      } else {
        setTestimonials((prev) => [...prev, savedTest]);
      }
      handleCancel();
    } else {
      alert('Save failed: ' + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
      
      {/* Left Column: Testimonial listing cards */}
      <div className="lg:col-span-7 space-y-4 h-fit">
        <h2 className="font-bold text-lg text-neutral-200">Reviews & Recommendations</h2>

        {testimonials.map((test) => (
          <div key={test.id} className="glass-card rounded-2xl p-6 border border-neutral-900 flex items-start gap-4 hover:border-neutral-800 transition-all">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 border border-neutral-850 flex-shrink-0">
              <img src={test.avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 text-start">
              <div className="font-bold text-neutral-100">{test.name}</div>
              <div className="text-xs text-teal-400 font-semibold mt-0.5">{test.position} @ {test.company}</div>
              <p className="text-xs text-neutral-450 mt-3 leading-relaxed italic">
                "{test.review_en.substring(0, 100)}..."
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => startEdit(test)}
                className="p-1.5 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-neutral-450 hover:text-teal-400"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(test.id)}
                className="p-1.5 rounded-lg border border-neutral-850 hover:border-red-950 bg-neutral-900 text-neutral-450 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="text-center py-8 text-neutral-600 font-mono text-sm glass-card rounded-2xl p-6">
            No testimonial cards saved yet.
          </div>
        )}
      </div>

      {/* Right Column: Edit / Create Form Card */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-900 h-fit">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
          <h3 className="font-bold text-neutral-200">
            {editingTestimonial ? 'Edit Testimonial' : t('addNew')}
          </h3>
          {editingTestimonial && (
            <button onClick={handleCancel} className="text-neutral-500 hover:text-neutral-350">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('clientName')}</label>
            <input
              type="text"
              required
              {...register('name')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
              placeholder="e.g. Jane Smith"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('company')}</label>
              <input
                type="text"
                required
                {...register('company')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('position')}</label>
              <input
                type="text"
                required
                {...register('position')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. Chief Executive"
              />
            </div>
          </div>

          {/* Avatar Image Uploader */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('avatar')}</label>
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-900 border border-neutral-850 flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">NO IMG</div>
                )}
              </div>
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                  id="avatar-img-input"
                />
                <label
                  htmlFor="avatar-img-input"
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-neutral-805 bg-neutral-900 hover:bg-neutral-850 text-xs font-semibold text-neutral-350 cursor-pointer"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Select Avatar</span>
                </label>
              </div>
            </div>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="mt-2 w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-xs text-neutral-500"
              placeholder="https://supabase.co/bucket/path/avatar.jpg"
            />
          </div>

          {/* Reviews parallel fields */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('review_en')}</label>
            <textarea
              rows={3}
              required
              {...register('review_en')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
              placeholder="Enter client's review text..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('review_ar')}</label>
            <textarea
              rows={3}
              required
              {...register('review_ar')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
              placeholder="أدخل رأي العميل بالعربية..."
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
            {editingTestimonial && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-350 text-xs font-semibold"
              >
                Cancel
              </button>
            )}

            <motion.button
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 font-bold transition-all text-xs cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{tp('save')}</span>
            </motion.button>
          </div>

        </form>
      </div>

    </div>
  );
}
