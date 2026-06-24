import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getSettings } from '@/app/actions/settings';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const t = await getTranslations('Admin.settings');
  const settings = await getSettings();

  return (
    <div className="space-y-8 text-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          {t('title')}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Manage your personal branding, title translations, and document attachments.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
