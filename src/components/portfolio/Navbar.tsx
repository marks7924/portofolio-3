'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Globe, Home, User, Briefcase, FileCode2, Phone, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  settings: any;
}

export default function Navbar({ settings }: NavbarProps) {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const rawPathname = usePathname();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll height to add backdrop filter
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('home'), icon: Home },
    { href: '#about', label: t('about'), icon: User },
    { href: '#skills', label: t('skills'), icon: FileCode2 },
    { href: '#projects', label: t('projects'), icon: Briefcase },
    { href: '#experience', label: t('experience'), icon: Briefcase },
    { href: '#contact', label: t('contact'), icon: Phone }
  ];

  // Locale switcher handler
  const handleLocaleChange = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    
    // Pathname looks like /en/about or /ar/about or /en or /ar
    // Replace the locale prefix in the raw pathname
    const segments = rawPathname.split('/');
    if (segments[1] === 'en' || segments[1] === 'ar') {
      segments[1] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  return (
    <>
      {/* 1. Desktop Top Navbar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-950/75 backdrop-blur-md border-b border-neutral-900 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-6 flex items-center justify-between">
          {/* Logo / Title */}
          <a href="#home" className="text-xl font-bold tracking-tight text-neutral-100 hover:text-teal-400 transition-colors">
            {settings?.fullName || 'Mark Developer'}
          </a>

          {/* Center Links (Desktop only) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action block (Desktop only) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={handleLocaleChange}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-850 hover:border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-sm text-neutral-300 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>{locale === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Admin Portal entry */}
            <a
              href={`/${locale}/admin/dashboard`}
              className="inline-flex items-center justify-center p-2.5 rounded-xl border border-neutral-850 bg-neutral-900/50 hover:bg-neutral-900 text-neutral-450 hover:text-teal-400 transition-colors"
              title={t('adminDashboard')}
            >
              <Shield className="w-4.5 h-4.5" />
            </a>
          </div>

          {/* Mobile hamburger icon trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl border border-neutral-850 bg-neutral-900/50 text-neutral-300 hover:text-teal-400 hover:border-neutral-700 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Mobile Floating Bottom Navigation Dock / Drawer */}
      <nav className="fixed bottom-6 inset-x-6 z-50 md:hidden flex justify-center pointer-events-none">
        <div className="glass-card rounded-2xl p-2 flex items-center justify-between gap-1 w-full max-w-sm border border-neutral-800/80 shadow-2xl pointer-events-auto">
          {navLinks.slice(0, 5).map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center flex-1 p-2 rounded-xl text-neutral-450 hover:text-teal-400 active:scale-95 transition-all min-h-[44px] min-w-[44px]"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] mt-1 font-semibold uppercase tracking-wider hidden xs:block">{link.label}</span>
              </a>
            );
          })}
          
          {/* Quick Lang Switcher inside Bottom Dock */}
          <button
            onClick={handleLocaleChange}
            className="flex flex-col items-center justify-center flex-1 p-2 rounded-xl text-neutral-450 hover:text-teal-400 min-h-[44px] min-w-[44px]"
          >
            <Globe className="w-5 h-5" />
            <span className="text-[9px] mt-1 font-semibold uppercase tracking-wider hidden xs:block">
              {locale === 'en' ? 'AR' : 'EN'}
            </span>
          </button>
        </div>
      </nav>

      {/* 3. Mobile Top Menu Slide Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[72px] z-45 md:hidden glass-card border-b border-neutral-900 p-6 flex flex-col gap-6 text-start"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-neutral-300 hover:text-teal-400 py-1"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-900">
              {/* Language Switcher */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLocaleChange();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900 text-sm text-neutral-200"
              >
                <Globe className="w-4.5 h-4.5" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Admin login */}
              <a
                href={`/${locale}/admin/dashboard`}
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-805 bg-neutral-900 text-sm text-neutral-200"
              >
                <Shield className="w-4.5 h-4.5" />
                <span>{t('adminDashboard')}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
