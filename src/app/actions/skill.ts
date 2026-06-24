'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getSkills() {
  try {
    return await db.skill.findMany({
      orderBy: { percentage: 'desc' }
    });
  } catch (error) {
    console.error('getSkills error:', error);
    return [];
  }
}

export async function upsertSkill(data: any) {
  try {
    const { id, ...fields } = data;
    let skill;

    if (fields.percentage !== undefined) {
      fields.percentage = parseInt(fields.percentage, 10) || 0;
    }

    if (id) {
      skill = await db.skill.update({
        where: { id },
        data: fields
      });
    } else {
      skill = await db.skill.create({
        data: fields
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, skill };
  } catch (error: any) {
    console.error('upsertSkill error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteSkill(id: string) {
  try {
    await db.skill.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteSkill error:', error);
    return { success: false, error: error.message };
  }
}
