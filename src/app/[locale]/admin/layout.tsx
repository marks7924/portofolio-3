'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileCode2, 
  History, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Globe, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Admin.sidebar');
  const locale = useLocale();
  const router = useRouter();
  const rawPathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { href: `/${locale}/admin/dashboard`, label: t('dashboard'), icon: LayoutDashboard },
    { href: `/${locale}/admin/projects`, label: t('projects'), icon: Briefcase },
    { href: `/${locale}/admin/skills`, label: t('skills'), icon: FileCode2 },
    { href: `/${locale}/admin/experience`, label: t('experience'), icon: History },
    { href: `/${locale}/admin/testimonials`, label: t('testimonials'), icon: MessageSquare },
    { href: `/${locale}/admin/settings`, label: t('settings'), icon: Settings }
  ];

  const handleLocaleChange = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    const segments = rawPathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <div className="w-full min-h-screen flex bg-neutral-950 text-neutral-100">
      
      {/* 1. Sidebar (Desktop only) */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-e border-neutral-900 min-h-screen p-6 flex-shrink-0 text-start">
        <div className="mb-10 flex items-center justify-between">
          <span className="font-bold text-neutral-100 text-lg tracking-tight">
            Admin CMS
          </span>
        </div>

        {/* Links list */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = rawPathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500 text-neutral-950 font-bold shadow-lg shadow-teal-500/10'
                    : 'text-neutral-450 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="pt-6 border-t border-neutral-900 space-y-2">
          {/* Public website entry */}
          <a
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-350 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{t('backToSite')}</span>
          </a>

          {/* Lang toggle */}
          <button
            onClick={handleLocaleChange}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-500 hover:text-teal-400 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{locale === 'en' ? 'العربية (RTL)' : 'English (LTR)'}</span>
          </button>

          {/* Sign Out trigger */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-950/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header top bar */}
        <header className="lg:hidden w-full bg-neutral-950 border-b border-neutral-900 px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-neutral-100 text-lg">Admin CMS</span>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2.5 rounded-xl border border-neutral-850 bg-neutral-900/50 text-neutral-300 hover:text-teal-400 hover:border-neutral-700 transition-all"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Drawer Slide overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: locale === 'ar' ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: locale === 'ar' ? 100 : -100 }}
              className="fixed inset-y-0 start-0 z-45 w-64 glass-panel p-6 flex flex-col text-start lg:hidden"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="font-bold text-neutral-100 text-lg">Admin CMS</span>
                <button onClick={() => setMobileOpen(false)} className="text-neutral-500 hover:text-teal-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = rawPathname === item.href;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-teal-500 text-neutral-950 font-bold shadow-lg shadow-teal-500/10'
                          : 'text-neutral-450 hover:text-neutral-200 hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-neutral-900 space-y-2">
                <a
                  href={`/${locale}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-500"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('backToSite')}</span>
                </a>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLocaleChange();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-500"
                >
                  <Globe className="w-4 h-4" />
                  <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-500 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content viewport slot */}
        <main className="flex-1 p-6 sm:p-10 relative overflow-x-hidden">
          {children}
        </main>
      </div>

    </div>
  );
}
