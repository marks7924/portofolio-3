'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getTestimonials() {
  try {
    return await db.testimonial.findMany();
  } catch (error) {
    console.error('getTestimonials error:', error);
    return [];
  }
}

export async function upsertTestimonial(data: any) {
  try {
    const { id, ...fields } = data;
    let testimonial;

    if (id) {
      testimonial = await db.testimonial.update({
        where: { id },
        data: fields
      });
    } else {
      testimonial = await db.testimonial.create({
        data: fields
      });
    }

    revalidatePath('/', 'layout');
    return { success: true, testimonial };
  } catch (error: any) {
    console.error('upsertTestimonial error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await db.testimonial.delete({
      where: { id }
    });
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error: any) {
    console.error('deleteTestimonial error:', error);
    return { success: false, error: error.message };
  }
}
