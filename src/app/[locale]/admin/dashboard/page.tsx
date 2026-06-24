import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getProjects } from '@/app/actions/project';
import { getSkills } from '@/app/actions/skill';
import { getExperiences } from '@/app/actions/experience';
import { getTestimonials } from '@/app/actions/testimonial';
import { 
  Briefcase, 
  FileCode2, 
  History, 
  MessageSquare, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const t = await getTranslations('Admin.dashboard');
  const session = await getServerSession(authOptions);

  const projects = await getProjects();
  const skills = await getSkills();
  const experiences = await getExperiences();
  const testimonials = await getTestimonials();

  const stats = [
    {
      label: t('statProjects'),
      value: projects.length,
      icon: Briefcase,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    },
    {
      label: t('statSkills'),
      value: skills.length,
      icon: FileCode2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    },
    {
      label: t('statExperience'),
      value: experiences.length,
      icon: History,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      label: t('statTestimonials'),
      value: testimonials.length,
      icon: MessageSquare,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
    }
  ];

  return (
    <div className="space-y-10 text-start">
      {/* Welcome header banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100 flex items-center gap-2">
          <span>{t('welcome')}</span>
          <span className="text-teal-400">{session?.user?.name || 'Admin'}</span>
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {t('overview')}
        </p>
      </div>

      {/* Grid statistics rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-6 relative overflow-hidden flex items-center justify-between border border-neutral-900">
              <div className="space-y-1">
                <span className="text-xs font-semibold tracking-wider uppercase text-neutral-500 font-mono block">
                  {stat.label}
                </span>
                <span className="text-4xl font-extrabold tracking-tight text-neutral-100">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl border ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* DevOps status / Server info metrics mock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 text-start">
          <h2 className="font-bold text-lg mb-4 text-neutral-200 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <span>Platform Resource Monitor</span>
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-neutral-500 mb-1.5">
                <span>DATABASE POOL CONSUMPTION</span>
                <span>4 / 20 CONNECTIONS</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full bg-teal-500 w-1/5" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-neutral-500 mb-1.5">
                <span>CACHE REVALIDATION SUCCESS RATE</span>
                <span>99.8%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full bg-purple-500 w-[99.8%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links block panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-neutral-200 mb-2">{t('quickActions')}</h3>
            <p className="text-xs text-neutral-500">Edit global links, bio text translations, CV upload file, or social media handles.</p>
          </div>
          <a
            href="./settings"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-400 hover:text-teal-300 transition-colors mt-6"
          >
            <span>Configure settings</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
}
