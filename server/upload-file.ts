"use server";

import { Bucket } from "@/lib/bucket";

/**
 * Universal upload action for MinIO
 *
 * @param bucketName - The key from your Bucket.names (e.g., 'avatars-bucket')
 * @param formData - The form data containing the 'file'
 * @param customPath - Optional subfolder path (e.g., 'users/logos/')
 */
export const uploadFile = async (
  bucketName: Bucket.Names,
  formData: FormData,
  customPath?: string
) => {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "No file provided" };
    const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
    const uniqueId = Date.now();
    const filename = customPath ?? `${uniqueId}-${originalName}`;
    const result = await Bucket.set(bucketName, file, filename, file.type);
    if (!result.success) throw new Error(result.error);
    return { success: true, url: result.url, filename: filename, size: file.size };
  } catch (error) {
    console.error("Global Upload Action Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
};
