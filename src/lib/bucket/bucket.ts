import { Client } from "minio";

export namespace Bucket {
  export const connection = {
    endPoint: process.env.S3_ENDPOINT as string,
    port: Number(process.env.S3_PORT as string),
    accessKey: process.env.S3_ROOT_USER as string,
    secretKey: process.env.S3_ROOT_PASSWORD as string,
    useSSL: false,
  };

  export const client = new Client(connection);

  export const names = {
    "avatars-bucket": true, // isPublic
  } as const satisfies Record<string, boolean>;

  export const exists = async (bucket: string, throwing: boolean = true) => {
    const ex = bucket in Bucket.names;
    if (!ex && throwing) throw new Error(`Invalid bucket name: ${bucket}`);
    return await client.bucketExists(bucket);
  };

  export type Names = keyof typeof names;

  export const create = async (bucket: Names) => {
    if (await client.bucketExists(bucket)) return;
    await client.makeBucket(bucket, "us-east-1");
    if (names[bucket]) {
      await client.setBucketPolicy(
        bucket,
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: "*",
              Action: ["s3:GetObject"],
              Resource: [`arn:aws:s3:::${bucket}/*`],
            },
          ],
        }),
      );
    }
  };

  export const get = async (bucket: Names, object: string) => {
    try {
      return names[bucket]
        ? `http://${connection.endPoint}:${connection.port}/${bucket}/${object}`
        : await client.presignedGetObject(bucket, object, 86400);
    } catch (err) {
      console.error("Error generating URL:", err);
      return undefined;
    }
  };

  export const set = async (
    bucket: Names,
    file: Buffer | File | Blob,
    filename: string,
  ) => {
    try {
      let bufferData: Buffer;
      if (file instanceof Buffer) {
        bufferData = file;
      } else {
        const arrayBuffer =
          "arrayBuffer" in file ? await file.arrayBuffer() : file;
        bufferData = Buffer.from(arrayBuffer as ArrayBuffer);
      }
      await client.putObject(bucket, filename, bufferData);
      const fileUrl = await get(bucket, filename);
      return {
        success: true,
        url: fileUrl,
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error occurred",
      };
    }
  };
}
