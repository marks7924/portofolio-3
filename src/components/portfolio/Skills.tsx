'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import * as Icons from 'lucide-react';

interface SkillItem {
  id: string;
  name_en: string;
  name_ar: string;
  category: string;
  percentage: number;
  icon: string;
}

interface SkillsProps {
  skills: SkillItem[];
}

export default function Skills({ skills }: SkillsProps) {
  const t = useTranslations('Skills');
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { key: 'ALL', label: t('categories.all') },
    { key: 'FRONTEND', label: t('categories.FRONTEND') },
    { key: 'BACKEND', label: t('categories.BACKEND') },
    { key: 'DATABASE', label: t('categories.DATABASE') },
    { key: 'CLOUD', label: t('categories.CLOUD') },
    { key: 'DEVOPS', label: t('categories.DEVOPS') },
    { key: 'AITOOLS', label: t('categories.AITOOLS') }
  ];

  const filteredSkills = selectedCategory === 'ALL'
    ? skills
    : skills.filter((s) => s.category === selectedCategory);

  return (
    <section className="relative w-full py-24 bg-neutral-950" id="skills">
      {/* Light accent orb */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
            {t('subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
            {t('title')}
          </h2>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                selectedCategory === cat.key
                  ? 'bg-teal-500 border-teal-500 text-neutral-950 font-bold shadow-lg shadow-teal-500/10'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => {
              // Dynamically lookup Lucide Icon or fallback
              const IconName = skill.icon || 'Cpu';
              const IconComponent = (Icons as any)[IconName] || Icons.Cpu;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={skill.id}
                  className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4 text-start">
                    <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500 group-hover:text-neutral-950 transition-colors duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-100 group-hover:text-teal-400 transition-colors duration-300">
                        {locale === 'ar' ? skill.name_ar : skill.name_en}
                      </h3>
                      <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
                        {skill.category}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-teal-400 text-lg">
                      {skill.percentage}%
                    </span>
                  </div>

                  {/* Progress bar container */}
                  <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden relative border border-neutral-850">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-teal-500 to-purple-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
