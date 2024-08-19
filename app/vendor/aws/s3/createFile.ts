import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getS3Client } from "./getS3Client";

async function createFile(key: string) {
  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  return client.send(command);
}

export default createFile;
