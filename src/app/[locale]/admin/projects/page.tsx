import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getProjects } from '@/app/actions/project';
import ProjectsCMS from './ProjectsCMS';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const t = await getTranslations('Admin.projects');
  const projects = await getProjects();

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your portfolio case studies, bilingual fields, cover photos, and gallery images.
        </p>
      </div>

      <ProjectsCMS initialProjects={projects} />
    </div>
  );
}
