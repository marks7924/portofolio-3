import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getTestimonials } from '@/app/actions/testimonial';
import TestimonialsCMS from './TestimonialsCMS';

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const t = await getTranslations('Admin.testimonials');
  const testimonials = await getTestimonials();

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage client feedback, custom avatar graphics, designations, and translation copies.
        </p>
      </div>

      <TestimonialsCMS initialTestimonials={testimonials} />
    </div>
  );
}
