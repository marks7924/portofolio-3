'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { upsertProject, deleteProject } from '@/app/actions/project';
import { uploadFile } from '@/app/actions/upload';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Save, 
  X, 
  Upload, 
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectItem {
  id: string;
  sequenceNumber: number;
  title_en: string;
  title_ar: string;
  category_en: string;
  category_ar: string;
  description_en: string;
  description_ar: string;
  challenge_en: string;
  challenge_ar: string;
  solution_en: string;
  solution_ar: string;
  technologies: string[];
  coverImage: string;
  galleryImages: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
}

interface ProjectsCMSProps {
  initialProjects: ProjectItem[];
}

export default function ProjectsCMS({ initialProjects }: ProjectsCMSProps) {
  const t = useTranslations('Admin.projects');
  
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [search, setSearch] = useState('');
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Image Upload state handling
  const [coverUrl, setCoverUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // Trigger project edit
  const startEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setCoverUrl(project.coverImage || '');
    setGalleryUrls(project.galleryImages || []);
    setIsFormOpen(true);
    
    reset({
      title_en: project.title_en,
      title_ar: project.title_ar,
      category_en: project.category_en,
      category_ar: project.category_ar,
      description_en: project.description_en,
      description_ar: project.description_ar,
      challenge_en: project.challenge_en || '',
      challenge_ar: project.challenge_ar || '',
      solution_en: project.solution_en || '',
      solution_ar: project.solution_ar || '',
      technologies: project.technologies.join(', '),
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
      sequenceNumber: project.sequenceNumber
    });
  };

  // Trigger add new project
  const startAdd = () => {
    setEditingProject(null);
    setCoverUrl('');
    setGalleryUrls([]);
    setIsFormOpen(true);
    
    reset({
      title_en: '',
      title_ar: '',
      category_en: '',
      category_ar: '',
      description_en: '',
      description_ar: '',
      challenge_en: '',
      challenge_ar: '',
      solution_en: '',
      solution_ar: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
      sequenceNumber: 0
    });
  };

  // Handle Cover image upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadFile(formData);
    setUploadingCover(false);

    if (res.success && res.url) {
      setCoverUrl(res.url);
    } else {
      alert('Upload failed: ' + res.error);
    }
  };

  // Handle Gallery images upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      const res = await uploadFile(formData);
      if (res.success && res.url) {
        urls.push(res.url);
      }
    }

    setUploadingGallery(false);
    setGalleryUrls((prev) => [...prev, ...urls]);
  };

  // Delete project
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const res = await deleteProject(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('Delete failed: ' + res.error);
    }
  };

  // Submit save payload
  const handleFormSubmit = async (data: any) => {
    setSaving(true);
    const techArray = data.technologies
      ? data.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
      : [];

    const payload = {
      id: editingProject?.id,
      ...data,
      technologies: techArray,
      coverImage: coverUrl,
      galleryImages: galleryUrls
    };

    const res = await upsertProject(payload);
    setSaving(false);

    if (res.success && res.project) {
      const savedProject = res.project as ProjectItem;
      if (editingProject) {
        setProjects((prev) => prev.map((p) => (p.id === savedProject.id ? savedProject : p)));
      } else {
        setProjects((prev) => [...prev, savedProject]);
      }
      setIsFormOpen(false);
      setEditingProject(null);
    } else {
      alert('Save failed: ' + res.error);
    }
  };

  // Filter listings by search keyword
  const filteredProjects = projects.filter((p) =>
    p.title_en.toLowerCase().includes(search.toLowerCase()) ||
    p.title_ar.includes(search)
  );

  return (
    <div className="space-y-6 text-start">
      
      {/* Search and Action Bar (Hide if form is open) */}
      {!isFormOpen && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
            />
          </div>

          <button
            onClick={startAdd}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-bold transition-all text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNew')}</span>
          </button>
        </div>
      )}

      {/* Projects List view */}
      {!isFormOpen && (
        <div className="glass-card rounded-2xl overflow-hidden border border-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead className="bg-neutral-900 text-neutral-500 font-mono text-xs border-b border-neutral-850">
                <tr>
                  <th className="px-6 py-4 font-semibold text-start">Project Details</th>
                  <th className="px-6 py-4 font-semibold text-start">Category</th>
                  <th className="px-6 py-4 font-semibold text-center">Featured</th>
                  <th className="px-6 py-4 font-semibold text-center">Sequence</th>
                  <th className="px-6 py-4 font-semibold text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-300">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-900/30 transition-colors">
                    {/* Cover & Title */}
                    <td className="px-6 py-4 flex items-center gap-4 text-start">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-850 flex-shrink-0">
                        <img src={project.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-100">{project.title_en}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{project.title_ar}</div>
                      </div>
                    </td>
                    
                    {/* Category info */}
                    <td className="px-6 py-4 text-start">
                      <div className="text-neutral-200">{project.category_en}</div>
                      <div className="text-xs text-neutral-500 mt-0.5">{project.category_ar}</div>
                    </td>

                    {/* Featured status indicator */}
                    <td className="px-6 py-4 text-center">
                      {project.featured ? (
                        <Star className="w-4 h-4 text-teal-400 fill-teal-400 mx-auto" />
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>

                    {/* Sequence Number */}
                    <td className="px-6 py-4 text-center font-mono">
                      {project.sequenceNumber}
                    </td>

                    {/* Action buttons triggers */}
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(project)}
                          className="p-2 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-teal-400"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 rounded-lg border border-neutral-850 hover:border-red-950 bg-neutral-900 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Editor Edit Form panel */}
      {isFormOpen && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-4xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h2 className="text-xl font-bold text-neutral-200">
              {editingProject ? t('edit') : t('addNew')}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-lg border border-neutral-855 hover:border-neutral-700 text-neutral-500 hover:text-neutral-200"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Bilingual Text Information */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
              Parallel Translation Fields (EN / AR)
            </h3>

            {/* Title fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('title_en')}</label>
                <input
                  type="text"
                  required
                  {...register('title_en')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="E-Commerce API Service"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('title_ar')}</label>
                <input
                  type="text"
                  required
                  {...register('title_ar')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="خدمة واجهة المتجر الإلكتروني"
                />
              </div>
            </div>

            {/* Category fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('category_en')}</label>
                <input
                  type="text"
                  required
                  {...register('category_en')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="SaaS / Web Apps"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('category_ar')}</label>
                <input
                  type="text"
                  required
                  {...register('category_ar')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="برمجيات سحابية / تطبيقات ويب"
                />
              </div>
            </div>

            {/* Description fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('description_en')}</label>
                <textarea
                  rows={3}
                  required
                  {...register('description_en')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="Write english description..."
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('description_ar')}</label>
                <textarea
                  rows={3}
                  required
                  {...register('description_ar')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="اكتب الوصف بالعربية..."
                />
              </div>
            </div>

            {/* Challenge fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('challenge_en')}</label>
                <textarea
                  rows={2}
                  {...register('challenge_en')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="Write project challenge..."
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('challenge_ar')}</label>
                <textarea
                  rows={2}
                  {...register('challenge_ar')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="اكتب التحدي بالعربية..."
                />
              </div>
            </div>

            {/* Solution fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('solution_en')}</label>
                <textarea
                  rows={2}
                  {...register('solution_en')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="Write solution applied..."
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('solution_ar')}</label>
                <textarea
                  rows={2}
                  {...register('solution_ar')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm resize-none"
                  placeholder="اكتب الحل بالعربية..."
                />
              </div>
            </div>
          </div>

          {/* Technical and Asset Settings */}
          <div className="glass-card rounded-2xl p-6 space-y-6">
            <h3 className="font-semibold text-sm text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
              Media & Technical specifications
            </h3>

            {/* Cover image upload container */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('coverImage')}</label>
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-850 flex-shrink-0">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">NO IMG</div>
                  )}
                </div>
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={uploadingCover}
                    className="hidden"
                    id="cover-img-input"
                  />
                  <label
                    htmlFor="cover-img-input"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-805 bg-neutral-900 hover:bg-neutral-850 text-sm font-semibold text-neutral-350 cursor-pointer"
                  >
                    {uploadingCover ? (
                      <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>Select Cover Photo</span>
                  </label>
                </div>
              </div>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-xs text-neutral-500"
                placeholder="https://supabase.co/bucket/path/image.jpg"
              />
            </div>

            {/* Gallery images uploads */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('galleryImages')}</label>
              <div className="relative mb-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  disabled={uploadingGallery}
                  className="hidden"
                  id="gallery-imgs-input"
                />
                <label
                  htmlFor="gallery-imgs-input"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-805 bg-neutral-900 hover:bg-neutral-850 text-sm font-semibold text-neutral-350 cursor-pointer"
                >
                  {uploadingGallery ? (
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>Add Gallery Photos</span>
                </label>
              </div>

              {/* Gallery Previews list */}
              {galleryUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-neutral-900/50 border border-neutral-900">
                  {galleryUrls.map((url, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                      <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryUrls((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-neutral-950/80 hover:bg-red-500 text-neutral-400 hover:text-neutral-100 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tech tags input comma separated */}
            <div className="flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('technologies')}</label>
              <input
                type="text"
                {...register('technologies')}
                className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                placeholder="Next.js, Tailwind CSS, TypeScript, PostgreSQL"
              />
            </div>

            {/* Live and GitHub URL fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('liveUrl')}</label>
                <input
                  type="text"
                  {...register('liveUrl')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('githubUrl')}</label>
                <input
                  type="text"
                  {...register('githubUrl')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>

            {/* Sequence number sorting and Featured switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">{t('sequenceNumber')}</label>
                <input
                  type="number"
                  {...register('sequenceNumber')}
                  className="px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm font-mono"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0 sm:pt-4 text-start">
                <input
                  type="checkbox"
                  id="featured-input"
                  {...register('featured')}
                  className="w-4 h-4 rounded border-neutral-800 text-teal-500 bg-neutral-900 focus:ring-teal-500 focus:ring-offset-neutral-950"
                />
                <label htmlFor="featured-input" className="text-sm font-semibold text-neutral-300 select-none cursor-pointer">
                  {t('featured')}
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              disabled={saving}
              onClick={() => setIsFormOpen(false)}
              className="px-5 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 text-sm font-semibold transition-colors"
            >
              {t('cancel')}
            </button>

            <motion.button
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 font-bold transition-all text-sm cursor-pointer shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('saving')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('save')}</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}

    </div>
  );
}
