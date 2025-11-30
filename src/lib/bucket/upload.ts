"use server";

import { Bucket } from "./bucket";

export const uploadToBucket = async (formData: FormData) => {
  const bucket = formData.get("bucket") as string;
  const file = formData.get("file") as File;
  const filename = formData.get("filename") as string;
  const exists = await Bucket.exists(bucket);
  if (!file || !filename || !bucket || !exists) return { success: false };
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  try {
    await Bucket.set(bucket as Bucket.Names, buffer, filename);
    return { success: true };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
};

export const getUrl = async (path: string) => {
  return await Bucket.get("avatars-bucket", path);
};
