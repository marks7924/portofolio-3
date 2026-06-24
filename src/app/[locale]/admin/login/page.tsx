'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ShieldAlert, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const t = useTranslations('Admin.login');
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setError(t('error'));
      } else {
        router.push(`/${locale}/admin/dashboard`);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-neutral-950 relative p-6">
      {/* Light highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md glass-card rounded-3xl p-8 relative overflow-hidden"
      >
        {/* Back Link */}
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-teal-400 transition-colors mb-6 text-start"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Site</span>
        </a>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-100">{t('title')}</h1>
          <p className="text-xs text-neutral-500 uppercase tracking-widest font-semibold mt-1">
            {t('description')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm font-semibold text-start">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input field */}
          <div className="flex flex-col text-start">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-11 pe-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm transition-colors"
                placeholder="admin@portfolio.com"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col text-start">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-11 pe-4 py-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 focus:border-teal-500 focus:outline-none text-neutral-100 text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Sign In submit button */}
          <div className="pt-2">
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 font-bold transition-all cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{t('submit')}</span>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
