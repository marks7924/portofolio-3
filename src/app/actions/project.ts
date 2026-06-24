'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
  try {
    return await db.project.findMany({
      orderBy: { sequenceNumber: 'asc' }
    });
  } catch (error) {
    console.error('getProjects error:', error);
    return [];
  }
}

export async function getProject(id: string) {
  try {
    return await db.project.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('getProject error:', error);
    return null;
  }
}

export async function upsertProject(data: any) {
  try {
    const { id, ...fields } = data;
    let project;

    if (fields.sequenceNumber !== undefined) {
      fields.sequenceNumber = parseInt(fields.sequenceNumber, 10) || 0;
    }
    
    if (fields.featured !== undefined) {
      fields.featured = !!fields.featured;
    }

    if (id) {
      project = await db.project.update({
        where: { id },
        data: fields
      });
    } else {
      project = await db.project.create({
        data: fields
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, project };
  } catch (error: any) {
    console.error('upsertProject error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteProject error:', error);
    return { success: false, error: error.message };
  }
}
