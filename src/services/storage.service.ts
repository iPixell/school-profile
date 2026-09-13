import { supabase } from "../config/supabase.js";

const BUCKET_NAME = "school-images";

export const uploadImage = async (
 file: Buffer,
 filePath: string,
 contentType: string,
): Promise<string> => {
 const { error } = await supabase.storage
  .from(BUCKET_NAME)
  .upload(filePath, file, {
   contentType,
   upsert: false,
  });

 if (error) {
  throw error;
 }

 const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

 return data.publicUrl;
};

export const deleteImage = async (filePath: string): Promise<void> => {
 const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

 if (error) {
  throw error;
 }
};

export const getFilePathFromUrl = (publicUrl: string): string => {
 const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

 const index = publicUrl.indexOf(marker);

 if (index === -1) {
  throw new Error("URL gambar Supabase tidak valid");
 }

 return publicUrl.substring(index + marker.length);
};
