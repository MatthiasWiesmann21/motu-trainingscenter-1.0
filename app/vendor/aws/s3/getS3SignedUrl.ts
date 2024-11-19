import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Duration } from "luxon";

import { getS3Client } from "./getS3Client";

export default async function getS3SignedUrl({
  fileKey,
  duration,
  fileName,
  fileExtension,
}: {
  fileKey: string;
  duration: Duration;
  fileName: string;
  fileExtension: string;
}) {
  const client = getS3Client();

  const metadata = {
    'Content-Disposition': `attachment; filename="${fileName}.${fileExtension}"`,
    'Content-Type': 'text/plain' // Adjust this to the appropriate MIME type
  };

  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ResponseContentDisposition: metadata['Content-Disposition'],
      ResponseContentType: metadata['Content-Type']
    }),
    {
      expiresIn: duration.as("seconds"),
    }
  );
}
