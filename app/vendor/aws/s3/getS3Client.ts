import { S3Client } from "@aws-sdk/client-s3";
export function getS3Client() {
  const credentials =
    process.env.S3_ACCESS_KEY == null ||
    process.env.S3_SECRET_ACCESS_KEY == null
      ? null
      : {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        };

  const client = new S3Client({
    region: process.env.S3_REGION,
    ...(credentials != null ? { credentials } : {}),
  });

  return client;
}
