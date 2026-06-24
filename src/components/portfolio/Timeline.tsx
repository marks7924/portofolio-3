'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Calendar, Briefcase } from 'lucide-react';

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

interface TimelineProps {
  experiences: ExperienceItem[];
}

export default function Timeline({ experiences }: TimelineProps) {
  const t = useTranslations('Experience');
  const locale = useLocale();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <section className="relative w-full py-24 bg-neutral-950" id="experience">
      <div className="max-w-4xl w-full mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
            {t('subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
            {t('title')}
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative border-s-2 border-neutral-800 ms-4 sm:ms-32 space-y-12">
          {experiences.map((exp, idx) => {
            const startStr = formatDate(exp.startDate);
            const endStr = exp.current ? t('present') : exp.endDate ? formatDate(exp.endDate) : '';

            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.1 }}
                className="relative ps-8 text-start"
              >
                {/* Visual node badge circle */}
                <span className="absolute -start-[11px] top-1.5 w-5 h-5 rounded-full border-2 border-neutral-950 bg-teal-500 ring-4 ring-teal-500/10 flex items-center justify-center">
                  <Briefcase className="w-2.5 h-2.5 text-neutral-950" />
                </span>

                {/* Floating Date pill side-aligned on desktop */}
                <div className="sm:absolute sm:start-[-160px] sm:top-1.5 sm:w-32 text-xs sm:text-end text-neutral-500 font-mono font-bold uppercase tracking-wider mb-2 sm:mb-0">
                  {startStr} — {endStr}
                </div>

                {/* Info Card box */}
                <div className="glass-card rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
                  <h3 className="text-xl font-bold text-neutral-100">
                    {locale === 'ar' ? exp.role_ar : exp.role_en}
                  </h3>
                  <p className="text-sm font-semibold text-teal-400 mt-1 mb-4">
                    {locale === 'ar' ? exp.company_ar : exp.company_en}
                  </p>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {locale === 'ar' ? exp.description_ar : exp.description_en}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-10 text-neutral-600 font-mono text-sm">
            No work experience saved yet.
          </div>
        )}
      </div>
    </section>
  );
}
