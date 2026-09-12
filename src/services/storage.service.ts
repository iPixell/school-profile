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
