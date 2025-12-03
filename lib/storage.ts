import { supabase } from "./supabaseClient";

export async function uploadImage(
  file: File,
  bucket: string,
  folder: string
): Promise<string> {
  const filename = `${folder}/${Date.now()}_${file.name}`;
  const { error, data } = await supabase.storage
    .from(bucket)
    .upload(filename, file);
  if (error) throw new Error(error.message);

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filename);
  return publicUrlData.publicUrl;
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(error.message);
}
