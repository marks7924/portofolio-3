'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { FileText, Award, Calendar, Briefcase } from 'lucide-react';

interface AboutProps {
  settings: any;
  projectsCount: number;
  skillsCount: number;
  experiencesCount: number;
}

export default function About({ settings, projectsCount, skillsCount, experiencesCount }: AboutProps) {
  const t = useTranslations('About');
  const locale = useLocale();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  // Determine current years of experience from data or hardcode a sensible default
  const yearsOfExperience = experiencesCount > 0 ? experiencesCount * 2 : 5; 

  const stats = [
    {
      id: 'experience',
      value: `${yearsOfExperience}+`,
      label: t('stats.experience'),
      icon: Calendar,
      color: 'text-teal-400 border-teal-500/20 bg-teal-500/5'
    },
    {
      id: 'completed',
      value: projectsCount > 0 ? `${projectsCount}+` : '12+',
      label: t('stats.completed'),
      icon: Briefcase,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5'
    },
    {
      id: 'mastered',
      value: skillsCount > 0 ? `${skillsCount}+` : '18+',
      label: t('stats.mastered'),
      icon: Award,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
    }
  ];

  return (
    <section className="relative w-full py-24 bg-neutral-950/50 border-y border-neutral-900" id="about">
      {/* Glow highlight lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
        >
          {/* Left: Bio Image & Accent Frame */}
          <motion.div variants={itemVariants} className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl overflow-hidden glass-card p-2 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={settings?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'}
                alt={settings?.fullName || 'Mark Developer'}
                className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-105"
              />
              {/* Outer decorative borders */}
              <div className="absolute top-0 start-0 w-8 h-8 border-t-2 border-s-2 border-teal-500 -translate-x-2 -translate-y-2 pointer-events-none rounded-tl-xl" />
              <div className="absolute bottom-0 end-0 w-8 h-8 border-b-2 border-e-2 border-purple-500 translate-x-2 translate-y-2 pointer-events-none rounded-br-xl" />
            </div>
          </motion.div>

          {/* Right: Copy & Statistics */}
          <motion.div variants={itemVariants} className="lg:col-span-7 text-start">
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
              {t('subtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
              {t('title')}
            </h2>

            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed mb-8">
              {locale === 'ar' ? settings?.bio_ar : settings?.bio_en}
            </p>

            {/* Statistics Row Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`flex flex-col items-center sm:items-start p-5 rounded-xl border ${stat.color} transition-all duration-300 hover:scale-105`}
                  >
                    <Icon className="w-6 h-6 mb-3" />
                    <span className="text-3xl font-extrabold tracking-tight text-neutral-100">
                      {stat.value}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold mt-1 text-center sm:text-start">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Resume button */}
            {settings?.resumeFile && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={settings.resumeFile}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl border border-neutral-850 bg-neutral-900 hover:bg-neutral-850 text-teal-400 font-bold transition-all shadow-lg cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                <span>{t('downloadResume')}</span>
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
