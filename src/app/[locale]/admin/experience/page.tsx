import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getExperiences } from '@/app/actions/experience';
import ExperienceCMS from './ExperienceCMS';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencePage() {
  const t = await getTranslations('Admin.experience');
  const experiences = await getExperiences();

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your career events, company details, roles, parallel translation bios, and timeline ranges.
        </p>
      </div>

      <ExperienceCMS initialExperiences={experiences} />
    </div>
  );
}
