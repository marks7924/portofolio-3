'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { upsertExperience, deleteExperience } from '@/app/actions/experience';
import { Plus, Edit3, Trash2, Save, X, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExperienceItem {
  id: string;
  company_en: string;
  company_ar: string;
  role_en: string;
  role_ar: string;
  description_en: string;
  description_ar: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
}

interface ExperienceCMSProps {
  initialExperiences: ExperienceItem[];
}

export default function ExperienceCMS({ initialExperiences }: ExperienceCMSProps) {
  const t = useTranslations('Admin.experience');
  const tp = useTranslations('Admin.projects'); // Re-use saving and save keys
  
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  const formatDateForInput = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const startEdit = (exp: ExperienceItem) => {
    setEditingExperience(exp);
    setIsCurrent(exp.current);
    
    reset({
      company_en: exp.company_en,
      company_ar: exp.company_ar,
      role_en: exp.role_en,
      role_ar: exp.role_ar,
      description_en: exp.description_en,
      description_ar: exp.description_ar,
      startDate: formatDateForInput(exp.startDate),
      endDate: formatDateForInput(exp.endDate),
      current: exp.current
    });
  };

  const handleCancel = () => {
    setEditingExperience(null);
    setIsCurrent(false);
    reset({
      company_en: '',
      company_ar: '',
      role_en: '',
      role_ar: '',
      description_en: '',
      description_ar: '',
      startDate: '',
      endDate: '',
      current: false
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience record?')) return;
    const res = await deleteExperience(id);
    if (res.success) {
      setExperiences((prev) => prev.filter((e) => e.id !== id));
    } else {
      alert('Delete failed: ' + res.error);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const payload = {
      id: editingExperience?.id,
      ...data,
      current: isCurrent
    };

    const res = await upsertExperience(payload);
    setSaving(false);

    if (res.success && res.experience) {
      const savedExp = res.experience as ExperienceItem;
      if (editingExperience) {
        setExperiences((prev) => prev.map((e) => (e.id === savedExp.id ? savedExp : e)));
      } else {
        setExperiences((prev) => [...prev, savedExp]);
      }
      handleCancel();
    } else {
      alert('Save failed: ' + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
      
      {/* Left Column: List view of experiences */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-neutral-900 h-fit">
        <h2 className="font-bold text-lg mb-6 text-neutral-200">Work Timeline List</h2>

        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-xl border border-neutral-900 bg-neutral-950/20 hover:border-neutral-800 transition-all flex items-start justify-between gap-4">
              <div className="text-start">
                <div className="font-bold text-neutral-100">{exp.role_en}</div>
                <div className="text-xs text-teal-400 font-semibold mt-0.5">{exp.company_en}</div>
                <div className="text-[10px] text-neutral-500 font-mono mt-2 uppercase">
                  {formatDateForInput(exp.startDate)} &mdash; {exp.current ? 'PRESENT' : formatDateForInput(exp.endDate)}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => startEdit(exp)}
                  className="p-1.5 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-neutral-450 hover:text-teal-400"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="p-1.5 rounded-lg border border-neutral-850 hover:border-red-950 bg-neutral-900 text-neutral-450 hover:text-red-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-neutral-600 font-mono text-sm">
              No experiences recorded in the system.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Edit / Create Form Card */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-900 h-fit">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
          <h3 className="font-bold text-neutral-200">
            {editingExperience ? 'Edit Career Event' : t('addNew')}
          </h3>
          {editingExperience && (
            <button onClick={handleCancel} className="text-neutral-500 hover:text-neutral-350">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Company Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('company_en')}</label>
              <input
                type="text"
                required
                {...register('company_en')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. Google"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('company_ar')}</label>
              <input
                type="text"
                required
                {...register('company_ar')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. جوجل"
              />
            </div>
          </div>

          {/* Role Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('role_en')}</label>
              <input
                type="text"
                required
                {...register('role_en')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. Product Designer"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('role_ar')}</label>
              <input
                type="text"
                required
                {...register('role_ar')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
                placeholder="e.g. مصمم منتجات"
              />
            </div>
          </div>

          {/* Date range configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col text-start">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('startDate')}</label>
              <input
                type="date"
                required
                {...register('startDate')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-300 font-mono"
              />
            </div>
            <div className="flex flex-col text-start">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('endDate')}</label>
              <input
                type="date"
                disabled={isCurrent}
                required={!isCurrent}
                {...register('endDate')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-300 font-mono disabled:opacity-40"
              />
            </div>
          </div>

          {/* Current Job checkbox switch */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="current-job-input"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-800 text-teal-500 bg-neutral-900 focus:ring-teal-500 focus:ring-offset-neutral-950"
            />
            <label htmlFor="current-job-input" className="text-sm text-neutral-450 font-semibold select-none cursor-pointer">
              {t('current')}
            </label>
          </div>

          {/* Description Fields */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('description_en')}</label>
            <textarea
              rows={3}
              required
              {...register('description_en')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
              placeholder="Responsibilities and achievements..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('description_ar')}</label>
            <textarea
              rows={3}
              required
              {...register('description_ar')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
              placeholder="الوصف المهني والإنجازات..."
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
            {editingExperience && (
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
