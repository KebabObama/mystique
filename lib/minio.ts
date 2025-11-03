import { Client } from "minio";

export const BUCKETS = { AVATARS: "avatars-bucket" };

export const minio = new Client({
	endPoint: process.env.S3_ENDPOINT || "localhost",
	port: Number.parseInt(process.env.S3_PORT as string, 10),
	useSSL: false,
	accessKey: process.env.S3_ROOT_USER as string,
	secretKey: process.env.S3_ROOT_PASSWORD as string,
});

export const createBucket = async (
	bucketName: string,
	isPrivate: boolean = true,
) => {
	if (!(await minio.bucketExists(bucketName))) {
		await minio.makeBucket(bucketName, "eu-east-01");
		if (!isPrivate) {
			const policy = {
				Version: "2012-10-17",
				Statement: [
					{
						Effect: "Allow",
						Principal: { AWS: ["*"] },
						Action: ["s3:GetObject"],
						Resource: [`arn:aws:s3:::${bucketName}/*`],
					},
				],
			};
			await minio.setBucketPolicy(bucketName, JSON.stringify(policy));
		}
	}
};

export const getUrl = async (
	bucket: string,
	object: string,
	isPrivate: boolean = true,
) => {
	try {
		if (!isPrivate)
			return `http://${process.env.S3_ENDPOINT}:${process.env.S3_PORT}/${bucket}/${object}`;
		return await minio.presignedGetObject(bucket, object);
	} catch (err) {
		console.error("Error generating signed URL:", err);
		return null;
	}
};
