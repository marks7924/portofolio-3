'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Github, Linkedin, Facebook, Instagram, Twitter, ArrowUp } from 'lucide-react';

interface FooterProps {
  settings: any;
}

export default function Footer({ settings }: FooterProps) {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navigation');
  const locale = useLocale();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '#home', label: nav('home') },
    { href: '#about', label: nav('about') },
    { href: '#skills', label: nav('skills') },
    { href: '#projects', label: nav('projects') },
    { href: '#experience', label: nav('experience') }
  ];

  return (
    <footer className="w-full bg-neutral-950 py-12 border-t border-neutral-900">
      <div className="max-w-7xl w-full mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 z-10 relative">
        
        {/* Left Side: Branding / Name */}
        <div className="text-center md:text-start">
          <span className="font-bold text-neutral-100 text-lg tracking-tight">
            {settings?.fullName || 'Mark Developer'}
          </span>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            {t('builtWith')}
          </p>
        </div>

        {/* Center: Quick navigation links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-450">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-teal-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side: Social links & scroll-to-top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-neutral-500">
            {settings?.github && (
              <a href={settings.github} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {settings?.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {settings?.x && (
              <a href={settings.x} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Scroll to Top button */}
          <button
            onClick={handleScrollToTop}
            className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-150 hover:border-neutral-700 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="max-w-7xl w-full mx-auto px-6 mt-8 pt-8 border-t border-neutral-900 text-center text-xs text-neutral-600">
        &copy; {new Date().getFullYear()} {settings?.fullName || 'Mark Developer'}. {t('copyright')}
      </div>
    </footer>
  );
}
