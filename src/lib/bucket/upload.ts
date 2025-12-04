"use server";

import { Bucket } from "./bucket";

export const uploadToBucket = async (
  bucket: Bucket.Names,
  file: Blob | File | Buffer,
  filename: string,
) => {
  if (!(file && filename && bucket)) return { success: false };
  try {
    const data = await Bucket.set(bucket, file, filename);
    return { success: true, path: data.url };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false };
  }
};

export const getUrl = async (bucket: Bucket.Names, path: string) => {
  return await Bucket.get(bucket, path);
};
