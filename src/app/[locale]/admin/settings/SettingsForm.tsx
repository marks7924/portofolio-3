'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { updateSettings } from '@/app/actions/settings';
import { uploadFile } from '@/app/actions/upload';
import { Save, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsFormProps {
  initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const t = useTranslations('Admin.settings');
  const tp = useTranslations('Admin.projects'); // Re-use common texts
  
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [profileUrl, setProfileUrl] = useState(initialSettings?.profileImage || '');
  const [resumeUrl, setResumeUrl] = useState(initialSettings?.resumeFile || '');
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: initialSettings?.fullName || '',
      title_en: initialSettings?.title_en || '',
      title_ar: initialSettings?.title_ar || '',
      bio_en: initialSettings?.bio_en || '',
      bio_ar: initialSettings?.bio_ar || '',
      email: initialSettings?.email || '',
      phone: initialSettings?.phone || '',
      github: initialSettings?.github || '',
      linkedin: initialSettings?.linkedin || '',
      facebook: initialSettings?.facebook || '',
      instagram: initialSettings?.instagram || '',
      x: initialSettings?.x || ''
    }
  });

  // Profile Image upload handler
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadFile(formData);
    setUploadingProfile(false);

    if (res.success && res.url) {
      setProfileUrl(res.url);
    } else {
      alert('Upload failed: ' + res.error);
    }
  };

  // Resume PDF upload handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadFile(formData);
    setUploadingResume(false);

    if (res.success && res.url) {
      setResumeUrl(res.url);
    } else {
      alert('Upload failed: ' + res.error);
    }
  };

  const onSubmit = async (data: any) => {
    setStatus('saving');
    setErrorMsg('');

    const payload = {
      ...data,
      profileImage: profileUrl,
      resumeFile: resumeUrl
    };

    const res = await updateSettings(payload);
    if (res.success) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setErrorMsg(res.error || 'Failed to update settings');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-start max-w-4xl">
      
      {status === 'success' && (
        <div className="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 text-teal-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">Settings saved successfully!</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: General Profile Metadata */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-base text-neutral-300 border-b border-neutral-800 pb-3">
            Profile Information
          </h2>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('fullName')}
            </label>
            <input
              type="text"
              required
              {...register('fullName')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
              placeholder="Mark Developer"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('title_en')}
            </label>
            <input
              type="text"
              required
              {...register('title_en')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
              placeholder="Senior Full-Stack Architect"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('title_ar')}
            </label>
            <input
              type="text"
              required
              {...register('title_ar')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
              placeholder="مهندس برمجيات متكامل"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              required
              {...register('email')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
              placeholder="mark@developer.com"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('phone')}
            </label>
            <input
              type="text"
              {...register('phone')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
              placeholder="+1 (555) 012-3456"
            />
          </div>
        </div>

        {/* Right Side: Media Asset Uploads */}
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h2 className="font-bold text-base text-neutral-300 border-b border-neutral-800 pb-3">
            Assets Uploads
          </h2>

          {/* Profile Photo upload */}
          <div className="flex flex-col text-start">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('profileImage')}
            </label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-800 bg-neutral-900 flex-shrink-0">
                {profileUrl ? (
                  <img src={profileUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">NO IMG</div>
                )}
              </div>
              
              <div className="relative flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileUpload}
                  disabled={uploadingProfile}
                  className="hidden"
                  id="profile-img-input"
                />
                <label
                  htmlFor="profile-img-input"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 hover:border-neutral-700 text-sm font-semibold text-neutral-300 transition-colors cursor-pointer"
                >
                  {uploadingProfile ? (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Upload Image</span>
                </label>
              </div>
            </div>
            {profileUrl && (
              <input
                type="text"
                readOnly
                value={profileUrl}
                className="mt-2 w-full px-3 py-1.5 rounded-lg bg-neutral-900/40 border border-neutral-850 text-xs text-neutral-500 focus:outline-none"
              />
            )}
          </div>

          {/* Resume PDF upload */}
          <div className="flex flex-col text-start">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('resume')}
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
                id="resume-file-input"
              />
              <label
                htmlFor="resume-file-input"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 hover:border-neutral-700 text-sm font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                {uploadingResume ? (
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Upload Resume Document</span>
              </label>
            </div>
            {resumeUrl && (
              <input
                type="text"
                readOnly
                value={resumeUrl}
                className="mt-2 w-full px-3 py-1.5 rounded-lg bg-neutral-900/40 border border-neutral-850 text-xs text-neutral-500 focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      {/* Translations Bio inputs block */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h2 className="font-bold text-base text-neutral-300 border-b border-neutral-800 pb-3">
          Bilingual Descriptions (Bio translations)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('bio_en')}
            </label>
            <textarea
              rows={4}
              required
              {...register('bio_en')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm resize-none"
              placeholder="Enter English bio text..."
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('bio_ar')}
            </label>
            <textarea
              rows={4}
              required
              {...register('bio_ar')}
              className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm resize-none"
              placeholder="أدخل السيرة الذاتية بالعربية..."
            />
          </div>
        </div>
      </div>

      {/* Social Network Links */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <h2 className="font-bold text-base text-neutral-300 border-b border-neutral-800 pb-3">
          {t('socials')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {['github', 'linkedin', 'x', 'instagram', 'facebook'].map((social) => (
            <div key={social} className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {social}
              </label>
              <input
                type="text"
                {...register(social as any)}
                className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm"
                placeholder={`https://${social}.com/username`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Submit save button */}
      <div className="flex justify-end pt-4">
        <motion.button
          whileHover={{ scale: status === 'saving' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'saving' ? 1 : 0.98 }}
          type="submit"
          disabled={status === 'saving'}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 font-bold transition-all cursor-pointer shadow-lg"
        >
          {status === 'saving' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{tp('saving')}</span>
            </>
          ) : (
            <>
              <Save className="w-4.5 h-4.5" />
              <span>{tp('save')}</span>
            </>
          )}
        </motion.button>
      </div>

    </form>
  );
}
