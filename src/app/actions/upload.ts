'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    
    // Check if Supabase storage configuration exists
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucketName = process.env.SUPABASE_BUCKET || 'portfolio-assets';

    if (supabaseUrl && supabaseKey) {
      try {
        // Upload to Supabase Storage via REST API
        const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${filename}`;
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: buffer
        });

        if (response.ok) {
          const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filename}`;
          return { success: true, url: publicUrl };
        } else {
          console.warn('Supabase upload failed, falling back to local storage. Status:', response.status);
        }
      } catch (err) {
        console.error('Supabase upload exception, falling back to local:', err);
      }
    }

    // Fallback: Local Storage in public/uploads/
    const publicPath = join(process.cwd(), 'public', 'uploads');
    
    // Ensure directory exists
    await mkdir(publicPath, { recursive: true });
    
    const filePath = join(publicPath, filename);
    await writeFile(filePath, buffer);
    
    const localUrl = `/uploads/${filename}`;
    return { success: true, url: localUrl };

  } catch (error: any) {
    console.error('Upload action error:', error);
    return { success: false, error: error.message };
  }
}
