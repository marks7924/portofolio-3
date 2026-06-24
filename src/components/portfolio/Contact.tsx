'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function Contact() {
  const t = useTranslations('Contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Contact schema
  const contactSchema = z.object({
    name: z.string().min(2, { message: t('validation.name') }),
    email: z.string().email({ message: t('validation.email') }),
    message: z.string().min(10, { message: t('validation.message') })
  });

  type ContactInputs = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactInputs>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactInputs) => {
    setStatus('loading');
    try {
      // Simulate API submit latency or email dispatch
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      reset();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="relative w-full py-24 bg-neutral-950" id="contact">
      {/* Visual glowing light bulbs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-6 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-3">
            {t('subtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
            {t('title')}
          </h2>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 text-start relative overflow-hidden">
          {/* Status alerts handler */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 text-teal-400 flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{t('success')}</span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-semibold">{t('error')}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name input */}
              <div className="flex flex-col text-start">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  disabled={status === 'loading'}
                  {...register('name')}
                  className={`px-4 py-3.5 rounded-xl bg-neutral-900/50 border ${
                    errors.name ? 'border-red-500/50' : 'border-neutral-800 hover:border-neutral-700'
                  } focus:border-teal-500 focus:outline-none text-neutral-100 text-sm transition-colors`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <span className="text-xs text-red-500 font-semibold mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email Address input */}
              <div className="flex flex-col text-start">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  disabled={status === 'loading'}
                  {...register('email')}
                  className={`px-4 py-3.5 rounded-xl bg-neutral-900/50 border ${
                    errors.email ? 'border-red-500/50' : 'border-neutral-800 hover:border-neutral-700'
                  } focus:border-teal-500 focus:outline-none text-neutral-100 text-sm transition-colors`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <span className="text-xs text-red-500 font-semibold mt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* Message Area input */}
            <div className="flex flex-col text-start">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                {t('message')}
              </label>
              <textarea
                rows={5}
                disabled={status === 'loading'}
                {...register('message')}
                className={`px-4 py-3.5 rounded-xl bg-neutral-900/50 border ${
                  errors.message ? 'border-red-500/50' : 'border-neutral-800 hover:border-neutral-700'
                } focus:border-teal-500 focus:outline-none text-neutral-100 text-sm transition-colors resize-none`}
                placeholder="Let's build something amazing..."
              />
              {errors.message && (
                <span className="text-xs text-red-500 font-semibold mt-1">
                  {errors.message.message}
                </span>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                type="submit"
                disabled={status === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-neutral-800 text-neutral-950 disabled:text-neutral-600 font-bold transition-all cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t('sending')}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>{t('send')}</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
