'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { ExternalLink, Github, Layers, Code, Play } from 'lucide-react';

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

interface ProjectsProps {
  projects: ProjectItem[];
}

export default function Projects({ projects }: ProjectsProps) {
  const t = useTranslations('Projects');
  const locale = useLocale();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterTabs = [
    { key: 'all', label: t('categories.all') },
    { key: 'Web Apps', label: t('categories.web-apps') },
    { key: 'SaaS', label: t('categories.saas') },
    { key: 'E-Commerce', label: t('categories.ecommerce') },
    { key: 'Dashboards', label: t('categories.dashboards') },
    { key: 'AI Projects', label: t('categories.ai-projects') }
  ];

  const filteredProjects = selectedFilter === 'all'
    ? projects
    : projects.filter((p) => {
        // Match both English and Arabic categories dynamically or check category_en
        const category = p.category_en?.toLowerCase() || '';
        const target = selectedFilter.toLowerCase();
        
        // Custom matching logic for safety
        if (target === 'web apps' && category.includes('web')) return true;
        if (target === 'saas' && category.includes('saas')) return true;
        if (target === 'e-commerce' && (category.includes('commerce') || category.includes('shop'))) return true;
        if (target === 'dashboards' && category.includes('dashboard')) return true;
        if (target === 'ai projects' && (category.includes('ai') || category.includes('intelligence'))) return true;
        
        return category.includes(target);
      });

  return (
    <section className="relative w-full py-24 bg-neutral-950/30 border-y border-neutral-900" id="projects">
      {/* Lights backdrops */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
            {t('subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
            {t('title')}
          </h2>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                selectedFilter === tab.key
                  ? 'bg-purple-500 border-purple-500 text-neutral-100 shadow-lg shadow-purple-500/10'
                  : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Grid Items */}
        <motion.div
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5 }}
                key={project.id}
                className="glass-card rounded-3xl overflow-hidden flex flex-col group relative"
              >
                {/* Image Showcase Container */}
                <div className="relative w-full h-64 overflow-hidden bg-neutral-900 border-b border-neutral-900">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                    alt={locale === 'ar' ? project.title_ar : project.title_en}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/20 transition-colors duration-500" />
                  
                  {/* Category Pill Tag */}
                  <span className="absolute top-4 start-4 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-neutral-950/80 border border-neutral-800 rounded-full text-teal-400">
                    {locale === 'ar' ? project.category_ar : project.category_en}
                  </span>
                </div>

                {/* Info Text Content Block */}
                <div className="p-8 flex-1 flex flex-col text-start">
                  <h3 className="text-2xl font-bold mb-4 text-neutral-100 group-hover:text-purple-400 transition-colors duration-300">
                    {locale === 'ar' ? project.title_ar : project.title_en}
                  </h3>

                  <p className="text-neutral-400 text-sm mb-6 leading-relaxed flex-1">
                    {locale === 'ar' ? project.description_ar : project.description_en}
                  </p>

                  {/* Challenge/Solution expand block or small summary */}
                  {(project.challenge_en || project.solution_en) && (
                    <div className="mb-6 space-y-3 bg-neutral-950/40 p-4 rounded-2xl border border-neutral-900">
                      {project.challenge_en && (
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          <strong className="text-purple-400 uppercase tracking-widest text-[10px] block mb-0.5">
                            {t('challenge')}:
                          </strong>
                          {locale === 'ar' ? project.challenge_ar : project.challenge_en}
                        </p>
                      )}
                      {project.solution_en && (
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          <strong className="text-teal-400 uppercase tracking-widest text-[10px] block mb-0.5">
                            {t('solution')}:
                          </strong>
                          {locale === 'ar' ? project.solution_ar : project.solution_en}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Technology Pills list */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-850 text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Link buttons block */}
                  <div className="flex items-center gap-4 mt-auto">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>{t('liveDemo')}</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-neutral-300 transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>{t('github')}</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 text-neutral-500 font-mono text-sm">
            {t('noProjects')}
          </div>
        )}
      </div>
    </section>
  );
}
