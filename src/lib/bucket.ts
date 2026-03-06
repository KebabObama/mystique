"use server";

import { lookup } from "mime-types";
import { Client } from "minio";

namespace Bucket {
  export type Names = keyof typeof names;
  export const connection = {
    endPoint: process.env.S3_ENDPOINT || "localhost",
    port: Number(process.env.S3_PORT) || 9000,
    accessKey: process.env.S3_ROOT_USER as string,
    secretKey: process.env.S3_ROOT_PASSWORD as string,
    useSSL: process.env.S3_USE_SSL === "true",
  };

  export const client = new Client(connection);

  export const names = {
    "avatars-bucket": true,
    "documents-private": false,
  } as const satisfies Record<string, boolean>;

  export const bootstrap = async (bucket: Names) => {
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket, "us-east-1");
      if (names[bucket]) {
        const policy = {
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: { AWS: ["*"] },
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        };
        await client.setBucketPolicy(bucket, JSON.stringify(policy));
      }
    }
  };

  export const get = async (bucket: Names, objectName: string, expirySeconds = 86400) => {
    try {
      if (names[bucket]) {
        const protocol = connection.useSSL ? "https" : "http";
        return `${protocol}://${connection.endPoint}:${connection.port}/${bucket}/${objectName}`;
      }
      return await client.presignedGetObject(bucket, objectName, expirySeconds);
    } catch (err) {
      console.error("[BUCKET GET ERROR]:", err);
      return undefined;
    }
  };

  export const set = async (
    bucket: Names,
    file: Buffer | File | Blob,
    filename: string,
    contentType?: string
  ) => {
    try {
      await bootstrap(bucket);
      let buffer: Buffer;
      if (Buffer.isBuffer(file)) {
        buffer = file;
      } else {
        const ab = await file.arrayBuffer();
        buffer = Buffer.from(ab);
      }
      const mimeType = contentType || lookup(filename) || "application/octet-stream";
      const metaData = { "Content-Type": mimeType };
      await client.putObject(bucket, filename, buffer, buffer.length, metaData);
      const url = await get(bucket, filename);
      return { success: true, url, filename, mimeType };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
    }
  };

  export const remove = async (bucket: Names, filename: string) => {
    try {
      await client.removeObject(bucket, filename);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Delete failed" };
    }
  };

  export const list = async (bucket: Names, prefix: string = "") => {
    return new Promise((resolve, reject) => {
      const objectsList: any[] = [];
      const stream = client.listObjectsV2(bucket, prefix, true);
      stream.on("data", (obj) => objectsList.push(obj));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(objectsList));
    });
  };
}

export default Bucket;

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
