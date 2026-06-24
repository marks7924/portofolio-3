'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { upsertSkill, deleteSkill } from '@/app/actions/skill';
import { Plus, Edit3, Trash2, Save, X, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface SkillItem {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  percentage: number;
  icon: string;
}

interface SkillsCMSProps {
  initialSkills: SkillItem[];
}

export default function SkillsCMS({ initialSkills }: SkillsCMSProps) {
  const t = useTranslations('Admin.skills');
  const tp = useTranslations('Admin.projects'); // Re-use common labels
  
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      name_en: '',
      name_ar: '',
      category: 'FRONTEND',
      percentage: 80,
      icon: 'Cpu'
    }
  });

  const startEdit = (skill: SkillItem) => {
    setEditingSkill(skill);
    setValue('name_en', skill.name_en);
    setValue('name_ar', skill.name_ar);
    setValue('category', skill.category);
    setValue('percentage', skill.percentage);
    setValue('icon', skill.icon);
  };

  const handleCancel = () => {
    setEditingSkill(null);
    reset({
      name_en: '',
      name_ar: '',
      category: 'FRONTEND',
      percentage: 80,
      icon: 'Cpu'
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    const res = await deleteSkill(id);
    if (res.success) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } else {
      alert('Delete failed: ' + res.error);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);
    const payload = {
      id: editingSkill?.id,
      ...data
    };

    const res = await upsertSkill(payload);
    setSaving(false);

    if (res.success && res.skill) {
      const savedSkill = res.skill as SkillItem;
      if (editingSkill) {
        setSkills((prev) => prev.map((s) => (s.id === savedSkill.id ? savedSkill : s)));
      } else {
        setSkills((prev) => [...prev, savedSkill]);
      }
      handleCancel();
    } else {
      alert('Save failed: ' + res.error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-start">
      
      {/* Left Column: Skills Table list */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-neutral-900 h-fit">
        <h2 className="font-bold text-lg mb-6 text-neutral-200">Active Skill List</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-neutral-500 font-mono text-xs border-b border-neutral-850">
              <tr>
                <th className="px-4 py-3 font-semibold text-start">Skill / Category</th>
                <th className="px-4 py-3 font-semibold text-center">Level</th>
                <th className="px-4 py-3 font-semibold text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60 text-neutral-300">
              {skills.map((skill) => {
                const IconComponent = (Icons as any)[skill.icon] || Icons.Cpu;
                return (
                  <tr key={skill.id} className="hover:bg-neutral-900/20 transition-colors">
                    {/* Name & Icon */}
                    <td className="px-4 py-3 text-start flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/10">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-neutral-200">{skill.name_en}</div>
                        <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest">{skill.category}</div>
                      </div>
                    </td>

                    {/* Percentage level */}
                    <td className="px-4 py-3 text-center font-mono font-bold text-teal-400">
                      {skill.percentage}%
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => startEdit(skill)}
                          className="p-1.5 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-teal-400"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-1.5 rounded-lg border border-neutral-850 hover:border-red-950 bg-neutral-900 text-neutral-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {skills.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-neutral-600 font-mono">
                    No skills seeded or created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Add / Edit Form Card */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-neutral-900 h-fit">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-6">
          <h3 className="font-bold text-neutral-200">
            {editingSkill ? 'Edit Skill Entry' : t('addNew')}
          </h3>
          {editingSkill && (
            <button
              onClick={handleCancel}
              className="text-neutral-500 hover:text-neutral-350"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('name_en')}
            </label>
            <input
              type="text"
              required
              {...register('name_en')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
              placeholder="e.g. Next.js"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('name_ar')}
            </label>
            <input
              type="text"
              required
              {...register('name_ar')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200"
              placeholder="e.g. نكست جي إس"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('category')}
            </label>
            <select
              {...register('category')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-300"
            >
              <option value="FRONTEND">Frontend</option>
              <option value="BACKEND">Backend</option>
              <option value="DATABASE">Database</option>
              <option value="CLOUD">Cloud</option>
              <option value="DEVOPS">DevOps</option>
              <option value="AITOOLS">AI Tools</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('icon')}
            </label>
            <input
              type="text"
              required
              {...register('icon')}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none text-sm text-neutral-200 font-mono"
              placeholder="e.g. Layers, Code, Database"
            />
            <span className="text-[10px] text-neutral-600 mt-1">Accepts any standard Lucide Icon name.</span>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              <span>{t('percentage')}</span>
              <span className="text-teal-400 font-mono"></span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              {...register('percentage')}
              className="w-full h-1 bg-neutral-850 rounded-lg appearance-none cursor-pointer accent-teal-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
            {editingSkill && (
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
