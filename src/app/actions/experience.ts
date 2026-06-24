'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getExperiences() {
  try {
    return await db.experience.findMany({
      orderBy: { startDate: 'desc' }
    });
  } catch (error) {
    console.error('getExperiences error:', error);
    return [];
  }
}

export async function upsertExperience(data: any) {
  try {
    const { id, ...fields } = data;
    let experience;

    if (fields.startDate) {
      fields.startDate = new Date(fields.startDate);
    }
    if (fields.endDate) {
      fields.endDate = new Date(fields.endDate);
    } else {
      fields.endDate = null;
    }
    if (fields.current !== undefined) {
      fields.current = !!fields.current;
      if (fields.current) {
        fields.endDate = null;
      }
    }

    if (id) {
      experience = await db.experience.update({
        where: { id },
        data: fields
      });
    } else {
      experience = await db.experience.create({
        data: fields
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, experience };
  } catch (error: any) {
    console.error('upsertExperience error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteExperience(id: string) {
  try {
    await db.experience.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteExperience error:', error);
    return { success: false, error: error.message };
  }
}
