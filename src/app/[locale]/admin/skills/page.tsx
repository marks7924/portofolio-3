import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getSkills } from '@/app/actions/skill';
import SkillsCMS from './SkillsCMS';

export const dynamic = 'force-dynamic';

export default async function AdminSkillsPage() {
  const t = await getTranslations('Admin.skills');
  const skills = await getSkills();

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your technology metrics, categorizations, proficiency bars, and dashboard metrics.
        </p>
      </div>

      <SkillsCMS initialSkills={skills} />
    </div>
  );
}
