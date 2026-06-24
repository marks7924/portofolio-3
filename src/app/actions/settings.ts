'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  try {
    let settings = await db.siteSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          id: 'default',
          fullName: 'Mark Developer',
          title_en: 'Senior Full-Stack Architect & Motion Designer',
          title_ar: 'مهندس برمجيات متكامل ومصمم حركي رئيسي',
          bio_en: 'I build premium digital experiences with high visual polish, smooth animations, and scalable enterprise codebases.',
          bio_ar: 'أقوم ببناء تجارب رقمية متميزة بلمسات بصرية راقية، وحركات تفاعلية انسيابية، وبنيات برمجية قابلة للتوسع.',
          email: 'mark@developer.com'
        }
      });
    }

    return settings;
  } catch (error) {
    console.error('getSettings error:', error);
    return null;
  }
}

export async function updateSettings(data: any) {
  try {
    const settings = await db.siteSettings.upsert({
      where: { id: 'default' },
      update: data,
      create: { id: 'default', ...data }
    });

    revalidatePath('/', 'layout');
    return { success: true, settings };
  } catch (error: any) {
    console.error('updateSettings error:', error);
    return { success: false, error: error.message };
  }
}
